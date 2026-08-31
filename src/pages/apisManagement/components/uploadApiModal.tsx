import { useFormik, FormikErrors, FormikTouched } from 'formik';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import { Button as HeroButton } from '@heroui/react';
import Input from '@/components/form/Input.tsx';
import Label from '@/components/form/Label.tsx';
import Button from '@/components/ui/Button.tsx';
import {
	CreditEntry,
	DebitEntry,
	UploadApiFormValues,
	UploadApiModalProps,
} from '@/pages/apisManagement/types/apisManagement.types.ts';
import { validationSchema } from '@/pages/apisManagement/validators/uploadValidator.ts';

const UploadApiModal = ({ isOpen, onClose, onSubmit, isLoading }: UploadApiModalProps) => {
	const formik = useFormik<UploadApiFormValues>({
		initialValues: {
			trn_id: '',
			trn_desc: '',
			bis_date: '',
			status: '',
			create_date: '',
			// currency: '',
			acc_book: '',
			// ex_rate: '',
			debit: [{ dr_ac: '', dr_amt: '', dr_desc: '' }],
			credit: [{ cr_ac: '', cr_amt: '' }],
		},
		validationSchema,
		onSubmit: async (values) => {
			await onSubmit(values);
			formik.resetForm();
		},
	});

	// Number formatting helper functions
	const formatNumber = (value: string): string => {
		// Remove all non-digit characters except decimal point
		const cleanValue = value.replace(/[^\d.]/g, '');

		// Prevent multiple decimal points
		const parts = cleanValue.split('.');
		if (parts.length > 2) {
			return parts[0] + '.' + parts.slice(1).join('');
		}

		// Format with thousand separators
		if (cleanValue === '') return '';

		const [integerPart, decimalPart] = cleanValue.split('.');
		const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

		return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
	};

	const unformatNumber = (value: string): string => {
		// Remove commas for storing the actual value
		return value.replace(/,/g, '');
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
		const inputValue = e.target.value;
		const unformattedValue = unformatNumber(inputValue);

		// Update formik with unformatted value
		formik.setFieldValue(fieldName, unformattedValue);
	};

	const addDebitEntry = (): void => {
		formik.setFieldValue('debit', [
			...formik.values.debit,
			{ dr_ac: '', dr_amt: '', dr_desc: '' },
		]);
	};

	const removeDebitEntry = (index: number): void => {
		const newDebit = formik.values.debit.filter((_, i) => i !== index);
		formik.setFieldValue('debit', newDebit);
	};

	const addCreditEntry = (): void => {
		formik.setFieldValue('credit', [...formik.values.credit, { cr_ac: '', cr_amt: '' }]);
	};

	const removeCreditEntry = (index: number): void => {
		const newCredit = formik.values.credit.filter((_, i) => i !== index);
		formik.setFieldValue('credit', newCredit);
	};

	const handleClose = (): void => {
		formik.resetForm();
		onClose();
	};

	// Helper function to get nested error messages
	const getDebitError = (index: number, field: keyof DebitEntry): string | undefined => {
		const errors = formik.errors.debit as FormikErrors<DebitEntry>[] | undefined;
		return errors?.[index]?.[field] as string | undefined;
	};

	const getDebitTouched = (index: number, field: keyof DebitEntry): boolean => {
		const touched = formik.touched.debit as FormikTouched<DebitEntry>[] | undefined;
		return touched?.[index]?.[field] as boolean;
	};

	const getCreditError = (index: number, field: keyof CreditEntry): string | undefined => {
		const errors = formik.errors.credit as FormikErrors<CreditEntry>[] | undefined;
		return errors?.[index]?.[field] as string | undefined;
	};

	const getCreditTouched = (index: number, field: keyof CreditEntry): boolean => {
		const touched = formik.touched.credit as FormikTouched<CreditEntry>[] | undefined;
		return touched?.[index]?.[field] as boolean;
	};

	return (
		<ModalProvider
			isOpen={isOpen}
			onOpenChange={handleClose}
			title='ອັບໂຫລດ API Data'
			size='5xl'
			scrollBehavior='inside'>
			<form onSubmit={formik.handleSubmit} className='space-y-6 py-4'>
				{/* Basic Information */}
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					<div>
						<Label htmlFor='trn_id' className='mb-2 block'>
							Transaction ID *
						</Label>
						<Input
							id='trn_id'
							name='trn_id'
							value={formik.values.trn_id}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={
								formik.touched.trn_id && formik.errors.trn_id
									? 'border-red-500'
									: ''
							}
						/>
						{formik.touched.trn_id && formik.errors.trn_id && (
							<p className='mt-1 text-sm text-red-500'>{formik.errors.trn_id}</p>
						)}
					</div>

					<div>
						<Label htmlFor='trn_desc' className='mb-2 block'>
							Transaction Description *
						</Label>
						<Input
							id='trn_desc'
							name='trn_desc'
							value={formik.values.trn_desc}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={
								formik.touched.trn_desc && formik.errors.trn_desc
									? 'border-red-500'
									: ''
							}
						/>
						{formik.touched.trn_desc && formik.errors.trn_desc && (
							<p className='mt-1 text-sm text-red-500'>{formik.errors.trn_desc}</p>
						)}
					</div>

					<div>
						<Label htmlFor='bis_date' className='mb-2 block'>
							Business Date *
						</Label>
						<Input
							id='bis_date'
							name='bis_date'
							type='date'
							value={formik.values.bis_date}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={
								formik.touched.bis_date && formik.errors.bis_date
									? 'border-red-500'
									: ''
							}
						/>
						{formik.touched.bis_date && formik.errors.bis_date && (
							<p className='mt-1 text-sm text-red-500'>{formik.errors.bis_date}</p>
						)}
					</div>

					<div>
						<Label htmlFor='status' className='mb-2 block'>
							Status *
						</Label>
						<Input
							id='status'
							name='status'
							value={formik.values.status}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={
								formik.touched.status && formik.errors.status
									? 'border-red-500'
									: ''
							}
						/>
						{formik.touched.status && formik.errors.status && (
							<p className='mt-1 text-sm text-red-500'>{formik.errors.status}</p>
						)}
					</div>

					<div>
						<Label htmlFor='create_date' className='mb-2 block'>
							Create Date *
						</Label>
						<Input
							id='create_date'
							name='create_date'
							type='datetime-local'
							value={formik.values.create_date}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={
								formik.touched.create_date && formik.errors.create_date
									? 'border-red-500'
									: ''
							}
						/>
						{formik.touched.create_date && formik.errors.create_date && (
							<p className='mt-1 text-sm text-red-500'>{formik.errors.create_date}</p>
						)}
					</div>

					<div>
						<Label htmlFor='currency' className='mb-2 block'>
							Currency *
						</Label>
						<Input
							id='currency'
							name='currency'
							value={formik.values.currency}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={
								formik.touched.currency && formik.errors.currency
									? 'border-red-500'
									: ''
							}
						/>
						{formik.touched.currency && formik.errors.currency && (
							<p className='mt-1 text-sm text-red-500'>{formik.errors.currency}</p>
						)}
					</div>

					<div>
						<Label htmlFor='acc_book' className='mb-2 block'>
							Account Book *
						</Label>
						<Input
							id='acc_book'
							name='acc_book'
							value={formik.values.acc_book}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={
								formik.touched.acc_book && formik.errors.acc_book
									? 'border-red-500'
									: ''
							}
						/>
						{formik.touched.acc_book && formik.errors.acc_book && (
							<p className='mt-1 text-sm text-red-500'>{formik.errors.acc_book}</p>
						)}
					</div>

					{/*<div>*/}
					{/*	<Label htmlFor='ex_rate' className='mb-2 block'>*/}
					{/*		Exchange Rate **/}
					{/*	</Label>*/}
					{/*	<Input*/}
					{/*		id='ex_rate'*/}
					{/*		name='ex_rate'*/}
					{/*		type='number'*/}
					{/*		step='0.01'*/}
					{/*		value={formik.values.ex_rate}*/}
					{/*		onChange={formik.handleChange}*/}
					{/*		onBlur={formik.handleBlur}*/}
					{/*		className={*/}
					{/*			formik.touched.ex_rate && formik.errors.ex_rate*/}
					{/*				? 'border-red-500'*/}
					{/*				: ''*/}
					{/*		}*/}
					{/*	/>*/}
					{/*	{formik.touched.ex_rate && formik.errors.ex_rate && (*/}
					{/*		<p className='mt-1 text-sm text-red-500'>{formik.errors.ex_rate}</p>*/}
					{/*	)}*/}
					{/*</div>*/}
				</div>

				{/* Debit Entries */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<Label htmlFor='' className='text-lg font-semibold'>
							Debit Entries *
						</Label>
						<Button
							onClick={addDebitEntry}
							variant='outline'
							color='emerald'
							size='sm'
							icon='HeroPlus'>
							Add Debit
						</Button>
					</div>

					{formik.values.debit.map((debit, index) => (
						<div
							key={index}
							className='rounded-lg border border-zinc-200 p-4 dark:border-zinc-700'>
							<div className='mb-4 flex items-center justify-between'>
								<span className='text-sm font-medium'>Debit Entry {index + 1}</span>
								{formik.values.debit.length > 1 && (
									<Button
										onClick={() => removeDebitEntry(index)}
										variant='outline'
										color='red'
										size='sm'
										icon='HeroXMark'>
										Remove
									</Button>
								)}
							</div>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
								<div>
									<Label htmlFor={`debit.${index}.dr_ac`} className='mb-2 block'>
										Debit Account *
									</Label>
									<Input
										id={`debit.${index}.dr_ac`}
										name={`debit.${index}.dr_ac`}
										value={debit.dr_ac}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className={
											getDebitTouched(index, 'dr_ac') &&
											getDebitError(index, 'dr_ac')
												? 'border-red-500'
												: ''
										}
									/>
									{getDebitTouched(index, 'dr_ac') &&
										getDebitError(index, 'dr_ac') && (
											<p className='mt-1 text-sm text-red-500'>
												{getDebitError(index, 'dr_ac')}
											</p>
										)}
								</div>

								<div>
									<Label htmlFor={`debit.${index}.dr_amt`} className='mb-2 block'>
										Debit Amount *
									</Label>
									<Input
										id={`debit.${index}.dr_amt`}
										name={`debit.${index}.dr_amt`}
										value={formatNumber(debit.dr_amt)}
										onChange={(e) =>
											handleAmountChange(e, `debit.${index}.dr_amt`)
										}
										onBlur={formik.handleBlur}
										placeholder='0.00'
										className={
											getDebitTouched(index, 'dr_amt') &&
											getDebitError(index, 'dr_amt')
												? 'border-red-500'
												: ''
										}
									/>
									{getDebitTouched(index, 'dr_amt') &&
										getDebitError(index, 'dr_amt') && (
											<p className='mt-1 text-sm text-red-500'>
												{getDebitError(index, 'dr_amt')}
											</p>
										)}
								</div>

								<div>
									<Label
										htmlFor={`debit.${index}.dr_desc`}
										className='mb-2 block'>
										Debit Description *
									</Label>
									<Input
										id={`debit.${index}.dr_desc`}
										name={`debit.${index}.dr_desc`}
										value={debit.dr_desc}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className={
											getDebitTouched(index, 'dr_desc') &&
											getDebitError(index, 'dr_desc')
												? 'border-red-500'
												: ''
										}
									/>
									{getDebitTouched(index, 'dr_desc') &&
										getDebitError(index, 'dr_desc') && (
											<p className='mt-1 text-sm text-red-500'>
												{getDebitError(index, 'dr_desc')}
											</p>
										)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Credit Entries */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<Label htmlFor='' className='text-lg font-semibold'>
							Credit Entries *
						</Label>
						<Button
							onClick={addCreditEntry}
							variant='outline'
							color='emerald'
							size='sm'
							icon='HeroPlus'>
							Add Credit
						</Button>
					</div>

					{formik.values.credit.map((credit, index) => (
						<div
							key={index}
							className='rounded-lg border border-zinc-200 p-4 dark:border-zinc-700'>
							<div className='mb-4 flex items-center justify-between'>
								<span className='text-sm font-medium'>
									Credit Entry {index + 1}
								</span>
								{formik.values.credit.length > 1 && (
									<Button
										onClick={() => removeCreditEntry(index)}
										variant='outline'
										color='red'
										size='sm'
										icon='HeroXMark'>
										Remove
									</Button>
								)}
							</div>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<div>
									<Label htmlFor={`credit.${index}.cr_ac`} className='mb-2 block'>
										Credit Account *
									</Label>
									<Input
										id={`credit.${index}.cr_ac`}
										name={`credit.${index}.cr_ac`}
										value={credit.cr_ac}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className={
											getCreditTouched(index, 'cr_ac') &&
											getCreditError(index, 'cr_ac')
												? 'border-red-500'
												: ''
										}
									/>
									{getCreditTouched(index, 'cr_ac') &&
										getCreditError(index, 'cr_ac') && (
											<p className='mt-1 text-sm text-red-500'>
												{getCreditError(index, 'cr_ac')}
											</p>
										)}
								</div>

								<div>
									<Label
										htmlFor={`credit.${index}.cr_amt`}
										className='mb-2 block'>
										Credit Amount *
									</Label>
									<Input
										id={`credit.${index}.cr_amt`}
										name={`credit.${index}.cr_amt`}
										value={formatNumber(credit.cr_amt)}
										onChange={(e) =>
											handleAmountChange(e, `credit.${index}.cr_amt`)
										}
										onBlur={formik.handleBlur}
										placeholder='0.00'
										className={
											getCreditTouched(index, 'cr_amt') &&
											getCreditError(index, 'cr_amt')
												? 'border-red-500'
												: ''
										}
									/>
									{getCreditTouched(index, 'cr_amt') &&
										getCreditError(index, 'cr_amt') && (
											<p className='mt-1 text-sm text-red-500'>
												{getCreditError(index, 'cr_amt')}
											</p>
										)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Submit Buttons */}
				<div className='flex gap-3 pt-4'>
					<HeroButton
						type='submit'
						className='flex-1'
						color='primary'
						size='lg'
						isLoading={isLoading}
						isDisabled={!formik.isValid || isLoading}>
						ອັບໂຫລດ
					</HeroButton>
					<HeroButton
						type='button'
						className='flex-1'
						color='default'
						variant='bordered'
						size='lg'
						onPress={handleClose}
						isDisabled={isLoading}>
						ຍົກເລີກ
					</HeroButton>
				</div>
			</form>
		</ModalProvider>
	);
};

export default UploadApiModal;
