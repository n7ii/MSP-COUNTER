import Card, { CardBody } from '../../../../components/ui/Card';

import Tooltip from '../../../../components/ui/Tooltip';
import Balance from '../../../../components/Balance';
import { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { LuArrowUpRight } from 'react-icons/lu';

const Balance2Partial = ({ activeTab, summary }: any) => {
	const [prevValue, setPrevValue] = useState(0);

	// Animate number when transOut changes
	const { number } = useSpring({
		from: { number: prevValue },
		number: summary?.transOut || 0,
		config: { mass: 1, tension: 200, friction: 20 },
	});

	const transOut = summary?.transOut || 0;
	const transInOut = summary?.transInOut || 0;

	const percentage = transInOut === 0 ? 0 : (transOut / transInOut) * 100;

	useEffect(() => {
		setPrevValue(summary?.transOut || 0);
	}, [summary?.transOut]);

	return (
		<Card>
			<CardBody>
				<div className='flex flex-col gap-2'>
					<div className='flex h-16 w-16 items-center justify-center rounded-full bg-rose-500'>
						<LuArrowUpRight className='text-3xl  text-white' />
					</div>
					<div className='space-x-1 text-zinc-500 dark:text-zinc-300 rtl:space-x-reverse'>
						<span className='font-semibold'>ທຸລະກໍາຂາອອກ: {activeTab} </span>
						<Tooltip text='Total ad campaigns.' />
					</div>

					<div className='text-4xl font-semibold'>
						<animated.span>
							{number.to((val) => Math.floor(val).toLocaleString())}
						</animated.span>
					</div>
					<div className='flex'>
						<Balance value={percentage.toFixed(2) + `%`}>Balance</Balance>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default Balance2Partial;
