import { useState, useEffect } from 'react';
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
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import toast from 'react-hot-toast';
import { AlertService } from '@/common/services/alert.service.ts';
import {
	useCreateRoleMutation,
	useGetRoleQuery,
	useUpdateRoleMutation,
} from '@/pages/settings/redux/queries/roleApiSlice.ts';
import RoleForm from '@/pages/settings/roles/components/roleForm.tsx';

const alert = new AlertService();

const RolePage = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');

	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const { data, isLoading } = useGetRoleQuery({
		page: pageIndex,
		size: pageSize,
	});
	const [createRole] = useCreateRoleMutation();
	const [updateRole] = useUpdateRoleMutation();

	const [modalOpen, setModalOpen] = useState(false);
	const [roleName, setRoleName] = useState<any | null>(null);

	console.log('roleName', roleName);
	const initial = roleName || {
		roleName: '',
	};

	useEffect(() => {
		if (pageIndex === 0) return;
	}, [pageIndex, pageSize, globalFilter]);

	const columnHelper = createColumnHelper<any>();
	const columns = [
		// ID Column
		columnHelper.accessor('id', {
			header: 'ID',
			cell: (info) => info.getValue(),
		}),

		// Customer Type Column
		columnHelper.accessor('roleName', {
			header: 'Role Name',
			cell: (info) => info.getValue(),
		}),

		// Actions Column
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
		setRoleName(null);
		setModalOpen(true);
	};

	const openModalForEdit = (customerType: any) => {
		setRoleName(customerType);
		setModalOpen(true);
	};

	const handleFormSubmit = async (values: any) => {
		console.log('values', values);
		const buildValue: any = {
			roleName: values.roleName || '',
		};

		if (roleName) {
			await updateRole({ id: roleName.id, roleData: buildValue }) // Pass roleData explicitly
				.unwrap()
				.then((res) => {
					if (res?.header.status === '01') {
						toast.success('Updated successfully!');
					} else {
						alert.error(res?.header.message || 'An error occurred');
					}
				})
				.catch((err) => console.error('Update Error:', err));
		} else {
			await createRole(buildValue)
				.unwrap()
				.then((res) => {
					if (res?.header.status === '01') {
						toast.success('Customer type added successfully!');
					} else {
						alert.error(res?.header.message || 'An error occurred');
					}
				})
				.catch((err) => console.error('Create Error:', err));
		}
		setModalOpen(false);
	};

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

	return (
		<>
			{isLoading && <Loading />}
			<PageWrapper name='Fee'>
				<ModalProvider
					isOpen={modalOpen}
					onOpenChange={() => setModalOpen(false)}
					title={roleName ? 'Edit Role' : 'New Role'}
					size='2xl'>
					<RoleForm
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
							New Role
						</Button>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>ຈັດການສິດທິ</CardTitle>
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
								setPageIndex(newPage);
							}}
							onPageSizeChange={(newSize) => {
								setPageSize(newSize);
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

export default RolePage;
