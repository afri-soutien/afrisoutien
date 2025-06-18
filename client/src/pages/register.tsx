import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Heart, Eye, EyeOff, CheckCircle, ArrowLeft, UserPlus, Sparkles, Shield, Star } from "lucide-react";

const registerSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour activer votre compte.",
      });
      
      setLocation("/verify-email");
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const currentPassword = form.watch("password");
  const strength = passwordStrength(currentPassword);

  return (
    <div className="min-h-screen bg-gradient-hero organic-texture flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl cartoon-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl cartoon-float-delay-1"></div>
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-accent/10 rounded-full blur-xl cartoon-float-delay-2"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">


        {/* Register Card */}
        <div className="card-premium">
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center cartoon-wiggle">
                  <Heart className="w-3 h-3 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center cartoon-float">
                  <Star className="w-3 h-3 text-white" />
                </div>
                <Sparkles className="absolute top-0 left-0 w-5 h-5 text-trust animate-pulse" />
              </div>
            </div>
            
            <h1 className="font-header text-3xl font-bold text-secondary mb-2 cartoon-text">
              Rejoignez-nous !
            </h1>
            <p className="text-muted-foreground">
              Devenez acteur de la solidarité panafricaine
            </p>
          </div>

          {/* Register Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary font-medium">Prénom</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jean"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary font-medium">Nom</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Kouassi"
                          {...field}
                          className="form-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Adresse email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jean.kouassi@email.com"
                        {...field}
                        className="form-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="form-input pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-auto p-1 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    
                    {/* Password Strength */}
                    {currentPassword && (
                      <div className="glass rounded-lg p-3 mt-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-medium text-secondary">Force du mot de passe:</span>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < strength
                                    ? strength <= 2
                                      ? 'bg-red-400'
                                      : strength <= 3
                                      ? 'bg-yellow-400'
                                      : 'bg-green-400'
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className={`flex items-center space-x-2 ${/[A-Z]/.test(currentPassword) ? 'text-green-600' : ''}`}>
                            <CheckCircle className="w-3 h-3" />
                            <span>Une majuscule</span>
                          </div>
                          <div className={`flex items-center space-x-2 ${/[a-z]/.test(currentPassword) ? 'text-green-600' : ''}`}>
                            <CheckCircle className="w-3 h-3" />
                            <span>Une minuscule</span>
                          </div>
                          <div className={`flex items-center space-x-2 ${/[0-9]/.test(currentPassword) ? 'text-green-600' : ''}`}>
                            <CheckCircle className="w-3 h-3" />
                            <span>Un chiffre</span>
                          </div>
                          <div className={`flex items-center space-x-2 ${currentPassword.length >= 8 ? 'text-green-600' : ''}`}>
                            <CheckCircle className="w-3 h-3" />
                            <span>8 caractères minimum</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="form-input pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-auto p-1 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms Acceptance */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="glass rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium text-secondary">
                          J'accepte les conditions d'utilisation
                        </FormLabel>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          En créant un compte, vous acceptez nos{" "}
                          <Link href="/terms" className="text-primary hover:text-secondary cartoon-button">
                            conditions d'utilisation
                          </Link>{" "}
                          et notre{" "}
                          <Link href="/privacy" className="text-primary hover:text-secondary cartoon-button">
                            politique de confidentialité
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="form-button w-full text-lg py-6"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Création du compte...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-3 icon-3d" />
                    Créer mon compte
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted-foreground/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground glass rounded-xl">
                Déjà membre ?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center space-y-4">
            <Link href="/login">
              <Button 
                variant="outline" 
                className="cartoon-button w-full text-lg py-6 glass border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Heart className="w-5 h-5 mr-3" />
                Se connecter
              </Button>
            </Link>
            
            <p className="text-sm text-muted-foreground">
              Continuez votre mission de solidarité
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="glass rounded-xl p-4 mt-6 cartoon-float">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-trust rounded-lg flex items-center justify-center icon-3d">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Données protégées</p>
              <p className="text-xs text-muted-foreground">
                Vos informations personnelles sont chiffrées et sécurisées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}