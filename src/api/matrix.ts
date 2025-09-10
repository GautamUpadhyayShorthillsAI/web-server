import { Response, Request } from "express";
import { config } from "../config.js";

export async function handlerCountServerHit(_: Request, res: Response) {
    let count = {
        Hits: config.fileserverHits
    }
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<html>
        <body>
        <h1>Welcome, Chirpy Admin </h1>
        <p> Chirpy has been visited ${count.Hits} times! </p>
        </body>
    </html>`);
    res.end();
}