import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Spinner } from '@heroui/react';
import { LuRefreshCw, LuWallet } from 'react-icons/lu';
import StepBanner from '@/pages/salary/components/StepBanner.tsx';
import {
	getErrorMessage,
	getSalaryAccount,
	SalaryAccount,
} from '@/pages/salary/services/salaryApi.ts';
import { CURRENCY } from '@/pages/salary/utils.ts';

interface ISalaryAccountCardProps {
	/** Change this value to trigger a reload (e.g. after a successful confirm). */
	refreshKey: number;
}

const formatBalance = (value: number) =>
	value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const SalaryAccountCard: FC<ISalaryAccountCardProps> = ({ refreshKey }) => {
	const [account, setAccount] = useState<SalaryAccount | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const requestId = useRef(0);

	const load = useCallback(async () => {
		const current = ++requestId.current;
		setLoading(true);
		setError(null);

		try {
			const result = await getSalaryAccount();
			if (current === requestId.current) setAccount(result);
		} catch (e) {
			if (current === requestId.current) setError(getErrorMessage(e));
		} finally {
			if (current === requestId.current) setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load, refreshKey]);

	const unknownBalance = !!account && account.balance === null;

	return (
		<div className='flex flex-col items-start gap-2'>
			<div className='flex w-full items-center gap-5 rounded-2xl bg-white px-6 py-5 shadow-sm dark:bg-zinc-900 sm:w-auto sm:min-w-[28rem]'>
				<span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
					<LuWallet size={30} />
				</span>
				<div className='min-w-0 flex-1'>
					<div className='text-sm text-zinc-500'>SALARY account balance</div>
					<div className='truncate text-3xl font-bold tabular-nums leading-tight'>
						{account?.balance != null ? formatBalance(account.balance) : '-'}
						{account?.balance != null && (
							<span className='ml-2 text-lg font-semibold text-zinc-500'>
								{account.currency ?? CURRENCY}
							</span>
						)}
					</div>
				</div>
				<button
					type='button'
					aria-label='Reload balance'
					disabled={loading}
					onClick={load}
					className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-800'>
					{loading ? <Spinner size='sm' color='current' /> : <LuRefreshCw size={20} />}
				</button>
			</div>

			{error && (
				<StepBanner variant='error' className='max-w-md'>
					{error}
				</StepBanner>
			)}
			{unknownBalance && (
				<StepBanner variant='warning' className='max-w-md'>
					Balance field not found. Fields received:{' '}
					{Object.keys(account.raw).join(', ') || '(empty)'}
				</StepBanner>
			)}
		</div>
	);
};

export default SalaryAccountCard;
