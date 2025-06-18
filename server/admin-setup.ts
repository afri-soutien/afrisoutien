import { hashPassword } from "./auth";
import { storage } from "./storage";

// Configuration sécurisée des identifiants admin
const ADMIN_CONFIG = {
  email: process.env.ADMIN_EMAIL || 'admin@afrisoutien.com',
  password: process.env.ADMIN_PASSWORD || 'changeme123',
  firstName: 'Admin',
  lastName: 'System'
};

export async function ensureAdminExists() {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await storage.getUserByEmail(ADMIN_CONFIG.email);

    if (!existingAdmin) {
      // Créer le compte admin
      const hashedPassword = await hashPassword(ADMIN_CONFIG.password);

      await storage.createUser({
        email: ADMIN_CONFIG.email,
        passwordHash: hashedPassword,
        firstName: ADMIN_CONFIG.firstName,
        lastName: ADMIN_CONFIG.lastName,
        role: 'admin',
        isVerified: true
      });

      console.log('[SECURITY] Admin account created successfully');
    } else if (existingAdmin.role !== 'admin') {
      // Mettre à jour le rôle si nécessaire
      await storage.updateUser(existingAdmin.id, { role: 'admin' });
      console.log('[SECURITY] Admin role updated successfully');
    } else {
      console.log('[SECURITY] Admin account already exists with correct role');
    }
  } catch (error) {
    console.error('[SECURITY] Failed to setup admin account:', error);
  }
}

// Fonction de mise à jour du mot de passe admin (pour usage unique)
export async function updateAdminPassword(newPassword: string) {
  try {
    const admin = await storage.getUserByEmail(ADMIN_CONFIG.email);
    if (admin) {
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(admin.id, { passwordHash: hashedPassword });
      console.log('[SECURITY] Admin password updated successfully');
    } else {
      console.log('[SECURITY] Admin not found for password update');
    }
  } catch (error) {
    console.error('[SECURITY] Failed to update admin password:', error);
  }
}