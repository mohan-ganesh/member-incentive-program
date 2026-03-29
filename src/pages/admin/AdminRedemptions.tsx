import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import type { RedemptionStatus } from '../../types';

const statusConfig: Record<RedemptionStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'destructive'; icon: typeof Clock }> = {
  requested: { label: 'Requested', variant: 'warning', icon: Clock },
  approved: { label: 'Approved', variant: 'info', icon: CheckCircle },
  fulfilled: { label: 'Fulfilled', variant: 'success', icon: Package },
  rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
};

export function AdminRedemptions() {
  const { state, dispatch } = useApp();

  const allRedemptions = [...state.redemptions].sort(
    (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );
  const pendingRedemptions = allRedemptions.filter((r) => r.status === 'requested');
  const processedRedemptions = allRedemptions.filter((r) => r.status !== 'requested');

  function getUser(userId: string) {
    return state.users.find((u) => u.id === userId);
  }

  function getReward(rewardId: string) {
    return state.rewards.find((r) => r.id === rewardId);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Redemption Management</h1>
        <p className="text-zinc-500 mt-1">
          Review and process member reward redemption requests.
        </p>
      </div>

      {pendingRedemptions.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              {pendingRedemptions.length} redemption{pendingRedemptions.length !== 1 ? 's' : ''} awaiting processing
            </span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingRedemptions.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Processed ({processedRedemptions.length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({allRedemptions.length})</TabsTrigger>
        </TabsList>

        {(['pending', 'processed', 'all'] as const).map((tab) => {
          const items =
            tab === 'pending'
              ? pendingRedemptions
              : tab === 'processed'
                ? processedRedemptions
                : allRedemptions;

          return (
            <TabsContent key={tab} value={tab}>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {tab === 'pending' ? 'Pending' : tab === 'processed' ? 'Processed' : 'All'} Redemptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <p className="text-zinc-500 text-center py-8">No redemptions found.</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((r) => {
                        const user = getUser(r.userId);
                        const reward = getReward(r.rewardId);
                        const config = statusConfig[r.status];
                        const StatusIcon = config.icon;

                        return (
                          <div
                            key={r.id}
                            className="flex items-center justify-between py-3 px-4 rounded-lg border border-zinc-100 hover:bg-zinc-50"
                          >
                            <div className="flex items-center gap-3">
                              <StatusIcon className={`h-5 w-5 ${
                                r.status === 'requested' ? 'text-amber-500' :
                                r.status === 'approved' ? 'text-blue-500' :
                                r.status === 'fulfilled' ? 'text-emerald-500' :
                                'text-red-500'
                              }`} />
                              <div>
                                <p className="text-sm font-medium">
                                  {user?.name || 'Unknown'} — {reward?.name || 'Unknown'}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  Requested: {new Date(r.requestedAt).toLocaleDateString()}
                                  {r.processedAt && (
                                    <span>
                                      {' '}• Processed: {new Date(r.processedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-zinc-600">
                                {r.pointsSpent} pts
                              </span>
                              <Badge variant={config.variant}>{config.label}</Badge>
                              {r.status === 'requested' && (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() =>
                                      dispatch({
                                        type: 'UPDATE_REDEMPTION_STATUS',
                                        redemptionId: r.id,
                                        status: 'approved',
                                      })
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      dispatch({
                                        type: 'UPDATE_REDEMPTION_STATUS',
                                        redemptionId: r.id,
                                        status: 'rejected',
                                      })
                                    }
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                              {r.status === 'approved' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    dispatch({
                                      type: 'UPDATE_REDEMPTION_STATUS',
                                      redemptionId: r.id,
                                      status: 'fulfilled',
                                    })
                                  }
                                >
                                  Mark Fulfilled
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
