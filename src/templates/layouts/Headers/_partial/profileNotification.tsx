import Dropdown, { DropdownMenu, DropdownToggle } from '../../../../components/ui/Dropdown';
import Button from '../../../../components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import people from '@/assets/animation/people.json';
import { useNavigate } from 'react-router-dom';

const ProfileNotificationItem = ({ profile }: any) => {
	const fullNameLa = `${profile.firstNameLa} ${profile.lastNameLa}`;
	const navigate = useNavigate();
	const dateRegister = profile.customer.vfInfoDate;
	const relativeTime = formatDistanceToNow(new Date(dateRegister), { addSuffix: true });
	const handleClick = () => {
		navigate(`/customer/approve/${profile.customer.customerId}`);
	};
	return (
		<div
			onClick={handleClick}
			className='flex min-w-[24rem] cursor-pointer gap-2 border-b border-gray-200 p-4 transition-all duration-150 hover:bg-gray-100'>
			<div className='relative flex-shrink-0'>
				<Lottie
					animationData={people}
					className='h-12 w-12 rounded-[28px] bg-teal-100 dark:bg-teal-900'
					autoplay
					loop
				/>
			</div>
			<div className='grow'>
				<p className='text-base'>
					{profile.prefixLa} {fullNameLa}
				</p>

				{/*<p className='text-base'>*/}
				{/*	<span className='font-semibold'>Birthday:</span> {profile.birthday}*/}
				{/*</p>*/}
				{/*<p className='text-base'>*/}
				{/*	<span className='font-semibold'>Gender:</span> {profile.gender?.fixName}*/}
				{/*</p>*/}
				<p className='text-base'>{profile.tel}</p>
			</div>
			<div className='relative flex flex-shrink-0 items-center'>
				<div className='text-xs text-zinc-500'>{relativeTime}</div>
			</div>
		</div>
	);
};

const ProfileNotificationPartial = ({ profileData }: any) => {
	return (
		<div className='relative'>
			<Dropdown>
				<DropdownToggle hasIcon={false}>
					<Button icon='HeroBell' aria-label='Notification' />
				</DropdownToggle>
				<DropdownMenu
					placement='bottom-end'
					className='flex max-h-[500px] flex-col divide-y divide-dashed divide-zinc-500/50 overflow-y-auto p-4'>
					{profileData.map((profile: any) => (
						<ProfileNotificationItem key={profile.profileId} profile={profile} />
					))}
				</DropdownMenu>
			</Dropdown>
			<span className='absolute end-0 top-0 flex h-3 w-3'>
				<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75' />
				<span className='relative inline-flex h-3 w-3 rounded-full bg-red-500' />
			</span>
		</div>
	);
};

export default ProfileNotificationPartial;
