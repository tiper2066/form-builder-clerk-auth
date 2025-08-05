import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

// Create 응답(피드백) 요청에 대한 API 함수 ---------------------------------
export async function POST(req: Request) {
    const { formId, answers, respondentName, respondentEmail } =
        await req.json(); // 요청한 페이지에서 json 데이터 추출

    // form 테이블에서 특정 formId 에 해당하는 id 를 찾아, questions 테이블데이터와 함께 데이터를 가져음
    const form = await prisma.form.findUnique({
        where: {
            id: formId,
        },
        include: {
            questions: true,
        },
    });
    // 만일 찾는 폼이 없다염... 메시지 출력 후 404 홈페이지로 이동
    if (!form) {
        return new NextResponse('Form not found', { status: 404 });
    }

    // 가져온 응답이 없으면... 400 에러 출력
    if (!answers || !Array.isArray(answers)) {
        return new NextResponse('Answers are required', { status: 400 });
    }

    // 요청에 form 테이터가 있고, 유효성 검증이 완료되었다면...
    // 해당 폼에 대한 피드백(응답) 을 생성한다.
    const formResponse = await prisma.formResponse.create({
        data: {
            formId,
            respondentName,
            respondentEmail,
            answers: {
                create: answers,
            },
        },
    });

    return NextResponse.json(formResponse); // 응답(피드백) 을 반환한다.
}
