import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card.tsx';
import { Chip } from '@heroui/react';
import {
	FaCheckCircle,
	FaExchangeAlt,
	FaHourglassHalf,
	FaMoneyBillWave,
	FaTimesCircle,
	FaUndoAlt,
} from 'react-icons/fa';

type VolteyDashboardBody = {
	successTransaction?: number;
	errorTransaction?: number;
	holdTransaction?: number;
	revertTransaction?: number;
	allTransaction?: number;
	totalIncomeLak?: number;
	incomeLak?: number;
	incomeFeeLak?: number;
	soldOutLak?: number;
	soldOutUSD?: number;
};

type VolteyDashboardProps = {
	data?: VolteyDashboardBody;
	title?: string;
	soldOutLakLabel?: string;
	soldOutUsdLabel?: string;
	showIncomeSummary?: boolean;
};

const formatMoney = (value?: number, ccy?: string) => {
	if (value === null || value === undefined) return '-';
	return `${Number(value).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})} ${ccy || ''}`.trim();
};

const VolteyDashboard = ({
	data,
	title = 'ພາບລວມ Voltey',
	soldOutLakLabel = 'ຍອດທີ່ຕ້ອງສົ່ງໃຫ້ Voltey (LAK)',
	soldOutUsdLabel = 'ຍອດທີ່ຕ້ອງສົ່ງໃຫ້ Voltey (USD)',
	showIncomeSummary = true,
}: VolteyDashboardProps) => {
	const countItems = [
		{
			label: 'ທຸລະກໍາທັງໝົດ',
			value: data?.allTransaction || 0,
			gradient: 'bg-blue-50 dark:bg-blue-800/30 border border-blue-100 dark:border-blue-800/40',
			icon: <FaExchangeAlt className='text-blue-500' size={20} />,
		},
		{
			label: 'ສຳເລັດ',
			value: data?.successTransaction || 0,
			gradient:
				'bg-green-50 dark:bg-green-800/30 border border-green-100 dark:border-green-800/40',
			icon: <FaCheckCircle className='text-green-600' size={20} />,
		},
		{
			label: 'ຜິດພາດ',
			value: data?.errorTransaction || 0,
			gradient: 'bg-red-50 dark:bg-red-800/30 border border-red-100 dark:border-red-800/40',
			icon: <FaTimesCircle className='text-red-500' size={20} />,
		},
		{
			label: 'ລໍຖ້າ',
			value: data?.holdTransaction || 0,
			gradient:
				'bg-purple-50 dark:bg-purple-800/30 border border-purple-100 dark:border-purple-800/40',
			icon: <FaHourglassHalf className='text-purple-500' size={20} />,
		},
		{
			label: 'ຄືນເງິນ',
			value: data?.revertTransaction || 0,
			gradient:
				'bg-amber-50 dark:bg-amber-800/30 border border-amber-100 dark:border-amber-800/40',
			icon: <FaUndoAlt className='text-amber-500' size={20} />,
		},
	];

	const moneyItems = [
		{
			label: 'ລາຍຮັບທັງໝົດ',
			value: formatMoney(data?.totalIncomeLak, 'LAK'),
			cardClass:
				'border-green-100 bg-green-50 dark:border-green-800/40 dark:bg-green-800/20',
			valueClass: 'text-green-700 dark:text-green-400',
		},
		{
			label: 'ລາຍຮັບ',
			value: formatMoney(data?.incomeLak, 'LAK'),
			cardClass:
				'border-green-100 bg-green-50 dark:border-green-800/40 dark:bg-green-800/20',
			valueClass: 'text-green-700 dark:text-green-400',
		},
		{
			label: 'ຄ່າທຳນຽມ',
			value: formatMoney(data?.incomeFeeLak, 'LAK'),
			cardClass:
				'border-green-100 bg-green-50 dark:border-green-800/40 dark:bg-green-800/20',
			valueClass: 'text-green-700 dark:text-green-400',
		},
		{
			label: soldOutLakLabel,
			value: formatMoney(data?.soldOutLak, 'LAK'),
			cardClass:
				'border-amber-100 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-800/20',
			valueClass: 'text-amber-700 dark:text-amber-400',
		},
		{
			label: soldOutUsdLabel,
			value: formatMoney(data?.soldOutUSD, 'USD'),
			cardClass:
				'border-amber-100 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-800/20',
			valueClass: 'text-amber-700 dark:text-amber-400',
		},
	];

	return (
		<div className='mb-6 grid grid-cols-12 gap-4'>
			<div className='col-span-12'>
				<Card className='overflow-hidden rounded-lg'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>{title}</CardTitle>
							<Chip className='border-teal-500 text-teal-500' variant='bordered'>
								{data?.allTransaction || 0} ທຸລະກໍາ
							</Chip>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='p-4'>
						<ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
							{countItems.map((item) => (
								<li
									key={item.label}
									className={`flex items-center rounded-lg ${item.gradient} p-4 duration-200 hover:shadow-md`}>
									<div className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
										{item.icon}
									</div>
									<div>
										<div className='text-sm'>{item.label}</div>
										<div className='text-lg font-bold'>{item.value}</div>
									</div>
								</li>
							))}
						</ul>
					</CardBody>
				</Card>
			</div>

			{showIncomeSummary && (
				<div className='col-span-12'>
					<Card className='overflow-hidden rounded-lg'>
						<CardHeader>
							<CardHeaderChild>
								<div className='flex items-center gap-2'>
									<div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/30'>
										<FaMoneyBillWave className='text-amber-600' size={20} />
									</div>
									<CardTitle>ສະຫຼຸບລາຍຮັບ</CardTitle>
								</div>
							</CardHeaderChild>
						</CardHeader>
						<CardBody className='p-4'>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
								{moneyItems.map((item) => (
									<div
										key={item.label}
										className={`rounded-lg border p-4 ${item.cardClass}`}>
										<p className='text-sm text-gray-600 dark:text-gray-300'>
											{item.label}
										</p>
										<p className={`mt-2 text-lg font-bold ${item.valueClass}`}>
											{item.value}
										</p>
									</div>
								))}
							</div>
						</CardBody>
					</Card>
				</div>
			)}
		</div>
	);
};

export default VolteyDashboard;
