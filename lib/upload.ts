import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'projects');

export async function saveFileToDisk(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  // Ensure upload directory exists
  await mkdir(UPLOAD_DIR, { recursive: true });

  // Sanitize filename: remove special chars, keep extension
  const sanitized = originalName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .toLowerCase();
  const filename = `${crypto.randomUUID()}-${sanitized}`;
  const filepath = join(UPLOAD_DIR, filename);

  await writeFile(filepath, buffer);

  // Return the relative path that Next.js can serve
  return `/uploads/projects/${filename}`;
}
