import Card, { CardBody } from '../../../../components/ui/Card';
import Tooltip from '../../../../components/ui/Tooltip';
import Balance from '../../../../components/Balance';
import { animated, useSpring } from '@react-spring/web';
import { useEffect, useState } from 'react';
import { LuArrowDownLeft } from 'react-icons/lu';

const Balance1Partial = ({ activeTab, summary }: any) => {
	const [prevValue, setPrevValue] = useState(0);

	// Animate number when transOut changes
	const { number } = useSpring({
		from: { number: prevValue },
		number: summary?.transIn || 0,
		config: { mass: 1, tension: 200, friction: 20 },
	});

	const transIn = summary?.transIn || 0;
	const transInOut = summary?.transInOut || 0;

	const percentage = transInOut === 0 ? 0 : (transIn / transInOut) * 100;

	useEffect(() => {
		setPrevValue(summary?.transIn || 0);
	}, [summary?.transIn]);
	return (
		<Card>
			<CardBody>
				<div className='flex flex-col gap-2'>
					{/* Icon */}
					<div className='flex h-16 w-16 items-center justify-center rounded-full bg-teal-500'>
						<LuArrowDownLeft className='text-3xl text-white' />
					</div>

					{/* Title */}
					<div className='space-x-1 text-zinc-500 dark:text-zinc-300 rtl:space-x-reverse'>
						<span className='font-semibold'>ທຸລະກໍາຂາເຂົ້າ ({activeTab})</span>
						<Tooltip text='Total transactions coming in.' />
					</div>

					{/* Animated Number */}
					<div className='text-4xl font-semibold'>
						<animated.span>
							{number.to((val) => Math.floor(val).toLocaleString())}
						</animated.span>
					</div>

					{/* Percentage Balance (Dummy Value, Adjust as Needed) */}
					<div className='flex'>
						<Balance value={percentage.toFixed(2) + `%`}>Transactions</Balance>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default Balance1Partial;
