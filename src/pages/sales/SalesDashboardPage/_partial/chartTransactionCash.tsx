import { useState, useEffect } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Chart from '../../../../components/Chart';
import { IChartOptions } from '../../../../interface/chart.interface';

const CartTransactionCash = ({ cashDetail }: any) => {
	// Extract data from cashDetail dynamically
	const categories = cashDetail?.map((item: any) => item.dateOnly) || [];
	const sumCashIn = cashDetail?.map((item: any) => item.sumCashIn) || [];
	const sumCashOut = cashDetail?.map((item: any) => item.sumCashOut) || [];

	// Define state for chart options
	const [state, setState] = useState<IChartOptions>({
		series: [
			{
				name: 'Cash Flow In',
				data: sumCashIn,
			},
			{
				name: 'Cash Flow Out',
				data: sumCashOut,
			},
		],
		options: {
			chart: {
				height: 350,
				type: 'area',
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth',
				colors: ['#05B086', '#FFCC00'], // Stroke colors for the lines (Teal and Yellow)
			},
			xaxis: {
				type: 'datetime',
				categories, // Use dynamic dates from cashDetail
			},
			tooltip: {
				x: {
					format: 'yyyy-MM-dd', // Format date for better readability
				},
				y: {
					formatter: (value: number) => `${value.toLocaleString()} LAK`, // Format values with commas
				},
			},
			yaxis: {
				title: {
					text: 'Amount (LAK)',
				},
			},
			fill: {
				opacity: 0.5,
				colors: ['#05B086', '#FFCC00'], // Yellow and Teal colors
			},
		},
	});

	// Update chart data when cashDetail changes
	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			series: [
				{ name: 'Cash Flow In', data: sumCashIn },
				{ name: 'Cash Flow Out', data: sumCashOut },
			],
			options: {
				...prevState.options,
				xaxis: { categories },
			},
		}));
	}, [cashDetail]);

	return (
		<Card className='h-full'>
			<CardHeader>
				<CardHeaderChild>
					<CardTitle>ຈໍານວນເງິນຂາເຂົ້າ-ອອກ</CardTitle>
				</CardHeaderChild>
			</CardHeader>
			<CardBody>
				<Chart series={state.series} options={state.options} type='area' height={400} />
			</CardBody>
		</Card>
	);
};

export default CartTransactionCash;
