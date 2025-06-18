import { 
  users, campaigns, financialDonations, materialDonations, boutiqueItems, boutiqueOrders,
  sitePages, siteSettings, contactMessages,
  type User, type InsertUser, type Campaign, type InsertCampaign,
  type FinancialDonation, type InsertFinancialDonation,
  type MaterialDonation, type InsertMaterialDonation,
  type BoutiqueItem, type InsertBoutiqueItem,
  type BoutiqueOrder, type InsertBoutiqueOrder,
  type SitePage, type InsertSitePage,
  type SiteSetting, type InsertSiteSetting,
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Campaigns
  getCampaigns(status?: string, limit?: number): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<void>;
  getUserCampaigns(userId: number): Promise<Campaign[]>;
  
  // Financial Donations
  createDonation(donation: InsertFinancialDonation): Promise<FinancialDonation>;
  updateDonation(id: number, updates: Partial<FinancialDonation>): Promise<FinancialDonation | undefined>;
  getDonationsByOperatorTxId(txId: string): Promise<FinancialDonation | undefined>;
  
  // Material Donations
  createMaterialDonation(donation: InsertMaterialDonation): Promise<MaterialDonation>;
  getMaterialDonations(status?: string): Promise<MaterialDonation[]>;
  updateMaterialDonation(id: number, updates: Partial<MaterialDonation>): Promise<MaterialDonation | undefined>;
  
  // Boutique Items
  getBoutiqueItems(status?: string, category?: string): Promise<BoutiqueItem[]>;
  getBoutiqueItem(id: number): Promise<BoutiqueItem | undefined>;
  createBoutiqueItem(item: InsertBoutiqueItem): Promise<BoutiqueItem>;
  updateBoutiqueItem(id: number, updates: Partial<BoutiqueItem>): Promise<BoutiqueItem | undefined>;
  
  // Boutique Orders
  createBoutiqueOrder(order: InsertBoutiqueOrder): Promise<BoutiqueOrder>;
  getBoutiqueOrders(status?: string, userId?: number): Promise<BoutiqueOrder[]>;
  updateBoutiqueOrder(id: number, updates: Partial<BoutiqueOrder>): Promise<BoutiqueOrder | undefined>;
  getUserOrders(userId: number): Promise<BoutiqueOrder[]>;
  
  // Content Management
  getSitePages(): Promise<SitePage[]>;
  getSitePage(id: number): Promise<SitePage | undefined>;
  getSitePageBySlug(slug: string): Promise<SitePage | undefined>;
  createSitePage(page: InsertSitePage): Promise<SitePage>;
  updateSitePage(id: number, updates: Partial<SitePage>): Promise<SitePage | undefined>;
  deleteSitePage(id: number): Promise<void>;
  
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  updateSiteSetting(key: string, value: string, updatedByAdminId: number): Promise<SiteSetting>;
  
  getContactMessages(status?: string): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: number, updates: Partial<ContactMessage>): Promise<ContactMessage | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Campaigns
  async getCampaigns(status?: string, limit?: number): Promise<Campaign[]> {
    let query = db.select().from(campaigns);
    
    if (status) {
      query = query.where(eq(campaigns.status, status));
    }
    
    query = query.orderBy(desc(campaigns.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db
      .insert(campaigns)
      .values(campaign)
      .returning();
    return newCampaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const [campaign] = await db
      .update(campaigns)
      .set(updates)
      .where(eq(campaigns.id, id))
      .returning();
    return campaign || undefined;
  }

  async deleteCampaign(id: number): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  async getUserCampaigns(userId: number): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId))
      .orderBy(desc(campaigns.createdAt));
  }

  // Financial Donations
  async createDonation(donation: InsertFinancialDonation): Promise<FinancialDonation> {
    const [newDonation] = await db
      .insert(financialDonations)
      .values(donation)
      .returning();
    return newDonation;
  }

  async updateDonation(id: number, updates: Partial<FinancialDonation>): Promise<FinancialDonation | undefined> {
    const [donation] = await db
      .update(financialDonations)
      .set(updates)
      .where(eq(financialDonations.id, id))
      .returning();
    return donation || undefined;
  }

  async getDonationsByOperatorTxId(txId: string): Promise<FinancialDonation | undefined> {
    const [donation] = await db
      .select()
      .from(financialDonations)
      .where(eq(financialDonations.operatorTransactionId, txId));
    return donation || undefined;
  }

  // Material Donations
  async createMaterialDonation(donation: InsertMaterialDonation): Promise<MaterialDonation> {
    const [newDonation] = await db
      .insert(materialDonations)
      .values(donation)
      .returning();
    return newDonation;
  }

  async getMaterialDonations(status?: string): Promise<MaterialDonation[]> {
    let query = db.select().from(materialDonations);
    
    if (status) {
      query = query.where(eq(materialDonations.status, status));
    }
    
    return await query.orderBy(desc(materialDonations.createdAt));
  }

  async updateMaterialDonation(id: number, updates: Partial<MaterialDonation>): Promise<MaterialDonation | undefined> {
    const [donation] = await db
      .update(materialDonations)
      .set(updates)
      .where(eq(materialDonations.id, id))
      .returning();
    return donation || undefined;
  }

  // Boutique Items
  async getBoutiqueItems(status?: string, category?: string): Promise<BoutiqueItem[]> {
    let query = db.select().from(boutiqueItems);
    
    const conditions = [];
    if (status) {
      conditions.push(eq(boutiqueItems.status, status));
    }
    if (category) {
      conditions.push(eq(boutiqueItems.category, category));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(boutiqueItems.publishedAt));
  }

  async getBoutiqueItem(id: number): Promise<BoutiqueItem | undefined> {
    const [item] = await db.select().from(boutiqueItems).where(eq(boutiqueItems.id, id));
    return item || undefined;
  }

  async createBoutiqueItem(item: InsertBoutiqueItem): Promise<BoutiqueItem> {
    const [newItem] = await db
      .insert(boutiqueItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateBoutiqueItem(id: number, updates: Partial<BoutiqueItem>): Promise<BoutiqueItem | undefined> {
    const [item] = await db
      .update(boutiqueItems)
      .set(updates)
      .where(eq(boutiqueItems.id, id))
      .returning();
    return item || undefined;
  }

  // Boutique Orders
  async createBoutiqueOrder(order: InsertBoutiqueOrder): Promise<BoutiqueOrder> {
    const [newOrder] = await db
      .insert(boutiqueOrders)
      .values(order)
      .returning();
    return newOrder;
  }

  async getBoutiqueOrders(status?: string, userId?: number): Promise<BoutiqueOrder[]> {
    let query = db.select().from(boutiqueOrders);
    
    const conditions = [];
    if (status) {
      conditions.push(eq(boutiqueOrders.status, status));
    }
    if (userId) {
      conditions.push(eq(boutiqueOrders.userId, userId));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(boutiqueOrders.createdAt));
  }

  async updateBoutiqueOrder(id: number, updates: Partial<BoutiqueOrder>): Promise<BoutiqueOrder | undefined> {
    const [order] = await db
      .update(boutiqueOrders)
      .set(updates)
      .where(eq(boutiqueOrders.id, id))
      .returning();
    return order || undefined;
  }

  async getUserOrders(userId: number): Promise<BoutiqueOrder[]> {
    return await db
      .select()
      .from(boutiqueOrders)
      .where(eq(boutiqueOrders.userId, userId))
      .orderBy(desc(boutiqueOrders.createdAt));
  }

  // Content Management
  async getSitePages(): Promise<SitePage[]> {
    return await db
      .select()
      .from(sitePages)
      .orderBy(desc(sitePages.updatedAt));
  }

  async getSitePage(id: number): Promise<SitePage | undefined> {
    const [page] = await db.select().from(sitePages).where(eq(sitePages.id, id));
    return page || undefined;
  }

  async getSitePageBySlug(slug: string): Promise<SitePage | undefined> {
    const [page] = await db.select().from(sitePages).where(eq(sitePages.slug, slug));
    return page || undefined;
  }

  async createSitePage(page: InsertSitePage): Promise<SitePage> {
    const [newPage] = await db
      .insert(sitePages)
      .values({
        ...page,
        updatedAt: new Date(),
      })
      .returning();
    return newPage;
  }

  async updateSitePage(id: number, updates: Partial<SitePage>): Promise<SitePage | undefined> {
    const [page] = await db
      .update(sitePages)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(sitePages.id, id))
      .returning();
    return page || undefined;
  }

  async deleteSitePage(id: number): Promise<void> {
    await db.delete(sitePages).where(eq(sitePages.id, id));
  }

  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db
      .select()
      .from(siteSettings)
      .orderBy(siteSettings.category, siteSettings.key);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async updateSiteSetting(key: string, value: string, updatedByAdminId: number): Promise<SiteSetting> {
    const existingSetting = await this.getSiteSetting(key);
    
    if (existingSetting) {
      const [setting] = await db
        .update(siteSettings)
        .set({
          value,
          updatedAt: new Date(),
          updatedByAdminId,
        })
        .where(eq(siteSettings.key, key))
        .returning();
      return setting;
    } else {
      const [setting] = await db
        .insert(siteSettings)
        .values({
          key,
          value,
          updatedByAdminId,
          type: 'text',
          category: 'general',
        })
        .returning();
      return setting;
    }
  }

  async getContactMessages(status?: string): Promise<ContactMessage[]> {
    let query = db.select().from(contactMessages);
    
    if (status) {
      query = query.where(eq(contactMessages.status, status));
    }
    
    return await query.orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message || undefined;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async updateContactMessage(id: number, updates: Partial<ContactMessage>): Promise<ContactMessage | undefined> {
    const [message] = await db
      .update(contactMessages)
      .set(updates)
      .where(eq(contactMessages.id, id))
      .returning();
    return message || undefined;
  }
}

export const storage = new DatabaseStorage();
