import { type User, type InsertUser, type Order, type Inventory, type InsertInventory } from "@shared/schema";
import { users, orders, inventory } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  createOrder(orderDetails: string, userId: string): Promise<Order>;
  getUserOrders(userId: string): Promise<Order[]>;
  createInventoryItem(item: InsertInventory, userId: string): Promise<Inventory>;
  getUserInventory(userId: string): Promise<Inventory[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createOrder(orderDetails: string, userId: string): Promise<Order> {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const [order] = await db
      .insert(orders)
      .values({
        orderId,
        orderDetails,
        userId,
      })
      .returning();
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.orderDate));
  }

  async createInventoryItem(item: InsertInventory, userId: string): Promise<Inventory> {
    const [inventoryItem] = await db
      .insert(inventory)
      .values({
        ...item,
        userId,
      })
      .returning();
    return inventoryItem;
  }

  async getUserInventory(userId: string): Promise<Inventory[]> {
    return await db
      .select()
      .from(inventory)
      .where(eq(inventory.userId, userId));
  }
}

export const storage = new DatabaseStorage();
