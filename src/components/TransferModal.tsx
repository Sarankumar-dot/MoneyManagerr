import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinance } from '@/context/FinanceContext';
import { toast } from 'sonner';

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export function TransferModal({ open, onOpenChange }: Props) {
  const { accounts, transferBetweenAccounts } = useFinance();
  const [fromId, setFromId] = useState(accounts[0]?.id || '');
  const [toId, setToId] = useState(accounts[1]?.id || '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
    if (fromId === toId) { toast.error('Select different accounts'); return; }
    transferBetweenAccounts(fromId, toId, amt, description || 'Transfer', new Date().toISOString());
    toast.success('Transfer completed!');
    setAmount(''); setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader><DialogTitle>Transfer Between Accounts</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>From Account</Label>
            <Select value={fromId} onValueChange={setFromId}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.icon} {a.name} (₹{a.balance.toLocaleString('en-IN')})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>To Account</Label>
            <Select value={toId} onValueChange={setToId}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.icon} {a.name} (₹{a.balance.toLocaleString('en-IN')})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Amount (₹)</Label>
            <Input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional note" maxLength={100} />
          </div>
          <Button type="submit" className="w-full bg-transfer text-transfer-foreground hover:bg-transfer/90">Transfer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
