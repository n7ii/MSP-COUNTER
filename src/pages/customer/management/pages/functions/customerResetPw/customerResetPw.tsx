import { useResetCustomerPasswordMutation } from '@/pages/customer/redux/queries/customerApiSlice.ts';
import { Button } from '@heroui/react';
import SecureLabel from '@/pages/customer/management/pages/components/customerMangeTabs/secureLable.tsx';
import { AlertService } from '@/common/services/alert.service.ts';
import { FaPaperPlane } from 'react-icons/fa';

const Alert = new AlertService();

interface CustomerResetPwProps {
	customerId: any;
}

const CustomerResetPw = ({ customerId }: CustomerResetPwProps) => {
	// RTK Query mutation hook
	const [resetCustomerPassword, { isLoading }] = useResetCustomerPasswordMutation();

	// Handle sending OTP
	const handleSendOTP = async () => {
		const result = await Alert.confirmModal(
			'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການສົ່ງລະຫັດ OTP ໃຫ້ລູກຄ້າເພື່ອຣີເຊັດລະຫັດຜ່ານ?',
		);

		if (result.isConfirmed) {
			try {
				const response = await resetCustomerPassword({
					customerId,
					data: {},
				}).unwrap();

				// Check if the response has error code E400
				if (response?.header?.code === '0000') {
					await Alert.success(response?.header?.message || 'ສົ່ງລະຫັດ OTP ສຳເລັດແລ້ວ!');
				} else {
					await Alert.error(
						response.header.message || 'ເກີດຂໍ້ຜິດພາດໃນການສົ່ງລະຫັດ OTP.',
					);
				}
			} catch (err: any) {
				console.error('Failed to send OTP', err);
				await Alert.error(err?.data?.header?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສົ່ງລະຫັດ OTP.');
			}
		}
	};

	return (
		<div className='p-6'>
			<h1 className='mb-4 text-xl font-semibold dark:text-white'>ຣີເຊັດລະຫັດຜ່ານລູກຄ້າ</h1>
			<p className='mb-4 font-light dark:text-gray-300'>
				ຄຳແນະນຳ: ກົດປຸ່ມເພື່ອສົ່ງລະຫັດ OTP ໃຫ້ລູກຄ້າສຳລັບການຣີເຊັດລະຫັດຜ່ານ.
			</p>
			<SecureLabel text='ຣີເຊັດລະຫັດຜ່ານລູກຄ້າ' />

			<div className='mt-6 space-y-6'>
				{/* Customer Information Card */}

				{/* OTP Information */}
				<div className='rounded-lg border border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20'>
					<div className='flex items-start gap-3'>
						<FaPaperPlane className='mt-1 text-blue-600 dark:text-blue-400' size={20} />
						<div>
							<h3 className='mb-2 font-semibold text-blue-800 dark:text-blue-300'>
								ກ່ຽວກັບການສົ່ງລະຫັດ OTP
							</h3>
							<ul className='space-y-1 text-sm text-blue-700 dark:text-blue-300'>
								<li>• ລະຫັດ OTP ຈະຖືກສົ່ງໄປຍັງເບີໂທລະສັບຂອງລູກຄ້າ</li>
								<li>• ລູກຄ້າສາມາດໃຊ້ລະຫັດ OTP ເພື່ອຣີເຊັດລະຫັດຜ່ານ</li>
								<li>• ລະຫັດ OTP ມີອາຍຸການໃຊ້ງານຈຳກັດ</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Send OTP Button */}
				<Button
					className='w-full'
					color='primary'
					size='lg'
					onPress={handleSendOTP}
					disabled={isLoading}
					startContent={!isLoading && <FaPaperPlane />}>
					{isLoading ? 'ກຳລັງສົ່ງ...' : 'ສົ່ງລະຫັດ OTP'}
				</Button>

				{/* Warning Message */}
			</div>
		</div>
	);
};

export default CustomerResetPw;
