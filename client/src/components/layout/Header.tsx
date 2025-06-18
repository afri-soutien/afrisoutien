import { Link } from "wouter";
import { Heart, Menu, X, User, ShoppingBag, Sparkles, Globe } from "lucide-react";
import logoPath from "@assets/20250612_1148_Logo Élegant Afri Soutien_simple_compose_01jxhzeefrf9v911w5g3vh7f5p_1749819895837.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Campagnes", href: "/campaigns" },
    { name: "Boutique", href: "/boutique" },
    { name: "À Propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="glass sticky top-0 z-50 organic-texture">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Premium */}
          <Link to="/">
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
              <div className="relative">
                <img 
                  src={logoPath} 
                  alt="Afri Soutien" 
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Premium */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <div className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-all duration-300 cursor-pointer hover:bg-white/50 rounded-xl backdrop-blur-sm relative group">
                  {item.name}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-primary transform -translate-x-1/2 transition-all duration-300 group-hover:w-3/4"></div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions Premium */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button className="btn-neumorphic flex items-center gap-1 xl:gap-2 px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium text-secondary">
                    <User className="w-3 h-3 xl:w-4 xl:h-4 icon-3d" />
                    <span className="hidden xl:inline">{user?.firstName}</span>
                  </Button>
                </Link>
                <Button 
                  onClick={logout}
                  className="px-2 xl:px-4 py-2 text-xs xl:text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                  variant="ghost"
                >
                  <span className="hidden xl:inline">Déconnexion</span>
                  <span className="xl:hidden">Sortie</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className="btn-neumorphic px-3 xl:px-6 py-2 text-xs xl:text-sm font-medium text-secondary">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-primary text-primary-foreground px-3 xl:px-6 py-2 text-xs xl:text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-glow">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
            <Link to="/material-donation">
              <Button className="bg-[#FF8C00] text-primary-foreground hover:bg-[#e67c00] px-3 xl:px-4 py-2 text-xs xl:text-sm">
                <span className="hidden xl:inline">Faire un Don</span>
                <Heart className="w-4 h-4 xl:hidden" />
              </Button>
            </Link>
          </div>

          {/* Tablet Actions */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="btn-neumorphic flex items-center gap-1 px-2 py-2 text-xs font-medium text-secondary">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="btn-neumorphic px-3 py-2 text-xs font-medium text-secondary">
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-3 px-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <span 
                    className="text-gray-700 hover:text-[#00402E] transition-colors cursor-pointer block py-2 px-3 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-200/50 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-sm py-2.5 px-3 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Mon Dashboard
                      </Button>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-sm py-2.5 px-3 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-sm py-2.5 px-3 rounded-lg text-red-600 hover:text-red-700" 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-sm py-2.5 px-3 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Se Connecter
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button 
                        className="w-full bg-gradient-primary text-primary-foreground text-sm py-2.5 px-3 rounded-lg font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        S'inscrire Gratuitement
                      </Button>
                    </Link>
                  </>
                )}
                <Link to="/material-donation">
                  <Button 
                    className="w-full bg-[#FF8C00] text-white hover:bg-[#e67c00] text-sm py-2.5 px-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    Faire un Don
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}