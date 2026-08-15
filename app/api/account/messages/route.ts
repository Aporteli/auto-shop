import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      sender: { select: { firstName: true, lastName: true, email: true } },
      receiver: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  return NextResponse.json({
    messages: messages.map((message) => ({
      id: message.id,
      subject: message.subject,
      body: message.body,
      isRead: message.isRead,
      createdAt: message.createdAt,
      from: `${message.sender.firstName} ${message.sender.lastName}`.trim() || message.sender.email,
      to: `${message.receiver.firstName} ${message.receiver.lastName}`.trim() || message.receiver.email,
    })),
  });
}
