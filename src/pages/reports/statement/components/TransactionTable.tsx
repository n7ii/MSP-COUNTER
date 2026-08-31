// File: pages/reports/statement/components/TransactionTable.tsx

import { CardBody } from '@/components/ui/Card.tsx';
import TableTemplate, { TableCardFooterTemplate } from '@/templates/common/TableParts.template.tsx';
import { Table } from '@tanstack/react-table';

interface TransactionTableProps {
	table: Table<any>;
	fetchedData: any;
	onPageChange: (newPage: number) => void;
	onPageSizeChange: (newSize: number) => void;
}

const TransactionTable = ({
	table,
	fetchedData,
	onPageChange,
	onPageSizeChange,
}: TransactionTableProps) => {
	return (
		<>
			<CardBody className='w-full overflow-auto overflow-x-auto'>
				<TableTemplate className='table-fixed max-md:min-w-[50rem]' table={table} />
			</CardBody>
			<TableCardFooterTemplate
				table={table}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}>
				<div className='pagination-info'>
					<span>{`Showing ${fetchedData?.numberOfElements || 0} items out of ${fetchedData?.totalElements || 0} total items`}</span>
				</div>
			</TableCardFooterTemplate>
		</>
	);
};

export default TransactionTable;
