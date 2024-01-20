import {
  bigint,
  date,
  decimal,
  int,
  mysqlTable,
  primaryKey,
  serial,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import type { AdapterAccount } from "@auth/core/adapters";

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }).defaultNow(),
  image: varchar("image", { length: 255 }),
});

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const book = mysqlTable("book", {
  id: serial("id").primaryKey(),
  googleId: varchar("google_id", { length: 12 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }),
  pageCount: smallint("page_count"),
  averageRating: decimal("average_rating", { precision: 2, scale: 1 }).$type<number>(),
  imageLink: varchar("imageLink", { length: 355 }),
});

export const bookshelf = mysqlTable("bookshelf", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 100 }),
});

export const userBook = mysqlTable("user_book", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => users.id),
  bookId: bigint("book_id", { mode: "number", unsigned: true }).references(() => book.id),
  bookshelfId: bigint("bookshelf_id", { mode: "number", unsigned: true }).references(
    () => bookshelf.id,
  ),
  completeDate: date("completion_date"),
});
