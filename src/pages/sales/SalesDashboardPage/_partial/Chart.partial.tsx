import { useState, useEffect } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Chart from '../../../../components/Chart';
import { IChartOptions } from '../../../../interface/chart.interface';

const ChartPartial = ({ transDetail }: any) => {
	console.log('transDetail', transDetail);

	// Extract dynamic categories and data
	const categories = transDetail?.map((item: any) => item.monthYear) || [];
	const cashInCounts = transDetail?.map((item: any) => item.countCashIn) || [];
	const cashOutCounts = transDetail?.map((item: any) => item.countCashOut) || [];
	const totalCashCounts = transDetail?.map((item: any) => item.countAllCash) || [];

	// Define state for chart options
	const [state, setState] = useState<IChartOptions>({
		series: [
			{
				name: 'Cash In',
				data: cashInCounts,
			},
			{
				name: 'Cash Out',
				data: cashOutCounts,
			},
			{
				name: 'Total Cash',
				data: totalCashCounts,
			},
		],
		options: {
			chart: {
				type: 'bar',
				height: 350,
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					borderRadiusWhenStacked: 'all',
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent'],
			},
			xaxis: {
				categories, // Dynamic X-axis categories from transDetail
			},
			yaxis: {
				title: {
					text: 'Transaction Counts',
				},
			},
			fill: {
				opacity: 1,
				colors: ['#05B086', '#FF0000', '#FFA500'], // Colors for Cash In, Cash Out, and Total Cash
			},
			tooltip: {
				y: {
					formatter(val) {
						return `${val} transactions`;
					},
				},
			},
		},
	});

	// Update chart data when transDetail changes
	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			series: [
				{ name: 'Cash In', data: cashInCounts },
				{ name: 'Cash Out', data: cashOutCounts },
				{ name: 'Total Cash', data: totalCashCounts },
			],
			options: {
				...prevState.options,
				xaxis: { categories },
			},
		}));
	}, [transDetail]);

	return (
		<Card className='h-full'>
			<CardHeader>
				<CardHeaderChild>
					<CardTitle>ຈໍານວນທຸລະກໍາ</CardTitle>
				</CardHeaderChild>
			</CardHeader>
			<CardBody>
				<Chart series={state.series} options={state.options} type='bar' height={400} />
			</CardBody>
		</Card>
	);
};

export default ChartPartial;
