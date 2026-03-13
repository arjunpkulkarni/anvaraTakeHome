import { Router, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { requireAuth, type AuthRequest } from '../auth.js';

const router: IRouter = Router();

// GET /api/ad-slots - List ad slots (public for marketplace, filtered for publishers)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { publisherId, type, available } = req.query;

    // If authenticated as publisher, only show their ad slots
    interface AdSlotFilters {
      publisherId?: string;
      type?: 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
      isAvailable?: boolean;
    }

    const filters: AdSlotFilters = {};

    if (req.user?.publisherId) {
      filters.publisherId = req.user.publisherId;
    } else if (publisherId) {
      filters.publisherId = getParam(publisherId);
    }

    if (type) {
      filters.type = type as string as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
    }

    if (available === 'true') {
      filters.isAvailable = true;
    }

    const adSlots = await prisma.adSlot.findMany({
      where: filters,
      include: {
        publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
        _count: { select: { placements: true } },
      },
      orderBy: { basePrice: 'desc' },
    });

    res.json(adSlots);
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    res.status(500).json({ error: 'Failed to fetch ad slots' });
  }
});

// GET /api/ad-slots/:id - Get single ad slot (public)
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: {
        publisher: true,
        placements: {
          include: {
            campaign: { select: { id: true, name: true, status: true } },
          },
        },
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    res.json(adSlot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    res.status(500).json({ error: 'Failed to fetch ad slot' });
  }
});

// POST /api/ad-slots - Create new ad slot (protected)
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.publisherId) {
      res.status(403).json({ error: 'Only publishers can create ad slots' });
      return;
    }

    const { name, description, type, basePrice } = req.body;

    if (!name || !type || !basePrice) {
      res.status(400).json({
        error: 'Name, type, and basePrice are required',
      });
      return;
    }

    if (basePrice <= 0) {
      res.status(400).json({ error: 'Base price must be positive' });
      return;
    }

    const validTypes = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid ad slot type' });
      return;
    }

    // Use the authenticated user's publisherId
    const adSlot = await prisma.adSlot.create({
      data: {
        name,
        description,
        type,
        basePrice,
        publisherId: req.user.publisherId,
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(adSlot);
  } catch (error) {
    console.error('Error creating ad slot:', error);
    res.status(500).json({ error: 'Failed to create ad slot' });
  }
});

// POST /api/ad-slots/:id/book - Book an ad slot and create campaign
router.post('/:id/book', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can book ad slots' });
      return;
    }

    const id = getParam(req.params.id);
    const { message } = req.body;

    // Check if slot exists and is available
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (!adSlot.isAvailable) {
      res.status(400).json({ error: 'Ad slot is no longer available' });
      return;
    }

    // Create campaign, creative, and placement in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create campaign
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Default 1 month campaign

      const campaign = await tx.campaign.create({
        data: {
          name: `${adSlot.name} Campaign`,
          description: message || `Campaign for ${adSlot.name}`,
          budget: adSlot.basePrice,
          spent: 0,
          startDate,
          endDate,
          targetCategories: [],
          targetRegions: [],
          status: 'PENDING_REVIEW',
          sponsorId: req.user!.sponsorId!,
        },
      });

      // 2. Create creative (placeholder)
      const creative = await tx.creative.create({
        data: {
          name: `${adSlot.name} Creative`,
          type: adSlot.type === 'PODCAST' ? 'PODCAST_READ' : 
                adSlot.type === 'VIDEO' ? 'VIDEO' : 
                adSlot.type === 'NEWSLETTER' ? 'SPONSORED_POST' : 'NATIVE',
          assetUrl: 'https://placeholder.com/creative',
          clickUrl: 'https://example.com',
          altText: `Creative for ${adSlot.name}`,
          isApproved: false,
          campaignId: campaign.id,
        },
      });

      // 3. Create placement
      const placement = await tx.placement.create({
        data: {
          campaignId: campaign.id,
          creativeId: creative.id,
          adSlotId: adSlot.id,
          publisherId: adSlot.publisherId,
          agreedPrice: adSlot.basePrice,
          pricingModel: 'FLAT_RATE',
          startDate,
          endDate,
          status: 'PENDING',
        },
      });

      // 4. Mark slot as unavailable
      const updatedSlot = await tx.adSlot.update({
        where: { id },
        data: { isAvailable: false },
        include: {
          publisher: { select: { id: true, name: true } },
        },
      });

      return { campaign, placement, updatedSlot };
    });

    console.log(`Ad slot ${id} booked by sponsor ${req.user.sponsorId}. Campaign created: ${result.campaign.id}`);

    res.json({
      success: true,
      message: 'Ad slot booked successfully! Campaign created.',
      adSlot: result.updatedSlot,
      campaign: result.campaign,
      placement: result.placement,
    });
  } catch (error) {
    console.error('Error booking ad slot:', error);
    res.status(500).json({ error: 'Failed to book ad slot' });
  }
});

// POST /api/ad-slots/:id/unbook - Reset ad slot to available (for testing)
router.post('/:id/unbook', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.publisherId) {
      res.status(403).json({ error: 'Only publishers can unbook ad slots' });
      return;
    }

    const id = getParam(req.params.id);

    // Verify ownership
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      select: { publisherId: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (adSlot.publisherId !== req.user.publisherId) {
      res.status(403).json({ error: 'Forbidden - You do not own this ad slot' });
      return;
    }

    // Delete associated placements, creatives, and campaigns in a transaction
    await prisma.$transaction(async (tx) => {
      // Find all placements for this ad slot
      const placements = await tx.placement.findMany({
        where: { adSlotId: id },
        include: { campaign: true, creative: true },
      });

      // Delete placements, creatives, and campaigns
      for (const placement of placements) {
        await tx.placement.delete({ where: { id: placement.id } });
        await tx.creative.delete({ where: { id: placement.creativeId } });
        await tx.campaign.delete({ where: { id: placement.campaignId } });
      }

      // Mark slot as available
      await tx.adSlot.update({
        where: { id },
        data: { isAvailable: true },
      });
    });

    const updatedSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Ad slot is now available again',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error unbooking ad slot:', error);
    res.status(500).json({ error: 'Failed to unbook ad slot' });
  }
});

// PUT /api/ad-slots/:id - Update ad slot (protected)
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.publisherId) {
      res.status(403).json({ error: 'Only publishers can update ad slots' });
      return;
    }

    const id = getParam(req.params.id);

    // Check if ad slot exists and verify ownership
    const existingAdSlot = await prisma.adSlot.findUnique({
      where: { id },
      select: { publisherId: true },
    });

    if (!existingAdSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (existingAdSlot.publisherId !== req.user.publisherId) {
      res.status(403).json({ error: 'Forbidden - You do not own this ad slot' });
      return;
    }

    const { name, description, type, basePrice, isAvailable } = req.body;

    // Validate type if provided
    if (type) {
      const validTypes = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'];
      if (!validTypes.includes(type)) {
        res.status(400).json({ error: 'Invalid ad slot type' });
        return;
      }
    }

    // Validate base price if provided
    if (basePrice !== undefined && basePrice <= 0) {
      res.status(400).json({ error: 'Base price must be positive' });
      return;
    }

    // Build update data object (only include provided fields)
    interface AdSlotUpdateData {
      name?: string;
      description?: string | null;
      type?: 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';
      basePrice?: number;
      isAvailable?: boolean;
    }

    const updateData: AdSlotUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (basePrice !== undefined) updateData.basePrice = basePrice;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    const adSlot = await prisma.adSlot.update({
      where: { id },
      data: updateData,
      include: {
        publisher: { select: { id: true, name: true } },
        _count: { select: { placements: true } },
      },
    });

    res.json(adSlot);
  } catch (error) {
    console.error('Error updating ad slot:', error);
    res.status(500).json({ error: 'Failed to update ad slot' });
  }
});

// DELETE /api/ad-slots/:id - Delete ad slot (protected)
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.publisherId) {
      res.status(403).json({ error: 'Only publishers can delete ad slots' });
      return;
    }

    const id = getParam(req.params.id);

    // Check if ad slot exists and verify ownership
    const existingAdSlot = await prisma.adSlot.findUnique({
      where: { id },
      select: { publisherId: true },
    });

    if (!existingAdSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (existingAdSlot.publisherId !== req.user.publisherId) {
      res.status(403).json({ error: 'Forbidden - You do not own this ad slot' });
      return;
    }

    // Delete the ad slot (cascading deletes will handle related records)
    await prisma.adSlot.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ad slot:', error);
    res.status(500).json({ error: 'Failed to delete ad slot' });
  }
});

export default router;
