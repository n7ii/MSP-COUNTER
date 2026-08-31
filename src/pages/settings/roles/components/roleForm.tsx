import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/form/Input.tsx';
import { Button } from '@heroui/react';

interface FeeFormProps {
	initialValues: any;
	onSubmit: (values: any) => void;
	onCancel: () => void;
}

const RoleForm: React.FC<FeeFormProps> = ({ initialValues, onSubmit, onCancel }) => {
	const validationSchema = Yup.object({
		roleName: Yup.string().required('Currency is required'),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit,
	});
	console.log('formik.values', formik.values.roleName);
	return (
		<form className='space-y-4' onSubmit={formik.handleSubmit}>
			{/* To Amount Field */}
			<div>
				<label htmlFor='roleName'>Role name</label>
				<Input
					id='roleName'
					name='roleName'
					type='text'
					value={formik.values.roleName}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					placeholder='Role Name'
					className='mt-1'
				/>
				{formik.touched.roleName && formik.errors.roleName && (
					<div className='text-red-500'>{String(formik.errors.roleName)}</div>
				)}
			</div>

			{/* Actions */}
			<div className='mt-4 flex gap-4'>
				<Button color='primary' className='w-full' type='submit'>
					Save
				</Button>
				<Button color='default' className='w-full' onPress={onCancel}>
					Cancel
				</Button>
			</div>
		</form>
	);
};

export default RoleForm;
