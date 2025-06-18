import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Mail, AlertCircle, RefreshCcw, Sparkles, Shield, Heart } from "lucide-react";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  const { toast } = useToast();

  useEffect(() => {
    // Récupérer le token depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      verifyEmailToken(token);
    }
  }, []);

  const verifyEmailToken = async (token: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setVerificationStatus('success');
        toast({
          title: "Email vérifié avec succès !",
          description: "Votre compte est maintenant activé.",
        });
        
        // Redirection après 3 secondes
        setTimeout(() => {
          setLocation('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        if (response.status === 400 && errorData.message.includes('expired')) {
          setVerificationStatus('expired');
        } else {
          setVerificationStatus('error');
        }
      }
    } catch (error) {
      console.error('Erreur de vérification:', error);
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localStorage.getItem('pending_verification_email') || '' }),
      });

      if (response.ok) {
        toast({
          title: "Email renvoyé",
          description: "Un nouveau lien de vérification a été envoyé.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de renvoyer l'email. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
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
        <div className="card-premium">
          {verificationStatus === 'pending' && (
            <>
              {/* Header - En attente */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                      <Mail className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center cartoon-wiggle">
                      <Heart className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-primary animate-pulse" />
                  </div>
                </div>
                
                <h1 className="font-header text-3xl font-bold text-secondary mb-2 cartoon-text">
                  Vérification de l'email
                </h1>
                <p className="text-muted-foreground">
                  Dernière étape pour activer votre compte
                </p>
              </div>

              {/* Instructions */}
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-lg text-secondary mb-4 cartoon-text">
                  Vérifiez votre email
                </h3>
                <p className="text-muted-foreground mb-4">
                  Nous avons envoyé un lien de vérification à votre adresse email. 
                  Cliquez sur le lien pour activer votre compte.
                </p>
                
                <div className="glass rounded-xl p-4 bg-trust/5">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-trust rounded-lg flex items-center justify-center icon-3d flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary">Vérifiez vos dossiers</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        <li>• Regardez dans votre boîte de réception</li>
                        <li>• Vérifiez le dossier spam/courrier indésirable</li>
                        <li>• Le lien expire dans 24 heures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={resendVerificationEmail}
                variant="outline"
                className="cartoon-button w-full text-lg py-6 glass border-2 border-secondary text-secondary hover:bg-secondary hover:text-white mb-4"
              >
                <RefreshCcw className="w-5 h-5 mr-3" />
                Renvoyer l'email
              </Button>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              {/* Header - Succès */}
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                      <CheckCircle className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center cartoon-wiggle">
                      <Heart className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-accent animate-pulse" />
                  </div>
                </div>

                <h1 className="font-header text-3xl font-bold text-secondary mb-4 cartoon-text">
                  Email vérifié !
                </h1>

                <div className="glass rounded-2xl p-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Félicitations ! Votre compte est maintenant activé.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vous allez être redirigé vers la page de connexion...
                  </p>
                </div>

                <Button 
                  onClick={() => setLocation('/login')}
                  className="form-button w-full text-lg py-6"
                >
                  <Heart className="w-5 h-5 mr-3 icon-3d" />
                  Se connecter maintenant
                </Button>
              </div>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              {/* Header - Erreur */}
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                      <AlertCircle className="w-10 h-10 text-white" />
                    </div>
                    <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-accent animate-pulse" />
                  </div>
                </div>

                <h1 className="font-header text-3xl font-bold text-secondary mb-4 cartoon-text">
                  Erreur de vérification
                </h1>

                <div className="glass rounded-2xl p-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Le lien de vérification n'est pas valide ou a expiré.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={resendVerificationEmail}
                    className="form-button w-full text-lg py-6"
                  >
                    <RefreshCcw className="w-5 h-5 mr-3 icon-3d" />
                    Recevoir un nouveau lien
                  </Button>

                  <Button 
                    onClick={() => setLocation('/register')}
                    variant="outline"
                    className="cartoon-button w-full text-lg py-6 glass border-2 border-secondary text-secondary hover:bg-secondary hover:text-white"
                  >
                    Retour à l'inscription
                  </Button>
                </div>
              </div>
            </>
          )}

          {verificationStatus === 'expired' && (
            <>
              {/* Header - Expiré */}
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center icon-3d shadow-2xl cartoon-bounce">
                      <AlertCircle className="w-10 h-10 text-white" />
                    </div>
                    <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-accent animate-pulse" />
                  </div>
                </div>

                <h1 className="font-header text-3xl font-bold text-secondary mb-4 cartoon-text">
                  Lien expiré
                </h1>

                <div className="glass rounded-2xl p-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Ce lien de vérification a expiré. Les liens sont valides pendant 24 heures.
                  </p>
                </div>

                <Button 
                  onClick={resendVerificationEmail}
                  className="form-button w-full text-lg py-6"
                >
                  <RefreshCcw className="w-5 h-5 mr-3 icon-3d" />
                  Recevoir un nouveau lien
                </Button>
              </div>
            </>
          )}

          {isVerifying && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Vérification en cours...</p>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="glass rounded-xl p-4 mt-6 cartoon-float">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-trust rounded-lg flex items-center justify-center icon-3d">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Sécurité garantie</p>
              <p className="text-xs text-muted-foreground">
                Vos données sont protégées et chiffrées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}