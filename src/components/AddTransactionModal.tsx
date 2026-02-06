import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinance } from '@/context/FinanceContext';
import { CATEGORIES, CATEGORY_ICONS, Category, Division, TransactionType } from '@/types/finance';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionModal({ open, onOpenChange }: Props) {
  const { addTransaction, accounts } = useFinance();
  const [tab, setTab] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [division, setDivision] = useState<Division>('personal');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  const reset = () => {
    setAmount(''); setDescription(''); setCategory('other');
    setDivision('personal'); setDate(new Date().toISOString().slice(0, 16));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
    if (!description.trim()) { toast.error('Enter a description'); return; }

    addTransaction({
      type: tab, amount: amt, description: description.trim(),
      category, division, accountId, date: new Date(date).toISOString(),
    });
    toast.success(`${tab === 'income' ? 'Income' : 'Expense'} added!`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={v => setTab(v as 'income' | 'expense')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income" className="data-[state=active]:bg-income data-[state=active]:text-income-foreground">Income</TabsTrigger>
            <TabsTrigger value="expense" className="data-[state=active]:bg-expense data-[state=active]:text-expense-foreground">Expense</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label>Amount (₹)</Label>
              <Input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="text-lg" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="What was this for?" maxLength={100} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={v => setCategory(v as Category)}>
                  <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_ICONS[c]} {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Division</Label>
                <Select value={division} onValueChange={v => setDivision(v as Division)}>
                  <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="personal">🏠 Personal</SelectItem>
                    <SelectItem value="office">🏢 Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Account</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.icon} {a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date & Time</Label>
                <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className={`w-full ${tab === 'income' ? 'bg-income hover:bg-income/90' : 'bg-expense hover:bg-expense/90'} text-primary-foreground`}>
              Add {tab === 'income' ? 'Income' : 'Expense'}
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
