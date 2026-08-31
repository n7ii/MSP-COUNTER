import { useState } from 'react';
import { useFormik } from 'formik';

import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper.tsx';
import Input from '../../components/form/Input.tsx';
import FieldWrap from '../../components/form/FieldWrap.tsx';
import Icon from '../../components/icon/Icon.tsx';

import { signUp } from '@/redux/slices/auth/authSlice.ts';
import { useAppDispatch, useAppSelector } from '@/redux/hooks.ts';
import { APIStatus } from '@/types/apiType/api.type.ts';
import { Image } from '@heroui/image';
import { AlertService } from '@/common/services/alert.service.ts';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import toast from 'react-hot-toast';
import { PiFilePdf } from 'react-icons/pi';
import { HiDownload, HiChevronDown } from 'react-icons/hi';
import AdminRoot from '@/assets/pdf/ຄູ່ມືນຳໃຊ້_MSP-Admin-ROOT.pdf';
import STAFF from '@/assets/pdf/ຄູ່ມືນຳໃຊ້_MSP-STAFF.pdf';
import MKT from '@/assets/pdf/ຄູ່ມືນຳໃຊ້_MSP_MAKETING.pdf';

import logoMSP from '@/assets/logo/MSP_WHITE_ICON2.png';
import logo from '@/assets/logo/msp-blooming-feature.png';
import AuthTabSwitcher from '@/pages/auth/components/authTabSwithcer.tsx';
import RECON from '@/assets/pdf/ຄູ່ມືນຳໃຊ້ - MSPeWallet - Reconcile.pdf';

type TValues = {
	email: string;
	name: string;
	surname: string;
	username: string;
	password: string;
	tel: string;
};

// Document types with URLs
const documents = [
	{
		key: 'staff',
		label: 'ຄູ່ມືສຳລັບພະນັກງານ (Staff)',
		icon: <PiFilePdf size={20} className='text-blue-500' />,
		url: STAFF,
		filename: 'MSP_Staff_Manual.pdf',
	},
	{
		key: 'admin',
		label: 'ຄູ່ມືສຳລັບຜູ້ຄຸ້ມຄອງ (Admin)',
		icon: <PiFilePdf size={20} className='text-purple-500' />,
		url: AdminRoot,
		filename: 'MSP_Admin_Manual.pdf',
	},
	{
		key: 'root',
		label: 'ຄູ່ມືສຳລັບຜູ້ດູແລລະບົບ (Root)',
		icon: <PiFilePdf size={20} className='text-red-500' />,
		url: AdminRoot,
		filename: 'MSP_Root_Manual.pdf',
	},
	{
		key: 'marketing',
		label: 'ຄູ່ມືສຳລັບການຕະຫຼາດ (Marketing)',
		icon: <PiFilePdf size={20} className='text-green-500' />,
		url: MKT,
		filename: 'MSP_Marketing_Manual.pdf',
	},
	{
		key: 'marketing',
		label: 'ຄູ່ມືສຳລັບ (Reconsile)',
		icon: <PiFilePdf size={20} className='text-green-500' />,
		url: RECON,
		filename: 'MSP_Reconsile_Manual.pdf',
	},
];

const alert = new AlertService();

const SignUpPage = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authState = useAppSelector((state) => state.auth);

	const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);

	const formik = useFormik<TValues>({
		initialValues: {
			email: '',
			name: '',
			surname: '',
			username: '',
			password: '',
			tel: '',
		},
		validate: (values: TValues) => {
			const errors: Partial<TValues> = {};
			if (!values.email) {
				errors.email = 'ກະລຸນາໃສ່ອີເມວ';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'ອີເມວບໍ່ຖືກຕ້ອງ';
			}
			if (!values.name) errors.name = 'ກະລຸນາໃສ່ຊື່';
			if (!values.surname) errors.surname = 'ກະລຸນາໃສ່ນາມສະກຸນ';
			if (!values.username) errors.username = 'ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້';
			if (!values.password) {
				errors.password = 'ກະລຸນາໃສ່ລະຫັດຜ່ານ';
			} else if (values.password.length < 6) {
				errors.password = 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ';
			}
			if (!values.tel) {
				errors.tel = 'ກະລຸນາໃສ່ເບີໂທລະສັບ';
			} else if (!/^[0-9]{8,10}$/.test(values.tel)) {
				errors.tel = 'ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ';
			}
			return errors;
		},
		onSubmit: async (values: TValues) => {
			const result = await dispatch(signUp(values));
			if (signUp.fulfilled.match(result)) {
				alert.success('ລົງທະບຽນສຳເລັດ');
				navigate('/auth');
			} else {
				alert.error('ລົງທະບຽນລົ້ມເຫຼວ');
			}
		},
	});

	// Handle PDF download
	const handleDownloadPDF = (documentKey: string) => {
		const doc = documents.find((d) => d.key === documentKey);
		if (!doc) {
			toast.error('ບໍ່ພົບເອກະສານ');
			return;
		}

		try {
			const link = document.createElement('a');
			link.href = doc.url;
			link.download = doc.filename;
			link.target = '_blank';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success(`ກຳລັງດາວໂຫຼດ ${doc.label}...`);
		} catch (error) {
			console.error('Download error:', error);
			toast.error('ດາວໂຫຼດລົ້ມເຫຼວ');
		}
	};

	return (
		<PageWrapper
			isProtectedRoute={false}
			className='h-screen w-screen bg-white dark:bg-inherit'
			name='ລົງທະບຽນ'>
			<div className='flex h-full w-full items-center justify-center'>
				<div className='flex h-full w-full flex-col md:flex-row'>
					{/* Left Branding Panel */}
					<div className='hidden w-2/3 items-center justify-center bg-gradient-to-tr from-[#05B086] via-[#65CEB5] to-[#BFFFEF] p-6 text-white md:flex'>
						<div className='text-center'>
							<Image src={logo} className='mx-auto h-[300px]' alt='MSP Wallet Logo' />
							<h2 className='mt-8 text-3xl font-semibold text-white'>MSP Wallet</h2>
							<p className='lao-font mt-4 text-xl'>ລະບົບຈັດການຂໍ້ມູນບັນຊີຜູ້ໃຊ້</p>
						</div>
					</div>

					{/* Right Form Panel */}
					<div className='flex w-full flex-col justify-center p-8 md:w-1/2'>
						<div className='mb-8 flex flex-col items-center justify-center'>
							{/* Green Circle Logo */}
							<div className='mb-4 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-green-600'>
								<Image src={logoMSP} width={60} alt='MSP Logo' />
							</div>

							{/* Title */}
							<h1 className='mb-4 text-3xl font-semibold text-zinc-700'>
								MSP WALLET
							</h1>
						</div>

						<AuthTabSwitcher />

						{/* Register Form */}
						<form
							className='flex flex-col gap-4'
							onSubmit={formik.handleSubmit}
							noValidate>
							{/* Email */}
							<div>
								<FieldWrap
									firstSuffix={<Icon icon='HeroEnvelope' className='mx-2' />}>
									<Input
										dimension='lg'
										id='email'
										name='email'
										placeholder='ອີເມວ'
										value={formik.values.email}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.errors.email && formik.touched.email && (
									<p className='mt-1 text-sm text-red-500'>
										{formik.errors.email}
									</p>
								)}
							</div>

							{/* Name */}
							<div>
								<FieldWrap firstSuffix={<Icon icon='HeroUser' className='mx-2' />}>
									<Input
										dimension='lg'
										id='name'
										name='name'
										placeholder='ຊື່'
										value={formik.values.name}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.errors.name && formik.touched.name && (
									<p className='mt-1 text-sm text-red-500'>
										{formik.errors.name}
									</p>
								)}
							</div>

							{/* Surname */}
							<div>
								<FieldWrap firstSuffix={<Icon icon='HeroUser' className='mx-2' />}>
									<Input
										dimension='lg'
										id='surname'
										name='surname'
										placeholder='ນາມສະກຸນ'
										value={formik.values.surname}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.errors.surname && formik.touched.surname && (
									<p className='mt-1 text-sm text-red-500'>
										{formik.errors.surname}
									</p>
								)}
							</div>

							{/* Username */}
							<div>
								<FieldWrap firstSuffix={<Icon icon='HeroUser' className='mx-2' />}>
									<Input
										dimension='lg'
										id='username'
										name='username'
										placeholder='ຊື່ຜູ້ໃຊ້'
										value={formik.values.username}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.errors.username && formik.touched.username && (
									<p className='mt-1 text-sm text-red-500'>
										{formik.errors.username}
									</p>
								)}
							</div>

							{/* Password */}
							<div>
								<FieldWrap
									firstSuffix={<Icon icon='HeroKey' className='mx-2' />}
									lastSuffix={
										<Icon
											className='mx-2 cursor-pointer'
											icon={passwordShowStatus ? 'HeroEyeSlash' : 'HeroEye'}
											onClick={() =>
												setPasswordShowStatus(!passwordShowStatus)
											}
										/>
									}>
									<Input
										dimension='lg'
										type={passwordShowStatus ? 'text' : 'password'}
										id='password'
										name='password'
										placeholder='ລະຫັດຜ່ານ'
										value={formik.values.password}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.errors.password && formik.touched.password && (
									<p className='mt-1 text-sm text-red-500'>
										{formik.errors.password}
									</p>
								)}
							</div>

							{/* Phone Number */}
							<div>
								<FieldWrap firstSuffix={<Icon icon='HeroPhone' className='mx-2' />}>
									<Input
										dimension='lg'
										id='tel'
										name='tel'
										placeholder='ເບີໂທລະສັບ'
										value={formik.values.tel}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.errors.tel && formik.touched.tel && (
									<p className='mt-1 text-sm text-red-500'>{formik.errors.tel}</p>
								)}
							</div>

							{/* Submit Button */}
							<Button
								size='lg'
								color='primary'
								radius='sm'
								variant='solid'
								className='w-full font-semibold'
								type='submit'
								disabled={authState.status === APIStatus.PENDING}>
								{authState.status === APIStatus.PENDING
									? 'ກຳລັງລົງທະບຽນ...'
									: 'ລົງທະບຽນ'}
							</Button>
						</form>

						{/* Download PDF Dropdown Button */}
						<div className='mt-4'>
							<Dropdown>
								<DropdownTrigger>
									<Button
										color='default'
										size='lg'
										radius='sm'
										variant='bordered'
										className='w-full font-semibold'
										startContent={<HiDownload size={20} />}
										endContent={<HiChevronDown size={18} />}>
										ດາວໂຫຼດຄູ່ມືການໃຊ້ງານ
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									aria-label='Download user manuals'
									onAction={(key) => handleDownloadPDF(key as string)}>
									{documents.map((doc) => (
										<DropdownItem
											key={doc.key}
											startContent={doc.icon}
											description={`ດາວໂຫຼດເອກະສານ PDF`}>
											{doc.label}
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</div>

						<div className='mt-6 text-center text-sm text-zinc-500'>
							ເວັບໄຊນີ້ໄດ້ຮັບການປົກປ້ອງໂດຍ reCAPTCHA ແລະນະໂຍບາຍຄວາມເປັນສ່ວນຕົວຂອງ
							Google.
						</div>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
};

export default SignUpPage;
