import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ArrowLeft } from "lucide-react";

const Login = () => {
  const handleLogin = () => {
    // Login logic will be implemented with backend
    console.log("Login clicked");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Torna alla Home
            </a>
          </Button>
        </div>
        
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
              Non hai un account? <a href="/" className="text-primary hover:underline">Acquista uno dei piani qui</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;