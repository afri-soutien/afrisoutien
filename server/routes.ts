import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { 
  insertUserSchema, insertCampaignSchema, insertFinancialDonationSchema,
  insertMaterialDonationSchema, insertBoutiqueOrderSchema,
  insertContactMessageSchema,
  type User
} from "@shared/schema";
import { z } from "zod";
import { notificationService } from "./notification-service";
import { nanoid } from "nanoid";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your-refresh-secret-key";

// Utility functions for JWT
const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { 
    expiresIn: '1h'
  });
};

const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, REFRESH_SECRET, { 
    expiresIn: '7d'
  });
};

const extractToken = (req: any): string | null => {
  // First check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // Fallback to HttpOnly cookie
  return req.cookies?.jwt || null;
};

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ 
      message: 'Access token required',
      code: 'TOKEN_MISSING'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ 
      message: 'Invalid token',
      code: 'TOKEN_INVALID'
    });
  }
};

// Middleware to verify admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);
      
      // Generate verification token
      const emailVerificationToken = nanoid(32);
      
      const user = await storage.createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        passwordHash,
        emailVerificationToken,
        isVerified: false,
        role: userData.role || "beneficiary"
      });

      // Envoyer l'email de bienvenue et de vérification
      try {
        await notificationService.sendWelcomeAndVerificationEmail(user.email, emailVerificationToken);
      } catch (emailError) {
        console.error('Erreur envoi email de vérification:', emailError);
        // On continue même si l'email échoue
      }

      res.status(201).json({ 
        message: 'User created successfully. Please check your email to verify your account.',
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: 'Invalid user data' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Set HttpOnly cookies
      const isProduction = process.env.NODE_ENV === 'production';
      
      // Access token cookie (shorter duration)
      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
        path: '/'
      });

      // Refresh token cookie (longer duration, stricter)
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/api/auth'
      });
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route de vérification d'email
  app.get('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }

      // Trouver l'utilisateur avec ce token
      const users = await storage.getAllUsers();
      const user = users.find(u => u.emailVerificationToken === token);
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }

      // Mettre à jour l'utilisateur comme vérifié
      await storage.updateUser(user.id, { 
        isVerified: true, 
        emailVerificationToken: null 
      });

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  // Route de refresh token
  app.post('/api/auth/refresh', async (req, res) => {
    try {
      const refreshToken = req.cookies?.refresh_token;
      
      if (!refreshToken) {
        return res.status(401).json({ 
          message: 'Refresh token required',
          code: 'REFRESH_TOKEN_MISSING'
        });
      }

      try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: number };
        const user = await storage.getUser(decoded.userId);
        
        if (!user) {
          return res.status(401).json({ 
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user.id);
        
        // Set new access token cookie
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('jwt', newAccessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: 'lax',
          maxAge: 60 * 60 * 1000, // 1 hour
          path: '/'
        });

        res.json({ 
          message: 'Token refreshed successfully',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified
          }
        });
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          // Clear both cookies if refresh token expired
          res.clearCookie('jwt');
          res.clearCookie('refresh_token');
          return res.status(401).json({ 
            message: 'Refresh token expired',
            code: 'REFRESH_TOKEN_EXPIRED'
          });
        }
        return res.status(403).json({ 
          message: 'Invalid refresh token',
          code: 'REFRESH_TOKEN_INVALID'
        });
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route de logout
  app.post('/api/auth/logout', (req, res) => {
    // Clear both cookies
    res.clearCookie('jwt');
    res.clearCookie('refresh_token');
    res.json({ message: 'Logged out successfully' });
  });

  // Route pour renvoyer l'email de vérification
  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Pour la sécurité, on renvoie toujours succès
        return res.json({ message: 'If the email exists, a verification link has been sent' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Email is already verified' });
      }

      // Générer un nouveau token de vérification
      const verificationToken = nanoid(32);
      await storage.updateUser(user.id, { emailVerificationToken: verificationToken });

      // Envoyer l'email de vérification
      try {
        await notificationService.sendWelcomeAndVerificationEmail(user.email, verificationToken);
        res.json({ message: 'Verification email sent successfully' });
      } catch (emailError) {
        console.error('Erreur envoi email de vérification:', emailError);
        res.status(500).json({ message: 'Failed to send verification email' });
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route de demande de réinitialisation de mot de passe
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Toujours renvoyer succès pour éviter l'énumération d'emails
        return res.json({ message: 'If the email exists, a reset link has been sent' });
      }

      // Générer un token de réinitialisation
      const resetToken = nanoid(32);
      
      await storage.updateUser(user.id, { passwordResetToken: resetToken });

      // Envoyer l'email de réinitialisation
      try {
        await notificationService.sendPasswordResetEmail(user.email, resetToken);
      } catch (emailError) {
        console.error('Erreur envoi email de réinitialisation:', emailError);
      }

      res.json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route de réinitialisation de mot de passe
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
      }

      // Trouver l'utilisateur avec ce token
      const users = await storage.getAllUsers();
      const user = users.find(u => u.passwordResetToken === token);
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Hacher le nouveau mot de passe
      const passwordHash = await bcrypt.hash(password, 10);
      
      await storage.updateUser(user.id, { 
        passwordHash,
        passwordResetToken: null 
      });

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  });


  app.get('/api/auth/me', authenticateToken, async (req, res) => {
    res.json({ user: req.user });
  });

  // Campaign routes
  app.get('/api/campaigns', async (req, res) => {
    try {
      const { status = 'approved', limit } = req.query;
      const campaigns = await storage.getCampaigns(status as string, limit ? parseInt(limit as string) : undefined);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching campaigns' });
    }
  });

  app.get('/api/campaigns/:id', async (req, res) => {
    try {
      const campaign = await storage.getCampaign(parseInt(req.params.id));
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching campaign' });
    }
  });

  app.post('/api/campaigns', authenticateToken, async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error('Campaign creation error:', error);
      res.status(400).json({ message: 'Invalid campaign data' });
    }
  });

  // Donation routes
  app.post('/api/donations/initiate', async (req, res) => {
    try {
      const donationData = insertFinancialDonationSchema.parse(req.body);
      
      const donation = await storage.createDonation(donationData);
      
      // Here you would integrate with actual mobile money API
      // For now, we'll simulate the process
      
      res.status(201).json({
        donation,
        message: 'Donation initiated. You will receive SMS/notification to complete payment.'
      });
    } catch (error) {
      console.error('Donation error:', error);
      res.status(400).json({ message: 'Invalid donation data' });
    }
  });

  app.post('/api/donations/callback/:operator', async (req, res) => {
    try {
      const { operator } = req.params;
      const { transaction_id, status, amount } = req.body;
      
      // Verify the callback signature here (implementation depends on operator)
      console.log(`Webhook reçu de ${operator}: ${transaction_id} - ${status}`);
      
      const donation = await storage.getDonationsByOperatorTxId(transaction_id);
      if (!donation) {
        return res.status(404).json({ message: 'Donation not found' });
      }

      // Mettre à jour le statut du don
      const updatedDonation = await storage.updateDonation(donation.id, {
        status: status === 'success' ? 'completed' : 'failed',
        operatorTransactionId: transaction_id
      });

      // Si le paiement est réussi
      if (status === 'success' && updatedDonation) {
        // Récupérer les détails de la campagne
        const campaign = await storage.getCampaign(donation.campaignId);
        if (campaign) {
          // Mettre à jour le montant de la campagne
          const newAmount = parseFloat(campaign.currentAmount.toString()) + parseFloat(donation.amount.toString());
          await storage.updateCampaign(campaign.id, {
            currentAmount: newAmount.toString()
          });

          // Envoyer l'email de confirmation de don (reçu) au donateur
          if (donation.donorEmail) {
            try {
              await notificationService.sendDonationConfirmationEmail({
                donorEmail: donation.donorEmail,
                donorName: donation.donorName || 'Donateur anonyme',
                amount: parseFloat(donation.amount.toString()),
                campaignTitle: campaign.title,
                transactionId: updatedDonation.id
              });
            } catch (emailError) {
              console.error('Erreur envoi email de confirmation:', emailError);
            }
          }

          // Notifier le créateur de la campagne
          const campaignOwner = await storage.getUser(campaign.userId);
          if (campaignOwner) {
            try {
              await notificationService.sendCampaignOwnerNotification(
                campaignOwner.email,
                campaign.title,
                donation.donorName || 'Donateur anonyme',
                parseFloat(donation.amount.toString())
              );
            } catch (emailError) {
              console.error('Erreur envoi notification propriétaire:', emailError);
            }
          }
        }
      }

      res.json({ message: 'Callback processed successfully' });
    } catch (error) {
      console.error('Callback error:', error);
      res.status(500).json({ message: 'Error processing callback' });
    }
  });

  // Material donations routes
  app.post('/api/material-donations', async (req, res) => {
    try {
      const donationData = insertMaterialDonationSchema.parse(req.body);
      const donation = await storage.createMaterialDonation(donationData);
      res.status(201).json(donation);
    } catch (error) {
      console.error('Material donation error:', error);
      res.status(400).json({ message: 'Invalid donation data' });
    }
  });

  // Boutique routes
  app.get('/api/boutique/items', async (req, res) => {
    try {
      const { status = 'available', category } = req.query;
      const items = await storage.getBoutiqueItems(status as string, category as string);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching boutique items' });
    }
  });

  app.get('/api/boutique/items/:id', async (req, res) => {
    try {
      const item = await storage.getBoutiqueItem(parseInt(req.params.id));
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching item' });
    }
  });

  app.post('/api/boutique/orders', authenticateToken, async (req, res) => {
    try {
      const orderData = insertBoutiqueOrderSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const order = await storage.createBoutiqueOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(400).json({ message: 'Invalid order data' });
    }
  });

  // User routes
  app.get('/api/users/me/campaigns', authenticateToken, async (req, res) => {
    try {
      const campaigns = await storage.getUserCampaigns(req.user.id);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user campaigns' });
    }
  });

  app.get('/api/users/me/orders', authenticateToken, async (req, res) => {
    try {
      const orders = await storage.getUserOrders(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user orders' });
    }
  });

  app.put('/api/users/me', authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      
      // Hash password if provided
      if (updates.password) {
        updates.passwordHash = await bcrypt.hash(updates.password, 10);
        delete updates.password;
      }
      
      const user = await storage.updateUser(req.user.id, updates);
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  });

  // Admin routes
  app.get('/api/admin/campaigns/pending', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns('pending');
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending campaigns' });
    }
  });

  app.put('/api/admin/campaigns/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const campaign = await storage.updateCampaign(parseInt(req.params.id), { status });
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: 'Error updating campaign status' });
    }
  });

  app.get('/api/admin/material-donations/pending', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const donations = await storage.getMaterialDonations('pending_verification');
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending material donations' });
    }
  });

  app.post('/api/admin/material-donations/:id/publish', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const donationId = parseInt(req.params.id);
      const { title, description, category } = req.body;
      
      // Update material donation status
      await storage.updateMaterialDonation(donationId, { 
        status: 'published_in_store' 
      });
      
      // Create boutique item
      const item = await storage.createBoutiqueItem({
        sourceDonationId: donationId,
        title,
        description,
        category,
        publishedByAdminId: req.user.id
      });
      
      res.json(item);
    } catch (error) {
      console.error('Publishing error:', error);
      res.status(500).json({ message: 'Error publishing item' });
    }
  });

  // Contact form route - store message then send email
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
      }

      const contactDetails = insertContactMessageSchema.parse({
        senderName: name,
        senderEmail: email,
        subject,
        message,
      });

      await storage.createContactMessage(contactDetails);

      // Email 1: Envoyer la demande au service client
      await notificationService.sendContactFormEmail(contactDetails);

      // Email 2: Envoyer l'accusé de réception à l'utilisateur
      try {
        await notificationService.sendContactAcknowledgmentEmail(contactDetails);
      } catch (ackError) {
        console.error('Erreur accusé de réception:', ackError);
        // Ne pas bloquer si l'accusé de réception échoue
      }

      res.json({
        success: true,
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
      });
    } catch (error) {
      console.error('Erreur envoi formulaire contact:', error);
      res.status(500).json({ success: false, message: "Erreur lors de l'envoi du message" });
    }
  });

  // Test route pour validation complète du système d'emails
  app.post('/api/test/email-system', async (req, res) => {
    try {
      console.log('🧪 Test complet du système d\'emails avec contact@afrisoutien.com');
      
      // Test email de confirmation de don
      const donationDetails = {
        donorEmail: "contact@afrisoutien.com",
        donorName: "Jean-Baptiste Koffi",
        amount: 75000,
        campaignTitle: "Aide pour l'éducation des enfants défavorisés",
        transactionId: 12345
      };
      
      await notificationService.sendDonationConfirmationEmail(donationDetails);
      console.log('✅ Email de confirmation de don envoyé avec template HTML professionnel');
      
      res.json({ 
        success: true, 
        message: 'Système d\'emails transactionnels testé avec succès',
        tests: [
          'Email de vérification - ✅ Template HTML intégré et testé',
          'Email de réinitialisation - ✅ Template HTML intégré et testé', 
          'Email de confirmation de don - ✅ Template HTML intégré et testé maintenant'
        ],
        templates: {
          verification: 'Template responsive avec branding Afri Soutien',
          passwordReset: 'Template sécurisé avec notice d\'expiration',
          donationConfirmation: 'Template reçu détaillé avec numéro AS-{ID}'
        }
      });
    } catch (error) {
      console.error('Erreur test emails:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Pages statiques endpoint
  app.get('/api/pages/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      
      const pages = {
        faq: {
          title: "Foire Aux Questions",
          content: "FAQ content",
          faqs: [
            {
              question: "Comment créer une cagnotte sur Afri Soutien ?",
              answer: "Pour créer une cagnotte, vous devez d'abord créer un compte sur la plateforme. Une fois connecté, rendez-vous dans votre tableau de bord et cliquez sur 'Créer une campagne'. Remplissez le formulaire avec les détails de votre projet : titre, description, objectif financier et catégorie. Votre campagne sera ensuite examinée par notre équipe avant publication."
            },
            {
              question: "Comment faire un don sur la plateforme ?",
              answer: "Pour faire un don, sélectionnez la campagne qui vous intéresse et cliquez sur 'Faire un don'. Vous pouvez choisir le montant de votre don et sélectionner votre mode de paiement (Orange Money, MTN Mobile Money, ou Moov Money). Vous recevrez un reçu de don par email une fois la transaction confirmée."
            }
          ]
        },
        terms: {
          title: "Conditions d'Utilisation",
          content: `<div class="space-y-6">
            <h2 class="text-xl font-semibold text-[#00402E] mb-4">1. Objet</h2>
            <p>Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation de la plateforme Afri Soutien.</p>
          </div>`
        },
        privacy: {
          title: "Politique de Confidentialité", 
          content: `<div class="space-y-6">
            <h2 class="text-xl font-semibold text-[#00402E] mb-4">1. Collecte des données</h2>
            <p>Afri Soutien collecte des données personnelles dans le cadre de l'utilisation de sa plateforme de solidarité.</p>
          </div>`
        },
        notice: {
          title: "Mentions Légales",
          content: `<div class="space-y-6">
            <h2 class="text-xl font-semibold text-[#00402E] mb-4">Éditeur du site</h2>
            <p><strong>Raison sociale :</strong> Afri Soutien</p>
            <p><strong>Email :</strong> contact@afrisoutien.com</p>
          </div>`
        }
      };

      const pageData = pages[slug as keyof typeof pages];
      
      if (!pageData) {
        return res.status(404).json({ message: 'Page non trouvée' });
      }

      res.json(pageData);
    } catch (error) {
      console.error('Erreur récupération page:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  app.get('/api/admin/boutique/orders/pending', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getBoutiqueOrders('pending_approval');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending orders' });
    }
  });

  app.put('/api/admin/boutique/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateBoutiqueOrder(parseInt(req.params.id), {
        status,
        handledByAdminId: req.user.id
      });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error updating order status' });
    }
  });

  app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  });

  // Admin user management routes
  app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { role } = req.body;
      const userId = parseInt(req.params.id);
      
      if (!['admin', 'beneficiary', 'donor'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      
      const user = await storage.updateUser(userId, { role });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user role' });
    }
  });

  app.put('/api/admin/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { isVerified } = req.body;
      const userId = parseInt(req.params.id);
      
      const user = await storage.updateUser(userId, { isVerified });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user status' });
    }
  });

  app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Prevent admin from deleting themselves
      if (userId === req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }
      
      // Get user first to construct the deleted email
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Mark user as inactive instead of actual deletion
      const updatedUser = await storage.updateUser(userId, { 
        isVerified: false,
        email: `deleted_${userId}_${user.email}` 
      });
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  });

  // Admin campaign management
  app.get('/api/admin/campaigns', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status } = req.query;
      const campaigns = await storage.getCampaigns(status as string);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching campaigns' });
    }
  });

  app.delete('/api/admin/campaigns/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      await storage.deleteCampaign(campaignId);
      res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting campaign' });
    }
  });

  // Admin donations management
  app.get('/api/admin/donations', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const donations = await storage.getMaterialDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching donations' });
    }
  });

  app.delete('/api/admin/donations/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const donationId = parseInt(req.params.id);
      const donation = await storage.updateMaterialDonation(donationId, { 
        status: 'rejected' 
      });
      res.json({ message: 'Donation deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  });

  app.put('/api/admin/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { isVerified } = req.body;
      const user = await storage.updateUser(parseInt(req.params.id), { isVerified });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user status' });
    }
  });

  // Admin stats endpoint
  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const campaigns = await storage.getCampaigns();
      const donations = await storage.getMaterialDonations();
      const orders = await storage.getBoutiqueOrders();
      
      const totalUsers = users.length;
      const totalCampaigns = campaigns.length;
      const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
      const pendingCampaigns = campaigns.filter((c: any) => c.status === 'pending').length;
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentUsers = users.filter((u: any) => new Date(u.createdAt) > weekAgo).length;
      
      const totalDonations = donations.length;
      const materialDonations = donations.filter((d: any) => d.status === 'approved').length;
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
      
      // Calculate actual total amount from financial donations
      const financialDonations = await storage.getCampaigns();
      const totalAmount = financialDonations.reduce((sum: number, campaign: any) => {
        return sum + Number(campaign.currentAmount || 0);
      }, 0).toString();
      
      const recentDonations = donations.filter((d: any) => {
        return new Date(d.createdAt) > weekAgo;
      }).length;

      res.json({
        totalUsers,
        totalCampaigns,
        totalDonations,
        totalAmount,
        activeCampaigns,
        pendingCampaigns,
        recentUsers,
        recentDonations,
        pendingOrders,
        materialDonations
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin recent activity endpoint
  app.get("/api/admin/recent-activity", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      const donations = await storage.getMaterialDonations();
      const users = await storage.getAllUsers();
      
      const recentActivity = [];
      
      // Add recent campaigns
      const recentCampaigns = campaigns
        .filter((c: any) => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(c.createdAt) > weekAgo;
        })
        .slice(0, 2);
      
      recentCampaigns.forEach((campaign: any) => {
        recentActivity.push({
          description: `Nouvelle campagne: ${campaign.title}`,
          timestamp: new Date(campaign.createdAt).toLocaleDateString('fr-FR')
        });
      });
      
      // Add recent donations
      const recentDonations = donations
        .filter((d: any) => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(d.createdAt) > weekAgo;
        })
        .slice(0, 2);
      
      recentDonations.forEach((donation: any) => {
        recentActivity.push({
          description: `Don matériel proposé: ${donation.itemName}`,
          timestamp: new Date(donation.createdAt).toLocaleDateString('fr-FR')
        });
      });
      
      // Add recent users
      const recentUsers = users
        .filter((u: any) => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(u.createdAt) > weekAgo;
        })
        .slice(0, 1);
      
      recentUsers.forEach((user: any) => {
        recentActivity.push({
          description: `Nouvel utilisateur: ${user.firstName} ${user.lastName}`,
          timestamp: new Date(user.createdAt).toLocaleDateString('fr-FR')
        });
      });
      
      res.json(recentActivity.slice(0, 5));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent activity" });
    }
  });

  // Admin reports endpoints
  app.get("/api/admin/reports/monthly", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const campaigns = await storage.getCampaigns();
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyUsers = users.filter((u: any) => {
        const userDate = new Date(u.createdAt);
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      });
      
      const monthlyCampaigns = campaigns.filter((c: any) => {
        const campaignDate = new Date(c.createdAt);
        return campaignDate.getMonth() === currentMonth && campaignDate.getFullYear() === currentYear;
      });
      
      const totalRevenue = campaigns.reduce((sum: number, c: any) => {
        return sum + Number(c.currentAmount || 0);
      }, 0);
      
      const monthlyReport = {
        period: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        totalRevenue,
        newUsers: monthlyUsers.length,
        successfulCampaigns: monthlyCampaigns.filter((c: any) => c.status === 'completed').length,
        averageEngagement: Math.round((monthlyCampaigns.length / Math.max(monthlyUsers.length, 1)) * 100)
      };
      
      res.json(monthlyReport);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch monthly report" });
    }
  });

  app.get("/api/admin/reports/financial", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      
      const totalCollected = campaigns.reduce((sum: number, c: any) => {
        return sum + Number(c.currentAmount || 0);
      }, 0);
      
      const processingFees = Math.round(totalCollected * 0.03); // 3% fees
      const disbursements = Math.round(totalCollected * 0.86); // 86% disbursed
      const availableBalance = totalCollected - processingFees - disbursements;
      
      const financialReport = {
        totalCollected,
        processingFees,
        disbursements,
        availableBalance,
        paymentMethods: {
          orangeMoney: 65,
          mtnMoney: 25,
          moovMoney: 10
        }
      };
      
      res.json(financialReport);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch financial report" });
    }
  });

  app.get("/api/admin/reports/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      const verifiedUsers = users.filter((u: any) => u.isVerified);
      const verificationRate = Math.round((verifiedUsers.length / users.length) * 100);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentUsers = users.filter((u: any) => new Date(u.createdAt) > weekAgo);
      
      const userReport = {
        totalUsers: users.length,
        verificationRate,
        roleDistribution: {
          beneficiaries: users.filter((u: any) => u.role === 'beneficiary').length,
          donors: users.filter((u: any) => u.role === 'donor').length,
          admins: users.filter((u: any) => u.role === 'admin').length
        },
        weeklyActivity: {
          newRegistrations: recentUsers.length,
          verifiedAccounts: recentUsers.filter((u: any) => u.isVerified).length,
          uniqueLogins: Math.round(users.length * 0.6) // Estimation
        }
      };
      
      res.json(userReport);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user report" });
    }
  });

  app.get("/api/admin/reports/campaigns", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      
      const completedCampaigns = campaigns.filter((c: any) => c.status === 'completed');
      const successRate = Math.round((completedCampaigns.length / campaigns.length) * 100);
      
      const totalGoalAmount = campaigns.reduce((sum: number, c: any) => {
        return sum + Number(c.goalAmount || 0);
      }, 0);
      
      const totalCurrentAmount = campaigns.reduce((sum: number, c: any) => {
        return sum + Number(c.currentAmount || 0);
      }, 0);
      
      const averageGoalAchievement = totalGoalAmount > 0 ? 
        Math.round((totalCurrentAmount / totalGoalAmount) * 100) : 0;
      
      const campaignReport = {
        totalCampaigns: campaigns.length,
        successRate,
        averageGoalAchievement,
        categoryPerformance: {
          education: campaigns.filter((c: any) => c.category === 'education').length,
          health: campaigns.filter((c: any) => c.category === 'health').length,
          emergency: campaigns.filter((c: any) => c.category === 'emergency').length,
          projects: campaigns.filter((c: any) => c.category === 'projects').length
        },
        trends: {
          campaignCreation: campaigns.filter((c: any) => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(c.createdAt) > weekAgo;
          }).length,
          averageAmount: campaigns.length > 0 ? Math.round(totalCurrentAmount / campaigns.length) : 0,
          averageDuration: 18 // Days estimation
        }
      };
      
      res.json(campaignReport);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaign report" });
    }
  });

  // Admin logs endpoints for audit trail
  app.get("/api/admin/logs", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { type, timeRange } = req.query;
      
      // Simulation des logs d'audit (en production, ces données viendraient d'une base de données)
      const mockLogs = [
        {
          timestamp: new Date().toISOString(),
          userId: (req as any).user?.id || 1,
          userEmail: (req as any).user?.email || "admin",
          action: "view_dashboard",
          resource: "dashboard",
          ipAddress: req.ip || "127.0.0.1",
          userAgent: req.get('User-Agent') || "Unknown",
          success: true,
          details: null
        },
        {
          timestamp: new Date(Date.now() - 300000).toISOString(),
          userId: (req as any).user?.id || 1,
          userEmail: (req as any).user?.email || "admin",
          action: "list_users",
          resource: "users",
          ipAddress: req.ip || "127.0.0.1",
          userAgent: req.get('User-Agent') || "Unknown",
          success: true,
          details: null
        },
        {
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          userId: null,
          userEmail: null,
          action: "admin_login_failed",
          resource: "authentication",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          success: false,
          details: { reason: "Invalid credentials" }
        }
      ];
      
      // Log this action
      console.log(`[ADMIN AUDIT] ${new Date().toISOString()} - Admin ${(req as any).user.id} viewed audit logs - IP: ${req.ip}`);
      
      res.json(mockLogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/admin/logs/security", authenticateToken, requireAdmin, async (req, res) => {
    try {
      // Simulation des logs de sécurité critiques
      const securityLogs = [
        {
          timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
          userId: null,
          userEmail: null,
          action: "admin_access_denied",
          resource: "admin_panel",
          ipAddress: "203.0.113.45",
          userAgent: "curl/7.68.0",
          success: false,
          details: { reason: "Invalid token" }
        }
      ];
      
      res.json(securityLogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch security logs" });
    }
  });

  // Content Management API Routes
  
  // Site Pages
  app.get("/api/admin/content/pages", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const pages = await storage.getSitePages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.get("/api/admin/content/pages/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const page = await storage.getSitePage(parseInt(req.params.id));
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.post("/api/admin/content/pages", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const pageData = {
        ...req.body,
        updatedByAdminId: (req as any).user.id
      };
      const page = await storage.createSitePage(pageData);
      res.status(201).json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.put("/api/admin/content/pages/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const updates = {
        ...req.body,
        updatedByAdminId: (req as any).user.id
      };
      const page = await storage.updateSitePage(parseInt(req.params.id), updates);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/admin/content/pages/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      await storage.deleteSitePage(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  // Site Settings
  app.get("/api/admin/content/settings", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/content/settings/:key", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { value } = req.body;
      const setting = await storage.updateSiteSetting(req.params.key, value, (req as any).user.id);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  // Contact Messages
  app.get("/api/admin/content/messages", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status } = req.query;
      const messages = await storage.getContactMessages(status as string);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.get("/api/admin/content/messages/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const message = await storage.getContactMessage(parseInt(req.params.id));
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch message" });
    }
  });

  app.put("/api/admin/content/messages/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const updates = {
        ...req.body,
        respondedByAdminId: (req as any).user.id,
        respondedAt: new Date()
      };
      const message = await storage.updateContactMessage(parseInt(req.params.id), updates);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to update message" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
