export type TransactionType = 'income' | 'expense' | 'transfer';
export type Division = 'personal' | 'office';

export const CATEGORIES = [
  'salary', 'freelance', 'investment', 'food', 'fuel', 'transport',
  'entertainment', 'movie', 'shopping', 'medical', 'loan', 'rent',
  'utilities', 'education', 'travel', 'gifts', 'other'
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_ICONS: Record<Category, string> = {
  salary: '💰', freelance: '💼', investment: '📈', food: '🍔',
  fuel: '⛽', transport: '🚗', entertainment: '🎮', movie: '🎬',
  shopping: '🛍️', medical: '🏥', loan: '🏦', rent: '🏠',
  utilities: '💡', education: '📚', travel: '✈️', gifts: '🎁', other: '📋',
};

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: Category;
  division: Division;
  accountId: string;
  toAccountId?: string; // for transfers
  date: string; // ISO string
  createdAt: string; // ISO string
}

export interface Account {
  id: string;
  name: string;
  icon: string;
  balance: number;
}

export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
