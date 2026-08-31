import { useState } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Chart from '../../../../components/Chart';
import { IChartOptions } from '../../../../interface/chart.interface';

const SummaryCustomerUsage = () => {
	const [state] = useState<IChartOptions>({
		series: [50000, 35000, 30230, 100230], // Total amounts for "Cash Flow In" and "Cash Flow Out"
		options: {
			chart: {
				height: 350,
				type: 'pie', // Change to 'pie' chart type
			},
			labels: ['ຜູ້ໃຊ້ທັງໝົດ', 'ລໍຖ້າການອະນຸມັດ', 'ກະເປົ໋າເງິນທີ່ໃຊ້ງານ', 'ປະຕິເສດ'], // Labels for the pie chart
			tooltip: {
				y: {
					formatter: (value: number) => `$${value.toLocaleString()}`, // Format values in dollars with commas
				},
			},
			legend: {
				show: false, // Hide the legend from the pie chart
			},
			fill: {
				colors: ['#05B086', '#FFCC00', '#FF965D', '#FD7972'], // Yellow and Teal colors
			},
		},
	});

	return (
		<Card className='h-full shadow'>
			<CardHeader>
				<CardHeaderChild>
					<CardTitle>ພາບລວມຂອງຜູ້ໃຊ້</CardTitle>
				</CardHeaderChild>
			</CardHeader>
			<CardBody>
				<Chart series={state.series} options={state.options} type='donut' height={250} />
				<div className='mt-4 text-center text-sm text-gray-500'>
					<div className='flex justify-between'>
						<div className='flex text-lg font-semibold'>
							<div className='flex items-center'>
								<div className='mr-2 h-2 w-2 rounded-full bg-teal-500'></div>
								APB
							</div>
						</div>
						<div>₭200,000,000</div>
						<div>+ 8.8%</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default SummaryCustomerUsage;
