import { FC } from 'react';
import classNames from 'classnames';
import { LuPackageOpen } from 'react-icons/lu';
import { SalaryRow } from '@/pages/salary/services/salaryApi.ts';
import { formatAmount } from '@/pages/salary/utils.ts';

interface IPayrollTableProps {
	rows: SalaryRow[];
	/** Index of the first row on this page, used for the # column. */
	offset?: number;
	/** Adds the Wallet No and Message (error reason) columns. */
	showDetails?: boolean;
}

const ActiveChip: FC<{ active: boolean }> = ({ active }) => (
	<span
		className={
			active
				? 'inline-block rounded-full bg-green-100 px-3 py-0.5 text-[11px] font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300'
				: 'inline-block rounded-full bg-pink-100 px-3 py-0.5 text-[11px] font-medium text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
		}>
		{active ? 'Active' : 'Inactive'}
	</span>
);

const PayrollTable: FC<IPayrollTableProps> = ({ rows, offset = 0, showDetails = false }) => {
	const headers = [
		'#',
		'Telephone number',
		'Full Name',
		...(showDetails ? ['Wallet No'] : []),
		'Active',
		'Salary (Kip)',
		...(showDetails ? ['Error'] : []),
	];

	return (
		<div className='overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700'>
			<table
				className={classNames('w-full border-collapse text-sm', showDetails ? 'min-w-[56rem]' : 'min-w-[40rem]')}>
				<thead>
					<tr className='bg-primary text-white'>
						{headers.map((header, i) => (
							<th
								key={header}
								className={`px-4 py-2.5 text-left text-xs font-semibold ${i === 0 ? 'w-16 text-center' : ''}`}>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.length === 0 ? (
						<tr>
							<td colSpan={headers.length} className='py-8'>
								<div className='flex items-center justify-center gap-2 text-sm font-medium text-zinc-500'>
									<LuPackageOpen size={28} className='text-primary-300' />
									No data
								</div>
							</td>
						</tr>
					) : (
						rows.map((row, i) => {
							const failed = row.status === 'ERROR';

							return (
								<tr
									key={row.id ?? `${row.tel}-${offset + i}`}
									className={classNames(
										'border-t border-zinc-100 align-top dark:border-zinc-800',
										failed && 'bg-red-50/70 dark:bg-red-950/20',
									)}>
									<td className='px-4 py-2.5 text-center'>{offset + i + 1}</td>
									<td className='px-4 py-2.5'>{row.tel ?? '-'}</td>
									<td className='px-4 py-2.5'>{row.wlName ?? '-'}</td>
									{showDetails && <td className='px-4 py-2.5'>{row.wlNo ?? '-'}</td>}
									<td className='px-4 py-2.5'>
										<ActiveChip active={row.status === 'NORMAL'} />
									</td>
									<td className='px-4 py-2.5 tabular-nums'>
										{typeof row.amount === 'number' ? formatAmount(row.amount) : '-'}
									</td>
									{showDetails && (
										<td className='max-w-[18rem] break-words px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400'>
											{failed
												? (row.message ??
													(row.wlNo
														? 'No reason provided'
														: 'Wallet not found for this telephone number'))
												: ''}
										</td>
									)}
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};

export default PayrollTable;
