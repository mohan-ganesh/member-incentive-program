import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Trophy, Flame, Wallet } from 'lucide-react';
import type { MemberLevel } from '../../types';

const levelBadgeVariant: Record<MemberLevel, 'default' | 'secondary' | 'warning' | 'info'> = {
  bronze: 'default',
  silver: 'secondary',
  gold: 'warning',
  platinum: 'info',
};

export function AdminMembers() {
  const { state } = useApp();
  const members = state.users.filter((u) => u.role === 'member');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Members</h1>
        <p className="text-zinc-500 mt-1">View and manage program members.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Member</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Level</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Points Earned</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Points Redeemed</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Streak</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Badges</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{member.name}</p>
                          <p className="text-xs text-zinc-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {member.planType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={levelBadgeVariant[member.level]} className="capitalize">
                        <Trophy className="h-3 w-3 mr-1" />
                        {member.level}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-emerald-600 font-medium">
                        <Wallet className="h-3.5 w-3.5" />
                        {member.totalPointsEarned.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {member.totalPointsRedeemed.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Flame className={`h-3.5 w-3.5 ${member.streakDays > 0 ? 'text-orange-500' : 'text-zinc-300'}`} />
                        <span className={member.streakDays > 0 ? 'font-medium' : 'text-zinc-400'}>
                          {member.streakDays} days
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {member.badges.length === 0 ? (
                          <span className="text-zinc-400 text-xs">None</span>
                        ) : (
                          member.badges.map((b) => (
                            <span key={b.id} title={b.name} className="text-lg">
                              {b.icon}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 text-xs">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
