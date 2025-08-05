'use client';
import { FormEvent, useState } from 'react'; // FormEvent : event 요소 타입
import { Question } from '@/generated/prisma'; // 스키마에서 Question 테이블 가져오기
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type FormPreviewProps = {
    form: {
        id: string;
        title: string;
        description: string | null;
        questions: Question[]; // 스키마에서 타입 가져옴
    };
};

const FormPreview = ({ form }: FormPreviewProps) => {
    const router = useRouter();
    const [name, setName] = useState(''); // 응답자 이름
    const [email, setEmail] = useState(''); // 응답자 이메일
    // 응답(피드백) 상태 변수 선언 - 특정 질문에 대해 id, text (질문에 대한 응답[피드백])을 담는 배열
    const [answers, setAnswers] = useState(
        form.questions.map((q) => ({ questionId: q.id, text: '' }))
    );
    //  질문에 대한 응답(피드백) 상태 변경 - Textarea 입력가능하게 함
    const handleAnswerChange = (questionId: string, text: string) => {
        setAnswers((prev) => {
            return prev.map((a) =>
                a.questionId === questionId ? { ...a, text } : a
            );
        });
    };
    //  피드백 (응답) 생성 함수
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 응답 입력 필드(Textarea) 유효성 검사 ( 비어 있는지 여부 )
        const emptyAnswers = answers.some((a) => !a.text.trim()); // 비어있으면 true
        // 모든 질문에 대한 응답이 없는 경우 메시지 출력
        if (emptyAnswers) {
            toast.error('All questions are required!'); // 모든 질문은 반드시 입력해야 함
            return;
        }

        try {
            // api > responses 로 POST 요청을 함
            const response = await fetch('/api/responses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 전송할 데이터
                body: JSON.stringify({
                    formId: form.id, // 폼의 id
                    answers, // 입력한 응답들
                    respondentName: name, // 응답자 이름
                    respondentEmail: email, // 응답자 이메일
                }),
            });
            // 전송이 실패하면... 에러 출력
            if (!response.ok) {
                throw new Error(await response.text());
            }
            // 전송이 성공하면 .. 성공 메시지 출력
            toast.success('Response submitted!', {
                description: 'Thank you for completing this form.',
            });
            // 폼을 초기화함
            setAnswers(
                form.questions.map((q) => ({ questionId: q.id, text: '' })) // 응답 필드 배움
            );
            setName(''); // 이름 필드 비움
            setEmail(''); // 이메일 필드 비움

            // 응답 생성에 성공하면 홈으로 이동함
            router.push('/');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Error', {
                description:
                    'Something went wrong while submitting your response.',
            });
        }
    };

    return (
        <div className='max-w-xl mx-auto'>
            {/* 전달받은 특정 form 정보 표시 - 타이틀과 설명 */}
            <div className='mb-8'>
                <h1 className='text-2xl font-bold'>{form.title}</h1>
                {form.description && (
                    <p className='mt-2 text-gray-600'>{form.description}</p>
                )}
            </div>

            {/* 폼에 대한 응답 생성을 위한 입력 폼 */}
            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* --- 응답자 이름 --- */}
                <div className='space-y-4'>
                    <Label>Your Name (Optional)</Label>
                    <Input
                        placeholder='Enter your name'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='mt-1'
                    />
                </div>
                {/* --- 응답자 이메일 주소 --- */}
                <div className='space-y-4'>
                    <Label>Your Email (Optional)</Label>
                    <Input
                        placeholder='Enter your email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='mt-1'
                    />
                </div>
                {/* --- 폼에 포함된 질문 요소들을 출력  --- */}
                <div className='space-y-6'>
                    {form.questions // 이 폼이 가지고 있는 질문을
                        .sort((a, b) => a.order - b.order) // 정렬해서
                        // 반복 출력한다.
                        .map((question, index) => (
                            <div key={question.id} className='space-y-2'>
                                <Label className='font-medium'>
                                    {index + 1}. {question.text}
                                </Label>
                                <Textarea
                                    placeholder='Your answer'
                                    value={
                                        answers.find(
                                            // 상태변수로 선언된 질문의 아이디와 가져온 질문 데이터 id 가 일치하하는 Textarea 라면..
                                            // 입력된 글들을 출력한다.
                                            (a) => a.questionId === question.id
                                        )?.text || ''
                                    }
                                    onChange={(e) =>
                                        handleAnswerChange(
                                            question.id,
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        ))}
                </div>

                <div className='flex justify-end'>
                    <Button type='submit'>Submit Response</Button>
                </div>
            </form>
        </div>
    );
};
export default FormPreview;
