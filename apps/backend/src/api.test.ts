import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index.js';
import { prisma } from './db.js';

// Test data
let testSponsorId: string;
let testPublisherId: string;
let testAdSlotId: string;
let testCampaignId: string;
let testCreativeId: string;

describe('API Tests', () => {
  // Setup: Create test data before all tests
  beforeAll(async () => {
    // Clean up any existing test data first
    await prisma.placement.deleteMany({
      where: {
        OR: [
          { campaign: { sponsor: { email: 'sponsor@test.com' } } },
          { publisher: { email: 'publisher@test.com' } },
        ],
      },
    });
    await prisma.creative.deleteMany({
      where: { campaign: { sponsor: { email: 'sponsor@test.com' } } },
    });
    await prisma.campaign.deleteMany({
      where: { sponsor: { email: 'sponsor@test.com' } },
    });
    await prisma.adSlot.deleteMany({
      where: { publisher: { email: 'publisher@test.com' } },
    });
    await prisma.publisher.deleteMany({
      where: { email: 'publisher@test.com' },
    });
    await prisma.sponsor.deleteMany({
      where: { email: 'sponsor@test.com' },
    });

    // Create a test sponsor
    const sponsor = await prisma.sponsor.create({
      data: {
        name: 'Test Sponsor',
        email: 'sponsor@test.com',
        website: 'https://testsponsor.com',
        description: 'Test sponsor description',
        industry: 'Technology',
      },
    });
    testSponsorId = sponsor.id;

    // Create a test publisher
    const publisher = await prisma.publisher.create({
      data: {
        name: 'Test Publisher',
        email: 'publisher@test.com',
        website: 'https://testpublisher.com',
        bio: 'Test publisher bio',
      },
    });
    testPublisherId = publisher.id;

    // Create a test ad slot
    const adSlot = await prisma.adSlot.create({
      data: {
        name: 'Test Ad Slot',
        description: 'Test ad slot description',
        basePrice: 1000,
        publisherId: testPublisherId,
        type: 'DISPLAY',
      },
    });
    testAdSlotId = adSlot.id;

    // Create a test campaign
    const campaign = await prisma.campaign.create({
      data: {
        name: 'Test Campaign',
        sponsorId: testSponsorId,
        budget: 5000,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'ACTIVE',
      },
    });
    testCampaignId = campaign.id;

    // Create a test creative
    const creative = await prisma.creative.create({
      data: {
        name: 'Test Creative',
        type: 'BANNER',
        assetUrl: 'https://test.com/image.jpg',
        clickUrl: 'https://test.com',
        campaignId: testCampaignId,
      },
    });
    testCreativeId = creative.id;
  });

  // Cleanup: Remove test data after all tests
  afterAll(async () => {
    await prisma.placement.deleteMany({ where: { campaignId: testCampaignId } });
    await prisma.creative.deleteMany({ where: { id: testCreativeId } });
    await prisma.campaign.deleteMany({ where: { id: testCampaignId } });
    await prisma.adSlot.deleteMany({ where: { id: testAdSlotId } });
    await prisma.publisher.deleteMany({ where: { id: testPublisherId } });
    await prisma.sponsor.deleteMany({ where: { id: testSponsorId } });
    await prisma.$disconnect();
  });

  describe('GET /api/health', () => {
    it('returns health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('Sponsors API', () => {
    describe('GET /api/sponsors', () => {
      it('returns an array of sponsors', async () => {
        const response = await request(app).get('/api/sponsors');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      it('sponsors have required fields', async () => {
        const response = await request(app).get('/api/sponsors');
        expect(response.status).toBe(200);
        const sponsor = response.body[0];
        expect(sponsor).toHaveProperty('id');
        expect(sponsor).toHaveProperty('name');
        expect(sponsor).toHaveProperty('email');
      });
    });

    describe('GET /api/sponsors/:id', () => {
      it('returns a single sponsor by ID', async () => {
        const response = await request(app).get(`/api/sponsors/${testSponsorId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testSponsorId);
        expect(response.body.name).toBe('Test Sponsor');
      });

      it('returns 404 for non-existent sponsor', async () => {
        const response = await request(app).get('/api/sponsors/non-existent-id');
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
      });
    });

    describe('POST /api/sponsors', () => {
      it('creates a new sponsor', async () => {
        const newSponsor = {
          name: 'New Test Sponsor',
          email: 'newsponsor@test.com',
          website: 'https://newsponsor.com',
          description: 'New sponsor description',
          industry: 'Finance',
        };
        const response = await request(app).post('/api/sponsors').send(newSponsor);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newSponsor.name);
        expect(response.body.email).toBe(newSponsor.email);

        // Cleanup
        await prisma.sponsor.delete({ where: { id: response.body.id } });
      });

      it('returns 400 for missing required fields', async () => {
        const response = await request(app).post('/api/sponsors').send({
          website: 'https://test.com',
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });

    describe('PUT /api/sponsors/:id', () => {
      it('updates an existing sponsor', async () => {
        const updatedData = {
          name: 'Updated Test Sponsor',
          industry: 'Healthcare',
        };
        const response = await request(app).put(`/api/sponsors/${testSponsorId}`).send(updatedData);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.industry).toBe(updatedData.industry);
      });

      it('returns 404 for non-existent sponsor', async () => {
        const response = await request(app)
          .put('/api/sponsors/non-existent-id')
          .send({ name: 'Test' });
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe('Publishers API', () => {
    describe('GET /api/publishers', () => {
      it('returns an array of publishers', async () => {
        const response = await request(app).get('/api/publishers');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
    });

    describe('GET /api/publishers/:id', () => {
      it('returns a single publisher by ID', async () => {
        const response = await request(app).get(`/api/publishers/${testPublisherId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testPublisherId);
        expect(response.body.name).toBe('Test Publisher');
      });

      it('returns 404 for non-existent publisher', async () => {
        const response = await request(app).get('/api/publishers/non-existent-id');
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe('Ad Slots API', () => {
    describe('GET /api/ad-slots', () => {
      it('returns an array of ad slots', async () => {
        const response = await request(app).get('/api/ad-slots');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      it('ad slots have required fields', async () => {
        const response = await request(app).get('/api/ad-slots');
        expect(response.status).toBe(200);
        const adSlot = response.body[0];
        expect(adSlot).toHaveProperty('id');
        expect(adSlot).toHaveProperty('name');
        expect(adSlot).toHaveProperty('basePrice');
      });
    });

    describe('GET /api/ad-slots/:id', () => {
      it('returns a single ad slot by ID', async () => {
        const response = await request(app).get(`/api/ad-slots/${testAdSlotId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testAdSlotId);
        expect(response.body.name).toBe('Test Ad Slot');
      });

      it('returns 404 for non-existent ad slot', async () => {
        const response = await request(app).get('/api/ad-slots/non-existent-id');
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
      });
    });

    // Note: POST /api/ad-slots requires authentication
    describe('POST /api/ad-slots', () => {
      it.skip('creates a new ad slot (requires auth)', async () => {
        const newAdSlot = {
          name: 'New Test Ad Slot',
          description: 'New ad slot description',
          basePrice: 2000,
          publisherId: testPublisherId,
          type: 'VIDEO',
        };
        const response = await request(app).post('/api/ad-slots').send(newAdSlot);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newAdSlot.name);
        expect(Number(response.body.basePrice)).toBe(newAdSlot.basePrice);

        // Cleanup
        await prisma.adSlot.delete({ where: { id: response.body.id } });
      });

      it('returns 401 for missing authentication', async () => {
        const response = await request(app).post('/api/ad-slots').send({
          name: 'Test',
        });
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe('Campaigns API', () => {
    // Note: All campaign endpoints require authentication
    describe('GET /api/campaigns', () => {
      it('returns 401 for unauthenticated requests', async () => {
        const response = await request(app).get('/api/campaigns');
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });
    });

    describe('GET /api/campaigns/:id', () => {
      it('returns 401 for unauthenticated requests', async () => {
        const response = await request(app).get(`/api/campaigns/${testCampaignId}`);
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });
    });

    describe('POST /api/campaigns', () => {
      it.skip('creates a new campaign (requires auth)', async () => {
        const newCampaign = {
          name: 'New Test Campaign',
          sponsorId: testSponsorId,
          budget: 10000,
          startDate: new Date('2026-02-01').toISOString(),
          endDate: new Date('2026-12-31').toISOString(),
          status: 'DRAFT',
        };
        const response = await request(app).post('/api/campaigns').send(newCampaign);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newCampaign.name);
        expect(response.body.budget).toBe(newCampaign.budget);

        // Cleanup
        await prisma.campaign.delete({ where: { id: response.body.id } });
      });

      it('returns 401 for unauthenticated requests', async () => {
        const response = await request(app).post('/api/campaigns').send({
          name: 'Test',
        });
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe('Placements API', () => {
    describe('GET /api/placements', () => {
      it('returns an array of placements', async () => {
        const response = await request(app).get('/api/placements');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('POST /api/placements', () => {
      it('creates a new placement', async () => {
        const newPlacement = {
          campaignId: testCampaignId,
          adSlotId: testAdSlotId,
          creativeId: testCreativeId,
          publisherId: testPublisherId,
          startDate: new Date('2026-03-01').toISOString(),
          endDate: new Date('2026-03-31').toISOString(),
          agreedPrice: 1000,
          status: 'PENDING',
        };
        const response = await request(app).post('/api/placements').send(newPlacement);
        expect(response.status).toBe(201);
        expect(response.body.campaignId).toBe(newPlacement.campaignId);
        expect(response.body.adSlotId).toBe(newPlacement.adSlotId);

        // Cleanup
        await prisma.placement.delete({ where: { id: response.body.id } });
      });

      it('returns 400 for missing required fields', async () => {
        const response = await request(app).post('/api/placements').send({
          campaignId: testCampaignId,
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe('Dashboard API', () => {
    describe('GET /api/dashboard/stats', () => {
      it('returns dashboard statistics', async () => {
        const response = await request(app).get('/api/dashboard/stats');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('sponsors');
        expect(response.body).toHaveProperty('publishers');
        expect(response.body).toHaveProperty('activeCampaigns');
        expect(response.body).toHaveProperty('totalPlacements');
        expect(response.body).toHaveProperty('metrics');
      });
    });
  });

  describe('Newsletter API', () => {
    describe('POST /api/newsletter/subscribe', () => {
      it('accepts newsletter subscription', async () => {
        const response = await request(app).post('/api/newsletter/subscribe').send({
          email: 'test@example.com',
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
      });

      it('returns 400 for invalid email', async () => {
        const response = await request(app).post('/api/newsletter/subscribe').send({
          email: 'invalid-email',
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  describe('Quotes API', () => {
    describe('POST /api/quotes/request', () => {
      it('accepts quote request', async () => {
        const quoteRequest = {
          adSlotId: testAdSlotId,
          companyName: 'Test Company',
          email: 'john@example.com',
          goals: 'Interested in advertising to increase brand awareness',
          budget: '5000-10000',
          phone: '+1234567890',
        };
        const response = await request(app).post('/api/quotes/request').send(quoteRequest);
        expect(response.status).toBe(200);
        expect(response.body.quoteId).toBeDefined();
        expect(response.body.success).toBe(true);
      });

      it('returns 400 for missing required fields', async () => {
        const response = await request(app).post('/api/quotes/request').send({
          companyName: 'Test Company',
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });

    describe('GET /api/quotes/:quoteId', () => {
      it('returns quote details', async () => {
        const response = await request(app).get('/api/quotes/test-quote-id');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('quoteId');
        expect(response.body).toHaveProperty('status');
      });
    });
  });
});
