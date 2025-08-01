import prisma from '@/lib/db'; // prisma client
import { auth } from '@clerk/nextjs/server'; // Clerk auth
import { NextResponse } from 'next/server'; // Next.js response

// Create Form API 함수 ---------------------------------
export async function POST(req: Request) {
    const { userId } = await auth(); // clerk 에서 userId 추출

    // userId 가 없으면... 401 미인증 에러 반환
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // userId 가 있다면.... title, description, questions 추출
    const { title, description, questions } = await req.json();

    /*
    // 추출된 title 정보가 없다면... title 필요함 에러 반환
    if (!title) {
        return new NextResponse('Title is required', { status: 400 });
    }
    // 추출된 questions 정보가 없다면... questions 필요함 에러 반환
    if (!questions || questions.length === 0) {
        return new NextResponse('At least one question is required', {
            status: 400,
        });
    }

    // 정보 검증이 완료되었다면... form 생성
    const form = await prisma.form.create({
        data: {
            title,
            description,
            userId,
            questions: {
                // questions 배열를 이용하여 form에 질문 정보 생성
                create: questions.map((q: { text: string }, index: number) => ({
                    text: q.text,
                    order: index,
                })),
            },
        },
        include: {
            questions: true,
        },
    });
    */

    return NextResponse.json({ success: true });
}
