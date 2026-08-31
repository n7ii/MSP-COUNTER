import { useEffect } from 'react';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

import AsideRouter from '@/routes/router/AsideRouter.tsx';
import Wrapper from './components/layouts/Wrapper/Wrapper.tsx';
import HeaderRouter from '@/routes/router/HeaderRouter.tsx';
import ContentRouter from '@/routes/router/ContentRouter.tsx';
import FooterRouter from '@/routes/router/FooterRouter.tsx';
import useFontSize from './hooks/useFontSize.ts';
import getOS from './utils/getOS.util.ts';
import { getMe } from '@/redux/slices/auth/authSlice.ts';
import ToastAlert from '@/common/toastAlert.tsx';
import { useAppDispatch } from '@/redux/hooks.ts';

const App = () => {
	const dispatch = useAppDispatch();
	const { fontSize } = useFontSize();
	const location = useLocation();

	// Initialize dayjs plugin for localized formats
	dayjs.extend(localizedFormat);

	useEffect(() => {
		dispatch(getMe());
	}, [dispatch]);

	getOS();

	// Check if the current page is "Not Found" or authentication-related
	const isSpecialPage =
		location.pathname.startsWith('/auth') ||
		location.pathname === '/404' ||
		location.pathname.startsWith('/signup');

	return (
		<>
			<style>{`:root {font-size: ${fontSize}px}`}</style>
			<div data-component-name='App' className='flex grow flex-col'>
				<ToastAlert />
				{!isSpecialPage && <AsideRouter />}
				<Wrapper>
					{!isSpecialPage && <HeaderRouter />}
					<ContentRouter />
					{!isSpecialPage && <FooterRouter />}
				</Wrapper>
			</div>
		</>
	);
};

export default App;
