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
import type { ProgramStatus, ProgramType } from '../../types';

export function AdminCreateProgram() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    programType: 'commercial' as ProgramType,
    startDate: '',
    endDate: '',
    status: 'draft' as ProgramStatus,
    dailyMax: '200',
    monthlyMax: '3000',
    lifetimeMax: '25000',
    employerGroupIds: [] as string[],
  });

  function toggleGroupId(id: string) {
    setFormData((prev) => ({
      ...prev,
      employerGroupIds: prev.employerGroupIds.includes(id)
        ? prev.employerGroupIds.filter((g) => g !== id)
        : [...prev.employerGroupIds, id],
    }));
  }

  function handleCreateProgram() {
    if (!formData.name || !formData.startDate || !formData.endDate) return;
    dispatch({
      type: 'CREATE_PROGRAM',
      program: {
        name: formData.name,
        description: formData.description,
        programType: formData.programType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        eligibility: {
          ...(formData.employerGroupIds.length > 0 && {
            employerGroupIds: formData.employerGroupIds,
          }),
        },
        maxPoints: {
          daily: parseInt(formData.dailyMax) || 200,
          monthly: parseInt(formData.monthlyMax) || 3000,
          lifetime: parseInt(formData.lifetimeMax) || 25000,
        },
        activities: [],
      },
    });
    
    navigate('/admin/programs');
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/programs')} className="text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create New Program</h1>
          <p className="text-zinc-500">Configure a new incentive program and its eligibility rules.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Details</CardTitle>
          <CardDescription>Basic information about the program.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div>
            <Label>Program Type</Label>
            <Select
              value={formData.programType}
              onChange={(e) => setFormData({ ...formData, programType: e.target.value as ProgramType })}
            >
              <option value="commercial">Commercial</option>
              <option value="medicare">Medicare Advantage</option>
              <option value="medicaid">Medicaid</option>
            </Select>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incentive Limits</CardTitle>
          <CardDescription>Set the maximum points a member can earn in this program.</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eligibility</CardTitle>
          <CardDescription>Restrict which employer groups have access to this program.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="mb-1 block">Employer Group Restriction</Label>
            <p className="text-sm text-zinc-500 mb-3">
              Leave unchecked to make program open to all groups.
            </p>
            <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
              {state.employerGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="rounded h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    checked={formData.employerGroupIds.includes(group.id)}
                    onChange={() => toggleGroupId(group.id)}
                  />
                  <div>
                    <div className="text-sm font-medium text-zinc-900">{group.name}</div>
                    {group.industry && (
                      <div className="text-xs text-zinc-500">{group.industry}</div>
                    )}
                  </div>
                </label>
              ))}
              {state.employerGroups.length === 0 && (
                <div className="px-4 py-3 text-sm text-zinc-500">No employer groups defined yet.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => navigate('/admin/programs')}>
          Cancel
        </Button>
        <Button
          onClick={handleCreateProgram}
          disabled={!formData.name || !formData.startDate || !formData.endDate}
        >
          Create Program
        </Button>
      </div>
    </div>
  );
}
