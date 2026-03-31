import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Building2, Users, Layers, Plus, CheckCircle } from 'lucide-react';

export function AdminEmployerGroups() {
  const navigate = useNavigate();
  const { state } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Employer Groups</h1>
          <p className="text-zinc-500 mt-1">
            Manage employer group accounts and their program assignments.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/employer-groups/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Employer Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700">{state.employerGroups.length}</div>
                <div className="text-sm text-blue-600">Total Groups</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-emerald-700">
                  {state.users.filter((u) => u.role === 'member' && u.employerGroupId).length}
                </div>
                <div className="text-sm text-emerald-600">Enrolled Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-violet-50 border-violet-200">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Layers className="h-8 w-8 text-violet-600" />
              <div>
                <div className="text-2xl font-bold text-violet-700">
                  {state.programs.filter(
                    (p) => p.eligibility.employerGroupIds && p.eligibility.employerGroupIds.length > 0
                  ).length}
                </div>
                <div className="text-sm text-violet-600">Group-Restricted Programs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {state.employerGroups.map((group) => {
          const groupMembers = state.users.filter(
            (u) => u.role === 'member' && u.employerGroupId === group.id
          );
          const groupPrograms = state.programs.filter(
            (p) =>
              !p.eligibility.employerGroupIds ||
              p.eligibility.employerGroupIds.length === 0 ||
              p.eligibility.employerGroupIds.includes(group.id)
          );

          return (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      {group.description && (
                        <CardDescription className="mt-0.5">{group.description}</CardDescription>
                      )}
                    </div>
                  </div>
                  <Badge variant={group.isActive ? 'success' : 'secondary'}>
                    {group.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {group.industry && (
                    <div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wide">Industry</div>
                      <div className="text-sm font-medium text-zinc-700 mt-0.5">{group.industry}</div>
                    </div>
                  )}
                  {group.contactEmail && (
                    <div>
                      <div className="text-xs text-zinc-400 uppercase tracking-wide">Contact</div>
                      <div className="text-sm font-medium text-zinc-700 mt-0.5">{group.contactEmail}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-zinc-400 uppercase tracking-wide">Members</div>
                    <div className="text-sm font-bold text-zinc-800 mt-0.5">{groupMembers.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 uppercase tracking-wide">Eligible Programs</div>
                    <div className="text-sm font-bold text-zinc-800 mt-0.5">{groupPrograms.length}</div>
                  </div>
                </div>

                {/* Members */}
                {groupMembers.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-zinc-400 uppercase tracking-wide mb-1.5">Members</div>
                    <div className="flex flex-wrap gap-2">
                      {groupMembers.map((m) => (
                        <span
                          key={m.id}
                          className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-xs px-2.5 py-1 rounded-full"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligible Programs */}
                <div>
                  <div className="text-xs text-zinc-400 uppercase tracking-wide mb-1.5">Eligible Programs</div>
                  <div className="flex flex-wrap gap-2">
                    {groupPrograms.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {p.name}
                      </span>
                    ))}
                    {groupPrograms.length === 0 && (
                      <span className="text-xs text-zinc-400 italic">No programs assigned</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {state.employerGroups.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="py-12 text-center">
              <Building2 className="h-10 w-10 text-zinc-300 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">No employer groups yet. Create one to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
