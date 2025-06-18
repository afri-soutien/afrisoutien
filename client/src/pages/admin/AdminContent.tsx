import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FileText, Settings, MessageSquare, Eye, Edit2, Trash2, Save, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SitePage, SiteSetting, ContactMessage } from "@shared/schema";

export default function AdminContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pages");
  const [selectedPage, setSelectedPage] = useState<SitePage | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [editingSettings, setEditingSettings] = useState<{ [key: string]: boolean }>({});

  // Pages
  const { data: pages = [], isLoading: pagesLoading } = useQuery({
    queryKey: ["/api/admin/content/pages"],
  });

  // Settings
  const { data: settings = [], isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/admin/content/settings"],
  });

  // Messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/admin/content/messages"],
  });

  // Page mutations
  const createPageMutation = useMutation({
    mutationFn: (pageData: any) => apiRequest("/api/admin/content/pages", "POST", pageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/pages"] });
      setIsCreatePageOpen(false);
      toast({ title: "Page créée avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" });
    }
  });

  const updatePageMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => 
      apiRequest(`/api/admin/content/pages/${id}`, "PUT", updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/pages"] });
      setSelectedPage(null);
      toast({ title: "Page mise à jour avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    }
  });

  const deletePageMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/content/pages/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/pages"] });
      toast({ title: "Page supprimée avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
  });

  // Settings mutations
  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => 
      apiRequest(`/api/admin/content/settings/${key}`, "PUT", { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/settings"] });
      setEditingSettings({});
      toast({ title: "Paramètre mis à jour avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    }
  });

  // Message mutations
  const updateMessageMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => 
      apiRequest(`/api/admin/content/messages/${id}`, "PUT", updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/messages"] });
      setSelectedMessage(null);
      toast({ title: "Message mis à jour avec succès" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    }
  });

  const handleCreatePage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pageData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      metaDescription: formData.get("metaDescription") as string,
      status: formData.get("status") as string,
    };
    createPageMutation.mutate(pageData);
  };

  const handleUpdatePage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPage) return;
    
    const formData = new FormData(e.currentTarget);
    const updates = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      metaDescription: formData.get("metaDescription") as string,
      status: formData.get("status") as string,
    };
    updatePageMutation.mutate({ id: selectedPage.id, updates });
  };

  const handleUpdateSetting = (key: string, value: string) => {
    updateSettingMutation.mutate({ key, value });
  };

  const handleRespondToMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMessage) return;
    
    const formData = new FormData(e.currentTarget);
    const updates = {
      status: "responded",
      adminResponse: formData.get("response") as string,
    };
    updateMessageMutation.mutate({ id: selectedMessage.id, updates });
  };

  const defaultSettings = [
    { key: "site_title", value: "Afri Soutien", type: "text", description: "Titre principal du site", category: "general" },
    { key: "site_description", value: "Plateforme de solidarité pan-africaine", type: "text", description: "Description du site", category: "general" },
    { key: "contact_email", value: "contact@afrisoutien.com", type: "email", description: "Email de contact principal", category: "contact" },
    { key: "phone_number", value: "+225 XX XX XX XX XX", type: "tel", description: "Numéro de téléphone", category: "contact" },
    { key: "address", value: "Abidjan, Côte d'Ivoire", type: "text", description: "Adresse physique", category: "contact" },
    { key: "donation_goal_default", value: "100000", type: "number", description: "Objectif de don par défaut (FCFA)", category: "donations" },
    { key: "max_file_size", value: "5", type: "number", description: "Taille maximale des fichiers (MB)", category: "uploads" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-orange-500">Gestion</span>{" "}
              <span className="text-white">du</span>{" "}
              <span className="text-green-500">Contenu</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Pages et paramètres du site
            </p>
          </div>
          <Dialog open={isCreatePageOpen} onOpenChange={setIsCreatePageOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle page</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePage} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Titre</label>
                    <Input name="title" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Slug (URL)</label>
                    <Input name="slug" required placeholder="ex: a-propos" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Meta Description</label>
                  <Input name="metaDescription" placeholder="Description pour les moteurs de recherche" />
                </div>
                <div>
                  <label className="text-sm font-medium">Contenu</label>
                  <Textarea name="content" rows={8} required />
                </div>
                <div>
                  <label className="text-sm font-medium">Statut</label>
                  <Select name="status" defaultValue="draft">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreatePageOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={createPageMutation.isPending}>
                    {createPageMutation.isPending ? "Création..." : "Créer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pages" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Pages</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Paramètres</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-4">
            {selectedPage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Modifier la page: {selectedPage.title}</CardTitle>
                    <Button variant="outline" onClick={() => setSelectedPage(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Fermer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePage} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Titre</label>
                        <Input name="title" defaultValue={selectedPage.title} required />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Slug (URL)</label>
                        <Input name="slug" defaultValue={selectedPage.slug} required />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Meta Description</label>
                      <Input name="metaDescription" defaultValue={selectedPage.metaDescription || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contenu</label>
                      <Textarea name="content" rows={12} defaultValue={selectedPage.content} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Statut</label>
                      <Select name="status" defaultValue={selectedPage.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Brouillon</SelectItem>
                          <SelectItem value="published">Publié</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setSelectedPage(null)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={updatePageMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        {updatePageMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Pages du Site
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pagesLoading ? (
                    <div className="text-center py-8">Chargement des pages...</div>
                  ) : pages.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucune page créée</h3>
                      <p className="text-muted-foreground">
                        Commencez par créer votre première page de contenu.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pages.map((page: SitePage) => (
                        <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-medium">{page.title}</h3>
                              <Badge variant={page.status === "published" ? "default" : "secondary"}>
                                {page.status === "published" ? "Publié" : "Brouillon"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">/{page.slug}</p>
                            <p className="text-sm text-muted-foreground">
                              Mis à jour le {new Date(page.updatedAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPage(page)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deletePageMutation.mutate(page.id)}
                              disabled={deletePageMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Paramètres du Site
                </CardTitle>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="text-center py-8">Chargement des paramètres...</div>
                ) : (
                  <div className="space-y-6">
                    {defaultSettings.map((defaultSetting) => {
                      const existingSetting = settings.find((s: SiteSetting) => s.key === defaultSetting.key);
                      const setting = existingSetting || defaultSetting;
                      const isEditing = editingSettings[setting.key];

                      return (
                        <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{setting.description}</h3>
                            <p className="text-sm text-muted-foreground">Clé: {setting.key}</p>
                            {isEditing ? (
                              <div className="mt-2 flex items-center space-x-2">
                                <Input
                                  defaultValue={setting.value}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleUpdateSetting(setting.key, e.currentTarget.value);
                                    } else if (e.key === "Escape") {
                                      setEditingSettings(prev => ({ ...prev, [setting.key]: false }));
                                    }
                                  }}
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    const input = e.currentTarget.parentElement?.querySelector('input');
                                    if (input) {
                                      handleUpdateSetting(setting.key, input.value);
                                    }
                                  }}
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingSettings(prev => ({ ...prev, [setting.key]: false }))}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <p className="mt-1 font-mono text-sm bg-muted p-2 rounded">{setting.value}</p>
                            )}
                          </div>
                          {!isEditing && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSettings(prev => ({ ...prev, [setting.key]: true }))}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Message de: {selectedMessage.senderName}</CardTitle>
                    <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Fermer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nom</label>
                      <p className="mt-1">{selectedMessage.senderName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="mt-1">{selectedMessage.senderEmail}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sujet</label>
                    <p className="mt-1">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <div className="mt-1 p-3 bg-muted rounded-lg">
                      {selectedMessage.message}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reçu le</label>
                    <p className="mt-1">{new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  
                  {selectedMessage.status === "unread" && (
                    <form onSubmit={handleRespondToMessage} className="space-y-4 border-t pt-4">
                      <div>
                        <label className="text-sm font-medium">Votre réponse</label>
                        <Textarea name="response" rows={6} required placeholder="Votre réponse..." />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setSelectedMessage(null)}>
                          Annuler
                        </Button>
                        <Button type="submit" disabled={updateMessageMutation.isPending}>
                          {updateMessageMutation.isPending ? "Envoi..." : "Répondre"}
                        </Button>
                      </div>
                    </form>
                  )}
                  
                  {selectedMessage.adminResponse && (
                    <div className="border-t pt-4">
                      <label className="text-sm font-medium">Votre réponse</label>
                      <div className="mt-1 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        {selectedMessage.adminResponse}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Répondu le {selectedMessage.respondedAt ? new Date(selectedMessage.respondedAt).toLocaleDateString('fr-FR') : ''}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Messages de Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="text-center py-8">Chargement des messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucun message reçu</h3>
                      <p className="text-muted-foreground">
                        Les messages de contact apparaîtront ici.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message: ContactMessage) => (
                        <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-medium">{message.subject}</h3>
                              <Badge variant={message.status === "unread" ? "destructive" : "default"}>
                                {message.status === "unread" ? "Non lu" : "Traité"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              De: {message.senderName} ({message.senderEmail})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}