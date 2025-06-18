import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQ() {
  const { data: faqData, isLoading } = useQuery({
    queryKey: ['/api/pages/faq'],
    queryFn: async () => {
      const response = await fetch('/api/pages/faq');
      if (!response.ok) throw new Error('Failed to fetch FAQ');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const faqs: FAQ[] = faqData?.faqs || [
    {
      question: "Comment créer une cagnotte sur Afri Soutien ?",
      answer: "Pour créer une cagnotte, vous devez d'abord créer un compte sur la plateforme. Une fois connecté, rendez-vous dans votre tableau de bord et cliquez sur 'Créer une campagne'. Remplissez le formulaire avec les détails de votre projet : titre, description, objectif financier et catégorie. Votre campagne sera ensuite examinée par notre équipe avant publication."
    },
    {
      question: "Comment faire un don sur la plateforme ?",
      answer: "Pour faire un don, sélectionnez la campagne qui vous intéresse et cliquez sur 'Faire un don'. Vous pouvez choisir le montant de votre don et sélectionner votre mode de paiement (Orange Money, MTN Mobile Money, ou Moov Money). Vous recevrez un reçu de don par email une fois la transaction confirmée."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les principaux services de mobile money en Afrique : Orange Money, MTN Mobile Money, et Moov Money. Ces services permettent des transactions sécurisées directement depuis votre téléphone mobile."
    },
    {
      question: "Comment donner des objets matériels ?",
      answer: "Rendez-vous sur la page 'Donner' et sélectionnez 'Don matériel'. Décrivez les objets que vous souhaitez donner, ajoutez des photos si possible, et indiquez votre localisation. Notre équipe vous contactera pour organiser la collecte ou le dépôt des objets."
    },
    {
      question: "Que deviennent les dons matériels ?",
      answer: "Les dons matériels sont triés par notre équipe et redistribués de deux manières : soit directement aux bénéficiaires dans le besoin, soit vendus dans notre Boutique Solidaire. Les fonds générés par la Boutique Solidaire servent à financer les frais de fonctionnement de la plateforme."
    },
    {
      question: "Comment fonctionne la Boutique Solidaire ?",
      answer: "La Boutique Solidaire propose des objets issus de dons matériels à des prix solidaires. Ces objets sont vendus pour soutenir le fonctionnement de la plateforme et financer d'autres actions solidaires. C'est un moyen de donner une seconde vie aux objets tout en participant à l'économie circulaire."
    },
    {
      question: "Comment vérifier qu'une campagne est légitime ?",
      answer: "Toutes les campagnes sont vérifiées par notre équipe avant publication. Nous demandons des justificatifs aux créateurs de campagnes et effectuons des vérifications. Vous pouvez également contacter notre équipe si vous avez des doutes sur une campagne spécifique."
    },
    {
      question: "Puis-je récupérer mon don si je change d'avis ?",
      answer: "Les dons sont définitifs une fois effectués. Cependant, si vous avez des préoccupations légitimes concernant une campagne, vous pouvez contacter notre service client qui examinera votre situation au cas par cas."
    },
    {
      question: "Comment recevoir les fonds de ma campagne ?",
      answer: "Une fois votre objectif atteint ou à la fin de votre campagne, vous pouvez demander le versement des fonds via votre tableau de bord. Les fonds sont transférés sur votre compte mobile money après vérification de votre identité et du bon usage des fonds collectés."
    },
    {
      question: "Y a-t-il des frais sur les dons ?",
      answer: "Afri Soutien prélève une petite commission sur les dons pour couvrir les frais de fonctionnement de la plateforme, les frais de transaction des opérateurs mobile money, et pour soutenir nos actions solidaires. Le pourcentage exact est affiché de manière transparente lors de chaque don."
    }
  ];

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
              {faqData?.title || "Foire Aux Questions"}
            </h1>
            <p className="text-gray-600 text-lg">
              Trouvez rapidement les réponses aux questions les plus fréquemment posées sur Afri Soutien.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#00402E]">Questions Fréquentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Card className="bg-[#00402E] text-white">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Vous ne trouvez pas votre réponse ?</h3>
                <p className="mb-4">Notre équipe est là pour vous aider</p>
                <Link to="/contact">
                  <Button className="bg-[#FF8C00] text-primary-foreground hover:bg-[#e67c00]">
                    Nous contacter
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}