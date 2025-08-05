'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import FormCard from './FormCard'; // 개별 폼 컴포넌트

type Form = {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    _count: {
        responses: number;
    };
};
type FormListProps = {
    forms: Form[];
};
const FormList = ({ forms }: FormListProps) => {
    const [searchValue, setSearchValue] = useState<string>(''); // 검색어

    // ******************* 입력된 검색어와 일치하는 폼 타이틀을 찾아서 관련 폼 데이터 가져오기
    // ******************* 입력값이 없으면 모든 폼을 가져온다.
    const filteredForms = forms.filter((form) =>
        form.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                {/* 폼 검색 필드 */}
                <Input
                    placeholder='Search forms...'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className='max-w-sm'
                />
                {/* 폼 생성 버튼  */}
                <Button asChild>
                    <Link href='/dashboard/forms/create'>Create Form</Link>
                </Button>
            </div>

            {/* ----- ************************* forms 를 filteredForms 로 변경  ----- */}
            {filteredForms.length === 0 ? (
                <div>
                    <p>No forms found. Create your first form</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {/* ----- ************************* forms 를 filteredForms 로 변경  ----- */}
                    {filteredForms.map((form) => (
                        <FormCard
                            key={form.id}
                            id={form.id}
                            title={form.title}
                            description={form.description}
                            responsesCount={form._count.responses}
                            createdAt={form.createdAt}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
export default FormList;
