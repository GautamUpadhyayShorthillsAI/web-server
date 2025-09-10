import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { refresh_tokens ,RefreshToekns} from "../schema.js";

export async function createRefreshToken(refreshToken: RefreshToekns) {
  const [result] = await db
    .insert(refresh_tokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getRefreshToken(refeshToken:string) {
  const result = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token,refeshToken));
  return result;
}
export async function revokeRefreshToken(refreshToken:string) {
  const [result] = await db
    .update(refresh_tokens)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(refresh_tokens.token, refreshToken))
    .returning();

  return result;
}

export async function checkUserId(userId:string) {
  const result = await db.select().from(refresh_tokens).where(eq(refresh_tokens.userId,userId));
  return result;
}