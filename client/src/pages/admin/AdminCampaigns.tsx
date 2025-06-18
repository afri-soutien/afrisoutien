import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

export default function AdminCampaigns() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['/api/admin/campaigns'],
  });

  const { data: pendingCampaigns } = useQuery({
    queryKey: ['/api/admin/campaigns/pending'],
  });

  const updateCampaignMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest(`/api/admin/campaigns/${id}/status`, 'PATCH', { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns/pending'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la campagne a été modifié avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut de la campagne.",
      });
    },
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/campaigns/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
      toast({
        title: "Campagne supprimée",
        description: "La campagne a été supprimée avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la campagne.",
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

  const allCampaigns = Array.isArray(campaigns) ? campaigns : [];
  const pending = Array.isArray(pendingCampaigns) ? pendingCampaigns : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-orange-600">Gestion des</span>{" "}
            <span className="text-white">Campagnes</span>{" "}
            <span className="text-green-600">de Financement</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Modération et suivi des campagnes de collecte de fonds
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
                {pending.length}
              </div>
              <p className="text-xs text-muted-foreground">À valider</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total campagnes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allCampaigns.length}
              </div>
              <p className="text-xs text-muted-foreground">Toutes statuts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allCampaigns.filter((c: any) => c.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">En cours</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des campagnes */}
        <Card>
          <CardHeader>
            <CardTitle>Toutes les Campagnes</CardTitle>
            <CardDescription>
              Gérez l'état et la visibilité des campagnes de financement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">Aucune campagne</h3>
                <p className="text-muted-foreground">
                  Aucune campagne n'a encore été créée sur la plateforme.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allCampaigns.map((campaign: any) => (
                  <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {campaign.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Objectif: {parseInt(campaign.goalAmount).toLocaleString()} FCFA</span>
                          <span>Collecté: {parseInt(campaign.currentAmount).toLocaleString()} FCFA</span>
                          <span>Créé le: {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          campaign.status === 'active' ? 'default' :
                          campaign.status === 'pending' ? 'secondary' :
                          campaign.status === 'completed' ? 'outline' : 'destructive'
                        }>
                          {campaign.status === 'active' ? 'Active' :
                           campaign.status === 'pending' ? 'En attente' :
                           campaign.status === 'completed' ? 'Terminée' : 'Suspendue'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {campaign.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateCampaignMutation.mutate({ id: campaign.id, status: 'active' })}
                            disabled={updateCampaignMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateCampaignMutation.mutate({ id: campaign.id, status: 'suspended' })}
                            disabled={updateCampaignMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      
                      {campaign.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCampaignMutation.mutate({ id: campaign.id, status: 'suspended' })}
                          disabled={updateCampaignMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Suspendre
                        </Button>
                      )}
                      
                      {campaign.status === 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCampaignMutation.mutate({ id: campaign.id, status: 'active' })}
                          disabled={updateCampaignMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Réactiver
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCampaignMutation.mutate(campaign.id)}
                        disabled={deleteCampaignMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
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