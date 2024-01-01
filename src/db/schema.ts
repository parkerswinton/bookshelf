import {
  bigint,
  date,
  decimal,
  mysqlTable,
  serial,
  smallint,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
});

export const book = mysqlTable("book", {
  id: serial("id").primaryKey(),
  googleId: varchar("google_id", { length: 12 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }),
  pageCount: smallint("page_count"),
  averageRating: decimal("average_rating", { precision: 2, scale: 1 }),
  imageLink: varchar("imageLink", { length: 355 }),
});

export const bookshelf = mysqlTable("bookshelf", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => user.id),
  name: varchar("name", { length: 100 }),
});

export const userBook = mysqlTable("user_book", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => user.id),
  bookId: bigint("bookId", { mode: "number", unsigned: true }).references(() => book.id),
  bookshelfId: bigint("bookshelfId", { mode: "number", unsigned: true }).references(
    () => bookshelf.id,
  ),
  completeDate: date("completion_date"),
});
