import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
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
  DialogFooter,
} from '../../components/ui/dialog';
import { Plus } from 'lucide-react';
import type { ActivityCategory, ActivityFrequency, ValidationMethod } from '../../types';

const categoryLabels: Record<ActivityCategory, string> = {
  preventive_care: 'Preventive Care',
  fitness: 'Fitness',
  nutrition: 'Nutrition',
  education: 'Education',
  compliance: 'Compliance',
};

export function AdminActivities() {
  const { state, dispatch } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'fitness' as ActivityCategory,
    pointsValue: '50',
    frequency: 'daily' as ActivityFrequency,
    validationMethod: 'self_reported' as ValidationMethod,
    programId: state.programs[0]?.id || '',
    icon: '',
  });

  function handleCreate() {
    if (!formData.name || !formData.programId) return;
    dispatch({
      type: 'CREATE_ACTIVITY',
      activity: {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        pointsValue: parseInt(formData.pointsValue) || 50,
        frequency: formData.frequency,
        validationMethod: formData.validationMethod,
        programId: formData.programId,
        icon: formData.icon || '🎯',
        isActive: true,
      },
    });
    setShowCreate(false);
    setFormData({
      name: '',
      description: '',
      category: 'fitness',
      pointsValue: '50',
      frequency: 'daily',
      validationMethod: 'self_reported',
      programId: state.programs[0]?.id || '',
      icon: '',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Activity Management</h1>
          <p className="text-zinc-500 mt-1">
            Define and manage activities that members can complete to earn points.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Activity
        </Button>
      </div>

      {/* Activities table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            All Activities ({state.activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Activity</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Frequency</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Validation</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.activities.map((act) => (
                  <tr key={act.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{act.icon}</span>
                        <div>
                          <p className="font-medium text-zinc-900">{act.name}</p>
                          <p className="text-xs text-zinc-500 truncate max-w-xs">
                            {act.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{categoryLabels[act.category]}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-emerald-600">
                      +{act.pointsValue}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 capitalize">
                      {act.frequency.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 capitalize">
                      {act.validationMethod.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={act.isActive ? 'success' : 'secondary'}>
                        {act.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            <div>
              <Label>Activity Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Yoga Session"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the activity..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ActivityCategory })}
                >
                  <option value="fitness">Fitness</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="preventive_care">Preventive Care</option>
                  <option value="education">Education</option>
                  <option value="compliance">Compliance</option>
                </Select>
              </div>
              <div>
                <Label>Points Value</Label>
                <Input
                  type="number"
                  value={formData.pointsValue}
                  onChange={(e) => setFormData({ ...formData, pointsValue: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Frequency</Label>
                <Select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as ActivityFrequency })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="one_time">One-time</option>
                </Select>
              </div>
              <div>
                <Label>Validation</Label>
                <Select
                  value={formData.validationMethod}
                  onChange={(e) => setFormData({ ...formData, validationMethod: e.target.value as ValidationMethod })}
                >
                  <option value="self_reported">Self-reported</option>
                  <option value="device_based">Device-based</option>
                  <option value="provider_verified">Provider-verified</option>
                </Select>
              </div>
            </div>
            <div>
              <Label>Icon (emoji)</Label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., 🧘"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name}>
              Create Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
