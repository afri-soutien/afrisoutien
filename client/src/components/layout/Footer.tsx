import { Link } from "wouter";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sparkles, Globe, Shield } from "lucide-react";
import logoPath from "@assets/20250612_1148_Logo Élegant Afri Soutien_simple_compose_01jxhzeefrf9v911w5g3vh7f5p_1749819895837.png";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-neutral via-secondary to-neutral text-foreground overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 organic-texture opacity-30"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section Premium */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={logoPath} 
                  alt="Afri Soutien" 
                  className="w-16 h-16 object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                <span className="kinetic-text font-bold">Ensemble, créons des vagues de solidarité.</span>
                <br />
                Votre soutien offre des opportunités réelles et un avenir meilleur à ceux qui en ont le plus besoin.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <a href="https://facebook.com/afrisoutien" target="_blank" rel="noopener noreferrer" 
                 className="card-premium p-3 hover-lift group">
                <Facebook className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors icon-3d" />
              </a>
              <a href="https://twitter.com/afrisoutien" target="_blank" rel="noopener noreferrer"
                 className="card-premium p-3 hover-lift group">
                <Twitter className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors icon-3d" />
              </a>
              <a href="https://instagram.com/afrisoutien" target="_blank" rel="noopener noreferrer"
                 className="card-premium p-3 hover-lift group">
                <Instagram className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors icon-3d" />
              </a>
              <a href="https://linkedin.com/company/afrisoutien" target="_blank" rel="noopener noreferrer"
                 className="card-premium p-3 hover-lift group">
                <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors icon-3d" />
              </a>
            </div>
          </div>

          {/* Navigation Links Premium */}
          <div className="space-y-6">
            <h3 className="font-header font-bold text-xl text-primary">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                  Accueil
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                  Campagnes
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </li>
              <li>
                <Link to="/boutique" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                  Boutique Solidaire
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </li>
              <li>
                <Link to="/material-donation" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                  Don Matériel
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company Premium */}
          <div className="space-y-6">
            <h3 className="font-header font-bold text-xl text-secondary">Informations</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-secondary transition-all duration-300 font-medium relative group">
                  À Propos
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-secondary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-secondary transition-all duration-300 font-medium relative group">
                  Conditions d'Utilisation
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-secondary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-secondary transition-all duration-300 font-medium relative group">
                  Politique de Confidentialité
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-secondary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-secondary transition-all duration-300 font-medium relative group">
                  FAQ
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-secondary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information Premium */}
          <div className="space-y-6">
            <h3 className="font-header font-bold text-xl text-accent">Contact</h3>
            <div className="space-y-4">
              <div className="card-premium min-w-0">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center icon-3d flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-muted-foreground text-sm font-medium mb-1">Email</p>
                    <a href="mailto:contact@afrisoutien.com" 
                       className="text-foreground hover:text-primary transition-colors font-semibold text-xs leading-tight break-all">
                      contact@afrisoutien.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="card-premium">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center icon-3d flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-sm font-medium">Téléphone</p>
                    <span className="text-foreground font-semibold text-sm">+225 05 00 11 77 45</span>
                  </div>
                </div>
              </div>
              
              <div className="card-premium">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center icon-3d flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-sm font-medium">Adresse</p>
                    <div className="text-foreground font-semibold text-sm">
                      <span className="block">Bingerville, Abidjan</span>
                      <span className="text-muted-foreground">Côte d'Ivoire</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section Premium */}
        <div className="glass border-t border-white/20 mt-12 pt-8 rounded-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <div className="text-muted-foreground text-sm font-medium">
                © 2025 <span className="kinetic-text font-bold">Afri Soutien</span>. Tous droits réservés.
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                Plateforme de solidarité pan-africaine certifiée et sécurisée
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2 card-premium px-4 py-2">
                <Shield className="w-4 h-4 text-trust icon-3d" />
                <span className="text-sm font-medium text-muted-foreground">SSL Sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 card-premium px-4 py-2">
                <Globe className="w-4 h-4 text-primary icon-3d" />
                <span className="text-sm font-medium text-muted-foreground">Mobile Money</span>
              </div>
              <div className="flex items-center space-x-2 card-premium px-4 py-2">
                <Phone className="w-4 h-4 text-secondary icon-3d" />
                <span className="text-sm font-medium text-muted-foreground">Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}