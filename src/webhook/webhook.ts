import { Request, Response } from "express";
import { getuser, updateUserToRed } from "src/db/queries/user";
export async function handlerPolkaWebhook(req: Request, res: Response) {
    type bodyType = {
        "event": string,
        "data": {
            "userId": string
        }
    }

    const body:bodyType = req.body;
    if(body.event != "user.upgrade"){
        return res.status(204);
    }

    const user = await getuser(body.data.userId);
    if(user.length == 0){
        res.status(404);
        return res.send(JSON.stringify({
            message:"user not found"
        }));
    }
    
    const success = await updateUserToRed(user[0].id);
    if(!success){
        res.status(404);
        return res.send(JSON.stringify({
            message:"Error while upgrading user"
        }));
    }

    res.status(204);
}