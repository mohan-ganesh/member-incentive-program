import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Plus, Shield, Zap, Code } from 'lucide-react';
import type { RuleActionType } from '../../types';

const actionLabels: Record<RuleActionType, string> = {
  award_points: 'Award Points',
  award_bonus: 'Award Bonus Points',
  award_badge: 'Award Badge',
  level_up: 'Level Up',
};

export function AdminRules() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [showJson, setShowJson] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Rules Engine</h1>
          <p className="text-zinc-500 mt-1">
            Configure rules for points calculation, bonuses, badges, and level progression.
            Rules are defined as configurable JSON and evaluated in priority order.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/rules/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Info card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">How Rules Work</p>
              <p className="text-xs text-blue-600 mt-1">
                Rules are evaluated in priority order (lowest first). Each rule has conditions
                that must all be met, and actions that are executed when conditions pass.
                Rules support points awards, bonuses, badge unlocks, and level promotions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules list */}
      <div className="space-y-4">
        {state.rules.map((rule) => (
          <Card key={rule.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <CardTitle className="text-base">{rule.name}</CardTitle>
                    <CardDescription>{rule.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Priority: {rule.priority}</Badge>
                  <Badge variant={rule.isActive ? 'success' : 'secondary'}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Conditions */}
                <div className="bg-zinc-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                    Conditions (ALL must match)
                  </p>
                  {rule.conditions.map((c, i) => (
                    <div key={i} className="text-sm font-mono bg-white rounded px-2 py-1 mt-1 border border-zinc-200">
                      {c.field} {c.operator} {JSON.stringify(c.value)}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                    Actions
                  </p>
                  {rule.actions.map((a, i) => (
                    <div key={i} className="text-sm bg-white rounded px-2 py-1 mt-1 border border-emerald-200">
                      <span className="font-medium">{actionLabels[a.type]}</span>
                      {' → '}
                      <span className="text-emerald-600 font-mono">{JSON.stringify(a.value)}</span>
                      {a.description && (
                        <span className="text-zinc-500 text-xs ml-1">({a.description})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => setShowJson(showJson === rule.id ? null : rule.id)}
              >
                <Code className="h-3.5 w-3.5 mr-1" />
                {showJson === rule.id ? 'Hide JSON' : 'View JSON'}
              </Button>

              {showJson === rule.id && (
                <pre className="mt-2 p-3 bg-zinc-900 text-emerald-400 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(rule, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
