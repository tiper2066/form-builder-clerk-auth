import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
    // 보호해야할 라우팅 경로 설정
    matcher: [
        // 검색된 라우팅 경로가 없을 경우 Next.js 내부 파일 및 모든 정적 파일 접근 방지
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // API 경로에서는 항상 실행
        '/(api|trpc)(.*)',
    ],
};
