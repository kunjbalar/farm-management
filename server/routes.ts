import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerSchema, loginSchema, insertUserSchema, insertOrderSchema, insertInventorySchema, insertCropSchema, insertEquipmentSchema, insertIrrigationSchema, insertSoilHealthSchema } from "@shared/schema";

// Simple in-memory session store
const sessions = new Map<string, string>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Register a new user
  app.post("/api/register", async (req, res) => {
    try {
      console.log("[REGISTER] Received data:", JSON.stringify(req.body, null, 2));
      const validatedData = registerSchema.parse(req.body);
      console.log("[REGISTER] Validation passed:", validatedData);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        console.log("[REGISTER] User already exists:", validatedData.email);
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user (password should be hashed in production)
      const user = await storage.createUser(validatedData);
      console.log("[REGISTER] User created successfully:", user.id);
      
      // Create session
      const sessionId = Math.random().toString(36).substring(7);
      sessions.set(sessionId, user.id);
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, sessionId });
    } catch (error) {
      console.error("[REGISTER] Validation error:", error);
      if (error instanceof Error) {
        console.error("[REGISTER] Error details:", error.message);
      }
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

  // Delete an inventory item
  app.delete("/api/inventory/:id", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const inventoryId = parseInt(req.params.id);
      const deleted = await storage.deleteInventoryItem(inventoryId, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("[INVENTORY] Error deleting inventory item:", error);
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  });

  // Delete an order
  app.delete("/api/orders/:id", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const orderId = parseInt(req.params.id);
      const deleted = await storage.deleteOrder(orderId, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("[ORDER] Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // ========== CROPS ENDPOINTS ==========
  
  // Create a new crop
  app.post("/api/crops", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const validatedCropData = insertCropSchema.parse(req.body);
      const crop = await storage.createCrop(validatedCropData, userId);
      res.json(crop);
    } catch (error) {
      console.error("[CROPS] Error creating crop:", error);
      res.status(400).json({ error: "Invalid crop data" });
    }
  });

  // Get all crops for the current user
  app.get("/api/crops", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const crops = await storage.getUserCrops(userId);
      res.json(crops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch crops" });
    }
  });

  // Update a crop
  app.put("/api/crops/:id", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const cropId = parseInt(req.params.id);
      const updates = insertCropSchema.partial().parse(req.body);
      const updatedCrop = await storage.updateCrop(cropId, updates);
      
      if (!updatedCrop) {
        return res.status(404).json({ error: "Crop not found" });
      }
      
      res.json(updatedCrop);
    } catch (error) {
      console.error("[CROPS] Error updating crop:", error);
      res.status(400).json({ error: "Invalid crop data" });
    }
  });

  // Delete a crop
  app.delete("/api/crops/:id", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const cropId = parseInt(req.params.id);
      const deleted = await storage.deleteCrop(cropId, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Crop not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("[CROPS] Error deleting crop:", error);
      res.status(500).json({ error: "Failed to delete crop" });
    }
  });

  // ========== EQUIPMENT ENDPOINTS ==========
  
  // Create new equipment
  app.post("/api/equipment", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const validatedEquipmentData = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(validatedEquipmentData, userId);
      res.json(equipment);
    } catch (error) {
      console.error("[EQUIPMENT] Error creating equipment:", error);
      res.status(400).json({ error: "Invalid equipment data" });
    }
  });

  // Get all equipment for the current user
  app.get("/api/equipment", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const equipment = await storage.getUserEquipment(userId);
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipment" });
    }
  });

  // Update equipment
  app.put("/api/equipment/:id", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const equipmentId = parseInt(req.params.id);
      const updates = insertEquipmentSchema.partial().parse(req.body);
      const updatedEquipment = await storage.updateEquipment(equipmentId, updates);
      
      if (!updatedEquipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      
      res.json(updatedEquipment);
    } catch (error) {
      console.error("[EQUIPMENT] Error updating equipment:", error);
      res.status(400).json({ error: "Invalid equipment data" });
    }
  });

  // Delete equipment
  app.delete("/api/equipment/:id", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const equipmentId = parseInt(req.params.id);
      const deleted = await storage.deleteEquipment(equipmentId, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("[EQUIPMENT] Error deleting equipment:", error);
      res.status(500).json({ error: "Failed to delete equipment" });
    }
  });

  // ========== IRRIGATION ENDPOINTS ==========
  
  // Create new irrigation schedule
  app.post("/api/irrigation", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const validatedIrrigationData = insertIrrigationSchema.parse(req.body);
      const irrigation = await storage.createIrrigation(validatedIrrigationData, userId);
      res.json(irrigation);
    } catch (error) {
      console.error("[IRRIGATION] Error creating irrigation:", error);
      res.status(400).json({ error: "Invalid irrigation data" });
    }
  });

  // Get all irrigation schedules for the current user
  app.get("/api/irrigation", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const irrigations = await storage.getUserIrrigations(userId);
      res.json(irrigations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch irrigation schedules" });
    }
  });

  // Update irrigation schedule
  app.put("/api/irrigation/:id", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const irrigationId = parseInt(req.params.id);
      const updates = insertIrrigationSchema.partial().parse(req.body);
      const updatedIrrigation = await storage.updateIrrigation(irrigationId, updates);
      
      if (!updatedIrrigation) {
        return res.status(404).json({ error: "Irrigation schedule not found" });
      }
      
      res.json(updatedIrrigation);
    } catch (error) {
      console.error("[IRRIGATION] Error updating irrigation:", error);
      res.status(400).json({ error: "Invalid irrigation data" });
    }
  });

  // Delete irrigation schedule
  app.delete("/api/irrigation/:id", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const irrigationId = parseInt(req.params.id);
      const deleted = await storage.deleteIrrigation(irrigationId, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Irrigation schedule not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("[IRRIGATION] Error deleting irrigation:", error);
      res.status(500).json({ error: "Failed to delete irrigation schedule" });
    }
  });

  // ========== SOIL HEALTH ENDPOINTS ==========
  
  // Get soil health data for the current user
  app.get("/api/soil-health", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const soilHealth = await storage.getUserSoilHealth(userId);
      res.json(soilHealth);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch soil health data" });
    }
  });

  // Create or update soil health data
  app.post("/api/soil-health", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      const validatedSoilHealthData = insertSoilHealthSchema.parse(req.body);
      const soilHealth = await storage.createOrUpdateSoilHealth(validatedSoilHealthData, userId);
      res.json(soilHealth);
    } catch (error) {
      console.error("[SOIL HEALTH] Error saving soil health data:", error);
      res.status(400).json({ error: "Invalid soil health data" });
    }
  });

  // ========== WEATHER ENDPOINT ==========
  
  // Helper function to generate random weather data
  const generateRandomWeather = (location: string) => {
    const conditions = [
      { name: "Clear sky", icon: "01d" },
      { name: "Few clouds", icon: "02d" },
      { name: "Scattered clouds", icon: "03d" },
      { name: "Partly cloudy", icon: "04d" },
      { name: "Light rain", icon: "10d" },
      { name: "Sunny", icon: "01d" }
    ];
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 20) + 15; // 15-35°C
    const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
    const windSpeed = Math.floor(Math.random() * 25) + 5; // 5-30 km/h
    
    const forecast = [];
    const now = new Date();
    for (let i = 1; i <= 5; i++) {
      const time = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
      const tempVariation = temp + Math.floor(Math.random() * 5) - 2;
      forecast.push({
        time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: `${tempVariation}°C`
      });
    }
    
    return {
      temperature: `${temp}°C`,
      condition: condition.name,
      humidity: `${humidity}%`,
      wind: `${windSpeed} km/h`,
      forecast: forecast,
      location: location,
      icon: condition.icon
    };
  };
  
  // Helper to ensure forecast always has data
  const ensureForecastData = (forecast: any[], baseTemp: number) => {
    if (forecast && forecast.length > 0) {
      return forecast;
    }
    
    // Generate default forecast if none exists
    const defaultForecast = [];
    const now = new Date();
    for (let i = 1; i <= 5; i++) {
      const time = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
      defaultForecast.push({
        time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: `${baseTemp + Math.floor(Math.random() * 4) - 2}°C`
      });
    }
    return defaultForecast;
  };
  
  // Get weather data for Rajkot, Gujarat, India
  app.get("/api/weather", async (req, res) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "");
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return res.status(401).json({ error: "Invalid session" });
    }

    try {
      // Use Rajkot as the city (Gujarat, India)
      const city = process.env.WEATHER_CITY || "Rajkot,IN";
      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      if (!apiKey || apiKey === "demo") {
        console.log("[WEATHER] No API key configured, using fallback data");
        return res.json(generateRandomWeather("Rajkot"));
      }
      
      // Try to fetch real weather data from OpenWeatherMap
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        console.log(`[WEATHER] Fetching weather for ${city}`);
        const weatherResponse = await fetch(weatherUrl);
        
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          const baseTemp = Math.round(weatherData.main.temp);
          console.log(`[WEATHER] Successfully fetched weather data: ${baseTemp}°C, ${weatherData.weather[0].description}`);

          // Fetch hourly forecast (5 entries for next hours)
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&cnt=5`;
          const forecastResponse = await fetch(forecastUrl);
          
          let forecast = [];
          if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            forecast = forecastData.list.map((item: any) => ({
              time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
              temp: `${Math.round(item.main.temp)}°C`
            }));
            console.log(`[WEATHER] Successfully fetched forecast with ${forecast.length} entries`);
          } else {
            console.log(`[WEATHER] Forecast fetch failed with status ${forecastResponse.status}`);
          }
          
          // Ensure forecast always has data
          forecast = ensureForecastData(forecast, baseTemp);

          return res.json({
            temperature: `${baseTemp}°C`,
            condition: weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1),
            humidity: `${weatherData.main.humidity}%`,
            wind: `${Math.round(weatherData.wind.speed * 3.6)} km/h`,
            forecast: forecast,
            location: "Rajkot, Gujarat",
            icon: weatherData.weather[0].icon
          });
        } else {
          const errorText = await weatherResponse.text();
          console.log(`[WEATHER] Weather API returned status ${weatherResponse.status}: ${errorText}`);
        }
      } catch (apiError) {
        console.error("[WEATHER] API fetch failed:", apiError);
      }
      
      // Fallback to random weather data
      console.log("[WEATHER] Using fallback random weather data for Rajkot");
      return res.json(generateRandomWeather("Rajkot"));
      
    } catch (error) {
      console.error("[WEATHER] Error in weather endpoint:", error);
      // Even on error, return fallback weather
      return res.json(generateRandomWeather("Rajkot"));
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
