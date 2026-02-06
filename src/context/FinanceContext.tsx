import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Transaction, Account, TransactionType, Category, Division } from '@/types/finance';

interface FinanceContextType {
  transactions: Transaction[];
  accounts: Account[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => boolean;
  deleteTransaction: (id: string) => boolean;
  canEdit: (tx: Transaction) => boolean;
  addAccount: (name: string, icon: string, balance: number) => void;
  transferBetweenAccounts: (fromId: string, toId: string, amount: number, description: string, date: string) => void;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

const defaultAccounts: Account[] = [
  { id: 'cash', name: 'Cash', icon: '💵', balance: 5000 },
  { id: 'bank', name: 'Bank Account', icon: '🏦', balance: 25000 },
  { id: 'wallet', name: 'Digital Wallet', icon: '📱', balance: 3000 },
];

const sampleTransactions: Transaction[] = [
  { id: '1', type: 'income', amount: 50000, description: 'Monthly Salary', category: 'salary', division: 'office', accountId: 'bank', date: new Date(2026, 1, 1).toISOString(), createdAt: new Date(2026, 1, 1).toISOString() },
  { id: '2', type: 'expense', amount: 2500, description: 'Grocery shopping', category: 'food', division: 'personal', accountId: 'cash', date: new Date(2026, 1, 2).toISOString(), createdAt: new Date(2026, 1, 2).toISOString() },
  { id: '3', type: 'expense', amount: 1500, description: 'Uber rides', category: 'transport', division: 'office', accountId: 'wallet', date: new Date(2026, 1, 3).toISOString(), createdAt: new Date(2026, 1, 3).toISOString() },
  { id: '4', type: 'expense', amount: 800, description: 'Netflix & Spotify', category: 'entertainment', division: 'personal', accountId: 'bank', date: new Date(2026, 1, 3).toISOString(), createdAt: new Date(2026, 1, 3).toISOString() },
  { id: '5', type: 'income', amount: 15000, description: 'Freelance project', category: 'freelance', division: 'personal', accountId: 'wallet', date: new Date(2026, 1, 4).toISOString(), createdAt: new Date(2026, 1, 4).toISOString() },
  { id: '6', type: 'expense', amount: 3000, description: 'Fuel for car', category: 'fuel', division: 'personal', accountId: 'cash', date: new Date(2026, 1, 5).toISOString(), createdAt: new Date(2026, 1, 5).toISOString() },
  { id: '7', type: 'expense', amount: 12000, description: 'Monthly rent', category: 'rent', division: 'personal', accountId: 'bank', date: new Date(2026, 1, 1).toISOString(), createdAt: new Date(2026, 1, 1).toISOString() },
  { id: '8', type: 'expense', amount: 5000, description: 'Doctor visit', category: 'medical', division: 'personal', accountId: 'bank', date: new Date(2026, 1, 4).toISOString(), createdAt: new Date(2026, 1, 4).toISOString() },
];

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [accounts, setAccounts] = useState<Account[]>(defaultAccounts);

  const canEdit = useCallback((tx: Transaction) => {
    return Date.now() - new Date(tx.createdAt).getTime() < TWELVE_HOURS;
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = { ...tx, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setTransactions(prev => [newTx, ...prev]);
    setAccounts(prev => prev.map(acc => {
      if (acc.id === tx.accountId) {
        return { ...acc, balance: tx.type === 'income' ? acc.balance + tx.amount : acc.balance - tx.amount };
      }
      return acc;
    }));
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx || !canEdit(tx)) return false;
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    return true;
  }, [transactions, canEdit]);

  const deleteTransaction = useCallback((id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx || !canEdit(tx)) return false;
    setTransactions(prev => prev.filter(t => t.id !== id));
    setAccounts(prev => prev.map(acc => {
      if (acc.id === tx.accountId) {
        return { ...acc, balance: tx.type === 'income' ? acc.balance - tx.amount : acc.balance + tx.amount };
      }
      return acc;
    }));
    return true;
  }, [transactions, canEdit]);

  const addAccount = useCallback((name: string, icon: string, balance: number) => {
    setAccounts(prev => [...prev, { id: crypto.randomUUID(), name, icon, balance }]);
  }, []);

  const transferBetweenAccounts = useCallback((fromId: string, toId: string, amount: number, description: string, date: string) => {
    const now = new Date().toISOString();
    const tx: Transaction = {
      id: crypto.randomUUID(), type: 'transfer', amount, description,
      category: 'other', division: 'personal', accountId: fromId,
      toAccountId: toId, date, createdAt: now,
    };
    setTransactions(prev => [tx, ...prev]);
    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
      if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
      return acc;
    }));
  }, []);

  return (
    <FinanceContext.Provider value={{ transactions, accounts, addTransaction, updateTransaction, deleteTransaction, canEdit, addAccount, transferBetweenAccounts }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
