import { FC, ReactNode } from 'react';

import Avatar from '../../../../components/Avatar';

import Icon from '../../../../components/icon/Icon';
import { TIcons } from '../../../../types/uiType/icons.type.ts';

import { useGetCustomerQuery } from '@/pages/customer/redux/queries/customerApiSlice.ts';
import ProfileNotificationPartial from '@/templates/layouts/Headers/_partial/profileNotification.tsx';

interface INotificationItemProps {
	image?: string;
	name: string;
	icon?: TIcons;
	firstLine: ReactNode;
	secondLine: ReactNode;
	isUnread: boolean;
	time: string;
}
const NotificationItem: FC<INotificationItemProps> = ({
	image,
	name,
	icon,
	firstLine,
	secondLine,
	isUnread,
	time,
}) => {
	return (
		<div className='flex min-w-[24rem] gap-2'>
			<div className='relative flex-shrink-0'>
				<Avatar src={image} name={name} />

				{icon && (
					<span className='absolute start-3/4 top-3/4 flex rounded-full bg-blue-500/75 outline outline-2 outline-blue-500/75'>
						<Icon icon={icon} />
					</span>
				)}
			</div>
			<div className='grow'>
				<div className='flex gap-2'>{firstLine}</div>
				<div className='flex gap-2'>{secondLine}</div>
			</div>
			<div className='relative flex flex-shrink-0 items-center'>
				{isUnread && (
					<span className='absolute end-0 top-0 flex h-2 w-2'>
						<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75' />
						<span className='relative inline-flex h-2 w-2 rounded-full bg-red-500' />
					</span>
				)}
				<div className='text-zinc-500'>{time}</div>
			</div>
		</div>
	);
};
NotificationItem.defaultProps = {
	image: undefined,
	icon: undefined,
};

const NotificationPartial = () => {
	const { data } = useGetCustomerQuery({
		page: 0,
		size: 10,
		search: '',
		approved: false,
	});

	//
	// // Assuming your API returns an object where data.body.content is an array of customers
	const customers = data?.body?.content || [];
	console.log('customers12323213', customers);
	return (
		<div className='relative'>
			<ProfileNotificationPartial profileData={customers} />
			<span className='absolute end-0 top-0 flex h-3 w-3'>
				<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75' />
				<span className='relative inline-flex h-3 w-3 rounded-full bg-red-500' />
			</span>
		</div>
	);
};

export default NotificationPartial;
