import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lock, ClipboardEdit, Clock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Requires an approved (registered) account — DAND Scale plan, point 5: calculator/downloads are registration-gated, not subscription-gated. */
  requireApproval?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireApproval = false }) => {
  const { t } = useTranslation();
  const { isAuthenticated, loading, user, isAdmin, profileComplete } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  if (!profileComplete) {
    return <Navigate to="/finish-signin" state={{ from: location }} replace />;
  }

  if (requireApproval && user?.status !== 'approved') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                {user?.status === 'rejected' ? (
                  <Lock className="h-8 w-8 text-orange-600" />
                ) : (
                  <Clock className="h-8 w-8 text-orange-600" />
                )}
              </div>
              <CardTitle className="text-xl">
                {user?.status === 'rejected' ? t('protectedRoute.rejectedTitle') : t('protectedRoute.pendingTitle')}
              </CardTitle>
              <CardDescription>
                {user?.status === 'rejected' ? t('protectedRoute.rejectedDescription') : t('protectedRoute.pendingDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    {user?.status === 'rejected' ? t('protectedRoute.rejectedBadge') : t('protectedRoute.pendingBadge')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user?.status === 'rejected' ? t('protectedRoute.rejectedNote') : t('protectedRoute.pendingNote')}
                </p>
              </div>
              <Button asChild className="w-full">
                <a href="/profile">
                  <ClipboardEdit className="h-4 w-4 mr-2" />
                  {t('protectedRoute.goToProfile')}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
