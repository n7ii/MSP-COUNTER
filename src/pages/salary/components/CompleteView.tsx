import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { LuCheck, LuFileSpreadsheet } from 'react-icons/lu';
import { BTN_BACK, CURRENCY, formatAmount } from '@/pages/salary/utils.ts';

export interface PayrollReceipt {
	transactionId: string;
	transactionDate: string;
	fileName: string;
	total: number;
	createdBy: string;
	records: number;
	description: string;
}

interface ICompleteViewProps {
	receipt: PayrollReceipt;
	downloading: boolean;
	onDownload: () => void;
	onBack: () => void;
}

const Row: FC<{ label: string; children: ReactNode; bold?: boolean }> = ({
	label,
	children,
	bold,
}) => (
	<div className='flex items-start justify-between gap-4 border-b border-zinc-200 py-2.5 text-xs last:border-b-0 dark:border-zinc-700'>
		<dt className='shrink-0 font-semibold'>{label}</dt>
		<dd
			className={classNames(
				'min-w-0 break-all text-right',
				bold ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400',
			)}>
			{children}
		</dd>
	</div>
);

const CompleteView: FC<ICompleteViewProps> = ({ receipt, downloading, onDownload, onBack }) => (
	<div className='rounded-2xl bg-white px-6 py-10 shadow-sm dark:bg-zinc-900'>
		<div className='flex flex-col items-center gap-4'>
			<div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800'>
				<span className='flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white'>
					<LuCheck size={20} strokeWidth={3} />
				</span>
			</div>
			<h2 className='text-sm font-semibold'>Transfer Successfully</h2>
		</div>

		<div className='mx-auto mt-10 max-w-md'>
			<div className='mb-2 text-xs font-bold'>Payroll salary</div>
			<dl>
				<Row label='Transaction ID:'>{receipt.transactionId}</Row>
				<Row label='Transaction Date:'>{receipt.transactionDate}</Row>
				<Row label='File Name:'>{receipt.fileName}</Row>
				<Row label='Total Transfer:' bold>
					{formatAmount(receipt.total)} {CURRENCY}
				</Row>
				<Row label='Create By:'>{receipt.createdBy}</Row>
				<Row label='Record:'>{receipt.records} User</Row>
				<Row label='Description:'>{receipt.description}</Row>
			</dl>
		</div>

		<div className='mt-8 flex flex-wrap justify-center gap-4'>
			<Button
				className={classNames(BTN_BACK, 'min-w-44')}
				isLoading={downloading}
				startContent={!downloading && <LuFileSpreadsheet size={16} />}
				onPress={onDownload}>
				Download Detail
			</Button>
			<Button className={classNames(BTN_BACK, 'min-w-44')} onPress={onBack}>
				Back
			</Button>
		</div>
	</div>
);

export default CompleteView;
