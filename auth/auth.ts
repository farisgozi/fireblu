import { Header, Gateway } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { APIError } from 'encore.dev/api';


interface AuthParams {
    authorization: Header<"Authorization">;
}

interface AuthData {
    userID: string;
}

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
