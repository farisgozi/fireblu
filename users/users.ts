import { api } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
import { APIError } from 'encore.dev/api';

interface PingResponse {
    ok: true;
}

interface MeResponse {
    userID: string;
}

export const ping = api(
    { expose: true, method: "GET", path: "/users/ping" },
    async (): Promise<PingResponse> => {
        return { ok: true };
    }
);

export const me = api(
    { expose: true, method: "GET", path: "/users/me" },
    async (): Promise<MeResponse> => {
        const auth = getAuthData();
        if (!auth) throw APIError.unauthenticated("Belum ter-autentikasi");

        return { userID: auth.userID };
    }
);
