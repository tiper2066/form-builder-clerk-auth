import prisma from '@/lib/db'; //  추가
import { notFound } from 'next/navigation';
import FormPreview from '@/components/forms/FormPreview';

// [formId] 라우팅 경로를 포함하는 params 를 전달받는 동적 함수 (응답을 위한 페이지)
const PublicFormPage = async ({
    params,
}: {
    params: Promise<{ formId: string }>;
}) => {
    const { formId } = await params; // URL params에서 formId 추출

    // form 테이블에서 id가 formId와 일치하는 폼을 찾고, questions 테이블의 데이터도 같이 가져오도록 설정
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

    if (!form) {
        return notFound(); // 가져올 form 데이터가 없으면 404 홈페이지로 이동
    }

    return (
        <div className='min-h-screen bg-gray-50 py-12'>
            <div className='container max-w-3xl mx-auto bg-white p-6 rounded-lg shadow'>
                {/* 응답을 위해 특정 폼 정보를 미리보기 할 수 있는 컴포넌트 */}
                <FormPreview form={form} />
            </div>
        </div>
    );
};
export default PublicFormPage;
