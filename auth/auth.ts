import { Header, Gateway } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { APIError } from 'encore.dev/api';
import { api } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';

interface AuthParams {
    authorization: Header<"Authorization">;
}

interface AuthData {
    userID: string;
}

interface PingResponse {
    ok: true;
}

interface isAuthResponse {
    isAuthenticated: boolean;
}


export const ping = api({
    expose: true, method: "GET", path: "/auth/ping"
}, 
    async (): Promise<PingResponse> => {
        return { ok: true };
    }

);

export const isAuth = api({
    expose: true, method: "GET", path: "/auth/is_auth"
}, 
    async (): Promise<isAuthResponse> => {
        const auth = getAuthData();
        if (!auth) {
            return { isAuthenticated: false };
        }
        return { isAuthenticated: true };
    }
);


export const auth = authHandler<AuthParams, AuthData>(
    async (params) => {
        const token = params.authorization.valueOf().replace("Bearer ", "");
        if (token !== "valid-token") {
            throw APIError.unauthenticated("Invalid Token");
        }
        return { userID: "12345" };
    }
)

export const gateway = new Gateway({
    authHandler: auth,
});
