import { useState } from 'react';
import Subheader, { SubheaderLeft } from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Icon from '@/components/icon/Icon.tsx';
import Input from '@/components/form/Input.tsx';
import Container from '@/components/layouts/Container/Container.tsx';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card.tsx';
import TableTemplate, { TableCardFooterTemplate } from '@/templates/common/TableParts.template.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import {
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';

type LogListPageProps = {
	name: string;
	title: string;
	data: any;
	isLoading: boolean;
	onSearchChange: (value: string) => void;
	search: string;
	pageIndex: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
};

const columnHelper = createColumnHelper<any>();

const columns = [
	columnHelper.accessor('id', {
		header: 'ID',
		cell: (info) => info.getValue() ?? '-',
	}),
	columnHelper.accessor((row) => row.createdAt || row.createDate || row.date, {
		id: 'createdAt',
		header: 'Date',
		cell: (info) => info.getValue() ?? '-',
	}),
	columnHelper.accessor((row) => row.username || row.user || row.customerUsername, {
		id: 'username',
		header: 'User',
		cell: (info) => info.getValue() ?? '-',
	}),
	columnHelper.accessor((row) => row.action || row.type || row.event, {
		id: 'action',
		header: 'Action',
		cell: (info) => info.getValue() ?? '-',
	}),
	columnHelper.accessor((row) => row.message || row.description || row.detail, {
		id: 'message',
		header: 'Message',
		cell: (info) => info.getValue() ?? '-',
	}),
	columnHelper.accessor('status', {
		header: 'Status',
		cell: (info) => {
			const value = info.getValue();
			if (typeof value === 'boolean') return value ? 'Active' : 'Inactive';
			return value ?? '-';
		},
	}),
];

const LogListPage = ({
	name,
	title,
	data,
	isLoading,
	onSearchChange,
	search,
	pageIndex,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: LogListPageProps) => {
	const table = useReactTable({
		data: data?.body?.content || data?.body || [],
		columns,
		state: { globalFilter: search },
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: data?.body?.totalPages || 1,
		initialState: {
			pagination: { pageIndex, pageSize },
		},
	});

	return (
		<PageWrapper name={name}>
			<Subheader>
				<SubheaderLeft>
					<FieldWrap
						firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
						lastSuffix={
							search && (
								<Icon
									icon='HeroXMark'
									color='red'
									className='mx-2 cursor-pointer'
									onClick={() => onSearchChange('')}
								/>
							)
						}>
						<Input
							id='search'
							name='search'
							placeholder='Search...'
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
			</Subheader>

			<Container>
				<Card>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>{title}</CardTitle>
						</CardHeaderChild>
					</CardHeader>
					<CardBody>
						{isLoading ? <p>Loading...</p> : <TableTemplate table={table} />}
					</CardBody>
					<TableCardFooterTemplate
						table={table}
						onPageChange={onPageChange}
						onPageSizeChange={onPageSizeChange}>
						<div className='pagination-info'>
							<span>{`Showing ${data?.body?.numberOfElements || data?.body?.content?.length || 0} items out of ${data?.body?.totalElements || data?.body?.length || 0} total items`}</span>
						</div>
					</TableCardFooterTemplate>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export const useLogListState = () => {
	const [search, setSearch] = useState('');
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	return {
		search,
		pageIndex,
		pageSize,
		onSearchChange: (value: string) => {
			setSearch(value);
			setPageIndex(0);
		},
		onPageChange: setPageIndex,
		onPageSizeChange: (size: number) => {
			setPageSize(size);
			setPageIndex(0);
		},
	};
};

export default LogListPage;
