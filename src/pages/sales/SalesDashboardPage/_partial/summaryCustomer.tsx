import { FaMoneyBillWave, FaWater, FaLightbulb, FaReceipt, FaExchangeAlt } from 'react-icons/fa';
import Card from '@/components/ui/Card.tsx';

const SummaryCustomer = ({ summaryTrans }: any) => {
	console.log('summaryTrans', summaryTrans);

	// Default values if summaryTrans is undefined
	const defaultSummary = {
		transfer: 0,
		waterTransfer: 0,
		edlTransfer: 0,
		easyTaxTransfer: 0,
		billPaymentTransfer: 0,
	};

	// Merge summaryTrans with default values
	const transactionSummary = { ...defaultSummary, ...summaryTrans };

	// Define the summary data dynamically
	const summaryData = [
		{
			id: 1,
			icon: <FaExchangeAlt className='text-5xl text-green-500' />,
			value: transactionSummary.transfer.toLocaleString(),
			label: 'ທຸລະກໍາໂອນເງິນ',
			color: 'green',
		},
		{
			id: 2,
			icon: <FaWater className='text-5xl text-blue-500' />,
			value: transactionSummary.waterTransfer.toLocaleString(),
			label: 'ທຸລະກໍານໍ້າປະປາ',
			color: 'blue',
		},
		{
			id: 3,
			icon: <FaLightbulb className='text-5xl text-yellow-500' />,
			value: transactionSummary.edlTransfer.toLocaleString(),
			label: 'ທຸລະກໍາໄຟຟ້າ',
			color: 'yellow',
		},
		{
			id: 4,
			icon: <FaReceipt className='text-5xl text-orange-500' />,
			value: transactionSummary.easyTaxTransfer.toLocaleString(),
			label: 'ທຸລະກໍາຈ່າຍພາສີ',
			color: 'orange',
		},
		{
			id: 5,
			icon: <FaMoneyBillWave className='text-5xl text-red-500' />,
			value: transactionSummary.billPaymentTransfer.toLocaleString(),
			label: 'ທຸລະກໍາຈ່າຍບິນ',
			color: 'red',
		},
	];

	return (
		<div className='grid grid-cols-2 gap-6'>
			{/* First two rows (2 columns) */}
			{summaryData.slice(0, 4).map((item) => (
				<Card
					key={item.id}
					className='flex flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-md'>
					<div
						className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-${item.color}-50`}>
						{item.icon}
					</div>
					<div className='text-4xl font-semibold'>{item.value}</div>
					<div className='mt-2 text-lg'>{item.label}</div>
				</Card>
			))}

			{/* Last item in a full-width column */}
			<Card className='col-span-2 flex flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-md'>
				<div
					className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-${summaryData[4].color}-50`}>
					{summaryData[4].icon}
				</div>
				<div className='text-4xl font-semibold'>{summaryData[4].value}</div>
				<div className='mt-2 text-lg'>{summaryData[4].label}</div>
			</Card>
		</div>
	);
};

export default SummaryCustomer;
