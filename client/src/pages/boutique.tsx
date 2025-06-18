import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BoutiqueItem from "@/components/boutique-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Package, ShoppingBag, Heart, Star, Gift, Sparkles } from "lucide-react";
import backgroundImage from "@assets/20250611_2246_Bénévoles Préparent Colis_simple_compose_01jxgjpkk0ek8b9rcz86t82fx8_1749820005024.png";

export default function Boutique() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [motivationMessage, setMotivationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Fetch boutique items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/boutique/items", { status: "available", category: categoryFilter !== "all" ? categoryFilter : undefined }],
    queryFn: async () => {
      const params = new URLSearchParams({ status: "available" });
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }
      const response = await fetch(`/api/boutique/items?${params}`);
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    }
  });

  const handleRequestItem = (itemId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour demander un article.",
        variant: "destructive",
      });
      return;
    }

    const item = items.find((i: any) => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setIsRequestModalOpen(true);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/boutique/orders", {
        itemId: selectedItem.id,
        motivationMessage: motivationMessage.trim() || undefined,
      });

      toast({
        title: "Demande envoyée",
        description: "Votre demande a été transmise aux administrateurs pour validation.",
      });

      setIsRequestModalOpen(false);
      setMotivationMessage("");
      setSelectedItem(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter((item: any) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { value: "all", label: "Tout voir", icon: "✨" },
    { value: "Électronique", label: "Électronique", icon: "💻" },
    { value: "Vêtements", label: "Vêtements", icon: "👕" },
    { value: "Mobilier", label: "Mobilier", icon: "🪑" },
    { value: "Éducation", label: "Éducation", icon: "📚" },
    { value: "Jouets", label: "Jouets", icon: "🧸" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero organic-texture">
        <div className="glass border-b backdrop-blur-lg py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h1 className="font-header text-4xl font-bold kinetic-text">Chargement de la boutique...</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-premium pulse-premium">
                <div className="h-48 bg-primary/20 rounded-2xl mb-4"></div>
                <div className="h-6 bg-secondary/20 rounded-xl w-3/4 mb-3"></div>
                <div className="h-4 bg-accent/20 rounded-lg w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero organic-texture">
      {/* Hero Section avec style cartoon artistique */}
      <div className="relative glass border-b backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={backgroundImage} 
            alt="Bénévoles préparant des colis Afri Soutien" 
            className="w-full h-full object-cover opacity-70"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                  <ShoppingBag className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center cartoon-wiggle">
                  <Package className="w-4 h-4 text-primary-foreground" />
                </div>
                <Sparkles className="absolute -bottom-1 -left-1 w-6 h-6 text-accent animate-pulse" />
              </div>
            </div>
            
            <h1 className="font-header text-5xl lg:text-7xl font-black leading-tight">
              <span className="kinetic-text cartoon-text">Boutique</span>
              <br />
              <span className="text-primary animate-glow cartoon-text">Solidaire</span>
            </h1>
            
            <div className="glass rounded-3xl p-8 max-w-4xl mx-auto cartoon-float">
              <p className="text-2xl text-foreground/90 font-medium leading-relaxed">
                <span className="kinetic-text font-bold">Des trésors qui trouvent leur seconde vie</span>
                <br />
                {filteredItems.length} articles soigneusement sélectionnés et vérifiés, 
                prêts à apporter joie et utilité aux familles qui en ont besoin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section avec style cartoon */}
      <div className="glass border-b backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="asymmetric-grid gap-8">
            {/* Search Bar Style Cartoon */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5 icon-3d" />
                <Input
                  placeholder="Rechercher un trésor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12 text-lg cartoon-border"
                />
              </div>
              
              {/* Categories avec style dessin animé */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setCategoryFilter(category.value)}
                    className={`cartoon-button px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover-lift ${
                      categoryFilter === category.value
                        ? 'bg-gradient-primary text-white shadow-lg'
                        : 'glass text-secondary hover:text-primary'
                    }`}
                  >
                    <span className="text-lg mr-2">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content avec Grid Organique */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="glass rounded-3xl p-12 max-w-2xl mx-auto cartoon-float">
              <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-8 icon-3d">
                <Search className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-header text-3xl font-bold text-secondary mb-4 cartoon-text">Aucun trésor trouvé</h3>
              <p className="text-muted-foreground text-lg">
                Essayez de modifier vos critères de recherche ou explorez toutes nos catégories disponibles.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Header avec Style Cartoon */}
            <div className="flex justify-between items-center mb-12">
              <div className="glass rounded-2xl p-6">
                <h2 className="font-header text-3xl font-bold text-secondary mb-2 cartoon-text">
                  {filteredItems.length} trésor{filteredItems.length > 1 ? 's' : ''} découvert{filteredItems.length > 1 ? 's' : ''}
                </h2>
                <p className="text-muted-foreground flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-trust" />
                  Chaque objet a son histoire, chaque don a son impact
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-4">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">2,847</div>
                  <div className="text-sm text-muted-foreground">Objets redistribués</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">1,523</div>
                  <div className="text-sm text-muted-foreground">Familles aidées</div>
                </div>
              </div>
            </div>
            
            {/* Grid Organique des Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map((item: any, index: number) => (
                <div 
                  key={item.id} 
                  className={`hover-lift cartoon-float-delay-${index % 3}`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <BoutiqueItem
                    item={item}
                    onRequest={handleRequestItem}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de Demande avec Style Cartoon */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="glass cartoon-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-header text-2xl text-secondary cartoon-text flex items-center">
              <Gift className="w-6 h-6 mr-3 text-primary" />
              Demander cet article
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-primary mb-4">Article sélectionné</h3>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-secondary rounded-xl flex items-center justify-center">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary">{selectedItem.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedItem.description.substring(0, 100)}...
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      {selectedItem.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <Label htmlFor="motivation" className="text-secondary font-medium">
                  Message de motivation (optionnel)
                </Label>
                <Textarea
                  id="motivation"
                  placeholder="Expliquez pourquoi cet article vous serait utile..."
                  value={motivationMessage}
                  onChange={(e) => setMotivationMessage(e.target.value)}
                  rows={4}
                  className="form-input mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Un message personnel peut aider les administrateurs à prioriser votre demande.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="flex-1 cartoon-button"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 form-button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Envoyer la demande
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}