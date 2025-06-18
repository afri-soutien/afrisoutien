import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CloudUpload, Heart, Users, Shield, Star, CheckCircle, Gift } from "lucide-react";
import { useLocation } from "wouter";
import generosityImage from "@assets/20250611_2249_Générosité Ivoirienne_simple_compose_01jxgjvywkf8ntj08tk2x937mf_1749820285963.png";

const materialDonationSchema = z.object({
  donorName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  donorContact: z.string().min(5, "Veuillez fournir un contact valide"),
  donationType: z.enum(["material", "financial"], {
    required_error: "Veuillez choisir le type de don",
  }),
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  pickupLocation: z.string().optional(),
  financialAmount: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
}).refine((data) => {
  if (data.donationType === "material" && !data.pickupLocation) {
    return false;
  }
  if (data.donationType === "financial" && (!data.financialAmount || isNaN(Number(data.financialAmount)) || Number(data.financialAmount) <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Veuillez remplir tous les champs requis selon le type de don",
  path: ["pickupLocation"],
});

type MaterialDonationForm = z.infer<typeof materialDonationSchema>;

export default function MaterialDonation() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [donationType, setDonationType] = useState<"material" | "financial">("material");

  const form = useForm<MaterialDonationForm>({
    resolver: zodResolver(materialDonationSchema),
    defaultValues: {
      donorName: "",
      donorContact: "",
      donationType: "material",
      title: "",
      description: "",
      category: "",
      pickupLocation: "",
      financialAmount: "",
      acceptTerms: false,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: MaterialDonationForm) => {
    setIsSubmitting(true);
    try {
      const endpoint = data.donationType === "financial" ? "/api/donations" : "/api/material-donations";
      
      if (data.donationType === "financial") {
        // Handle financial donation
        await apiRequest("POST", endpoint, {
          amount: Number(data.financialAmount),
          donorName: data.donorName,
          donorEmail: data.donorContact,
          paymentOperator: "manual",
          campaignId: null, // General donation
        });
      } else {
        // Handle material donation
        await apiRequest("POST", endpoint, {
          donorName: data.donorName,
          donorContact: data.donorContact,
          title: data.title,
          description: data.description,
          category: data.category,
          pickupLocation: data.pickupLocation,
        });
      }

      toast({
        title: data.donationType === "financial" ? "Don financier enregistré" : "Don matériel proposé avec succès",
        description: data.donationType === "financial" ? 
          "Votre don a été enregistré avec succès." : 
          "Notre équipe vous contactera bientôt pour organiser la récupération.",
      });

      setLocation("/");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre proposition.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "Électronique", label: "Électronique", example: "Ordinateurs, téléphones, tablettes..." },
    { value: "Vêtements", label: "Vêtements", example: "Habits, chaussures, accessoires..." },
    { value: "Mobilier", label: "Mobilier", example: "Tables, chaises, armoires..." },
    { value: "Éducation", label: "Éducation", example: "Livres, fournitures scolaires..." },
    { value: "Jouets", label: "Jouets", example: "Jeux, peluches, jouets éducatifs..." },
    { value: "Autre", label: "Autre", example: "Autres objets en bon état..." },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero organic-texture">
      {/* Premium Hero Header */}
      <div className="relative glass border-b backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={generosityImage} 
            alt="Générosité ivoirienne - Don solidaire" 
            className="w-full h-full object-cover opacity-70"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-accent/5"></div>
          <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-secondary rounded-3xl flex items-center justify-center icon-3d shadow-2xl">
                <CloudUpload className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="font-header text-5xl lg:text-6xl font-black leading-tight">
              <span className="kinetic-text">Partagez vos</span>
              <br />
              <span className="text-secondary animate-glow">ressources solidaires</span>
            </h1>
            
            <div className="glass rounded-3xl p-8 max-w-3xl mx-auto">
              <p className="text-xl text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                <span className="kinetic-text font-bold text-primary">Ensemble, créons des vagues de solidarité.</span>
                <br />
                Vos objets en bon état peuvent transformer la vie de familles dans le besoin.
                Proposez-les à notre équipe pour qu'ils trouvent une seconde vie utile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Premium */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form Premium */}
          <div className="lg:col-span-2">
            <div className="card-premium">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center icon-3d">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-header text-2xl font-bold text-secondary">Informations sur votre don</h2>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information Premium */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold text-lg text-primary mb-6">Vos coordonnées</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="donorName"
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
                        name="donorContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary font-medium">Contact (Email ou Téléphone) *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: jean@email.com ou +225 XX XX XX XX" 
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

                  {/* Type de don */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold text-lg text-primary mb-6">Type de don</h3>
                    <FormField
                      control={form.control}
                      name="donationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary font-medium">Que souhaitez-vous donner ? *</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            setDonationType(value as "material" | "financial");
                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="form-input">
                                <SelectValue placeholder="Choisissez le type de don" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="material">Don matériel (objets, meubles...)</SelectItem>
                              <SelectItem value="financial">Don financier (argent)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Détails du don */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold text-lg text-primary mb-6">
                      {donationType === "financial" ? "Détails du don financier" : "Détails de l'objet"}
                    </h3>
                    <div className="space-y-6">
                      {donationType === "financial" ? (
                        <FormField
                          control={form.control}
                          name="financialAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-secondary font-medium">Montant (FCFA) *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  placeholder="Ex: 50000" 
                                  {...field} 
                                  className="form-input"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-secondary font-medium">Titre du don *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: Ordinateur portable HP" 
                                  {...field} 
                                  className="form-input"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary font-medium">Catégorie *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="form-input">
                                  <SelectValue placeholder="Sélectionnez une catégorie" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="glass border border-primary/20">
                                {categories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary font-medium">Description détaillée *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez l'état, les caractéristiques et tout détail important de l'objet..."
                                rows={5}
                                {...field}
                                className="form-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {donationType === "material" && (
                        <FormField
                          control={form.control}
                          name="pickupLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-secondary font-medium">Lieu de récupération *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: Cocody, près du marché central" 
                                  {...field} 
                                  className="form-input"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Upload d'images facultatif */}
                      {donationType === "material" && (
                        <div className="space-y-4">
                          <label className="text-secondary font-medium">Images (facultatif)</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-600">
                                Cliquez pour ajouter des photos de votre don
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG jusqu'à 5 images
                              </p>
                            </label>
                          </div>
                          
                          {selectedImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-4">
                              {selectedImages.map((file, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms & Submit Premium */}
                  <div className="glass rounded-2xl p-6">
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-secondary font-medium">
                              J'accepte les conditions d'utilisation *
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              En cochant cette case, vous acceptez que votre don soit vérifié et mis en ligne dans la boutique solidaire.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="form-button w-full mt-8 text-lg py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-5 h-5 mr-3 icon-3d" />
                          {donationType === "financial" ? "Faire mon don financier" : "Proposer ce don matériel"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Info Sidebar Premium */}
          <div className="space-y-8">
            {/* Process Steps */}
            <div className="card-premium">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center icon-3d">
                  <CheckCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-header text-xl font-bold text-secondary">Comment ça marche ?</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary">Remplissez le formulaire</h4>
                    <p className="text-sm text-muted-foreground">Décrivez votre objet en détail</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-secondary">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary">Vérification</h4>
                    <p className="text-sm text-muted-foreground">Notre équipe vérifie la proposition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-accent">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary">Récupération</h4>
                    <p className="text-sm text-muted-foreground">Nous organisons la collecte</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Stats Premium */}
            <div className="card-premium">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center icon-3d">
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-header text-xl font-bold text-secondary">Notre impact</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Objets redistribués</span>
                  <span className="font-bold text-xl text-primary">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Familles aidées</span>
                  <span className="font-bold text-xl text-secondary">1,523</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Donateurs actifs</span>
                  <span className="font-bold text-xl text-accent">892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taux de satisfaction</span>
                  <span className="font-bold text-xl text-trust">98%</span>
                </div>
              </div>
            </div>

            {/* Security Badge Premium */}
            <div className="card-premium">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-trust to-primary rounded-xl flex items-center justify-center icon-3d">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-header text-xl font-bold text-secondary">Sécurisé & Vérifié</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Vos informations sont protégées et tous les dons sont vérifiés par notre équipe avant redistribution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}