import { type User, type InsertUser, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  createOrder(orderDetails: string, userId: string): Promise<Order>;
  getUserOrders(userId: string): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private orders: Map<number, Order>;
  private orderCounter: number;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.orderCounter = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name ?? null,
      farmName: insertUser.farmName ?? null,
      farmLocation: insertUser.farmLocation ?? null,
      contact: insertUser.contact ?? null,
      totalArea: insertUser.totalArea ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createOrder(orderDetails: string, userId: string): Promise<Order> {
    const id = this.orderCounter++;
    const orderId = `ORD-${Date.now()}-${id}`;
    const order: Order = {
      id,
      orderId,
      orderDetails,
      orderDate: new Date(),
      userId,
    };
    this.orders.set(id, order);
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  }
}

export const storage = new MemStorage();
