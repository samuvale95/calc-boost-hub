import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const TokenExpiredModal: React.FC = () => {
  const { tokenExpired, refreshToken, logout } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshToken();
      if (!success) {
        // If refresh fails, redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      navigate('/login');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Dialog open={tokenExpired} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" hideClose>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Sessione Scaduta
          </DialogTitle>
          <DialogDescription>
            La tua sessione è scaduta per motivi di sicurezza. Puoi provare a rinnovare la sessione o effettuare nuovamente il login.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isRefreshing}
          >
            Effettua Login
          </Button>
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Rinnovando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Rinnova Sessione
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenExpiredModal;
