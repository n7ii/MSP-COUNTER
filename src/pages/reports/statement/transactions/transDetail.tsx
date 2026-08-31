import * as React from 'react';

interface TopupDetailProps {
	label?: string;
	transaction: any;
}

const TransDetail: React.FC<TopupDetailProps> = ({ transaction, label }) => {
	console.log('transData', transaction);

	return (
		<div className='rounded-lg bg-white shadow dark:bg-gray-800 sm:col-span-3'>
			<h2 className='px-4 py-2 font-semibold text-gray-900 dark:text-white'>{label}</h2>

			{Object.entries(transaction).map(([key, value]) => (
				<div className='text-md' key={key}>
					<p className='bg-blue-50 px-4 py-1 font-semibold text-gray-900 dark:bg-gray-700 dark:text-gray-200'>
						{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
					</p>
					<p className='px-4 py-1 text-neutral-500 dark:text-gray-400'>
						{value !== null && value !== undefined
							? typeof value === 'number'
								? value.toLocaleString()
								: value.toString()
							: 'N/A'}
					</p>
				</div>
			))}
		</div>
	);
};

export default TransDetail;
