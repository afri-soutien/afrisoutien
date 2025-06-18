import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  CreditCard,
  Settings,
  Smartphone,
  Building2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Percent,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentOperator {
  id: string;
  name: string;
  type: 'mobile' | 'bank' | 'card';
  status: 'active' | 'inactive' | 'maintenance';
  fees: number;
  currency: string;
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
}

export default function AdminPayments() {
  const [selectedOperator, setSelectedOperator] = useState<PaymentOperator | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // État vide pour production
  const { data: paymentOperators = [], isLoading } = useQuery<PaymentOperator[]>({
    queryKey: ["/api/admin/payments/operators"],
    enabled: false, // Désactivé pour avoir un état vide en production
  });

  const { data: paymentStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/payments/stats"],
    enabled: false, // Désactivé pour avoir un état vide en production
  });

  const updateOperatorMutation = useMutation({
    mutationFn: async (data: Partial<PaymentOperator>) => {
      // Simulation de l'API
      throw new Error("Configuration des paiements en cours de développement");
    },
    onSuccess: () => {
      toast({
        title: "Opérateur mis à jour",
        description: "Configuration sauvegardée avec succès",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive",
      });
    },
  });

  const defaultOperators: PaymentOperator[] = [
    {
      id: "orange-money",
      name: "Orange Money",
      type: "mobile",
      status: "inactive",
      fees: 2.5,
      currency: "FCFA",
      apiKey: "",
      secretKey: "",
      webhookUrl: ""
    },
    {
      id: "mtn-money",
      name: "MTN Money",
      type: "mobile", 
      status: "inactive",
      fees: 2.0,
      currency: "FCFA",
      apiKey: "",
      secretKey: "",
      webhookUrl: ""
    },
    {
      id: "moov-money",
      name: "Moov Money",
      type: "mobile",
      status: "inactive", 
      fees: 2.8,
      currency: "FCFA",
      apiKey: "",
      secretKey: "",
      webhookUrl: ""
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'maintenance':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'bank':
        return <Building2 className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const handleSaveOperator = () => {
    if (selectedOperator) {
      updateOperatorMutation.mutate(selectedOperator);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h1>
            <p className="text-gray-600">Configuration des opérateurs et passerelles</p>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Configuration requise
          </Badge>
        </div>

        <Tabs defaultValue="operators" className="space-y-6">
          <TabsList>
            <TabsTrigger value="operators">Opérateurs</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="operators" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste des opérateurs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Opérateurs de Paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {defaultOperators.map((operator) => (
                        <div
                          key={operator.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedOperator?.id === operator.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedOperator(operator)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(operator.type)}
                              <h3 className="font-medium">{operator.name}</h3>
                            </div>
                            {getStatusIcon(operator.status)}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">
                              Frais: {operator.fees}%
                            </span>
                            <Badge variant={operator.status === 'active' ? 'default' : 'secondary'}>
                              {operator.status === 'active' ? 'Actif' : 
                               operator.status === 'maintenance' ? 'Maintenance' : 'Inactif'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Configuration de l'opérateur */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        {selectedOperator ? `Configuration: ${selectedOperator.name}` : 'Sélectionner un opérateur'}
                      </CardTitle>
                      {selectedOperator && (
                        <Button 
                          size="sm" 
                          disabled={!isEditing || updateOperatorMutation.isPending}
                          onClick={handleSaveOperator}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedOperator ? (
                      <div className="space-y-6">
                        {/* Statut de l'opérateur */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(selectedOperator.status)}
                            <div>
                              <h3 className="font-medium">{selectedOperator.name}</h3>
                              <p className="text-sm text-gray-500">
                                {selectedOperator.type === 'mobile' ? 'Monnaie mobile' : 
                                 selectedOperator.type === 'bank' ? 'Transfert bancaire' : 'Carte bancaire'}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={selectedOperator.status === 'active'}
                            onCheckedChange={(checked) => {
                              setSelectedOperator({
                                ...selectedOperator, 
                                status: checked ? 'active' : 'inactive'
                              });
                              setIsEditing(true);
                            }}
                          />
                        </div>

                        {/* Configuration API */}
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Configuration API
                          </h4>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Clé API</label>
                            <Input
                              type="password"
                              value={selectedOperator.apiKey || ""}
                              onChange={(e) => {
                                setSelectedOperator({...selectedOperator, apiKey: e.target.value});
                                setIsEditing(true);
                              }}
                              placeholder="Clé API de l'opérateur"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Clé secrète</label>
                            <Input
                              type="password"
                              value={selectedOperator.secretKey || ""}
                              onChange={(e) => {
                                setSelectedOperator({...selectedOperator, secretKey: e.target.value});
                                setIsEditing(true);
                              }}
                              placeholder="Clé secrète de l'opérateur"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">URL Webhook</label>
                            <Input
                              value={selectedOperator.webhookUrl || ""}
                              onChange={(e) => {
                                setSelectedOperator({...selectedOperator, webhookUrl: e.target.value});
                                setIsEditing(true);
                              }}
                              placeholder="https://votre-domaine.com/webhook/payments"
                            />
                          </div>
                        </div>

                        {/* Frais et commission */}
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center">
                            <Percent className="w-4 h-4 mr-2" />
                            Frais et Commission
                          </h4>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Frais de transaction (%)
                            </label>
                            <Input
                              type="number"
                              step="0.1"
                              value={selectedOperator.fees}
                              onChange={(e) => {
                                setSelectedOperator({...selectedOperator, fees: parseFloat(e.target.value)});
                                setIsEditing(true);
                              }}
                              placeholder="2.5"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Frais appliqués sur chaque transaction
                            </p>
                          </div>
                        </div>

                        {/* Note d'avertissement */}
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-yellow-800">Configuration requise</h4>
                              <p className="text-sm text-yellow-700 mt-1">
                                Pour activer les paiements, vous devez obtenir les clés API auprès de l'opérateur 
                                et configurer les webhooks pour recevoir les notifications de paiement.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucun opérateur sélectionné</h3>
                        <p className="text-gray-600">
                          Sélectionnez un opérateur dans la liste pour configurer ses paramètres
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">0 FCFA</div>
                      <div className="text-sm text-gray-600">Revenus totaux</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-sm text-gray-600">Transactions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">0%</div>
                      <div className="text-sm text-gray-600">Taux de succès</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transactions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune transaction</h3>
                  <p className="text-gray-600">
                    Les transactions apparaîtront ici une fois les paiements configurés
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Paramètres généraux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Configuration en cours</h3>
                  <p className="text-gray-600">
                    Les paramètres de paiement seront disponibles prochainement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}