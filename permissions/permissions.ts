import { api } from 'encore.dev/api';
import { getCallerRoles, requireRole } from '../lib/authz';

interface MyRolesResponse {
	roles: string[];
}

interface CheckRoleParams {
	role: string;
}

interface CheckRoleResponse {
	hasRole: boolean;
}

interface AdminCheckResponse {
	allowed: true;
}

export const myRoles = api(
	{ expose: true, auth: true, method: 'GET', path: '/permissions/my-roles' },
	async (): Promise<MyRolesResponse> => {
		return { roles: getCallerRoles() };
	},
);

export const checkRole = api(
	{ expose: true, auth: true, method: 'POST', path: '/permissions/check-role' },
	async (params: CheckRoleParams): Promise<CheckRoleResponse> => {
		return { hasRole: getCallerRoles().includes(params.role) };
	},
);

export const adminCheck = api(
	{ expose: true, auth: true, method: 'GET', path: '/permissions/admin-check' },
	async (): Promise<AdminCheckResponse> => {
		requireRole('admin');
		return { allowed: true };
	},
);
