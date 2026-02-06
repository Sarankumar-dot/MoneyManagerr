import { useFinance } from '@/context/FinanceContext';
import { TimePeriod } from '@/types/finance';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, isAfter } from 'date-fns';

function getStartDate(period: TimePeriod): Date {
  const now = new Date();
  switch (period) {
    case 'daily': return startOfDay(now);
    case 'weekly': return startOfWeek(now, { weekStartsOn: 1 });
    case 'monthly': return startOfMonth(now);
    case 'yearly': return startOfYear(now);
  }
}

export function StatCards({ period }: { period: TimePeriod }) {
  const { transactions } = useFinance();
  const start = getStartDate(period);

  const filtered = transactions.filter(t => t.type !== 'transfer' && isAfter(new Date(t.date), start));
  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="stat-card income-gradient rounded-xl animate-fade-in">
        <div className="flex items-center justify-between">
          <p className="text-income-foreground/80 text-sm font-medium">Income</p>
          <TrendingUp className="h-5 w-5 text-income-foreground/70" />
        </div>
        <p className="text-2xl font-bold text-income-foreground mt-2">{fmt(totalIncome)}</p>
      </div>
      <div className="stat-card expense-gradient rounded-xl animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between">
          <p className="text-expense-foreground/80 text-sm font-medium">Expenses</p>
          <TrendingDown className="h-5 w-5 text-expense-foreground/70" />
        </div>
        <p className="text-2xl font-bold text-expense-foreground mt-2">{fmt(totalExpense)}</p>
      </div>
      <div className="stat-card balance-gradient rounded-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between">
          <p className="text-primary-foreground/80 text-sm font-medium">Balance</p>
          <Wallet className="h-5 w-5 text-primary-foreground/70" />
        </div>
        <p className="text-2xl font-bold text-primary-foreground mt-2">{fmt(balance)}</p>
      </div>
    </div>
  );
}
