import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Trophy, Flame, Medal, Star, Target, TrendingUp } from 'lucide-react';
import { ALL_BADGES } from '../data/mockData';
import type { MemberLevel } from '../types';

const levelConfig: { level: MemberLevel; threshold: number; color: string; bgColor: string }[] = [
  { level: 'bronze', threshold: 0, color: 'text-amber-700', bgColor: 'bg-amber-100' },
  { level: 'silver', threshold: 500, color: 'text-zinc-500', bgColor: 'bg-zinc-100' },
  { level: 'gold', threshold: 2000, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { level: 'platinum', threshold: 5000, color: 'text-purple-600', bgColor: 'bg-purple-100' },
];

export function Gamification() {
  const { state } = useApp();
  const user = state.currentUser;

  // Streak milestones
  const streakMilestones = [
    { days: 3, label: '3-Day Streak', bonus: 50 },
    { days: 7, label: '7-Day Streak', bonus: 200 },
    { days: 14, label: '14-Day Streak', bonus: 500 },
    { days: 30, label: '30-Day Streak', bonus: 1000 },
    { days: 60, label: '60-Day Streak', bonus: 2500 },
    { days: 90, label: '90-Day Streak', bonus: 5000 },
  ];

  // Leaderboard (mock)
  const leaderboard = [...state.users]
    .filter((u) => u.role === 'member')
    .sort((a, b) => b.totalPointsEarned - a.totalPointsEarned);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Achievements & Gamification</h1>
        <p className="text-zinc-500 mt-1">
          Track your progress, earn badges, and climb the leaderboard.
        </p>
      </div>

      {/* Level Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Level Progression
          </CardTitle>
          <CardDescription>
            Earn points to level up and unlock exclusive rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {levelConfig.map((lvl, idx) => {
              const nextLvl = levelConfig[idx + 1];
              const isCurrentLevel = user.level === lvl.level;
              const isAchieved = user.totalPointsEarned >= lvl.threshold;
              const progress = nextLvl
                ? Math.min(
                    100,
                    ((user.totalPointsEarned - lvl.threshold) /
                      (nextLvl.threshold - lvl.threshold)) *
                      100
                  )
                : 100;

              return (
                <div key={lvl.level} className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full ${lvl.bgColor} flex items-center justify-center ${
                      isAchieved ? 'ring-2 ring-offset-2 ring-emerald-500' : ''
                    }`}
                  >
                    <Medal className={`h-5 w-5 ${isAchieved ? lvl.color : 'text-zinc-300'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${isAchieved ? 'text-zinc-900' : 'text-zinc-400'}`}>
                        {lvl.level.charAt(0).toUpperCase() + lvl.level.slice(1)}
                        {isCurrentLevel && (
                          <Badge variant="success" className="ml-2 text-xs">
                            Current
                          </Badge>
                        )}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {lvl.threshold.toLocaleString()} pts
                      </span>
                    </div>
                    {isCurrentLevel && nextLvl && (
                      <Progress value={Math.max(0, progress)} className="h-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Badges
            </CardTitle>
            <CardDescription>
              {user.badges.length} of {ALL_BADGES.length} earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {ALL_BADGES.map((badge) => {
                const earned = user.badges.some((b) => b.id === badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-lg border ${
                      earned
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-zinc-100 bg-zinc-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{badge.name}</p>
                        <p className="text-xs text-zinc-500">{badge.description}</p>
                      </div>
                    </div>
                    {earned && (
                      <Badge variant="success" className="mt-2 text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Streak: {user.streakDays} Days
              </CardTitle>
              <CardDescription>
                Keep your streak alive to earn bonus points!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {streakMilestones.map((m) => {
                  const achieved = user.streakDays >= m.days;
                  const progress = Math.min(100, (user.streakDays / m.days) * 100);
                  return (
                    <div key={m.days} className="flex items-center gap-3">
                      <Target
                        className={`h-4 w-4 ${
                          achieved ? 'text-emerald-500' : 'text-zinc-300'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={achieved ? 'font-medium text-zinc-900' : 'text-zinc-400'}>
                            {m.label}
                          </span>
                          <span className="text-emerald-600">+{m.bonus} pts</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((u, idx) => (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      u.id === user.id ? 'bg-emerald-50 ring-1 ring-emerald-200' : ''
                    }`}
                  >
                    <span
                      className={`text-lg font-bold w-8 text-center ${
                        idx === 0
                          ? 'text-yellow-500'
                          : idx === 1
                            ? 'text-zinc-400'
                            : idx === 2
                              ? 'text-amber-700'
                              : 'text-zinc-300'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{u.name}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">
                      {u.totalPointsEarned.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
