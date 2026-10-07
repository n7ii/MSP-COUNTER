import { FC } from 'react';
import classNames from 'classnames';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface ITablePaginationProps {
	/** Zero-based current page. */
	page: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number) => void;
	/** When provided, a "rows per page" selector is shown. */
	onPageSizeChange?: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

type PageItem = number | 'gap-start' | 'gap-end';

const buildPages = (current: number, count: number): PageItem[] => {
	if (count <= 7) return Array.from({ length: count }, (_, i) => i);

	const items: PageItem[] = [0];
	const start = Math.max(1, Math.min(current - 1, count - 4));
	const end = Math.min(count - 2, start + 2);

	if (start > 1) items.push('gap-start');
	for (let i = start; i <= end; i++) items.push(i);
	if (end < count - 2) items.push('gap-end');
	items.push(count - 1);

	return items;
};

const TablePagination: FC<ITablePaginationProps> = ({
	page,
	pageSize,
	total,
	onPageChange,
	onPageSizeChange,
}) => {
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : page * pageSize + 1;
	const to = Math.min(total, (page + 1) * pageSize);

	const arrow =
		'flex h-7 w-7 items-center justify-center rounded text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800';

	return (
		<div className='flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500'>
			<div className='flex flex-wrap items-center gap-4'>
				{onPageSizeChange && (
					<label className='flex items-center gap-2'>
						<span>Rows</span>
						<select
							value={pageSize}
							onChange={(e) => onPageSizeChange(Number(e.target.value))}
							className='h-7 rounded border border-zinc-300 bg-white px-2 text-xs text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200'>
							{PAGE_SIZE_OPTIONS.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</label>
				)}
				<span>{`Showing ${from} - ${to} out of ${total}`}</span>
			</div>

			<nav aria-label='Pagination' className='flex items-center gap-1'>
				<button
					type='button'
					className={arrow}
					aria-label='Previous page'
					disabled={page === 0}
					onClick={() => onPageChange(page - 1)}>
					<LuChevronLeft size={16} />
				</button>

				{buildPages(page, pageCount).map((item) =>
					typeof item === 'number' ? (
						<button
							key={item}
							type='button'
							aria-current={item === page ? 'page' : undefined}
							className={classNames(
								'h-7 min-w-7 rounded px-2 text-xs',
								item === page
									? 'bg-primary font-semibold text-white'
									: 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
							)}
							onClick={() => onPageChange(item)}>
							{item + 1}
						</button>
					) : (
						<span key={item} className='px-1'>
							...
						</span>
					),
				)}

				<button
					type='button'
					className={arrow}
					aria-label='Next page'
					disabled={page >= pageCount - 1}
					onClick={() => onPageChange(page + 1)}>
					<LuChevronRight size={16} />
				</button>
			</nav>
		</div>
	);
};

export default TablePagination;
