import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  Package, 
  ShoppingBag, 
  FileText, 
  CreditCard, 
  Activity,
  LogOut,
  Shield,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Double-barrière de sécurité: vérification frontend
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation("/admin/login");
        return;
      }
      
      if (user?.role !== 'admin') {
        logout();
        setLocation("/admin/login");
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, setLocation, logout]);

  // Affichage loading pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Vérification finale avant affichage
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const menuItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de Bord", badge: null },
    { href: "/admin/users", icon: Users, label: "Utilisateurs", badge: "1" },
    { href: "/admin/campaigns", icon: Heart, label: "Campagnes", badge: null },
    { href: "/admin/donations", icon: Package, label: "Donations", badge: null },
    { href: "/admin/material-donations", icon: ShoppingBag, label: "Dons Matériels", badge: null },
    { href: "/admin/boutique-orders", icon: ShoppingBag, label: "Commandes Boutique", badge: null },
    { href: "/admin/reports", icon: FileText, label: "Rapports", badge: null },
    { href: "/admin/logs", icon: Activity, label: "Logs", badge: null },
    { href: "/admin/content", icon: FileText, label: "Contenu", badge: null },
    { href: "/admin/payments", icon: CreditCard, label: "Paiements", badge: null },
  ];

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Interface admin complètement séparée - pas de header public */}
      <div className="flex">
        {/* Sidebar Admin */}
        <div className="w-64 bg-white shadow-xl min-h-screen">
          {/* Header Admin */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-orange-600">Admin</span>{" "}
                  <span className="text-white bg-green-600 px-2 py-1 rounded">Panel</span>
                </h1>
                <p className="text-sm text-gray-600">Afri Soutien</p>
              </div>
            </div>
          </div>

          {/* Navigation Admin */}
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info et Logout */}
          <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Admin System</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu Principal Admin */}
        <div className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
                <p className="text-gray-600 mt-1">Gestion complète de la plateforme Afri Soutien</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Admin System</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Contenu de la page */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;