import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ArrowLeft } from 'lucide-react';
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

export function AdminCreateRule() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  
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
    
    navigate('/admin/rules');
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/rules')} className="text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create New Rule</h1>
          <p className="text-zinc-500">Define a rule with conditions and actions.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rule Metadata</CardTitle>
          <CardDescription>Basic information and priority.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            {state.programs.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">Please create a program first.</p>
            )}
          </div>
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
            <Label>Priority (lower = evaluated first)</Label>
            <Input
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50/50 pb-4">
          <CardTitle className="text-blue-900">Condition</CardTitle>
          <CardDescription className="text-blue-700/70">When should this rule trigger?</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Context Field</Label>
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
              <Label className="text-sm">Operator</Label>
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
              <Label className="text-sm">Match Value</Label>
              <Input
                value={formData.conditionValue}
                onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader className="bg-emerald-50/50 pb-4">
          <CardTitle className="text-emerald-900">Action</CardTitle>
          <CardDescription className="text-emerald-700/70">What happens when conditions are met?</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Action Type</Label>
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
              <Label className="text-sm">Action Value / Payload</Label>
              <Input
                value={formData.actionValue}
                onChange={(e) => setFormData({ ...formData, actionValue: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label className="text-sm">Ledger Description (Optional)</Label>
            <Input
              value={formData.actionDescription}
              onChange={(e) => setFormData({ ...formData, actionDescription: e.target.value })}
              placeholder="e.g. Completed 7 day streak!"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => navigate('/admin/rules')}>
          Cancel
        </Button>
        <Button onClick={handleCreate} disabled={!formData.name}>
          Create Rule
        </Button>
      </div>
    </div>
  );
}
