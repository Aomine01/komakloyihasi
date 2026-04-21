import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callbacks } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, phone, region, message } = body;

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

    await db.insert(callbacks).values({
      fullName: full_name,
      phone,
      region: region || null,
      message: message || null,
      status: 'new',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
