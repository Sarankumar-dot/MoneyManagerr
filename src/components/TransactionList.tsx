import { useFinance } from '@/context/FinanceContext';
import { Transaction, CATEGORY_ICONS, Division, Category, CATEGORIES } from '@/types/finance';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { useState } from 'react';
import { Pencil, Trash2, ArrowRightLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function TransactionList() {
  const { transactions, canEdit, deleteTransaction, accounts } = useFinance();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');

  let filtered = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (dateFrom) filtered = filtered.filter(t => isAfter(parseISO(t.date), parseISO(dateFrom)));
  if (dateTo) filtered = filtered.filter(t => isBefore(parseISO(t.date), new Date(new Date(dateTo).getTime() + 86400000)));
  if (categoryFilter !== 'all') filtered = filtered.filter(t => t.category === categoryFilter);
  if (divisionFilter !== 'all') filtered = filtered.filter(t => t.division === divisionFilter);

  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || id;

  const handleDelete = (tx: Transaction) => {
    if (deleteTransaction(tx.id)) {
      toast.success('Transaction deleted');
    } else {
      toast.error('Cannot delete: editing window has expired (12 hours)');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-40" placeholder="From" />
        <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-40" placeholder="To" />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 bg-card"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_ICONS[c]} {c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={divisionFilter} onValueChange={setDivisionFilter}>
          <SelectTrigger className="w-36 bg-card"><SelectValue placeholder="Division" /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Divisions</SelectItem>
            <SelectItem value="personal">🏠 Personal</SelectItem>
            <SelectItem value="office">🏢 Office</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No transactions found</p>
        )}
        {filtered.map(tx => (
          <div key={tx.id} className="glass-card rounded-lg p-4 flex items-center gap-4 animate-fade-in">
            <div className="text-2xl w-10 text-center">
              {tx.type === 'transfer' ? '🔄' : CATEGORY_ICONS[tx.category]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{tx.description}</p>
              <p className="text-xs text-muted-foreground">
                {format(parseISO(tx.date), 'MMM d, yyyy')} · {tx.category} · {tx.division}
                {tx.type === 'transfer' && ` · ${getAccountName(tx.accountId)} → ${getAccountName(tx.toAccountId!)}`}
                {tx.type !== 'transfer' && ` · ${getAccountName(tx.accountId)}`}
              </p>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className={`font-semibold ${tx.type === 'income' ? 'text-income' : tx.type === 'expense' ? 'text-expense' : 'text-transfer'}`}>
                {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}₹{tx.amount.toLocaleString('en-IN')}
              </span>
              {canEdit(tx) && (
                <button onClick={() => handleDelete(tx)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
