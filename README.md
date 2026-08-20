# Mubaraza Web App

A full-stack SaaS web application built for a Minecraft modpack 
community. Features a public homepage, bug tracker, leaderboard 
connected to the modpack's in-game API, and a payment-gated 
client download system.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: PostgreSQL
- **Auth**: Microsoft OAuth (NextAuth.js)
- **Payments**: Stripe Checkout
- **Storage**: Azure Blob Storage
- **Styling**: Tailwind CSS

## Features

- Bug tracker with full-text search, filtering by status, 
  severity, and category
- Live leaderboard pulling real-time player statistics from 
  an external game API
- Microsoft OAuth authentication
- Stripe payment-gated client download
- File attachment support via Azure Blob Storage
- Server-side input validation on all API routes

## Author

Maverick Banigan — [github.com/mavbanigan](https://github.com/mavbanigan)
