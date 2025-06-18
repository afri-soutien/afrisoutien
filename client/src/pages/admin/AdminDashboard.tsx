import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Heart,
  Package,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingBag
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalCampaigns: number;
  totalDonations: number;
  totalAmount: string;
  activeCampaigns: number;
  pendingCampaigns: number;
  recentUsers: number;
  recentDonations: number;
  pendingOrders: number;
  materialDonations: number;
}

export default function AdminDashboard() {
  const { data: stats, loading: isLoading, error: statsError } = useAdminFetch<AdminStats>('/api/admin/stats');
  const { data: recentActivity, loading: activityLoading, error: activityError } = useAdminFetch<any[]>('/api/admin/recent-activity');

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const getGrowthIndicator = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(growth).toFixed(1),
      isPositive: growth > 0,
      icon: growth > 0 ? TrendingUp : TrendingDown,
      color: growth > 0 ? "text-green-600" : "text-red-600"
    };
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 lg:col-span-2" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (statsError) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Erreur de chargement des statistiques: {statsError}
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Utilisateurs totaux */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +{stats?.recentUsers || 0} cette semaine
              </div>
            </CardContent>
          </Card>

          {/* Campagnes totales */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campagnes totales</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCampaigns || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Activity className="h-3 w-3 mr-1 text-blue-600" />
                {stats?.activeCampaigns || 0} actives
              </div>
            </CardContent>
          </Card>

          {/* Montant total collecté */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total collecté</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(stats?.totalAmount || 0)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +{stats?.recentDonations || 0} dons récents
              </div>
            </CardContent>
          </Card>

          {/* Donations totales */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donations totales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalDonations || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Package className="h-3 w-3 mr-1 text-purple-600" />
                +{stats?.materialDonations || 0} matériels
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertes et actions requises */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actions en attente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Actions requises
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.pendingCampaigns > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">Campagnes à approuver</span>
                  </div>
                  <Badge variant="secondary">{stats.pendingCampaigns}</Badge>
                </div>
              )}
              
              {stats?.pendingOrders > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Commandes boutique</span>
                  </div>
                  <Badge variant="secondary">{stats.pendingOrders}</Badge>
                </div>
              )}

              {(!stats?.pendingCampaigns && !stats?.pendingOrders) && (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Aucune action requise</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activité récente */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity && Array.isArray(recentActivity) ? (
                  recentActivity.slice(0, 5).map((activity: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Aucune activité récente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance et tendances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Taux de succès des campagnes */}
          <Card>
            <CardHeader>
              <CardTitle>Performance des campagnes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taux de réussite</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Objectif moyen atteint</span>
                  <span>73%</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Engagement communautaire</span>
                  <span>91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Méthodes de paiement */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des paiements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Orange Money</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={65} className="w-20 h-2" />
                    <span className="text-xs text-gray-600">65%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">MTN Money</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={25} className="w-20 h-2" />
                    <span className="text-xs text-gray-600">25%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Moov Money</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={10} className="w-20 h-2" />
                    <span className="text-xs text-gray-600">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Surveillance en temps réel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Surveillance système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600">Disponibilité</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">45ms</div>
                <div className="text-sm text-gray-600">Temps de réponse</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1,247</div>
                <div className="text-sm text-gray-600">Utilisateurs actifs</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Erreurs critiques</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}