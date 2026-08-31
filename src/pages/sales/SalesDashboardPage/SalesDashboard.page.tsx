import { useEffect, useState } from 'react';
import { Range } from 'react-date-range';
import dayjs from 'dayjs';

import Container from '../../../components/layouts/Container/Container';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import ChartPartial from './_partial/Chart.partial';

import Balance1Partial from './_partial/Balance1.partial';
import Balance2Partial from './_partial/Balance2.partial';
import Balance3Partial from './_partial/Balance3.partial';

import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import PERIOD from '../../../constants/periods.constant';
import Header, { HeaderLeft, HeaderRight } from '../../../components/layouts/Header/Header';
import DefaultHeaderRightCommon from '../../../templates/layouts/Headers/_common/DefaultHeaderRight.common';

import Breadcrumb from '../../../components/layouts/Breadcrumb/Breadcrumb';
import { Button, Chip } from '@heroui/react';
import CartTransactionCash from '@/pages/sales/SalesDashboardPage/_partial/chartTransactionCash.tsx';
import SummaryCustomer from '@/pages/sales/SalesDashboardPage/_partial/summaryCustomer.tsx';
import WalletSummary from '@/pages/sales/SalesDashboardPage/_partial/walletSummary.tsx';

import {
	useGetDashBroadDetailQuery,
	useGetDashBroadQuery,
	useGetSummaryFeeQuery,
} from '@/redux/queries/dashBroadApiSlice.ts';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import Card, { CardBody } from '@/components/ui/Card.tsx';
import {
	FaCheckCircle,
	FaExchangeAlt,
	FaMoneyBillWave,
	FaRedoAlt,
	FaTimesCircle,
	FaUndoAlt,
} from 'react-icons/fa';
import { FaBan, FaCreditCard, FaHourglassHalf } from 'react-icons/fa6';
import DateRangeFilter from '@/pages/sales/SalesDashboardPage/DateRangeFilter.tsx';
import FeeSummary from '@/pages/sales/SalesDashboardPage/_partial/FeeSummary.tsx';

const SalesDashboardPage = () => {
	// State for period selection
	const [activeTab, setActiveTab] = useState<any>(PERIOD.WEEK);

	// State for date range
	const [state, setState] = useState<Range[]>([
		{
			startDate: dayjs().subtract(7, 'day').toDate(),
			endDate: new Date(),
			key: 'selection',
		},
	]);

	// State for custom date range toggle
	const [useCustomDateRange, setUseCustomDateRange] = useState(false);

	// Build query params based on whether custom date range is enabled
	const queryParams = useCustomDateRange
		? {
				period: activeTab || PERIOD.DAY,
				useCustomize: true,
				dateStart: dayjs(state[0].startDate).format('YYYY-MM-DD'),
				dateEnd: dayjs(state[0].endDate).format('YYYY-MM-DD'),
			}
		: {
				period: activeTab,
			};

	// Build fee query body (always include dates)
	const feeQueryBody = {
		dateStart: dayjs(state[0].startDate).format('YYYY-MM-DD'),
		dateEnd: dayjs(state[0].endDate).format('YYYY-MM-DD'),
	};

	// Fetch Dashboard Data
	const { data, error, isLoading, refetch } = useGetDashBroadQuery(queryParams);
	const { data: dataDetail, refetch: refetchDetail } = useGetDashBroadDetailQuery(queryParams);
	const {
		data: feeSummaryData,
		isLoading: isFeeLoading,
		refetch: refetchFee,
	} = useGetSummaryFeeQuery(feeQueryBody);

	const summaryItems = [
		{
			label: 'allTrans',
			value: data?.body?.count.allTrans,
			icon: (
				<div className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
					<FaExchangeAlt className='text-blue-500' size={20} />
				</div>
			),
		},
		{
			label: 'cancelTrans',
			value: data?.body?.count.cancelTrans,
			gradient: 'bg-red-50 dark:bg-red-800/30 border border-red-100 dark:border-red-800/40',
			icon: (
				<div className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
					<FaTimesCircle className='text-red-500' size={20} />
				</div>
			),
		},
		{
			label: 'creditTrans',
			value: data?.body?.count.creditTrans,
			gradient:
				'bg-green-50 dark:bg-green-800/30 border border-green-100 dark:border-green-800/40',
			icon: (
				<div className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
					<FaCreditCard className='text-green-500' size={20} />
				</div>
			),
		},
		{
			label: 'debitTrans',
			value: data?.body?.count.debitTrans,
			gradient:
				'bg-orange-50 dark:bg-orange-800/30 border border-orange-100 dark:border-orange-800/40',
			icon: (
				<div className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
					<FaMoneyBillWave className='text-orange-500' size={20} />
				</div>
			),
		},
		{
			label: 'holdTrans',
			value: data?.body?.count.holdTrans,
			gradient:
				'bg-purple-50 dark:bg-purple-800/30 border border-purple-100 dark:border-purple-800/40',
			icon: (
				<div className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
					<FaHourglassHalf className='text-purple-500' size={20} />
				</div>
			),
		},
		{
			label: 'refundTrans',
			value: data?.body?.count.refundTrans,
			gradient:
				'bg-teal-50 dark:bg-teal-800/30 border border-teal-100 dark:border-teal-800/40',
			icon: (
				<div className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
					<FaUndoAlt className='text-teal-500' size={20} />
				</div>
			),
		},
		{
			label: 'rejectTrans',
			value: data?.body?.count.rejectTrans,
			gradient:
				'bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/40',
			icon: (
				<div className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
					<FaBan className='text-gray-500' size={20} />
				</div>
			),
		},
		{
			label: 'reversalTrans',
			value: data?.body?.count.reversalTrans,
			gradient:
				'bg-indigo-50 dark:bg-indigo-800/30 border border-indigo-100 dark:border-indigo-800/40',
			icon: (
				<div className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700'>
					<FaRedoAlt className='text-indigo-500' size={20} />
				</div>
			),
		},
		{
			label: 'successTrans',
			value: data?.body?.count.successTrans,
			gradient:
				'bg-green-50 dark:bg-green-800/30 border border-green-100 dark:border-green-800/40',
			icon: (
				<div className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-50 dark:bg-gray-700'>
					<FaCheckCircle className='text-green-600' size={20} />
				</div>
			),
		},
	];

	// Handle date range change
	const handleDateChange = (item: any) => {
		setState([item.selection]);
	};

	// Handle search - enable custom date range and refetch
	const handleSearch = () => {
		setUseCustomDateRange(true);
		setActiveTab(null);
		refetch();
		refetchDetail();
		refetchFee();
	};

	// Handle period tab change - disable custom date range
	const handlePeriodChange = (period: any) => {
		setActiveTab(period);
		setUseCustomDateRange(false);

		// Update date range based on period
		const now = new Date();
		let newStartDate = now;

		if (period === PERIOD.WEEK) {
			newStartDate = dayjs().subtract(7, 'day').toDate();
		} else if (period === PERIOD.MONTH) {
			newStartDate = dayjs().subtract(1, 'month').toDate();
		} else if (period === PERIOD.YEAR) {
			newStartDate = dayjs().subtract(1, 'year').toDate();
		}

		setState([
			{
				startDate: newStartDate,
				endDate: now,
				key: 'selection',
			},
		]);
	};

	// Refetch data when date range changes
	useEffect(() => {
		if (state[0]?.startDate && state[0]?.endDate) {
			refetch();
			refetchDetail();
			refetchFee();
		}
	}, [activeTab, useCustomDateRange, state, refetch, refetchDetail, refetchFee]);

	return (
		<>
			<Header>
				<HeaderLeft>
					<Breadcrumb path='Pages / Dashboard' currentPage='Dashboard' />
				</HeaderLeft>
				<HeaderRight>
					<DefaultHeaderRightCommon />
				</HeaderRight>
			</Header>
			<PageWrapper name='Dashboard'>
				<Subheader>
					<SubheaderLeft>
						<Button
							color='primary'
							radius='full'
							variant={
								activeTab === PERIOD.WEEK && !useCustomDateRange
									? 'solid'
									: 'bordered'
							}
							onPress={() => handlePeriodChange(PERIOD.WEEK)}>
							Week
						</Button>

						<Button
							color='primary'
							radius='full'
							variant={
								activeTab === PERIOD.MONTH && !useCustomDateRange
									? 'solid'
									: 'bordered'
							}
							onPress={() => handlePeriodChange(PERIOD.MONTH)}>
							Month
						</Button>

						<Button
							color='primary'
							radius='full'
							variant={
								activeTab === PERIOD.YEAR && !useCustomDateRange
									? 'solid'
									: 'bordered'
							}
							onPress={() => handlePeriodChange(PERIOD.YEAR)}>
							Year
						</Button>

						{useCustomDateRange && (
							<Chip color='success' variant='flat'>
								Custom Range
							</Chip>
						)}
					</SubheaderLeft>

					<SubheaderRight>
						<DateRangeFilter
							state={state}
							onDateChange={handleDateChange}
							onSearch={handleSearch}
						/>
					</SubheaderRight>
				</Subheader>

				<Container>
					{(isLoading || isFeeLoading) && <Loading />}
					{error && <p className='text-red-500'>Error loading dashboard data.</p>}
					{data && (
						<div className='grid grid-cols-12 gap-6'>
							<div className='col-span-12 sm:col-span-4 lg:col-span-4'>
								<Balance1Partial
									summary={data?.body?.summary}
									activeTab={activeTab}
								/>
							</div>
							<div className='col-span-12 sm:col-span-4 lg:col-span-4'>
								<Balance2Partial
									summary={data?.body?.summary}
									activeTab={activeTab}
								/>
							</div>
							<div className='col-span-12 sm:col-span-4 lg:col-span-4'>
								<Balance3Partial
									summary={data?.body?.summary}
									activeTab={activeTab}
								/>
							</div>

							{/* Fee Summary - Full Width with Date Range Display */}
							{feeSummaryData && (
								<div className='col-span-12'>
									<FeeSummary
										feeSummary={feeSummaryData?.body}
										dateStart={feeQueryBody.dateStart}
										dateEnd={feeQueryBody.dateEnd}
									/>
								</div>
							)}

							<div className='col-span-12'>
								<Card className='overflow-hidden rounded-lg'>
									<div className='flex items-center p-4'>
										<h3 className='text-2xl font-semibold'>ພາບລວມທຸລະກໍາ</h3>
										<Chip
											className='ml-2 border-teal-500 text-teal-500'
											variant='bordered'>
											{data?.body?.count.allTrans} AllTrans
										</Chip>
									</div>
									<CardBody className='p-4'>
										<ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
											{summaryItems
												.filter((item) => item.label !== 'allTrans')
												.map((item) => (
													<li
														key={item.label}
														className={`flex items-center rounded-lg ${item.gradient} p-4 duration-200 hover:shadow-md`}>
														<div className='mr-3'>{item.icon}</div>
														<div>
															<div className='text-sm capitalize '>
																{item.label}
															</div>
															<div className='text-lg font-bold '>
																{item.value}
															</div>
														</div>
													</li>
												))}
										</ul>
									</CardBody>
								</Card>
							</div>

							<div className='col-span-12 2xl:col-span-6'>
								<ChartPartial transDetail={data?.body?.transDetail} />
							</div>
							<div className='col-span-12 2xl:col-span-6'>
								<CartTransactionCash cashDetail={data?.body?.cashDetail} />
							</div>
							<div className='col-span-12 2xl:col-span-6'>
								<SummaryCustomer summaryTrans={dataDetail?.body?.summaryTrans} />
							</div>
							<div className='col-span-12 2xl:col-span-6'>
								<WalletSummary userAndAdmin={dataDetail?.body?.userAndAdmin} />
							</div>
						</div>
					)}
				</Container>
			</PageWrapper>
		</>
	);
};

export default SalesDashboardPage;
