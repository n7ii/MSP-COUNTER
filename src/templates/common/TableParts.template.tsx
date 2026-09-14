import  { FC } from 'react';
import classNames from 'classnames';
import { flexRender, Table as TTableProps } from '@tanstack/react-table';
import Table, { ITableProps, TBody, Td, TFoot, Th, THead, Tr } from '../../components/ui/Table';
import Icon from '../../components/icon/Icon';
import { CardFooter, CardFooterChild } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import Empty from "@/components/ui/Empty.tsx";

interface ITableHeaderTemplateProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: TTableProps<any>;
}
export const TableHeaderTemplate: FC<ITableHeaderTemplateProps> = ({ table }) => {
	console.log("table.getState().pagination",table.getState().pagination)
	return (
		<THead>
			{table.getHeaderGroups().map((headerGroup) => (
				<Tr key={headerGroup.id}>
					{headerGroup.headers.map((header) => (
						<Th
							key={header.id}
							isColumnBorder={false}
							className={classNames({
								'text-left': header.id !== 'Actions',
								'text-right': header.id === 'Actions',
							})}>
							{header.isPlaceholder ? null : (
								<div
									key={header.id}
									aria-hidden='true'
									{...{
										className: header.column.getCanSort()
											? 'cursor-pointer select-none flex items-center'
											: '',
										onClick: header.column.getToggleSortingHandler(),
									}}>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
									{{
										asc: (
											<Icon
												icon='HeroChevronUp'
												className='ltr:ml-1.5 rtl:mr-1.5'
											/>
										),
										desc: (
											<Icon
												icon='HeroChevronDown'
												className='ltr:ml-1.5 rtl:mr-1.5'
											/>
										),
									}[header.column.getIsSorted() as string] ?? null}
								</div>
							)}
						</Th>
					))}
				</Tr>
			))}
		</THead>
	);
};

interface ITableBodyTemplateProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: TTableProps<any>;
	onRowClick?: (row: any) => void;
}
export const TableBodyTemplate: FC<ITableBodyTemplateProps> = ({ table, onRowClick }) => {
	return (
		<TBody>
			{table.getRowModel().rows.map((row) => (
				<Tr
					key={row.id}
					onClick={onRowClick ? () => onRowClick(row.original) : undefined}
					className={onRowClick ? 'cursor-pointer' : undefined}>
					{row.getVisibleCells().map((cell) => (
						<Td
							key={cell.id}
							className={classNames({
								'text-left': cell.column.id !== 'Actions',
								'text-right': cell.column.id === 'Actions',
							})}>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</Td>
					))}
				</Tr>
			))}
		</TBody>
	);
};

interface ITableFooterTemplateProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: TTableProps<any>;
}
export const TableFooterTemplate: FC<ITableFooterTemplateProps> = ({ table }) => {
	return (
		<TFoot>
			{table.getFooterGroups().map((footerGroup) => (
				<Tr key={footerGroup.id}>
					{footerGroup.headers.map((header) => (
						<Th
							key={header.id}
							isColumnBorder={false}
							className={classNames({
								'text-left': header.id !== 'Actions',
								'text-right': header.id === 'Actions',
							})}>
							{header.isPlaceholder ? null : (
								<div
									key={header.id}
									aria-hidden='true'
									{...{
										className: header.column.getCanSort()
											? 'cursor-pointer select-none flex items-center'
											: '',
										onClick: header.column.getToggleSortingHandler(),
									}}>
									{flexRender(
										header.column.columnDef.footer,
										header.getContext(),
									)}
									{{
										asc: (
											<Icon
												icon='HeroChevronUp'
												className='ltr:ml-1.5 rtl:mr-1.5'
											/>
										),
										desc: (
											<Icon
												icon='HeroChevronDown'
												className='ltr:ml-1.5 rtl:mr-1.5'
											/>
										),
									}[header.column.getIsSorted() as string] ?? null}
								</div>
							)}
						</Th>
					))}
				</Tr>
			))}
		</TFoot>
	);
};

interface ITableTemplateProps extends Partial<ITableProps> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: TTableProps<any>;
	hasHeader?: boolean;
	hasFooter?: boolean;
	onRowClick?: (row: any) => void;
}
const TableTemplate: FC<ITableTemplateProps> = (props) => {
	const { children, hasHeader, hasFooter, table, onRowClick, ...rest } = props;
	const hasRows = table.getRowModel().rows.length > 0;
	const columnCount = table.getAllColumns().length;  // Get the number of columns in the table
	return (
		<div className="overflow-x-auto w-full">
			<Table {...rest} className="w-full h-full">
				{children || (
					<>
						{hasHeader && <TableHeaderTemplate table={table}/>}
						{hasRows ? (
							<TableBodyTemplate table={table} onRowClick={onRowClick}/>
						) : (
							// Render a single full-width row for the "No data found" message
							<TBody>
								<Tr>
									<Td colSpan={columnCount} className="text-center">
										<div className="flex items-center justify-center w-full h-[320px]">
											<Empty text="No data found"/>
										</div>
									</Td>
								</Tr>
							</TBody>
						)}
						{hasFooter && <TableFooterTemplate table={table}/>}
					</>
				)}
			</Table>
		</div>
			);
			};


			TableTemplate.defaultProps = {
			hasHeader: true,
			hasFooter: true,
		};

			interface ITableCardFooterTemplateProps {
			// Table prop of type TTableProps from tanstack react-table.
			table: TTableProps<any>;

			// onPageChange is a callback function that is called when the page index changes.
			onPageChange?: (newPage: number) => void;

			// onPageSizeChange is a callback function that is called when the page size changes.
			onPageSizeChange?: (newSize: number, newPageIndex: number) => void;
			children?: React.ReactNode;
		}


			export const TableCardFooterTemplate: FC<ITableCardFooterTemplateProps> =
			({table, onPageChange, onPageSizeChange}) => {


				// Handle page index change
				const handlePageChange = (newPage: number) => {
				table.setPageIndex(newPage); // Update the page index in the table
				if (onPageChange) {
				onPageChange(newPage);  // Trigger parent callback when page changes
			}

			};

				// Handle page size change and notify the parent to trigger API call
				const handlePageSizeChange = (newSize: number) => {
				table.setPageSize(newSize); // Update the page size in the table

				// Optionally reset to the first page when the size changes
				table.setPageIndex(0); // Go to the first page

				// Notify parent to fetch data with the updated page size
				if (onPageSizeChange) {
				onPageSizeChange(newSize, 0); // Pass the new page size and reset page index to 0

			}
				if (onPageChange) {
				onPageChange(0);
			}


			};

				return (
				<CardFooter>
				<CardFooterChild>
			{/* Select for Page Size */}
			<Select
				value={table.getState().pagination.pageSize}
				onChange={(e) => handlePageSizeChange(Number(e.target.value))}
				className='!w-fit'
				name='pageSize'>
				{[5, 10, 20, 30, 40, 50].map((pageSize) => (
					<option key={pageSize} value={pageSize}>
						Show {pageSize}
					</option>
				))}
			</Select>
		</CardFooterChild>
			<CardFooterChild>
				{/* First Page Button */}
				<Button
					onClick={() => handlePageChange(0)}  // Go to the first page
					isDisable={!table.getCanPreviousPage()}
					icon='HeroChevronDoubleLeft'
					className='!px-0'
				/>
				{/* Previous Page Button */}
				<Button
					onClick={() => handlePageChange(table.getState().pagination.pageIndex - 1)}  // Go to the previous page
					isDisable={!table.getCanPreviousPage()}
					icon='HeroChevronLeft'
					className='!px-0'
				/>
				{/* Page Input with current page and total pages */}
				<span className='flex items-center gap-1'>
                    <div>Page</div>
                    <strong>
                        <Input
							value={table.getState().pagination.pageIndex + 1}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								handlePageChange(page);  // Update the page index on input change
							}}
							className='inline-flex !w-12 text-center'
							name='page'
						/>

                    </strong>
								of {table.getPageCount()}
                </span>
				{/* Next Page Button */}
				<Button
					onClick={() => handlePageChange(table.getState().pagination.pageIndex + 1)}  // Go to the next page
					isDisable={!table.getCanNextPage()}
					icon='HeroChevronRight'
					className='!px-0'
				/>
				{/* Last Page Button */}
				<Button
					onClick={() => handlePageChange(table.getPageCount() - 1)}  // Go to the last page
					isDisable={!table.getCanNextPage()}
					icon='HeroChevronDoubleRight'
					className='!px-0'
				/>
			</CardFooterChild>
		</CardFooter>
	);
};



export default TableTemplate;
