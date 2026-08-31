import LogListPage, { useLogListState } from '@/pages/logs/components/LogListPage.tsx';
import { useGetTxnRequestLogsQuery } from '@/pages/logs/redux/queries/logApiSlice.ts';

const TxnTypeLogPage = () => {
	const listState = useLogListState();
	const { data, isLoading } = useGetTxnRequestLogsQuery({
		page: listState.pageIndex,
		size: listState.pageSize,
		search: listState.search,
	});

	return (
		<LogListPage
			name='Transaction Request Log'
			title='Transaction Request'
			data={data}
			isLoading={isLoading}
			{...listState}
		/>
	);
};

export default TxnTypeLogPage;
