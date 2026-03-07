import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6 sm:pt-8">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-xl bg-destructive/10 p-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">404 Page Not Found</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                The page you requested could not be found.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Check the route configuration and try again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
