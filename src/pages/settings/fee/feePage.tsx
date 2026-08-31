import { useEffect, useState } from 'react';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Icon from '@/components/icon/Icon.tsx';
import Button from '@/components/ui/Button.tsx';
import Container from '@/components/layouts/Container/Container.tsx';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card.tsx';
import Badge from '@/components/ui/Badge.tsx';
import TableTemplate, { TableCardFooterTemplate } from '@/templates/common/TableParts.template.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { useGetCustomerTypeQuery } from '@/pages/settings/redux/queries/customerTypeApiSlice.ts';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import toast from 'react-hot-toast';
import { AlertService } from '@/common/services/alert.service.ts';
import {
	useCreateFeeMutation,
	useDeleteFeeMutation,
	useGetFeeOptionQuery,
	useGetFeesQuery,
	useUpdateFeeMutation,
} from '@/pages/settings/redux/queries/feeApiSlice.ts';
import FeeForm from '@/pages/settings/fee/components/feeForm.tsx';
import Select from '@/components/form/Select.tsx';
import Input from '@/components/form/Input.tsx';

const alert = new AlertService();

const FeePage = () => {
	// Table sorting and filtering state
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');

	// Pagination state
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [searchTerm, setSearchTerm] = useState('');

	// ✅ Set default filter values
	const [filterCustomerType, setFilterCustomerType] = useState('ACTIVE');
	const [filterCurrency, setFilterCurrency] = useState('LAK');
	const [appliedSearchTerm, setAppliedSearchTerm] = useState('');

	// ✅ Set default search params with LAK and ACTIVE
	const [searchParams, setSearchParams] = useState<{
		customerType: string;
		ccy: string;
	}>({
		customerType: 'ACTIVE',
		ccy: 'LAK',
	});

	// ✅ Changed to true to load data on first render
	// const [searchTriggered, setSearchTriggered] = useState(true);
	const [isSearchLoading, setIsSearchLoading] = useState(false);

	// Get fee option data (for the dropdowns)
	const { data: feeOption } = useGetFeeOptionQuery();

	// ✅ Query will run immediately with default values
	const { data, isLoading, refetch } = useGetFeesQuery({
		page: pageIndex,
		size: pageSize,
		search: appliedSearchTerm,
		customerType: searchParams.customerType,
		ccy: searchParams.ccy,
	});

	const { data: customerData } = useGetCustomerTypeQuery({ page: 0, size: 100 });
	const [createFee] = useCreateFeeMutation();
	const [updateFee] = useUpdateFeeMutation();
	const [deleteFee] = useDeleteFeeMutation();

	const [modalOpen, setModalOpen] = useState(false);
	const [currentFee, setCurrentFee] = useState<any | null>(null);

	// Set up initial values for the fee form
	const initial = currentFee || {
		ccy: '',
		ccyFee: '',
		fee: null,
		frmAmt: null,
		toAmt: null,
		toType: '',
		customerTypeId: null,
		status: true,
		feeStatus: false,
		tplStatus: false,
	};

	const columnHelper = createColumnHelper<any>();
	const columns = [
		columnHelper.accessor('id', {
			header: 'ID',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('custTypeId.nameEn', {
			header: 'Customer Type(EN)',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('custTypeId.nameLa', {
			header: 'Customer Type(LA)',
			cell: (info) => info.getValue(),
		}),

		columnHelper.accessor('toType', {
			header: 'To Type',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('frmAmt', {
			header: 'From Amount',
			cell: (info) => info.getValue()?.toLocaleString(),
		}),
		columnHelper.accessor('toAmt', {
			header: 'To Amount',
			cell: (info) => info.getValue()?.toLocaleString(),
		}),
		columnHelper.accessor('ccy', {
			header: 'Currency',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('fee', {
			header: 'Fee',
			cell: (info) => info.getValue()?.toLocaleString(),
		}),
		columnHelper.accessor('ccyFee', {
			header: 'Fee Currency',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('createAt', {
			header: 'Created At',
			cell: (info) => info.getValue(),
		}),
		columnHelper.display({
			header: 'Actions',
			cell: (info) => (
				<div className='flex gap-2'>
					<Button
						onClick={() => openModalForEdit(info.row.original)}
						variant='solid'
						icon='HeroPencilSquare'>
						Edit
					</Button>
					<Button
						onClick={() => handleDeleteFee(info.row.original)}
						variant='solid'
						color='red'
						icon='HeroTrash'>
						Delete
					</Button>
				</div>
			),
		}),
	];

	const openModalForCreate = () => {
		setCurrentFee(null);
		setModalOpen(true);
	};

	const openModalForEdit = (fee: any) => {
		setCurrentFee(fee);
		setModalOpen(true);
	};

	// Update filter values as the user selects options.
	const handleCustomerTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilterCustomerType(e.target.value);
	};

	const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilterCurrency(e.target.value);
	};

	// When the user clicks search, update the frozen parameters and trigger the query.
	const handleSearch = () => {
		setIsSearchLoading(true);
		setPageIndex(0);
		setSearchParams({ customerType: filterCustomerType, ccy: filterCurrency });
		setAppliedSearchTerm(searchTerm);
		// setSearchTriggered(true);
		refetch();
	};

	// When data arrives, stop the loading state.
	useEffect(() => {
		if (data !== undefined) {
			setIsSearchLoading(false);
		}
	}, [data]);

	// ✅ Removed the useEffect that was overwriting defaults
	// The dropdowns will now show ACTIVE and LAK by default

	const handleDeleteFee = async (fee: any) => {
		const result = await alert.confirmModal('Are you sure you want to delete?');
		if (result.isConfirmed) {
			await deleteFee({ id: fee.id })
				.unwrap()
				.then(async (res) => {
					if (res?.header?.status === '01') {
						toast.success('Deleted successfully!');
						refetch();
					} else {
						await alert.error(res?.header?.message || 'An error occurred');
					}
				});
		}
	};

	const handleFormSubmit = async (values: any) => {
		const buildValue: any = {
			ccy: values.ccy || '',
			ccyFee: values.ccyFee || '',
			fee: values.fee ? Number(values.fee) : 0,
			fromAmount: values.frmAmt ? Number(values.frmAmt) : 0,
			toAmount: values.toAmt ? Number(values.toAmt) : 0,
			toType: values.toType || '',
			customerTypeId: values.customerTypeId ? Number(values.customerTypeId) : null,
		};

		if (currentFee) {
			await updateFee({ id: currentFee.id, feeData: values })
				.unwrap()
				.then(async (res) => {
					if (res?.header.status === '01') {
						toast.success('Updated successfully!');
						refetch();
					} else {
						await alert.error(res?.header.message || 'An error occurred');
					}
				});
		} else {
			await createFee(buildValue)
				.unwrap()
				.then(async (res) => {
					if (res?.header.status === '01') {
						toast.success('Fee added successfully!');
						refetch();
					} else {
						await alert.error(res?.header.message || 'An error occurred');
					}
				});
		}
		setModalOpen(false);
		refetch();
	};

	// Set up the react-table instance.
	const table = useReactTable({
		data: data?.body?.content || [],
		columns,
		state: { sorting, globalFilter },
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: data?.body?.totalPages || 1,
		initialState: { pagination: { pageIndex, pageSize } },
	});

	if (isLoading || isSearchLoading) {
		return <Loading />;
	}
	if (data && (!data.body || !data.body.content)) {
		return <div>{data?.header?.message || 'No data found'}</div>;
	}

	return (
		<>
			<PageWrapper name='Fee'>
				<ModalProvider
					isOpen={modalOpen}
					onOpenChange={() => setModalOpen(false)}
					title={currentFee ? 'Edit Fee' : 'New Fee'}
					size='2xl'>
					<FeeForm
						customerData={customerData?.body?.content}
						initialValues={initial}
						onSubmit={handleFormSubmit}
						onCancel={() => setModalOpen(false)}
					/>
				</ModalProvider>
				<Subheader>
					<SubheaderLeft>
						<FieldWrap
							lastSuffix={
								globalFilter && (
									<Icon
										icon='HeroXMark'
										color='red'
										className='mx-2 cursor-pointer'
										onClick={() => setGlobalFilter('')}
									/>
								)
							}>
							<div className='flex items-center gap-4'>
								<p>Search</p>
								<Input
									name='search'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder='Search...'
								/>

								<p>Customer Type</p>
								<Select
									name='filterCustomerType'
									value={filterCustomerType}
									onChange={handleCustomerTypeChange}>
									{feeOption?.body?.customerType?.map((item: any) => (
										<option key={item.id} value={item.nameEn}>
											{item.nameEn}
										</option>
									))}
								</Select>

								<p>Currency</p>
								<Select
									name='filterCurrency'
									value={filterCurrency}
									onChange={handleCurrencyChange}>
									{feeOption?.body?.ccy?.map((cur: string) => (
										<option key={cur} value={cur}>
											{cur}
										</option>
									))}
								</Select>
								<Button variant='solid' onClick={handleSearch}>
									Search
								</Button>
							</div>
						</FieldWrap>
					</SubheaderLeft>
					<SubheaderRight>
						<Button onClick={openModalForCreate} variant='solid' icon='HeroPlus'>
							New Fee
						</Button>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>ຈັດການຄ່າທໍານຽມ</CardTitle>
								<Badge
									variant='outline'
									className='border-transparent px-4'
									rounded='rounded-full'>
									{data?.body?.totalElements || 0} items
								</Badge>
							</CardHeaderChild>
						</CardHeader>
						<CardBody className='overflow-auto'>
							<TableTemplate
								className='table-fixed max-md:min-w-[50rem]'
								table={table}
							/>
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

export default FeePage;
