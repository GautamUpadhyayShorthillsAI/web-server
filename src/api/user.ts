import { Response, Request } from "express";
import { db } from "../db/index.js";
import { NewUser, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { changeUserPass, createUser } from "../db/queries/user.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";

export async function handlerPostUser(req:Request,res:Response){
    type bodyType = {
        password:string
        email:string
    }
    const body:bodyType = req.body;
    if(!body){
        throw new Error("wrong input");
    }
    const hashed_password = await hashPassword(body.password);
    const hashed_body = {
        email:body.email,
        hashed_password:hashed_password
    }
    const success = await createUser(hashed_body);
    
    if(!success){
        res.status(400);
        res.send(JSON.stringify({
            message:"Could not register the user"
        }))
        return;
    }
    const user = await db.select().from(users).where(eq(users.email,body.email));
    res.status(201);
    res.send(JSON.stringify(user[0]))
    res.end();
}

export async function handlerChangeUserPass(req:Request,res:Response) {
    const body = req.body;
    const accessToken = getBearerToken(req);

    if(!accessToken){
        return res.status(401);
    }
    const userId = validateJWT(accessToken,config.JWT);
    if(!userId){
        return res.status(401);
    }
    const hashed_password = await hashPassword(body.password);
    const user:NewUser = {
        email:body.email,
        hashed_password
    }
    const success = await changeUserPass(user);

    if(!success){
        res.status(401);
        return res.send(JSON.stringify({
            message:"Could not change password"
        }));
    }

    res.status(200);
    return res.send({
        message:"Password is changed"
    });
}