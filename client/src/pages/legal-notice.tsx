import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function LegalNotice() {
  const { data: noticeData, isLoading } = useQuery({
    queryKey: ['/api/pages/notice'],
    queryFn: async () => {
      const response = await fetch('/api/pages/notice');
      if (!response.ok) throw new Error('Failed to fetch legal notice');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const defaultContent = {
    title: "Mentions Légales",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Éditeur du site</h2>
          <div class="space-y-2">
            <p><strong>Raison sociale :</strong> Afri Soutien</p>
            <p><strong>Forme juridique :</strong> Association à but non lucratif</p>
            <p><strong>Adresse :</strong> Bingerville, Abidjan, Côte d'Ivoire</p>
            <p><strong>Téléphone :</strong> +225 05 00 11 77 45</p>
            <p><strong>Email :</strong> contact@afrisoutien.com</p>
            <p><strong>Numéro d'enregistrement :</strong> CI/AB/1234/2024</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Directeur de la publication</h2>
          <p>Le directeur de la publication est le Président de l'association Afri Soutien.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Hébergement</h2>
          <div class="space-y-2">
            <p><strong>Hébergeur :</strong> Replit, Inc.</p>
            <p><strong>Adresse :</strong> 767 Bryant St., San Francisco, CA 94107, États-Unis</p>
            <p><strong>Site web :</strong> <a href="https://replit.com" class="text-[#FF8C00] hover:underline">https://replit.com</a></p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Propriété intellectuelle</h2>
          <p>L'ensemble de ce site relève de la législation sénégalaise et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
          <p>La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Données personnelles</h2>
          <p>Conformément à la loi sénégalaise sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.</p>
          <p>Pour exercer ce droit, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@afrisoutien.com" class="text-[#FF8C00] hover:underline">contact@afrisoutien.com</a></p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Cookies</h2>
          <p>Ce site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.</p>
          <p>Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Liens hypertextes</h2>
          <p>Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité d'Afri Soutien.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Limitation de responsabilité</h2>
          <p>Afri Soutien ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Droit applicable</h2>
          <p>Tout litige en relation avec l'utilisation du site est soumis au droit sénégalais. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Dakar.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#00402E] mb-4">Contact</h2>
          <p>Pour toute question concernant ces mentions légales, vous pouvez nous contacter :</p>
          <ul class="list-disc pl-6 space-y-1">
            <li>Par email : <a href="mailto:contact@afrisoutien.com" class="text-[#FF8C00] hover:underline">contact@afrisoutien.com</a></li>
            <li>Par téléphone : +221 77 123 45 67</li>
            <li>Par courrier : Afri Soutien, BP 1234, Dakar, Sénégal</li>
          </ul>
        </section>

        <div class="mt-8 text-sm text-gray-600">
          <p>Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    `
  };

  const content = noticeData || defaultContent;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            <p className="text-gray-600">
              Informations légales et réglementaires concernant le site Afri Soutien
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#00402E]">Informations Légales</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}