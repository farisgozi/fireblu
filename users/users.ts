import { api } from 'encore.dev/api';
import { requireAuth } from '../lib/authz';

interface PingResponse {
    ok: true;
}

interface MeResponse {
    isAuthenticated: true;
    userID: string;
}

export const ping = api(
    { expose: true, method: "GET", path: "/users/ping" },
    async (): Promise<PingResponse> => {
        return { ok: true };
    }
);

export const me = api(
    { expose: true, auth: true, method: 'GET', path: '/users/me' },
    async (): Promise<MeResponse> => {
        const authData = requireAuth();

        return {
            isAuthenticated: true,
            userID: authData.userID,
        };
    }
);
