import { useFinance } from '@/context/FinanceContext';
import { CATEGORIES, CATEGORY_ICONS } from '@/types/finance';

export function CategorySummary() {
  const { transactions } = useFinance();

  const summary = CATEGORIES.map(cat => {
    const txs = transactions.filter(t => t.category === cat && t.type !== 'transfer');
    const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { category: cat, income, expense };
  }).filter(s => s.income > 0 || s.expense > 0);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Category Summary</h3>
      <div className="grid gap-2">
        {summary.map(s => (
          <div key={s.category} className="glass-card rounded-lg p-4 flex items-center gap-4 animate-fade-in">
            <span className="text-2xl">{CATEGORY_ICONS[s.category]}</span>
            <div className="flex-1">
              <p className="font-medium capitalize">{s.category}</p>
            </div>
            <div className="text-right space-y-0.5">
              {s.income > 0 && <p className="text-sm text-income font-medium">+₹{s.income.toLocaleString('en-IN')}</p>}
              {s.expense > 0 && <p className="text-sm text-expense font-medium">-₹{s.expense.toLocaleString('en-IN')}</p>}
            </div>
          </div>
        ))}
        {summary.length === 0 && <p className="text-center text-muted-foreground py-4">No data yet</p>}
      </div>
    </div>
  );
}
