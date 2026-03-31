import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import {
  Plus,
  Calendar,
  Users,
  Target,
  Building2,
  ChevronDown,
  ChevronRight,
  X,
  LinkIcon,
  Zap,
  Shield,
} from 'lucide-react';
import type { ActivityCategory, ActivityFrequency, ValidationMethod } from '../../types';

const categoryColors: Record<ActivityCategory, string> = {
  preventive_care: 'bg-blue-50 text-blue-700 border-blue-200',
  fitness: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  nutrition: 'bg-amber-50 text-amber-700 border-amber-200',
  education: 'bg-purple-50 text-purple-700 border-purple-200',
  compliance: 'bg-zinc-100 text-zinc-700 border-zinc-300',
};

const categoryLabels: Record<ActivityCategory, string> = {
  preventive_care: 'Preventive Care',
  fitness: 'Fitness',
  nutrition: 'Nutrition',
  education: 'Education',
  compliance: 'Compliance',
};

export function AdminPrograms() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [showActivityPicker, setShowActivityPicker] = useState<string | null>(null); // programId
  const [showQuickCreate, setShowQuickCreate] = useState<string | null>(null); // programId

  // Quick-create activity form (pre-bound to a program)
  const [activityForm, setActivityForm] = useState({
    name: '',
    description: '',
    category: 'fitness' as ActivityCategory,
    pointsValue: '50',
    frequency: 'daily' as ActivityFrequency,
    validationMethod: 'self_reported' as ValidationMethod,
    icon: '',
  });

  function handleQuickCreateActivity(programId: string) {
    if (!activityForm.name) return;
    dispatch({
      type: 'CREATE_ACTIVITY',
      activity: {
        name: activityForm.name,
        description: activityForm.description,
        category: activityForm.category,
        pointsValue: parseInt(activityForm.pointsValue) || 50,
        frequency: activityForm.frequency,
        validationMethod: activityForm.validationMethod,
        programId,
        icon: activityForm.icon || '🎯',
        isActive: true,
      },
    });
    setShowQuickCreate(null);
    setActivityForm({
      name: '',
      description: '',
      category: 'fitness',
      pointsValue: '50',
      frequency: 'daily',
      validationMethod: 'self_reported',
      icon: '',
    });
  }

  // Activities not yet in a specific program (candidates to assign)
  function getAssignableTo(programId: string) {
    return state.activities.filter((a) => a.programId !== programId && a.isActive);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Program Management</h1>
          <p className="text-zinc-500 mt-1">
            Create programs and manage which activities belong to each.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/programs/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Program
        </Button>
      </div>

      {/* Program cards */}
      <div className="space-y-4">
        {state.programs.map((program) => {
          const isExpanded = expandedProgramId === program.id;
          const programActivities = state.activities.filter((a) =>
            program.activities.includes(a.id)
          );

          return (
            <Card key={program.id} className="overflow-hidden">
              {/* Header row */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() =>
                        setExpandedProgramId(isExpanded ? null : program.id)
                      }
                      className="flex-shrink-0 text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <CardTitle className="text-base">{program.name}</CardTitle>
                      <CardDescription className="mt-0.5 line-clamp-1">
                        {program.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <Badge variant="outline" className="capitalize text-zinc-600 border-zinc-300">
                      <Shield className="h-3 w-3 mr-1" />
                      {program.programType === 'medicare' ? 'Medicare Advantage' : program.programType}
                    </Badge>
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

              <CardContent className="pt-0">
                {/* Meta row */}
                <div className="flex flex-wrap gap-4 mb-3 pl-8">
                  <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {program.startDate} — {program.endDate}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                    <Target className="h-3.5 w-3.5" />
                    <span className="font-medium text-zinc-800">{programActivities.length}</span> activities
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                    <Users className="h-3.5 w-3.5" />
                    Max {program.maxPoints.daily}/day
                  </div>
                  {program.eligibility.employerGroupIds && program.eligibility.employerGroupIds.length > 0 ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Building2 className="h-3.5 w-3.5 text-violet-500" />
                      {program.eligibility.employerGroupIds.map((gid) => {
                        const grp = state.employerGroups.find((g) => g.id === gid);
                        return grp ? (
                          <span key={gid} className="text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
                            {grp.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <Building2 className="h-3 w-3" />
                      All groups
                    </div>
                  )}
                </div>

                {/* Status actions */}
                <div className="flex gap-2 pl-8 mb-3">
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

                {/* ── EXPANDED: Activity List ── */}
                {isExpanded && (
                  <div className="pl-8 border-t border-zinc-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-zinc-700">
                        Activities in this Program
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowActivityPicker(program.id);
                            setShowQuickCreate(null);
                          }}
                        >
                          <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                          Assign Existing
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowQuickCreate(program.id);
                            setShowActivityPicker(null);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Create &amp; Assign
                        </Button>
                      </div>
                    </div>

                    {/* Activity picker panel */}
                    {showActivityPicker === program.id && (
                      <div className="border border-blue-200 rounded-lg bg-blue-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-blue-800">
                            Assign an existing activity to <span className="font-bold">{program.name}</span>
                          </p>
                          <button
                            onClick={() => setShowActivityPicker(null)}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {getAssignableTo(program.id).length === 0 ? (
                          <p className="text-sm text-blue-600 italic">
                            All existing activities are already in this program, or no other activities exist.
                          </p>
                        ) : (
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {getAssignableTo(program.id).map((act) => {
                              const currentProgram = state.programs.find((p) => p.id === act.programId);
                              return (
                                <div
                                  key={act.id}
                                  className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-blue-100"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-lg flex-shrink-0">{act.icon}</span>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-zinc-800 truncate">
                                        {act.name}
                                      </p>
                                      {currentProgram && (
                                        <p className="text-xs text-zinc-400 truncate">
                                          Currently in: {currentProgram.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-shrink-0 ml-3 text-blue-700 border-blue-300 hover:bg-blue-50"
                                    onClick={() => {
                                      dispatch({
                                        type: 'ASSIGN_ACTIVITY_TO_PROGRAM',
                                        activityId: act.id,
                                        programId: program.id,
                                      });
                                      setShowActivityPicker(null);
                                    }}
                                  >
                                    Assign
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick-create activity panel */}
                    {showQuickCreate === program.id && (
                      <div className="border border-emerald-200 rounded-lg bg-emerald-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-emerald-800 flex items-center gap-1.5">
                            <Zap className="h-4 w-4" />
                            Quick-create activity for <span className="font-bold">{program.name}</span>
                          </p>
                          <button
                            onClick={() => setShowQuickCreate(null)}
                            className="text-emerald-400 hover:text-emerald-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="md:col-span-2">
                            <Label className="text-xs">Activity Name *</Label>
                            <Input
                              value={activityForm.name}
                              onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                              placeholder="e.g., Morning Yoga"
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-xs">Description</Label>
                            <Input
                              value={activityForm.description}
                              onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                              placeholder="Brief description..."
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Category</Label>
                            <Select
                              value={activityForm.category}
                              onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value as ActivityCategory })}
                              className="mt-1 h-8 text-sm"
                            >
                              <option value="fitness">Fitness</option>
                              <option value="nutrition">Nutrition</option>
                              <option value="preventive_care">Preventive Care</option>
                              <option value="education">Education</option>
                              <option value="compliance">Compliance</option>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Points</Label>
                            <Input
                              type="number"
                              value={activityForm.pointsValue}
                              onChange={(e) => setActivityForm({ ...activityForm, pointsValue: e.target.value })}
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Frequency</Label>
                            <Select
                              value={activityForm.frequency}
                              onChange={(e) => setActivityForm({ ...activityForm, frequency: e.target.value as ActivityFrequency })}
                              className="mt-1 h-8 text-sm"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="one_time">One-time</option>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Validation</Label>
                            <Select
                              value={activityForm.validationMethod}
                              onChange={(e) => setActivityForm({ ...activityForm, validationMethod: e.target.value as ValidationMethod })}
                              className="mt-1 h-8 text-sm"
                            >
                              <option value="self_reported">Self-reported</option>
                              <option value="device_based">Device-based</option>
                              <option value="provider_verified">Provider-verified</option>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Icon (emoji)</Label>
                            <Input
                              value={activityForm.icon}
                              onChange={(e) => setActivityForm({ ...activityForm, icon: e.target.value })}
                              placeholder="🎯"
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button
                            size="sm"
                            disabled={!activityForm.name}
                            onClick={() => handleQuickCreateActivity(program.id)}
                          >
                            Create &amp; Assign to Program
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Activity list */}
                    {programActivities.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-zinc-200 rounded-lg">
                        <Target className="h-7 w-7 text-zinc-300 mx-auto mb-1" />
                        <p className="text-sm text-zinc-400">No activities assigned to this program yet.</p>
                        <p className="text-xs text-zinc-400">Use the buttons above to assign or create activities.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {programActivities.map((act) => (
                          <div
                            key={act.id}
                            className="flex items-center gap-3 bg-white border border-zinc-200 rounded-lg px-3 py-2.5 hover:border-zinc-300 transition-colors group"
                          >
                            <span className="text-xl flex-shrink-0">{act.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-medium text-zinc-900">{act.name}</p>
                                <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${categoryColors[act.category]}`}>
                                  {categoryLabels[act.category]}
                                </span>
                                <span className="text-xs text-zinc-400 capitalize">
                                  {act.frequency.replace('_', ' ')}
                                </span>
                              </div>
                              {act.description && (
                                <p className="text-xs text-zinc-400 truncate mt-0.5">{act.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="text-sm font-semibold text-emerald-600">+{act.pointsValue} pts</span>
                              <button
                                onClick={() =>
                                  dispatch({
                                    type: 'REMOVE_ACTIVITY_FROM_PROGRAM',
                                    activityId: act.id,
                                  })
                                }
                                title="Remove from program"
                                className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
