import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormResponse from '@/components/forms/FormResponse'; // *********************** 개별 응답 컴포넌트

const FormResponsesPage = async ({
    params,
}: {
    params: Promise<{ formId: string }>;
}) => {
    const { userId, redirectToSignIn } = await auth(); // Clerk Auth에서 userId, redirectToSignIn 추출
    const { formId } = await params; // URL params에서 formId 추출

    if (!userId) return redirectToSignIn(); // userId 가 없다면 signIn 홈페이지로 이동

    // form 테이블에서 id가 formId와 일치하는 폼을 찾고,
    // 해당 폼과 연관된 response 테이블의 응답 갯수 데이터도 같이 가져옴
    const form = await prisma.form.findUnique({
        where: {
            id: formId,
            userId,
        },
        include: {
            // 응답에 대한 답변과 질문도 포함헤서 가져오기
            responses: {
                include: {
                    answers: {
                        include: {
                            question: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    // 특정 폼과 일치하는 form 데이터가 없으면 폼 목록 페이지로 이동함
    if (!form) {
        redirect('/dashboard/forms');
    }

    return (
        <div className='max-w-3xl mx-auto space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>Form Responses</h1>
                    {/* --- 폼 타이틀과 응답 갯수 --- */}
                    <p className='text-gray-500 mt-1'>
                        {form.title} - {form.responses.length} resoponses
                    </p>
                </div>
                {/* --- 폼 상세 페이지로 돌아가기 버튼 --- */}
                <Button asChild variant='outline'>
                    <Link href={`/dashboard/forms/${formId}`}>
                        Back to Form
                    </Link>
                </Button>
            </div>

            {/* 응답이 없을 경우 메시지 */}
            {form.responses.length === 0 ? (
                <div className='text-center py-10 border rounded-lg'>
                    <p className='text-gray-500'>No responses yet.</p>
                    <p className='text-gray-500 mt-1'>
                        Share your form to collect responses.
                    </p>
                </div>
            ) : (
                // 응답이 있을 경우, 응답의 답변들을 출력한다.
                <div className='space-y-6'>
                    {form.responses.map((response) => (
                        // <h1 key={response.id}>{response.id}</h1> // ***************** 이 부분 제거하고 ...
                        // *********************************************************** 이 부분 추가한다.
                        <FormResponse key={response.id} response={response} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default FormResponsesPage;
