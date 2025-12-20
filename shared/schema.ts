import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  farmName: text("farm_name"),
  farmLocation: text("farm_location"),
  contact: text("contact"),
  totalArea: text("total_area"),
  profilePhoto: text("profile_photo"), // Base64 encoded image or URL
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 255 }).notNull().unique(),
  orderDetails: text("order_details").notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: varchar("quantity", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
});

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  variety: varchar("variety", { length: 255 }),
  area: varchar("area", { length: 100 }),
  plantingDate: timestamp("planting_date"),
  harvestDate: timestamp("harvest_date"),
  status: varchar("status", { length: 50 }).notNull().default('Active'),
  healthStatus: varchar("health_status", { length: 50 }).default('Good'),
  notes: text("notes"),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default('Operational'),
  fuelLevel: varchar("fuel_level", { length: 50 }),
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenance: timestamp("next_maintenance"),
  notes: text("notes"),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const irrigation = pgTable("irrigation", {
  id: serial("id").primaryKey(),
  fieldName: varchar("field_name", { length: 255 }).notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  waterUsage: varchar("water_usage", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default('Scheduled'),
  notes: text("notes"),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const soilHealth = pgTable("soil_health", {
  id: serial("id").primaryKey(),
  moisture: varchar("moisture", { length: 10 }).notNull(), // Percentage as string
  phLevel: varchar("ph_level", { length: 10 }).notNull(), // pH value as string
  nitrogen: varchar("nitrogen", { length: 10 }).notNull(), // Percentage as string
  phosphorus: varchar("phosphorus", { length: 10 }).notNull(), // Percentage as string
  potassium: varchar("potassium", { length: 10 }).notNull(), // Percentage as string
  notes: text("notes"),
  userId: varchar("user_id").notNull().references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderId: true,
  orderDate: true,
  userId: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  userId: true,
});

export const insertCropSchema = createInsertSchema(crops).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  status: z.string().default('Active'),
  healthStatus: z.string().default('Good').optional(),
  variety: z.string().optional(),
  area: z.string().optional(),
  plantingDate: z.union([z.string(), z.date()]).nullable().optional(),
  harvestDate: z.union([z.string(), z.date()]).nullable().optional(),
  notes: z.string().optional(),
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  status: z.string().default('Operational'),
  fuelLevel: z.string().optional(),
  lastMaintenance: z.union([z.string(), z.date()]).nullable().optional(),
  nextMaintenance: z.union([z.string(), z.date()]).nullable().optional(),
  notes: z.string().optional(),
});

export const insertIrrigationSchema = createInsertSchema(irrigation).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  status: z.string().default('Scheduled'),
  scheduledTime: z.union([z.string(), z.date()]),
  notes: z.string().optional(),
});

export const insertSoilHealthSchema = createInsertSchema(soilHealth).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  moisture: z.string().min(1),
  phLevel: z.string().min(1),
  nitrogen: z.string().min(1),
  phosphorus: z.string().min(1),
  potassium: z.string().min(1),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: z.string().optional(),
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
  contact: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Irrigation = typeof irrigation.$inferSelect;
export type InsertIrrigation = z.infer<typeof insertIrrigationSchema>;
export type SoilHealth = typeof soilHealth.$inferSelect;
export type InsertSoilHealth = z.infer<typeof insertSoilHealthSchema>;
