'use client';

import { toast } from 'sonner';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type DeleteFormButtonProps = {
    formId: string;
};

// formId 를 받아서 비동기적으로 처리하는 함수
export default function DeleteFormButton({ formId }: DeleteFormButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false); // 삭제 여부 상태 변수
    const router = useRouter(); // useRouter 객체 생성

    // ------------------------ 삭제 핸들러 함수
    const handleDelete = async () => {
        // 삭제 버튼 클릭 시 사용자에게 확인 받는 알러트 창을 띄운다.
        if (!confirm('Are you sure you want to delete this form?')) return;
        setIsDeleting(true); // 컨펌 후 삭제중으로 업데이트

        try {
            const response = await fetch(`/api/forms/${formId}`, {
                method: 'DELETE', // API 주소로 delete 요청 전달
            });
            // 요청결과가 실패라면...
            if (!response.ok) {
                const error = await response.text(); // 에러반환하고
                throw new Error(error); // 에러 발생
            }
            // 요청결과가 성공이라면..
            toast.success('Form deleted successfully!'); // 성공 메시지 출력
            router.refresh(); // 현재 페이지 결과를  새로고침
        } catch (error) {
            console.error('Failed to delete form:', error);
            toast.error('Failed to delete the form. Please try again.');
        } finally {
            setIsDeleting(false); // 컨펌 후 삭제 중 아님으로 변경
        }
    };

    return (
        <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className='flex-1'
            variant='destructive'
        >
            {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
    );
}
