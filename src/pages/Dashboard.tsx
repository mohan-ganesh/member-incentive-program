import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Wallet, TrendingUp, Flame, Trophy, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MemberLevel } from '../types';

const levelThresholds: Record<MemberLevel, number> = {
  bronze: 0,
  silver: 500,
  gold: 2000,
  platinum: 5000,
};

const nextLevel: Record<MemberLevel, MemberLevel | null> = {
  bronze: 'silver',
  silver: 'gold',
  gold: 'platinum',
  platinum: null,
};

const levelColors: Record<MemberLevel, string> = {
  bronze: 'text-amber-700',
  silver: 'text-zinc-400',
  gold: 'text-yellow-500',
  platinum: 'text-purple-500',
};

export function Dashboard() {
  const { state, getBalance, getUserLedger, getUserEvents } = useApp();
  const user = state.currentUser;
  const balance = getBalance();
  const ledger = getUserLedger();
  const events = getUserEvents();
  const validatedEvents = events.filter((e) => e.status === 'validated');

  // Points this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekPoints = ledger
    .filter((e) => e.points > 0 && new Date(e.timestamp) >= weekAgo)
    .reduce((s, e) => s + e.points, 0);

  // Level progress
  const next = nextLevel[user.level];
  const currentThreshold = levelThresholds[user.level];
  const nextThreshold = next ? levelThresholds[next] : user.totalPointsEarned;
  const levelProgress = next
    ? ((user.totalPointsEarned - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  // Recent activity for chart
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayPoints = ledger
      .filter(
        (e) => e.points > 0 && e.timestamp.split('T')[0] === dateStr
      )
      .reduce((s, e) => s + e.points, 0);
    chartData.push({ day: dayLabel, points: dayPoints });
  }

  // Recent ledger entries
  const recentLedger = [...ledger].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-zinc-500 mt-1">
            Keep up the healthy habits. You're on a {user.streakDays}-day streak!
          </p>
        </div>
        <Link
          to="/activities"
          className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Log an Activity <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Points Balance</p>
                <p className="text-3xl font-bold text-zinc-900 mt-1">
                  {balance.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">This Week</p>
                <p className="text-3xl font-bold text-zinc-900 mt-1">
                  +{weekPoints}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Streak</p>
                <p className="text-3xl font-bold text-zinc-900 mt-1">
                  {user.streakDays} days
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Activities Done</p>
                <p className="text-3xl font-bold text-zinc-900 mt-1">
                  {validatedEvents.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Points This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="points" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Level + Badges */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className={`h-5 w-5 ${levelColors[user.level]}`} />
                Level: {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {next ? (
                <>
                  <div className="flex justify-between text-xs text-zinc-500 mb-2">
                    <span>{user.totalPointsEarned.toLocaleString()} pts</span>
                    <span>{nextThreshold.toLocaleString()} pts</span>
                  </div>
                  <Progress value={levelProgress} />
                  <p className="text-xs text-zinc-500 mt-2">
                    {(nextThreshold - user.totalPointsEarned).toLocaleString()} pts to{' '}
                    {next.charAt(0).toUpperCase() + next.slice(1)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-emerald-600 font-medium">
                  Maximum level reached!
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Badges</CardTitle>
            </CardHeader>
            <CardContent>
              {user.badges.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Complete activities to earn badges!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-1.5 bg-zinc-50 rounded-full px-3 py-1.5"
                      title={b.description}
                    >
                      <span className="text-lg">{b.icon}</span>
                      <span className="text-xs font-medium">{b.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Ledger */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Link to="/ledger" className="text-sm text-emerald-600 hover:underline">
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLedger.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900">{entry.description}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(entry.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Badge variant={entry.points > 0 ? 'success' : 'destructive'}>
                  {entry.points > 0 ? '+' : ''}
                  {entry.points} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
