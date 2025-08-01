import { Button } from '@/components/ui/button';
import Link from 'next/link'; //  Next Link
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'; //   Clerk 모듈

export default function Home() {
    return (
        // 전체 컨테이너 - 수직 정렬
        <div className='flex flex-col min-h-screen'>
            {/* 헤더 영역  */}
            <header className='bg-white border-b border-gray-200 py-4'>
                <div className='container mx-auto  px-4 flex justify-between items-center'>
                    <h1 className='text-2xl font-bold'>Form Builder</h1>
                    <div>
                        {/*  로그아웃 중.. 표시 요소를 담는 Clerk 제공 컴포넌트 */}
                        <SignedOut>
                            <SignInButton>
                                <Button>Sign in</Button>
                            </SignInButton>
                        </SignedOut>
                        {/*  로그인 중.. 표시 요소를 담는 Clerk 제공 컴포넌트 */}
                        <SignedIn>
                            <div className='flex items-center gap-4'>
                                <Button asChild>
                                    <Link href='/dashboard'> Dashboard</Link>
                                </Button>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </header>
            {/* 컨텐츠 영역: 헤더제외한 전체 높이 설정 */}
            <div className='bg-blue-50 flex-1'>
                {/*  동적 너비(container) 설정  */}
                <div className='container mx-auto px-4 py-20 text-center'>
                    {/* ----- 페이지 타이틀 ----- */}
                    <h2 className='text-4xl ms:text-6xl font-bold mb-6'>
                        Create Custom Forms with Ease
                    </h2>
                    {/* ----- 페이지 설명 : 최대 672 너비 ----- */}
                    <p className='text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto'>
                        Build forms, collect responses, and analyze data - all
                        in one platform.
                    </p>
                    {/*  로그인 중.. 표시 요소를 담는 Clerk 제공 컴포넌트 */}
                    <SignedIn>
                        {/* ----- 폼생성 버튼 ----- */}
                        <Button asChild size='lg'>
                            <Link href='/dashboard/forms/create'>
                                Create a Form
                            </Link>
                        </Button>
                    </SignedIn>
                    {/*  로그아웃 중.. 표시 요소를 담는 Clerk 제공 컴포넌트 */}
                    <SignedOut>
                        <SignInButton>
                            <Button>Get Started</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </div>
    );
}
