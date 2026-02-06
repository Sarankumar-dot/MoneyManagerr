import { useState } from 'react';
import { StatCards } from '@/components/StatCards';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { TransferModal } from '@/components/TransferModal';
import { AccountCards } from '@/components/AccountCards';
import { CategorySummary } from '@/components/CategorySummary';
import { SpendingChart } from '@/components/SpendingChart';
import { TimePeriod } from '@/types/finance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ArrowRightLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Index() {
  const [period, setPeriod] = useState<TimePeriod>('monthly');
  const [showAdd, setShowAdd] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Money Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={v => setPeriod(v as TimePeriod)}>
              <SelectTrigger className="w-32 bg-card"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowTransfer(true)} variant="outline" size="icon" className="shrink-0">
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Stats */}
        <StatCards period={period} />

        {/* Chart */}
        <div className="mt-6">
          <SpendingChart period={period} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="mt-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="mt-4">
            <TransactionList />
          </TabsContent>
          <TabsContent value="accounts" className="mt-4">
            <AccountCards />
          </TabsContent>
          <TabsContent value="categories" className="mt-4">
            <CategorySummary />
          </TabsContent>
        </Tabs>
      </div>

      <AddTransactionModal open={showAdd} onOpenChange={setShowAdd} />
      <TransferModal open={showTransfer} onOpenChange={setShowTransfer} />
    </div>
  );
}
