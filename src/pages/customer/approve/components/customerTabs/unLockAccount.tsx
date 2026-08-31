import React, { useState } from 'react';
import { useUpdateWalletStatusMutation } from '@/pages/customer/redux/queries/customerApiSlice.ts';
import toast from 'react-hot-toast';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';

interface UnlockAccountProps {
	username: string;
	onSuccess?: () => void;
}

const UnlockAccount: React.FC<UnlockAccountProps> = ({ username, onSuccess }) => {
	const [reason, setReason] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const [updateWalletStatus, { isLoading }] = useUpdateWalletStatusMutation();

	const handleUnlock = async () => {
		if (!reason.trim()) {
			toast.error('ກະລຸນາລະບຸເຫດຜົນ / Please provide a reason');
			return;
		}

		try {
			await updateWalletStatus({
				usernameOrTel: username,
				status: 'UNBLOCKED',
				reason: reason.trim(),
			}).unwrap();

			toast.success('ປົດລ໋ອກກະເປົາເງິນສຳເລັດ / Wallet unlocked successfully');
			setIsOpen(false);
			setReason('');
			onSuccess?.();
		} catch (error: any) {
			toast.error(
				error?.data?.message || 'ປົດລ໋ອກກະເປົາເງິນບໍ່ສຳເລັດ / Failed to unlock wallet',
			);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		setReason('');
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className='rounded bg-teal-500 px-4 py-2 text-white transition-colors
                   hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50'
				disabled={isLoading}>
				<span className='flex items-center gap-2'>
					<svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z'
						/>
					</svg>
					ປົດລ໋ອກກະເປົາ / Unlock Wallet
				</span>
			</button>

			<ModalProvider
				isOpen={isOpen}
				onOpenChange={handleClose}
				title='ປົດລ໋ອກກະເປົາເງິນ / Unlock Wallet'
				scrollBehavior='inside'
				size='md'>
				<div className='space-y-6 py-4'>
					{/* Username Display */}

					{/* Reason Input */}
					<div>
						<label className='mb-2 block text-sm font-medium text-gray-700'>
							ເຫດຜົນການປົດລ໋ອກ / Unlock Reason <span className='text-red-500'>*</span>
						</label>
						<textarea
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder='ກະລຸນາລະບຸເຫດຜົນການປົດລ໋ອກ / Please provide unlock reason'
							rows={4}
							className='w-full resize-none rounded-md border border-gray-300 px-3 py-2
                                     focus:border-transparent focus:ring-2 focus:ring-teal-500'
							disabled={isLoading}
						/>
						<p className='mt-1 text-sm text-gray-500'>
							ຕ້ອງລະບຸເຫດຜົນ / Reason is required
						</p>
					</div>

					{/* Action Buttons */}
					<div className='flex justify-end gap-3 border-t pt-4'>
						<button
							onClick={handleClose}
							disabled={isLoading}
							className='rounded-md border border-gray-300 px-4 py-2 text-gray-700
                                     transition-colors hover:bg-gray-50 disabled:opacity-50'>
							ຍົກເລີກ / Cancel
						</button>
						<button
							onClick={handleUnlock}
							disabled={isLoading || !reason.trim()}
							className='flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2
                                     text-white transition-colors hover:bg-teal-700
                                     disabled:cursor-not-allowed disabled:opacity-50'>
							{isLoading ? (
								<>
									<svg className='h-5 w-5 animate-spin' viewBox='0 0 24 24'>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
											fill='none'
										/>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										/>
									</svg>
									ກຳລັງປົດລ໋ອກ...
								</>
							) : (
								'ຢືນຢັນປົດລ໋ອກ / Confirm Unlock'
							)}
						</button>
					</div>
				</div>
			</ModalProvider>
		</>
	);
};

export default UnlockAccount;
