@AGENTS.md
## Project: Mubaraza
Minecraft x Chivalry 2 mod webapp built in Next.js 16 + TypeScript.

## File structure
- src/app/page.tsx — homepage
- src/app/bugtracker/page.tsx — bug tracker list
- src/app/bugtracker/new/page.tsx — report a bug form
- src/app/api/bugs/route.ts — POST/GET API for bugs
- db-schema.sql — PostgreSQL schema, run once

## CSS approach
Each page has its own .module.css file. globals.css is imported only in layout.tsx and contains only :root tokens and base reset. No global class names.

## Database
PostgreSQL via the pg package. Connection string in .env.local as DATABASE_URL. Table: bugs. Bug IDs follow MUB-NNN format.

## Current status
- Homepage and bug tracker UI complete and styled
- Report Bug form built at /bugtracker/new
- API route written but not yet connected to DB
- PostgreSQL not set up yet — Homebrew not installed on this machine, in the process of installing it