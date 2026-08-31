import { useState } from 'react';
import Icon from '../../../components/icon/Icon';

import { NavItem, NavSeparator } from '../../../components/layouts/Navigation/Nav';
import { authPages } from '../../../config/pages.config.tsx';
import User from '../../../components/layouts/User/User';

import { useAppDispatch, useAppSelector } from '@/redux/hooks.ts';
import { logout } from '@/redux/slices/auth/authSlice.ts';
import SessionLogModal from '@/components/session/SessionLogModal.tsx';

const UserTemplate = () => {
	const dispatch = useAppDispatch();
	const [isSessionOpen, setIsSessionOpen] = useState(false);

	const role = useAppSelector((state) => state.auth?.user?.body?.role);
	const username = useAppSelector((state) => state.auth?.user?.body?.username);
	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<>
			<SessionLogModal
				isOpen={isSessionOpen}
				onOpenChange={() => setIsSessionOpen(false)}
			/>
			<User
				name={username}
				nameSuffix={<Icon icon='HeroCheckBadge' color='teal' />}
				position={role}>
				<NavSeparator />
				<NavItem {...authPages.profilePage} />
				<NavItem
					text='Session Log'
					icon='HeroKey'
					onClick={() => setIsSessionOpen(true)}
				/>
				<NavItem
					text='Logout'
					icon='HeroArrowRightOnRectangle'
					onClick={() => handleLogout()}
				/>
			</User>
		</>
	);
};

export default UserTemplate;
