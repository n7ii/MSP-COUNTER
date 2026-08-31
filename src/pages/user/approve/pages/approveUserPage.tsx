import { useState, useEffect } from 'react';
import Subheader, { SubheaderLeft } from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Icon from '@/components/icon/Icon.tsx';
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
import { useGetRegisterQuery, useGetRoleQuery } from '@/pages/user/redux/queries/userApiSlice.ts';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import { Button, Checkbox, cn } from '@heroui/react';
import { useApproveUserMutation } from '@/pages/user/redux/queries/userApiSlice.ts';
import { AlertService } from '@/common/services/alert.service.ts';
import Input from '@/components/form/Input.tsx';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import toast from 'react-hot-toast';
import { useChangeAdminPasswordMutation } from '@/pages/customer/redux/queries/customerApiSlice.ts';

const alert = new AlertService();

const UserApprovePage = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10); // track page size
	const [isModalOpen, setIsModalOpen] = useState<any>(''); // Modal visibility state
	const [user, setUser] = useState<any | null>(null);
	const { data: roleData } = useGetRoleQuery();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	console.log('user', user);
	const [adminId, setAdminId] = useState<number>(0);
	const [newPassword, setNewPassword] = useState<string>('');
	const [changeAdminPassword, { isLoading: isChangingPassword }] =
		useChangeAdminPasswordMutation();

	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
	// Fetch data using RTK Query with pagination and search
	const { data, isLoading, isError } = useGetRegisterQuery({
		page: pageIndex,
		size: pageSize, // Page size is dynamic
		search: globalFilter, // Search term
	});
	const [approveUser, { isLoading: isApproving }] = useApproveUserMutation();
	// Use useEffect to refetch data when pageIndex, pageSize, or globalFilter changes
	useEffect(() => {
		if (pageIndex === 0) return; // Skip if the page index is 0 to avoid infinite loop
	}, [pageIndex, pageSize, globalFilter]);
	const handleSubmit = async () => {
		try {
			const res = await changeAdminPassword({ adminId, newPassword }).unwrap();
			if (res?.header?.status === '01') {
				toast.success('Change admin password success');
				setIsOpen(false);
			} else {
				toast.error(res?.header?.message || 'Failed to change password');
			}
		} catch (error: any) {
			console.error('Error changing admin password:', error);
			toast.error(error?.message || 'An error occurred');
		}
	};
	// Approve the user
	const handleApprove = async () => {
		if (selectedRoles.length === 0) {
			alert.warning('Please select at least one role.');
			return;
		}
		const { isConfirmed } = await alert.confirmModal('Are you sure you want to Approve?');
		if (!isConfirmed) return;

		// Convert roles array to a comma-separated string
		const roles = selectedRoles.join(',');

		approveUser({ id: user?.id, roles })
			.unwrap()
			.then((response) => {
				console.log('response?.header?.status', response);
				if (response?.header?.status === '01') {
					alert.success('Approve Successfully');
					setIsModalOpen(false); // Close the modal after successful approval
				} else {
					alert.error(
						`Approval failed: ${response?.header?.message || 'An error occurred'}`,
					);
				}
			})
			.catch((error) => {
				alert.error(
					`Failed to approve user: ${error.message || 'An unexpected error occurred'}`,
				);
			});
	};

	const columnHelper = createColumnHelper<any>();
	const columns = [
		columnHelper.accessor('name', {
			cell: (info) => <span>{info.getValue()}</span>,
			header: 'Name',
		}),
		columnHelper.accessor('username', {
			cell: (info) => <span>{info.getValue()}</span>,
			header: 'Username',
		}),
		columnHelper.accessor('email', {
			cell: (info) => <span>{info.getValue()}</span>,
			header: 'Email',
		}),
		columnHelper.accessor('role', {
			header: 'Role',
			cell: (info) => {
				const value = info.getValue();
				return value
					? value.split(',').map((role: any, index: any) => (
							<Badge key={index} variant='outline' className='mr-2' color='blue'>
								{role}
							</Badge>
						))
					: null;
			},
		}),
		columnHelper.accessor('approved', {
			cell: (info) =>
				info.getValue() === 'YES' ? (
					<Badge variant='outline' color='emerald'>
						Approved
					</Badge>
				) : (
					<Badge variant='outline' color='red'>
						Pending
					</Badge>
				),
			header: 'Approval Status',
		}),

		columnHelper.display({
			cell: (info) => (
				<div className='flex gap-2'>
					<Button
						variant='solid'
						color='primary'
						radius='sm'
						onPress={() => {
							setIsModalOpen(true); // Open the Approve modal
							setUser(info.row.original); // Set the selected user
						}}>
						Approve
					</Button>
					<Button
						variant='bordered'
						color='primary'
						radius='sm'
						onPress={() => {
							setIsOpen(true); // Open the Change Admin Password modal
							// Optionally, if the admin ID should come from this row:
							setAdminId(info.row.original.id);
						}}>
						Change Password
					</Button>
				</div>
			),
			header: 'Actions',
		}),
	];

	// React Table Configuration
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
	useEffect(() => {
		if (user?.role) {
			setSelectedRoles(user.role.split(','));
		}
	}, [user]);

	// Handle loading and error states
	if (isLoading) return <Loading />;
	if (isError)
		return (
			<div>
				<Loading />
			</div>
		);

	return (
		<PageWrapper name='User Approval'>
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
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>User Approvals</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{data?.body?.totalElements || 0} items
							</Badge>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[50rem]' table={table} />
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
			<ModalProvider
				isOpen={isOpen}
				onOpenChange={() => setIsOpen(false)}
				title='Change Admin Password'
				size='md'
				scrollBehavior='inside'>
				<div className='flex flex-col gap-4'>
					<Input
						name='password'
						type='password'
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						placeholder='Enter New Password'
						required
					/>
					<div className='flex w-full justify-end gap-4 pb-4'>
						<Button
							onPress={handleSubmit}
							isLoading={isChangingPassword}
							variant='solid'
							color='primary'
							className='w-full'>
							Change Password
						</Button>
						<Button
							onPress={() => setIsOpen(false)}
							variant='solid'
							color='default'
							className='w-full'>
							Cancel
						</Button>
					</div>
				</div>
			</ModalProvider>
			{/* Modal for editing user */}
			<ModalProvider
				isOpen={isModalOpen}
				onOpenChange={() => setIsModalOpen(false)}
				title={`Select Roles for ${user?.email || 'User'}`}
				size='2xl'
				scrollBehavior='inside'>
				<div className='flex flex-col gap-4'>
					<div className='grid grid-cols-1  gap-4 sm:grid-cols-2'>
						{roleData?.body?.map((role: any) => (
							<div key={role} className='w-full pb-4'>
								<Checkbox
									aria-label={role}
									isSelected={selectedRoles.includes(role)}
									onValueChange={(isSelected) => {
										const updatedRoles = isSelected
											? [...selectedRoles, role] // Add role if selected
											: selectedRoles.filter((r) => r !== role); // Remove if unselected
										setSelectedRoles(updatedRoles);
									}}
									classNames={{
										base: cn(
											'inline-flex w-full max-w-md bg-content1 bg-gray-50 dark:bg-[#111113]',
											'hover:bg-content2 items-center justify-start',
											'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
											'data-[selected=true]:border-primary',
										),
										label: 'w-full',
									}}>
									<div className='flex w-full items-center justify-between'>
										<span className='font-medium text-default-800'>{role}</span>
									</div>
								</Checkbox>
							</div>
						))}
					</div>
					<div className='flex w-full justify-end gap-4 pb-4'>
						<Button
							onPress={handleApprove}
							className='w-full'
							isLoading={isApproving}
							color='primary'>
							Approve
						</Button>
						<Button
							color='default'
							className='w-full'
							onPress={() => {
								setIsModalOpen(false);
							}}>
							Cancel
						</Button>
					</div>
				</div>
			</ModalProvider>
		</PageWrapper>
	);
};

export default UserApprovePage;
