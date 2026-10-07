import { FC } from 'react';
import { Button } from '@heroui/react';
import { LuBadgeCheck, LuHandCoins, LuHistory } from 'react-icons/lu';

export type PayrollTab = 'payroll' | 'history' | 'paid';

interface IPayrollTabsProps {
	active: PayrollTab;
	disabled?: boolean;
	onChange: (tab: PayrollTab) => void;
}

const TABS = [
	{ id: 'payroll', label: 'Payroll', icon: <LuHandCoins size={16} /> },
	{ id: 'history', label: 'History', icon: <LuHistory size={16} /> },
	{ id: 'paid', label: 'Paid', icon: <LuBadgeCheck size={16} /> },
] as const;

const PayrollTabs: FC<IPayrollTabsProps> = ({ active, disabled, onChange }) => (
	<div className='mb-4 flex flex-wrap gap-2' role='tablist'>
		{TABS.map((tab) => {
			const selected = active === tab.id;

			return (
				<Button
					key={tab.id}
					size='sm'
					role='tab'
					aria-selected={selected}
					variant={selected ? 'solid' : 'bordered'}
					className={selected ? 'bg-primary font-semibold text-white' : undefined}
					isDisabled={disabled}
					startContent={tab.icon}
					onPress={() => onChange(tab.id)}>
					{tab.label}
				</Button>
			);
		})}
	</div>
);

export default PayrollTabs;
