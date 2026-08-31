import { useEffect, useState } from 'react';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';

import Container from '@/components/layouts/Container/Container.tsx';
import Card, { CardBody, CardTitle } from '@/components/ui/Card.tsx';
import Badge from '@/components/ui/Badge.tsx';
import TableTemplate, { TableCardFooterTemplate } from '@/templates/common/TableParts.template.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import {
	createColumnHelper,
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	SortingState,
} from '@tanstack/react-table';
import { useGetCustomerQuery } from '@/pages/customer/redux/queries/customerApiSlice.ts';
import { useNavigate } from 'react-router-dom';
import SearchCustomer from '@/pages/customer/approve/components/searchCustomer/searchCustomer.tsx';
import { Button, Chip } from '@heroui/react';
import { LuSearch, LuUsersRound } from 'react-icons/lu';
import { FaLock, FaUnlock } from 'react-icons/fa';
// import SearchCustomer from "@/pages/customer/approve/components/searchCustomer/searchCustomer.tsx";

const CustomerApprovePage = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [openSearch, setOpenSearch] = useState(false);
	const [refetchInterval, setRefetchInterval] = useState<number | null>(null);
	const [activeInterval, setActiveInterval] = useState<number | null>(null); // Tracks the active button

	const navigate = useNavigate();

	const { data, isLoading, refetch } = useGetCustomerQuery({
		page: pageIndex,
		size: pageSize,
		search: '',
		approved: false,
	});

	const handleNavigate = (value: any) => {
		navigate(`/customer/approve/${value.customer.customerId}`, { state: value });
	};
	useEffect(() => {
		if (refetchInterval !== null) {
			const interval = setInterval(() => {
				refetch();
			}, refetchInterval);
			return () => clearInterval(interval); // Clear the interval on cleanup
		}
	}, [refetchInterval, refetch]);

	const columnHelper = createColumnHelper<any>();
	const columns = [
		columnHelper.accessor('id', {
			header: 'ID',
			cell: (info) => <div>{info.row.original.profileId}</div>,
		}),

		columnHelper.accessor((row) => `${row.firstNameLa} ${row.lastNameLa}`, {
			id: 'fullNameLa',
			header: 'Full Name (La)',
			cell: (info) => (
				<div
					onClick={() => handleNavigate(info.row.original)}
					className='cursor-pointer font-bold'>
					{info.getValue()}
				</div>
			),
		}),

		columnHelper.accessor((row) => `${row.firstNameEn} ${row.lastNameEn}`, {
			id: 'fullNameEn',
			header: 'Full Name (En)',
			cell: (info) => (
				<div
					onClick={() => handleNavigate(info.row.original)}
					className='cursor-pointer font-bold'>
					{info.getValue()}
				</div>
			),
		}),

		columnHelper.accessor('genderLa', {
			header: 'Gender (La)',
			cell: (info) => (
				<div>
					<div
						onClick={() => handleNavigate(info.row.original)}
						className='cursor-pointer '>
						{info.getValue()}
					</div>
				</div>
			),
		}),

		columnHelper.accessor('birthday', {
			header: 'Birthday',
			cell: (info) => (
				<div>
					<div
						onClick={() => handleNavigate(info.row.original)}
						className='cursor-pointer '>
						{info.getValue()}
					</div>
				</div>
			),
		}),

		columnHelper.accessor('tel', {
			header: 'Tel',
			cell: (info) => (
				<div>
					<div
						onClick={() => handleNavigate(info.row.original)}
						className='cursor-pointer '>
						{info.getValue()}
					</div>
				</div>
			),
		}),

		columnHelper.accessor(
			(row) =>
				`${row.addresses[0]?.village}, ${row.addresses[0]?.city}, ເເຂວງ ${row.addresses[0]?.province}`,
			{
				id: 'address',
				header: 'Address',
				cell: (info) => (
					<div>
						<div
							onClick={() => handleNavigate(info.row.original)}
							className='cursor-pointer '>
							{info.getValue()}
						</div>
					</div>
				),
			},
		),

		columnHelper.accessor('customer.customer.locked', {
			header: 'Status',
			cell: (info) => (
				<div>
					<Chip
						size='lg'
						color={info.getValue()?.customer?.locked ? 'danger' : 'primary'}
						startContent={
							info.getValue()?.customer?.locked ? (
								<FaLock size={14} />
							) : (
								<FaUnlock size={14} />
							)
						}
						variant='bordered'>
						{info.getValue()?.customer?.locked ? 'Locked' : 'Unlocked'}
					</Chip>
				</div>
			),
		}),
	];

	const handleSetRefetchInterval = (minutes: number) => {
		setRefetchInterval(minutes * 60 * 1000); // Convert minutes to milliseconds
		setActiveInterval(minutes); // Set active button
	};
	const table = useReactTable({
		data: data?.body?.content || [],
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: data?.body?.totalPages || 1,
		initialState: { pagination: { pageIndex, pageSize } },
	});

	const handleSearch = () => {
		setOpenSearch(true);
	};
	useEffect(() => {
		refetch();
	}, [refetch]);

	// Your interval logic
	useEffect(() => {
		if (refetchInterval !== null) {
			const interval = setInterval(() => {
				refetch();
			}, refetchInterval);
			return () => clearInterval(interval);
		}
	}, [refetchInterval, refetch]);
	useEffect(() => {
		handleSetRefetchInterval(1); // Set default refetch interval to 1 min
	}, []);
	return (
		<>
			{isLoading && <Loading />}
			<PageWrapper name='Customer Management'>
				<SearchCustomer
					isApproveRoute={true}
					isApprove={false}
					openSearch={openSearch}
					setOpenSearch={setOpenSearch}
				/>
				<Subheader>
					<SubheaderLeft>
						<FieldWrap>
							<div className='flex flex-wrap items-center justify-between gap-6   rounded-lg '>
								{/* Title */}
								<div className='flex items-center gap-4'>
									<CardTitle className='text-2xl font-bold '>
										ຂໍ້ມູນລູກຄ້າ (ອະນຸມັດລູກຄ້າທີ່ລົງທະບຽນໃໝ່)
									</CardTitle>
									{/* Badge */}
									<Badge
										variant='outline'
										className='flex items-center justify-center rounded-full  border-transparent px-8 py-[2px] text-xl'>
										<LuUsersRound className='mb-[1px] mr-2 h-6 w-6' />
										{data?.body?.totalElements || 0} ທ່ານ
									</Badge>
								</div>
							</div>
						</FieldWrap>
					</SubheaderLeft>
					<SubheaderRight>
						<div className='flex items-center gap-4'>
							{/* Display current refresh interval */}
							{activeInterval !== null && (
								<span className='text-sm '>
									ອັບເດດຂໍ້ມູນທຸກ {activeInterval} ນາທີ
								</span>
							)}
							{/* Buttons for setting refetch intervals */}
							{[1, 5, 10].map((interval) => (
								<Button
									key={interval}
									onPress={() => handleSetRefetchInterval(interval)}
									variant='bordered'
									radius='sm'
									color={`${
										activeInterval === interval ? 'primary' : 'default'
									}`}>
									{interval} ນາທີ
								</Button>
							))}
						</div>

						{/* Search Button */}
						<Button
							startContent={<LuSearch className='h-5 w-6' />}
							color='primary'
							radius='full'
							onPress={handleSearch}
							variant='solid'
							className='text-md w-64 font-medium'>
							ຄົ້ນຫາ
						</Button>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card>
						{/*<CardHeader>*/}
						{/*    <CardHeaderChild>*/}
						{/*        <CardTitle>ຂໍ້ມູນລູກຄ້າ</CardTitle>*/}
						{/*    </CardHeaderChild>*/}
						{/*</CardHeader>*/}
						<CardBody>
							<TableTemplate table={table} className='table-fixed' />
						</CardBody>
						<TableCardFooterTemplate
							table={table}
							onPageChange={(newPage) => setPageIndex(newPage)}
							onPageSizeChange={(newSize) => setPageSize(newSize)}>
							<div className='pagination-info'>
								<span>{`Showing ${data?.body?.numberOfElements || 0} items out of ${
									data?.body?.totalElements || 0
								} total items`}</span>
							</div>
						</TableCardFooterTemplate>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default CustomerApprovePage;
