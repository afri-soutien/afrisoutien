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
import { Heart, Eye, EyeOff, ArrowLeft, LogIn, Sparkles, Shield } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Afri Soutien !",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero organic-texture flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl cartoon-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl cartoon-float-delay-1"></div>
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-accent/10 rounded-full blur-xl cartoon-float-delay-2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">


        {/* Login Card */}
        <div className="card-premium">
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                  <LogIn className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-secondary rounded-full flex items-center justify-center cartoon-wiggle">
                  <Heart className="w-3 h-3 text-white" />
                </div>
                <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-accent animate-pulse" />
              </div>
            </div>
            
            <h1 className="font-header text-3xl font-bold text-secondary mb-2 cartoon-text">
              Bon retour !
            </h1>
            <p className="text-muted-foreground">
              Connectez-vous pour continuer votre mission de solidarité
            </p>
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Adresse email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-muted-foreground">
                        Se souvenir de moi
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link href="/forgot-password">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary hover:text-secondary cartoon-button"
                  >
                    Mot de passe oublié ?
                  </Button>
                </Link>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="form-button w-full text-lg py-6"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-3 icon-3d" />
                    Se connecter
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
                Nouveau sur Afri Soutien ?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center space-y-4">
            <Link href="/register">
              <Button 
                variant="outline" 
                className="cartoon-button w-full text-lg py-6 glass border-2 border-secondary text-secondary hover:bg-secondary hover:text-white"
              >
                <Heart className="w-5 h-5 mr-3" />
                Créer un compte
              </Button>
            </Link>
            
            <p className="text-sm text-muted-foreground">
              Rejoignez notre communauté de solidarité panafricaine
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
              <p className="text-sm font-medium text-secondary">Connexion sécurisée</p>
              <p className="text-xs text-muted-foreground">
                Vos données sont protégées par un chiffrement de niveau bancaire
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}