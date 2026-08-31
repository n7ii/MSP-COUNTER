import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/form/Input.tsx';
import { Button, Switch } from '@heroui/react';
import Select from '@/components/form/Select';
import { NumericFormat } from 'react-number-format';
import * as React from 'react';

interface EWalletLimitFormProps {
	customerType: any[];
	initialValues: any;
	onSubmit: (values: any) => void;
	onCancel: () => void;
	isEditMode: boolean;
}

const EWalletLimitForm: React.FC<EWalletLimitFormProps> = ({
	customerType,
	initialValues,
	onSubmit,
	onCancel,
	isEditMode,
}) => {
	const formik: any = useFormik({
		initialValues,
		validationSchema: Yup.object().shape({
			ccy: Yup.string().required('Currency is required'),
			maxAmount: Yup.string()
				.required('Max Amount is required')
				.min(0, 'Max Amount must be at least 0'),
			minAmount: Yup.string()
				.required('Min Amount is required')
				.min(0, 'Min Amount must be at least 0'),
			cusTypeId: Yup.number().required('Customer Type is required'), // Changed from custType to cusTypeId
			status: Yup.boolean(),
		}),
		onSubmit,
	});
	console.log('formik', formik);

	return (
		<form onSubmit={formik.handleSubmit}>
			<div className='flex flex-col gap-4'>
				<div>
					<label>Currency</label>
					<Select
						id='ccy'
						name='ccy'
						value={formik.values.ccy}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}>
						<option value=''>Select Currency</option>
						<option value='LAK'>LAK</option>
						<option value='USD'>USD</option>
						<option value='THB'>THB</option>
					</Select>

					{formik.touched.ccy && formik.errors.ccy && (
						<p className='text-red-500'>{formik.errors.ccy}</p>
					)}
				</div>

				{/* Customer Type Field */}
				<div>
					<label>Customer Type</label>
					<Select
						id='cusTypeId' // Changed from custType to cusTypeId
						name='cusTypeId' // Changed from custType to cusTypeId
						value={formik.values.cusTypeId} // Changed to cusTypeId
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}>
						<option value=''>Select Customer Type</option>
						{customerType.map((customer) => (
							<option key={customer.id} value={customer.id}>
								{customer.nameLa}
							</option>
						))}
					</Select>

					{formik.touched.cusTypeId &&
						formik.errors.cusTypeId && ( // Changed from cusType to cusTypeId
							<p className='text-red-500'>{formik.errors.cusTypeId}</p>
						)}
				</div>

				{/* Max Amount Field */}
				<div>
					<label>Max Amount</label>
					<NumericFormat
						value={formik.values.maxAmount || ''}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						customInput={Input}
						thousandSeparator
						id='maxAmount'
						name='maxAmount'
						type='text'
						placeholder='Limit Per Day'
						className='mt-1'
						isValid={!formik.errors.maxAmount}
						isTouched={formik.touched.maxAmount}
						invalidFeedback={formik.errors.maxAmount}
					/>
				</div>

				{/* Min Amount Field */}
				<div>
					<label>Min Amount</label>
					<NumericFormat
						value={formik.values.minAmount || ''}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						customInput={Input}
						thousandSeparator
						id='minAmount'
						name='minAmount'
						type='text'
						placeholder='Limit Per Day'
						className='mt-1'
						isValid={!formik.errors.minAmount}
						isTouched={formik.touched.minAmount}
						invalidFeedback={formik.errors.minAmount}
					/>
				</div>

				{/* Status Field */}
				<div>
					<label>Status</label>
					<Switch
						id='status'
						name='status'
						checked={formik.values.status}
						onChange={(e) => formik.setFieldValue('status', e)}
					/>
				</div>

				{/* Buttons */}
				<div className='flex gap-x-2 py-4'>
					<Button
						color='primary'
						className='w-full'
						type='submit'
						disabled={!formik.isValid || formik.isSubmitting}>
						{isEditMode ? 'Update' : 'Create'}
					</Button>
					<Button className='w-full' color='default' onPress={onCancel}>
						Cancel
					</Button>
				</div>
			</div>
		</form>
	);
};

export default EWalletLimitForm;
