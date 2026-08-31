import { Route, Routes } from 'react-router-dom';
import headerRoutes from '../headerRoutes.tsx';

const HeaderRouter = () => {
	return (
		<Routes>
			{headerRoutes.map((routeProps) => (
				<Route key={routeProps.path} {...routeProps} />
			))}
		</Routes>
	);
};

export default HeaderRouter;
