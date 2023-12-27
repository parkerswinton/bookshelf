import { decimal, mysqlTable, serial, smallint, varchar } from "drizzle-orm/mysql-core";

export const book = mysqlTable("book", {
  id: serial("id").primaryKey(),
  googleId: varchar("google_id", { length: 12 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }),
  pageCount: smallint("page_count"),
  averageRating: decimal("average_rating", { precision: 2, scale: 1 }),
  imageLink: varchar("imageLink", { length: 355 }),
});
