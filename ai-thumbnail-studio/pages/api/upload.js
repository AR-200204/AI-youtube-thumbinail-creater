import prisma from '../../lib/prisma';
import { uploadToS3 } from '../../lib/storage';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const { dataUrl, title, userId } = req.body;
    if (!dataUrl || !dataUrl.startsWith('data:image')) return res.status(400).json({ error: 'invalid image' });

    const parts = dataUrl.split(',');
    const meta = parts[0];
    const b64 = parts[1];
    const mime = meta.match(/data:(image\/[^;]+);base64/)[1];

    const buffer = Buffer.from(b64, 'base64');
    const key = `thumbnails/${Date.now()}-${Math.random().toString(36).slice(2,8)}.png`;
    const imageUrl = await uploadToS3(buffer, key, mime);

    const record = await prisma.thumbnail.create({
      data: {
        title: title || 'Edited thumbnail',
        prompt: 'user-edited',
        imageUrl,
        meta: { edited: true },
        userId: userId || null
      }
    });

    res.status(200).json({ imageUrl, id: record.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
