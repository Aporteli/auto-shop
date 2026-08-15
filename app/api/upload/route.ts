import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'listings');
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const entry of files) {
      if (!(entry instanceof File) || entry.size === 0) continue;
      if (!ALLOWED_TYPES.has(entry.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
      }
      if (entry.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large' }, { status: 400 });
      }

      const ext = entry.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${randomUUID()}.${ext}`;
      const buffer = Buffer.from(await entry.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
      urls.push(`/uploads/listings/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
