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
import type { ActivityCategory, ActivityFrequency, ValidationMethod } from '../../types';

export function AdminCreateActivity() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  
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
    
    navigate('/admin/activities');
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/activities')} className="text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create New Activity</h1>
          <p className="text-zinc-500">Define a new activity and assign it to a program.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
          <CardDescription>Setup the core details and point values the member will see.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Program *</Label>
            <Select
              value={formData.programId}
              onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
            >
              {state.programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status})
                </option>
              ))}
            </Select>
            {state.programs.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">Please create a program first.</p>
            )}
          </div>
          <div>
            <Label>Activity Name *</Label>
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
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ActivityCategory })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value as ActivityFrequency })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, validationMethod: e.target.value as ValidationMethod })
                }
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
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => navigate('/admin/activities')}>
          Cancel
        </Button>
        <Button onClick={handleCreate} disabled={!formData.name || !formData.programId}>
          Create Activity
        </Button>
      </div>
    </div>
  );
}
