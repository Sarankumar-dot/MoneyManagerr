import { useFinance } from '@/context/FinanceContext';

export function AccountCards() {
  const { accounts } = useFinance();
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Accounts</h3>
        <span className="text-sm text-muted-foreground">Total: ₹{totalBalance.toLocaleString('en-IN')}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {accounts.map(acc => (
          <div key={acc.id} className="glass-card rounded-lg p-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xl">{acc.icon}</span>
              <span className="font-medium">{acc.name}</span>
            </div>
            <p className="text-xl font-bold mt-2">₹{acc.balance.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
