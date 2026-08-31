// utils/roleHelper.ts
export const hasAccess = (userRoles: string | undefined, allowedRoles?: string[]): boolean => {
	if (!allowedRoles || allowedRoles.length === 0) return true;
	if (!userRoles) return false;

	// Split the comma-separated roles into an array
	const userRoleArray = userRoles.split(',').map((role) => role.trim());

	// Check if any of the user's roles match the allowed roles
	return userRoleArray.some((role) => allowedRoles.includes(role));
};
