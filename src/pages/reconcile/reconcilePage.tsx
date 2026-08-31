import { useEffect, useState } from 'react';
import { FaWallet, FaCheckCircle, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown, MdAccountBalance } from 'react-icons/md';
import Card, { CardHeader, CardBody, CardTitle } from '@/components/ui/Card';
import Loading from '@/components/ui/spinner/fullPageSpinner';
import { useGetAcctListQuery, useGetReconcileQuery } from '@/redux/queries/dashBroadApiSlice';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Button from '@/components/ui/Button.tsx';
import Subheader, { SubheaderLeft } from '@/components/layouts/Subheader/Subheader.tsx';
import meephomLogo from '@/assets/logo/meephom.jpg';
// import mspLogo from '@/assets/logo/MSP_WHITE_ICON2.png';
import Select from '@/components/form/Select.tsx';
// import { FaChartLine, FaCoins } from 'react-icons/fa6';

const ReconcilePage = () => {
	const [searchTerm, setSearchTerm] = useState('2131171001');
	const [glAcct, setGlAcct] = useState('2131171001');

	const { data: accountList } = useGetAcctListQuery();

	const { data, isLoading, error, isFetching } = useGetReconcileQuery({ glAcct });
	const [reconcileData, setReconcileData] = useState<any>(null);

	useEffect(() => {
		if (data?.body) {
			setReconcileData(data.body);
		}
	}, [data]);

	const handleSearch = () => {
		setGlAcct(searchTerm);
	};

	if (isLoading || isFetching) return <Loading />;
	if (error) return <div className='text-red-500 dark:text-red-400'>Error loading data</div>;

	const {
		glAccountDetail,
		glMspDetail,
		// customerDetail,
		reconsider,
		ddAccountDetail,
		customerDetail,
		// masterMaxLimit,
	} = reconcileData || {};

	// Calculate difference between MSP and Meephom
	const difference = (glMspDetail?.balance || 0) - (glAccountDetail?.currBalance || 0);
	const isBalanced = Math.abs(difference) < 0.01;

	return (
		<PageWrapper name='Reconciliation'>
			<Subheader>
				<SubheaderLeft>
					<div className='flex items-center gap-4'>
						<p className='dark:text-gray-200'>ຄົ້ນຫາບັນຊີ</p>
						<Select
							id='search'
							name='search'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='Select Account'
							className='min-w-[400px]'>
							{accountList?.body
								?.filter((account: any) => account.accountNo === '2131171001')
								?.map((account: any, index: number) => (
									<option key={index} value={account.accountNo}>
										{account.accountNo} - {account.accountName}
									</option>
								))}
						</Select>
						<Button variant='solid' onClick={handleSearch}>
							Search
						</Button>
					</div>
				</SubheaderLeft>
			</Subheader>

			<div className='min-h-screen px-24 pt-6'>
				<div className='mb-8 flex items-center justify-between'>
					<h1 className='text-3xl font-extrabold dark:text-white'>
						Reconciliation Dashboard
					</h1>
					{/* Balance Status Indicator - Only show if glAccountDetail exists */}
					{glAccountDetail && (
						<div
							className={`flex items-center gap-2 rounded-full px-6 py-3 ${
								isBalanced
									? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
									: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
							}`}>
							{isBalanced ? (
								<>
									<FaCheckCircle className='text-xl' />
									<span className='font-bold'>ຍອດສົມດຸນ (Balanced)</span>
								</>
							) : (
								<>
									<FaTimesCircle className='text-xl' />
									<span className='font-bold'>ບໍ່ສົມດຸນ (Unbalanced)</span>
								</>
							)}
						</div>
					)}
				</div>

				{/* Reconcile Summary Card */}
				{reconsider && (
					<Card className='mb-8 transform rounded-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800'>
						<CardBody className='p-6'>
							<h2 className='mb-4 text-xl font-bold text-gray-800 dark:text-white'>
								Transaction Summary
							</h2>
							<div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
								{/* Credit */}
								<div className='flex flex-col items-center'>
									<div className='mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white dark:bg-green-600'>
										<MdTrendingUp className='text-2xl' />
									</div>
									<p className='mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300'>
										ເຄຣດິດ (Credit)
									</p>
									<p className='text-2xl font-bold text-green-600 dark:text-green-400'>
										{reconsider.credit?.toLocaleString()} LAK
									</p>
								</div>

								{/* Debit */}
								<div className='flex flex-col items-center'>
									<div className='mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white dark:bg-red-600'>
										<MdTrendingDown className='text-2xl' />
									</div>
									<p className='mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300'>
										ເດບິດ (Debit)
									</p>
									<p className='text-2xl font-bold text-red-600 dark:text-red-400'>
										{reconsider.debit?.toLocaleString()} LAK
									</p>
								</div>

								{/* Net Profit */}
								<div className='flex flex-col items-center'>
									<div className='mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white dark:bg-indigo-600'>
										<FaWallet className='text-2xl' />
									</div>
									<p className='mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300'>
										ຍອດຄົງເຫຼືອ (Net Profit)
									</p>
									<p className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
										{reconsider.netProfit?.toLocaleString()} LAK
									</p>
								</div>

								{/* Net Profit / Comparison - Only show if glAccountDetail exists */}
								{glAccountDetail && (
									<div className='flex flex-col items-center'>
										{(() => {
											const apbBalance = glAccountDetail?.currBalance || 0;
											const mspBalance = glMspDetail?.balance || 0;
											const netProfit = reconsider?.netProfit || 0;
											const difference = apbBalance - mspBalance;

											const isEqual = Math.abs(difference) < 0.01;
											const mspBigger = difference < 0;

											return (
												<>
													<div
														className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full text-white ${
															isEqual
																? 'bg-green-500 dark:bg-green-600'
																: 'bg-orange-500 dark:bg-orange-600'
														}`}>
														{isEqual ? (
															<FaCheckCircle className='text-2xl' />
														) : (
															<FaWallet className='text-2xl' />
														)}
													</div>
													<p className='mb-1 text-center text-sm font-semibold text-gray-600 dark:text-gray-300'>
														{isEqual
															? 'ຍອດຄົງເຫຼືອ (Net Profit)'
															: 'ການກວດທຽບ (Compare)'}
													</p>
													<p
														className={`text-2xl font-bold ${
															isEqual
																? 'text-green-600 dark:text-green-400'
																: 'text-orange-600 dark:text-orange-400'
														}`}>
														{isEqual
															? `${netProfit.toLocaleString()} LAK`
															: `${Math.abs(difference).toLocaleString()} LAK`}
													</p>
													{!isEqual && (
														<div className='mt-3 rounded-lg bg-orange-50 px-4 py-2 dark:bg-orange-900/20'>
															<p className='text-md text-center font-bold text-orange-700 dark:text-orange-300'>
																⚠️ ບໍ່ສົມດຸນ
															</p>
															<p className='mt-1 text-center text-sm text-orange-600 dark:text-orange-400'>
																{mspBigger
																	? 'MSP ໃຫຍ່ກວ່າ APB'
																	: 'APB ໃຫຍ່ກວ່າ MSP'}
															</p>
														</div>
													)}
												</>
											);
										})()}
									</div>
								)}
							</div>
						</CardBody>
					</Card>
				)}

				{/* Dashboard Cards */}
				<div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
					{/* MSP Account Card */}
					{/*<Card className='transform rounded-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800'>*/}
					{/*	<CardHeader className='px-6 py-4 dark:bg-gray-800'>*/}
					{/*		<div className='flex items-center gap-3'>*/}
					{/*			<div className='flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white dark:bg-blue-600'>*/}
					{/*				<img className='h-12 w-14' src={mspLogo} alt='' />*/}
					{/*			</div>*/}
					{/*			<div>*/}
					{/*				<CardTitle className='text-xl font-extrabold text-blue-900 dark:text-blue-200'>*/}
					{/*					MSP Account*/}
					{/*				</CardTitle>*/}
					{/*				<p className='text-sm text-blue-600 dark:text-blue-400'>*/}
					{/*					Mobile Payment System*/}
					{/*				</p>*/}
					{/*			</div>*/}
					{/*		</div>*/}
					{/*	</CardHeader>*/}
					{/*	<CardBody className='space-y-4 p-6'>*/}
					{/*		<div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>*/}
					{/*			<p className='mb-2 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300'>*/}
					{/*				ຍອດເງິນ (Balance)*/}
					{/*			</p>*/}
					{/*			<p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>*/}
					{/*				{glMspDetail?.balance?.toLocaleString()} {glMspDetail?.ccy}*/}
					{/*			</p>*/}
					{/*		</div>*/}

					{/*		<div className='grid grid-cols-2 gap-4'>*/}
					{/*			<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>*/}
					{/*				<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>*/}
					{/*					ເລກບັນຊີ*/}
					{/*				</p>*/}
					{/*				<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>*/}
					{/*					{glMspDetail?.acctNo}*/}
					{/*				</p>*/}
					{/*			</div>*/}
					{/*			<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>*/}
					{/*				<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>*/}
					{/*					ປະເພດກະເປົາ*/}
					{/*				</p>*/}
					{/*				<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>*/}
					{/*					{glMspDetail?.walletType}*/}
					{/*				</p>*/}
					{/*			</div>*/}
					{/*		</div>*/}

					{/*		<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>*/}
					{/*			<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>*/}
					{/*				ຊື່ບັນຊີ*/}
					{/*			</p>*/}
					{/*			<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>*/}
					{/*				{glMspDetail?.acctName}*/}
					{/*			</p>*/}
					{/*		</div>*/}

					{/*		<div className='flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>*/}
					{/*			<span className='text-xs font-semibold text-gray-600 dark:text-gray-300'>*/}
					{/*				ສະຖານະ*/}
					{/*			</span>*/}
					{/*			<span*/}
					{/*				className={`rounded-full px-3 py-1 text-xs font-bold ${*/}
					{/*					glMspDetail?.status === '1'*/}
					{/*						? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'*/}
					{/*						: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'*/}
					{/*				}`}>*/}
					{/*				{glMspDetail?.status === '1'*/}
					{/*					? 'ໃຊ້ງານ (Active)'*/}
					{/*					: 'ປິດ (Inactive)'}*/}
					{/*			</span>*/}
					{/*		</div>*/}
					{/*	</CardBody>*/}
					{/*</Card>*/}

					{/* APB GL Account Card - Only render if glAccountDetail exists */}
					{glAccountDetail && (
						<Card className='transform rounded-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800'>
							<CardHeader className='bg-white px-6 py-4 dark:bg-gray-800'>
								<div className='flex items-center gap-3'>
									<div className='flex h-20 w-20 items-center justify-center rounded-full text-white'>
										<img src={meephomLogo} className='h-20 w-20' alt='' />
									</div>
									<div>
										<CardTitle className='text-xl font-extrabold text-purple-900 dark:text-purple-200'>
											APB GL Account
										</CardTitle>
										<p className='text-sm text-purple-600 dark:text-purple-400'>
											General Ledger System
										</p>
									</div>
								</div>
							</CardHeader>
							<CardBody className='space-y-4 p-6'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
											ເລກບັນຊີ
										</p>
										<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
											{glAccountDetail?.glNumber}
										</p>
									</div>
									<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
											ຊື່ບັນຊີ
										</p>
										<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
											{glAccountDetail?.glName}
										</p>
									</div>
								</div>
							</CardBody>
						</Card>
					)}

					{/* Customer Summary Card */}
					{/*<Card className='transform rounded-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800'>*/}
					{/*	<CardHeader className='px-6 py-4 dark:bg-gray-800'>*/}
					{/*		<div className='flex items-center gap-3'>*/}
					{/*			<div className='flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white dark:bg-green-600'>*/}
					{/*				<img className='h-12 w-14' src={mspLogo} alt='MSP Logo' />*/}
					{/*			</div>*/}
					{/*			<div>*/}
					{/*				<CardTitle className='text-xl font-extrabold text-green-900 dark:text-green-200'>*/}
					{/*					MSP Customer Summary*/}
					{/*				</CardTitle>*/}
					{/*				<p className='text-sm text-green-600 dark:text-green-400'>*/}
					{/*					ສະຫຼຸບລູກຄ້າ*/}
					{/*				</p>*/}
					{/*			</div>*/}
					{/*		</div>*/}
					{/*	</CardHeader>*/}

					{/*	<CardBody className='space-y-4 p-6'>*/}
					{/*		/!* Total Balance - Main Highlight *!/*/}
					{/*		<div className='rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-900/20 dark:to-emerald-900/20'>*/}
					{/*			<p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300'>*/}
					{/*				ຍອດລວມທັງໝົດ (Total Amount)*/}
					{/*			</p>*/}
					{/*			<p className='text-4xl font-bold text-green-600 dark:text-green-400'>*/}
					{/*				{customerDetail?.total?.toLocaleString() || '0'} LAK*/}
					{/*			</p>*/}
					{/*		</div>*/}

					{/*		/!* Grid of Summary Cards *!/*/}
					{/*		<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>*/}
					{/*			/!* Wallet Count *!/*/}
					{/*			<div className='rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-900/20 dark:to-blue-800/20'>*/}
					{/*				<div className='flex items-center gap-3'>*/}
					{/*					<div className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 dark:bg-gray-700 dark:text-blue-400'>*/}
					{/*						<FaWallet size={18} />*/}
					{/*					</div>*/}
					{/*					<div>*/}
					{/*						<p className='text-xs font-semibold text-blue-700 dark:text-blue-300'>*/}
					{/*							ຈຳນວນກະເປົາ*/}
					{/*						</p>*/}
					{/*						<p className='text-2xl font-bold text-blue-900 dark:text-blue-200'>*/}
					{/*							{customerDetail?.countWallet || 0}*/}
					{/*						</p>*/}
					{/*					</div>*/}
					{/*				</div>*/}
					{/*			</div>*/}

					{/*			/!* Balance *!/*/}
					{/*			<div className='rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4 dark:from-green-900/20 dark:to-green-800/20'>*/}
					{/*				<div className='flex items-center gap-3'>*/}
					{/*					<div className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-600 dark:bg-gray-700 dark:text-green-400'>*/}
					{/*						<FaMoneyBillWave size={18} />*/}
					{/*					</div>*/}
					{/*					<div>*/}
					{/*						<p className='text-xs font-semibold text-green-700 dark:text-green-300'>*/}
					{/*							ຍອດເງິນ (Balance)*/}
					{/*						</p>*/}
					{/*						<p className='text-xl font-bold text-green-900 dark:text-green-200'>*/}
					{/*							{customerDetail?.sumBalance?.toLocaleString() ||*/}
					{/*								'0'}*/}
					{/*						</p>*/}
					{/*					</div>*/}
					{/*				</div>*/}
					{/*			</div>*/}

					{/*			/!* Fee *!/*/}
					{/*			<div className='rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4 dark:from-orange-900/20 dark:to-orange-800/20'>*/}
					{/*				<div className='flex items-center gap-3'>*/}
					{/*					<div className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-600 dark:bg-gray-700 dark:text-orange-400'>*/}
					{/*						<FaCoins size={18} />*/}
					{/*					</div>*/}
					{/*					<div>*/}
					{/*						<p className='text-xs font-semibold text-orange-700 dark:text-orange-300'>*/}
					{/*							ຄ່າທຳນຽມ (Fee)*/}
					{/*						</p>*/}
					{/*						<p className='text-xl font-bold text-orange-900 dark:text-orange-200'>*/}
					{/*							{customerDetail?.sumFee?.toLocaleString() || '0'}*/}
					{/*						</p>*/}
					{/*					</div>*/}
					{/*				</div>*/}
					{/*			</div>*/}
					{/*		</div>*/}

					{/*		/!* Summary Breakdown *!/*/}
					{/*		<div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50'>*/}
					{/*			<div className='mb-3 flex items-center gap-2'>*/}
					{/*				<FaChartLine className='text-green-600 dark:text-green-400' />*/}
					{/*				<h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>*/}
					{/*					ລາຍລະອຽດຍອດເງິນ*/}
					{/*				</h4>*/}
					{/*			</div>*/}
					{/*			<div className='space-y-2 text-sm'>*/}
					{/*				<div className='flex justify-between'>*/}
					{/*					<span className='text-gray-600 dark:text-gray-400'>*/}
					{/*						ຍອດເງິນໃນກະເປົາ:*/}
					{/*					</span>*/}
					{/*					<span className='font-semibold text-gray-900 dark:text-gray-100'>*/}
					{/*						{customerDetail?.sumBalance?.toLocaleString() || '0'}{' '}*/}
					{/*						LAK*/}
					{/*					</span>*/}
					{/*				</div>*/}
					{/*				<div className='flex justify-between'>*/}
					{/*					<span className='text-gray-600 dark:text-gray-400'>*/}
					{/*						ຄ່າທຳນຽມ:*/}
					{/*					</span>*/}
					{/*					<span className='font-semibold text-gray-900 dark:text-gray-100'>*/}
					{/*						+ {customerDetail?.sumFee?.toLocaleString() || '0'} LAK*/}
					{/*					</span>*/}
					{/*				</div>*/}
					{/*				<div className='border-t border-gray-300 pt-2 dark:border-gray-600'>*/}
					{/*					<div className='flex justify-between'>*/}
					{/*						<span className='font-semibold text-gray-700 dark:text-gray-300'>*/}
					{/*							ລວມທັງໝົດ:*/}
					{/*						</span>*/}
					{/*						<span className='text-lg font-bold text-green-600 dark:text-green-400'>*/}
					{/*							{customerDetail?.total?.toLocaleString() || '0'} LAK*/}
					{/*						</span>*/}
					{/*					</div>*/}
					{/*				</div>*/}
					{/*				<div className='mt-2 border-t border-gray-300 pt-2 dark:border-gray-600'>*/}
					{/*					<div className='flex justify-between'>*/}
					{/*						<span className='font-semibold text-purple-700 dark:text-purple-300'>*/}
					{/*							ຈຳກັດສູງສຸດ:*/}
					{/*						</span>*/}
					{/*						<span className='text-lg font-bold text-purple-600 dark:text-purple-400'>*/}
					{/*							{masterMaxLimit?.toLocaleString() || '0'} LAK*/}
					{/*						</span>*/}
					{/*					</div>*/}
					{/*				</div>*/}
					{/*			</div>*/}
					{/*		</div>*/}
					{/*	</CardBody>*/}
					{/*</Card>*/}

					{/* DD Account Card - Only render if ddAccountDetail exists */}
					{ddAccountDetail && (
						<Card className='transform rounded-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 '>
							<CardHeader className='bg-white px-6 py-4 dark:bg-gray-800'>
								<div className='flex items-center gap-3'>
									<div className='flex h-20 w-20 items-center justify-center rounded-full text-white'>
										<img src={meephomLogo} className='h-20 w-20' alt='' />
									</div>
									<div>
										<CardTitle className='text-xl font-extrabold text-indigo-900 dark:text-indigo-200'>
											DD Account Detail
										</CardTitle>
										<p className='text-sm text-indigo-600 dark:text-indigo-400'>
											Demand Deposit Account
										</p>
									</div>
								</div>
							</CardHeader>
							<CardBody className='space-y-4 p-6'>
								<div className='grid gap-4'>
									{/* Current Balance - Blue Theme */}
									<div className='rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-md dark:border-blue-700 dark:from-blue-900/30 dark:to-blue-800/30'>
										<div className='mb-3 flex items-center gap-3'>
											<div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg dark:bg-blue-600'>
												<MdAccountBalance className='text-2xl' />
											</div>
											<p className='text-sm font-bold uppercase tracking-wide text-blue-800 dark:text-blue-200'>
												ຍອດເງິນປະຈຸບັນ (Current Balance)
											</p>
										</div>
										<p className='text-4xl font-extrabold text-blue-700 dark:text-blue-300'>
											{ddAccountDetail?.currBalance?.toLocaleString()}{' '}
											{ddAccountDetail?.acctCcy}
										</p>
										<p className='mt-2 text-xs text-blue-600 dark:text-blue-400'>
											ຍອດເງິນໃນບັນຊີ DD ຂອງ APB
										</p>
									</div>

									{/* APB Tracking Balance - Purple/Green Theme */}
									<div className='rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-md dark:border-purple-700 dark:from-purple-900/30 dark:to-pink-900/30'>
										<div className='mb-3 flex items-center gap-3'>
											<div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg dark:bg-purple-600'>
												<FaChartLine className='text-xl' />
											</div>
											<p className='text-sm font-bold uppercase tracking-wide text-purple-800 dark:text-purple-200'>
												ຍອດເງິນຕິດຕາມບັນຊີເງິນຝາກຢູ່ APB (1131110003)
											</p>
										</div>
										<p className='text-4xl font-extrabold text-purple-700 dark:text-purple-300'>
											{customerDetail?.sumBalance?.toLocaleString()}{' '}
											{ddAccountDetail?.acctCcy}
										</p>
										<p className='mt-2 text-xs text-purple-600 dark:text-purple-400'>
											ຍອດລວມຈາກລູກຄ້າທັງໝົດໃນລະບົບ MSP
										</p>
									</div>

									{/* Difference Comparison */}
									{(() => {
										const currentBalance = ddAccountDetail?.currBalance || 0;
										const trackingBalance = customerDetail?.sumBalance || 0;
										const difference = currentBalance - trackingBalance;
										const isBalanced = Math.abs(difference) < 0.01;
										const isPositive = difference > 0;

										return (
											<div
												className={`rounded-lg border-2 p-5 shadow-lg ${
													isBalanced
														? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-100 dark:border-green-700 dark:from-green-900/30 dark:to-emerald-900/30'
														: 'border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-100 dark:border-orange-700 dark:from-orange-900/30 dark:to-yellow-900/30'
												}`}>
												<div className='mb-3 flex items-center justify-between'>
													<div className='flex items-center gap-3'>
														<div
															className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg ${
																isBalanced
																	? 'bg-green-500 dark:bg-green-600'
																	: 'bg-orange-500 dark:bg-orange-600'
															}`}>
															{isBalanced ? (
																<FaCheckCircle className='text-2xl' />
															) : (
																<FaTimesCircle className='text-2xl' />
															)}
														</div>
														<p
															className={`text-sm font-bold uppercase tracking-wide ${
																isBalanced
																	? 'text-green-800 dark:text-green-200'
																	: 'text-orange-800 dark:text-orange-200'
															}`}>
															ຜົນຕ່າງ (Difference)
														</p>
													</div>
													<span
														className={`rounded-full px-4 py-2 text-xs font-bold ${
															isBalanced
																? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
																: 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
														}`}>
														{isBalanced ? '✓ ສົມດຸນ' : '⚠ ບໍ່ສົມດຸນ'}
													</span>
												</div>
												<p
													className={`text-4xl font-extrabold ${
														isBalanced
															? 'text-green-700 dark:text-green-300'
															: isPositive
																? 'text-orange-700 dark:text-orange-300'
																: 'text-red-700 dark:text-red-300'
													}`}>
													{isPositive && !isBalanced ? '+' : ''}
													{difference.toLocaleString()}{' '}
													{ddAccountDetail?.acctCcy}
												</p>
												<div className='mt-3 space-y-1'>
													<p
														className={`text-xs ${
															isBalanced
																? 'text-green-600 dark:text-green-400'
																: 'text-orange-600 dark:text-orange-400'
														}`}>
														{isBalanced
															? 'ຍອດເງິນສົມດຸນກັນ'
															: isPositive
																? 'ຍອດເງິນປະຈຸບັນ ໃຫຍ່ກວ່າ ຍອດຕິດຕາມ'
																: 'ຍອດຕິດຕາມ ໃຫຍ່ກວ່າ ຍອດເງິນປະຈຸບັນ'}
													</p>
													<p
														className={`text-xs font-semibold ${
															isBalanced
																? 'text-green-700 dark:text-green-300'
																: 'text-orange-700 dark:text-orange-300'
														}`}>
														= {currentBalance.toLocaleString()} -{' '}
														{trackingBalance.toLocaleString()}
													</p>
												</div>
											</div>
										);
									})()}
								</div>

								<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
									<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
											ເລກບັນຊີ
										</p>
										<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
											{ddAccountDetail?.acctNumber}
										</p>
									</div>
									<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
											ປະເພດບັນຊີ
										</p>
										<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
											{ddAccountDetail?.acctType}
										</p>
									</div>
									<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
											ລະຫັດຜະລິດຕະພັນ
										</p>
										<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
											{ddAccountDetail?.prodCode}
										</p>
									</div>
								</div>

								<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
									<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
											ຊື່ບັນຊີ (ລາວ)
										</p>
										<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
											{ddAccountDetail?.acctNameLa}
										</p>
									</div>
									<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
											ຊື່ບັນຊີ (EN)
										</p>
										<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
											{ddAccountDetail?.acctNameEn}
										</p>
									</div>
								</div>

								<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
									<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
											ສາຂາ (Branch)
										</p>
										<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
											{ddAccountDetail?.branch}
										</p>
									</div>
									<div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
											CIF
										</p>
										<p className='text-sm font-bold text-gray-800 dark:text-gray-200'>
											{ddAccountDetail?.cif}
										</p>
									</div>
									<div className='flex items-center justify-center rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
										<div className='text-center'>
											<p className='mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300'>
												ສະຖານະ
											</p>
											<span
												className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
													ddAccountDetail?.acctStatus === 'N'
														? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
														: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
												}`}>
												{ddAccountDetail?.acctStatus === 'N'
													? 'ປົກກະຕິ (Normal)'
													: ddAccountDetail?.acctStatus}
											</span>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					)}
				</div>
			</div>
		</PageWrapper>
	);
};

export default ReconcilePage;
