import bcrypt from 'bcrypt'
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { NotFoundError, UserNotAuthenticatedError } from "../api/error.js";
import { Request } from 'express';
const saltRounds = 10;
import dotenv from "dotenv";
dotenv.config();
type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;


export async function hashPassword(password: string): Promise<string> {
    // hash the incoming password
    const hashed_password = await bcrypt.hash(password, saltRounds);
    return hashed_password;

}

export async function checkPasswordHash(password: string, hash: string) {
    const result = await bcrypt.compare(password, hash);
    return result;
}


export function makeJWT(userID: string, secret: string, expiresIn: number = 3600): string {
    const data: payload = {
        "iss": "chirp",
        "sub": userID,
        "iat": Math.floor(Date.now() / 1000),
        "exp": Math.floor(Date.now() / 1000) + expiresIn
    }
    const token = jwt.sign(data, secret)
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    const decoded = jwt.verify(tokenString, secret);
    
    if (typeof decoded === 'string') {
        throw new UserNotAuthenticatedError('Invalid token payload');
    }
    return decoded.sub as string;
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new NotFoundError("Token not found");
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new NotFoundError("Invalid Authorization header format");
    }

    const token = parts[1];
    return token;
}


export function makeRefreshToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
}