import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lock, CreditCard, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireSubscription = false }) => {
  const { isAuthenticated, loading, user, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Caricamento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check subscription requirements
  if (requireSubscription && user) {
    const now = new Date();
    const expiryDate = user.subscription_expiry_date ? new Date(user.subscription_expiry_date) : null;
    const isSubscriptionActive = expiryDate ? expiryDate > now : false;
    
    // Admin can always access
    if (isAdmin) {
      return <>{children}</>;
    }
    
    // Check if user has annual subscription and it's active
    if (user.subscription !== 'annuale' || !isSubscriptionActive) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center py-8">
          <div className="container mx-auto px-4 max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Accesso Limitato</CardTitle>
                <CardDescription>
                  Questa sezione è disponibile solo per gli abbonati annuali
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={user.subscription === 'annuale' ? 'destructive' : 'outline'}>
                      {user.subscription === 'annuale' ? 'Abbonamento Scaduto' : 'Abbonamento PDF'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.subscription === 'annuale' 
                      ? 'Il tuo abbonamento annuale è scaduto. Rinnova per continuare ad accedere al test interattivo.'
                      : 'Hai un abbonamento PDF. Per accedere al test interattivo, scegli il piano annuale.'
                    }
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <a href="/profile">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Gestisci Abbonamento
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <a href="/#pricing">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Vedi Piani Disponibili
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
