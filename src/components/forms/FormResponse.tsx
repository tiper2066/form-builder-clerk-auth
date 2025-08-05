import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ResponseProps = {
    response: {
        id: string;
        createdAt: Date;
        respondentName: string | null;
        respondentEmail: string | null;
        answers: {
            id: string;
            text: string;
            question: {
                id: string;
                text: string;
                order: number;
            };
        }[];
    };
};

const FormResponse = ({ response }: ResponseProps) => {
    const formattedDate = new Date(response.createdAt).toLocaleDateString(); // YYYY.MM.DD 날자 포맷 (지역날자표기)
    const formattedTime = new Date(response.createdAt).toLocaleTimeString(); // 오후/오전 HH:mm:ss 시간 포맷 (지역날자표기)

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div>
                        {/* ---- 응답자 이름 또는 이메일 -- 있으면 표시하고 없으면, 아무개로 표시 ---- */}
                        {response.respondentName
                            ? `From: ${response.respondentName}`
                            : 'Anonymous Response'}
                        {response.respondentEmail && (
                            <span className='text-gray-500 text-sm ml-2'>
                                ({response.respondentEmail})
                            </span>
                        )}
                    </div>
                    {/* 응답 날자와 시간 표시 */}
                    <div className='text-sm text-gray-500'>
                        {formattedDate} at {formattedTime}
                    </div>
                </CardTitle>
            </CardHeader>
            {/* -------- 응답 목록을 표시  -------- */}
            <CardContent>
                <div className='space-y-4'>
                    {response.answers.map((answer) => (
                        <div key={answer.id}>
                            {/* 질문 자체 표시 */}
                            <h3 className='font-medium'>
                                {answer.question.text}
                            </h3>
                            {/* 질문에 대한 피드백 표시 */}
                            <p className='mt-1 whitespace-pre-wrap'>
                                {answer.text}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
export default FormResponse;
