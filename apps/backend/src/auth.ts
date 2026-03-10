import { type Request, type Response, type NextFunction } from 'express';
import { auth } from './lib/auth.js';
import { prisma } from './db.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'SPONSOR' | 'PUBLISHER';
    sponsorId?: string;
    publisherId?: string;
  };
}

/**
 * Authentication middleware that validates session and attaches user info to request
 */
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract session from request headers/cookies
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session?.user) {
      res.status(401).json({ error: 'Unauthorized - No valid session' });
      return;
    }

    // Look up user's role (sponsor or publisher)
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    const publisher = await prisma.publisher.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    // Determine role and attach to request
    if (sponsor) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: 'SPONSOR',
        sponsorId: sponsor.id,
      };
    } else if (publisher) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: 'PUBLISHER',
        publisherId: publisher.id,
      };
    } else {
      res.status(403).json({ error: 'Forbidden - No role assigned' });
      return;
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid session' });
  }
}

export function roleMiddleware(allowedRoles: Array<'SPONSOR' | 'PUBLISHER'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
