import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerSchema, loginSchema, insertUserSchema, insertOrderSchema, insertInventorySchema } from "@shared/schema";

// Simple in-memory session store
const sessions = new Map<string, string>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Register a new user
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user (password should be hashed in production)
      const user = await storage.createUser(validatedData);
      
      // Create session
      const sessionId = Math.random().toString(36).substring(7);
      sessions.set(sessionId, user.id);
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, sessionId });
    } catch (error) {
      res.status(400).json({ error: "Invalid registration data" });
    }
  });

  // Login
  app.post("/api/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create session
      const sessionId = Math.random().toString(36).substring(7);
      sessions.set(sessionId, user.id);
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, sessionId });
    } catch (error) {
      res.status(400).json({ error: "Invalid login data" });
    }
  });

  // Logout
  app.post("/api/logout", (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ success: true });
  });

  // Get current user
  app.get("/api/user", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Update user profile
  app.put("/api/user", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      // Validate only the fields that can be updated (excluding email and password for now)
      const updateData = insertUserSchema.partial().parse(req.body);
      
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Create a new order
  app.post("/api/orders", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    console.log("[ORDER] Request received. SessionId:", sessionId ? "present" : "missing");
    
    if (!sessionId) {
      console.log("[ORDER] Error: No sessionId in Authorization header");
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    console.log("[ORDER] UserId from session:", userId || "not found");
    
    if (!userId) {
      console.log("[ORDER] Error: Invalid or expired session");
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      console.log("[ORDER] Request body:", JSON.stringify(req.body, null, 2));
      
      const validatedOrderData = insertOrderSchema.parse(req.body);
      console.log("[ORDER] Creating order with userId:", userId);
      
      const order = await storage.createOrder(validatedOrderData.orderDetails, userId);
      console.log("[ORDER] Order created successfully:", order.orderId);
      
      // Also add to inventory if we have structured data
      if (req.body.name && req.body.status) {
        const inventoryData = {
          name: req.body.name,
          quantity: req.body.quantity || "",
          status: req.body.status,
        };
        console.log("[ORDER] Adding to inventory:", inventoryData);
        
        const validatedInventoryData = insertInventorySchema.parse(inventoryData);
        await storage.createInventoryItem(validatedInventoryData, userId);
        console.log("[ORDER] Inventory item added successfully");
      }
      
      console.log("[ORDER] Request completed successfully");
      res.json(order);
    } catch (error) {
      console.error("[ORDER] Error creating order:", error);
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  // Get all orders for the current user
  app.get("/api/orders", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get all inventory items for the current user
  app.get("/api/inventory", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const inventoryItems = await storage.getUserInventory(userId);
      res.json(inventoryItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
