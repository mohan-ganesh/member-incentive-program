import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Gift, CreditCard, Tag, Heart, ShoppingBag, CheckCircle } from 'lucide-react';
import type { Reward, RewardCategory, RedemptionStatus } from '../types';

const categoryIcons: Record<RewardCategory, typeof Gift> = {
  gift_card: CreditCard,
  premium_discount: Tag,
  merchandise: ShoppingBag,
  health_benefit: Heart,
};

const categoryLabels: Record<RewardCategory, string> = {
  gift_card: 'Gift Cards',
  premium_discount: 'Discounts',
  merchandise: 'Merchandise',
  health_benefit: 'Health Benefits',
};

const statusColors: Record<RedemptionStatus, 'warning' | 'info' | 'success' | 'destructive'> = {
  requested: 'warning',
  approved: 'info',
  fulfilled: 'success',
  rejected: 'destructive',
};

export function Rewards() {
  const { state, dispatch, getBalance, getUserRedemptions } = useApp();
  const [confirmReward, setConfirmReward] = useState<Reward | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const balance = getBalance();
  const redemptions = getUserRedemptions();
  const activeRewards = state.rewards.filter((r) => r.isActive && r.inventory > 0);

  function handleRedeem(reward: Reward) {
    dispatch({ type: 'REDEEM_REWARD', rewardId: reward.id });
    setConfirmReward(null);
    setSuccessMessage(`Successfully requested "${reward.name}"! Check your email soon.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Rewards Catalog</h1>
          <p className="text-zinc-500 mt-1">Redeem your points for exciting rewards.</p>
        </div>
        <div className="bg-emerald-50 px-4 py-2 rounded-full">
          <span className="text-sm font-semibold text-emerald-700">
            Balance: {balance.toLocaleString()} pts
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="history">My Redemptions</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {activeRewards.map((reward) => {
              const Icon = categoryIcons[reward.category];
              const canAfford = balance >= reward.pointsCost;
              return (
                <Card key={reward.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-12 w-12 rounded-lg bg-zinc-100 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-zinc-600" />
                      </div>
                      <Badge variant="secondary">
                        {categoryLabels[reward.category]}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-zinc-900">{reward.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                      {reward.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-lg font-bold text-emerald-600">
                          {reward.pointsCost.toLocaleString()}
                        </span>
                        <span className="text-sm text-zinc-500 ml-1">pts</span>
                      </div>
                      <Button
                        size="sm"
                        variant={canAfford ? 'success' : 'secondary'}
                        disabled={!canAfford}
                        onClick={() => setConfirmReward(reward)}
                      >
                        {canAfford ? 'Redeem' : 'Not enough pts'}
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">
                      {reward.inventory} available
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Redemption History</CardTitle>
            </CardHeader>
            <CardContent>
              {redemptions.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">
                  No redemptions yet. Browse the catalog to redeem your points!
                </p>
              ) : (
                <div className="space-y-3">
                  {redemptions.map((r) => {
                    const reward = state.rewards.find((rw) => rw.id === r.rewardId);
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between py-3 px-4 rounded-lg border border-zinc-100"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {reward?.name || 'Unknown Reward'}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Requested:{' '}
                            {new Date(r.requestedAt).toLocaleDateString()}
                            {r.processedAt && (
                              <span>
                                {' '}
                                • Processed:{' '}
                                {new Date(r.processedAt).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-red-500">
                            -{r.pointsSpent} pts
                          </span>
                          <Badge variant={statusColors[r.status]}>
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirm dialog */}
      <Dialog open={!!confirmReward} onOpenChange={() => setConfirmReward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>
              {confirmReward && (
                <>
                  Redeem "{confirmReward.name}" for{' '}
                  <strong>{confirmReward.pointsCost.toLocaleString()} points</strong>?
                  <br />
                  Your remaining balance will be{' '}
                  <strong>
                    {(balance - confirmReward.pointsCost).toLocaleString()} points
                  </strong>
                  .
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReward(null)}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => confirmReward && handleRedeem(confirmReward)}
            >
              Confirm Redemption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
