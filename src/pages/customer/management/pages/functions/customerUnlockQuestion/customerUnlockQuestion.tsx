// customerUnlockQuestion.tsx
import { useState } from 'react';
import { Button } from '@heroui/react';
import { useResetQuestionMutation } from '@/pages/customer/redux/queries/customerApiSlice';
import { AlertService } from '@/common/services/alert.service';
import { LuLock } from 'react-icons/lu';
import SecureLabel from '@/pages/customer/management/pages/components/customerMangeTabs/secureLable.tsx';

interface CustomerUnlockQuestionProps {
	userInfo: any;
}

const alertService = new AlertService();

const CustomerUnlockQuestion = ({ userInfo }: CustomerUnlockQuestionProps) => {
	const [resetQuestion, { isLoading }] = useResetQuestionMutation();
	const [isSuccess, setIsSuccess] = useState(false);

	const handleUnlockQuestion = async () => {
		const tel = userInfo?.body?.tel;

		if (!tel) {
			await alertService.error('ບໍ່ພົບເບີໂທລະສັບຂອງລູກຄ້າ');
			return;
		}

		// Show confirmation dialog
		const result = await alertService.confirmModal(
			`ທ່ານຕ້ອງການປົດລ໋ອກຄໍາຖາມຄວາມປອດໄພຂອງລູກຄ້າ ${userInfo?.body?.firstNameLa} ${userInfo?.body?.lastNameLa} (${tel}) ແທ້ບໍ່?`,
		);

		// If user cancels, return early
		if (!result.isConfirmed) {
			return;
		}

		try {
			const apiResult = await resetQuestion({ tel }).unwrap();

			if (apiResult?.header?.status === '01') {
				setIsSuccess(true);
				await alertService.success('ປົດລ໋ອກຄໍາຖາມສຳເລັດແລ້ວ');

				// Reset success state after 3 seconds
				setTimeout(() => {
					setIsSuccess(false);
				}, 3000);
			} else {
				await alertService.error(apiResult?.message || 'ປົດລ໋ອກຄໍາຖາມບໍ່ສຳເລັດ');
			}
		} catch (error: any) {
			console.error('Reset Question error:', error);
			await alertService.error(error?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການປົດລ໋ອກຄໍາຖາມ');
		}
	};

	return (
		<div className='space-y-6'>
			<div className='bg-white p-6 shadow-sm'>
				<h3 className='mb-4 text-lg font-semibold'>ປົດລ໋ອກຄໍາຖາມ</h3>
				<SecureLabel text='ປົດລ໋ອກຄໍາຖາມຄວາມປອດໄພ' />

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

				<div className='mb-6 rounded-md bg-yellow-50 p-4'>
					<p className='text-sm text-yellow-800'>
						⚠️ ການປົດລ໋ອກຄໍາຖາມຈະອະນຸຍາດໃຫ້ລູກຄ້າສາມາດຕັ້ງຄໍາຖາມຄວາມປອດໄພໃໝ່ໄດ້
					</p>
				</div>

				<Button
					onPress={handleUnlockQuestion}
					color={'primary'}
					isLoading={isLoading}
					isDisabled={!userInfo?.body?.tel}
					startContent={!isLoading && <LuLock className='h-5 w-5' />}
					className='w-full font-medium'>
					{isLoading
						? 'ກຳລັງປົດລ໋ອກ...'
						: isSuccess
							? 'ປົດລ໋ອກສຳເລັດ ✓'
							: 'ປົດລ໋ອກຄໍາຖາມ'}
				</Button>
			</div>
		</div>
	);
};

export default CustomerUnlockQuestion;
