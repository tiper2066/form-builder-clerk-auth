import FormBuilder from '@/components/forms/FormBuilder';

const CreateFormPage = () => {
    return (
        <div className='max-w-3xl max-auto'>
            <div className='mb-6'>
                <h1 className='text-3xl font-bold'>Create New Form</h1>
                <p className='text-gray-500 mt-1'>Design your custom form</p>
            </div>

            {/* --- Form Builder 를 위한 폼 컴포넌트 --- */}
            <FormBuilder />
        </div>
    );
};
export default CreateFormPage;
