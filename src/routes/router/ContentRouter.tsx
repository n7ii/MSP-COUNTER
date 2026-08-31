import { Suspense } from 'react';
import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom';
import contentRoutes from '../contentRoutes.tsx';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper.tsx';
import Container from '../../components/layouts/Container/Container.tsx';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../components/layouts/Subheader/Subheader.tsx';
import Header, { HeaderLeft, HeaderRight } from '../../components/layouts/Header/Header.tsx';
import Card from '../../components/ui/Card.tsx';
import { useAppSelector } from '@/redux/hooks.ts';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import PrivateRoute from '@/routes/privateRoute.tsx';
import LoginPage from '@/pages/auth/LoginPage.tsx';
import NotFoundPage from '@/pages/NotFound.page.tsx';
import SignUpPage from '@/pages/auth/signUpPage.tsx';

const ContentRouter = () => {
	const { isAuthenticated, user, status } = useAppSelector((state) => state.auth);

	const location = useLocation();
	const isAuthPage =
		location.pathname.startsWith('/auth') || location.pathname.startsWith('/404');

	const userRole =
		typeof user?.body?.role === 'string'
			? user.body.role.split(',').map((role) => role.trim())
			: [];

	if (status === 'IDLE' || status === 'PENDING') {
		return <Loading />;
	}
	// Redirect authenticated users to the home page if they are trying to access the login route
	if (isAuthenticated && window.location.pathname === '/auth') {
		return <Navigate to='/' replace />;
	}

	const privateRouteElements = contentRoutes.map((route) => ({
		...route,
		element: (
			<PrivateRoute
				isAuthenticated={isAuthenticated}
				userInfo={user}
				status={status}
				userRole={userRole}
				allowedRoles={route.allowedRoles}
				element={route.element}
			/>
		),
	}));

	const routes = useRoutes([
		{
			path: '/',
			element: isAuthPage ? <Outlet /> : <Outlet />,
			children: [
				{ path: 'signup', element: <SignUpPage /> },
				{ path: 'auth', element: <LoginPage /> },
				{ path: '404', element: <NotFoundPage /> },
				...privateRouteElements,
			],
		},
		{ path: '*', element: <Navigate to='/404' replace /> }, // Catch-all route
	]);

	return (
		<Suspense
			fallback={
				<>
					<Header>
						<HeaderLeft>
							<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
						</HeaderLeft>
						<HeaderRight>
							<div className='flex gap-4'>
								<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
								<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
								<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
							</div>
						</HeaderRight>
					</Header>
					<PageWrapper>
						<Subheader>
							<SubheaderLeft>
								<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
							</SubheaderLeft>
							<SubheaderRight>
								<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
							</SubheaderRight>
						</Subheader>
						<Container>
							<div className='grid grid-cols-12 gap-4'>
								<div className='col-span-3'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-3 '>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-3'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-3'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>

								<div className='col-span-6'>
									<Card className='h-[50vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-6'>
									<Card className='h-[50vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>

								<div className='col-span-12'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
							</div>
						</Container>
					</PageWrapper>
				</>
			}>
			{routes}
		</Suspense>
	);
};

export default ContentRouter;
