import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import FormList from '@/components/forms/FormList';

const FormPage = async () => {
    const { userId, redirectToSignIn } = await auth(); // Clerk Auth에서 userId, redirectToSignIn 추출

    if (!userId) return redirectToSignIn(); // userId 가 없다면 signIn 홈페이지로 이동

    // form 테이블에서 userId와 일치하는 데이터를 찾고, response 테이블의 응답 갯수 데이터도 같이 가져옴
    const forms = await prisma.form.findMany({
        where: {
            userId: userId,
        },
        include: {
            _count: {
                select: {
                    responses: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc', // 내림차순
        },
    });

    return (
        <div className='space-y-6'>
            {/* --- 페이지 타이틀 및 설명 --- */}
            <div>
                <h1 className='text-3xl font-bold'>My Forms</h1>
                <p className='text-gray-500 mt-1'>
                    Create and manage your forms
                </p>
            </div>

            {/* --- FormList: 가져온 forms 데이터를 전달한다. --- */}
            <FormList forms={forms} />
        </div>
    );
};
export default FormPage;
