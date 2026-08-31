import { useMemo } from 'react';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card';
import {
	FaMoneyBillWave,
	FaExchangeAlt,
	FaArrowDown,
	FaArrowUp,
	FaCalendarAlt,
} from 'react-icons/fa';
import { Chip } from '@heroui/react';
import dayjs from 'dayjs';

interface FeeSummaryProps {
	feeSummary: {
		feeCashIn: {
			credit: number;
			debit: number;
			total: number;
		};
		feeCashOut: {
			credit: number;
			debit: number;
			total: number;
		};
		feeTransfer: {
			credit: number;
			debit: number;
			total: number;
		};
	};
	dateStart?: string;
	dateEnd?: string;
}

const FeeSummary = ({ feeSummary, dateStart, dateEnd }: FeeSummaryProps) => {
	const totalFees = useMemo(() => {
		if (!feeSummary) return 0;
		return (
			(feeSummary.feeCashIn?.total || 0) +
			(feeSummary.feeCashOut?.total || 0) +
			(feeSummary.feeTransfer?.total || 0)
		);
	}, [feeSummary]);

	const feeItems = [
		{
			label: 'Cash In Fee',
			labelLao: 'ຄ່າທຳນຽມເງິນເຂົ້າ (ບັນຊີຕິດຕາມ)',
			data: feeSummary?.feeCashIn,
			icon: <FaArrowDown className='text-green-500' size={24} />,
			gradient:
				'bg-green-50 dark:bg-green-800/30 border border-green-100 dark:border-green-800/40',
			color: 'text-green-600',
		},
		{
			label: 'Cash Out Fee',
			labelLao: 'ຄ່າທຳນຽມເງິນອອກ',
			data: feeSummary?.feeCashOut,
			icon: <FaArrowUp className='text-red-500' size={24} />,
			gradient: 'bg-red-50 dark:bg-red-800/30 border border-red-100 dark:border-red-800/40',
			color: 'text-red-600',
		},
		{
			label: 'Transfer Fee',
			labelLao: 'ຄ່າທຳນຽມໂອນເງິນ',
			data: feeSummary?.feeTransfer,
			icon: <FaExchangeAlt className='text-blue-500' size={24} />,
			gradient:
				'bg-blue-50 dark:bg-blue-800/30 border border-blue-100 dark:border-blue-800/40',
			color: 'text-blue-600',
		},
	];

	if (!feeSummary) {
		return null;
	}

	return (
		<Card className='h-full overflow-hidden rounded-lg'>
			{/* Card Header */}
			<CardHeader>
				<CardHeaderChild>
					<div className='flex items-center gap-2'>
						<div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/30'>
							<FaMoneyBillWave className='text-amber-600' size={20} />
						</div>
						<div>
							<CardTitle>ສະຫຼຸບຄ່າທຳນຽມ</CardTitle>
							<p className='text-xs text-gray-500 dark:text-gray-400'>Fee Summary</p>
						</div>
					</div>
					<div className='ml-auto flex items-center gap-2'>
						{/* Date Range Chip */}
						{dateStart && dateEnd && (
							<Chip
								className='border-blue-500 text-blue-600'
								variant='bordered'
								startContent={<FaCalendarAlt size={14} />}>
								{dayjs(dateStart).format('DD/MM/YYYY')} -{' '}
								{dayjs(dateEnd).format('DD/MM/YYYY')}
							</Chip>
						)}
						{/* Total Chip */}
						<Chip className='border-amber-500 text-amber-600' variant='bordered'>
							{totalFees.toLocaleString()} LAK
						</Chip>
					</div>
				</CardHeaderChild>
			</CardHeader>

			<CardBody className='p-4'>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					{feeItems.map((item, index) => (
						<div
							key={index}
							className={`flex flex-col rounded-lg ${item.gradient} p-4 duration-200 hover:shadow-md`}>
							{/* Icon and Label */}
							<div className='mb-3 flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<div className='flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
										{item.icon}
									</div>
								</div>
								<Chip size='sm' variant='flat' className={item.color}>
									Total
								</Chip>
							</div>

							{/* Title */}
							<div className='mb-3'>
								<h4 className='text-sm font-medium text-gray-600 dark:text-gray-300'>
									{item.labelLao}
								</h4>
								<p className='text-xs text-gray-500 dark:text-gray-400'>
									{item.label}
								</p>
							</div>

							{/* Fee Breakdown */}
							<div className='space-y-2'>
								{/* Credit */}
								<div className='flex items-center justify-between'>
									<span className='text-xs text-gray-600 dark:text-gray-400'>
										Credit:
									</span>
									<span className='text-sm font-semibold text-green-600 dark:text-green-400'>
										{item.data?.credit?.toLocaleString() || 0} LAK
									</span>
								</div>

								{/* Debit */}
								<div className='flex items-center justify-between'>
									<span className='text-xs text-gray-600 dark:text-gray-400'>
										Debit:
									</span>
									<span className='text-sm font-semibold text-red-600 dark:text-red-400'>
										{item.data?.debit?.toLocaleString() || 0} LAK
									</span>
								</div>

								{/* Divider */}
								<div className='border-t border-gray-200 dark:border-gray-600' />

								{/* Total */}
								<div className='flex items-center justify-between'>
									<span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
										Total:
									</span>
									<span className={`text-lg font-bold ${item.color}`}>
										{item.data?.total?.toLocaleString() || 0}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Grand Total */}
				<div className='mt-6 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:from-amber-900/20 dark:to-orange-900/20'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<div className='flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/50'>
								<FaMoneyBillWave className='text-amber-600' size={24} />
							</div>
							<div>
								<p className='text-sm font-medium text-gray-600 dark:text-gray-300'>
									ລວມຄ່າທຳນຽມທັງໝົດ
								</p>
								<p className='text-xs text-gray-500 dark:text-gray-400'>
									Total Fees Collected
								</p>
							</div>
						</div>
						<div className='text-right'>
							<p className='text-2xl font-bold text-amber-600 dark:text-amber-400'>
								{totalFees.toLocaleString()}
							</p>
							<p className='text-xs text-gray-500 dark:text-gray-400'>LAK</p>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default FeeSummary;
