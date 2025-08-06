import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { syncUserWithDatabase } from '@/lib/clerk-sync'; //  DB 동기화
import prisma from '@/lib/db'; //  PrismaClient (DB 연결)
import { auth } from '@clerk/nextjs/server'; //  Clerk Auth

const Dashboard = async () => {
    const { userId, redirectToSignIn } = await auth(); //  Clerk Auth에서 userId 추출

    if (!userId) return redirectToSignIn(); //  userId 가 없다면 signIn 페이지로 이동

    await syncUserWithDatabase(); //  Clerk = Sqlite DB 정보 동기화해서 사용자 정보 가져오기

    //  form 테이블에서 폼(양식) 갯수 구하는 함수
    const formsCount = await prisma.form.count({
        where: {
            userId: userId, // 현재 사용자의 userId 와 일치하는 form 테이블의 폼(양식)의 갯수(count)를 가져옴
        },
    });
    //  formResponse 테이블에서 데이터 갯수를 가져오는데...
    const responseCount = await prisma.formResponse.count({
        where: {
            form: {
                userId, // form 테이블 userId 와 일치하는 모든 응답 갯수(count)를 가져옴
            },
        },
    });
    //  최근 폼 가져오기
    const recentForms = await prisma.form.findMany({
        where: { userId }, // userId 와 일치하고
        orderBy: { createdAt: 'desc' }, // 생성일 내림차순으로
        take: 5, // 최근 5개 가져오는데...
        include: {
            _count: {
                select: { responses: true }, // 응답 갯수 데이터도 가져오기
            },
        },
    });

    return (
        <div className='space-y-6'>
            {/* ----- 페이지 타이틀 및 설명 영역 ----- */}
            <div>
                <h1 className='text-3xl font-bold'>welcome, John</h1>
                <p className='text-gray-500 mt-1'>
                    manage your forms and responses
                </p>
            </div>
            {/* ----- 폼 카드 UI 컨테이너: 3컬럼, 모바일 1컬럼 ----- */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {/* -- 폼(양식) 갯수 카드 -- */}
                <div className='bg-white rounded-lg shadow p-6 border'>
                    <h2 className='text-xl font-medium'>Your Forms</h2>
                    {/*  현재 사용자가 생성한 폼 갯수 */}
                    <p className='text-3xl font-bold mt-2'>{formsCount}</p>
                    {/* 모든 폼(양식) 보기로 이동 버튼 */}
                    <Button className='mt-4' asChild>
                        <Link href='/dashboard/forms'>View All Forms</Link>
                    </Button>
                </div>
                {/* -- 응답(피드백) 갯수 카드 -- */}
                <div className='bg-white rounded-lg shadow p-6 border'>
                    <h2 className='text-xl font-medium'>Total Responses</h2>
                    {/*  현재 사용자 생성 폼에 달린 응답 갯수 */}
                    <p className='text-3xl font-bold mt-2'>{responseCount}</p>
                </div>
                {/* -- Create Form 버튼 카드 -- */}
                <div className='bg-white rounded-lg shadow p-6 border'>
                    <h2 className='text-xl font-medium'>Create New</h2>
                    <p className='text-gray-500 mt-2'>
                        Start building a new form
                    </p>
                    {/* 모든 폼(양식) 보기로 이동 버튼 */}
                    <Button className='mt-4' asChild>
                        <Link href='/dashboard/forms/create'>Create Forms</Link>
                    </Button>
                </div>
            </div>
            {/* ----- 최근 업데이트 폼 카드 UI 컨테이너 ----- */}
            <div className='bg-white rounded-lg shadow p-6 border'>
                <h2 className='text-xl font-medium mb-4'>Recent Form</h2>
                {/*  최근 5개 폼 루핑해서 출력하기  */}
                {recentForms.length === 0 ? (
                    <p>You have not created any forms yet.</p>
                ) : (
                    <div className='space-y-4'>
                        {recentForms.map((form) => (
                            //* --- 카드 아이템 ---
                            <div
                                className='flex items-center justify-between border-b pb-4'
                                key={form.id}
                            >
                                <div>
                                    {/* 폼 타이틀 및 설정 */}
                                    <h3 className='font-medium'>
                                        {form.title}
                                    </h3>
                                    {/* --- 응답갯수와 생성일 --- */}
                                    <p className='text-sm text-gray-500'>
                                        {form._count.responses} responses ·
                                        Created on{' '}
                                        {new Date(
                                            form.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                {/* 폼 보기 / 응답 보기 버튼  */}
                                <div className='flex gap-2'>
                                    <Button>
                                        <Link
                                            href={`/dashboard/forms/${form.id}`}
                                        >
                                            View
                                        </Link>
                                    </Button>
                                    <Button>
                                        <Link
                                            href={`/dashboard/forms/${form.id}/responses`}
                                        >
                                            Responses
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className='space-y-4'></div>
            </div>
        </div>
    );
};
export default Dashboard;
