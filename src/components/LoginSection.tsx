import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";

export const LoginSection = () => {
  const handleLogin = () => {
    // Login logic will be implemented with backend
    console.log("Login clicked");
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Accedi al tuo account</CardTitle>
              <CardDescription>
                Inserisci le tue credenziali per accedere al tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nome@esempio.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={handleLogin}
                className="w-full" 
                variant="primary"
              >
                Accedi
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Non hai un account? Acquista uno dei piani sopra per iniziare.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};