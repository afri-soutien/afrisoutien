import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Download,
  Clock,
  User,
  Globe
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AuditLog {
  id: number;
  timestamp: string;
  userId: number | null;
  userEmail: string | null;
  action: string;
  resource?: string;
  resourceId?: number;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: any;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';
}

export default function AdminLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  const { data: logs = [], loading, error, refetch } = useAdminFetch<AuditLog[]>(
    `/api/admin/logs?level=${levelFilter}&timeRange=${timeRange}&action=${actionFilter}&search=${searchTerm}`
  );

  const { data: logStats, loading: statsLoading } = useAdminFetch<{
    totalLogs: number;
    securityEvents: number;
    errorCount: number;
    warningCount: number;
    recentActivity: number;
  }>('/api/admin/logs/stats');

  const filteredLogs = logs.filter((log: AuditLog) => {
    const matchesSearch = searchTerm === "" || 
      log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    
    return matchesSearch;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <Badge variant="destructive">Erreur</Badge>;
      case 'WARN':
        return <Badge variant="outline" className="text-yellow-600">Attention</Badge>;
      case 'SECURITY':
        return <Badge variant="default" className="bg-red-600">Sécurité</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login')) return <User className="w-4 h-4" />;
    if (action.includes('view')) return <Eye className="w-4 h-4" />;
    if (action.includes('delete')) return <XCircle className="w-4 h-4" />;
    if (action.includes('create')) return <CheckCircle className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  const handleExportLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs/export', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Erreur de chargement des logs: {error}
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-orange-500">Logs</span>{" "}
              <span className="text-white">et</span>{" "}
              <span className="text-green-500">Audit</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Surveillance des activités et sécurité système
            </p>
          </div>
          
          <Button onClick={handleExportLogs} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter logs
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{logStats?.totalLogs || 0}</div>
                  <div className="text-sm text-gray-600">Total événements</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">{logStats?.securityEvents || 0}</div>
                  <div className="text-sm text-gray-600">Alertes sécurité</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">{logStats?.errorCount || 0}</div>
                  <div className="text-sm text-gray-600">Erreurs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{logStats?.recentActivity || 0}</div>
                  <div className="text-sm text-gray-600">Dernière heure</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle>Journal d'audit système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par utilisateur, action ou IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARN">Avertissement</SelectItem>
                  <SelectItem value="ERROR">Erreur</SelectItem>
                  <SelectItem value="SECURITY">Sécurité</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Dernière heure</SelectItem>
                  <SelectItem value="24h">Dernières 24h</SelectItem>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type d'action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  <SelectItem value="login">Connexions</SelectItem>
                  <SelectItem value="view">Consultations</SelectItem>
                  <SelectItem value="create">Créations</SelectItem>
                  <SelectItem value="update">Modifications</SelectItem>
                  <SelectItem value="delete">Suppressions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table des logs */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horodatage</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-gray-500">
                          <Activity className="w-8 h-8 mx-auto mb-2" />
                          <p>Aucun log trouvé</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log: AuditLog) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          {getLevelBadge(log.level || 'INFO')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getActionIcon(log.action)}
                            <span className="text-sm">{log.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.userEmail ? (
                            <div className="text-sm">
                              <div className="font-medium">{log.userEmail}</div>
                              <div className="text-gray-500">ID: {log.userId}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Système</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Globe className="w-3 h-3 text-gray-400" />
                            <span className="font-mono text-xs">{log.ipAddress}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.success ? (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Succès
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" />
                              Échec
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.resource && (
                            <div className="text-xs text-gray-600">
                              {log.resource}
                              {log.resourceId && ` #${log.resourceId}`}
                            </div>
                          )}
                          {log.details && (
                            <div className="text-xs text-gray-500 mt-1">
                              {typeof log.details === 'string' 
                                ? log.details 
                                : JSON.stringify(log.details).substring(0, 50) + '...'}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination info */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <div>
                Affichage de {filteredLogs.length} événement(s)
              </div>
              <div>
                Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}