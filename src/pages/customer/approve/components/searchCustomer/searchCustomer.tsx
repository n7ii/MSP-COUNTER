'use client';

import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Dialog,
	DialogPanel,
	DialogBackdrop,
} from '@headlessui/react';
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { UsersIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useGetCustomerQuery } from '@/pages/customer/redux/queries/customerApiSlice.ts';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationProfile from '@/assets/animation/people.json';
import { Image } from '@heroui/image';

const RECENT_SEARCHES_KEY = 'recent_customer_searches';
const MAX_RECENT_SEARCHES = 5;

const getContactLabel = (person: any) => {
	const tel = person?.tel?.toString?.() ?? '';
	if (!tel || tel === '0000000000') {
		return person?.email || person?.customer?.email || '-';
	}
	return tel;
};

export default function SearchCustomer({
	isApprove,
	openSearch,
	setOpenSearch,
	isApproveRoute,
}: any) {
	const [query, setQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');
	const [recentSearches, setRecentSearches] = useState<any[]>([]);
	const navigate = useNavigate();

	// Load recent searches from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
		if (stored) {
			try {
				setRecentSearches(JSON.parse(stored));
			} catch (error) {
				console.error('Error parsing recent searches:', error);
				localStorage.removeItem(RECENT_SEARCHES_KEY);
			}
		}
	}, []);

	// Save recent search to localStorage
	const saveRecentSearch = (customer: any) => {
		// Remove duplicate if exists
		const filtered = recentSearches.filter(
			(item) => item.customer?.customerId !== customer.customer?.customerId,
		);

		// Add new search at the beginning
		const updated = [customer, ...filtered].slice(0, MAX_RECENT_SEARCHES);

		setRecentSearches(updated);
		localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
	};

	// Clear all recent searches
	const clearRecentSearches = () => {
		setRecentSearches([]);
		localStorage.removeItem(RECENT_SEARCHES_KEY);
	};

	// Remove single recent search
	const removeRecentSearch = (customerId: string) => {
		const updated = recentSearches.filter((item) => item.customer?.customerId !== customerId);
		setRecentSearches(updated);
		localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
	};

	const handleNavigate = (value: any) => {
		const customerId =
			value?.customer?.customerId ?? value?.customerId ?? value?.customer?.id;
		if (!value || !customerId) {
			console.warn('Invalid navigation value:', value);
			return;
		}

		// Save to recent searches
		saveRecentSearch(value);

		if (isApproveRoute) {
			navigate(`/customer/approve/${customerId}`, { state: value });
		} else {
			navigate(`/customer/management/${customerId}`, { state: value });
		}

		// Close dialog after navigation
		setOpenSearch(false);
		setQuery('');
	};

	// Fetch data using RTK Query
	const { data, isLoading, isError } = useGetCustomerQuery({
		page: 0,
		size: 10,
		approved: isApprove,
		search: debouncedQuery,
	});

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 1000); // 1-second delay

		return () => clearTimeout(handler); // Cleanup on query change
	}, [query]);

	// Transform the data into a format compatible with the UI
	const people = data?.body?.content || [];
	console.log('people', people);

	// Show recent searches when query is empty
	const showRecentSearches = query === '' && recentSearches.length > 0;

	return (
		<Dialog
			className='relative z-50'
			open={openSearch}
			onClose={() => {
				setOpenSearch(false);
				setQuery('');
			}}>
			<DialogBackdrop
				transition
				className='fixed inset-0 bg-gray-500/25 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-[#121212]/65'
			/>

			<div className='fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20'>
				<DialogPanel
					transition
					className='mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:divide-gray-700 dark:bg-[#121212] dark:shadow-gray-900'>
					<Combobox<any> onChange={(value) => handleNavigate(value)}>
						{({ activeOption }) => (
							<>
								<div className='grid grid-cols-1'>
									<ComboboxInput
										autoFocus
										className='col-start-1 row-start-1 h-12 w-full pl-11 pr-4 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:bg-[#121212] dark:text-gray-100 dark:placeholder:text-gray-500 sm:text-sm'
										placeholder='Search...'
										onChange={(event) => setQuery(event.target.value)}
										value={query}
									/>
									<MagnifyingGlassIcon
										className='pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400'
										aria-hidden='true'
									/>
								</div>

								{isLoading && (
									<div className='px-6 py-14 text-center text-sm dark:text-gray-100 sm:px-14'>
										<p className='mt-4 font-semibold text-gray-900 dark:text-gray-100'>
											Loading...
										</p>
									</div>
								)}

								{isError && (
									<div className='px-6 py-14 text-center text-sm sm:px-14'>
										<UsersIcon
											className='mx-auto size-6 text-gray-400 dark:text-gray-500'
											aria-hidden='true'
										/>
										<p className='mt-4 font-semibold text-gray-900 dark:text-gray-100'>
											Error fetching data
										</p>
										<p className='mt-2 text-gray-500 dark:text-gray-400'>
											Please try again later.
										</p>
									</div>
								)}

								{/* Show Recent Searches when query is empty */}
								{!isLoading && !isError && showRecentSearches && (
									<div className='px-6 py-4'>
										<div className='mb-3 flex items-center justify-between'>
											<div className='flex items-center gap-2'>
												<ClockIcon className='size-5 text-gray-400' />
												<h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
													ປະຫວັດການຄົ້ນຫາ
												</h3>
											</div>
											<button
												onClick={clearRecentSearches}
												className='text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'>
												Clear all
											</button>
										</div>
										<div className='space-y-2'>
											{recentSearches.map((person: any) => (
												<div
													key={person.customer?.customerId}
													className='group flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-50 dark:hover:bg-[#1c1c1c]'
													onClick={() => handleNavigate(person)}>
													<div className='flex items-center gap-3'>
														{person?.profImg ? (
															<Image
																src={
																	import.meta.env.VITE_IMAGE_URL +
																	person.profImg
																}
																alt='Avatar'
																className='h-10 w-10 rounded-full'
															/>
														) : (
															<Lottie
																animationData={animationProfile}
																className='h-10 w-10 rounded-full bg-teal-50 dark:bg-teal-900'
																autoplay
																loop
															/>
														)}
														<div>
															<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																{person?.firstNameLa}{' '}
																{person?.lastNameLa}
															</p>
															<p className='text-xs text-gray-500 dark:text-gray-400'>
																{getContactLabel(person)}
															</p>
														</div>
													</div>
													<button
														onClick={(e) => {
															e.stopPropagation();
															removeRecentSearch(
																person.customer?.customerId,
															);
														}}
														className='opacity-0 transition-opacity group-hover:opacity-100'>
														<XMarkIcon className='size-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300' />
													</button>
												</div>
											))}
										</div>
									</div>
								)}

								{!isLoading &&
									!isError &&
									(query === '' || people.length > 0) &&
									!showRecentSearches && (
										<ComboboxOptions
											as='div'
											static
											hold
											className='flex max-h-[500px] divide-x divide-gray-100 overflow-y-auto dark:divide-gray-700'>
											{/* Left Panel - Filtered List */}
											<div className='max-h-[500px] w-1/2 overflow-y-auto px-6 py-4'>
												{people.map((person: any) => (
													<ComboboxOption
														as='div'
														key={person.id}
														value={person} // Now properly typed
														className='group flex cursor-default select-none items-center rounded-md p-2
                                                           hover:bg-gray-50 data-[focus]:bg-gray-100 data-[focus]:text-gray-900
                                                           data-[focus]:outline-none dark:hover:bg-[#1c1c1c]
                                                           dark:data-[focus]:bg-gray-700 dark:data-[focus]:text-gray-100'>
														{person?.profImg ? (
															<>
																<Image
																	src={
																		person?.profImg
																			? import.meta.env
																					.VITE_IMAGE_URL +
																				person?.profImg
																			: 'https://via.placeholder.com/150'
																	} // Fallback if no avatar exists
																	alt='Avatar'
																	className='h-10 w-10 rounded-full  '
																/>
															</>
														) : (
															<>
																<Lottie
																	animationData={animationProfile}
																	className='h-10 w-10 rounded-full  bg-teal-50 dark:bg-teal-900'
																	autoplay
																	loop
																/>
															</>
														)}

														<span className='ml-3 flex-auto truncate'>
															{person?.firstNameLa}{' '}
															{person?.lastNameLa}
														</span>
														<ChevronRightIcon
															className='ml-3 hidden size-5 flex-none text-gray-400 group-data-[focus]:block'
															aria-hidden='true'
														/>
													</ComboboxOption>
												))}
											</div>

											{/* Right Panel - Active Option Details */}
											{activeOption && (
												<div className='flex h-[500px] w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700'>
													<div className='flex flex-none flex-col items-center justify-center p-6 text-center'>
														{activeOption?.profImg ? (
															<>
																<Image
																	src={
																		activeOption?.profImg
																			? import.meta.env
																					.VITE_IMAGE_URL +
																				activeOption?.profImg
																			: 'https://via.placeholder.com/150'
																	} // Fallback if no avatar exists
																	alt='Avatar'
																	className='h-44 w-44 rounded-[28px] object-cover ring-[6px] ring-white dark:ring-gray-800'
																/>
															</>
														) : (
															<>
																<Lottie
																	animationData={animationProfile}
																	className='h-44 w-44 rounded-[28px] bg-teal-50 ring-[6px] ring-white dark:bg-teal-900 dark:ring-gray-800'
																	autoplay
																	loop
																/>
															</>
														)}

														<h2 className='mt-3 text-2xl font-semibold text-gray-900 dark:text-gray-100'>
															{activeOption.prefixCode}{' '}
															{activeOption.firstNameEn}{' '}
															{activeOption.lastNameEn}
														</h2>
														<p className='text-sm/6 text-gray-500 dark:text-gray-400 '>
															{getContactLabel(activeOption)}
														</p>
													</div>

													<div className='flex flex-auto flex-col justify-between p-6'>
														<dl className='grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700'>
															<dt className='col-end-1 font-semibold text-gray-900 dark:text-gray-400'>
																ຊື່ ເເລະ ນາມສະກຸຸນ
															</dt>
															<dd className='dark:text-gray-400'>
																{activeOption?.prefixLa}{' '}
																{activeOption.firstNameLa}{' '}
																{activeOption?.lastNameLa}
															</dd>
															<dt className='col-end-1 font-semibold text-gray-900 dark:text-gray-400'>
																ເພດ
															</dt>
															<dd className='truncate dark:text-gray-400'>
																{activeOption.genderLa}
															</dd>
															<dt className='col-end-1 font-semibold text-gray-900 dark:text-gray-400'>
																ວດປ ເກີດ
															</dt>
															<dd className='truncate dark:text-gray-400'>
																{activeOption.birthday}
															</dd>
															<dt className='col-end-1 font-semibold text-gray-900 dark:text-gray-400'>
																ທີ່ຢູ່
															</dt>
															<dd className='truncate dark:text-gray-400'>
																{`${activeOption.addresses?.[0]?.village}, ${activeOption.addresses?.[0]?.city}, ເເຂວງ ${activeOption.addresses?.[0]?.province}`}
															</dd>
															<dt className='col-end-1 font-semibold text-gray-900 dark:text-gray-400'>
																Email
															</dt>
															<dd className='truncate'>
																<a
																	href={`mailto:${activeOption.email}`}
																	className='text-indigo-600 underline dark:text-gray-400'>
																	{activeOption.email}
																</a>
															</dd>
														</dl>
													</div>
												</div>
											)}
										</ComboboxOptions>
									)}

								{query !== '' && people?.length === 0 && (
									<div className='px-6 py-14 text-center text-sm sm:px-14'>
										<UsersIcon
											className='mx-auto size-6 text-gray-400  dark:text-gray-500'
											aria-hidden='true'
										/>
										<p className='mt-4 font-semibold text-gray-900 dark:text-gray-100'>
											No people found
										</p>
										<p className='mt-2 text-gray-500 dark:text-gray-400'>
											We couldn't find anything with that term. Please try
											again.
										</p>
									</div>
								)}
							</>
						)}
					</Combobox>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
