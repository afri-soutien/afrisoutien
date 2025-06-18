import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Heart, Mail, ArrowLeft, CheckCircle, Sparkles, Shield, RefreshCcw } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { forgotPassword, isLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmittedEmail("");
    form.reset();
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
        {/* Back Button */}
        <Link href="/login">
          <Button 
            variant="ghost" 
            className="cartoon-button mb-8 p-3 glass rounded-xl hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </Button>
        </Link>

        {/* Reset Password Card */}
        <div className="card-premium">
          {!isSubmitted ? (
            <>
              {/* Header with Icon */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                      <RefreshCcw className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-secondary rounded-full flex items-center justify-center cartoon-wiggle">
                      <Mail className="w-3 h-3 text-white" />
                    </div>
                    <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-primary animate-pulse" />
                  </div>
                </div>
                
                <h1 className="font-header text-3xl font-bold text-secondary mb-2 cartoon-text">
                  Mot de passe oublié ?
                </h1>
                <p className="text-muted-foreground">
                  Pas de souci ! Nous allons vous aider à récupérer votre compte
                </p>
              </div>

              {/* Reset Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-secondary font-medium">
                          Adresse email de votre compte
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="votre@email.com"
                            {...field}
                            className="form-input"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-2">
                          Saisissez l'adresse email associée à votre compte Afri Soutien
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="form-button w-full text-lg py-6"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-3 icon-3d" />
                        Envoyer le lien de réinitialisation
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Help Text */}
              <div className="glass rounded-xl p-4 mt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-trust rounded-lg flex items-center justify-center icon-3d flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary">Comment ça marche ?</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Nous vous enverrons un email sécurisé avec un lien pour créer un nouveau mot de passe. 
                      Le lien sera valide pendant 1 heure pour votre sécurité.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center cartoon-wiggle">
                      <Mail className="w-3 h-3 text-white" />
                    </div>
                    <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-accent animate-pulse" />
                  </div>
                </div>

                <h1 className="font-header text-3xl font-bold text-secondary mb-4 cartoon-text">
                  Email envoyé !
                </h1>

                <div className="glass rounded-2xl p-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Nous avons envoyé un lien de réinitialisation à :
                  </p>
                  <p className="font-semibold text-primary text-xl mt-2 cartoon-text">
                    {submittedEmail}
                  </p>
                </div>

                <div className="glass rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center icon-3d flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-secondary">Vérifiez votre boîte de réception</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Si vous ne trouvez pas l'email, vérifiez vos spams. 
                        Le lien sera valide pendant 1 heure.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    className="cartoon-button w-full text-lg py-6 glass border-2 border-secondary text-secondary hover:bg-secondary hover:text-white"
                  >
                    <RefreshCcw className="w-5 h-5 mr-3" />
                    Renvoyer un email
                  </Button>

                  <Link href="/login">
                    <Button 
                      className="form-button w-full text-lg py-6"
                    >
                      <ArrowLeft className="w-5 h-5 mr-3 icon-3d" />
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Security Note */}
        <div className="glass rounded-xl p-4 mt-6 cartoon-float">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-trust rounded-lg flex items-center justify-center icon-3d">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Sécurité renforcée</p>
              <p className="text-xs text-muted-foreground">
                Vos données sont protégées et les liens expirent automatiquement
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Actions */}
        {!isSubmitted && (
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Vous vous souvenez de votre mot de passe ?
            </p>
            <Link href="/login">
              <Button 
                variant="link" 
                className="text-primary hover:text-secondary cartoon-button"
              >
                Se connecter
              </Button>
            </Link>
            <span className="text-muted-foreground mx-2">ou</span>
            <Link href="/register">
              <Button 
                variant="link" 
                className="text-primary hover:text-secondary cartoon-button"
              >
                Créer un compte
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}