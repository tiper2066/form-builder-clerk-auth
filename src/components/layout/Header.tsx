import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

const Header = () => {
    return (
        <header className='bg-background border-b'>
            <div className='container flex h-16 items-center justify-between px-4 mx-auto'>
                {/* ------ 좌측 사이트명 및 메뉴 영역 ----- */}
                <div className='flex items-center gap-6'>
                    {/* 사이트 명 */}
                    <Link href='/' className='font-bold text-2xl'>
                        Form Builder
                    </Link>
                    {/* 네비게이션 메뉴 */}
                    <nav className='hidden md:flex gap-6'>
                        <Link
                            href='/dashboard'
                            className='text-muted-foreground hover:text-foreground transition-colors'
                        >
                            Dashborad
                        </Link>
                        <Link
                            href='/dashboard/forms'
                            className='text-muted-foreground hover:text-foreground transition-colors'
                        >
                            My Forms
                        </Link>
                    </nav>
                </div>
                {/* ------ 우측 Create Form 및 계정 아바타 버튼 영역 ----- */}
                <div className='flex items-center gap-4'>
                    <Button asChild variant='outline'>
                        <Link href='/dashboard/forms/create'>Create Form</Link>
                    </Button>
                    <UserButton />
                </div>
            </div>
        </header>
    );
};
export default Header;
