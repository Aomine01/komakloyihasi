import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { path } = body;

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Path talab qilinadi' }, { status: 400 });
    }

    // Security: validate path starts with /uploads/projects/ to prevent path traversal
    if (!path.startsWith('/uploads/projects/')) {
      return NextResponse.json({ error: 'Noto\'g\'ri fayl yo\'li' }, { status: 400 });
    }

    // Extra security: no .. in path
    if (path.includes('..')) {
      return NextResponse.json({ error: 'Noto\'g\'ri fayl yo\'li' }, { status: 400 });
    }

    const fullPath = join(process.cwd(), 'public', path);

    try {
      await unlink(fullPath);
    } catch {
      // File may not exist — that's ok
      console.warn('File not found for deletion:', fullPath);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
