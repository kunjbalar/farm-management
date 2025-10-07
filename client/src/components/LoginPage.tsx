import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Mail, Lock, User, MapPin, Phone } from "lucide-react";

import { apiRequest } from "@/lib/queryClient";

interface LoginPageProps {
  onLogin: (user: any, sessionId: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [name, setName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest("POST", "/api/login", {
        email: loginEmail,
        password: loginPassword,
      });

      const data = await response.json();
      onLogin(data.user, data.sessionId);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest("POST", "/api/register", {
        email: registerEmail,
        password: registerPassword,
        name,
        farmName,
        farmLocation,
        contact,
      });

      const data = await response.json();
      onLogin(data.user, data.sessionId);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-card flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Farm Management</h1>
              <p className="text-sm text-muted-foreground">Manage your agricultural operations efficiently</p>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm" data-testid="text-error">
                      {error}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        required
                        data-testid="input-login-email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10"
                        required
                        data-testid="input-login-password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading} data-testid="button-login">
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm" data-testid="text-error">
                      {error}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="register-email" className="text-foreground">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10"
                        required
                        data-testid="input-register-email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-password" className="text-foreground">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10"
                        required
                        data-testid="input-register-password"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-foreground">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        data-testid="input-name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="farm-name" className="text-foreground">Farm Name</Label>
                    <div className="relative mt-1">
                      <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="farm-name"
                        type="text"
                        placeholder="Green Valley Farm"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="pl-10"
                        data-testid="input-farm-name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="farm-location" className="text-foreground">Farm Location</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="farm-location"
                        type="text"
                        placeholder="City, State"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                        className="pl-10"
                        data-testid="input-farm-location"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contact" className="text-foreground">Contact Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="contact"
                        type="tel"
                        placeholder="+1 234-567-8900"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="pl-10"
                        data-testid="input-contact"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading} data-testid="button-register">
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="mb-8">
            <Leaf className="w-16 h-16 mb-4" />
            <h2 className="text-4xl font-bold mb-4">Complete Farm Management Solution</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track Crops & Harvest</h3>
                <p className="text-sm text-primary-foreground/80">Monitor crop health, growth stages, and harvest schedules in real-time</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Equipment Monitoring</h3>
                <p className="text-sm text-primary-foreground/80">Keep track of machinery status, fuel levels, and maintenance schedules</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Analytics</h3>
                <p className="text-sm text-primary-foreground/80">Visualize yield data, soil health, and weather patterns for better decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
