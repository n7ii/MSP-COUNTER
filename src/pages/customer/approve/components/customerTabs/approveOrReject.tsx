import { useState } from 'react';
import { Card, CardHeader, CardFooter, Divider, Button, Textarea } from '@heroui/react';
import { LuFileCheck } from 'react-icons/lu';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import {
	useGetCustomerByIdQuery,
	useVertifyDocMutation,
} from '@/pages/customer/redux/queries/customerApiSlice.ts';

import Label from '@/components/form/Label.tsx';
import { AlertService } from '@/common/services/alert.service.ts';

interface Props {
	customerId: any;
}
const alertService = new AlertService();

const ApproveOrReject: React.FC<Props> = ({ customerId }) => {
	const [isModalOpen, setModalOpen] = useState(false); // ສະຖານະເປີດ/ປິດ modal
	const [action, setAction] = useState<'approve' | 'reject' | null>(null); // ປະເພດການຄຳສັ່ງ (ອະນຸມັດ/ປະຕິເສດ)
	const [comment, setComment] = useState(''); // ສະຖານະເກັບຄຳເຫົາ
	const { refetch } = useGetCustomerByIdQuery({ customerId });

	const [verifyDoc] = useVertifyDocMutation();

	const handleApprove = () => {
		setAction('approve');
		setModalOpen(true); // ເປີດ modal ສໍາລັບອະນຸມັດ
	};

	const handleReject = () => {
		setAction('reject');
		setModalOpen(true); // ເປີດ modal ສໍາລັບປະຕິເສດ
	};

	const handleConfirmAction = async () => {
		if (action && customerId) {
			const { isConfirmed } = await alertService.confirmModal(
				action === 'approve'
					? 'ທ່ານຕ້ອງການອະນຸມັດເອກະສານຫຼືບໍ່?' // For approve
					: 'ທ່ານຕ້ອງການປະຕິເສດເອກະສານຫຼືບໍ່?', // For reject
			);

			if (!isConfirmed) return;
			try {
				const commentText =
					comment || (action === 'approve' ? 'ເອກະສານຖືກອະນຸມັດ' : 'ເອກະສານຖືກປະຕິເສດ');
				const verify = await verifyDoc({
					customerId: Number(customerId),
					comment: commentText,
					verifiedPass: action === 'approve',
				}).unwrap();
				if (verify.header.status === '01') {
					alertService.success(verify.header.message);
					refetch();
				} else {
					alertService.error(verify.header.message);
				}
				setModalOpen(false); // ປິດ modal ຫຼັງຈາກການຄຳສັ່ງ
			} catch (error) {
				console.error('ການອະນຸມັດ/ປະຕິເສດຜິດພາດ', error);
			}
		}
	};

	return (
		<div className='space-y-4 pt-6'>
			{/* Main Card for Actions */}
			<Card className='w-full p-2'>
				<CardHeader className='flex items-center space-x-2'>
					<p className='text-2xl font-semibold'>ການອະນຸມັດ</p>
					<LuFileCheck className='h-6 w-6 text-primary-500' />
				</CardHeader>
				<Divider />
				<CardFooter className='flex items-center justify-between py-4'>
					<p className='ml-4 text-sm'>
						ຄຳແນະນຳ: ກົດປຸ່ມອະນຸມັດດ້ານລຸ່ມເພື່ອເປັນການຢືນຢັນການອະນຸມັດເຂົ້າໃຊ້ງານ MSP.
					</p>
					<div className='flex gap-2'>
						<Button size='lg' variant='shadow' color='primary' onPress={handleApprove}>
							ອະນຸມັດ
						</Button>
						<Button size='lg' variant='shadow' color='danger' onPress={handleReject}>
							ປະຕິເສດ
						</Button>
					</div>
				</CardFooter>
			</Card>

			{/* Modal for approval/rejection */}
			<ModalProvider
				isOpen={isModalOpen}
				onOpenChange={() => setModalOpen(!isModalOpen)}
				title={`ຢືນຢັນ ${action === 'approve' ? 'ອະນຸມັດ' : 'ປະຕິເສດ'}`}
				size='xl'
				scrollBehavior='inside'>
				<p className='text-lg'>
					ທ່ານມີຄວາມເຫົາໃຈວ່າຈະ {action === 'approve' ? 'ອະນຸມັດ' : 'ປະຕິເສດ'}{' '}
					ເອກະສານນີ້ບໍ?
				</p>
				<div className='flex flex-col items-center space-y-2 py-6'>
					<div className='w-full'>
						<Label htmlFor='comment'>ຄຳເຫັນ</Label>
						<Textarea
							id='comment'
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder='ປ້ອນຄຳເຫົາຂອງທ່ານ'
							fullWidth
							aria-label='Comment'
							className='mb-4'
						/>
					</div>

					<Button
						className='w-full'
						onPress={handleConfirmAction}
						color={action === 'approve' ? 'primary' : 'danger'}
						size='lg'>
						{action === 'approve' ? 'ອະນຸມັດ' : 'ປະຕິເສດ'}
					</Button>
				</div>
			</ModalProvider>
		</div>
	);
};

export default ApproveOrReject;
