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
• marketplace pagination and filtering  
• improved validation and error handling  
• E2E testing with Playwright  
• enhanced mobile-first responsiveness  

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
