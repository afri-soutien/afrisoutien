import { Client } from "postmark";

interface DonationDetails {
  donorEmail: string;
  donorName: string;
  amount: number;
  campaignTitle: string;
  transactionId: number;
}

interface ContactDetails {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export class NotificationService {
  private client: Client | null;

  constructor() {
    if (!process.env.POSTMARK_API_TOKEN) {
      console.warn("POSTMARK_API_TOKEN not set - email notifications will be disabled");
      this.client = null;
    } else {
      this.client = new Client(process.env.POSTMARK_API_TOKEN);
    }
  }

  /**
   * Envoi d'email de bienvenue et vérification lors de l'inscription
   */
  async sendWelcomeAndVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    // En mode développement, afficher le lien dans la console
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n🔗 LIEN DE VÉRIFICATION EMAIL pour ${email}:`);
      console.log(`👉 ${verificationUrl}\n`);
    }

    if (!this.client) {
      console.log(`Email de vérification simulé pour ${email} (token: ${verificationToken})`);
      return;
    }
    
    try {
      const htmlTemplate = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur Afri Soutien !</title>
    <style>
        @media only screen and (max-width: 600px) {
            .main-table { width: 100% !important; }
            .content-td { padding: 20px !important; }
            .button-td { padding: 15px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5F5F5;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="main-table" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 30px 20px; background-color: #00402E; border-radius: 8px 8px 0 0;">
                            <h2 style="color: #FFFFFF; font-size: 24px; margin: 0; font-weight: bold;">AFRI SOUTIEN</h2>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-td" style="padding: 40px 30px;">
                            <h1 style="color: #00402E; font-size: 28px; font-weight: bold; margin: 0 0 20px 0; text-align: center; line-height: 1.3;">
                                Bienvenue !
                            </h1>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; text-align: center;">
                                Nous sommes ravis de vous accueillir dans la communauté Afri Soutien ! 
                                Pour finaliser votre inscription et accéder à toutes nos fonctionnalités, 
                                il ne vous reste plus qu'à confirmer votre adresse email.
                            </p>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" class="button-td" style="padding: 25px 0;">
                                        <a href="${verificationUrl}" style="display: inline-block; background-color: #FF8C00; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; font-weight: bold; text-align: center;">
                                            Vérifier mon Adresse E-mail
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #555555; font-size: 14px; line-height: 1.4; margin: 20px 0 0 0; text-align: center; font-style: italic;">
                                ⏰ Ce lien expire dans 10 minutes pour votre sécurité.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background-color: #00402E; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #FFFFFF; font-size: 14px; margin: 0 0 10px 0;">
                                <strong>Afri Soutien</strong> - Plateforme de solidarité pan-africaine
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

      await this.client.sendEmail({
        From: process.env.FROM_EMAIL || "nepasrepondre@afrisoutien.com",
        To: email,
        Subject: "Bienvenue sur Afri Soutien - Vérifiez votre compte",
        HtmlBody: htmlTemplate,
        TextBody: `Bienvenue sur Afri Soutien ! Pour vérifier votre compte, visitez ce lien : ${verificationUrl}`
      });
      
      console.log(`Email de vérification envoyé à ${email}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de vérification:", error);
      throw error;
    }
  }

  /**
   * Envoi d'email de réinitialisation de mot de passe
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    if (!this.client) {
      console.log(`Email de réinitialisation simulé pour ${email} (token: ${resetToken})`);
      return;
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
    
    try {
      const htmlTemplate = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe - Afri Soutien</title>
    <style>
        @media only screen and (max-width: 600px) {
            .main-table { width: 100% !important; }
            .content-td { padding: 20px !important; }
            .button-td { padding: 15px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5F5F5;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="main-table" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 30px 20px; background-color: #00402E; border-radius: 8px 8px 0 0;">
                            <h2 style="color: #FFFFFF; font-size: 24px; margin: 0; font-weight: bold;">AFRI SOUTIEN</h2>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-td" style="padding: 40px 30px;">
                            <h1 style="color: #00402E; font-size: 28px; font-weight: bold; margin: 0 0 20px 0; text-align: center; line-height: 1.3;">
                                Réinitialiser votre mot de passe
                            </h1>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Afri Soutien.
                            </p>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; text-align: center;">
                                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
                            </p>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" class="button-td" style="padding: 25px 0;">
                                        <a href="${resetUrl}" style="display: inline-block; background-color: #FF8C00; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; font-weight: bold; text-align: center;">
                                            Créer un Nouveau Mot de Passe
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="background-color: #F5F5F5; padding: 20px; border-radius: 5px; margin: 25px 0;">
                                <p style="color: #555555; font-size: 14px; line-height: 1.4; margin: 0; text-align: center;">
                                    🔒 <strong>Sécurité :</strong> Ce lien expire dans 10 minutes et ne peut être utilisé qu'une seule fois.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background-color: #00402E; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #FFFFFF; font-size: 14px; margin: 0;">
                                <strong>Afri Soutien</strong> - Votre sécurité est notre priorité
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

      await this.client.sendEmail({
        From: process.env.FROM_EMAIL || "nepasrepondre@afrisoutien.com",
        To: email,
        Subject: "Votre demande de réinitialisation de mot de passe",
        HtmlBody: htmlTemplate,
        TextBody: `Réinitialisation de mot de passe pour Afri Soutien. Visitez ce lien : ${resetUrl}`
      });
      
      console.log(`Email de réinitialisation envoyé à ${email}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
      throw error;
    }
  }

  /**
   * Envoi de confirmation de don avec reçu
   */
  async sendDonationConfirmationEmail(donationDetails: DonationDetails): Promise<void> {
    const { donorEmail, donorName, amount, campaignTitle, transactionId } = donationDetails;
    
    if (!this.client) {
      console.log(`Email de confirmation de don simulé pour ${donorEmail}: ${amount} FCFA pour "${campaignTitle}"`);
      return;
    }
    
    try {
      const htmlTemplate = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merci pour votre don - Afri Soutien</title>
    <style>
        @media only screen and (max-width: 600px) {
            .main-table { width: 100% !important; }
            .content-td { padding: 20px !important; }
            .receipt-table { width: 100% !important; }
            .receipt-td { padding: 10px !important; font-size: 14px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5F5F5;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="main-table" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 30px 20px; background-color: #00402E; border-radius: 8px 8px 0 0;">
                            <h2 style="color: #FFFFFF; font-size: 24px; margin: 0; font-weight: bold;">AFRI SOUTIEN</h2>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-td" style="padding: 40px 30px 20px 30px;">
                            <h1 style="color: #00402E; font-size: 28px; font-weight: bold; margin: 0 0 15px 0; text-align: center; line-height: 1.3;">
                                Merci infiniment, ${donorName} !
                            </h1>
                            <div style="text-align: center; margin: 0 0 20px 0;">
                                <span style="font-size: 40px; color: #FF8C00;">💛</span>
                            </div>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; text-align: center;">
                                Votre générosité fait la différence ! Grâce à votre soutien, nous nous rapprochons 
                                de notre objectif et permettons à cette cause de prospérer. Votre impact va bien 
                                au-delà de ce don - vous participez à la construction d'un avenir meilleur.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #F5F5F5; border-radius: 8px; padding: 25px; border-left: 4px solid #FF8C00;">
                                <h2 style="color: #00402E; font-size: 20px; font-weight: bold; margin: 0 0 20px 0; text-align: center;">
                                    📄 Résumé de votre don
                                </h2>
                                <table class="receipt-table" width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td class="receipt-td" style="padding: 12px 0; border-bottom: 1px solid #DDDDDD; font-size: 16px; color: #555555; font-weight: bold;">
                                            Montant du don :
                                        </td>
                                        <td class="receipt-td" style="padding: 12px 0; border-bottom: 1px solid #DDDDDD; font-size: 16px; color: #00402E; font-weight: bold; text-align: right;">
                                            ${amount.toLocaleString('fr-FR')} FCFA
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="receipt-td" style="padding: 12px 0; border-bottom: 1px solid #DDDDDD; font-size: 16px; color: #555555;">
                                            Cagnotte soutenue :
                                        </td>
                                        <td class="receipt-td" style="padding: 12px 0; border-bottom: 1px solid #DDDDDD; font-size: 16px; color: #00402E; text-align: right;">
                                            ${campaignTitle}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="receipt-td" style="padding: 12px 0; border-bottom: 1px solid #DDDDDD; font-size: 16px; color: #555555;">
                                            Date de la transaction :
                                        </td>
                                        <td class="receipt-td" style="padding: 12px 0; border-bottom: 1px solid #DDDDDD; font-size: 16px; color: #00402E; text-align: right;">
                                            ${new Date().toLocaleDateString('fr-FR')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="receipt-td" style="padding: 12px 0; font-size: 16px; color: #555555;">
                                            Numéro de reçu :
                                        </td>
                                        <td class="receipt-td" style="padding: 12px 0; font-size: 16px; color: #00402E; text-align: right; font-weight: bold;">
                                            AS-${transactionId}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 40px 30px;">
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; text-align: center;">
                                Envie de continuer à faire la différence ? Découvrez d'autres causes qui ont besoin de votre soutien.
                            </p>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding: 10px;">
                                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/campaigns" style="display: inline-block; background-color: #00402E; color: #FFFFFF; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 14px; font-weight: bold; margin: 0 10px;">
                                            Voir toutes les cagnottes
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background-color: #00402E; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #FFFFFF; font-size: 14px; margin: 0;">
                                <strong>Afri Soutien</strong> - Ensemble, nous construisons l'Afrique de demain
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

      await this.client.sendEmail({
        From: process.env.FROM_EMAIL || "nepasrepondre@afrisoutien.com",
        To: donorEmail,
        Subject: `Merci pour votre don à la cagnotte "${campaignTitle}" !`,
        HtmlBody: htmlTemplate,
        TextBody: `Merci pour votre don de ${amount.toLocaleString('fr-FR')} FCFA à la cagnotte "${campaignTitle}". Numéro de reçu: AS-${transactionId}`
      });
      
      console.log(`Email de confirmation de don envoyé à ${donorEmail}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
      throw error;
    }
  }

  /**
   * Envoi d'email de formulaire de contact - Email 1: Service client
   */
  async sendContactFormEmail(contactDetails: ContactDetails): Promise<void> {
    const contactEmailTemplate = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact - Afri Soutien</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background-color: #00402E; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table th, .info-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .info-table th { background-color: #f8f8f8; font-weight: bold; width: 150px; }
        .message-box { background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #00402E; color: white; padding: 20px; text-align: center; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Nouveau Message de Contact</h1>
            <p style="color: #cccccc; margin: 5px 0 0;">Afri Soutien - Plateforme de Solidarité</p>
        </div>
        
        <div class="content">
            <p><strong>Un nouveau message a été reçu via le formulaire de contact du site Afri Soutien.</strong></p>
            
            <table class="info-table">
                <tr>
                    <th>Nom</th>
                    <td>${contactDetails.senderName}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td><a href="mailto:${contactDetails.senderEmail}">${contactDetails.senderEmail}</a></td>
                </tr>
                <tr>
                    <th>Sujet</th>
                    <td>${contactDetails.subject}</td>
                </tr>
                <tr>
                    <th>Date</th>
                    <td>${new Date().toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                </tr>
            </table>
            
            <div class="message-box">
                <h3 style="margin-top: 0; color: #00402E;">Message :</h3>
                <p style="line-height: 1.6; white-space: pre-wrap;">${contactDetails.message}</p>
            </div>
            
            <p style="margin-top: 30px;">
                <strong>Action requise :</strong> Répondre directement à ${contactDetails.senderEmail}
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">Afri Soutien - Système de notification automatique</p>
            <p style="margin: 5px 0 0; font-size: 12px;">Cet email a été généré automatiquement, ne pas répondre à cette adresse.</p>
        </div>
    </div>
</body>
</html>`;

    try {
      if (this.client) {
        const result = await this.client.sendEmail({
          From: "nepasrepondre@afrisoutien.com",
          To: "contact@afrisoutien.com",
          Subject: `[Contact] ${contactDetails.subject}`,
          HtmlBody: contactEmailTemplate,
          TextBody: `Nouveau message de contact d'Afri Soutien

Nom: ${contactDetails.senderName}
Email: ${contactDetails.senderEmail}
Sujet: ${contactDetails.subject}

Message:
${contactDetails.message}

Date: ${new Date().toLocaleString('fr-FR')}

Répondre directement à: ${contactDetails.senderEmail}`,
          ReplyTo: contactDetails.senderEmail
        });

        console.log(`Email de contact envoyé avec succès à contact@afrisoutien.com - MessageID: ${result.MessageID}`);
      } else {
        console.log(`[DEV] Email de contact envoyé (simulation) à contact@afrisoutien.com:
De: ${contactDetails.senderName} <${contactDetails.senderEmail}>
Sujet: ${contactDetails.subject}
Message: ${contactDetails.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de contact:', error);
      throw error;
    }
  }

  /**
   * Envoi d'email de formulaire de contact - Email 2: Accusé de réception à l'utilisateur
   */
  async sendContactAcknowledgmentEmail(contactDetails: ContactDetails): Promise<void> {
    const acknowledgmentTemplate = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nous avons bien reçu votre message - Afri Soutien</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background-color: #00402E; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .message-recap { background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #00402E; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .cta-button { display: inline-block; background-color: #FF8C00; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Message bien reçu !</h1>
            <p style="color: #cccccc; margin: 5px 0 0;">Afri Soutien - Plateforme de Solidarité</p>
        </div>
        
        <div class="content">
            <p>Bonjour <strong>${contactDetails.senderName}</strong>,</p>
            
            <p>Nous vous remercions pour votre message. Notre équipe a bien reçu votre demande et nous vous répondrons dans les plus brefs délais.</p>
            
            <div class="message-recap">
                <h3 style="margin-top: 0; color: #00402E;">Récapitulatif de votre message :</h3>
                <p><strong>Sujet :</strong> ${contactDetails.subject}</p>
                <p><strong>Date d'envoi :</strong> ${new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
            </div>
            
            <p><strong>Délai de réponse habituel :</strong> 24 à 48 heures (jours ouvrés)</p>
            
            <p>En attendant notre réponse, n'hésitez pas à découvrir les projets soutenus sur notre plateforme :</p>
            
            <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/campaigns" class="cta-button">
                    Découvrir les cagnottes
                </a>
            </p>
            
            <p>Merci de faire confiance à Afri Soutien pour votre engagement solidaire.</p>
            
            <p>Cordialement,<br>
            <strong>L'équipe Afri Soutien</strong></p>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">Afri Soutien - Ensemble pour une Afrique solidaire</p>
            <p style="margin: 5px 0 0; font-size: 12px;">
                Email : contact@afrisoutien.com | Téléphone : +221 77 123 45 67
            </p>
        </div>
    </div>
</body>
</html>`;

    try {
      if (this.client) {
        const result = await this.client.sendEmail({
          From: "nepasrepondre@afrisoutien.com",
          To: contactDetails.senderEmail,
          Subject: "Nous avons bien reçu votre message - Afri Soutien",
          HtmlBody: acknowledgmentTemplate,
          TextBody: `Bonjour ${contactDetails.senderName},

Nous vous remercions pour votre message. Notre équipe a bien reçu votre demande et nous vous répondrons dans les plus brefs délais.

Récapitulatif de votre message :
Sujet : ${contactDetails.subject}
Date d'envoi : ${new Date().toLocaleString('fr-FR')}

Délai de réponse habituel : 24 à 48 heures (jours ouvrés)

En attendant notre réponse, n'hésitez pas à découvrir les projets soutenus sur notre plateforme : ${process.env.FRONTEND_URL || 'http://localhost:5000'}/campaigns

Merci de faire confiance à Afri Soutien pour votre engagement solidaire.

Cordialement,
L'équipe Afri Soutien

Email : contact@afrisoutien.com | Téléphone : +221 77 123 45 67`
        });

        console.log(`Accusé de réception envoyé à ${contactDetails.senderEmail} - MessageID: ${result.MessageID}`);
      } else {
        console.log(`[DEV] Accusé de réception envoyé (simulation) à ${contactDetails.senderEmail}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'accusé de réception:', error);
      throw error;
    }
  }

  /**
   * Notification aux créateurs de campagne quand ils reçoivent un don
   */
  async sendCampaignOwnerNotification(
    ownerEmail: string, 
    campaignTitle: string, 
    donorName: string, 
    amount: number
  ): Promise<void> {
    if (!this.client) {
      console.log(`Notification de don simulée pour ${ownerEmail}: nouveau don de ${donorName} (${amount} FCFA)`);
      return;
    }

    try {
      await this.client.sendEmailWithTemplate({
        From: process.env.FROM_EMAIL || "nepasrepondre@afrisoutien.com",
        To: ownerEmail,
        TemplateAlias: "nouveau-don-recu",
        TemplateModel: {
          nom_de_la_cagnotte: campaignTitle,
          nom_du_donateur: donorName,
          montant: amount.toLocaleString('fr-FR'),
          app_name: "Afri Soutien"
        }
      });
      
      console.log(`Notification de nouveau don envoyée à ${ownerEmail}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();

// Test direct du système d'emails complet
export async function testCompleteEmailSystem() {
  console.log('🧪 Test complet du système d\'emails avec contact@afrisoutien.com\n');
  
  try {
    // Test 1: Email de confirmation de don
    console.log('1️⃣ Test Email de confirmation de don...');
    const donationDetails = {
      donorEmail: "contact@afrisoutien.com",
      donorName: "Jean-Baptiste Koffi",
      amount: 75000,
      campaignTitle: "Aide pour l'éducation des enfants défavorisés",
      transactionId: 12345
    };
    
    await notificationService.sendDonationConfirmationEmail(donationDetails);
    console.log('✅ Email de confirmation de don envoyé avec template HTML professionnel\n');
    
    // Test 2: Email de vérification (déjà testé mais on le refait)
    console.log('2️⃣ Test Email de vérification...');
    await notificationService.sendWelcomeAndVerificationEmail(
      'contact@afrisoutien.com', 
      'test_verification_token_789'
    );
    console.log('✅ Email de vérification envoyé avec template HTML professionnel\n');
    
    console.log('🎉 Système d\'emails transactionnels complet et opérationnel!');
    console.log('Templates HTML professionnels avec branding Afri Soutien intégrés.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test complet:', error.message);
  }
}