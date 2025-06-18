import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CampaignCard from "@/components/campaign-card";
import DonationModal from "@/components/donation-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Plus } from "lucide-react";
import { Link } from "wouter";
import volunteersImage from "@assets/20250611_2244_Bénévoles Ivoiriens Solidaires_simple_compose_01jxgjjnytfgfb0ere71jkbq4g_1749820285964.png";

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch campaigns
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  const handleDonate = (campaignId: number) => {
    const campaign = campaigns.find((c: any) => c.id === campaignId);
    if (campaign) {
      setSelectedCampaign(campaign);
      setIsDonationModalOpen(true);
    }
  };

  const handleDonationSubmit = async (donationData: any) => {
    try {
      await apiRequest("POST", "/api/donations/initiate", donationData);
      toast({
        title: "Don initié avec succès",
        description: "Vous recevrez une notification pour confirmer le paiement.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initiation du don.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter((campaign: any) => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "progress":
          const progressA = (parseFloat(a.currentAmount) / parseFloat(a.goalAmount)) * 100;
          const progressB = (parseFloat(b.currentAmount) / parseFloat(b.goalAmount)) * 100;
          return progressB - progressA;
        case "amount":
          return parseFloat(b.currentAmount) - parseFloat(a.currentAmount);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero organic-texture">
        <div className="glass border-b backdrop-blur-lg py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h1 className="font-header text-4xl font-bold kinetic-text">Chargement des campagnes...</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-premium pulse-premium">
                <div className="h-6 bg-primary/20 rounded-xl w-3/4 mb-3"></div>
                <div className="h-4 bg-secondary/20 rounded-lg w-1/2 mb-6"></div>
                <div className="h-24 bg-accent/20 rounded-xl mb-6"></div>
                <div className="h-3 bg-primary/20 rounded-full mb-6"></div>
                <div className="h-12 bg-gradient-primary/20 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero organic-texture">
      {/* Premium Hero Header */}
      <div className="relative glass border-b backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={volunteersImage} 
            alt="Bénévoles ivoiriens solidaires" 
            className="w-full h-full object-cover opacity-70"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            <h1 className="font-header text-5xl lg:text-6xl font-black leading-tight">
              <span className="kinetic-text">Des projets qui</span>
              <br />
              <span className="text-primary animate-glow">changent des vies</span>
            </h1>
            <div className="glass rounded-2xl p-6 max-w-3xl mx-auto">
              <p className="text-xl text-secondary/80 font-medium">
                Ils comptent sur votre générosité pour transformer leur rêve en réalité.
                <br />
                <span className="kinetic-text font-bold">Découvrez les projets qui changent l'Afrique.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters Section Premium */}
      <div className="glass border-b backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="asymmetric-grid items-center gap-8">
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5 icon-3d" />
                <Input
                  placeholder="Rechercher une campagne..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12 text-lg"
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="form-input w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent className="glass border border-primary/20">
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="education">Éducation</SelectItem>
                    <SelectItem value="health">Santé</SelectItem>
                    <SelectItem value="community">Communauté</SelectItem>
                    <SelectItem value="environment">Environnement</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="form-input w-48">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent className="glass border border-secondary/20">
                    <SelectItem value="recent">Plus récentes</SelectItem>
                    <SelectItem value="progress">Progression</SelectItem>
                    <SelectItem value="amount">Montant collecté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isAuthenticated && (
              <div className="text-center lg:text-right">
                <Link to="/dashboard">
                  <Button className="form-button text-lg px-8 py-4">
                    <Plus className="w-5 h-5 mr-3 icon-3d" />
                    Créer une Campagne
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaigns Grid Premium */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass rounded-3xl p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 icon-3d">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-header text-2xl font-bold text-secondary mb-4">Aucune campagne trouvée</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche ou explorez toutes les campagnes disponibles.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="font-header text-3xl font-bold text-secondary mb-2">
                  {filteredCampaigns.length} campagne{filteredCampaigns.length > 1 ? 's' : ''} trouvée{filteredCampaigns.length > 1 ? 's' : ''}
                </h2>
                <p className="text-muted-foreground">
                  Soutenez les causes qui vous tiennent à cœur
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign: any) => (
                <div key={campaign.id} className="hover-lift">
                  <CampaignCard
                    campaign={campaign}
                    onDonate={handleDonate}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        campaign={selectedCampaign}
        onSubmit={handleDonationSubmit}
      />
    </div>
  );
}