import { FC, useState, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';
import Header, { HeaderLeft, HeaderRight } from '@/components/layouts/Header/Header.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import Container from '@/components/layouts/Container/Container.tsx';
import Card from '@/components/ui/Card.tsx'; // Import the LoadingBar components

interface LoadingProps {
	msg?: string;
}

const Loading: FC<LoadingProps> = () => {
	const [progress, setProgress] = useState(10); // Start with 10% to ensure the bar is visible

	useEffect(() => {
		// Simulate loading progress with a delay
		let timer: NodeJS.Timeout;
		const simulateLoading = () => {
			setTimeout(() => setProgress(30), 500); // 30% after 500ms
			setTimeout(() => setProgress(60), 1000); // 60% after 1 second
			setTimeout(() => setProgress(90), 1500); // 90% after 1.5 seconds
			setTimeout(() => setProgress(100), 200000); // 100% after 2 seconds
		};
		simulateLoading();

		// Cleanup timeout on unmount
		return () => {
			clearTimeout(timer);
		};
	}, []);

	return (
		<>
			<Header>
				<HeaderLeft>
					<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
				</HeaderLeft>
				<HeaderRight>
					<div className='flex gap-4'>
						<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
						<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
						<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
					</div>
				</HeaderRight>
			</Header>
			<PageWrapper>
				<Subheader>
					<SubheaderLeft>
						<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
					</SubheaderLeft>
					<SubheaderRight>
						<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
					</SubheaderRight>
				</Subheader>
				<Container>
					<div className='grid grid-cols-12 gap-4'>
						<div className='col-span-3'>
							<Card className='h-[15vh] animate-pulse'>
								<div className='invisible'>Loading...</div>
							</Card>
						</div>
						<div className='col-span-3 '>
							<Card className='h-[15vh] animate-pulse'>
								<div className='invisible'>Loading...</div>
							</Card>
						</div>
						<div className='col-span-3'>
							<Card className='h-[15vh] animate-pulse'>
								<div className='invisible'>Loading...</div>
							</Card>
						</div>
						<div className='col-span-3'>
							<Card className='h-[15vh] animate-pulse'>
								<div className='invisible'>Loading...</div>
							</Card>
						</div>

						<div className='col-span-6'>
							<Card className='h-[50vh] animate-pulse'>
								<div className='invisible'>Loading...</div>
							</Card>
						</div>
						<div className='col-span-6'>
							<Card className='h-[50vh] animate-pulse'>
								<div className='invisible'>Loading...</div>
							</Card>
						</div>

						<div className='col-span-12'>
							<Card className='h-[15vh] animate-pulse'>
								<div className='invisible'>Loading...</div>
							</Card>
						</div>
					</div>
				</Container>
			</PageWrapper>
			{/* Top Loading Bar */}
			<LoadingBar
				color='red' // Customize the color
				progress={progress}
				onLoaderFinished={() => setProgress(0)} // Reset progress when done
			/>
		</>
	);
};

export default Loading;
