import { useFinance } from '@/context/FinanceContext';
import { TimePeriod } from '@/types/finance';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { startOfWeek, startOfMonth, startOfYear, format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subDays, subMonths, isWithinInterval } from 'date-fns';

export function SpendingChart({ period }: { period: TimePeriod }) {
  const { transactions } = useFinance();
  const now = new Date();

  let intervals: { start: Date; end: Date; label: string }[] = [];

  if (period === 'daily') {
    const days = eachDayOfInterval({ start: subDays(now, 6), end: now });
    intervals = days.map(d => ({ start: d, end: new Date(d.getTime() + 86400000 - 1), label: format(d, 'EEE') }));
  } else if (period === 'weekly') {
    const weeks = eachWeekOfInterval({ start: subDays(now, 27), end: now }, { weekStartsOn: 1 });
    intervals = weeks.map(w => ({ start: w, end: new Date(w.getTime() + 7 * 86400000 - 1), label: format(w, 'MMM d') }));
  } else if (period === 'monthly') {
    const months = eachMonthOfInterval({ start: subMonths(now, 5), end: now });
    intervals = months.map(m => ({ start: m, end: new Date(m.getFullYear(), m.getMonth() + 1, 0, 23, 59, 59), label: format(m, 'MMM') }));
  } else {
    intervals = [0, 1, 2].map(i => {
      const y = now.getFullYear() - 2 + i;
      return { start: new Date(y, 0, 1), end: new Date(y, 11, 31, 23, 59, 59), label: String(y) };
    });
  }

  const data = intervals.map(({ start, end, label }) => {
    const txs = transactions.filter(t => t.type !== 'transfer' && isWithinInterval(new Date(t.date), { start, end }));
    return {
      name: label,
      income: txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    };
  });

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-4">Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(220 10% 46%)' }} />
          <YAxis tick={{ fontSize: 12, fill: 'hsl(220 10% 46%)' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(0 0% 100%)', border: '1px solid hsl(220 15% 90%)', borderRadius: '8px' }}
            formatter={(value: number) => ['₹' + value.toLocaleString('en-IN')]}
          />
          <Bar dataKey="income" fill="hsl(160 60% 40%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="hsl(350 75% 55%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
