import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { CheckCircle, XCircle, Eye, Download } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

export default function AdminDonations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: donations, isLoading } = useQuery({
    queryKey: ['/api/admin/donations'],
  });

  const { data: materialDonations } = useQuery({
    queryKey: ['/api/admin/material-donations'],
  });

  const { data: pendingMaterialDonations } = useQuery({
    queryKey: ['/api/admin/material-donations/pending'],
  });

  const updateMaterialDonationMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest(`/api/admin/material-donations/${id}`, 'PATCH', { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/material-donations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/material-donations/pending'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du don matériel a été modifié avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut du don matériel.",
      });
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const allDonations = Array.isArray(donations) ? donations : [];
  const allMaterialDonations = Array.isArray(materialDonations) ? materialDonations : [];
  const pendingMaterial = Array.isArray(pendingMaterialDonations) ? pendingMaterialDonations : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-orange-600">Gestion des</span>{" "}
            <span className="text-white">Donations</span>{" "}
            <span className="text-green-600">et Dons</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Suivi des donations financières et matérielles
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dons financiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allDonations.length}
              </div>
              <p className="text-xs text-muted-foreground">Total reçus</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dons matériels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {allMaterialDonations.length}
              </div>
              <p className="text-xs text-muted-foreground">Demandes reçues</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingMaterial.length}
              </div>
              <p className="text-xs text-muted-foreground">À vérifier</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Montant total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allDonations.reduce((sum: number, d: any) => sum + parseInt(d.amount || '0'), 0).toLocaleString()} FCFA
              </div>
              <p className="text-xs text-muted-foreground">Collecté</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="financial" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial">Dons Financiers</TabsTrigger>
            <TabsTrigger value="material">Dons Matériels</TabsTrigger>
            <TabsTrigger value="pending">En Attente</TabsTrigger>
          </TabsList>
          
          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Donations Financières</CardTitle>
                <CardDescription>
                  Historique des donations financières reçues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allDonations.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold">Aucune donation</h3>
                    <p className="text-muted-foreground">
                      Aucune donation financière n'a encore été reçue.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allDonations.map((donation: any) => (
                      <div key={donation.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-4">
                              <span className="font-semibold text-green-600">
                                {parseInt(donation.amount).toLocaleString()} FCFA
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {donation.donorName || 'Anonyme'}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {donation.paymentOperator}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(donation.createdAt).toLocaleDateString('fr-FR')} à {new Date(donation.createdAt).toLocaleTimeString('fr-FR')}
                            </p>
                          </div>
                          <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                            {donation.status === 'completed' ? 'Confirmé' : 'En cours'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="material" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dons Matériels</CardTitle>
                <CardDescription>
                  Gestion des demandes de dons matériels
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allMaterialDonations.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold">Aucun don matériel</h3>
                    <p className="text-muted-foreground">
                      Aucune demande de don matériel n'a encore été soumise.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allMaterialDonations.map((donation: any) => (
                      <div key={donation.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{donation.donorName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {donation.donorEmail} • {donation.donorPhone}
                            </p>
                            <p className="text-sm">{donation.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Catégorie: {donation.category}</span>
                              <span>Quantité: {donation.quantity}</span>
                              <span>État: {donation.condition}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Soumis le: {new Date(donation.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <Badge variant={
                            donation.status === 'approved' ? 'default' :
                            donation.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {donation.status === 'approved' ? 'Approuvé' :
                             donation.status === 'pending' ? 'En attente' : 'Rejeté'}
                          </Badge>
                        </div>
                        
                        {donation.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateMaterialDonationMutation.mutate({ id: donation.id, status: 'approved' })}
                              disabled={updateMaterialDonationMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateMaterialDonationMutation.mutate({ id: donation.id, status: 'rejected' })}
                              disabled={updateMaterialDonationMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dons en Attente d'Approbation</CardTitle>
                <CardDescription>
                  Demandes de dons matériels nécessitant une validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingMaterial.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold">Aucune demande en attente</h3>
                    <p className="text-muted-foreground">
                      Toutes les demandes de dons matériels ont été traitées.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingMaterial.map((donation: any) => (
                      <div key={donation.id} className="border rounded-lg p-4 space-y-3 bg-orange-50">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{donation.donorName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {donation.donorEmail} • {donation.donorPhone}
                            </p>
                            <p className="text-sm">{donation.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Catégorie: {donation.category}</span>
                              <span>Quantité: {donation.quantity}</span>
                              <span>État: {donation.condition}</span>
                            </div>
                          </div>
                          <Badge variant="secondary">En attente</Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateMaterialDonationMutation.mutate({ id: donation.id, status: 'approved' })}
                            disabled={updateMaterialDonationMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateMaterialDonationMutation.mutate({ id: donation.id, status: 'rejected' })}
                            disabled={updateMaterialDonationMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}