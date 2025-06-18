import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminFetch, adminMutate } from "@/hooks/useAdminFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Shield,
  User,
  Search,
  Filter,
  MoreHorizontal,
  Ban,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: allUsers = [], loading, error, refetch } = useAdminFetch<User[]>('/api/admin/users');

  const filteredUsers = allUsers.filter((user: User) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "verified" && user.isVerified) ||
                         (statusFilter === "unverified" && !user.isVerified) ||
                         (statusFilter === "blocked" && user.isBlocked) ||
                         (statusFilter === "active" && !user.isBlocked);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = async (userId: number, action: string) => {
    try {
      switch (action) {
        case 'block':
          await adminMutate(`/api/admin/users/${userId}/block`, 'PUT');
          toast({ title: "Utilisateur bloqué avec succès" });
          break;
        case 'unblock':
          await adminMutate(`/api/admin/users/${userId}/unblock`, 'PUT');
          toast({ title: "Utilisateur débloqué avec succès" });
          break;
        case 'verify':
          await adminMutate(`/api/admin/users/${userId}/verify`, 'PUT');
          toast({ title: "Utilisateur vérifié avec succès" });
          break;
        case 'make-admin':
          await adminMutate(`/api/admin/users/${userId}/role`, 'PUT', { role: 'admin' });
          toast({ title: "Utilisateur promu administrateur" });
          break;
        case 'make-user':
          await adminMutate(`/api/admin/users/${userId}/role`, 'PUT', { role: 'user' });
          toast({ title: "Privilèges administrateur révoqués" });
          break;
        case 'delete':
          if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            await adminMutate(`/api/admin/users/${userId}`, 'DELETE');
            toast({ title: "Utilisateur supprimé avec succès" });
          }
          break;
      }
      refetch();
    } catch (error: any) {
      toast({ 
        title: "Erreur", 
        description: error.message || "Une erreur est survenue",
        variant: "destructive" 
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
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
              Erreur de chargement des utilisateurs: {error}
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{allUsers.length}</div>
                  <div className="text-sm text-gray-600">Total utilisateurs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {allUsers.filter((u: User) => u.isVerified).length}
                  </div>
                  <div className="text-sm text-gray-600">Vérifiés</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="w-8 h-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {allUsers.filter((u: User) => u.role === 'admin').length}
                  </div>
                  <div className="text-sm text-gray-600">Administrateurs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Ban className="w-8 h-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {allUsers.filter((u: User) => u.isBlocked).length}
                  </div>
                  <div className="text-sm text-gray-600">Bloqués</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par email ou nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="user">Utilisateurs</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="verified">Vérifiés</SelectItem>
                  <SelectItem value="unverified">Non vérifiés</SelectItem>
                  <SelectItem value="blocked">Bloqués</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table des utilisateurs */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-gray-500">
                          <Users className="w-8 h-8 mx-auto mb-2" />
                          <p>Aucun utilisateur trouvé</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {user.isVerified && (
                              <Badge variant="outline" className="text-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Vérifié
                              </Badge>
                            )}
                            {user.isBlocked && (
                              <Badge variant="destructive">
                                <Ban className="w-3 h-3 mr-1" />
                                Bloqué
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!user.isVerified && (
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'verify')}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Vérifier
                                </DropdownMenuItem>
                              )}
                              
                              {user.isBlocked ? (
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'unblock')}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Débloquer
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'block')}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Bloquer
                                </DropdownMenuItem>
                              )}
                              
                              {user.role === 'user' ? (
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'make-admin')}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Promouvoir Admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'make-user')}>
                                  <User className="mr-2 h-4 w-4" />
                                  Révoquer Admin
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem 
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}