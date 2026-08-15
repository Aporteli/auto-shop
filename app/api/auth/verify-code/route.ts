import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'შეიყვანეთ ელფოსტა და კოდი' }, { status: 400 });
    }

    // 1. ვეძებთ კოდს
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: { email, code },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: 'არასწორი კოდი' }, { status: 400 });
    }

    // 2. ვამოწმებთ ვადას
    if (new Date() > tokenRecord.expiresAt) {
      await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
      return NextResponse.json({ error: 'კოდის ვადა ამოიწურა' }, { status: 400 });
    }

    // 3. ვამოწმებთ, არსებობს თუ არა მომხმარებელი
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'მომხმარებელი არ მოიძებნა' }, { status: 404 });
    }

    // 4. ვშლით გამოყენებულ კოდს
    await prisma.verificationToken.delete({
      where: { id: tokenRecord.id },
    });

    // 5. ვააქტიურებთ მომხმარებელს
    const user = await prisma.user.update({
      where: { email },
      data: { isVerified: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });

    // 6. ვქმნით სესიას
    await setSessionCookie(user.id);

    return NextResponse.json({ success: true, message: 'ელფოსტა წარმატებით დადასტურდა!', user });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'შეცდომა ვერიფიკაციისას' }, { status: 500 });
  }
}
