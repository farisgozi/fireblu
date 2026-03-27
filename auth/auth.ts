import { APIError, Gateway, Header, api } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { secret } from 'encore.dev/config';
import { getAuthData } from '~encore/auth';
import { jwtVerify } from 'jose';

interface AuthParams {
    authorization: Header<'Authorization'>;
}

interface AuthData {
    userID: string;
    email?: string;
    roles: string[];
}

interface PingResponse {
    ok: true;
}

interface IsAuthResponse {
    isAuthenticated: boolean;
    userID?: string;
}

interface AccessTokenClaims {
    sub: string;
    email?: string;
    roles?: string[];
    iss?: string;
    aud?: string | string[];
}

const jwtSecret = secret('AuthJWTSecret');

function extractBearerToken(authorization: Header<'Authorization'>): string {
    const value = authorization.valueOf().trim();

    if (!value.startsWith('Bearer ')) {
        throw APIError.unauthenticated('Missing Bearer token');
    }

    const token = value.slice('Bearer '.length).trim();
    if (!token) {
        throw APIError.unauthenticated('Missing token');
    }

    return token;
}

function normalizeRoles(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((item): item is string => typeof item === 'string');
}

export const ping = api(
    { expose: true, method: 'GET', path: '/auth/ping' },
    async (): Promise<PingResponse> => {
        return { ok: true };
    },
);

export const isAuth = api(
    { expose: true, auth: true, method: 'GET', path: '/auth/is-auth' },
    async (): Promise<IsAuthResponse> => {
        const authData = getAuthData();
        if (!authData) throw APIError.unauthenticated('Not authenticated');
        

        return {
            isAuthenticated: true,
            userID: authData.userID,
        };
    },
);

export const auth = authHandler<AuthParams, AuthData>(async (params) => {
    const token = extractBearerToken(params.authorization);

    try {
        const encodedSecret = new TextEncoder().encode(jwtSecret());
        const { payload } = await jwtVerify(token, encodedSecret, {
            algorithms: ['HS256'],
            issuer: 'fireblu-api',
            audience: 'fireblu-clients',
        });

        const claims = payload as AccessTokenClaims;
        if (!claims.sub || typeof claims.sub !== 'string') {
            throw APIError.unauthenticated('Token subject is missing');
        }

        return {
            userID: claims.sub,
            email: claims.email,
            roles: normalizeRoles(claims.roles),
        };
    } catch {
        throw APIError.unauthenticated('Invalid or expired token');
    }
});

export const gateway = new Gateway({
    authHandler: auth,
});
