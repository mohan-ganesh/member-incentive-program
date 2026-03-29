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
  DialogFooter,
} from '../../components/ui/dialog';
import { Plus, Calendar, Users, Target } from 'lucide-react';
import type { ProgramStatus } from '../../types';

export function AdminPrograms() {
  const { state, dispatch } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'draft' as ProgramStatus,
    dailyMax: '200',
    monthlyMax: '3000',
    lifetimeMax: '25000',
  });

  function handleCreate() {
    if (!formData.name || !formData.startDate || !formData.endDate) return;
    dispatch({
      type: 'CREATE_PROGRAM',
      program: {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        eligibility: {},
        maxPoints: {
          daily: parseInt(formData.dailyMax) || 200,
          monthly: parseInt(formData.monthlyMax) || 3000,
          lifetime: parseInt(formData.lifetimeMax) || 25000,
        },
        activities: [],
      },
    });
    setShowCreate(false);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'draft',
      dailyMax: '200',
      monthlyMax: '3000',
      lifetimeMax: '25000',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Program Management</h1>
          <p className="text-zinc-500 mt-1">Create and manage wellness programs.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Program
        </Button>
      </div>

      <div className="space-y-4">
        {state.programs.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{program.name}</CardTitle>
                  <CardDescription className="mt-1">{program.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      program.status === 'active'
                        ? 'success'
                        : program.status === 'completed'
                          ? 'secondary'
                          : program.status === 'paused'
                            ? 'warning'
                            : 'outline'
                    }
                  >
                    {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Calendar className="h-4 w-4" />
                  {program.startDate} — {program.endDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Target className="h-4 w-4" />
                  {program.activities.length} activities
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Users className="h-4 w-4" />
                  Max: {program.maxPoints.daily}/day, {program.maxPoints.monthly}/mo
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {program.status === 'draft' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() =>
                      dispatch({ type: 'UPDATE_PROGRAM_STATUS', programId: program.id, status: 'active' })
                    }
                  >
                    Activate
                  </Button>
                )}
                {program.status === 'active' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      dispatch({ type: 'UPDATE_PROGRAM_STATUS', programId: program.id, status: 'paused' })
                    }
                  >
                    Pause
                  </Button>
                )}
                {program.status === 'paused' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() =>
                      dispatch({ type: 'UPDATE_PROGRAM_STATUS', programId: program.id, status: 'active' })
                    }
                  >
                    Resume
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Program Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Healthy Living 2025"
              />
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the program..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start Date</Label>
                <Input
                  id="start"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end">End Date</Label>
                <Input
                  id="end"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProgramStatus })}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Daily Max Pts</Label>
                <Input
                  type="number"
                  value={formData.dailyMax}
                  onChange={(e) => setFormData({ ...formData, dailyMax: e.target.value })}
                />
              </div>
              <div>
                <Label>Monthly Max Pts</Label>
                <Input
                  type="number"
                  value={formData.monthlyMax}
                  onChange={(e) => setFormData({ ...formData, monthlyMax: e.target.value })}
                />
              </div>
              <div>
                <Label>Lifetime Max Pts</Label>
                <Input
                  type="number"
                  value={formData.lifetimeMax}
                  onChange={(e) => setFormData({ ...formData, lifetimeMax: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name || !formData.startDate || !formData.endDate}>
              Create Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
