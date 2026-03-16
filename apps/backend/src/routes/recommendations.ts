import { Router, type Response, type IRouter } from 'express';
import { getParam } from '../utils/helpers.js';
import { requireAuth, type AuthRequest } from '../auth.js';
import { getRecommendations } from '../services/recommendationService.js';

const router: IRouter = Router();

// GET /api/campaigns/:id/recommendations
// Returns top 5 recommended ad slots for a campaign owned by the authenticated sponsor.
router.get('/:id/recommendations', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can access recommendations' });
      return;
    }

    const id = getParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid campaign id' });
      return;
    }

    const result = await getRecommendations(id, req.user.sponsorId);

    if (!result) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

export default router;
