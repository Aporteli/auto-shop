import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ user: user ?? null });
  } catch (error) {
    console.error('GET /api/auth/me failed:', error);
    return NextResponse.json({ user: null });
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    phone?: string | null;
  };

  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  const phone = body.phone?.trim() || null;

  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { firstName, lastName, phone },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
    },
  });

  return NextResponse.json({ user: updated });
}
