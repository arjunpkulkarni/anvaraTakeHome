import { Router, type Request, type Response, type IRouter } from 'express';
import { randomBytes } from 'crypto';

const router: IRouter = Router();

// POST /api/quotes/request - Request a custom quote
router.post('/request', async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      email,
      phone,
      budget,
      timeline,
      goals,
      specialRequirements,
      adSlotId,
      adSlotName,
      publisherName,
      listingPrice,
    } = req.body;

    // Validate required fields
    if (!companyName || !email || !goals || !adSlotId) {
      return res.status(400).json({
        success: false,
        error: 'Company name, email, campaign goals, and listing selection are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address',
      });
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(phone) || phone.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid phone number',
        });
      }
    }

    // Generate unique quote ID
    const quoteId = `QT-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`;

    // Log the quote request (in real app, save to database)
    console.log(`\n[Quote Request] ${quoteId}`);
    console.log(`  Company: ${companyName}`);
    console.log(`  Email: ${email}`);
    console.log(`  Phone: ${phone || 'Not provided'}`);
    console.log(`  Ad Slot: ${adSlotName} (${adSlotId})`);
    console.log(`  Publisher: ${publisherName || 'Unknown'}`);
    console.log(`  Listing Price: $${listingPrice}`);
    console.log(`  Budget Range: ${budget || 'Not specified'}`);
    console.log(`  Timeline: ${timeline || 'Not specified'}`);
    console.log(`  Goals: ${goals.substring(0, 100)}...`);
    console.log(`  Special Requirements: ${specialRequirements || 'None'}`);
    console.log(`  Submitted: ${new Date().toISOString()}\n`);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In a real implementation, you would:
    // 1. Save quote request to database with status 'PENDING'
    // 2. Send email notification to publisher
    // 3. Send confirmation email to requestor
    // 4. Create a follow-up task/reminder
    // 5. Track quote request in analytics
    // 6. Potentially integrate with CRM

    res.status(200).json({
      success: true,
      quoteId,
      message: 'Quote request submitted successfully',
      estimatedResponseTime: '24 hours',
    });
  } catch (error) {
    console.error('Quote request error:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.',
    });
  }
});

// GET /api/quotes/:quoteId - Get quote status (bonus endpoint)
router.get('/:quoteId', async (req: Request, res: Response) => {
  try {
    const { quoteId } = req.params;

    // In real app, fetch from database
    // For now, return mock data
    res.status(200).json({
      quoteId,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      estimatedResponseTime: '24 hours',
      message: 'Your quote request is being reviewed by the publisher',
    });
  } catch (error) {
    console.error('Quote lookup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve quote status',
    });
  }
});

export default router;
