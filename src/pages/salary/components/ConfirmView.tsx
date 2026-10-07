import { FC, ReactNode, useMemo, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Progress,
} from '@heroui/react';
import PayrollTable from '@/pages/salary/components/PayrollTable.tsx';
import StepBanner from '@/pages/salary/components/StepBanner.tsx';
import TablePagination from '@/pages/salary/components/TablePagination.tsx';
import { SalaryRow } from '@/pages/salary/services/salaryApi.ts';
import {
	BTN_BACK,
	BTN_PRIMARY,
	CURRENCY,
	formatAmount,
	OperationProgress,
	PAGE_SIZE,
} from '@/pages/salary/utils.ts';

interface IConfirmViewProps {
	fileName: string;
	description: string;
	/** Only the payable (NORMAL) rows. */
	rows: SalaryRow[];
	total: number;
	confirming: boolean;
	progress: OperationProgress;
	error: string | null;
	onBack: () => void;
	onConfirm: () => void;
}

const InfoRow: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
	<div className='flex gap-3 text-xs'>
		<dt className='w-28 shrink-0 font-semibold'>{label}</dt>
		<dd className='min-w-0 break-words text-zinc-600 dark:text-zinc-300'>{children}</dd>
	</div>
);

const ConfirmView: FC<IConfirmViewProps> = ({
	fileName,
	description,
	rows,
	total,
	confirming,
	progress,
	error,
	onBack,
	onConfirm,
}) => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	const [dialogOpen, setDialogOpen] = useState(false);
	const today = useMemo(() => dayjs().format('DD/MM/YYYY'), []);

	const pageRows = rows.slice(page * pageSize, (page + 1) * pageSize);

	return (
		<div className='space-y-4'>
			<section className='rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900'>
				<h2 className='mb-4 text-base font-semibold'>Check Information</h2>
				<div className='grid gap-6 md:grid-cols-2'>
					<dl className='space-y-3'>
						<InfoRow label='Transaction Date:'>{today}</InfoRow>
						<InfoRow label='File Name:'>{fileName}</InfoRow>
						<InfoRow label='Total Transfer:'>
							<span className='font-semibold text-zinc-900 dark:text-white'>
								{formatAmount(total)} {CURRENCY}
							</span>
						</InfoRow>
					</dl>
					<div>
						<div className='mb-2 text-xs font-semibold'>Description</div>
						<div className='rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-3 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'>
							{description}
						</div>
					</div>
				</div>
			</section>

			<section className='rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900'>
				<h2 className='mb-4 text-base font-semibold'>List Payroll ({rows.length} record)</h2>

				<PayrollTable rows={pageRows} offset={page * pageSize} />
				<div className='mt-3'>
					<TablePagination
						page={page}
						pageSize={pageSize}
						total={rows.length}
						onPageChange={setPage}
						onPageSizeChange={(size) => {
							setPageSize(size);
							setPage(0);
						}}
					/>
				</div>

				{error && (
					<StepBanner variant='error' className='mt-4'>
						{error}
					</StepBanner>
				)}

				{confirming && (
					<div className='mt-4'>
						<Progress
							aria-label='Transfer progress'
							label='Transferring...'
							value={progress.percent}
							showValueLabel
							valueLabel={
								progress.total > 0
									? `${progress.processed}/${progress.total} (${Math.round(progress.percent)}%)`
									: `${Math.round(progress.percent)}%`
							}
							color='success'
							size='md'
						/>
					</div>
				)}

				<div className='mt-6 flex flex-wrap justify-between gap-4'>
					<Button
						className={classNames(BTN_BACK, 'min-w-44')}
						isDisabled={confirming}
						onPress={onBack}>
						Back
					</Button>
					<Button
						className={classNames(BTN_PRIMARY, 'min-w-44')}
						isLoading={confirming}
						isDisabled={confirming || rows.length === 0}
						onPress={() => setDialogOpen(true)}>
						Confirm
					</Button>
				</div>
			</section>

			<Modal isOpen={dialogOpen} onOpenChange={setDialogOpen} placement='center' size='md'>
				<ModalContent>
					{(close) => (
						<>
							<ModalHeader className='text-lg font-semibold'>
								Confirm transfer
							</ModalHeader>
							<ModalBody className='space-y-3'>
								<StepBanner variant='warning'>
									This action cannot be undone. The salary will be added to each
									customer wallet and deducted from the SALARY account.
								</StepBanner>
								<div className='grid grid-cols-2 gap-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50'>
									<div>
										<div className='text-xs text-zinc-500'>Records</div>
										<div className='text-xl font-semibold tabular-nums'>
											{rows.length}
										</div>
									</div>
									<div>
										<div className='text-xs text-zinc-500'>Total Transfer</div>
										<div className='text-xl font-semibold tabular-nums'>
											{formatAmount(total)} {CURRENCY}
										</div>
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button variant='light' onPress={close}>
									Cancel
								</Button>
								<Button
									className={BTN_PRIMARY}
									onPress={() => {
										close();
										onConfirm();
									}}>
									Confirm
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
};

export default ConfirmView;
