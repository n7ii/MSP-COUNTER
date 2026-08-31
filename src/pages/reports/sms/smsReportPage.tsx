import { useState, useEffect } from 'react';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Select from '@/components/form/Select.tsx';

import Container from '@/components/layouts/Container/Container.tsx';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';

import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import dayjs from 'dayjs';

import { useGetSmsReportQuery } from '@/pages/reports/redux/queries/txnWalletApiSlice.ts';

import { exportAllToExcel } from '@/pages/reports/utils/statementUtils.ts';
import toast from 'react-hot-toast';
import { Button } from '@heroui/react';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { LuSearch } from 'react-icons/lu';

const SmsReportPage = () => {
	const [provider, setProvider] = useState('UNITEL');
	const [selectedYear, setSelectedYear] = useState(dayjs().year());
	const [isSearchLoading, setIsSearchLoading] = useState(false);

	const [searchTriggered, setSearchTriggered] = useState(false);
	const [fetchedData, setFetchedData] = useState<any>(null);

	// Generate year options (last 5 years)
	const yearOptions = Array.from({ length: 5 }, (_, i) => dayjs().year() - i);

	// Fetch data using useGetSmsReportQuery hook
	const { data, isLoading, refetch } = useGetSmsReportQuery(
		{
			provider,
			dateStart: `${selectedYear}-01-01`,
			dateEnd: `${selectedYear}-12-31`,
		},
		{ skip: !searchTriggered },
	);

	useEffect(() => {
		if (data) {
			setFetchedData(data);
			setIsSearchLoading(false);
		}
	}, [data]);

	const handleSearch = () => {
		setIsSearchLoading(true);
		setSearchTriggered(true);
		refetch();
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedYear(Number(e.target.value));
		setSearchTriggered(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setProvider(e.target.value);
		setSearchTriggered(false);
	};

	const exportAllDataToExcel = async () => {
		try {
			if (fetchedData?.body?.length) {
				await exportAllToExcel(fetchedData.body, 'SMS Report');
			} else {
				toast.error('No data available for export.');
			}
		} catch (error) {
			console.error('Error exporting data:', error);
			toast.error('Failed to export data.');
		}
	};

	return (
		<>
			{(isSearchLoading || isLoading) && <Loading />}
			<PageWrapper name='SMS Report'>
				<Subheader>
					<SubheaderLeft>
						<FieldWrap>
							<div className='mb-4 flex items-center gap-4'>
								{/* Year Selector */}
								<div className='flex items-center gap-2'>
									<label className='text-sm font-medium'>Year:</label>
									<Select
										name='year'
										value={selectedYear}
										onChange={handleYearChange}
										className='w-32'>
										{yearOptions.map((year) => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
									</Select>
								</div>

								{/* Provider Selector */}
								<div className='flex items-center gap-2'>
									<label className='text-sm font-medium'>Provider:</label>
									<Select
										name='provider'
										value={provider}
										onChange={handleInputChange}
										className='w-[200px]'>
										<option value='LTC'>LTC</option>
										<option value='UNITEL'>UNITEL</option>
										<option value='ETL'>ETL</option>
									</Select>
								</div>

								<Button
									variant='solid'
									className='w-full max-w-32'
									startContent={<LuSearch size='18' />}
									color='primary'
									onPress={handleSearch}>
									Search
								</Button>
							</div>
						</FieldWrap>
					</SubheaderLeft>
					<SubheaderRight>
						<Button
							variant='ghost'
							radius='sm'
							color='primary'
							startContent={<PiMicrosoftExcelLogoFill size='24' />}
							onPress={exportAllDataToExcel}>
							Export Excel
						</Button>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>SMS Report - {provider} ({selectedYear})</CardTitle>
							</CardHeaderChild>
						</CardHeader>
						<CardBody className='overflow-auto'>
							{fetchedData?.body && fetchedData.body.length > 0 ? (
								<div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
									{fetchedData.body.map((item: any, index: number) => (
										<Card
											key={index}
											className='border border-gray-200 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700'>
											<CardBody className='p-4'>
												<div className='flex flex-col gap-2'>
													<div className='flex items-center justify-between'>
														<div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
															{item.monthName} {item.year}
														</div>
														<div className='rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300'>
															{provider}
														</div>
													</div>
													<div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
														{item.total?.toLocaleString() || 0}
													</div>
													<div className='text-xs text-gray-400'>
														Total SMS
													</div>
												</div>
											</CardBody>
										</Card>
									))}
								</div>
							) : (
								<div className='flex h-64 items-center justify-center'>
									<p className='text-gray-500'>
										No data available. Please select a year and click Search.
									</p>
								</div>
							)}
						</CardBody>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default SmsReportPage;
