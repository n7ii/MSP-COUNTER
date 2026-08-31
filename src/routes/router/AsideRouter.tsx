import { Route, Routes } from 'react-router-dom';
import asideRoutes from '../asideRoutes.tsx';

const AsideRouter = () => {
	return (
		<Routes>
			{asideRoutes.map((routeProps) => (
				<Route key={routeProps.path} {...routeProps} />
			))}
		</Routes>
	);
};

export default AsideRouter;
