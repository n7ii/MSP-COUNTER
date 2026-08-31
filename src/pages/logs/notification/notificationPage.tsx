import LogListPage, { useLogListState } from '@/pages/logs/components/LogListPage.tsx';
import { useGetNotificationLogsQuery } from '@/pages/logs/redux/queries/logApiSlice.ts';

const NotificationPage = () => {
	const listState = useLogListState();
	const { data, isLoading } = useGetNotificationLogsQuery({
		page: listState.pageIndex,
		size: listState.pageSize,
		search: listState.search,
	});

	return (
		<LogListPage
			name='Notification Log'
			title='Notification'
			data={data}
			isLoading={isLoading}
			{...listState}
		/>
	);
};

export default NotificationPage;
