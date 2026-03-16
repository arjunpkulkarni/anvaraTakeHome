<div align="left" style="margin-bottom: 2rem;">
  <img src="https://anvara-production.nyc3.cdn.digitaloceanspaces.com/anvarabluetext.png" alt="Anvara" width="500" />
</div>

# Anvara Take-Home Assessment – Arjun Kulkarni

This repository contains my implementation of the **Anvara Full-Stack Take-Home Assessment**.

The project is a **sponsorship marketplace platform** where **sponsors can book advertising placements from publishers**.  
The application demonstrates full-stack engineering using a modern React frontend, Express backend, and PostgreSQL database.

This submission focuses on:

• TypeScript debugging and stability  
• Secure API design  
• Database integration with Prisma  
• Server-side data fetching  
• UI/UX improvements  
• analytics instrumentation  

---

# Quick Start (For Reviewers)

The entire project can be running locally in **under 5 minutes**.

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Setup the database

```bash
pnpm --filter @anvara/backend db:push
pnpm --filter @anvara/backend seed
```

### 4. Start the application

```bash
pnpm dev
```

---

# Local Development URLs

Frontend  
http://localhost:3847

Backend API  
http://localhost:4291

---

# Demo Accounts

You can log in using the seeded demo accounts.

Sponsor  
sponsor@demo.com  
password123  

Publisher  
publisher@demo.com  
password123  

---

# Demo Flow

### 1. Browse Marketplace

Navigate to:

http://localhost:3847/marketplace

View available advertising placements with pricing and publisher information.

---

### 2. Login as Sponsor

Use the demo credentials to access the sponsor dashboard.

You will see:

• campaign management  
• booking capabilities  
• dashboard navigation  

---

### 3. Book an Advertising Slot

Select any available slot and submit a booking request.

The system automatically:

• creates a campaign  
• links the placement  
• updates campaign status  

---

### 4. Manage Campaigns

Navigate to **My Campaigns** to:

• view campaigns  
• edit campaigns  
• delete campaigns  
• monitor campaign status  

---

# Features Implemented

## Core Functionality

✔ Fixed TypeScript errors throughout the project  
✔ Implemented secure API endpoints  
✔ Completed CRUD operations for campaigns and placements  
✔ Implemented server-side data fetching  
✔ Fixed authentication credential handling  
✔ Connected marketplace UI with backend booking flow  

---

## End-to-End Booking Flow

The application supports a full booking pipeline:

1. Sponsor browses marketplace  
2. Sponsor selects ad slot  
3. Sponsor submits booking request  
4. Campaign is automatically created  
5. Campaign linked to publisher slot  
6. Sponsor manages campaign in dashboard  

---

## UI / UX Improvements

Several improvements were implemented for better usability:

• avatar dropdown navigation  
• consistent button styling  
• improved dashboard layout  
• uniform marketplace card heights  
• improved hover states and interaction feedback  

---

## Analytics Integration

Google Analytics 4 was integrated for user behavior tracking.

Tracked events include:

• user login  
• campaign creation  
• booking requests  
• marketplace interactions  
• navigation engagement  

This enables future analysis of:

• conversion funnels  
• user engagement  
• marketplace performance  

---

# Tech Stack

### Frontend

Next.js 15  
React 19  
Tailwind CSS v4  

### Backend

Express.js  
Prisma ORM  
PostgreSQL  

### Authentication

Better Auth

### Tooling

PNPM Workspaces  
TypeScript  
ESLint  
Prettier  

### Testing

Vitest

---

# Project Structure

```
apps/
  frontend/            Next.js application
    app/
      components/
      dashboard/
      marketplace/
      api/auth/

  backend/             Express API
    prisma/
    src/

packages/
  config/
  eslint-config/
  prettier-config/

scripts/
  setup utilities
```

---

# Database

The project uses **PostgreSQL running in Docker**.

Default port:

5498

Start database:

```bash
docker compose up -d
```

Stop database:

```bash
docker compose down
```

Open Prisma Studio:

```bash
pnpm --filter @anvara/backend db:studio
```

---

# Testing

Run tests with:

```bash
pnpm test
```

---

# Code Quality

Lint code:

```bash
pnpm lint
```

Format code:

```bash
pnpm format
```

---

# Challenges Completed

The following core challenges were addressed:

• Fix TypeScript errors  
• Implement server-side data fetching  
• Secure API endpoints  
• Implement CRUD operations  
• Implement dashboard actions  

Additional improvements include analytics integration and UI/UX enhancements.

---

# Future Improvements

With more time, I would expand the project with:

• A/B testing framework for marketplace optimization  
• campaign performance analytics dashboard
• enhanced mobile-first responsiveness and overall UI 

---

# Author

Arjun Kulkarni  
University of Illinois Urbana-Champaign  
Computer Science & Materials Science  

GitHub  
https://github.com/arjunpkulkarni

---

# Notes

This project was completed as part of the **Anvara engineering take-home assessment** and demonstrates full-stack development including frontend architecture, backend APIs, database integration, and analytics instrumentation.

## Product Thinking

While implementing the platform, I identified several opportunities to improve the marketplace experience.

### 1. Marketplace Conversion Optimization

Sponsors browsing placements may hesitate to book without clear performance indicators.

Potential improvement:
• show estimated impressions
• display previous campaign performance
• highlight “high performing” placements

This would reduce friction and increase booking conversions.

---

### 2. Booking Confidence

New sponsors may feel uncertain when booking advertising placements.

Potential improvement:
• add publisher credibility indicators
• show campaign success examples
• display estimated reach

These changes would increase trust and encourage first-time bookings.

---

### 3. Campaign Performance Visibility

Sponsors need feedback after launching campaigns.

Potential improvement:
• dashboard showing impressions
• click-through rates
• conversion metrics

This would create a feedback loop that encourages repeat bookings.

# NEW ADDITION: Recommendation Engine

To improve the sponsor experience when browsing the marketplace, I implemented a **placement recommendation engine** that suggests relevant advertising slots based on campaign goals and marketplace data.

When a sponsor views a campaign, the backend evaluates available placements and ranks them using a weighted scoring model that considers several factors:

• **Audience overlap** — how closely the publisher’s content category matches the campaign’s target categories
• **Price efficiency** — how affordable the placement is relative to the campaign’s remaining budget
• **Historical performance** — past click-through rate (CTR) from previous placements when data exists
• **Audience reach** — estimated exposure based on publisher monthly views

Each placement receives a combined score derived from these signals. The system then returns the **top ranked placements as recommendations** for the sponsor.

To keep the system transparent, each recommendation includes **human-readable explanations** describing why the placement was suggested. Examples include:

• “Perfect audience match for Technology campaigns”
• “Excellent value — only 8.5% of remaining campaign budget”
• “Strong reach — 250K monthly views”
• “Good performance — 1.8% average CTR”

The recommendation logic is implemented as a backend service and exposed through the endpoint:

GET /campaigns/:id/recommendations

This endpoint returns the **top recommended ad slots for a campaign**, allowing the frontend to surface intelligent suggestions directly within the sponsor dashboard.

The system is intentionally **explainable and deterministic**, prioritizing transparency and product usability while still incorporating historical marketplace performance data to improve placement discovery.
