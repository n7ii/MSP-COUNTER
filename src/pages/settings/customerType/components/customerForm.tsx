import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/form/Input.tsx';
import { Button, Switch } from '@heroui/react';

interface CustomerTypeFormProps {
	initialValues: {
		nameEn: string;
		nameLa: string;
		status: boolean;
		feeStatus: boolean;
		tplStatus: boolean;
		lmtPertxn: string;
	};
	onSubmit: (values: any) => void;
	onCancel: () => void;
}

const CustomerTypeForm: React.FC<CustomerTypeFormProps> = ({
	initialValues,
	onSubmit,
	onCancel,
}) => {
	const validationSchema = Yup.object().shape({
		nameEn: Yup.string().required('Name (EN) is required'),
		nameLa: Yup.string().required('Name (LA) is required'),
		status: Yup.boolean(),
		feeStatus: Yup.boolean(),
		tplStatus: Yup.boolean(),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<div className='flex flex-col gap-4 py-6'>
				{/* Name EN */}
				<div>
					<label htmlFor='nameEn'>Name (EN)</label>
					<Input
						id='nameEn'
						name='nameEn'
						value={formik.values.nameEn}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder='Name (EN)'
						className='mt-1'
					/>
					{formik.touched.nameEn && formik.errors.nameEn && (
						<div className='text-red-500'>{formik.errors.nameEn}</div>
					)}
				</div>

				{/* Name LA */}
				<div>
					<label htmlFor='nameLa'>Name (LA)</label>
					<Input
						id='nameLa'
						name='nameLa'
						value={formik.values.nameLa}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder='Name (LA)'
						className='mt-1'
					/>
					{formik.touched.nameLa && formik.errors.nameLa && (
						<div className='text-red-500'>{formik.errors.nameLa}</div>
					)}
				</div>

				{/* Status */}
				<div className='flex items-center gap-10 py-4'>
					{/* Status */}
					<div className='flex items-center gap-2'>
						<label htmlFor='status' className='pr-2'>
							Status
						</label>
						<Switch
							id='status'
							name='status'
							defaultSelected={formik.values.status}
							onChange={(e) => formik.setFieldValue('status', e.target.checked)}
							aria-label='Status'
						/>
					</div>

					{/* Fee Status */}
					<div className='flex items-center gap-2'>
						<label htmlFor='feeStatus' className='pr-2'>
							Fee Status
						</label>
						<Switch
							id='feeStatus'
							name='feeStatus'
							defaultSelected={formik.values.feeStatus}
							onChange={(e) => formik.setFieldValue('feeStatus', e.target.checked)}
							aria-label='Fee Status'
						/>
					</div>

					{/* Template Status */}
					<div className='flex items-center gap-2'>
						<label htmlFor='tplStatus' className='pr-2'>
							Template Status
						</label>
						<Switch
							id='tplStatus'
							name='tplStatus'
							defaultSelected={formik.values.tplStatus}
							onChange={(e) => formik.setFieldValue('tplStatus', e.target.checked)}
							aria-label='Template Status'
						/>
					</div>
				</div>

				{/* Submit and Cancel Buttons */}
				<div className='flex gap-4'>
					<Button color='primary' className='w-full' type='submit'>
						Save
					</Button>
					<Button color='default' className='w-full' onPress={onCancel}>
						Cancel
					</Button>
				</div>
			</div>
		</form>
	);
};

export default CustomerTypeForm;
