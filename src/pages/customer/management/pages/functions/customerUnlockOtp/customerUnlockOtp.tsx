// customerUnlockOtp.tsx
import { useState } from 'react';
import { Button } from '@heroui/react';
import { useResetOtpMutation } from '@/pages/customer/redux/queries/customerApiSlice';
import { AlertService } from '@/common/services/alert.service';
import { LuLock } from 'react-icons/lu';
import SecureLabel from '@/pages/customer/management/pages/components/customerMangeTabs/secureLable.tsx';

interface CustomerUnlockOtpProps {
	userInfo: any;
}

const alertService = new AlertService();

const CustomerUnlockOtp = ({ userInfo }: CustomerUnlockOtpProps) => {
	const [resetOtp, { isLoading }] = useResetOtpMutation();
	const [isSuccess, setIsSuccess] = useState(false);

	const handleUnlockOtp = async () => {
		const tel = userInfo?.body?.tel;

		if (!tel) {
			await alertService.error('ບໍ່ພົບເບີໂທລະສັບຂອງລູກຄ້າ');
			return;
		}

		try {
			const result = await resetOtp({ tel }).unwrap();

			if (result?.header?.status === '01') {
				setIsSuccess(true);
				await alertService.success('ປົດລ໋ອກ OTP ສຳເລັດແລ້ວ');

				// Reset success state after 3 seconds
				setTimeout(() => {
					setIsSuccess(false);
				}, 3000);
			} else {
				await alertService.error(result?.message || 'ປົດລ໋ອກ OTP ບໍ່ສຳເລັດ');
			}
		} catch (error: any) {
			console.error('Reset OTP error:', error);
			await alertService.error(error?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການປົດລ໋ອກ OTP');
		}
	};

	return (
		<div className='space-y-6'>
			<div className='bg-white p-6 shadow-sm'>
				<h3 className='mb-4 text-lg font-semibold'>ປົດລ໋ອກ OTP</h3>
				<SecureLabel text='ປົດລ໋ອກ OTP' />

				<div className='mb-6 space-y-3'>
					<div className='flex items-center gap-2'>
						<span className='font-medium text-gray-600'>ເບີໂທລະສັບ:</span>
						<span className='text-gray-900'>{userInfo?.body?.tel || 'N/A'}</span>
					</div>
					<div className='flex items-center gap-2'>
						<span className='font-medium text-gray-600'>ຊື່ລູກຄ້າ:</span>
						<span className='text-gray-900'>
							{userInfo?.body?.firstNameLa} {userInfo?.body?.lastNameLa}
						</span>
					</div>
				</div>

				{/*<div className='mb-6 rounded-md bg-yellow-50 p-4'>*/}
				{/*	<p className='text-sm text-yellow-800'>*/}
				{/*		⚠️ ການປົດລ໋ອກ OTP ຈະອະນຸຍາດໃຫ້ລູກຄ້າສາມາດຮ້ອງຂໍ OTP ໃໝ່ໄດ້ທັນທີ*/}
				{/*	</p>*/}
				{/*</div>*/}

				<Button
					onPress={handleUnlockOtp}
					color={'primary'}
					isLoading={isLoading}
					isDisabled={!userInfo?.body?.tel}
					startContent={!isLoading && <LuLock className='h-5 w-5' />}
					className='w-full font-medium'>
					{isLoading ? 'ກຳລັງປົດລ໋ອກ...' : isSuccess ? 'ປົດລ໋ອກສຳເລັດ ✓' : 'ປົດລ໋ອກ OTP'}
				</Button>
			</div>
		</div>
	);
};

export default CustomerUnlockOtp;
