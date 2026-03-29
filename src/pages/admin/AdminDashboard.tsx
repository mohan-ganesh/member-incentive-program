import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Users, Activity, Wallet, Gift, TrendingUp, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

export function AdminDashboard() {
  const { state, getAnalytics } = useApp();

  const activeProgram = state.programs.find((p) => p.status === 'active');
  const analytics = activeProgram ? getAnalytics(activeProgram.id) : null;

  const members = state.users.filter((u) => u.role === 'member');
  const pendingEvents = state.events.filter((e) => e.status === 'pending');
  const pendingRedemptions = state.redemptions.filter((r) => r.status === 'requested');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
        <p className="text-zinc-500 mt-1">
          Overview of your wellness program performance.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Total Members</p>
                <p className="text-3xl font-bold mt-1">{members.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Activities Completed</p>
                <p className="text-3xl font-bold mt-1">
                  {analytics?.activitiesCompleted || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Points Awarded</p>
                <p className="text-3xl font-bold mt-1">
                  {(analytics?.totalPointsAwarded || 0).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Pending Actions</p>
                <p className="text-3xl font-bold mt-1">
                  {pendingEvents.length + pendingRedemptions.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                <Gift className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(pendingEvents.length > 0 || pendingRedemptions.length > 0) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="text-amber-600 font-medium text-sm">
              Action Required:
            </div>
            {pendingEvents.length > 0 && (
              <Badge variant="warning">
                {pendingEvents.length} events pending validation
              </Badge>
            )}
            {pendingRedemptions.length > 0 && (
              <Badge variant="warning">
                {pendingRedemptions.length} redemptions to process
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Daily Activity (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.dailyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis
                      dataKey="date"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { weekday: 'short' })}
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e4e4e7',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                    />
                    <Bar dataKey="activities" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Activities" />
                    <Bar dataKey="points" fill="#10b981" radius={[4, 4, 0, 0]} name="Points" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-8">No active program</p>
            )}
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Activity Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics && analytics.categoryBreakdown.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="category"
                      label={({ category }) => category.replace('_', ' ')}
                    >
                      {analytics.categoryBreakdown.map((_entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-8">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Programs overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.programs.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-3 px-4 rounded-lg border border-zinc-100"
              >
                <div>
                  <p className="font-medium text-zinc-900">{p.name}</p>
                  <p className="text-xs text-zinc-500">
                    {p.startDate} — {p.endDate} • {p.activities.length} activities
                  </p>
                </div>
                <Badge
                  variant={
                    p.status === 'active'
                      ? 'success'
                      : p.status === 'completed'
                        ? 'secondary'
                        : p.status === 'paused'
                          ? 'warning'
                          : 'outline'
                  }
                >
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
