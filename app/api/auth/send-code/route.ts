import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'ელფოსტა აუცილებელია' }, { status: 400 });
    }

    // 6-ნიშნა კოდი და 10-წუთიანი ვადა
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // წავშალოთ ძველი კოდები ამ მეილზე
    await prisma.verificationToken.deleteMany({
      where: { email },
    });

    // ჩავწეროთ ახალი კოდი MySQL ბაზაში
    await prisma.verificationToken.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    });

    // გავაგზავნოთ მეილი Resend-ით
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'ვერიფიკაციის კოდი',
        html: `<h3>თქვენი ვერიფიკაციის კოდია: <b>${otp}</b></h3>`,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Log code to console for testing if email fails
      console.log(`=== VERIFICATION CODE FOR ${email}: ${otp} ===`);
    }

    return NextResponse.json({ success: true, message: 'კოდი წარმატებით გაიგზავნა' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'შეცდომა კოდის გაგზავნისას' }, { status: 500 });
  }
}
