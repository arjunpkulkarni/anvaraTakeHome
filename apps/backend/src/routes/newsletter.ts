import { Router, type Request, type Response, type IRouter } from 'express';

const router: IRouter = Router();

// POST /api/newsletter/subscribe - Subscribe to newsletter
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, placement } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required',
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address',
      });
    }

    // Check for common disposable email domains (optional extra validation)
    const disposableDomains = ['tempmail', 'throwaway', '10minutemail', 'guerrillamail'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.some(d => domain?.includes(d))) {
      return res.status(400).json({
        success: false,
        error: 'Please use a permanent email address',
      });
    }

    // Log the subscription (in a real app, you'd save to database or send to email service)
    console.log(`[Newsletter] New subscription: ${email} from ${placement || 'unknown'}`);

    // Simulate a slight delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation, you would:
    // 1. Check if email already exists in database
    // 2. Save email to newsletter subscribers table
    // 3. Send welcome email via service like SendGrid/Mailchimp
    // 4. Track conversion metrics
    
    // For now, just return success
    res.status(200).json({
      success: true,
      message: "Thanks for subscribing! We'll keep you updated on new opportunities.",
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.',
    });
  }
});

export default router;
