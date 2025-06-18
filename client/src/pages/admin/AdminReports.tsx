import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Users,
  Heart,
  TrendingUp,
  Download,
  Calendar,
  BarChart3,
  AlertTriangle,
  FileText
} from "lucide-react";

interface FinancialReport {
  totalCollected: number;
  processingFees: number;
  disbursements: number;
  availableBalance: number;
  period: string;
  paymentMethods: Array<{ method: string; amount: number; percentage: number }>;
}

interface UserReport {
  totalUsers: number;
  verificationRate: number;
  roleDistribution: Array<{ role: string; count: number }>;
  weeklyActivity: Array<{ week: string; newUsers: number; activeUsers: number }>;
}

interface CampaignReport {
  totalCampaigns: number;
  successRate: number;
  averageGoalReached: number;
  categoryPerformance: Array<{ category: string; campaigns: number; success: number }>;
  newCampaignsThisMonth: number;
  averageGoal: number;
  activeCampaigns: number;
}

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [reportType, setReportType] = useState("financial");

  const { data: financialReport, loading: financialLoading, error: financialError } = 
    useAdminFetch<FinancialReport>(`/api/admin/reports/financial?period=${selectedPeriod}`);
  
  const { data: userReport, loading: userLoading, error: userError } = 
    useAdminFetch<UserReport>(`/api/admin/reports/users?period=${selectedPeriod}`);
  
  const { data: campaignReport, loading: campaignLoading, error: campaignError } = 
    useAdminFetch<CampaignReport>(`/api/admin/reports/campaigns?period=${selectedPeriod}`);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportReport = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/reports/export/${type}?period=${selectedPeriod}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report-${selectedPeriod}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const isLoading = financialLoading || userLoading || campaignLoading;
  const hasError = financialError || userError || campaignError;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (hasError) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Erreur de chargement des rapports: {financialError || userError || campaignError}
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête avec contrôles */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-orange-500">Rapports</span>{" "}
              <span className="text-white">et</span>{" "}
              <span className="text-green-500">Analytics</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Analyses détaillées et métriques de performance
            </p>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => handleExportReport('comprehensive')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Métriques financières */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total collecté</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(financialReport?.totalCollected || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Période: {financialReport?.period || selectedPeriod}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userReport?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userReport?.verificationRate || 0}% vérifiés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Campagnes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignReport?.totalCampaigns || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {campaignReport?.successRate || 0}% réussies
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Balance disponible</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(financialReport?.availableBalance || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Prêt à distribuer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rapports détaillés */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rapport financier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Rapport Financier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total collecté</span>
                <span className="font-medium">
                  {formatCurrency(financialReport?.totalCollected || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Frais de traitement</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(financialReport?.processingFees || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Versements effectués</span>
                <span className="font-medium">
                  {formatCurrency(financialReport?.disbursements || 0)}
                </span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between items-center font-medium">
                  <span>Balance disponible</span>
                  <span className="text-green-600">
                    {formatCurrency(financialReport?.availableBalance || 0)}
                  </span>
                </div>
              </div>

              {/* Méthodes de paiement */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Méthodes de paiement</h4>
                {financialReport?.paymentMethods?.map((method, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{method.method}</span>
                    <span>{method.percentage}%</span>
                  </div>
                )) || <div className="text-sm text-gray-500">Aucune donnée disponible</div>}
              </div>

              <Button 
                onClick={() => handleExportReport('financial')} 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exporter rapport financier
              </Button>
            </CardContent>
          </Card>

          {/* Rapport utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Rapport Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total utilisateurs</span>
                <span className="font-medium">{userReport?.totalUsers || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Taux de vérification</span>
                <Badge variant="outline">{userReport?.verificationRate || 0}%</Badge>
              </div>

              {/* Distribution des rôles */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Distribution des rôles</h4>
                {userReport?.roleDistribution?.map((role, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="capitalize">{role.role}</span>
                    <span>{role.count}</span>
                  </div>
                )) || <div className="text-sm text-gray-500">Aucune donnée disponible</div>}
              </div>

              {/* Activité hebdomadaire */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Activité récente</h4>
                {userReport?.weeklyActivity?.slice(0, 3).map((week, index) => (
                  <div key={index} className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>{week.week}</span>
                      <span>{week.newUsers} nouveaux</span>
                    </div>
                  </div>
                )) || <div className="text-sm text-gray-500">Aucune donnée disponible</div>}
              </div>

              <Button 
                onClick={() => handleExportReport('users')} 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exporter rapport utilisateurs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Rapport campagnes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Rapport Campagnes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total campagnes</span>
                  <span className="font-medium">{campaignReport?.totalCampaigns || 0}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taux de réussite</span>
                  <Badge variant="outline">{campaignReport?.successRate || 0}%</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Objectif moyen atteint</span>
                  <span className="font-medium">{campaignReport?.averageGoalReached || 0}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Performance par catégorie</h4>
                {campaignReport?.categoryPerformance?.map((cat, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{cat.category}</span>
                    <span>{cat.success}/{cat.campaigns}</span>
                  </div>
                )) || <div className="text-sm text-gray-500">Aucune donnée disponible</div>}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nouvelles ce mois</span>
                  <span className="font-medium">{campaignReport?.newCampaignsThisMonth || 0}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Objectif moyen</span>
                  <span className="font-medium">
                    {formatCurrency(campaignReport?.averageGoal || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Actives actuellement</span>
                  <Badge variant="outline">{campaignReport?.activeCampaigns || 0}</Badge>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                onClick={() => handleExportReport('campaigns')} 
                variant="outline" 
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exporter rapport campagnes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}