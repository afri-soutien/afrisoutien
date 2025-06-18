import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("beneficiary"),
  isVerified: boolean("is_verified").notNull().default(false),
  emailVerificationToken: varchar("email_verification_token", { length: 255 }),
  passwordResetToken: varchar("password_reset_token", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Campaigns table
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  goalAmount: decimal("goal_amount", { precision: 12, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 12, scale: 2 }).notNull().default("0.00"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  imageUrls: jsonb("image_urls"),
  category: varchar("category", { length: 100 }),
});

// Financial donations table
export const financialDonations = pgTable("financial_donations", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  userId: integer("user_id").references(() => users.id),
  donorName: varchar("donor_name", { length: 255 }),
  donorEmail: varchar("donor_email", { length: 255 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentOperator: varchar("payment_operator", { length: 50 }).notNull(),
  operatorTransactionId: varchar("operator_transaction_id", { length: 255 }).unique(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Material donations table
export const materialDonations = pgTable("material_donations", {
  id: serial("id").primaryKey(),
  donorName: varchar("donor_name", { length: 255 }).notNull(),
  donorContact: varchar("donor_contact", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrls: jsonb("image_urls"),
  pickupLocation: varchar("pickup_location", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending_verification"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  category: varchar("category", { length: 100 }),
});

// Boutique items table
export const boutiqueItems = pgTable("boutique_items", {
  id: serial("id").primaryKey(),
  sourceDonationId: integer("source_donation_id").references(() => materialDonations.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrls: jsonb("image_urls"),
  category: varchar("category", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("available"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  publishedByAdminId: integer("published_by_admin_id").notNull().references(() => users.id),
});

// Boutique orders table
export const boutiqueOrders = pgTable("boutique_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  itemId: integer("item_id").notNull().references(() => boutiqueItems.id),
  motivationMessage: text("motivation_message"),
  status: varchar("status", { length: 50 }).notNull().default("pending_approval"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  handledByAdminId: integer("handled_by_admin_id").references(() => users.id),
  requesterName: varchar("requester_name", { length: 255 }).notNull(),
  requesterEmail: varchar("requester_email", { length: 255 }).notNull(),
  requesterPhone: varchar("requester_phone", { length: 50 }),
  requestReason: text("request_reason").notNull(),
  deliveryAddress: text("delivery_address"),
});

// Content Management Tables
export const sitePages = pgTable("site_pages", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  metaDescription: text("meta_description"),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedByAdminId: integer("updated_by_admin_id").notNull().references(() => users.id),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("text"),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull().default("general"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedByAdminId: integer("updated_by_admin_id").notNull().references(() => users.id),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  senderName: varchar("sender_name", { length: 255 }).notNull(),
  senderEmail: varchar("sender_email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("unread"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  respondedAt: timestamp("responded_at"),
  respondedByAdminId: integer("responded_by_admin_id").references(() => users.id),
  adminResponse: text("admin_response"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaigns),
  financialDonations: many(financialDonations),
  boutiqueOrders: many(boutiqueOrders),
  publishedItems: many(boutiqueItems),
  handledOrders: many(boutiqueOrders),
  updatedPages: many(sitePages),
  updatedSettings: many(siteSettings),
  respondedMessages: many(contactMessages),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  donations: many(financialDonations),
}));

export const financialDonationsRelations = relations(financialDonations, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [financialDonations.campaignId],
    references: [campaigns.id],
  }),
  user: one(users, {
    fields: [financialDonations.userId],
    references: [users.id],
  }),
}));

export const materialDonationsRelations = relations(materialDonations, ({ many }) => ({
  boutiqueItems: many(boutiqueItems),
}));

export const boutiqueItemsRelations = relations(boutiqueItems, ({ one, many }) => ({
  sourceDonation: one(materialDonations, {
    fields: [boutiqueItems.sourceDonationId],
    references: [materialDonations.id],
  }),
  publishedBy: one(users, {
    fields: [boutiqueItems.publishedByAdminId],
    references: [users.id],
  }),
  orders: many(boutiqueOrders),
}));

export const boutiqueOrdersRelations = relations(boutiqueOrders, ({ one }) => ({
  user: one(users, {
    fields: [boutiqueOrders.userId],
    references: [users.id],
  }),
  item: one(boutiqueItems, {
    fields: [boutiqueOrders.itemId],
    references: [boutiqueItems.id],
  }),
  handledBy: one(users, {
    fields: [boutiqueOrders.handledByAdminId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  passwordHash: true,
  emailVerificationToken: true,
  passwordResetToken: true,
}).extend({
  password: z.string().min(8),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  currentAmount: true,
  status: true,
}).extend({
  goalAmount: z.union([z.string(), z.number()]).transform(val => String(val)),
});

export const insertFinancialDonationSchema = createInsertSchema(financialDonations).omit({
  id: true,
  createdAt: true,
  status: true,
  operatorTransactionId: true,
});

export const insertMaterialDonationSchema = createInsertSchema(materialDonations).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertBoutiqueItemSchema = createInsertSchema(boutiqueItems).omit({
  id: true,
  publishedAt: true,
  status: true,
});

export const insertBoutiqueOrderSchema = createInsertSchema(boutiqueOrders).omit({
  id: true,
  createdAt: true,
  status: true,
  handledByAdminId: true,
});

export const insertSitePageSchema = createInsertSchema(sitePages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  status: true,
  respondedAt: true,
  respondedByAdminId: true,
  adminResponse: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type FinancialDonation = typeof financialDonations.$inferSelect;
export type InsertFinancialDonation = z.infer<typeof insertFinancialDonationSchema>;
export type MaterialDonation = typeof materialDonations.$inferSelect;
export type InsertMaterialDonation = z.infer<typeof insertMaterialDonationSchema>;
export type BoutiqueItem = typeof boutiqueItems.$inferSelect;
export type InsertBoutiqueItem = z.infer<typeof insertBoutiqueItemSchema>;
export type BoutiqueOrder = typeof boutiqueOrders.$inferSelect;
export type InsertBoutiqueOrder = z.infer<typeof insertBoutiqueOrderSchema>;
export type SitePage = typeof sitePages.$inferSelect;
export type InsertSitePage = z.infer<typeof insertSitePageSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
