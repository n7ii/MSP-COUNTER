// src/components/PrivateRoute.tsx
import * as React from 'react';
import { Navigate } from 'react-router-dom';

import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import { APIStatus } from '@/types/apiType/api.type.ts';

interface PrivateRouteProps {
	isAuthenticated: boolean;
	userInfo: any;
	status: APIStatus;
	userRole: any;
	allowedRoles: string[];
	element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
	isAuthenticated,
	userInfo,
	userRole,
	status,
	allowedRoles,
	element,
}) => {
	const isAllowed =
		allowedRoles.length === 0 || userRole.some((role: any) => allowedRoles.includes(role));

	console.log('allowedRoles', allowedRoles);
	console.log('isAllowed', isAllowed);

	console.log('userRole', userRole);

	if (status === APIStatus.IDLE || status === APIStatus.PENDING) {
		return <Loading />;
	}

	if (status === APIStatus.REJECTED || (status === APIStatus.FULFILLED && !isAuthenticated)) {
		return <Navigate to='/auth' replace />;
	}

	if (userInfo && !isAllowed) {
		return <Navigate to='/404' replace />;
	}

	return element;
};

export default PrivateRoute;
