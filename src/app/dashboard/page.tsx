import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { syncUserWithDatabase } from '@/lib/clerk-sync'; // ************************** DB 동기화

const Dashboard = async () => {
    await syncUserWithDatabase(); // ********************** Clerk = Sqlite DB 정보 동기화해서 사용자 정보 가져오기

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
                    <p className='text-3xl font-bold mt-2'>12</p>
                    {/* 모든 폼(양식) 보기로 이동 버튼 */}
                    <Button className='mt-4' asChild>
                        <Link href='/dashboard/forms'>View All Forms</Link>
                    </Button>
                </div>
                {/* -- 응답(피드백) 갯수 카드 -- */}
                <div className='bg-white rounded-lg shadow p-6 border'>
                    <h2 className='text-xl font-medium'>Total Responses</h2>
                    <p className='text-3xl font-bold mt-2'>100</p>
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
                <div className='space-y-4'>
                    {/* --- 카드 아이템 --- */}
                    <div className='flex items-center justify-between border-b pb-4'>
                        {/* 폼 타이틀 및 설정 */}
                        <div>
                            <h3 className='font-medium'>This is the title</h3>
                            <p>responses . Create on 21 April 2025</p>
                        </div>
                        {/* 폼 보기 / 응답 보기 버튼  */}
                        <div className='flex gap-2'>
                            <Button>
                                <Link href='/dashboard/forms/123'>View</Link>
                            </Button>
                            <Button>
                                <Link href='/dashboard/forms/123/responses'>
                                    Responses
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
