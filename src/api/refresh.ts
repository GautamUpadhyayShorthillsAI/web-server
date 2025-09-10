import { Response, Request } from "express";
import { config } from "../config.js";
import { getBearerToken, makeJWT } from "../auth/auth.js";
import { getRefreshToken } from "../db/queries/refreshToken.js";

export async function handlerRefreshToken(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    if(!refreshToken){
        res.status(401);
        return res.send(JSON.stringify({
            message:"Either token does not exist or expired"
        }));
    }

    const result = await getRefreshToken(refreshToken);
    if(!result || new Date() > result[0].expiresAt || result[0].revokedAt != null){
        res.status(401);
        return res.send(JSON.stringify({
            message:"Either token does not exist or expired"
        }));
    }

    const token = makeJWT(result[0].userId,config.JWT);

    res.status(204);

    return res.send(JSON.stringify({
        token:token
    }));

}