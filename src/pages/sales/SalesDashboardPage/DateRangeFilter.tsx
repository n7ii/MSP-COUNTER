// File: pages/sales/SalesDashboardPage/_partial/DateRangeFilter.tsx

import { Range } from 'react-date-range';
import dayjs from 'dayjs';
import { Button } from '@heroui/react';
import { LuSearch } from 'react-icons/lu';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Icon from '@/components/icon/Icon.tsx';

interface DateRangeFilterProps {
	state: Range[];
	onDateChange: (item: any) => void;
	onSearch: () => void;
}

const DateRangeFilter = ({ state, onDateChange, onSearch }: DateRangeFilterProps) => {
	const startDateStr = state[0].startDate ? dayjs(state[0].startDate).format('YYYY-MM-DD') : '';
	const endDateStr = state[0].endDate ? dayjs(state[0].endDate).format('YYYY-MM-DD') : '';

	const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value ? dayjs(e.target.value).startOf('day').toDate() : undefined;
		onDateChange({
			selection: {
				startDate: newDate,
				endDate: state[0].endDate,
				key: 'selection',
			},
		});
	};

	const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value ? dayjs(e.target.value).endOf('day').toDate() : undefined;
		onDateChange({
			selection: {
				startDate: state[0].startDate,
				endDate: newDate,
				key: 'selection',
			},
		});
	};

	return (
		<FieldWrap>
			<div className='mb-4 flex items-center gap-4'>
				<p className='flex font-medium'>Select Date Range:</p>
				<div className='flex items-center gap-2'>
					<div className='flex items-center rounded-md border p-1'>
						<Icon className='mx-1' icon='HeroCalendar' />
						<input
							type='date'
							value={startDateStr}
							onChange={handleStartDateChange}
							className='border-none bg-transparent px-1 py-1 text-sm outline-none focus:ring-0'
						/>
					</div>
					<span className='text-gray-400'>-</span>
					<div className='flex items-center rounded-md border p-1'>
						<Icon className='mx-1' icon='HeroCalendar' />
						<input
							type='date'
							value={endDateStr}
							onChange={handleEndDateChange}
							className='border-none bg-transparent px-1 py-1 text-sm outline-none focus:ring-0'
						/>
					</div>
				</div>

				<Button
					variant='solid'
					className='w-full max-w-32'
					startContent={<LuSearch size='18' />}
					color='primary'
					onPress={onSearch}>
					Search
				</Button>
			</div>
		</FieldWrap>
	);
};

export default DateRangeFilter;
