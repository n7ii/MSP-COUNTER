import React, { useState } from 'react';
import { useUpdateWalletStatusMutation } from '@/pages/customer/redux/queries/customerApiSlice.ts';
import Textarea from '@/components/form/Textarea.tsx';
import { Button, Card } from '@heroui/react';
import SecureLabel from '@/pages/customer/management/pages/components/customerMangeTabs/secureLable.tsx';
import { AlertService } from '@/common/services/alert.service.ts';
import { FaLock, FaUnlock, FaTimesCircle, FaCheckCircle } from 'react-icons/fa'; // Import React Icons

const Alert = new AlertService();

// Explicit color mappings
const statusStyles: Record<string, { bg: string; border: string; text: string }> = {
	BLOCKED: {
		bg: 'bg-red-100 dark:bg-red-900',
		border: 'border-red-500 dark:border-red-400',
		text: 'text-red-700 dark:text-red-400',
	},
	UNBLOCKED: {
		bg: 'bg-green-100 dark:bg-green-900',
		border: 'border-green-500 dark:border-green-400',
		text: 'text-green-700 dark:text-green-400',
	},
	CLOSED: {
		bg: 'bg-yellow-100 dark:bg-yellow-900',
		border: 'border-yellow-500 dark:border-yellow-400',
		text: 'text-yellow-700 dark:text-yellow-400',
	},
	UNCLOSED: {
		bg: 'bg-blue-100 dark:bg-blue-900',
		border: 'border-blue-500 dark:border-blue-400',
		text: 'text-blue-700 dark:text-blue-400',
	},
};

const statuses = [
	{
		label: 'Lock',
		value: 'BLOCKED',
		icon: <FaLock size={16} />,
	},
	{
		label: 'UnLock',
		value: 'UNBLOCKED',
		icon: <FaUnlock size={16} />,
	},
	{
		label: 'InActive',
		value: 'CLOSED',
		icon: <FaTimesCircle size={16} />,
	},
	{
		label: 'Active',
		value: 'UNCLOSED',
		icon: <FaCheckCircle size={16} />,
	},
];

const CustomerStatusManage = ({ username }: { username: string }) => {
	const [status, setStatus] = useState('');
	const [reason, setReason] = useState('');

	// RTK Query mutation hook
	const [updateWalletStatus, { isLoading }] = useUpdateWalletStatusMutation();

	// Handle form submission with confirmation modal
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = await Alert.confirmModal(
			'Are you sure you want to change the customer’s status?',
		);

		if (result.isConfirmed) {
			try {
				await updateWalletStatus({ usernameOrTel: username, status, reason }).unwrap();
				setStatus('');
				setReason('');
				await Alert.success('Status updated successfully!');
			} catch (err) {
				console.error('Failed to update status', err);
				await Alert.error('An error occurred while updating the status.');
			}
		}
	};

	return (
		<div className='p-6'>
			<h1 className='mb-4 text-xl font-semibold dark:text-white'>ຈັດການສະຖານະບັນຊີ</h1>
			<p className='font-light dark:text-gray-300'>
				ຄຳແນະນຳ: ກົດເລືອກສະຖານະເພື່ອອັບເດດບັນຊີ, ຈາກນັ້ນຢືນຢັນການເລືອກຂອງທ່ານ.
			</p>
			<SecureLabel text='ຈັດການສະຖານະບັນຊີ' />

			<form onSubmit={handleSubmit} className='space-y-4 pt-4'>
				{/* Status Selection Cards */}
				<div>
					<label className='mb-2 block text-sm font-medium dark:text-gray-300'>
						Status
					</label>
					<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
						{statuses.map(({ label, value, icon }) => (
							<Card
								shadow='none'
								isPressable
								key={value}
								className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center text-sm 
									transition-all duration-200 ease-in-out
									hover:scale-105 hover:shadow-lg 
									${status === value ? `${statusStyles[value].border} ${statusStyles[value].bg} shadow-lg` : 'border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-[#27272A]'}`}
								onPress={() => setStatus(value)}>
								<span
									className={`text-2xl ${status === value ? statusStyles[value].text : 'text-gray-600 dark:text-gray-300'}`}>
									{icon}
								</span>
								<span
									className={`text-lg font-semibold ${status === value ? statusStyles[value].text : 'text-gray-600 dark:text-gray-300'}`}>
									{label}
								</span>
							</Card>
						))}
					</div>
				</div>

				{/* Reason Input */}
				<div>
					<label className='block text-sm font-medium dark:text-gray-300'>Reason</label>
					<Textarea
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						className='w-full rounded-md border p-3 '
						required
					/>
				</div>

				{/* Submit Button */}
				<Button className='w-full' color='primary' type='submit' disabled={isLoading}>
					{isLoading ? 'Updating...' : 'Update Status'}
				</Button>
			</form>
		</div>
	);
};

export default CustomerStatusManage;
