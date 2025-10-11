import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/components/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import NotFound from "@/pages/not-found";

function App() {
  const [user, setUser] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem("user");
    const storedSessionId = localStorage.getItem("sessionId");
    
    if (storedUser && storedSessionId) {
      setUser(JSON.parse(storedUser));
      setSessionId(storedSessionId);
    }
  }, []);

  const handleLogin = (userData: any, newSessionId: string) => {
    setUser(userData);
    setSessionId(newSessionId);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("sessionId", newSessionId);
  };

  const handleLogout = async () => {
    // Clear session on server
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      try {
        await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${storedSessionId}`,
          },
        });
      } catch (err) {
        console.error("Logout error:", err);
      }
    }

    // Clear local state
    setUser(null);
    setSessionId(null);
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {!user ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <Switch>
            <Route path="/" component={() => <DashboardPage user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />} />
            <Route path="/order-history" component={OrderHistoryPage} />
            <Route component={NotFound} />
          </Switch>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
