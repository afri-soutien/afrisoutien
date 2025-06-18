import { Heart, Users, Globe, Shield, Award, Target, Sparkles, Star, Zap } from "lucide-react";
import donationCenterImage from "@assets/20250611_2236_Centre de Dons Lumineux_simple_compose_01jxgj4g5gekws3vw8a9dks500_1749820285964.png";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Solidarité",
      description: "Nous croyons en la force de l'union africaine et en la capacité de chacun à contribuer au bien-être collectif.",
      color: "primary"
    },
    {
      icon: Shield,
      title: "Transparence",
      description: "Chaque don, chaque action est tracée et vérifiée pour garantir une utilisation responsable des ressources.",
      color: "secondary"
    },
    {
      icon: Globe,
      title: "Panafricanisme",
      description: "Notre vision dépasse les frontières pour créer une Afrique unie et prospère.",
      color: "accent"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Ensemble, nous formons une famille solidaire qui s'entraide et grandit collectivement.",
      color: "trust"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque projet pour maximiser l'impact de votre générosité.",
      color: "primary"
    },
    {
      icon: Target,
      title: "Impact",
      description: "Chaque action compte et contribue à transformer concrètement des vies à travers l'Afrique.",
      color: "secondary"
    }
  ];

  const stats = [
    { number: "2,847", label: "Vies transformées", description: "Personnes directement aidées" },
    { number: "1,523", label: "Objets redistribués", description: "Articles donnés une seconde vie" },
    { number: "58,671,000 FCFA", label: "Collectés ensemble", description: "Montant total des dons" },
    { number: "892", label: "Donateurs actifs", description: "Communauté engagée" }
  ];

  const story = [
    {
      year: "2023",
      title: "La Vision",
      description: "Née d'un rêve de solidarité panafricaine, Afri Soutien commence avec une simple idée : connecter les cœurs généreux aux besoins réels."
    },
    {
      year: "2024",
      title: "Les Premiers Pas",
      description: "Lancement de la plateforme avec les premières campagnes d'urgence médicale et les premiers dons matériels."
    },
    {
      year: "Aujourd'hui",
      title: "L'Impact Grandit",
      description: "Une communauté active de donateurs et bénéficiaires qui transforment ensemble l'avenir de l'Afrique."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero organic-texture">
      {/* Hero Section Style Cartoon */}
      <div className="relative glass border-b backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-primary/10 rounded-full blur-3xl cartoon-float"></div>
          <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-secondary/10 rounded-full blur-2xl cartoon-float-delay-1"></div>
          <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-accent/10 rounded-full blur-xl cartoon-float-delay-2"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center space-y-12">
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                  <Heart className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center cartoon-wiggle">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center cartoon-float">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <Sparkles className="absolute top-0 left-0 w-8 h-8 text-trust animate-pulse" />
              </div>
            </div>
            
            <h1 className="font-header text-6xl lg:text-8xl font-black leading-tight">
              <span className="kinetic-text cartoon-text">Notre</span>
              <br />
              <span className="text-primary animate-glow cartoon-text">Histoire</span>
            </h1>
            
            <div className="glass rounded-3xl p-10 max-w-5xl mx-auto cartoon-float">
              <p className="text-3xl lg:text-4xl text-white/90 font-medium leading-relaxed">
                <span className="kinetic-text font-bold cartoon-text">Une aventure humaine</span>
                <br />
                <span className="text-secondary">née de l'amour pour l'Afrique</span>
              </p>
              <p className="text-xl text-white/80 mt-6 max-w-4xl mx-auto">
                Afri Soutien est plus qu'une plateforme - c'est un mouvement de solidarité 
                qui unit les cœurs africains dans un élan commun de générosité et d'espoir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={donationCenterImage} 
            alt="Centre de dons lumineux" 
            className="w-full h-full object-cover opacity-70"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-header text-4xl lg:text-5xl font-bold text-secondary mb-6 cartoon-text">
              Notre Mission
            </h2>
            <div className="glass rounded-3xl p-8 max-w-4xl mx-auto cartoon-float">
              <p className="text-xl text-muted-foreground leading-relaxed">
                <span className="font-bold text-primary">Afri Soutien</span> est né d'une vision simple mais puissante : 
                créer une plateforme où chaque africain peut contribuer au développement de son continent. 
                Nous facilitons les dons, organisons l'entraide et créons des ponts 
                entre ceux qui peuvent aider et ceux qui en ont besoin.
              </p>
            </div>
          </div>

          {/* Stats en style cartoon */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className={`card-premium text-center cartoon-float-delay-${index % 3}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="space-y-4">
                  <div className="text-4xl font-black text-primary cartoon-text">{stat.number}</div>
                  <h3 className="font-semibold text-lg text-secondary">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section Style Cartoon */}
      <section className="glass border-y backdrop-blur-lg py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-header text-4xl lg:text-5xl font-bold text-secondary mb-6 cartoon-text">
              Nos Valeurs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Les principes qui guident chacune de nos actions et décisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title} 
                className={`card-premium text-center hover-lift cartoon-float-delay-${index % 3}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-20 h-20 bg-gradient-${value.color} rounded-3xl flex items-center justify-center mx-auto mb-6 icon-3d`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-header text-xl font-bold text-secondary mb-4 cartoon-text">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Timeline Style Cartoon */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-header text-4xl lg:text-5xl font-bold text-secondary mb-6 cartoon-text">
              Notre Parcours
            </h2>
            <p className="text-xl text-muted-foreground">
              L'évolution d'une idée vers un mouvement de solidarité
            </p>
          </div>
          
          <div className="space-y-12">
            {story.map((chapter, index) => (
              <div 
                key={chapter.year} 
                className={`flex items-start space-x-8 cartoon-float-delay-${index % 3}`}
              >
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center icon-3d">
                    <span className="text-white font-bold text-lg cartoon-text">{index + 1}</span>
                  </div>
                </div>
                <div className="card-premium flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-2xl font-bold text-primary cartoon-text">{chapter.year}</span>
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-header text-2xl font-bold text-secondary mb-4 cartoon-text">
                    {chapter.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {chapter.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section Style Cartoon */}
      <section className="glass border-t backdrop-blur-lg py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="font-header text-4xl lg:text-6xl font-black text-secondary cartoon-text">
              Une équipe passionnée
            </h2>
            
            <div className="glass rounded-3xl p-8 cartoon-float">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Derrière Afri Soutien se cache une équipe de bénévoles et professionnels 
                unis par la même vision : faire de l'Afrique un continent où la solidarité 
                transforme les défis en opportunités. Chaque membre apporte son expertise 
                et sa passion pour créer un impact durable.
              </p>
            </div>
            
            <div className="flex justify-center space-x-6">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Bénévoles actifs</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-secondary">5</div>
                <div className="text-sm text-muted-foreground">Pays représentés</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Support disponible</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}