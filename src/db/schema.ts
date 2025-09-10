import { sql } from "drizzle-orm";
import { pgTable, timestamp, varchar, uuid ,boolean} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashed_password: varchar({ length: 256 }).notNull(),
  is_chirpy_red:boolean().notNull().default(false)
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: varchar({ length: 141 }).notNull(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" })
});

export const refresh_tokens = pgTable("refresh_token", {
  token: varchar("token",{length:256}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expiresAt: timestamp("expires_at")
    .notNull()
    .default(sql`now() + interval '60 days'`),
  revokedAt: timestamp('revoked_at'),
});

// token: the primary key - it's just a string
// created_at
// updated_at
// user_id: foreign key that deletes the row if the user is deleted
// expires_at: the timestamp when the token expires
// revoked_at: the timestamp when the token was revoked (null if not revoked)

export type NewUser = typeof users.$inferInsert;
export type NewChirp = typeof chirps.$inferInsert;
export type RefreshToekns = typeof refresh_tokens.$inferInsert;