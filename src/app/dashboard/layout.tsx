import React from 'react';
import Header from '@/components/layout/Header';
import { auth } from '@clerk/nextjs/server'; //  Clert 에서 auth 추출

//  비동기 컴포넌트로 변경
const DashboardLayout = async ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const { userId, redirectToSignIn } = await auth(); //  Clerk Auth 에서 userId, redirectToSignIn 추출
    if (!userId) return redirectToSignIn(); //  userId 가 없으면 signIn 홈페이지로 이동

    return (
        <div className='min-h-screen flex flex-col'>
            <Header />
            {/* 컨텐츠 영역 : flex-1 - 헤더 높이를 제외한 나머지 영역 차지 */}
            <main className='container flex-1 mx-auto p-4'>{children}</main>
        </div>
    );
};
export default DashboardLayout;
