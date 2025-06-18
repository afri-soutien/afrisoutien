import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import CampaignCard from "@/components/campaign-card";
import BoutiqueItem from "@/components/boutique-item";
import { Button } from "@/components/ui/button";
import { Heart, Users, TrendingUp, Package, ArrowRight, Star, Sparkles, Gift, Target, Zap } from "lucide-react";
import communityImage from "@assets/20250611_2012_African Community Unity_simple_compose_01jxg9v313f2ascpy224ydkm6d_1749820209295.png";
import afriSoutienBoxImage from "@assets/20250611_2249_Générosité Ivoirienne_simple_compose_01jxgjvywkf8ntj08tk2x937mf_1749821013023.png";

export default function Home() {
  const { data: campaigns = [] } = useQuery({
    queryKey: ["/api/campaigns", { status: "active", limit: 4 }],
    queryFn: async () => {
      const response = await fetch("/api/campaigns?status=active&limit=4");
      if (!response.ok) throw new Error("Failed to fetch campaigns");
      return response.json();
    }
  });

  const { data: boutiqueItems = [] } = useQuery({
    queryKey: ["/api/boutique/items", { status: "available", limit: 4 }],
    queryFn: async () => {
      const response = await fetch("/api/boutique/items?status=available&limit=4");
      if (!response.ok) throw new Error("Failed to fetch boutique items");
      return response.json();
    }
  });

  const stats = [
    { 
      icon: Heart, 
      value: "2,847", 
      label: "Vies transformées",
      color: "text-trust",
      bgColor: "bg-trust/10",
      description: "Personnes aidées directement"
    },
    { 
      icon: Package, 
      value: "1,523", 
      label: "Objets redistribués", 
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Articles donnés une seconde vie"
    },
    { 
      icon: TrendingUp, 
      value: "58,671,000 FCFA", 
      label: "Collectés ensemble",
      color: "text-secondary",
      bgColor: "bg-secondary/10", 
      description: "Montant total des dons"
    },
    { 
      icon: Users, 
      value: "892", 
      label: "Donateurs actifs",
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Communauté engagée"
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Campagnes Solidaires",
      description: "Soutenez des projets qui transforment des vies en Afrique",
      link: "/campaigns",
      color: "primary"
    },
    {
      icon: Gift,
      title: "Dons Matériels", 
      description: "Donnez une seconde vie à vos objets",
      link: "/material-donation",
      color: "secondary"
    },
    {
      icon: Package,
      title: "Boutique Solidaire",
      description: "Trouvez des trésors pour votre famille",
      link: "/boutique", 
      color: "accent"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero organic-texture">
      {/* Hero Section Mobile-First */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={afriSoutienBoxImage} 
            alt="Femme avec colis Afri Soutien" 
            className="w-full h-full object-cover opacity-70"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        </div>
        
        {/* Image responsive height */}
        <div className="h-[60vh] sm:h-[70vh] lg:h-screen"></div>
      </section>

      {/* Section principale responsive */}
      <section className="relative py-8 sm:py-12 lg:py-20 xl:py-32 bg-gradient-to-br from-background via-muted to-background">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="text-center space-y-6 sm:space-y-8 lg:space-y-12">
            {/* Titre principal mobile-optimized */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto cartoon-float">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-foreground font-medium leading-relaxed">
                  <span className="kinetic-text font-bold cartoon-text text-green-600">La solidarité panafricaine</span>
                  <br />
                  <span className="text-primary">qui transforme des vies</span>
                </p>
                <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mt-3 sm:mt-4 lg:mt-6 max-w-3xl mx-auto">
                  Ensemble, créons des vagues de solidarité à travers l'Afrique. 
                  Chaque geste compte, chaque don a un impact.
                </p>
              </div>
            </div>

            {/* Actions principales mobile-first */}
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 justify-center items-center px-2">
              <Link href="/campaigns">
                <Button className="form-button text-sm sm:text-base lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 cartoon-button w-full sm:w-auto min-w-[280px]">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" />
                  Découvrir les campagnes
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3" />
                </Button>
              </Link>
              <Link href="/material-donation">
                <Button variant="outline" className="cartoon-button text-sm sm:text-base lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 glass border-2 border-secondary text-secondary hover:bg-secondary hover:text-white w-full sm:w-auto min-w-[280px]">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" />
                  Faire un don
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Mobile-Optimized */}
      <section className="glass border-y backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="font-header text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-3 sm:mb-4 lg:mb-6 cartoon-text">
              Notre impact ensemble
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Chaque chiffre raconte une histoire de solidarité et d'espoir
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className={`card-premium text-center cartoon-float-delay-${index % 3} p-4 sm:p-6`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 ${stat.bgColor} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 icon-3d`}>
                  <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${stat.color}`} />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black ${stat.color} cartoon-text break-words`}>
                    {stat.value}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-secondary">{stat.label}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section Mobile-Optimized */}
      <section className="py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="font-header text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-3 sm:mb-4 lg:mb-6 cartoon-text">
              Comment nous aidons
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Trois façons simples de participer à la solidarité panafricaine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <Link 
                key={feature.title} 
                href={feature.link}
                className={`group hover-lift cartoon-float-delay-${index % 3} block`}
              >
                <div className="card-premium text-center h-full p-4 sm:p-6 lg:p-8">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-${feature.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 icon-3d group-hover:cartoon-bounce`}>
                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <h3 className="font-header text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-3 sm:mb-4 cartoon-text">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-center text-primary font-semibold group-hover:text-secondary transition-colors text-sm sm:text-base">
                    En savoir plus
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns Section Mobile-Optimized */}
      <section className="glass border-y backdrop-blur-lg py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 lg:mb-12 gap-4">
            <div>
              <h2 className="font-header text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-2 sm:mb-3 lg:mb-4 cartoon-text">
                Campagnes en cours
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
                Soutenez des projets qui changent des vies
              </p>
            </div>
            <Link href="/campaigns">
              <Button className="cartoon-button px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-gradient-primary text-white rounded-xl lg:rounded-2xl font-semibold text-sm sm:text-base w-full sm:w-auto">
                <span className="hidden sm:inline">Voir toutes les campagnes</span>
                <span className="sm:hidden">Toutes les campagnes</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {campaigns && campaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {campaigns.map((campaign: any, index: number) => (
                <div 
                  key={campaign.id} 
                  className={`hover-lift cartoon-float-delay-${index % 3}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CampaignCard 
                    campaign={campaign} 
                    showDonateButton={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center cartoon-float">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 icon-3d">
                <Target className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
              </div>
              <h3 className="font-header text-xl sm:text-2xl lg:text-3xl font-bold text-secondary mb-3 sm:mb-4 cartoon-text">
                Nouvelles campagnes bientôt
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                Nous préparons de nouveaux projets solidaires. Restez connectés !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Boutique Section Mobile-Optimized */}
      <section className="py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 lg:mb-12 gap-4">
            <div>
              <h2 className="font-header text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary mb-2 sm:mb-3 lg:mb-4 cartoon-text">
                Boutique solidaire
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
                Des trésors qui trouvent leur seconde vie
              </p>
            </div>
            <Link href="/boutique">
              <Button className="cartoon-button px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-gradient-secondary text-white rounded-xl lg:rounded-2xl font-semibold text-sm sm:text-base w-full sm:w-auto">
                <span className="hidden sm:inline">Explorer la boutique</span>
                <span className="sm:hidden">La boutique</span>
                <Package className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {boutiqueItems && boutiqueItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {boutiqueItems.map((item: any, index: number) => (
                <div 
                  key={item.id} 
                  className={`hover-lift cartoon-float-delay-${index % 3}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BoutiqueItem item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl p-12 text-center cartoon-float">
              <div className="w-32 h-32 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-8 icon-3d">
                <Package className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-header text-3xl font-bold text-secondary mb-4 cartoon-text">
                Nouveaux articles bientôt
              </h3>
              <p className="text-muted-foreground text-lg">
                Nous vérifions de nouveaux dons pour la boutique solidaire.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Final Style Cartoon */}
      <section className="glass border-t backdrop-blur-lg py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={communityImage} 
            alt="Communauté africaine unie" 
            className="w-full h-full object-cover opacity-60"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                <Star className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            
            <h2 className="font-header text-4xl lg:text-6xl font-black text-secondary cartoon-text">
              Rejoignez notre communauté
            </h2>
            
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ensemble, nous créons un avenir meilleur pour l'Afrique. 
              Votre contribution, petite ou grande, fait la différence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/material-donation">
                <Button className="form-button text-xl px-12 py-6 cartoon-button">
                  <Gift className="w-6 h-6 mr-3" />
                  Commencer à donner
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button variant="outline" className="cartoon-button text-xl px-12 py-6 glass border-2 border-primary text-primary hover:bg-primary hover:text-white">
                  <Heart className="w-6 h-6 mr-3" />
                  Soutenir une cause
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}