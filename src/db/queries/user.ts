import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getuser(body:any) {
  const result = await db.select().from(users).where(eq(users.email, body.email));
  return result;
}

export async function changeUserPass(user:NewUser) {
    const result = await db
      .update(users)
      .set({
        hashed_password:user.hashed_password
      })
      .where(eq(users.email,user.email));

      return result;
}

export async function updateUserToRed(userId:string) {
  const result = await db
    .update(users)
    .set({
      is_chirpy_red:true
    })
    .where(eq(users.id,userId));

  return result;
}