
export type UserPersona = 'Student' | 'Riser' | 'Senior' | 'Family man';

export interface Contact {
  name: string;
  phone: string;
  referred: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  frequency: 'Monthly' | 'Yearly' | 'Quarterly';
  category: 'OTT' | 'Food' | 'Gaming' | 'Fitness' | 'Utilities' | 'Cloud' | 'Other';
  nextRenewal: string;
  paymentMethod: 'UPI Autopay' | 'Credit Card' | 'Debit Card' | 'App Store';
  status: 'Active' | 'Paused' | 'Expiring Soon';
  usageLevel: 'High' | 'Medium' | 'Low' | 'Zero';
  usageMinutes?: number; // Minutes used this month
  icon: string;
}

export interface PaymentIntegration {
  id: string;
  name: string;
  type: 'UPI' | 'Card' | 'Bank';
  provider: string;
  status: 'Detected' | 'Linked' | 'Pending';
  icon: string;
  count: number; // Number of mandates/subscriptions found
}

export interface WalletData {
  balance: number;
  currency: string;
  status: 'Protected' | 'Scanning' | 'Locked';
  vaultId: string;
}

export interface ExploreInsight {
  id: string;
  title: string;
  description: string;
  sourceLabel: string;
  type: 'Price Hike' | 'New Deal' | 'Trending' | 'Alternative' | 'Current Affair';
  actionType: 'Subscribe' | 'Unsubscribe' | 'Pause' | 'None';
  targetService: string;
  relevance: string; // Explaining why based on current affairs/usage
  ctaLabel: string;
  icon?: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  icon: string;
  group: 'Life' | 'Flexible';
  category: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  type: 'Cancel' | 'Downgrade' | 'Duplicate' | 'Family' | 'Pause';
  actionLabel: string;
}

export interface SpendData {
  month: string;
  amount: number;
}

export interface Advertisement {
  id: string;
  brand: string;
  offer: string;
  icon: string;
  cta: string;
}
