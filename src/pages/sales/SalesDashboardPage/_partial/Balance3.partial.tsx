import Card, { CardBody } from '../../../../components/ui/Card';

import Tooltip from '../../../../components/ui/Tooltip';
import Balance from '../../../../components/Balance';

import { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { LuUsersRound } from 'react-icons/lu';

const Balance3Partial = ({ activeTab, summary }: any) => {
	const [prevValue, setPrevValue] = useState(0);

	// Animate number when transOut changes
	const { number } = useSpring({
		from: { number: prevValue },
		number: summary?.allCustomer || 0,
		config: { mass: 1, tension: 200, friction: 20 },
	});

	const newCustomer = summary?.newCustomer || 0;

	useEffect(() => {
		setPrevValue(summary?.allCustomer || 0);
	}, [summary?.allCustomer]);

	return (
		<Card>
			<CardBody>
				<div className='flex flex-col gap-2'>
					<div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500'>
						<LuUsersRound className='text-3xl text-white' />
					</div>
					<div className='space-x-1 text-zinc-500 dark:text-zinc-300 rtl:space-x-reverse'>
						<span className='font-semibold'>ລູກຄ້າທັງໝົດ: {activeTab} </span>
						<Tooltip text='Shipments sent.' />
					</div>
					<div className='text-4xl font-semibold'>
						<animated.span>
							{number.to((val) => Math.floor(val).toLocaleString())}
						</animated.span>
					</div>
					<div className='flex'>
						<Balance status='positive' value={newCustomer}>
							New
						</Balance>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default Balance3Partial;
