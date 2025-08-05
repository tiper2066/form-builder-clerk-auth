import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server'; // Clerk Auth
import Link from 'next/link';
import { redirect } from 'next/navigation';

// [formId] 라우팅 경로를 포함하는 params 를 전달받는 동적 함수
const FormDetailPage = async ({
    params,
}: {
    params: Promise<{ formId: string }>;
}) => {
    const { userId, redirectToSignIn } = await auth(); // Clerk에서 userId, redirectToSignIn 추출
    const { formId } = await params; // params 에서 formId 추출

    if (!userId) return redirectToSignIn(); // 사용자가 아니면 Signin 페이지로 이동

    // form 테이블에서 전달받은 formId와 일치하는 id에 해당하는(고유조건) 정보를 가져옴
    const form = await prisma.form.findUnique({
        where: {
            id: formId, // 조회조건: id가 formId(페이지에서 받은 폼 ID)와 일치하는 데이터 (폼동적 라우팅 경로값)
        },
        // include: 관련 데이터를 함께 가져오도록 설정 (form 테이블과 연결된 questions, responses 테이블)
        include: {
            // form 테이블과 연결된 questions (Question 테이블)의 모든 데이터 가져오기
            questions: {
                orderBy: {
                    order: 'asc', // 질문 배열은 오름차순으로  정렬
                },
            },
            // form 테이블과 연결된 테이블의 데이터 카운트하기
            _count: {
                select: {
                    responses: true, // 피드백(응답) (FormResponse 테이블)의 데이터 카운트 설정
                },
            },
            // questions, responses 는 실제 테이블을 지칭하는 form 테이블의 필드임
        },
    });

    // form 데이터가 없다면, dashboard/forms(폼 리스트) 로 이동
    if (!form) {
        redirect('/dashboard/forms');
    }
    // form.userId와 user 가 일치하지 않는 경우, dashboard/forms(폼 리스트)로 이동
    if (form.userId !== userId) {
        redirect('/dashboard/forms');
    }
    // 해당 formId를 이용한 배포시 폼 상세 페이지의 동적 라우팅 경로 설정 (.env 에 정의함)
    const formUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/forms/${formId}`;

    return (
        <div className='max-w-3xl mx-auto space-y-6'>
            {/* ---- 타이틀 및 액션 버튼 UI  ---- */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>{form?.title}</h1>
                    {form.description && (
                        <p className='text-gray-500 mt-1'>{form.description}</p>
                    )}
                </div>
                <div className='flex gap-2'>
                    <Button asChild variant='outline'>
                        <Link href={`/dashboard/forms/${formId}/edit`}>
                            Edit
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/dashboard/forms/${formId}/responses`}>
                            View Responses ({form._count.responses})
                        </Link>
                    </Button>
                </div>
            </div>
            {/* ---- 폼 사용을 위한 공유 경로 표시 카드 UI  ---- */}
            <Card>
                <CardHeader>
                    <CardTitle>Share Your Form</CardTitle>
                    <CardDescription>
                        Share this link with others to collect responses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='p-2 border rounded-md bg-gray-50'>
                        {formUrl}
                    </p>
                </CardContent>
            </Card>
            {/* ---- 폼 질문 표시 카드 UI  ---- */}
            <div className='space-y-4'>
                <h2 className='text-xl font-bold'>Questions</h2>
                <div className='space-y-2'>
                    {form.questions.map((question, index) => (
                        <Card key={question.id}>
                            <CardContent className='p-4'>
                                <p className='font-medium'>
                                    {index + 1}. {question.text}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default FormDetailPage;
