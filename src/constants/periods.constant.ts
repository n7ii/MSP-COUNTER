type TPeriodText = 'Day' | 'Week' | 'Month';

export type TPeriod = {
	text: TPeriodText;
};

const PERIOD = {
	DAY: 'day',
	WEEK: 'WEEK',
	MONTH: 'MONTH',
	YEAR: 'YEAR',
};

export default PERIOD;
