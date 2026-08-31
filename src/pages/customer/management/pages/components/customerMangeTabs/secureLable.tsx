import { LuLock } from 'react-icons/lu';

const SecureLabel = ({ text }: { text: string }) => {
	return (
		<div className='relative flex w-full items-center justify-center border-gray-300 py-2 dark:border-gray-600'>
			{/* Centered Line */}
			<div className='absolute left-0 top-1/2 w-full border-t border-gray-300 dark:border-gray-600'></div>

			<div className='relative z-10 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700'>
				<LuLock className='h-4 w-4 text-red-500' />
				{/* Middle Line inside Icon */}

				<span className='text-sm text-gray-700 dark:text-gray-300'>{text}</span>
			</div>
		</div>
	);
};

export default SecureLabel;
