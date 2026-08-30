export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";
export type OrderStatus = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED" | "REFUNDED";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: Role;
  active: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  image: string;
  images: string[];
  category: string;
  badge?: string;
  stock: number;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationLabel: string;
  sortOrder: number;
  active: boolean;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  offerId: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  slogan: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  logoImage: string;
  primaryColor: string;
  secondaryColor: string;
  discordUrl: string;
  footerText: string;
  maintenance: boolean;
  contactEmail: string;
  snowEnabled: boolean;
  musicEnabled: boolean;
  musicVolume: number;
  faq: { question: string; answer: string }[];
  paymentEnabled: boolean;
  paymentName: string;
  paypalEmail: string;
  paymentInstructions: string;
  musicUrl: string;
  musicStartSeconds: number;
}

export interface LogEntry {
  id: string;
  type: string;
  userId?: string;
  description: string;
  createdAt: string;
  ip?: string;
}
