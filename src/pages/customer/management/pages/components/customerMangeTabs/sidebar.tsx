import React, { useState } from 'react';
import { Card } from '@heroui/react';

interface TabItem {
	key: string;
	title: string;
	content: React.ReactNode;
	icon?: React.ReactNode;
}

interface TabsComponentProps {
	tabs: TabItem[];
}

const CustomTabs: React.FC<TabsComponentProps> = ({ tabs }) => {
	const [activeTab, setActiveTab] = useState(tabs[0].key);

	return (
		<div className='my-4 flex w-full flex-col gap-4 sm:flex-row'>
			{/* ✅ Sidebar - Stays on the side on desktop, scrollable on mobile */}
			<Card className='w-full flex-shrink-0 rounded-[18px] shadow-sm sm:w-64'>
				<h2 className='mb-4 px-6 pt-6 text-lg font-semibold text-gray-700 dark:text-gray-300'>
					Customer Services
				</h2>
				<ul className='max-h-[400px] overflow-y-auto sm:max-h-none'>
					{tabs.map((tab) => (
						<li
							key={tab.key}
							className={`flex cursor-pointer items-center gap-3 border-l-4 p-3 transition
             			   hover:bg-gray-50 dark:hover:bg-[#09090B]  ${
								activeTab === tab.key
									? 'border-teal-500 bg-gray-100 dark:bg-[#27272A]'
									: 'border-transparent'
							}`}
							onClick={() => setActiveTab(tab.key)}>
							<span className='flex h-5 w-5 items-center justify-center text-gray-500 dark:text-gray-400'>
								{tab.icon}
							</span>
							<span className='text-sm'>{tab.title}</span>
						</li>
					))}
				</ul>
			</Card>

			{/* ✅ Responsive Content Section */}
			<main className='w-full flex-1'>
				<Card className='w-full rounded-[18px] p-6 shadow-sm'>
					{tabs.find((tab) => tab.key === activeTab)?.content}
				</Card>
			</main>
		</div>
	);
};

export default CustomTabs;
