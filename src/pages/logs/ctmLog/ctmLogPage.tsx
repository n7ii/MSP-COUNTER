import LogListPage, { useLogListState } from '@/pages/logs/components/LogListPage.tsx';
import { useGetCustomerLogsQuery } from '@/pages/logs/redux/queries/logApiSlice.ts';

const CtmLogPage = () => {
	const listState = useLogListState();
	const { data, isLoading } = useGetCustomerLogsQuery({
		page: listState.pageIndex,
		size: listState.pageSize,
		search: listState.search,
	});

	return (
		<LogListPage
			name='Customer Log'
			title='Customer Log'
			data={data}
			isLoading={isLoading}
			{...listState}
		/>
	);
};

export default CtmLogPage;
