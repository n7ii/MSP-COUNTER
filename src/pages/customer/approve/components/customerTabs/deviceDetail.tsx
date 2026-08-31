import { useGetDeviceDetailQuery } from '@/pages/customer/redux/queries/customerApiSlice.ts';
import { Card, CardHeader, CardBody, Divider } from '@heroui/react';
import { FaApple, FaAndroid } from 'react-icons/fa'; // Import icons from react-icons

const DeviceDetail = ({ customerId }: any) => {
	const { data, isLoading } = useGetDeviceDetailQuery({ customerId });

	// Function to return the OS icon
	const renderOSIcon = (os: string) => {
		if (os.toLowerCase().includes('android')) {
			return (
				<div className='flex h-14 w-14 items-center justify-center rounded-xl border bg-gray-100 dark:bg-[#18181B]'>
					<FaAndroid className='text-3xl text-green-500' />
				</div>
			);
		} else if (os.toLowerCase().includes('ios') || os.toLowerCase().includes('apple')) {
			return (
				<div className='flex h-14 w-14 items-center justify-center rounded-xl border bg-gray-100 dark:bg-[#18181B]'>
					<FaApple className='text-3xl  dark:text-gray-300' />
				</div>
			);
		}
		return null; // If no match, return nothing
	};

	// Skeleton UI with Custom Dark Mode Colors
	if (isLoading) {
		return (
			<Card
				shadow='none'
				radius='lg'
				className='mt-6 max-w-[400px] bg-white p-6 shadow-sm dark:bg-[#09090B]'>
				<CardHeader className='flex gap-3'>
					<div className='mb-3 flex items-center gap-3'>
						<div className='h-14 w-14 animate-pulse rounded-xl bg-gray-200 dark:bg-[#18181B]'></div>
						<div className='h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-[#18181B]'></div>
					</div>
				</CardHeader>
				<Divider />
				<CardBody>
					<div className='space-y-4'>
						{[...Array(5)].map((_, i) => (
							<div key={i} className='flex justify-between'>
								<div className='h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-[#18181B]'></div>
								<div className='h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-[#18181B]'></div>
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		);
	}

	// Provide default values if data is undefined or null
	const deviceDetails = data?.body || {
		deviceName: 'N/A',
		deviceOS: 'N/A',
		deviceModelName: 'N/A',
		deviceId: 'N/A',
		status: false,
		lastLogin: 'N/A',
	};

	return (
		<Card shadow='none' radius='lg' className='mt-6 max-w-[400px]  p-6 shadow-sm '>
			<CardHeader className='flex gap-3'>
				<div className='mb-3 flex items-center gap-3'>
					<div>{renderOSIcon(deviceDetails.deviceOS)}</div>

					<span className='text-xl font-semibold text-gray-700 dark:text-gray-300'>
						{deviceDetails.deviceOS}
					</span>
				</div>
			</CardHeader>
			<Divider className='dark:border-[#18181B]' />
			<CardBody>
				<div className='space-y-4'>
					<div className='flex justify-between'>
						<span className='font-semibold text-gray-600 dark:text-gray-400'>
							Device Name:
						</span>
						<span className='dark:text-gray-300'>{deviceDetails.deviceName}</span>
					</div>

					<div className='flex justify-between'>
						<span className='font-semibold text-gray-600 dark:text-gray-400'>
							Device Model:
						</span>
						<span className='dark:text-gray-300'>{deviceDetails.deviceModelName}</span>
					</div>
					<div className='flex justify-between'>
						<span className='font-semibold text-gray-600 dark:text-gray-400'>
							Device ID:
						</span>
						<span className='dark:text-gray-300'>{deviceDetails.deviceId}</span>
					</div>
					<div className='flex justify-between'>
						<span className='font-semibold text-gray-600 dark:text-gray-400'>
							Device Status:
						</span>
						<span className='dark:text-gray-300'>
							{deviceDetails.status ? 'Active' : 'Inactive'}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='font-semibold text-gray-600 dark:text-gray-400'>
							Last Login:
						</span>
						<span className='dark:text-gray-300'>{deviceDetails.lastLogin}</span>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default DeviceDetail;
