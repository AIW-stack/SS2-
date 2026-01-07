
import { Subscription, SpendData, Advertisement, Expense, PaymentIntegration, WalletData, Contact } from './types';

export const MOCK_CONTACTS: Contact[] = [
  { name: 'Arjun Sharma', phone: '+91 98765 43210', referred: false },
  { name: 'Priya Patel', phone: '+91 91234 56789', referred: false },
  { name: 'Rohan Gupta', phone: '+91 88888 77777', referred: false },
  { name: 'Ananya Iyer', phone: '+91 77665 54433', referred: false },
  { name: 'Vikram Singh', phone: '+91 99000 11223', referred: false },
  { name: 'Saira Khan', phone: '+91 98989 89898', referred: false },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    name: 'Netflix Premium',
    amount: 649,
    currency: '₹',
    frequency: 'Monthly',
    category: 'OTT',
    nextRenewal: '2024-06-15',
    paymentMethod: 'UPI Autopay',
    status: 'Active',
    usageLevel: 'High',
    usageMinutes: 1240,
    icon: '🎬'
  },
  {
    id: '2',
    name: 'Zomato Gold',
    amount: 999,
    currency: '₹',
    frequency: 'Yearly',
    category: 'Food',
    nextRenewal: '2024-06-02',
    paymentMethod: 'Credit Card',
    status: 'Expiring Soon',
    usageLevel: 'Low',
    usageMinutes: 15,
    icon: '🍕'
  },
  {
    id: '3',
    name: 'HDFC Regalia Prime',
    amount: 2500,
    currency: '₹',
    frequency: 'Yearly',
    category: 'Other',
    nextRenewal: '2025-01-20',
    paymentMethod: 'Credit Card',
    status: 'Active',
    usageLevel: 'High',
    usageMinutes: 450,
    icon: '💳'
  },
  {
    id: '4',
    name: 'Swiggy One',
    amount: 249,
    currency: '₹',
    frequency: 'Quarterly',
    category: 'Food',
    nextRenewal: '2024-07-10',
    paymentMethod: 'UPI Autopay',
    status: 'Active',
    usageLevel: 'Medium',
    usageMinutes: 180,
    icon: '🍔'
  },
  {
    id: '5',
    name: 'ICICI Amazon Pay',
    amount: 0,
    currency: '₹',
    frequency: 'Yearly',
    category: 'Other',
    nextRenewal: '2024-12-12',
    paymentMethod: 'Credit Card',
    status: 'Active',
    usageLevel: 'High',
    usageMinutes: 600,
    icon: '💳'
  },
  {
    id: '6',
    name: 'Hotstar Super',
    amount: 899,
    currency: '₹',
    frequency: 'Yearly',
    category: 'OTT',
    nextRenewal: '2024-08-05',
    paymentMethod: 'UPI Autopay',
    status: 'Active',
    usageLevel: 'Zero',
    usageMinutes: 0,
    icon: '⭐'
  }
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'l1', name: 'Jio Postpaid', amount: 749, dueDate: '2024-06-05', status: 'Pending', icon: '📱', group: 'Life', category: 'Phone' },
  { id: 'l2', name: 'Airtel Xstream', amount: 1179, dueDate: '2024-06-12', status: 'Paid', icon: '🌐', group: 'Life', category: 'Wifi' },
  { id: 'l3', name: 'BPCL Petrol', amount: 4500, dueDate: '2024-05-28', status: 'Paid', icon: '⛽', group: 'Life', category: 'Fuel' },
  { id: 'f1', name: 'Netflix Premium', amount: 649, dueDate: '2024-06-15', status: 'Pending', icon: '🎬', group: 'Flexible', category: 'OTT' },
  { id: 'f2', name: 'Swiggy Orders', amount: 3200, dueDate: '2024-06-20', status: 'Pending', icon: '🥡', group: 'Flexible', category: 'Food' },
  { id: 'f3', name: 'Notion Pro', amount: 800, dueDate: '2024-06-08', status: 'Paid', icon: '📝', group: 'Flexible', category: 'Productivity' },
  { id: 'f4', name: 'Coursera Plus', amount: 3500, dueDate: '2024-07-01', status: 'Pending', icon: '🎓', group: 'Flexible', category: 'Digital Learning' },
  { id: 'f5', name: 'Spotify Individual', amount: 119, dueDate: '2024-06-25', status: 'Paid', icon: '🎵', group: 'Flexible', category: 'Music' }
];

export const MOCK_PAYMENT_SOURCES: PaymentIntegration[] = [
  { id: 'ps1', name: 'PhonePe', type: 'UPI', provider: 'NPCI', status: 'Linked', icon: '🟣', count: 4 },
  { id: 'ps2', name: 'HDFC Regalia', type: 'Card', provider: 'Visa', status: 'Linked', icon: '💳', count: 2 },
  { id: 'ps3', name: 'Google Pay', type: 'UPI', provider: 'NPCI', status: 'Linked', icon: '🟢', count: 1 },
  { id: 'ps4', name: 'SBI Bank', type: 'Bank', provider: 'AA', status: 'Pending', icon: '🏦', count: 0 }
];

export const MOCK_WALLET: WalletData = {
  balance: 14500,
  currency: '₹',
  status: 'Protected',
  vaultId: 'SH-VLT-8892'
};

export const MOCK_SPEND_HISTORY: SpendData[] = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 1450 },
  { month: 'Mar', amount: 2100 },
  { month: 'Apr', amount: 1850 },
  { month: 'May', amount: 2400 },
  { month: 'Jun', amount: 2800 },
];

export const MOCK_ADS: Advertisement[] = [
  { id: 'ad1', brand: 'Disney+ Hotstar', offer: 'Get 30% off on Annual Plan. ICC World Cup live!', icon: '🏏', cta: 'Subscribe Now' },
  { id: 'ad2', brand: 'Cult.fit', offer: 'Unused gym membership? Switch to Cult.fit for ₹999/mo', icon: '🏋️', cta: 'Try Free' }
];

export const MOCK_WINBACK_ADS: Advertisement[] = [
  { id: 'wb1', brand: 'Spotify Premium', offer: 'Miss your playlists? Get 3 months for ₹59. Limited time!', icon: '🎵', cta: 'Come Back' },
  { id: 'wb2', brand: 'YouTube Premium', offer: 'Ad-free videos are waiting. Restart for ₹129/mo.', icon: '📺', cta: 'Restart Sub' },
  { id: 'wb3', brand: 'SonyLIV', offer: 'Stream UEFA Euro 2024. Flat 50% off for returning users.', icon: '⚽', cta: 'Claim Offer' }
];
