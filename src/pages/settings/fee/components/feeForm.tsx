import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/form/Input.tsx';
import { Button } from '@heroui/react';
import Select from '@/components/form/Select.tsx';

interface FeeFormProps {
	initialValues: any;
	customerData: { id: number; nameLa: string }[];
	onSubmit: (values: any) => void;
	onCancel: () => void;
}

const FeeForm: React.FC<FeeFormProps> = ({ initialValues, onSubmit, onCancel, customerData }) => {
	const validationSchema = Yup.object({
		ccy: Yup.string().required('Currency is required'),
		fee: Yup.number().required('Fee is required'),
		frmAmt: Yup.number().required('From Amount is required'),
		toAmt: Yup.number().required('To Amount is required'),
		customerTypeId: Yup.number().required('Customer Type is required'),
		status: Yup.boolean(),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit,
	});

	return (
		<form className='space-y-4' onSubmit={formik.handleSubmit}>
			{/* Currency Field */}
			<div>
				<label htmlFor='ccy'>Currency</label>
				<Select
					id='ccy'
					name='ccy'
					value={formik.values.ccy}
					onChange={(e) => {
						const selectedValue = e.target.value;
						formik.setFieldValue('ccy', selectedValue);

						// Synchronize `ccyFee` with `ccy`
						formik.setFieldValue('ccyFee', selectedValue);
					}}
					onBlur={formik.handleBlur}
					placeholder='Select Creditor or Debit'>
					<option value='MSP'>MSP</option>
					<option value='KIP'>KIP</option>
				</Select>
				{formik.touched.ccy && formik.errors.ccy && (
					<div className='text-red-500'>{String(formik.errors.ccy)}</div>
				)}
			</div>

			<div>
				<label htmlFor='ccyFee'>Currency Fee</label>
				<Select
					id='ccyFee'
					name='ccyFee'
					value={formik.values.ccyFee}
					onChange={(e) => {
						const selectedValue = e.target.value;
						formik.setFieldValue('ccyFee', selectedValue);

						// Synchronize `ccy` with `ccyFee`
						formik.setFieldValue('ccy', selectedValue);
					}}
					onBlur={formik.handleBlur}
					placeholder='Select Creditor or Debit'>
					<option value='MSP'>MSP</option>
					<option value='KIP'>KIP</option>
				</Select>
				{formik.touched.ccyFee && formik.errors.ccyFee && (
					<div className='text-red-500'>{String(formik.errors.ccyFee)}</div>
				)}
			</div>

			{/* Fee Field */}
			<div>
				<label htmlFor='fee'>Fee</label>
				<Input
					id='fee'
					name='fee'
					type='number'
					value={formik.values.fee}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					placeholder='Fee'
					className='mt-1'
				/>
				{formik.touched.fee && formik.errors.fee && (
					<div className='text-red-500'>{String(formik.errors.fee)}</div>
				)}
			</div>

			{/* From Amount Field */}
			<div>
				<label htmlFor='frmAmt'>From Amount</label>
				<Input
					id='frmAmt'
					name='frmAmt'
					type='number'
					value={formik.values.frmAmt}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					placeholder='From Amount'
					className='mt-1'
				/>
				{formik.touched.frmAmt && formik.errors.frmAmt && (
					<div className='text-red-500'>{String(formik.errors.frmAmt)}</div>
				)}
			</div>

			{/* To Amount Field */}
			<div>
				<label htmlFor='toAmt'>To Amount</label>
				<Input
					id='toAmt'
					name='toAmt'
					type='number'
					value={formik.values.toAmt}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					placeholder='To Amount'
					className='mt-1'
				/>
				{formik.touched.toAmt && formik.errors.toAmt && (
					<div className='text-red-500'>{String(formik.errors.toAmt)}</div>
				)}
			</div>

			{/* Customer Type Field */}
			<div>
				{customerData.length > 0 && (
					<>
						<label htmlFor='customerTypeId'>Customer Type</label>
						<Select
							id='customerTypeId'
							name='customerTypeId'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder='Select Customer'>
							{customerData.map((customer) => (
								<option key={customer.id} value={customer.id}>
									{customer.nameLa}
								</option>
							))}
						</Select>
						{formik.touched.customerTypeId && formik.errors.customerTypeId && (
							<div className='text-red-500'>
								{String(formik.errors.customerTypeId)}
							</div>
						)}
					</>
				)}
			</div>

			<div>
				<label htmlFor='toType'>ACCOUNT OR QR</label>
				<Select
					id='toType'
					name='toType'
					value={formik.values.toType}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					placeholder='Select Creditor or Debit'>
					<option value='ACCOUNT'>ACCOUNT</option>
					<option value='QR'>QR</option>
				</Select>
				{formik.touched.toType && formik.errors.toType && (
					<div className='text-red-500'>{String(formik.errors.toType)}</div>
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

export default FeeForm;
