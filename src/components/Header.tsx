import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  LogOut, 
  Settings, 
  Calculator,
  FileText,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate("/admin");
    setIsMobileMenuOpen(false);
  };

  const handleQuizClick = () => {
    navigate("/quiz");
    setIsMobileMenuOpen(false);
  };

  const getSubscriptionBadge = () => {
    if (!user) return null;
    
    if (user.subscription === 'pdf') {
      return <Badge variant="outline" className="text-xs">PDF</Badge>;
    } else if (user.subscription === 'annuale') {
      return <Badge variant="default" className="text-xs hover:bg-primary">Annual</Badge>; // override effetto hover
    }
    return null;
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  const canAccessQuiz = () => {
    if (!user) return false;
    
    // Admin can always access
    if (isAdmin) return true;
    
    // Check if user has annual subscription and it's active
    const now = new Date();
    const expiryDate = user.subscription_expiry_date ? new Date(user.subscription_expiry_date) : null;
    const isSubscriptionActive = expiryDate ? expiryDate > now : false;
    
    return user.subscription === 'annuale' && isSubscriptionActive;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-lg font-bold p-0 h-auto hover:bg-transparent hover:text-inherit" // tolto effetto hover
              onClick={() => navigate("/")}
            >
              D-DAND
            </Button>
            {isAuthenticated && getSubscriptionBadge()}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {canAccessQuiz() && (
                  <Button
                    variant={isActivePage("/quiz") ? "default" : "ghost"}
                    onClick={handleQuizClick}
                    className="flex items-center gap-2"
                  >
                    <Calculator className="h-4 w-4" />
                    Tool
                  </Button>
                )}
                
                {isAdmin && (
                  <Button
                    variant={isActivePage("/admin") ? "default" : "ghost"}
                    onClick={handleAdminClick}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={isActivePage("/profile") ? "default" : "ghost"} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="h-4 w-4 mr-2" />
                      Il Mio Profilo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Esci
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <a href="/login">Accedi</a>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  {canAccessQuiz() && (
                    <Button
                      variant={isActivePage("/quiz") ? "default" : "ghost"}
                      onClick={handleQuizClick}
                      className="w-full justify-start"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Tool Interattivo
                    </Button>
                  )}
                  
                  {isAdmin && (
                    <Button
                      variant={isActivePage("/admin") ? "default" : "ghost"}
                      onClick={handleAdminClick}
                      className="w-full justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Pannello Admin
                    </Button>
                  )}

                  <Button
                    variant={isActivePage("/profile") ? "default" : "ghost"}
                    onClick={handleProfileClick}
                    className="w-full justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Il Mio Profilo
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Esci
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <a href="/login">Accedi</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
