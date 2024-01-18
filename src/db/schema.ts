import {
  bigint,
  date,
  decimal,
  mysqlTable,
  serial,
  smallint,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("auth_user", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name: varchar("name", { length: 100 }),
});

export const key = mysqlTable("user_key", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => user.id),
  hashedPassword: varchar("hashed_password", { length: 255 }),
});

export const session = mysqlTable("user_session", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => user.id),
  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
  idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
});

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
    .references(() => user.id),
  name: varchar("name", { length: 100 }),
});

export const userBook = mysqlTable("user_book", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => user.id),
  bookId: bigint("book_id", { mode: "number", unsigned: true }).references(() => book.id),
  bookshelfId: bigint("bookshelf_id", { mode: "number", unsigned: true }).references(
    () => bookshelf.id,
  ),
  completeDate: date("completion_date"),
});
