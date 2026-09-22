import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import Icon from "@/assets/icon.png";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const Header = () => {
  const { t } = useTranslation();
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

  const getStatusBadge = () => {
    if (!user) return null;

    if (user.status === 'pending') {
      return <Badge variant="outline" className="text-xs">{t('header.statusPending')}</Badge>;
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

    return user.status === 'approved';
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
              <img src={Icon} alt={t('header.logoAlt')} className="h-8 w-8" />
              DAND
            </Button>
            {isAuthenticated && getStatusBadge()}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant={isActivePage("/publications") ? "default" : "ghost"} asChild>
              <a href="/publications">{t('header.publications')}</a>
            </Button>
            <Button variant={isActivePage("/donate") ? "default" : "ghost"} asChild>
              <a href="/donate">{t('header.donate')}</a>
            </Button>
            {isAuthenticated ? (
              <>
                {canAccessQuiz() && (
                  <Button
                    variant={isActivePage("/quiz") ? "default" : "ghost"}
                    onClick={handleQuizClick}
                    className="flex items-center gap-2"
                  >
                    <Calculator className="h-4 w-4" />
                    {t('header.test')}
                  </Button>
                )}

                {isAdmin && (
                  <Button
                    variant={isActivePage("/admin") ? "default" : "ghost"}
                    onClick={handleAdminClick}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    {t('header.admin')}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={isActivePage("/profile") ? "default" : "ghost"}
                      className="flex items-center gap-2 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                    >
                      <User className="h-4 w-4" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="h-4 w-4 mr-2" />
                      {t('header.myProfile')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('header.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <a href="/login">{t('header.login')}</a>
                </Button>
              </div>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher />
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
              <Button variant={isActivePage("/publications") ? "default" : "ghost"} asChild className="w-full justify-start">
                <a href="/publications">{t('header.publications')}</a>
              </Button>
              <Button variant={isActivePage("/donate") ? "default" : "ghost"} asChild className="w-full justify-start">
                <a href="/donate">{t('header.donate')}</a>
              </Button>
              {isAuthenticated ? (
                <>
                  {canAccessQuiz() && (
                    <Button
                      variant={isActivePage("/quiz") ? "default" : "ghost"}
                      onClick={handleQuizClick}
                      className="w-full justify-start"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      {t('header.test')}
                    </Button>
                  )}

                  {isAdmin && (
                    <Button
                      variant={isActivePage("/admin") ? "default" : "ghost"}
                      onClick={handleAdminClick}
                      className="w-full justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {t('header.adminPanel')}
                    </Button>
                  )}

                  <Button
                    variant={isActivePage("/profile") ? "default" : "ghost"}
                    onClick={handleProfileClick}
                    className="w-full justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t('header.myProfile')}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('header.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <a href="/login">{t('header.login')}</a>
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
