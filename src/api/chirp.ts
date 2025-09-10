import { Response, Request,NextFunction } from "express";
import { BadRequestError } from "./error.js";
import { respondWithJSON } from "./json.js";
import { db } from "../db/index.js";
import { chirps, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { getChirp, getChirps, createChirp, deleteChirp } from "../db/queries/chirp.js";
import { getBearerToken, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";
import { UserNotAuthorizedError } from "./error.js";


export async function handlerPostChirps(req:Request,res:Response){
    type bodyType = {
        body:string,
        userId:string,
    }
    const body:bodyType = req.body;
    const token = getBearerToken(req);
    const userId = validateJWT(token,config.JWT);
    console.log(userId)
    if(body.userId != userId){
        throw new UserNotAuthorizedError("User not authorized to post chirp");
    }
    if(!body){
        throw new Error("wrong input");
    }
    //check if user with userId exit
    const user = await db.select().from(users).where(eq(users.id,body.userId));
    if(!user){
        res.status(400);
        res.send(JSON.stringify({
            message:`User with userId:${body.userId} does not exit`
        }))
        return;
    }
    const success = await createChirp(body);
    if(!success){
        res.status(400);
        res.send(JSON.stringify({
            message:"Could not post the chirp"
        }))
        return;
    }
    const chirp = await db.select().from(chirps).where(eq(chirps.userId,body.userId));
    res.status(201);
    res.send(JSON.stringify(chirp))
    res.end();
}


export async function handlerGetChirp(req: Request, res: Response) {
    const param = req.params.id;
    const chirp = await getChirp(param);
    if (!chirp) {
        res.status(404);
        res.send(JSON.stringify({
            message: "Chirp not found"
        }))
        res.end();
        return;
    }
    res.status(200)
    res.send(JSON.stringify(chirp));
    res.end();  
}


export async function handlerGetChirps(req:Request,res:Response){
    const chirps  = await getChirps();
    if(!chirps){
        res.status(400);
        res.send(JSON.stringify({
            message:"No chirps found"
        }))
        res.end();
        return;
    }
    res.status(200)
    res.send(JSON.stringify(chirps));
    res.end();
    return;
    
    
}


export async function handlerValidateChip(req: Request, res: Response, next: NextFunction) {
    type bodyType = {
        body: string
    }
    try {
        const body: bodyType = req.body;
        const maxChirpLength = 140;
        if (body.body.length > maxChirpLength) {
            throw new BadRequestError(
                `Chirp is too long. Max length is ${maxChirpLength}`,
            );
        }


        const message = body.body.replace(/\s+/g, ' ').trim().split(" ");
        const profaneWord = ['kerfuffle', 'sharbert', 'fornax'];

        const filteredMesaage = message.map((word) => {
            if (profaneWord.includes(word)) {
                return "****"
            }
            return word;
        }).join(" ");

        res.status(200);
        respondWithJSON(res, 200, {
            cleanedBody: filteredMesaage,
        });
        res.send(JSON.stringify({
            "cleanedBody": filteredMesaage
        }))
    }
    catch (e) {
        console.log(e);
        res.send(JSON.stringify({
            "error": "Something went wrong"
        }))
        next(e);
    }
}

export async function handlerDeleteChirp(req: Request, res: Response) {
    const accessToken = getBearerToken(req);
    const chirpId = req.params.chirpId;
    if(!accessToken){
        res.status(401);
        return res.send(JSON.stringify({
            message:"Access token not found."
        }))
    }
    
    const userId = validateJWT(accessToken,config.JWT);
    if(!userId){
        res.status(401);
        return res.send(JSON.stringify({
            message:"Access token invalid."
        }));
    }
    const chirp = await getChirp(chirpId);
    if(chirp.length == 0){
        res.status(401);
        return res.send(JSON.stringify({
            message:"Chirps not found."
        }))
    }
    if(chirp[0].userId != userId){
        res.status(403);
        return res.send(JSON.stringify({
            message:"user not authorised to delete this."
        }));
    }

    const success = await deleteChirp(chirpId);
    if(!success){
        respondWithJSON(res,500,{message:"Error while deleting the chirp."})
    }
    respondWithJSON(res,204,{message:"Successfully deleted the chirp."});
}