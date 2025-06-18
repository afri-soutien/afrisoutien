import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { CheckCircle, XCircle, Eye, Package } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

export default function AdminBoutiqueOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/admin/boutique/orders'],
  });

  const { data: pendingOrders } = useQuery({
    queryKey: ['/api/admin/boutique/orders/pending'],
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest(`/api/admin/boutique/orders/${id}`, 'PATCH', { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/boutique/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/boutique/orders/pending'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été modifié avec succès.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut de la commande.",
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

  const allOrders = Array.isArray(orders) ? orders : [];
  const pending = Array.isArray(pendingOrders) ? pendingOrders : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-orange-600">Commandes</span>{" "}
            <span className="text-white">Boutique</span>{" "}
            <span className="text-green-600">Solidaire</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestion des demandes d'articles de la boutique solidaire
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <p className="text-xs text-muted-foreground">À traiter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allOrders.length}
              </div>
              <p className="text-xs text-muted-foreground">Toutes</p>
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
                {allOrders.filter((o: any) => o.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">Validées</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Livrées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {allOrders.filter((o: any) => o.status === 'delivered').length}
              </div>
              <p className="text-xs text-muted-foreground">Terminées</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des commandes */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes d'Articles Boutique</CardTitle>
            <CardDescription>
              Gérez les demandes d'articles de la boutique solidaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">Aucune commande</h3>
                <p className="text-muted-foreground">
                  Aucune demande d'article n'a encore été soumise.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allOrders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Commande #{order.id}</h3>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'approved' ? 'outline' :
                            order.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {order.status === 'delivered' ? 'Livrée' :
                             order.status === 'approved' ? 'Approuvée' :
                             order.status === 'pending' ? 'En attente' : 'Rejetée'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Demandeur: </span>
                            <span className="font-medium">{order.requesterName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Email: </span>
                            <span className="font-medium">{order.requesterEmail}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Téléphone: </span>
                            <span className="font-medium">{order.requesterPhone}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Soumis le: </span>
                            <span className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Motif: </span>
                          <span className="font-medium">{order.requestReason}</span>
                        </div>
                        {order.deliveryAddress && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Adresse: </span>
                            <span className="font-medium">{order.deliveryAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'approved' })}
                            disabled={updateOrderMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'rejected' })}
                            disabled={updateOrderMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'approved' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'delivered' })}
                            disabled={updateOrderMutation.isPending}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Marquer livrée
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'rejected' })}
                            disabled={updateOrderMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Annuler
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'pending' })}
                          disabled={updateOrderMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Réexaminer
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