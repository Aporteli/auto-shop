// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, phone } = await req.json();

    // 1. ვალიდაცია
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'შეავსეთ ყველა აუცილებელი ველი' }, { status: 400 });
    }

    // 2. ვამოწმებთ, არსებობს თუ არა მომხმარებელი
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'ეს ელფოსტა უკვე დაკავებულია' }, { status: 400 });
    }

    // 3. პაროლის დაჰეშირება
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. მომხმარებლის შექმნა (isVerified = false)
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        isVerified: false,
      },
    });

    // 5. OTP კოდის გენერაცია (6-ნიშნა)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 წუთი

    // ვშლით ძველ კოდს, თუ არსებობდა
    await prisma.verificationToken.deleteMany({ where: { email } });

    // ვინახავთ ახალ კოდს
    await prisma.verificationToken.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    });

    // 6. მეილის გაგზავნა Resend-ით
    await resend.emails.send({
      from: 'onboarding@resend.dev', // ან თქვენი დომენი
      to: email,
      subject: 'დაადასტურეთ თქვენი რეგისტრაცია',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>გამარჯობა, ${firstName}!</h2>
          <p>თქვენი რეგისტრაციის დასასრულებლად შეიყვანეთ კოდი:</p>
          <h1 style="color: #2563eb; letter-spacing: 4px;">${otp}</h1>
          <p>კოდი ვალიდურია 10 წუთის განმავლობაში.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'მომხმარებელი შეიქმნა! კოდი გაგზავნილია მეილზე.',
      userId: newUser.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'დაფიქსირდა შეცდომა რეგისტრაციისას' }, { status: 500 });
  }
}
