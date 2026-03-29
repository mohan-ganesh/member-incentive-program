import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select } from '../components/ui/select';
import { ArrowUpCircle, Gift, Star, RotateCcw, Clock } from 'lucide-react';
import type { LedgerEntryType } from '../types';

const typeConfig: Record<LedgerEntryType, { label: string; icon: typeof ArrowUpCircle; color: string; badgeVariant: 'success' | 'warning' | 'info' | 'destructive' | 'secondary' | 'default' }> = {
  earn: { label: 'Earned', icon: ArrowUpCircle, color: 'text-emerald-500', badgeVariant: 'success' },
  bonus: { label: 'Bonus', icon: Star, color: 'text-yellow-500', badgeVariant: 'warning' },
  adjustment: { label: 'Adjustment', icon: RotateCcw, color: 'text-blue-500', badgeVariant: 'info' },
  redemption: { label: 'Redeemed', icon: Gift, color: 'text-red-500', badgeVariant: 'destructive' },
  reversal: { label: 'Reversal', icon: RotateCcw, color: 'text-zinc-500', badgeVariant: 'secondary' },
  expiry: { label: 'Expired', icon: Clock, color: 'text-zinc-400', badgeVariant: 'default' },
};

export function Ledger() {
  const { getBalance, getUserLedger } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const balance = getBalance();
  const ledger = getUserLedger();

  const sorted = [...ledger].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filtered =
    filterType === 'all' ? sorted : sorted.filter((e) => e.type === filterType);

  const totalEarned = ledger.filter((e) => e.points > 0).reduce((s, e) => s + e.points, 0);
  const totalRedeemed = Math.abs(
    ledger.filter((e) => e.type === 'redemption').reduce((s, e) => s + e.points, 0)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Points Ledger</h1>
        <p className="text-zinc-500 mt-1">
          Complete, immutable record of all point transactions.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-zinc-500">Current Balance</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">
              {balance.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-zinc-500">Total Earned</p>
            <p className="text-3xl font-bold text-zinc-900 mt-1">
              {totalEarned.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-zinc-500">Total Redeemed</p>
            <p className="text-3xl font-bold text-red-500 mt-1">
              {totalRedeemed.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-700">Filter by type:</label>
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-48"
        >
          <option value="all">All Transactions</option>
          <option value="earn">Earned</option>
          <option value="bonus">Bonus</option>
          <option value="redemption">Redemptions</option>
          <option value="adjustment">Adjustments</option>
          <option value="reversal">Reversals</option>
          <option value="expiry">Expired</option>
        </Select>
      </div>

      {/* Transaction list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Transactions ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">No transactions found.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((entry) => {
                const config = typeConfig[entry.type];
                const Icon = config.icon;
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-zinc-50 border border-zinc-100"
                  >
                    <div className={`${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {entry.description}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(entry.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {entry.expiryDate && (
                          <span className="ml-2 text-zinc-400">
                            Expires: {entry.expiryDate}
                          </span>
                        )}
                      </p>
                    </div>
                    <Badge variant={config.badgeVariant} className="text-xs">
                      {config.label}
                    </Badge>
                    <span
                      className={`text-sm font-semibold min-w-16 text-right ${
                        entry.points > 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {entry.points > 0 ? '+' : ''}
                      {entry.points}
                    </span>
                    <span className="text-xs text-zinc-400 min-w-20 text-right">
                      Bal: {entry.balanceAfter}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
