import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { LuCircleAlert, LuTriangleAlert } from 'react-icons/lu';

interface IStepBannerProps {
	variant: 'error' | 'warning';
	children: ReactNode;
	className?: string;
}

const StepBanner: FC<IStepBannerProps> = ({ variant, children, className }) => {
	const Icon = variant === 'error' ? LuCircleAlert : LuTriangleAlert;

	return (
		<div
			role='alert'
			className={classNames(
				'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm',
				{
					'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300':
						variant === 'error',
					'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300':
						variant === 'warning',
				},
				className,
			)}>
			<Icon size={18} className='mt-0.5 shrink-0' />
			<div className='min-w-0 break-words'>{children}</div>
		</div>
	);
};

export default StepBanner;
