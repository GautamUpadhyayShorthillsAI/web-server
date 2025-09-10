import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT,validateJWT } from "../auth/auth.js";
import { checkPasswordHash, hashPassword } from "../auth/auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;
  let userID = "userId";
  // let expiresIn = 12;
  let secret = "mysecret";
  let token:string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
    token = makeJWT(userID,secret);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return JWT Token", async () => {
    const result = makeJWT(userID,secret);
    expect(result).toString()
  });

  it("should return JWTPayload", async () => {
    const result = validateJWT(token,secret);
    expect(result).toBe(userID);
  });

}); 