# AI Thumbnail Studio — Full Stack MVP

This project is an MVP for an AI YouTube Thumbnail Creator.

## Features included
- AI provider adapters (OpenAI / Replicate placeholder / Hugging Face)
- Server-side generation of background images
- Client-side Fabric.js editor for composition
- Export from editor uploaded to S3 or returned as data URL
- Prisma schema for storing thumbnails and user association
- NextAuth scaffold recommended (not fully wired)

## Quick start
1. Copy `.env.example` to `.env` and fill keys.
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npm run dev`

Notes:
- `canvas` may require system libraries. On Debian/Ubuntu:
  `sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`
- Replicate adapter is a placeholder — implement polling per Replicate docs.

