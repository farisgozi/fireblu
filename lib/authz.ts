import { APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';

export type CallerAuthData = NonNullable<ReturnType<typeof getAuthData>>;

function normalizeRoles(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((role): role is string => typeof role === 'string');
}

export function requireAuth(): CallerAuthData {
    const authData = getAuthData();
    if (!authData) {
        throw APIError.unauthenticated('Not authenticated');
    }

    return authData;
}

export function getCallerRoles(): string[] {
    return normalizeRoles(requireAuth().roles);
}

export function hasRole(role: string): boolean {
    return getCallerRoles().includes(role);
}

export function requireRole(role: string): void {
    if (!hasRole(role)) {
        throw APIError.permissionDenied(`Missing required role: ${role}`);
    }
}