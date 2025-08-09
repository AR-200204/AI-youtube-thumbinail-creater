import { generateImage } from '../../lib/ai';
import { uploadToS3 } from '../../lib/storage';
import prisma from '../../lib/prisma';
import { createCanvas, loadImage } from 'canvas';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const { prompt, title, userId } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const bgBuffer = await generateImage({ prompt, width: 1280, height: 720 });

    // Save generated background to S3 (or data URL)
    const key = `backgrounds/${Date.now()}-${Math.random().toString(36).slice(2,8)}.png`;
    const imageUrl = await uploadToS3(bgBuffer, key, 'image/png');

    // Save metadata
    const record = await prisma.thumbnail.create({
      data: {
        title: title || prompt.slice(0,80),
        prompt,
        imageUrl,
        meta: { provider: process.env.AI_PROVIDER || null },
        userId: userId || null,
      }
    });

    res.status(200).json({ imageUrl, id: record.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
