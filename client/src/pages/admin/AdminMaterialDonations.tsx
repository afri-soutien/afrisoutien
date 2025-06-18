import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

export default function AdminMaterialDonations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: materialDonations, isLoading } = useQuery({
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

  const allMaterialDonations = Array.isArray(materialDonations) ? materialDonations : [];
  const pendingMaterial = Array.isArray(pendingMaterialDonations) ? pendingMaterialDonations : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-orange-600">Gestion des</span>{" "}
            <span className="text-white">Dons</span>{" "}
            <span className="text-green-600">Matériels</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Modération et validation des demandes de dons matériels
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Total demandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allMaterialDonations.length}
              </div>
              <p className="text-xs text-muted-foreground">Tous statuts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approuvées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allMaterialDonations.filter((d: any) => d.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">Validées</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des dons matériels */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes de Dons Matériels</CardTitle>
            <CardDescription>
              Gérez les demandes de dons matériels soumises par les utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allMaterialDonations.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">Aucune demande</h3>
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{donation.donorName}</h3>
                          <Badge variant={
                            donation.status === 'approved' ? 'default' :
                            donation.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {donation.status === 'approved' ? 'Approuvé' :
                             donation.status === 'pending' ? 'En attente' : 'Rejeté'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {donation.donorEmail} • {donation.donorPhone}
                        </p>
                        <p className="text-sm font-medium">Description: {donation.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Catégorie: </span>
                            <span className="font-medium">{donation.category}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quantité: </span>
                            <span className="font-medium">{donation.quantity}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">État: </span>
                            <span className="font-medium">{donation.condition}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Soumis le: </span>
                            <span className="font-medium">
                              {new Date(donation.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {donation.status === 'pending' && (
                        <>
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
                        </>
                      )}
                      
                      {donation.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMaterialDonationMutation.mutate({ id: donation.id, status: 'rejected' })}
                          disabled={updateMaterialDonationMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      )}
                      
                      {donation.status === 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMaterialDonationMutation.mutate({ id: donation.id, status: 'approved' })}
                          disabled={updateMaterialDonationMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Réapprouver
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline">
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
      </div>
    </AdminLayout>
  );
}