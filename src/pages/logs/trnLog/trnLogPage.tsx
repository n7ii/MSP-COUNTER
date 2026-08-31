import LogListPage, { useLogListState } from '@/pages/logs/components/LogListPage.tsx';
import { useGetTransactionLogsQuery } from '@/pages/logs/redux/queries/logApiSlice.ts';

const TrnLogPage = () => {
	const listState = useLogListState();
	const { data, isLoading } = useGetTransactionLogsQuery({
		page: listState.pageIndex,
		size: listState.pageSize,
		search: listState.search,
	});

	return (
		<LogListPage
			name='Transaction Log'
			title='Transaction Log'
			data={data}
			isLoading={isLoading}
			{...listState}
		/>
	);
};

export default TrnLogPage;
