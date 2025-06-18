import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Heart, MessageCircle, Sparkles, Clock, Users } from "lucide-react";
import communityCenterImage from "@assets/20250611_2233_Centre Communautaire Ivoirien_simple_compose_01jxghxh7aetasyjw45wassyk6_1749820285965.png";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@afrisoutien.com",
      description: "Réponse sous 24h",
      color: "primary"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+225 05 00 11 77 45",
      description: "Lun-Ven: 8h-18h GMT",
      color: "secondary"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "Bingerville, Côte d'Ivoire",
      description: "Siège social",
      color: "accent"
    }
  ];

  const quickTopics = [
    { emoji: "🏥", title: "Urgence médicale", description: "Campagne d'urgence" },
    { emoji: "🎓", title: "Éducation", description: "Projet éducatif" },
    { emoji: "📦", title: "Don matériel", description: "Question sur les dons" },
    { emoji: "💝", title: "Partenariat", description: "Collaboration" },
    { emoji: "❓", title: "Support", description: "Aide technique" },
    { emoji: "📰", title: "Média", description: "Demande presse" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero organic-texture">
      {/* Hero Section Style Cartoon */}
      <div className="relative glass border-b backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={communityCenterImage} 
            alt="Centre communautaire ivoirien" 
            className="w-full h-full object-cover opacity-70"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl cartoon-float"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl cartoon-float-delay-1"></div>
          <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-accent/10 rounded-full blur-xl cartoon-float-delay-2"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center cartoon-wiggle">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <Sparkles className="absolute -bottom-1 -left-1 w-6 h-6 text-accent animate-pulse" />
              </div>
            </div>
            
            <h1 className="font-header text-5xl lg:text-6xl font-black leading-tight">
              <span className="kinetic-text cartoon-text">Parlons</span>
              <br />
              <span className="text-primary animate-glow cartoon-text">ensemble</span>
            </h1>
            
            <div className="glass rounded-3xl p-8 max-w-3xl mx-auto cartoon-float">
              <p className="text-xl text-white/90 font-medium leading-relaxed">
                <span className="kinetic-text font-bold">Votre voix compte pour nous.</span>
                <br />
                Que ce soit pour une question, une suggestion ou un partenariat, 
                nous sommes là pour vous écouter et vous accompagner.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form Style Cartoon */}
          <div className="lg:col-span-2">
            <div className="card-premium">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center icon-3d">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-header text-2xl font-bold text-secondary cartoon-text">Envoyez-nous un message</h2>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Info */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold text-lg text-primary mb-6">Vos coordonnées</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary font-medium">Votre nom *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: Jean Kouassi" 
                                {...field} 
                                className="form-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary font-medium">Votre email *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="jean@exemple.com" 
                                {...field} 
                                className="form-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold text-lg text-primary mb-6">Votre message</h3>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary font-medium">Sujet *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: Question sur les dons matériels" 
                                {...field} 
                                className="form-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary font-medium">Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez votre demande, question ou suggestion en détail..."
                                rows={6}
                                {...field}
                                className="form-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Quick Topics */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold text-lg text-primary mb-4">Sujets populaires</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {quickTopics.map((topic, index) => (
                        <button
                          key={topic.title}
                          type="button"
                          onClick={() => form.setValue('subject', topic.description)}
                          className="cartoon-button p-3 glass rounded-xl text-left hover:bg-primary/10 transition-all"
                        >
                          <div className="text-lg mb-1">{topic.emoji}</div>
                          <div className="text-sm font-medium text-secondary">{topic.title}</div>
                          <div className="text-xs text-muted-foreground">{topic.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="form-button w-full text-lg py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3 icon-3d" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="card-premium">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center icon-3d">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-header text-xl font-bold text-secondary cartoon-text">Nos coordonnées</h3>
              </div>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={info.title} className={`glass rounded-xl p-4 cartoon-float-delay-${index % 3}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 bg-gradient-${info.color} rounded-xl flex items-center justify-center icon-3d flex-shrink-0`}>
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary">{info.title}</h4>
                        <p className="text-primary font-medium">{info.value}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="card-premium">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-trust to-primary rounded-xl flex items-center justify-center icon-3d">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-header text-xl font-bold text-secondary cartoon-text">Temps de réponse</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Questions générales</span>
                  <span className="font-bold text-primary">24h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Urgences médicales</span>
                  <span className="font-bold text-trust">2h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Partenariats</span>
                  <span className="font-bold text-secondary">48h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Support technique</span>
                  <span className="font-bold text-accent">12h</span>
                </div>
              </div>
            </div>

            {/* Team Info */}
            <div className="card-premium">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center icon-3d">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-header text-xl font-bold text-secondary cartoon-text">Notre équipe</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Une équipe dédiée de bénévoles et professionnels travaille chaque jour 
                pour répondre à vos questions et faire avancer notre mission de solidarité panafricaine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}