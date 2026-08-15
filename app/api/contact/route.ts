import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    const name = body.name?.trim() ?? '';
    const email = body.email?.trim().toLowerCase() ?? '';
    const phone = body.phone?.trim() ?? '';
    const message = body.message?.trim() ?? '';

    if (name.length < 2) {
      return NextResponse.json({ error: 'name' }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: 'email' }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: 'message' }, { status: 400 });
    }

    const ticket = await prisma.helpTicket.create({
      data: {
        name,
        email,
        topic: 'contact',
        message: phone ? `Phone: ${phone}\n\n${message}` : message,
      },
    });

    return NextResponse.json({ ok: true, id: ticket.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
