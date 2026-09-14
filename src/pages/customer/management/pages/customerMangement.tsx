import { useState, useEffect } from 'react';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchCustomer from '@/pages/customer/approve/components/searchCustomer/searchCustomer.tsx';
import { Button, Chip } from '@heroui/react';
import { LuSearch, LuUsersRound } from 'react-icons/lu';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { exportAllToExcel } from '@/pages/reports/utils/statementUtils.ts';
import { FaLock, FaUnlock } from 'react-icons/fa';

// Constants
const INITIAL_PAGE_SIZE = 10;
const EXPORT_PAGE_SIZE = 1000000;

const CustomerMangement = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const initialPageIndex = parseInt(searchParams.get('page') || '0', 10);
	const initialPageSize = parseInt(searchParams.get('size') || INITIAL_PAGE_SIZE.toString(), 10);

	const [sorting, setSorting] = useState<SortingState>([]);
	const [pageIndex, setPageIndex] = useState(initialPageIndex);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [openSearch, setOpenSearch] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	const navigate = useNavigate();

	// Sync state with URL
	useEffect(() => {
		setSearchParams({
			page: pageIndex.toString(),
			size: pageSize.toString(),
		});
	}, [pageIndex, pageSize, setSearchParams]);

	const { data, isLoading, refetch } = useGetCustomerQuery({
		page: pageIndex,
		size: pageSize,
		search: '',
		approved: true,
	});

	const handleNavigate = (value: any) => {
		const customerId = value?.customer?.customerId ?? value?.customerId;
		if (!customerId) {
			console.warn('Missing customerId on row', value);
			return;
		}
		navigate(`/customer/management/${customerId}`, { state: value });
	};

	const columnHelper = createColumnHelper<any>();
	const columns = [
		columnHelper.accessor('id', {
			header: 'ID',
			cell: (info) => <div>{info.row.original.profileId}</div>,
		}),

		columnHelper.accessor((row) => `${row.firstNameLa} ${row.lastNameLa}`, {
			id: 'fullNameLa',
			header: 'Full Name (La)',
			cell: (info) => <div className='font-bold'>{info.getValue()}</div>,
		}),

		columnHelper.accessor((row) => `${row.firstNameEn} ${row.lastNameEn}`, {
			id: 'fullNameEn',
			header: 'Full Name (En)',
			cell: (info) => <div className='font-bold'>{info.getValue()}</div>,
		}),

		columnHelper.accessor('genderLa', {
			header: 'Gender (La)',
			cell: (info) => <div>{info.getValue()}</div>,
		}),

		columnHelper.accessor('birthday', {
			header: 'Birthday',
			cell: (info) => <div>{info.getValue()}</div>,
		}),

		columnHelper.accessor('tel', {
			header: 'Tel',
			cell: (info) => <div>{info.getValue()}</div>,
		}),

		columnHelper.accessor(
			(row) => {
				const address = row.addresses?.[0];
				if (!address) return '-';
				return `${address.village ?? ''}, ${address.city ?? ''}, ເເຂວງ ${address.province ?? ''}`;
			},
			{
				id: 'address',
				header: 'Address',
				cell: (info) => <div>{info.getValue()}</div>,
			},
		),

		columnHelper.accessor((row) => row.customer?.locked, {
			id: 'locked',
			header: 'Status',
			cell: (info) => {
				const locked = Boolean(info.getValue());
				return (
					<Chip
						size='lg'
						color={locked ? 'danger' : 'primary'}
						startContent={locked ? <FaLock size={14} /> : <FaUnlock size={14} />}
						variant='bordered'>
						{locked ? 'Locked' : 'Unlocked'}
					</Chip>
				);
			},
		}),
	];

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

	// Export to Excel Function using utility
	const exportAllDataToExcel = async () => {
		try {
			setIsExporting(true);

			// Store original pagination values
			const originalPageSize = pageSize;
			const originalPageIndex = pageIndex;

			// Set large page size to fetch all data
			setPageIndex(0);
			setPageSize(EXPORT_PAGE_SIZE);

			// Wait for state update
			await new Promise((resolve) => setTimeout(resolve, 200));

			// Fetch all data
			const { data: allData } = await refetch();

			// Restore original pagination
			setPageSize(originalPageSize);
			setPageIndex(originalPageIndex);

			if (allData?.body?.content?.length) {
				await exportAllToExcel(allData.body.content, 'Customer_Data');
				toast.success(
					`Exported ${allData.body.content.length} customer records successfully!`,
				);
			} else {
				toast.error('No data available for export.');
			}

			setIsExporting(false);
		} catch (error) {
			console.error('Export Error:', error);
			toast.error('Failed to export data.');
			setIsExporting(false);
		}
	};

	return (
		<>
			{(isLoading || isExporting) && <Loading />}
			<PageWrapper name='Customer Management'>
				<SearchCustomer
					isApprove={true}
					isApproveRoute={false}
					openSearch={openSearch}
					setOpenSearch={setOpenSearch}
				/>
				<Subheader>
					<SubheaderLeft>
						<FieldWrap>
							<div className='flex flex-wrap items-center justify-between gap-6 rounded-lg'>
								{/* Title */}
								<div className='flex items-center gap-4'>
									<CardTitle className='text-2xl font-bold'>
										ຂໍ້ມູນລູກຄ້າ
									</CardTitle>
									{/* Badge */}
									<Badge
										variant='outline'
										className='flex items-center justify-center rounded-full border-transparent px-8 py-[2px] text-xl'>
										<LuUsersRound className='mb-[1px] mr-2 h-6 w-6' />
										{data?.body?.totalElements.toString() || 0} ທ່ານ
									</Badge>
								</div>
							</div>
						</FieldWrap>
					</SubheaderLeft>
					<SubheaderRight>
						<div className='flex gap-2'>
							{/* Export Excel Button */}
							<Button
								startContent={<PiMicrosoftExcelLogoFill className='h-5 w-5' />}
								color='primary'
								onPress={exportAllDataToExcel}
								variant='ghost'
								className='text-md font-medium'
								isDisabled={!data?.body?.content?.length}>
								Export Excel
							</Button>

							{/* Search Button */}
							<Button
								startContent={<LuSearch className='h-5 w-5' />}
								color='primary'
								radius='full'
								onPress={handleSearch}
								variant='solid'
								className='text-md w-64 font-medium'>
								ຄົ້ນຫາ
							</Button>
						</div>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card>
						<CardBody>
							<TableTemplate
								table={table}
								className='table-fixed'
								onRowClick={handleNavigate}
							/>
						</CardBody>
						<TableCardFooterTemplate
							table={table}
							onPageChange={(newPage) => setPageIndex(newPage)}
							onPageSizeChange={(newSize) => setPageSize(newSize)}>
							<div className='pagination-info'>
								<span>{`Showing ${data?.body?.numberOfElements || 0} items out of ${data?.body?.totalElements || 0
									} total items`}</span>
							</div>
						</TableCardFooterTemplate>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default CustomerMangement;
