import FormBuilder from '@/components/forms/FormBuilder';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function EditFormPage({
    params,
}: {
    params: Promise<{ formId: string }>;
}) {
    const { userId, redirectToSignIn } = await auth();
    const { formId } = await params;

    if (!userId) return redirectToSignIn(); // userId 가 없다면 signIn 홈페이지로 이동

    // form 테이블에서 formId 와 일치하는 폼을 가져옴
    const form = await prisma.form.findUnique({
        where: {
            id: formId,
        },
        include: {
            questions: {
                orderBy: {
                    order: 'asc',
                },
            },
        },
    });
    // 만일 일치하는 폼이 없다면... dashboard > form 목록페이지로 이동
    if (!form) {
        redirect('/dashboard/forms');
    }
    // formId 가 일치하더라도 userId가 일치하지 않는 폼이라면(접근권한이 없음)..
    if (form.userId !== userId) {
        redirect('/dashboard/forms'); // dashboard > form 목록페이지로 이동
    }

    return (
        <div className='max-w-3xl mx-auto'>
            <div className='mb-6'>
                <h1 className='text-3xl font-bold'>Edit Form</h1>
                <p className='text-gray-500 mt-1'>
                    Update your form details and questions
                </p>
            </div>
            {/* 수정 버튼 클릭임을 알리기위해 isEditing 변수 전달  */}
            <FormBuilder initialData={form} isEditing />
        </div>
    );
}
