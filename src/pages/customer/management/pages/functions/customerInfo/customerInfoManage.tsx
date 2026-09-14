import Input from '@/components/form/Input.tsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@heroui/react';
import {
	useGetCustomerDocsQuery,
	useUpdateCustomerInfoMutation,
	useUpdateCustomerTypeMutation,
} from '@/pages/customer/redux/queries/customerApiSlice.ts';
import { AlertService } from '@/common/services/alert.service.ts';
import { useParams } from 'react-router-dom';
import KycDoc from '@/pages/customer/approve/components/customerTabs/kycDoc.tsx';
import Select from '@/components/form/Select.tsx';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useGetCustomerTypeQuery } from '@/pages/settings/redux/queries/customerTypeApiSlice.ts';

const Alert = new AlertService();

const CustomerInfoManage = ({ userInfo }: any) => {
	const [updateCustomerInfo, { isLoading }] = useUpdateCustomerInfoMutation();
	const [updateCustomerType, { isLoading: isUpdatingType }] = useUpdateCustomerTypeMutation();
	const { id } = useParams();
	const { data: CustomerDoc } = useGetCustomerDocsQuery({ id });

	const { data: customerTypesData } = useGetCustomerTypeQuery({
		page: 0,
		size: 10000,
	});
	const customerTypes = customerTypesData?.body?.content || [];
	const [selectedCustomerType, setSelectedCustomerType] = useState<string>('');

	const isMephom = CustomerDoc?.body?.useMeepom;
	const mspDoc = CustomerDoc?.body?.msp || userInfo?.documents?.[0];
	const meepomDoc = CustomerDoc?.body?.meepom;

	// Set initial customer type value
	useEffect(() => {
		if (userInfo?.customer?.custType?.id) {
			setSelectedCustomerType(userInfo.customer?.custType?.id.toString());
		}
	}, [userInfo]);

	const formik = useFormik({
		initialValues: {
			customerId: userInfo?.customer?.customerId || 1,
			prefix: userInfo?.prefix?.fixName || '',
			firstNameLa: userInfo?.firstNameLa || '',
			lastNameLa: userInfo?.lastNameLa || '',
			firstNameEn: userInfo?.firstNameEn || '',
			lastNameEn: userInfo?.lastNameEn || '',
			gender: userInfo?.gender?.fixName || '',
			birthday: userInfo?.birthday || '',
			tel: userInfo?.tel || '',
			email: userInfo?.email || '',
		},
		validationSchema: Yup.object({
			firstNameEn: Yup.string().required('First Name (EN) is required'),
			lastNameEn: Yup.string().required('Last Name (EN) is required'),
			tel: Yup.string()
				.matches(/^\d+$/, 'Phone number must contain only digits')
				.min(8, 'Phone number must be at least 8 digits')
				.required('Phone number is required'),
			email: Yup.string().required('Email is required'),
			birthday: Yup.string().required('Birthday is required'),
		}),
		onSubmit: async (values) => {
			console.log('Submitting form...', values);
			try {
				const result = await Alert.confirmModal(
					'Are you sure you want to update this info?',
				);
				if (result.isConfirmed) {
					// Update customer info
					await updateCustomerInfo({
						customerId: values.customerId,
						data: {
							firstNamela: values.firstNameLa,
							lastNamela: values.lastNameLa,
							firstNameEn: values.firstNameEn,
							lastNameEn: values.lastNameEn,
							gender: values.gender === 'Male' ? 'M' : 'F',
							email: values.email,
							birthday: values.birthday,
							prefix: values.prefix,
							tel: values.tel,
						},
					}).unwrap();

					// Update customer type if changed
					if (
						selectedCustomerType &&
						selectedCustomerType !== userInfo?.customerType?.id?.toString()
					) {
						await updateCustomerType({
							customerId: values.customerId,
							data: {
								ctmtypeId: parseInt(selectedCustomerType),
							},
						}).unwrap();
					}

					Alert.success('Customer info updated successfully!');
				}
			} catch (error) {
				console.error('Failed to update customer info:', error);
				Alert.error('Failed to update customer info.');
			}
		},
	});

	// Handle customer type change
	const handleCustomerTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCustomerType(e.target.value);
	};

	// Handle standalone customer type update
	const handleUpdateCustomerType = async () => {
		if (!selectedCustomerType) {
			toast.error('ກະລຸນາເລືອກປະເພດລູກຄ້າ!');
			return;
		}

		try {
			const result = await Alert.confirmModal('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອັບເດດປະເພດລູກຄ້າ?');
			if (result.isConfirmed) {
				await updateCustomerType({
					customerId: formik.values.customerId,
					data: {
						ctmtypeId: parseInt(selectedCustomerType),
					},
				}).unwrap();

				Alert.success('ອັບເດດປະເພດລູກຄ້າສຳເລັດ!');
			}
		} catch (error) {
			console.error('Failed to update customer type:', error);
			Alert.error('ອັບເດດປະເພດລູກຄ້າບໍ່ສຳເລັດ.');
		}
	};

	return (
		<div className='rounded-lg p-6 pb-12'>
			<h1 className='mb-4 text-center text-xl font-semibold sm:text-left'>
				ແກ້ໄຂຂໍ້ມູນສ່ວນຕົວ
			</h1>
			<p className='mb-4 text-center font-light sm:text-left'>
				ຄຳແນະນຳ: This information will be displayed publicly so be careful what you share.
			</p>

			<form onSubmit={formik.handleSubmit} className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
				{/* Prefix */}
				<div className='w-full'>
					<label htmlFor='prefix'>ຄຳນຳໜ້າ</label>
					<Input
						id='prefix'
						name='prefix'
						value={formik.values.prefix}
						onChange={formik.handleChange}
						className='mt-1 w-full'
					/>
				</div>

				{/* Gender */}
				<div className='w-full'>
					<label htmlFor='gender'>ເພດ</label>
					<Input
						id='gender'
						name='gender'
						value={formik.values.gender}
						onChange={formik.handleChange}
						className='mt-1 w-full'
					/>
				</div>

				{/* First Name (Lao) */}
				<div className='w-full'>
					<label htmlFor='firstNameLa'>ຊື່ (ພາສາລາວ)</label>
					<Input
						id='firstNameLa'
						name='firstNameLa'
						value={formik.values.firstNameLa}
						onChange={formik.handleChange}
						className='mt-1 w-full'
					/>
				</div>

				{/* Last Name (Lao) */}
				<div className='w-full'>
					<label htmlFor='lastNameLa'>ນາມສະກຸນ (ພາສາລາວ)</label>
					<Input
						id='lastNameLa'
						name='lastNameLa'
						value={formik.values.lastNameLa}
						onChange={formik.handleChange}
						className='mt-1 w-full'
					/>
				</div>

				{/* First Name (English) */}
				<div className='w-full'>
					<label htmlFor='firstNameEn'>First Name (EN)</label>
					<Input
						id='firstNameEn'
						name='firstNameEn'
						value={formik.values.firstNameEn}
						onChange={formik.handleChange}
						className='mt-1 w-full'
					/>
				</div>

				{/* Last Name (English) */}
				<div className='w-full'>
					<label htmlFor='lastNameEn'>Last Name (EN)</label>
					<Input
						id='lastNameEn'
						name='lastNameEn'
						value={formik.values.lastNameEn}
						onChange={formik.handleChange}
						className='mt-1 w-full'
					/>
				</div>

				{/* Birthday */}
				<div className='w-full'>
					<label htmlFor='birthday'>ວັນເກີດ</label>
					<Input
						id='birthday'
						name='birthday'
						value={formik.values.birthday}
						onChange={formik.handleChange}
						className='mt-1 w-full'
					/>
				</div>

				{/* Phone Number */}
				<div className='w-full'>
					<label htmlFor='tel'>ເບີໂທ</label>
					<Input
						id='tel'
						name='tel'
						value={formik.values.tel}
						onChange={formik.handleChange}
						className='mt-1 w-full'
					/>
				</div>

				{/* Email */}
				<div className='w-full'>
					<label htmlFor='email'>ອີເມວ</label>
					<Input
						id='email'
						name='email'
						value={formik.values.email}
						onChange={formik.handleChange}
						className='mt-1 w-full'
					/>
				</div>

				{/* Customer Type Section */}
				<div className='col-span-1 w-full sm:col-span-2'>
					<h1 className='mb-4 mt-6 text-center text-xl font-semibold sm:text-left'>
						ແກ້ໄຂປະເພດລູກຄ້າ
					</h1>
					<div className='flex items-end gap-4'>
						<div className='flex-1'>
							<label htmlFor='customerType' className='mb-2 block'>
								ເລືອກປະເພດລູກຄ້າ
							</label>
							<Select
								id='customerType'
								name='customerType'
								className='w-full'
								value={selectedCustomerType}
								onChange={handleCustomerTypeChange}
								placeholder='ເລືອກປະເພດລູກຄ້າ'>
								{customerTypes?.map((type: any) => (
									<option key={type.id} value={type.id}>
										{type.nameLa} - {type.nameEn}
									</option>
								))}
							</Select>
						</div>
						<Button
							type='button'
							color='primary'
							radius='sm'
							isLoading={isUpdatingType}
							onPress={handleUpdateCustomerType}
							className='mb-1'>
							Update Type
						</Button>
					</div>
				</div>

				{/* Documents */}
				<div className='col-span-1 w-full sm:col-span-2'>
					<label htmlFor='documents' className='mb-2 block'>
						ໄຟລ໌ເອກະສານ
					</label>
					<KycDoc msp={mspDoc} meepom={meepomDoc} isMeepom={isMephom} />
				</div>

				{/* Submit Button */}
				<div className='col-span-1 w-full sm:col-span-2'>
					<Button
						type='submit'
						color='primary'
						className='w-full'
						radius='sm'
						isLoading={isLoading}>
						{isLoading ? 'Updating...' : 'Update Information'}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CustomerInfoManage;
