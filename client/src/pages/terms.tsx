import { ScrollText, Shield, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Terms() {
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
            <ScrollText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">
              Conditions d'Utilisation
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
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Bienvenue sur Afri Soutien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation 
              de la plateforme Afri Soutien, accessible à l'adresse afrisoutien.com. 
              En utilisant notre service, vous acceptez pleinement et sans réserve 
              l'ensemble des termes de ces conditions.
            </p>
          </CardContent>
        </Card>

        {/* Section 1 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Définitions</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <ul className="space-y-3 text-gray-700">
              <li><strong>Plateforme :</strong> Le site web Afri Soutien et tous ses services associés</li>
              <li><strong>Utilisateur :</strong> Toute personne utilisant la plateforme</li>
              <li><strong>Donateur :</strong> Utilisateur effectuant un don financier ou matériel</li>
              <li><strong>Porteur de projet :</strong> Utilisateur créant une cagnotte ou demande d'aide</li>
              <li><strong>Cagnotte :</strong> Campagne de collecte de fonds créée sur la plateforme</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Accès et Inscription</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Conditions d'accès</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Être âgé de 18 ans minimum ou avoir l'autorisation parentale</li>
              <li>Fournir des informations exactes et à jour lors de l'inscription</li>
              <li>Maintenir la confidentialité de vos identifiants de connexion</li>
              <li>Respecter les lois en vigueur dans votre pays de résidence</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900">Vérification d'identité</h3>
            <p className="text-gray-700">
              Afri Soutien se réserve le droit de demander une vérification d'identité 
              pour certaines transactions ou en cas de soupçon d'activité frauduleuse.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation de la Plateforme</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Obligations des utilisateurs</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Utiliser la plateforme conformément à sa destination</li>
              <li>Ne pas porter atteinte aux droits des tiers</li>
              <li>Ne pas diffuser de contenu illégal, offensant ou frauduleux</li>
              <li>Respecter la propriété intellectuelle d'autrui</li>
              <li>Ne pas tenter de contourner les mesures de sécurité</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900">Contenus interdits</h3>
            <p className="text-gray-700">
              Sont notamment interdits les contenus à caractère discriminatoire, 
              haineux, pornographique, ou faisant l'apologie de la violence. 
              Les projets illégaux ou contraires aux bonnes mœurs ne sont pas acceptés.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Dons et Transactions</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Dons financiers</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Les dons sont traités via des opérateurs de mobile money sécurisés</li>
              <li>Chaque don fait l'objet d'un reçu électronique</li>
              <li>Les fonds sont transférés directement aux bénéficiaires</li>
              <li>Afri Soutien ne prélève aucune commission sur les dons</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900">Dons matériels</h3>
            <p className="text-gray-700">
              Les dons d'objets sont soumis à validation par notre équipe. 
              Le donateur reste responsable de l'état et de la conformité 
              des objets proposés.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Responsabilités</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                Limitation de responsabilité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Afri Soutien agit en qualité d'intermédiaire technique. 
                Nous ne sommes pas responsables des relations entre donateurs 
                et bénéficiaires, ni de l'utilisation finale des fonds collectés.
              </p>
              <p className="text-gray-700">
                Chaque porteur de projet s'engage à utiliser les fonds conformément 
                à l'objet déclaré de sa cagnotte et à rendre compte de leur utilisation 
                si requis.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Section 6 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modération et Sanctions</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <p className="text-gray-700">
              Afri Soutien se réserve le droit de modérer tous les contenus 
              publiés sur la plateforme et de suspendre ou supprimer tout 
              compte ne respectant pas les présentes conditions.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                <p className="text-yellow-800 text-sm">
                  En cas de manquement grave, des poursuites judiciaires 
                  peuvent être engagées.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriété Intellectuelle</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-700 mb-4">
              Tous les éléments de la plateforme Afri Soutien (design, logos, textes, 
              fonctionnalités) sont protégés par le droit de la propriété intellectuelle.
            </p>
            <p className="text-gray-700">
              Les utilisateurs conservent leurs droits sur les contenus qu'ils publient 
              mais accordent à Afri Soutien une licence d'utilisation dans le cadre 
              du fonctionnement de la plateforme.
            </p>
          </div>
        </div>

        {/* Section 8 */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifications et Résiliation</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Modifications des CGU</h3>
            <p className="text-gray-700">
              Ces conditions peuvent être modifiées à tout moment. 
              Les utilisateurs seront informés des changements significatifs 
              par email ou notification sur la plateforme.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900">Résiliation</h3>
            <p className="text-gray-700">
              Chaque utilisateur peut supprimer son compte à tout moment. 
              Afri Soutien peut également résilier l'accès en cas de violation 
              des présentes conditions.
            </p>
          </div>
        </div>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>
              Pour toute question concernant ces conditions d'utilisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Email : <a href="mailto:contact@afrisoutien.com" className="text-primary hover:underline">
                contact@afrisoutien.com
              </a>
            </p>
            <p className="text-gray-700 mt-2">
              Adresse : Dakar, Sénégal
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}