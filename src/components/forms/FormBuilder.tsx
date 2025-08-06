'use client';
import { FormEvent, useState } from 'react'; //  FormEvent 이벤트
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { v4 as uuid } from 'uuid'; //  uuid 모듈
import { toast } from 'sonner'; //  sonner 모듈
import { useRouter } from 'next/navigation'; //  useRouter 훅

// ************************ Question 타입 선언
type Question = {
    id: string;
    text: string;
};
// ************************ FormBuilderProps 타입 선언
type FormBuilderProps = {
    initialData: {
        id?: string;
        title: string;
        description: string | null;
        questions: Question[];
    };
    isEditing?: boolean;
};
// ************************ FormBuilderProps 타입을 받는 함수로 수정
const FormBuilder = ({ initialData, isEditing = false }: FormBuilderProps) => {
    const router = useRouter(); //  useRouter 객체 생성
    const [isSubmitting, setIsSubmitting] = useState(false); //  submit 전송 여부 상태
    // ************************* props 에서 추출한 값으로 값설정: 기본값 변경
    const [form, setForm] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        questions: initialData?.questions || [
            {
                id: '1', // 1 부터 시작
                text: '',
            },
        ],
    });

    //  질문 삭제 함수 추가
    const removeQuestion = (index: number) => {
        // 질문이 1개 이상일 경우만...
        if (form.questions.length > 1) {
            setForm((prev) => ({
                ...prev,
                // 이전 questions 배열값에서 전달된 id 와 일치하는 값만 제외하고 반환하여 추가함
                questions: prev.questions.filter((_, i) => i !== index),
            }));
        } else {
            //  질문이 1개 또는 그 이하인 경우 메시지 출력
            toast.error('Form must have at least one question', {
                position: 'top-center', // 없으면 기본 우측하단에 출력됨
            });
        }
    };

    //  질문 추가 함수
    const addQuestion = () => {
        // 기본적으로 이전 form 배열에 questions 속성값(배열주의)만 추가하는 것임
        setForm((prev) => ({
            ...prev,
            questions: [
                ...form.questions, // 이전 questions 값 +
                {
                    id: uuid(), //  uuid 로 동적생성
                    text: '',
                },
            ],
        }));
    };

    //  질문입력값 변경 핸들러 함수
    const handleQuestionChange = (index: number, value: string) => {
        const updatedQuestions = [...form.questions]; // 기존 질문 배열을 저장
        updatedQuestions[index].text = value; // 전달된 index 에 해당하는 질문값에 입력값을 할당해서 질문배열을 업데이트함
        setForm({ ...form, questions: updatedQuestions }); // 기존 form 배열 + 업데이트된 질문배열 추가
    };

    //  onSubmit 이벤트 핸들러
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 입력값 유효성 검증
        if (!form.title.trim()) return toast.error('Title is required');

        // 모든 질문 아이템에 입력값이 있는지 여부를 Bloolean값으로 할당
        // questions 배열에 text값 포함 여부 반환(없음:true)
        const emptyQuestions = form.questions.some((q) => !q.text.trim());
        // 모든 질문 아이템에 값이 없는 경우 메시지 출력(ture: 없음)
        if (emptyQuestions) {
            toast.error('All questions must have text');
            return;
        }

        try {
            setIsSubmitting(true);

            // ************************************* Edit 인지 Create 인지 여부에 따라 경로 설정하기
            const url = isEditing
                ? `/api/forms/${initialData?.id}` // Edit 경우
                : '/api/forms'; // Create 경우
            const method = isEditing ? 'PUT' : 'POST'; // Edit 이면 PUT, Create 이면 POST 으로 설정

            // ************************************* Edit / Create 여부에 따라 api 요청으로 폼 데이터 전달
            // ------------------------------ Edit / Create 여부에 따라 설정한 url 변수로 api 요청
            const response = await fetch(url, {
                method: method, // ----------------------------Edit / Create 여부에 따라 설정한 method로 api 요청 으로 설정
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error); // 오류는 catch(error)에 전달
            }

            // 성공 시 JSON 데이터(from 테이블데이터)를 변수로 만들고
            const data = await response.json();

            // ---------------------------- Edit / Create 여부에 따라 성공 메시지를 출력하고...
            toast.success(isEditing ? 'Form updated!' : 'Form created!', {
                description: 'Your form has been saved successfully.',
            });

            router.push(`/dashboard/forms/${data.id}`); // 성공 후 해당 폼 상세 페이지로 이동함
            // router.refresh(); // 현재 라우트를 새로고침함(폼 추가 목록 갱신) - 이 코드를 push 뒤에 놓으면... 경로 이동이 안되었음 ㅠ.ㅠ
        } catch (error) {
            console.error('Error saving form:', error);
            toast.error('Error', {
                description: 'Something went wrong while saving your form.', // 에러 메시지 출력
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        //  onSubmit 이벤트 연결
        <form onSubmit={handleSubmit} className='space-y-8'>
            {/* ---  Title 및 Description 영역 --- */}
            <div className='space-y-4'>
                {/* ---  Title --- */}
                <div>
                    <Label htmlFor='title'>Title</Label>
                    <Input
                        id='title'
                        value={form.title}
                        // 기존 form 배열값 + title 입력값 반환
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                        placeholder='Enter form title'
                        className='mt-1'
                    />
                </div>
                {/* ---  description --- */}
                <div>
                    <Label htmlFor='description'>Description (Optional)</Label>
                    <Textarea
                        id='description'
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        placeholder='Enter form description'
                        className='mt-1'
                    />
                </div>
            </div>
            {/* ---  질문 설정 영역 --- */}
            <div className='space-y-6'>
                {/* 질문 추가 버튼  */}
                <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-medium'>Questions</h3>
                    <Button
                        variant='outline'
                        type='button'
                        onClick={addQuestion} //  질문 추가 함수 연결
                    >
                        Add Question
                    </Button>
                </div>

                {/* --- form 배열에 추가된 질문 갯수 만큼 질문 요소를 표시함 --- */}
                {form.questions.map((question, index) => (
                    <div
                        key={question.id}
                        className='space-y-2 p-4 border rounded-md'
                    >
                        <div className='flex items-center justify-between'>
                            <Label htmlFor={`Question-${index}`}>
                                Question {index + 1}
                            </Label>
                            <Button
                                variant='ghost'
                                type='button'
                                size='sm'
                                className='text-red-500 hover:text-red-700'
                                onClick={() => removeQuestion(index)} //  질문 삭제 함수 연결
                            >
                                remove
                            </Button>
                        </div>
                        <Textarea
                            id={`Question-${index}`}
                            value={question.text}
                            //  handleQuestionChange 적용
                            onChange={(e) => {
                                handleQuestionChange(index, e.target.value);
                            }}
                            placeholder='Enter your question'
                            className='mt-1'
                        />
                    </div>
                ))}
            </div>

            {/* --- 취소 / Submit 버튼 영역 --- */}
            <div className='flex justify-end gap-2'>
                {/*  전송 여부에 따른 취소 버튼 설정  */}
                <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                        router.back(); // 이전 페이지(Dashboard)로 이동
                    }}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                {/*  *************************** Edit 인지 Create 인지, 전송 여부에 따른 Submint 버튼 설정  */}
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting
                        ? 'Saving...'
                        : isEditing
                        ? 'Update Form'
                        : 'Create Form'}
                </Button>
            </div>
        </form>
    );
};
export default FormBuilder;
