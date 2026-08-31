import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/form/Input.tsx';
import { Button, Card } from '@heroui/react';
import Select from '@/components/form/Select.tsx';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

interface QuestionFormProps {
	initialValues: any;
	onSubmit: (values: any) => void;
	onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ initialValues, onSubmit, onCancel }) => {
	const [questions, setQuestions] = React.useState(initialValues || []);

	console.log('questions', questions);
	const validationSchema = Yup.object({
		questions: Yup.array()
			.of(
				Yup.object({
					langCode: Yup.string().required('Language Code is required'),
					questionDetail: Yup.string().required('Question text is required'),
				}),
			)
			.min(1, 'At least one question is required'),
		status: Yup.boolean().required('Status is required'),
	});

	const formik = useFormik({
		initialValues: {
			questions: questions || [],
			status: initialValues?.status || true,
		},
		validationSchema,
		onSubmit,
		enableReinitialize: true,
	});

	const addQuestion = () => {
		const newQuestions = [...questions, { langCode: '', questionDetail: '' }];
		setQuestions(newQuestions);
		formik.setFieldValue('questions', newQuestions);
	};

	const removeQuestion = (index: number) => {
		const updatedQuestions = questions.filter((_: any, i: any) => i !== index);
		setQuestions(updatedQuestions);
		formik.setFieldValue('questions', updatedQuestions);
	};

	const handleQuestionChange = (index: number, field: string, value: string) => {
		const updatedQuestions = [...questions];
		updatedQuestions[index][field] = value;
		setQuestions(updatedQuestions);
		formik.setFieldValue('questions', updatedQuestions);
	};

	return (
		<form className='space-y-6' onSubmit={formik.handleSubmit}>
			{/* Question Fields */}
			<div className='space-y-4'>
				{questions?.map((question: any, index: any) => (
					<Card
						shadow='none'
						key={index}
						className='rounded-lg border  p-4  dark:border-gray-700'>
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
							{/* Language Code Select */}
							<div>
								<label
									htmlFor={`questions[${index}].langCode`}
									className='text-sm font-medium'>
									Language Code
								</label>
								<Select
									id={`questions[${index}].langCode`}
									name={`questions[${index}].langCode`}
									value={question.langCode}
									onChange={(e) =>
										handleQuestionChange(index, 'langCode', e.target.value)
									}
									onBlur={formik.handleBlur}
									placeholder='Select Language Code'>
									<option value=''>Select</option>
									<option value='lo'>Lao</option>
									<option value='th'>Thai</option>
									<option value='vn'>Vietnamese</option>
									<option value='en'>English</option>
								</Select>
								{/*{formik.touched.questions?.[index] &&*/}
								{/*	formik.errors.questions?.[index] &&*/}
								{/*	formik.errors.questions[index]?.langCode && (*/}
								{/*		<div className='text-sm text-red-500'>*/}
								{/*			{formik.errors.questions[index]?.langCode}*/}
								{/*		</div>*/}
								{/*	)}*/}
							</div>

							{/* Question Input */}
							<div>
								<label
									htmlFor={`questions[${index}].questionDetail`}
									className='text-sm font-medium'>
									Question
								</label>
								<Input
									id={`questions[${index}].questionDetail`}
									name={`questions[${index}].questionDetail`}
									type='text'
									value={question.questionDetail}
									onChange={(e) =>
										handleQuestionChange(
											index,
											'questionDetail',
											e.target.value,
										)
									}
									onBlur={formik.handleBlur}
									placeholder='Enter the question'
								/>
								{/*{formik.touched.questions?.[index]?.questionDetail &&*/}
								{/*	formik.errors.questions?.[index]?.questionDetail && (*/}
								{/*		<div className='text-sm text-red-500'>*/}
								{/*			{formik.errors.questions[index].questionDetail}*/}
								{/*		</div>*/}
								{/*	)}*/}
							</div>
						</div>

						{/* Remove Button */}
						{questions.length > 1 && (
							<div className='mt-2 flex justify-end'>
								<Button
									color='danger'
									onClick={() => removeQuestion(index)}
									size='sm'
									variant='light'>
									<FaTrashAlt className='mr-2' /> Remove
								</Button>
							</div>
						)}
					</Card>
				))}
			</div>

			{/* Add Question Button */}
			<div className='flex  justify-center'>
				<Button
					color='primary'
					variant='bordered'
					onPress={addQuestion}
					type='button'
					className='w-full'
					size='md'>
					<FaPlus className='mr-2' /> Add Question
				</Button>
			</div>

			{/* Status Selection */}
			<div>
				<label htmlFor='status' className='text-sm font-medium'>
					Status
				</label>
				<Select
					id='status'
					name='status'
					value={formik.values.status ? 'true' : 'false'}
					onChange={(e) => formik.setFieldValue('status', e.target.value === 'true')}
					onBlur={formik.handleBlur}>
					<option value='true'>Active</option>
					<option value='false'>Inactive</option>
				</Select>
				{formik.touched.status && formik.errors.status && (
					<div className='text-sm text-red-500'>{String(formik.errors.status)}</div>
				)}
			</div>

			{/* Submit & Cancel Buttons */}
			<div className='mt-6 flex gap-4 pb-4'>
				<Button color='primary' className='w-full' type='submit'>
					Save
				</Button>
				<Button color='default' className='w-full' onPress={onCancel} type='button'>
					Cancel
				</Button>
			</div>
		</form>
	);
};

export default QuestionForm;
