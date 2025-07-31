import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        // 전체 컨테이너 - 수직 정렬
        <div className='flex flex-col min-h-screen'>
            {/* 헤더 영역  */}
            <header className='bg-white border-b border-gray-200 py-4'>
                <div className='container mx-auto  px-4 flex justify-between items-center'>
                    <h1 className='text-2xl font-bold'>Form Builder</h1>
                    <Button>Sign in</Button>
                </div>
            </header>
            {/* 컨텐츠 영역: 헤더제외한 전체 높이 설정 */}
            <div className='bg-blue-50 flex-1'>Main</div>
        </div>
    );
}
