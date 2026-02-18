import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cities = pgTable("cities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  country: text("country").notNull(),
  image: text("image").notNull(),
  followers: integer("followers").notNull().default(0),
  markerColor: text("marker_color").notNull().default("peach"),
  latitude: doublePrecision("latitude").notNull().default(0),
  longitude: doublePrecision("longitude").notNull().default(0),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  style: text("style").notNull(),
  vibe: text("vibe").notNull().default("Quiet Luxury"),
  cityId: varchar("city_id").notNull(),
  cityName: text("city_name").notNull(),
  image: text("image").notNull(),
  isBestSeller: boolean("is_best_seller").notNull().default(false),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const newsletters = pgTable("newsletters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
});

export const insertCitySchema = createInsertSchema(cities).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertNewsletterSchema = createInsertSchema(newsletters).omit({ id: true });

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletters.$inferSelect;
