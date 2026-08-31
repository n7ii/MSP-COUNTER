import { RouteProps } from 'react-router-dom';
import DefaultHeaderTemplate from '../templates/layouts/Headers/DefaultHeader.template';
import { authPages } from '../config/pages.config.tsx';
// import ComponentAndTemplateHeaderTemplate from '../templates/layouts/Headers/ComponentAndTemplateHeader.template';

const headerRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: null },

	// {
	// 	path: `${componentsPages.formPages.to}/*`,
	// 	element: <ComponentAndTemplateHeaderTemplate />,
	// },
	{
		path: '',
		element: null,
	},
	{ path: '*', element: <DefaultHeaderTemplate /> },
];

export default headerRoutes;
