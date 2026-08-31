import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/form/Input.tsx';
import { Button, Switch } from '@heroui/react';
import { NumericFormat } from 'react-number-format';
import Select from '@/components/form/Select'; // Import Select components

interface TxnLimitFormProps {
	customerType: any[];
	initialValues: {
		avlLmt: number;
		ccy: string;
		code: string;
		crLmt: number;
		drLmt: number;
		lmtName: string;
		lmtPerday: number | null;
		lmtPermth: number | null;
		lmtPertxn: number | null;
		pd: boolean;
		pm: boolean;
		ptxn: boolean;
		crdr: any;
		status: boolean;
		toType: string;
		custType: any | null;
	};
	onSubmit: (values: any) => void;
	onCancel: () => void;
	isEditMode: boolean;
}

const TxnLimitForm: React.FC<TxnLimitFormProps> = ({
	customerType,
	initialValues,
	onSubmit,
	onCancel,
	isEditMode,
}) => {
	console.log('customerType', customerType);
	// Default values for Add mode
	const addModeDefaultValues = {
		code: 'MSP001', // Default code for new records
		customerTypeId: 1, // Default customer type ID
		crdr: 'CREDIT', // Default creditor/debit type
		toType: 'ACCOUNT', // Default account or QR type
	};

	const formik = useFormik({
		initialValues: isEditMode ? initialValues : { ...addModeDefaultValues, ...initialValues },
		validationSchema: Yup.object().shape({
			ccy: Yup.string().required('Currency is required'),
			lmtPerday: Yup.string()

				.required('Limit Per Day is required')
				.min(0, 'Must be greater than or equal to 0'),
			lmtPermth: Yup.string()

				.required('Limit Per Month is required')
				.min(0, 'Must be greater than or equal to 0'),
			lmtPertxn: Yup.string()

				.required('Limit Per Transaction is required')
				.min(0, 'Must be greater than or equal to 0'),
			status: Yup.boolean(),
			code: Yup.string().when('isEditMode', (isEditMode, schema) =>
				isEditMode ? schema.required('Code is required in edit mode') : schema,
			),

			crdr: Yup.string().required('Creditor/Debit is required'),
			toType: Yup.string().required('Account or QR is required'),
		}),
		onSubmit,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<div className='flex flex-col gap-4 py-6'>
				{/* Currency */}
				<div>
					<label htmlFor='ccy'>Currency</label>
					<Input
						id='ccy'
						name='ccy'
						value={formik.values.ccy}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder='Currency'
						className='mt-1'
						isValid={!formik.errors.ccy}
						isTouched={formik.touched.ccy}
						invalidFeedback={formik.errors.ccy}
					/>
				</div>
				<div>
					<label htmlFor='code'>Code</label>
					<Input
						id='code'
						name='code'
						value={formik.values.code}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder='code'
						className='mt-1'
						isValid={!formik.errors.code}
						isTouched={formik.touched.code}
						invalidFeedback={formik.errors.code}
					/>
				</div>
				{/* Limit Per Day */}
				<div>
					<label htmlFor='limitPerDay'>Limit Per Day</label>
					<NumericFormat
						value={formik.values.lmtPerday || ''}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						customInput={Input}
						thousandSeparator
						id='lmtPerday'
						name='lmtPerday'
						type='text'
						placeholder='Limit Per Day'
						className='mt-1'
						isValid={!formik.errors.lmtPerday}
						isTouched={formik.touched.lmtPerday}
						invalidFeedback={formik.errors.lmtPerday}
					/>
				</div>

				{/* Limit Per Month */}
				<div>
					<label htmlFor='limitPerMonth'>Limit Per Month</label>
					<NumericFormat
						value={formik.values.lmtPermth || ''}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						customInput={Input}
						thousandSeparator
						id='lmtPermth'
						name='lmtPermth'
						type='text'
						placeholder='Limit Per Month'
						className='mt-1'
						isValid={!formik.errors.lmtPermth}
						isTouched={formik.touched.lmtPermth}
						invalidFeedback={formik.errors.lmtPermth}
					/>
				</div>

				{/* Limit Per Transaction */}
				<div>
					<label htmlFor='limitPerTxn'>Limit Per Transaction</label>
					<NumericFormat
						value={formik.values.lmtPertxn || ''}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						customInput={Input}
						thousandSeparator
						id='lmtPertxn'
						name='lmtPertxn'
						type='text'
						placeholder='Limit Per Transaction'
						className='mt-1'
						isValid={!formik.errors.lmtPertxn}
						isTouched={formik.touched.lmtPertxn}
						invalidFeedback={formik.errors.lmtPertxn}
					/>
				</div>

				{/* Customer Type ID */}
				{customerType.length > 0 && (
					<div>
						<label htmlFor='customerTypeId'>Customer Type</label>
						<Select
							id='customerTypeId'
							name='customerTypeId'
							value={formik.values?.custType?.id || ''}
							onChange={(e) => {
								formik.setFieldValue('custType.id', e.target.value);
							}}
							onBlur={formik.handleBlur}
							placeholder='Select Customer'>
							{customerType.map((customer) => (
								<option key={customer.id} value={customer.id}>
									{customer.nameLa}
								</option>
							))}
						</Select>
						{formik.touched.custType && formik.errors.custType && (
							<div className='text-red-500'>{String(formik.errors.custType)}</div>
						)}
					</div>
				)}

				{/* Creditor/Debit Select */}
				<div>
					<label htmlFor='crdr'>Creditor/Debit</label>
					<Select
						id='crdr'
						name='crdr'
						value={
							isEditMode
								? formik.values.crdr === 'D'
									? 'DEBIT'
									: 'CREDIT'
								: formik.values.crdr
						}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder='Select Creditor or Debit'>
						<option value='CREDIT'>CREDIT</option>
						<option value='DEBIT'>DEBIT</option>
					</Select>
					{formik.touched.crdr && formik.errors.crdr && (
						<div className='text-red-500'>{String(formik.errors.crdr)}</div>
					)}
				</div>

				{/* Account or QR Select */}
				<div>
					<label htmlFor='toType'>Account or QR</label>

					<Select
						id='toType'
						name='toType'
						value={formik.values.toType}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder='Select Account or QR'>
						<option value='ACCOUNT'>ACCOUNT</option>
						<option value='QR'>QR</option>
					</Select>
					{formik.touched.toType && formik.errors.toType && (
						<div className='text-red-500'>{String(formik.errors.toType)}</div>
					)}
				</div>

				{/* Status */}
				<div>
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

				{/* Submit and Cancel Buttons */}
				<div className='flex gap-4'>
					<Button color='primary' className='w-full' type='submit'>
						{isEditMode ? 'Update' : 'Add'}
					</Button>
					<Button color='default' className='w-full' onPress={onCancel}>
						Cancel
					</Button>
				</div>
			</div>
		</form>
	);
};

export default TxnLimitForm;
