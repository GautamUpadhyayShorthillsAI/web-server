import { Response, Request } from "express";
import { getBearerToken, makeJWT } from "../auth/auth.js";
import { getRefreshToken, revokeRefreshToken } from "../db/queries/refreshToken.js";

export async function handlerRevokeRefreshToken(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    const result = await getRefreshToken(refreshToken);

    if (!refreshToken || !result || new Date() > result[0].expiresAt || result[0].revokedAt != null) {
        res.status(401);
        res.send(JSON.stringify({
            message: "Either token does not exist or expired"
        }));
    }
    const revoked = await revokeRefreshToken(refreshToken);
    console.log(revoked);
    if (!revoked) {
        res.status(401);
        return res.send(JSON.stringify({
            message: "Unable revoke the refresh token"
        }));
    }

    res.status(204);
}