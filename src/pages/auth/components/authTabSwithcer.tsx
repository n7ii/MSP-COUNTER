import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

const AuthTabSwitcher = () => {
	const location = useLocation();
	const isLoginPage = location.pathname === '/auth';

	return (
		<div className='mb-6 flex w-full justify-center'>
			<div className='flex overflow-hidden rounded-full bg-gray-100 p-1 shadow-md dark:bg-zinc-800'>
				{/* Login Tab */}
				<Link
					to='/auth'
					className={classNames(
						'px-6 py-2 text-sm font-medium transition-all duration-200',
						isLoginPage
							? 'rounded-full bg-emerald-500 text-white shadow'
							: 'text-gray-600 hover:text-teal-600',
					)}>
					Login
				</Link>

				{/* Register Tab */}
				<Link
					to='/signup'
					className={classNames(
						'px-6 py-2 text-sm font-medium transition-all duration-200',
						!isLoginPage
							? 'rounded-full bg-emerald-500 text-white shadow'
							: 'text-gray-600 hover:text-teal-600',
					)}>
					Register
				</Link>
			</div>
		</div>
	);
};

export default AuthTabSwitcher;
