import { Router, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { requireAuth, type AuthRequest } from '../auth.js';

const router: IRouter = Router();

// GET /api/campaigns - List user's campaigns (protected)
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can access campaigns' });
      return;
    }

    const { status } = req.query;

    // Only return campaigns belonging to the authenticated user's sponsor
    const campaigns = await prisma.campaign.findMany({
      where: {
        sponsorId: req.user.sponsorId,
        ...(status && { status: status as 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' }),
      },
      include: {
        sponsor: { select: { id: true, name: true, logo: true } },
        _count: { select: { creatives: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// GET /api/campaigns/:id - Get single campaign (protected)
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can access campaigns' });
      return;
    }

    const id = getParam(req.params.id);
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        sponsor: true,
        creatives: true,
        placements: {
          include: {
            adSlot: true,
            publisher: { select: { id: true, name: true, category: true } },
          },
        },
      },
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    // Verify ownership
    if (campaign.sponsorId !== req.user.sponsorId) {
      res.status(403).json({ error: 'Forbidden - You do not own this campaign' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// POST /api/campaigns - Create new campaign (protected)
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can create campaigns' });
      return;
    }

    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
    } = req.body;

    if (!name || !budget || !startDate || !endDate) {
      res.status(400).json({
        error: 'Name, budget, startDate, and endDate are required',
      });
      return;
    }

    // Use the authenticated user's sponsorId
    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCategories: targetCategories || [],
        targetRegions: targetRegions || [],
        sponsorId: req.user.sponsorId,
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// PUT /api/campaigns/:id - Update campaign (protected)
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can update campaigns' });
      return;
    }

    const id = getParam(req.params.id);

    // Check if campaign exists and verify ownership
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
      select: { sponsorId: true },
    });

    if (!existingCampaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    if (existingCampaign.sponsorId !== req.user.sponsorId) {
      res.status(403).json({ error: 'Forbidden - You do not own this campaign' });
      return;
    }

    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
      status,
    } = req.body;

    // Validate status if provided
    const validStatuses = ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    // Validate budget if provided
    if (budget !== undefined && budget <= 0) {
      res.status(400).json({ error: 'Budget must be positive' });
      return;
    }

    // Build update data object (only include provided fields)
    interface CampaignUpdateData {
      name?: string;
      description?: string | null;
      budget?: number;
      cpmRate?: number | null;
      cpcRate?: number | null;
      startDate?: Date;
      endDate?: Date;
      targetCategories?: string[];
      targetRegions?: string[];
      status?: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
    }

    const updateData: CampaignUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (budget !== undefined) updateData.budget = budget;
    if (cpmRate !== undefined) updateData.cpmRate = cpmRate;
    if (cpcRate !== undefined) updateData.cpcRate = cpcRate;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (targetCategories !== undefined) updateData.targetCategories = targetCategories;
    if (targetRegions !== undefined) updateData.targetRegions = targetRegions;
    if (status !== undefined) updateData.status = status;

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: {
        sponsor: { select: { id: true, name: true } },
        _count: { select: { creatives: true, placements: true } },
      },
    });

    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can delete campaigns' });
      return;
    }

    const id = getParam(req.params.id);

    // Check if campaign exists and verify ownership
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
      select: { sponsorId: true },
    });

    if (!existingCampaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    if (existingCampaign.sponsorId !== req.user.sponsorId) {
      res.status(403).json({ error: 'Forbidden - You do not own this campaign' });
      return;
    }

    // Delete the campaign (cascading deletes will handle related records)
    await prisma.campaign.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

export default router;
