import { useState, useEffect } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Chart from '../../../../components/Chart';
import { IChartOptions } from '../../../../interface/chart.interface';

const WalletSummary = ({ userAndAdmin }: any) => {
	console.log('userAndAdmin', userAndAdmin);

	// Default values to avoid undefined errors
	const defaultSummary = {
		allAdmin: 0,
		allCustomer: 0,
		allTrans: 0,
		allWaitingForKYC: 0,
	};

	// Merge default values with actual data
	const summaryData = { ...defaultSummary, ...userAndAdmin };

	// Define state for chart options
	const [state, setState] = useState<IChartOptions>({
		series: [
			summaryData.allAdmin,
			summaryData.allCustomer,
			summaryData.allTrans,
			summaryData.allWaitingForKYC,
		],
		options: {
			chart: {
				height: 350,
				type: 'donut', // Donut chart for visualization
			},
			labels: ['Admins', 'Customers', 'Transactions', 'Waiting for KYC'],
			tooltip: {
				y: {
					formatter: (value: number) => value.toLocaleString(), // Format numbers
				},
			},
			legend: {
				show: true,
				position: 'bottom',
			},
			fill: {
				colors: ['#05B086', '#FFCC00', '#3B82F6', '#F87171'], // Teal, Yellow, Blue, Red
			},
		},
	});

	// Update chart data when userAndAdmin changes
	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			series: [
				summaryData.allAdmin,
				summaryData.allCustomer,
				summaryData.allTrans,
				summaryData.allWaitingForKYC,
			],
		}));
	}, [userAndAdmin]);

	return (
		<Card className='h-full shadow'>
			<CardHeader>
				<CardHeaderChild>
					<CardTitle>ພວມລວມຂອງລະບົບ</CardTitle>
				</CardHeaderChild>
			</CardHeader>
			<CardBody>
				<Chart series={state.series} options={state.options} type='donut' height={350} />
				<div className='mt-4 text-center text-sm text-gray-500'>
					{/* Display summary details */}
					<div className='space-y-2'>
						<div className='flex justify-between'>
							<div className='flex items-center text-lg font-semibold'>
								<div className='mr-2 h-2 w-2 rounded-full bg-green-500'></div>
								ຜູ້ຄຸ້ມຄອງ (Admins)
							</div>
							<div className='text-lg font-medium text-gray-800'>
								{summaryData.allAdmin.toLocaleString()}
							</div>
						</div>

						<div className='flex justify-between'>
							<div className='flex items-center text-lg font-semibold'>
								<div className='mr-2 h-2 w-2 rounded-full bg-yellow-500'></div>
								ລູກຄ້າ (Customers)
							</div>
							<div className='text-lg font-medium text-gray-800'>
								{summaryData.allCustomer.toLocaleString()}
							</div>
						</div>

						<div className='flex justify-between'>
							<div className='flex items-center text-lg font-semibold'>
								<div className='mr-2 h-2 w-2 rounded-full bg-blue-500'></div>
								ການເຮັດທຸລະກຳ (Transactions)
							</div>
							<div className='text-lg font-medium text-gray-800'>
								{summaryData.allTrans.toLocaleString()}
							</div>
						</div>

						<div className='flex justify-between'>
							<div className='flex items-center text-lg font-semibold'>
								<div className='mr-2 h-2 w-2 rounded-full bg-red-500'></div>
								ລໍຖ້າການຢືນຢັນ KYC (Waiting for KYC)
							</div>
							<div className='text-lg font-medium text-gray-800'>
								{summaryData.allWaitingForKYC.toLocaleString()}
							</div>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default WalletSummary;
