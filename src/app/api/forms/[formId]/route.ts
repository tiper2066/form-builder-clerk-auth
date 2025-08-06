import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// *********************** 개별 폼 삭제 API 함수
export async function DELETE(
    req: Request, // 요청과
    { params }: { params: Promise<{ formId: string }> } // 파라미터로 formId 를 받음
) {
    const { userId } = await auth(); // 사용자 id 추출
    const { formId } = await params; // URL 파라미터에서 formId 추출

    // ------------------------ 추출한 데이터 검증
    // 사용자가 아니라면 ... 401 미인증 에러 출력
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    // 사용자라면... form 테이블에서 formId 와 일치하는 폼을 가져옴
    const form = await prisma.form.findUnique({
        where: {
            id: formId,
        },
    });
    // 만일 일치하는 폼이 없다면... 404 홈페이지로 이동
    if (!form) {
        return new NextResponse('Form not found', { status: 404 });
    }
    // formId 가 일치하더라도 userId가 일치하지 않는 폼이라면..접근권한이 없다고 출력
    if (form.userId !== userId) {
        return new NextResponse('Forbidden', { status: 403 }); // 접근 금지
    }

    // ------------------------ 사용자와 요청 검증이 완료되면
    await prisma.form.delete({
        where: {
            id: formId, // form 테이블 id가 formId와 일치하는 폼을 삭제하고..
        },
    });

    return NextResponse.json({ success: true }); // 성공상태 반환
}

// *********************** 개별 폼 수정 API 함수
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ formId: string }> }
) {
    const { userId } = await auth(); // 사용자 id 추출
    const { formId } = await params; // URL 파라미터에서 formId 추출

    // ------------------------ 추출한 데이터 검증
    // 사용자가 아니라면 ... 401 미인증 에러 출력
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    // 사용자라면... form 테이블에서 formId 와 일치하는 폼을 가져옴
    const form = await prisma.form.findUnique({
        where: {
            id: formId,
        },
    });
    // 만일 일치하는 폼이 없다면... 404 홈페이지로 이동
    if (!form) {
        return new NextResponse('Form not found', { status: 404 });
    }
    // formId 가 일치하더라도 userId가 일치하지 않는 폼이라면..접근권한이 없다고 출력
    if (form.userId !== userId) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    // ***************************** 요청한 데이터 검증
    const { title, description, questions } = await req.json(); // 요청한 정보에서 json 데이터 추출

    // title 이 없다면.. 필요함 에러 출력
    if (!title) {
        return new NextResponse('Title is required', { status: 400 });
    }
    // questions 이 없다면.. 필요함 에러 출력
    if (!questions || questions.length === 0) {
        return new NextResponse('At least one question is required', {
            status: 400,
        });
    }

    // ****************************  폼 테이블에서 해당 폼찾아 title, description 변경
    const updatedForm = await prisma.form.update({
        where: {
            id: formId,
        },
        data: {
            title,
            description,
        },
    });

    // 질문은 새로 만드는 것이 좋기 때문에 일단 모든 질문 삭제함
    await prisma.question.deleteMany({
        where: {
            formId, // formId와 일치하는 모든 질문을 삭제함
        },
    });

    // 사용자가 입력한 새로운 질문을 생성해서 추가해줌
    await prisma.question.createMany({
        // 사용자 입력 정보들을 루핑하면서 text, formId, order(질문번호)를 만들어 question 테이블에 추가함
        data: questions.map((q: { text: string }, index: number) => ({
            text: q.text,
            formId,
            order: index,
        })),
    });

    return NextResponse.json(updatedForm);
}
