import { Request, Response } from "express";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth/auth.js";

import { config } from "../config.js";
import { getuser } from "../db/queries/user.js";
import { createRefreshToken } from "../db/queries/refreshToken.js";

export async function handlerLoginUser(req: Request, res: Response) {
    type bodyType = {
        email: string,
        password: string,
        expiresInSeconds?: number
    }
    
    const body: bodyType = req.body;
    const user = await getuser(body);
    if (user.length === 0) {
        res.status(404);
        res.send(JSON.stringify({
            message: "User does not exist!"
        }))
        res.end();
        return;
    }

    const checkPassword = await checkPasswordHash(body.password, user[0].hashed_password);
    if (!checkPassword) {
        res.status(401);
        res.send(JSON.stringify({
            message: "Wrong password"
        }));
        res.end();
        return;
    }
    const token = makeJWT(user[0].id, config.JWT);
    const refreshToken  = makeRefreshToken();
    const success = await createRefreshToken({
        userId:user[0].id,
        token: refreshToken,
    });
    if(!success){
        res.send(500);
        res.send(JSON.stringify({
            message:"Could not generate refresh token"
        }))
    }
    const result= {
        ...user[0],
        accessToken: token,
        refreshToken
    }

    //After verifying set the jwt token for the authorization
    res.send(JSON.stringify(result));
    res.end();
}