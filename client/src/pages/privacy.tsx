import { Shield, Eye, Lock, Database, UserCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Dernière mise à jour : 13 juin 2024
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-5 h-5 text-green-600 mr-2" />
              Notre Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Afri Soutien s'engage à protéger la confidentialité et la sécurité 
              des données personnelles de ses utilisateurs. Cette politique explique 
              comment nous collectons, utilisons et protégeons vos informations 
              dans le cadre de notre mission de solidarité pan-africaine.
            </p>
          </CardContent>
        </Card>

        {/* Section 1 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Données Collectées</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Database className="w-5 h-5 text-blue-600 mr-2" />
              Informations d'inscription
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone (pour les transactions)</li>
              <li>Pays de résidence</li>
              <li>Date de création du compte</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900">Données de transaction</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Montants des dons effectués</li>
              <li>Historique des transactions</li>
              <li>Informations des opérateurs de mobile money</li>
              <li>Adresses de livraison pour les dons matériels</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900">Données d'utilisation</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Pages visitées sur la plateforme</li>
              <li>Durée de connexion</li>
              <li>Adresse IP et données de géolocalisation</li>
              <li>Type d'appareil et navigateur utilisé</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Utilisation des Données</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Finalités principales</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Traiter vos dons et transactions</li>
              <li>Vous envoyer des confirmations et reçus</li>
              <li>Assurer le support client</li>
              <li>Prévenir la fraude et garantir la sécurité</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900">Communications</h3>
            <p className="text-gray-700">
              Nous utilisons votre adresse email pour vous envoyer :
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Confirmations de dons et reçus fiscaux</li>
              <li>Notifications importantes sur votre compte</li>
              <li>Mises à jour sur les projets que vous soutenez</li>
              <li>Newsletter (avec possibilité de désinscription)</li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Partage des Données</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 text-purple-600 mr-2" />
                Principe de confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Afri Soutien ne vend jamais vos données personnelles. 
                Nous ne partageons vos informations qu'avec :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Opérateurs de paiement :</strong> pour traiter vos transactions mobile money</li>
                <li><strong>Prestataires techniques :</strong> pour l'hébergement et la maintenance sécurisée</li>
                <li><strong>Autorités légales :</strong> uniquement si requis par la loi</li>
                <li><strong>Bénéficiaires :</strong> informations nécessaires pour la livraison des dons matériels</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  Tous nos partenaires sont contractuellement tenus de respecter 
                  la confidentialité de vos données.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 4 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sécurité des Données</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Lock className="w-5 h-5 text-green-600 mr-2" />
              Mesures de protection
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>Chiffrement SSL/TLS pour toutes les communications</li>
              <li>Hachage sécurisé des mots de passe</li>
              <li>Accès restreint aux données par le personnel autorisé</li>
              <li>Surveillance continue des systèmes</li>
              <li>Sauvegardes régulières et sécurisées</li>
              <li>Audits de sécurité périodiques</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900">Hébergement</h3>
            <p className="text-gray-700">
              Nos serveurs sont hébergés dans des centres de données sécurisés 
              respectant les standards internationaux de protection des données.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Vos Droits</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Droits d'accès et de contrôle</h3>
            <p className="text-gray-700 mb-4">
              Conformément aux réglementations sur la protection des données, vous disposez des droits suivants :
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Droit d'accès</h4>
                <p className="text-gray-700 text-sm">
                  Consulter les données que nous détenons sur vous
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Droit de rectification</h4>
                <p className="text-gray-700 text-sm">
                  Corriger les informations inexactes ou incomplètes
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Droit d'effacement</h4>
                <p className="text-gray-700 text-sm">
                  Demander la suppression de vos données personnelles
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Droit d'opposition</h4>
                <p className="text-gray-700 text-sm">
                  Vous opposer au traitement de vos données
                </p>
              </div>
            </div>

            <p className="text-gray-700 mt-4">
              Pour exercer ces droits, contactez-nous à : 
              <a href="mailto:contact@afrisoutien.com" className="text-primary hover:underline">
                contact@afrisoutien.com
              </a>
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies et Technologies</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Utilisation des cookies</h3>
            <p className="text-gray-700">
              Nous utilisons des cookies pour améliorer votre expérience :
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
              <li><strong>Cookies de performance :</strong> Pour analyser l'utilisation du site</li>
              <li><strong>Cookies de préférence :</strong> Pour mémoriser vos choix</li>
            </ul>
            
            <p className="text-gray-700">
              Vous pouvez configurer votre navigateur pour refuser les cookies, 
              mais cela peut affecter certaines fonctionnalités.
            </p>
          </div>
        </div>

        {/* Section 7 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Conservation des Données</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-700 mb-4">
              Nous conservons vos données personnelles uniquement pendant la durée nécessaire :
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Compte actif :</strong> Pendant toute la durée d'utilisation</li>
              <li><strong>Données de transaction :</strong> 10 ans (obligations légales)</li>
              <li><strong>Données de connexion :</strong> 1 an maximum</li>
              <li><strong>Après suppression du compte :</strong> 30 jours puis suppression définitive</li>
            </ul>
          </div>
        </div>

        {/* Section 8 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Transferts Internationaux</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-700 mb-4">
              Dans le cadre de notre mission pan-africaine, certaines données peuvent 
              être transférées entre pays africains pour faciliter les transactions 
              et améliorer nos services.
            </p>
            <p className="text-gray-700">
              Tous les transferts sont effectués avec des garanties appropriées 
              pour protéger vos données conformément aux standards internationaux.
            </p>
          </div>
        </div>

        {/* Contact et réclamations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
              Contact et Réclamations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Pour toute question concernant cette politique de confidentialité 
              ou pour exercer vos droits :
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email :</strong> 
                <a href="mailto:contact@afrisoutien.com" className="text-primary hover:underline ml-2">
                  contact@afrisoutien.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Adresse :</strong> Dakar, Sénégal
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Délai de réponse :</strong> Maximum 30 jours
              </p>
            </div>
            
            <p className="text-gray-700 text-sm">
              Si vous n'êtes pas satisfait de notre réponse, vous pouvez saisir 
              l'autorité de protection des données compétente dans votre pays.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}