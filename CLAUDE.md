@AGENTS.md
## Project: Mubaraza
Minecraft x Chivalry 2 mod webapp built in Next.js 16 + TypeScript. Used to buy an account connected to the user's Microsoft account. Also used to download the official client.

## File structure
- src/app/page.tsx — homepage
- src/app/bugtracker/page.tsx — bug tracker list
- src/app/bugtracker/new/page.tsx — report a bug form
- src/app/bugtracker/[id]/page.tsx — individual bug detail page
- src/app/api/bugs/route.ts — GET (list) + POST (create) API for bugs
- src/app/api/bugs/[id]/route.ts — GET single bug by ID
- db-schema.sql — PostgreSQL schema, run once

## CSS approach
Each page has its own .module.css file. globals.css is imported only in layout.tsx and contains only :root tokens and base reset. No global class names.

## Database
PostgreSQL via the pg package. Connection string in .env.local as DATABASE_URL. Table: bugs. Bug IDs follow MUB-NNN format.

## Current status
- Homepage and bug tracker UI complete and styled
- Report Bug form built at /bugtracker/new
- API route written and connected to DB
- Haven't yet connected to Azure blob storage for storing attachments
- Haven't set up microsoft auth
- Haven't set up Stripe payments
- Haven't set up the following pages: Leaderboard, Log in, Sign Up, Download Client

## Hard Constraints/Workflows
Write the minimum code that solves the problem in front of you now, not the minimum that could solve every future version of it.
Resist premature abstraction, skip error handling for errors that cannot occur, and hardcode values until there is a real reason to configure them. The test: if the only reason something is abstracted is
"in case we need to," you have over-built it.

## Communication
Say what you did and why, not just a block of code. Flag concers even when you did exactly what was asked, and be precise about uncertainty: "T am not sure this library supports streaming" tells the user what to verify; "I think this should work" does not.

## Formatting
Your diff should be as small as the task allows. Do not touch what you were not asked to touch, match the existing style, and do not reformat: a formatter pass buries the three lines that matter inside three hundred that do not. The test is whether you can justify every changed line by the task. If a line is there because "while I was in there." revert