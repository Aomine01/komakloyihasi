import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callbacks } from '@/lib/schema';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  let full_name = '';
  let phone = '';
  let region = '';
  let message = '';

  try {
    const body = await request.json();
    full_name = body.full_name;
    phone = body.phone;
    region = body.region;
    message = body.message;

    // Validate required fields
    if (!full_name || full_name.length < 3) {
      return NextResponse.json(
        { error: 'Ism kamida 3 ta belgidan iborat bo\'lishi kerak' },
        { status: 400 }
      );
    }

    if (!phone || !/^\+998[0-9]{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Telefon raqami formati noto\'g\'ri. Format: +998XXXXXXXXX' },
        { status: 400 }
      );
    }

    if (message && message.length > 500) {
      return NextResponse.json(
        { error: 'Xabar 500 ta belgidan oshmasligi kerak' },
        { status: 400 }
      );
    }

    try {
      await db.insert(callbacks).values({
        fullName: full_name,
        phone,
        region: region || null,
        message: message || null,
        status: 'new',
      });
    } catch (dbError) {
      console.warn('Database write failed for callback, saving offline:', dbError);
      
      const scratchDir = path.join(process.cwd(), 'scratch');
      if (!fs.existsSync(scratchDir)) {
        fs.mkdirSync(scratchDir, { recursive: true });
      }
      const logPath = path.join(scratchDir, 'callbacks.log');
      const logEntry = JSON.stringify({
        timestamp: new Date().toISOString(),
        fullName: full_name,
        phone,
        region: region || null,
        message: message || null,
        status: 'new',
        error: dbError instanceof Error ? dbError.message : String(dbError),
      }) + '\n';
      
      fs.appendFileSync(logPath, logEntry, 'utf8');
      return NextResponse.json({ success: true, savedOffline: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback API error:', error);
    return NextResponse.json(
      { error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
