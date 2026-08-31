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
import {
	useCreateTxnTypeMutation,
	useGetTxnTypeQuery,
	useUpdateTxnTypeMutation,
} from '@/pages/settings/redux/queries/txnTypeApiSlice.ts';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import TxnTypeForm from '@/pages/settings/txnType/components/txnTypeForm.tsx';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';

import toast from 'react-hot-toast';
import { AlertService } from '@/common/services/alert.service.ts';
const alert = new AlertService();
const TxnTypePage = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const { data, isLoading } = useGetTxnTypeQuery({
		page: pageIndex,
		size: pageSize, // Page size is dynamic
		search: globalFilter, // Search term
	});

	const [createTxnType] = useCreateTxnTypeMutation();
	const [updateTxnType] = useUpdateTxnTypeMutation();
	const [modalOpen, setModalOpen] = useState(false);
	const [currentTxnType, setCurrentTxnType] = useState<any | null>(null);

	const initial = currentTxnType || { code: '', nameEn: '', nameLa: '', status: true };

	useEffect(() => {
		if (pageIndex === 0) return; // Skip if the page index is 0 to avoid infinite loop
	}, [pageIndex, pageSize, globalFilter]);

	console.log('data', data);

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
		columnHelper.accessor('nameEn', {
			header: 'Name (EN)',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('nameLa', {
			header: 'Name (LA)',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('status', {
			header: 'Status',
			cell: (info) =>
				info.getValue() ? (
					<Badge variant='outline' color='emerald' className='border-transparent'>
						Active
					</Badge>
				) : (
					<Badge variant='outline' color='red' className='border-transparent'>
						Inactive
					</Badge>
				),
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
		setCurrentTxnType(null);
		setModalOpen(true);
	};

	const openModalForEdit = (txnType: any) => {
		setCurrentTxnType(txnType);
		setModalOpen(true);
	};

	const handleFormSubmit = async (values: any) => {
		if (currentTxnType) {
			await updateTxnType({ id: currentTxnType.id, ...values })
				.unwrap()
				.then(async (res) => {
					console.log('res', res);
					if (res?.header.status === '01') {
						toast.success('ອັບເດດສໍາເລັດ');
					} else {
						await alert.error(res?.header.message || 'An error occurred');
					}
				});
		} else {
			await createTxnType(values)
				.unwrap()
				.then(async (res) => {
					console.log('res', res);
					if (res?.header.status === '01') {
						toast.success('ເພີ່ມຂໍ້ມູນສໍເລັດ');
					} else {
						await alert.error(res?.header.message || 'An error occurred');
					}
				});
		}
		setModalOpen(false);
	};

	const table = useReactTable({
		data: data?.body?.content || [], // Table data
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

			<PageWrapper name='Transaction Types'>
				<ModalProvider
					isOpen={modalOpen}
					onOpenChange={() => setModalOpen(false)}
					title={currentTxnType ? 'ເເກ້ໄຂ ປະເພດທຸລະກໍາ' : 'ເພິ່ມ ປະເພດທຸລະກໍາ'}
					size='2xl'>
					<TxnTypeForm
						initialValues={initial}
						onSubmit={handleFormSubmit}
						onCancel={() => setModalOpen(false)}
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
							ເພິ່ມ ປະເພດທຸລະກໍາ
						</Button>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>ປະເພດທຸລະກໍາ</CardTitle>
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
							onPageChange={(newPage) => {
								setPageIndex(newPage); // Update parent state
							}}
							onPageSizeChange={(newSize) => {
								setPageSize(newSize); // Update page size
							}}>
							<div className='pagination-info'>
								<span>{`Showing ${data?.body?.numberOfElements || 0} items out of ${data?.body?.totalElements || 0} total items`}</span>
							</div>
						</TableCardFooterTemplate>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default TxnTypePage;
