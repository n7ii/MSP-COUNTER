import { useEffect, useState } from 'react';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Icon from '@/components/icon/Icon.tsx';
import Input from '@/components/form/Input.tsx';
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

import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import TxnLimitForm from '@/pages/settings/txnLimit/components/txnLimitForm.tsx';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';

import toast from 'react-hot-toast';
import { AlertService } from '@/common/services/alert.service.ts';
import {
	useCreateTxnLimitMutation,
	useGetTxnLimitQuery,
	useUpdateTxnLimitMutation,
} from '@/pages/settings/redux/queries/txnLimitApiSlice.ts';
import { useGetCustomerTypeQuery } from '@/pages/settings/redux/queries/customerTypeApiSlice.ts';

const alert = new AlertService();

const TxnLimitPage = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const { data, isLoading } = useGetTxnLimitQuery({
		page: pageIndex,
		size: pageSize,
		search: globalFilter,
	});

	const [createTxnLimit] = useCreateTxnLimitMutation();
	const [updateTxnLimit] = useUpdateTxnLimitMutation();
	const { data: customerData } = useGetCustomerTypeQuery({ page: 0, size: 100 }); // Lazy query to fetch customer data

	const [modalOpen, setModalOpen] = useState(false);
	const [currentTxnLimit, setCurrentTxnLimit] = useState<any | null>(null);
	const [isEdit, setIsEditable] = useState(false);

	const initial = currentTxnLimit || {
		ccy: '',
		lmtPerday: null,
		lmtPermth: null,
		lmtPertxn: null,
		status: true,
		code: null,
		customerTypeId: null,
		crdr: null,
		toType: null,
	};
	const formatNumber = (value: number | null | undefined) => {
		return value != null
			? value.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
			: '0.00';
	};

	useEffect(() => {
		if (pageIndex === 0) return;
	}, [pageIndex, pageSize, globalFilter]);

	const columnHelper = createColumnHelper<any>();

	const columns = [
		columnHelper.accessor('id', {
			header: 'ID',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('code', {
			header: 'Code',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('lmtName', {
			header: 'Limit Name',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('toType', {
			header: 'To Type',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('lmtPermth', {
			header: 'Limit per Month',
			cell: (info) => formatNumber(info.getValue()),
		}),
		columnHelper.accessor('lmtPerday', {
			header: 'Limit per Day',
			cell: (info) => formatNumber(info.getValue()),
		}),
		columnHelper.accessor('lmtPertxn', {
			header: 'Limit per Transaction',
			cell: (info) => formatNumber(info.getValue()),
		}),
		columnHelper.accessor('avlLmt', {
			header: 'Available Limit',
			cell: (info) => formatNumber(info.getValue()),
		}),
		columnHelper.accessor('ccy', {
			header: 'Currency',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('status', {
			header: 'Status',
			cell: (info) => (info.getValue() ? 'Active' : 'Inactive'), // Format boolean
		}),
		columnHelper.accessor('custType.nameEn', {
			header: 'Customer Type',
			cell: (info) => info.getValue() || 'N/A', // Access nested object
		}),
		columnHelper.accessor('custType.nameLa', {
			header: 'Customer Type(LA)',
			cell: (info) => info.getValue() || 'N/A', // Access nested object
		}),
		columnHelper.accessor('crdr', {
			header: 'Credit or Debit',
			cell: (info) => {
				const value = info.getValue();
				return value === 'C' ? 'Credit' : value === 'D' ? 'Debit' : 'N/A';
			},
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
				</div>
			),
		}),
	];

	const openModalForCreate = () => {
		setIsEditable(false);
		setCurrentTxnLimit(null);
		setModalOpen(true);
	};

	const openModalForEdit = (txnLimit: any) => {
		setCurrentTxnLimit(txnLimit);
		setIsEditable(true);
		setModalOpen(true);
	};

	const handleFormSubmit = async (values: any) => {
		console.log('values', values);
		const builderValue: any = {
			ccy: values.ccy,
			limitPerDay: isEdit
				? Number(values.lmtPerday)
				: Number(values.lmtPerday.replace(/,/g, '')),
			limitPerMonth: isEdit
				? Number(values.lmtPermth)
				: Number(values.lmtPermth.replace(/,/g, '')),
			limitPerTxn: isEdit
				? Number(values.lmtPertxn)
				: Number(values.lmtPertxn.replace(/,/g, '')),
			status: values.status,
			code: values.code,
			customerTypeId: Number(values.customerTypeId || values.custType?.id),
			creditorDebit: values.crdr,
			accountOrQr: values.toType,
		};
		console.log('builderValue', builderValue);

		if (currentTxnLimit) {
			await updateTxnLimit({ id: currentTxnLimit.id, ...builderValue })
				.unwrap()
				.then((res) => {
					if (res?.header.code === '0000') {
						toast.success('Update Successful');
					} else {
						alert.error(res?.header.message || 'Error occurred');
					}
				});
		} else {
			await createTxnLimit(builderValue)
				.unwrap()
				.then((res) => {
					if (res?.header.code === '0000') {
						toast.success('Create Successful');
					} else {
						alert.error(res?.header.message || 'Error occurred');
					}
				});
		}
		setModalOpen(false);
	};

	const table = useReactTable({
		data: data?.body?.content || [],
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: data?.body?.totalPages || 1,
		initialState: {
			pagination: {
				pageIndex,
				pageSize,
			},
		},
	});

	return (
		<>
			{isLoading && <Loading />}

			<PageWrapper name='ຈໍາກັດວົງເງິນ'>
				<ModalProvider
					isOpen={modalOpen}
					onOpenChange={() => setModalOpen(false)}
					title={currentTxnLimit ? 'ເເກ້ໄຂ້ ຈໍາກັດວົງເງິນ' : 'ເພີ່ມ ຈໍາກັດວົງເງິນ'}
					size='2xl'>
					<TxnLimitForm
						customerType={customerData?.body?.content}
						initialValues={initial}
						onSubmit={handleFormSubmit}
						onCancel={() => setModalOpen(false)}
						isEditMode={isEdit}
					/>
				</ModalProvider>

				<Subheader>
					<SubheaderLeft>
						<FieldWrap
							firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
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
							<Input
								id='search'
								name='search'
								placeholder='Search...'
								value={globalFilter}
								onChange={(e) => setGlobalFilter(e.target.value)}
							/>
						</FieldWrap>
					</SubheaderLeft>
					<SubheaderRight>
						<Button onClick={openModalForCreate} variant='solid' icon='HeroPlus'>
							New Transaction Limit
						</Button>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>ຈໍາກັດວົງເງິນ</CardTitle>
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
								<span>{`Showing ${data?.body?.numberOfElements || 0} out of ${data?.body?.totalElements || 0}`}</span>
							</div>
						</TableCardFooterTemplate>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default TxnLimitPage;
