import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from './db';

// DB 와 Clerk 연동하는 함수 컴포넌트
export async function syncUserWithDatabase() {
    try {
        const { userId } = await auth(); // clerk 인증으로 userId 추출
        const user = await currentUser(); // 현재 사용자 정보 추출

        // 사용자 id 또는 사용자 정보가 없다면... 에러 메시지 출력
        if (!userId || !user) {
            console.error('No authenticated user found');
            return null;
        }

        // clerk의 사용자정보를 Sqlite DB user 테이블 userId 에 추가함
        const dbUser = await prisma.user.upsert({
            where: {
                id: userId,
            },
            update: {
                // email, username 업데이트
                email: user.emailAddresses[0]?.emailAddress || '',
                username: user.username || user.firstName || 'user',
            },
            create: {
                // sqlite user 테이블에 사용자 추가
                id: userId,
                email: user.emailAddresses[0]?.emailAddress || '',
                username: user.username || user.firstName || 'user',
            },
        });
        // console.log('User synced with database:', dbUser.id); // 콘솔에 싱크완료된 사용자 id 출력
        return dbUser; // 싱크 완료된 사용자 정보 반환
    } catch (error) {
        console.error('Error syncing user with database:', error);
        return null;
    }
}
