import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Plus, BookOpen, ArrowRightLeft } from 'lucide-react';
import type { ActivityCategory } from '../../types';

const categoryLabels: Record<ActivityCategory, string> = {
  preventive_care: 'Preventive Care',
  fitness: 'Fitness',
  nutrition: 'Nutrition',
  education: 'Education',
  compliance: 'Compliance',
};

export function AdminActivities() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  // Reassign state: { activityId, selectedProgramId }
  const [reassign, setReassign] = useState<{ activityId: string; selectedProgramId: string } | null>(null);

  function handleReassign() {
    if (!reassign || !reassign.selectedProgramId) return;
    dispatch({
      type: 'ASSIGN_ACTIVITY_TO_PROGRAM',
      activityId: reassign.activityId,
      programId: reassign.selectedProgramId,
    });
    setReassign(null);
  }

  const reassignActivity = reassign
    ? state.activities.find((a) => a.id === reassign.activityId)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Activity Management</h1>
          <p className="text-zinc-500 mt-1">
            Define activities, set their program, and manage how members earn points.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/activities/new')}>
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
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Program</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Frequency</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Validation</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.activities.map((act) => {
                  const program = state.programs.find((p) => p.id === act.programId);
                  return (
                    <tr key={act.id} className="border-b border-zinc-100 hover:bg-zinc-50 group">
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

                      {/* Program column */}
                      <td className="py-3 px-4">
                        {program ? (
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-zinc-700 truncate max-w-[160px]">
                              {program.name}
                            </span>
                            <Badge
                              variant={
                                program.status === 'active'
                                  ? 'success'
                                  : program.status === 'completed'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className="text-xs ml-1"
                            >
                              {program.status}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs italic text-zinc-400">Unassigned</span>
                        )}
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

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs gap-1"
                          onClick={() =>
                            setReassign({
                              activityId: act.id,
                              selectedProgramId: act.programId || '',
                            })
                          }
                        >
                          <ArrowRightLeft className="h-3 w-3" />
                          Move
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


      {/* Reassign / Move Activity Dialog */}
      <Dialog open={!!reassign} onOpenChange={() => setReassign(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-zinc-500" />
              Move Activity to Program
            </DialogTitle>
          </DialogHeader>
          {reassignActivity && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-2 bg-zinc-50 rounded-lg px-3 py-2">
                <span className="text-xl">{reassignActivity.icon}</span>
                <span className="text-sm font-medium text-zinc-800">{reassignActivity.name}</span>
              </div>
              <div>
                <Label>Target Program</Label>
                <Select
                  value={reassign?.selectedProgramId || ''}
                  onChange={(e) =>
                    setReassign((r) => r ? { ...r, selectedProgramId: e.target.value } : r)
                  }
                >
                  <option value="">— Select a program —</option>
                  {state.programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.status})
                    </option>
                  ))}
                </Select>
              </div>
              {reassign?.selectedProgramId && reassign.selectedProgramId === reassignActivity.programId && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  This activity is already in that program.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassign(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleReassign}
              disabled={
                !reassign?.selectedProgramId ||
                reassign?.selectedProgramId === reassignActivity?.programId
              }
            >
              Move Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
