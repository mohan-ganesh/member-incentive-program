import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Plus, Shield, Zap, Code } from 'lucide-react';
import type { RuleActionType, RuleConditionOperator } from '../../types';

const operatorLabels: Record<RuleConditionOperator, string> = {
  eq: 'Equals (=)',
  gt: 'Greater Than (>)',
  gte: 'Greater or Equal (>=)',
  lt: 'Less Than (<)',
  lte: 'Less or Equal (<=)',
  in: 'In List',
  between: 'Between',
};

const actionLabels: Record<RuleActionType, string> = {
  award_points: 'Award Points',
  award_bonus: 'Award Bonus Points',
  award_badge: 'Award Badge',
  level_up: 'Level Up',
};

export function AdminRules() {
  const { state, dispatch } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [showJson, setShowJson] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    programId: state.programs[0]?.id || '',
    conditionField: 'user.streakDays',
    conditionOperator: 'gte' as RuleConditionOperator,
    conditionValue: '7',
    actionType: 'award_bonus' as RuleActionType,
    actionValue: '200',
    actionDescription: '',
    priority: '5',
  });

  function handleCreate() {
    if (!formData.name || !formData.programId) return;
    dispatch({
      type: 'CREATE_RULE',
      rule: {
        name: formData.name,
        description: formData.description,
        programId: formData.programId,
        conditions: [
          {
            field: formData.conditionField,
            operator: formData.conditionOperator,
            value: isNaN(Number(formData.conditionValue))
              ? formData.conditionValue
              : Number(formData.conditionValue),
          },
        ],
        actions: [
          {
            type: formData.actionType,
            value: isNaN(Number(formData.actionValue))
              ? formData.actionValue
              : Number(formData.actionValue),
            description: formData.actionDescription,
          },
        ],
        priority: parseInt(formData.priority) || 5,
        isActive: true,
      },
    });
    setShowCreate(false);
  }

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
        <Button onClick={() => setShowCreate(true)}>
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

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Rule</DialogTitle>
            <DialogDescription>
              Define a rule with conditions and actions. Rules are evaluated as configurable JSON.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Rule Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., 14-Day Streak Bonus"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this rule does..."
              />
            </div>
            <div>
              <Label>Program</Label>
              <Select
                value={formData.programId}
                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
              >
                {state.programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="bg-zinc-50 rounded-lg p-3 space-y-3">
              <p className="text-xs font-medium text-zinc-500 uppercase">Condition</p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Field</Label>
                  <Select
                    value={formData.conditionField}
                    onChange={(e) => setFormData({ ...formData, conditionField: e.target.value })}
                  >
                    <option value="event.status">event.status</option>
                    <option value="user.streakDays">user.streakDays</option>
                    <option value="user.totalPointsEarned">user.totalPointsEarned</option>
                    <option value="user.level">user.level</option>
                    <option value="user.totalActivities">user.totalActivities</option>
                    <option value="user.dailyPoints">user.dailyPoints</option>
                    <option value="activity.category">activity.category</option>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Operator</Label>
                  <Select
                    value={formData.conditionOperator}
                    onChange={(e) => setFormData({ ...formData, conditionOperator: e.target.value as RuleConditionOperator })}
                  >
                    {Object.entries(operatorLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Value</Label>
                  <Input
                    value={formData.conditionValue}
                    onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-3 space-y-3">
              <p className="text-xs font-medium text-zinc-500 uppercase">Action</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={formData.actionType}
                    onChange={(e) => setFormData({ ...formData, actionType: e.target.value as RuleActionType })}
                  >
                    {Object.entries(actionLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Value</Label>
                  <Input
                    value={formData.actionValue}
                    onChange={(e) => setFormData({ ...formData, actionValue: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Input
                  value={formData.actionDescription}
                  onChange={(e) => setFormData({ ...formData, actionDescription: e.target.value })}
                  placeholder="Optional description..."
                />
              </div>
            </div>

            <div>
              <Label>Priority (lower = evaluated first)</Label>
              <Input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name}>
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
