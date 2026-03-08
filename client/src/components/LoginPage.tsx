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
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiRequest("POST", "/api/login", {
        email: loginEmail,
        password: loginPassword,
      });

      const data = await response.json();
      onLogin(data.user, data.sessionId);
    } catch (err: any) {
      alert("Invalid email or password.");
      console.error("[Login] Failed to sign in", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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
      console.error("[Register] Failed to create account", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Farm Management</h1>
                <p className="text-sm text-muted-foreground">Smart operations from planting to harvest</p>
              </div>
            </div>

            <Card className="surface-card">
              <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>Sign in or create an account to manage your farm from any device.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="mb-5 grid w-full grid-cols-2">
                    <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                    <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email" className="text-foreground">Email Address</Label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                        <div>
                          <Label htmlFor="register-email" className="text-foreground">Email Address</Label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="name" className="text-foreground">Full Name</Label>
                            <div className="relative mt-1">
                              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                              <Leaf className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="contact"
                                type="tel"
                                placeholder="+91 8348293473"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className="pl-10"
                                data-testid="input-contact"
                              />
                            </div>
                          </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading} data-testid="button-register">
                          {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>

        <div className="hidden flex-col justify-center border-l border-primary-border/30 bg-primary px-10 py-12 text-primary-foreground lg:flex">
          <div className="mx-auto w-full max-w-md">
            <Leaf className="mb-6 h-14 w-14" />
            <h2 className="text-4xl font-semibold leading-tight">Complete Farm Management Solution</h2>
            <p className="mt-4 text-sm text-primary-foreground/85">
              A responsive workspace for crop tracking, smart scheduling, inventory visibility, and real-time planning.
            </p>

            <div className="mt-10 space-y-5">
              <div className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-4">
                <h3 className="font-semibold">Track Crops & Harvest</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">Monitor growth stages and harvest timelines in one place.</p>
              </div>
              <div className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-4">
                <h3 className="font-semibold">Equipment Monitoring</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">Keep maintenance schedules and machine readiness visible.</p>
              </div>
              <div className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-4">
                <h3 className="font-semibold">Smart Analytics</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">Use visual trends for inventory, weather, and soil decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
