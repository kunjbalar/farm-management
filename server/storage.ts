import { type User, type InsertUser, type Order, type Inventory, type InsertInventory, type Crop, type InsertCrop, type Equipment, type InsertEquipment, type Irrigation, type InsertIrrigation, type SoilHealth, type InsertSoilHealth } from "@shared/schema";
import { users, orders, inventory, crops, equipment, irrigation, soilHealth } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  createOrder(orderDetails: string, userId: string): Promise<Order>;
  getUserOrders(userId: string): Promise<Order[]>;
  deleteOrder(id: number, userId: string): Promise<boolean>;
  createInventoryItem(item: InsertInventory, userId: string): Promise<Inventory>;
  getUserInventory(userId: string): Promise<Inventory[]>;
  deleteInventoryItem(id: number, userId: string): Promise<boolean>;
  // Crops
  createCrop(crop: InsertCrop, userId: string): Promise<Crop>;
  getUserCrops(userId: string): Promise<Crop[]>;
  updateCrop(id: number, updates: Partial<InsertCrop>): Promise<Crop | undefined>;
  deleteCrop(id: number, userId: string): Promise<boolean>;
  // Equipment
  createEquipment(equip: InsertEquipment, userId: string): Promise<Equipment>;
  getUserEquipment(userId: string): Promise<Equipment[]>;
  updateEquipment(id: number, updates: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: number, userId: string): Promise<boolean>;
  // Irrigation
  createIrrigation(irr: InsertIrrigation, userId: string): Promise<Irrigation>;
  getUserIrrigations(userId: string): Promise<Irrigation[]>;
  updateIrrigation(id: number, updates: Partial<InsertIrrigation>): Promise<Irrigation | undefined>;
  deleteIrrigation(id: number, userId: string): Promise<boolean>;
  // Soil Health
  getUserSoilHealth(userId: string): Promise<SoilHealth | null>;
  createOrUpdateSoilHealth(data: InsertSoilHealth, userId: string): Promise<SoilHealth>;
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

  async deleteOrder(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(orders)
      .where(and(eq(orders.id, id), eq(orders.userId, userId)))
      .returning();
    return result.length > 0;
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

  async deleteInventoryItem(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(inventory)
      .where(and(eq(inventory.id, id), eq(inventory.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Crops methods
  async createCrop(crop: InsertCrop, userId: string): Promise<Crop> {
    const cropData: any = {
      ...crop,
      userId,
    };
    
    // Convert ISO strings to Date objects for Drizzle
    if (crop.plantingDate && typeof crop.plantingDate === 'string') {
      cropData.plantingDate = new Date(crop.plantingDate);
    }
    if (crop.harvestDate && typeof crop.harvestDate === 'string') {
      cropData.harvestDate = new Date(crop.harvestDate);
    }
    
    const [newCrop] = await db
      .insert(crops)
      .values(cropData)
      .returning();
    return newCrop;
  }

  async getUserCrops(userId: string): Promise<Crop[]> {
    return await db
      .select()
      .from(crops)
      .where(eq(crops.userId, userId))
      .orderBy(desc(crops.createdAt));
  }

  async updateCrop(id: number, updates: Partial<InsertCrop>): Promise<Crop | undefined> {
    const updateData: any = { ...updates };
    
    // Convert ISO strings to Date objects for Drizzle
    if (updates.plantingDate && typeof updates.plantingDate === 'string') {
      updateData.plantingDate = new Date(updates.plantingDate);
    }
    if (updates.harvestDate && typeof updates.harvestDate === 'string') {
      updateData.harvestDate = new Date(updates.harvestDate);
    }
    
    const [crop] = await db
      .update(crops)
      .set(updateData)
      .where(eq(crops.id, id))
      .returning();
    return crop || undefined;
  }

  async deleteCrop(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(crops)
      .where(and(eq(crops.id, id), eq(crops.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Equipment methods
  async createEquipment(equip: InsertEquipment, userId: string): Promise<Equipment> {
    const equipData: any = {
      ...equip,
      userId,
    };
    
    // Convert ISO strings to Date objects for Drizzle
    if (equip.lastMaintenance && typeof equip.lastMaintenance === 'string') {
      equipData.lastMaintenance = new Date(equip.lastMaintenance);
    }
    if (equip.nextMaintenance && typeof equip.nextMaintenance === 'string') {
      equipData.nextMaintenance = new Date(equip.nextMaintenance);
    }
    
    const [newEquipment] = await db
      .insert(equipment)
      .values(equipData)
      .returning();
    return newEquipment;
  }

  async getUserEquipment(userId: string): Promise<Equipment[]> {
    return await db
      .select()
      .from(equipment)
      .where(eq(equipment.userId, userId))
      .orderBy(desc(equipment.createdAt));
  }

  async updateEquipment(id: number, updates: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    const updateData: any = { ...updates };
    
    // Convert ISO strings to Date objects for Drizzle
    if (updates.lastMaintenance && typeof updates.lastMaintenance === 'string') {
      updateData.lastMaintenance = new Date(updates.lastMaintenance);
    }
    if (updates.nextMaintenance && typeof updates.nextMaintenance === 'string') {
      updateData.nextMaintenance = new Date(updates.nextMaintenance);
    }
    
    const [equip] = await db
      .update(equipment)
      .set(updateData)
      .where(eq(equipment.id, id))
      .returning();
    return equip || undefined;
  }

  async deleteEquipment(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(equipment)
      .where(and(eq(equipment.id, id), eq(equipment.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Irrigation methods
  async createIrrigation(irr: InsertIrrigation, userId: string): Promise<Irrigation> {
    const irrigationData: any = {
      ...irr,
      userId,
    };
    
    // Convert ISO strings to Date objects for Drizzle
    if (irr.scheduledTime && typeof irr.scheduledTime === 'string') {
      irrigationData.scheduledTime = new Date(irr.scheduledTime);
    }
    
    const [newIrrigation] = await db
      .insert(irrigation)
      .values(irrigationData)
      .returning();
    return newIrrigation;
  }

  async getUserIrrigations(userId: string): Promise<Irrigation[]> {
    return await db
      .select()
      .from(irrigation)
      .where(eq(irrigation.userId, userId))
      .orderBy(desc(irrigation.createdAt));
  }

  async updateIrrigation(id: number, updates: Partial<InsertIrrigation>): Promise<Irrigation | undefined> {
    const updateData: any = { ...updates };
    
    // Convert ISO strings to Date objects for Drizzle
    if (updates.scheduledTime && typeof updates.scheduledTime === 'string') {
      updateData.scheduledTime = new Date(updates.scheduledTime);
    }
    
    const [irr] = await db
      .update(irrigation)
      .set(updateData)
      .where(eq(irrigation.id, id))
      .returning();
    return irr || undefined;
  }

  async deleteIrrigation(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(irrigation)
      .where(and(eq(irrigation.id, id), eq(irrigation.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Soil Health methods
  async getUserSoilHealth(userId: string): Promise<SoilHealth | null> {
    const [health] = await db
      .select()
      .from(soilHealth)
      .where(eq(soilHealth.userId, userId))
      .orderBy(desc(soilHealth.updatedAt))
      .limit(1);
    return health || null;
  }

  async createOrUpdateSoilHealth(data: InsertSoilHealth, userId: string): Promise<SoilHealth> {
    // Check if user already has soil health data
    const existing = await this.getUserSoilHealth(userId);
    
    if (existing) {
      // Update existing record
      const [updated] = await db
        .update(soilHealth)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(soilHealth.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new record
      const [created] = await db
        .insert(soilHealth)
        .values({
          ...data,
          userId,
        })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
