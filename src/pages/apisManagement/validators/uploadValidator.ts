import * as Yup from 'yup';
import { UploadApiFormValues } from '@/pages/apisManagement/types/apisManagement.types.ts';

export const validationSchema = Yup.object<UploadApiFormValues>({
	trn_id: Yup.string().required('Transaction ID is required'),
	trn_desc: Yup.string().required('Transaction description is required'),
	bis_date: Yup.string().required('Business date is required'),
	status: Yup.string().required('Status is required'),
	create_date: Yup.string().required('Create date is required'),
	currency: Yup.string().required('Currency is required'),
	acc_book: Yup.string().required('Account book is required'),
	// ex_rate: Yup.string().required('Exchange rate is required'),
	debit: Yup.array()
		.of(
			Yup.object({
				dr_ac: Yup.string().required('Debit account is required'),
				dr_amt: Yup.string().required('Debit amount is required'),
				dr_desc: Yup.string().required('Debit description is required'),
			}),
		)
		.min(1, 'At least one debit entry is required')
		.required('Debit entries are required'),
	credit: Yup.array()
		.of(
			Yup.object({
				cr_ac: Yup.string().required('Credit account is required'),
				cr_amt: Yup.string().required('Credit amount is required'),
			}),
		)
		.min(1, 'At least one credit entry is required')
		.required('Credit entries are required'),
});
