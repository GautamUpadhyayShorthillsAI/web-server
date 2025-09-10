import { Response, Request } from "express";
import { config } from "../config.js";
import { db } from "../db/index.js";
import { chirps, refresh_tokens, users } from "../db/schema.js";

export async function handlerResetServerHit(_: Request, res: Response) {
    if (config.platform == "dev") {
        config.fileserverHits = 0;
        await db.delete(users);
        await db.delete(chirps); 
        await db.delete(refresh_tokens);
        res.status(200)
        res.write("Hits reset to 0\n");
        res.write("user abd chirps deleted");
        res.end();
        return;
    }
    res.status(403)
    res.send(JSON.stringify({
        message: "Forbidden request"
    }))
}
