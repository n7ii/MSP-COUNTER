import { FC } from 'react';
import classNames from 'classnames';

const STEPS = ['Upload File', 'Check & Preview', 'Confirm', 'Complete'];

interface IPayrollStepperProps {
	/** Number of steps reached so far (1-4). Reached steps are filled green. */
	reached: number;
}

const PayrollStepper: FC<IPayrollStepperProps> = ({ reached }) => (
	<ol className='flex flex-row flex-wrap gap-x-6 gap-y-3 lg:flex-col lg:gap-y-4 lg:pt-2'>
		{STEPS.map((label, index) => {
			const step = index + 1;
			const filled = step <= reached;

			return (
				<li
					key={label}
					className='flex items-center gap-3'
					aria-current={step === reached ? 'step' : undefined}>
					<span
						className={classNames(
							'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
							filled
								? 'bg-[#157F3F] text-white'
								: 'border border-zinc-300 bg-white text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200',
						)}>
						{step}
					</span>
					<span
						className={classNames(
							'text-xs',
							filled
								? 'font-medium text-[#157F3F] dark:text-emerald-400'
								: 'text-zinc-800 dark:text-zinc-200',
						)}>
						{label}
					</span>
				</li>
			);
		})}
	</ol>
);

export default PayrollStepper;
