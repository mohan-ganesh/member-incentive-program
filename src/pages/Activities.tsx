import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { CheckCircle, Clock } from 'lucide-react';
import type { Activity, ActivityCategory } from '../types';

const categoryLabels: Record<ActivityCategory, string> = {
  preventive_care: 'Preventive Care',
  fitness: 'Fitness',
  nutrition: 'Nutrition',
  education: 'Education',
  compliance: 'Compliance',
};

const categoryColors: Record<ActivityCategory, string> = {
  preventive_care: 'info',
  fitness: 'success',
  nutrition: 'warning',
  education: 'secondary',
  compliance: 'default',
};

const frequencyLabels: Record<string, string> = {
  one_time: 'One-time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const validationLabels: Record<string, string> = {
  self_reported: 'Self-reported',
  device_based: 'Device-synced',
  provider_verified: 'Provider-verified',
};

export function Activities() {
  const { state, dispatch, getUserEvents } = useApp();
  const [confirmActivity, setConfirmActivity] = useState<Activity | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Employer-group-aware eligibility: only show programs the current member qualifies for
  const activePrograms = state.programs.filter((p) => {
    if (p.status !== 'active') return false;
    const groupFilter = p.eligibility.employerGroupIds;
    if (!groupFilter || groupFilter.length === 0) return true; // open to all
    return !!state.currentUser.employerGroupId && groupFilter.includes(state.currentUser.employerGroupId);
  });

  const eligibleProgramIds = new Set(activePrograms.map((p) => p.id));
  const programActivities = state.activities.filter(
    (a) => a.isActive && eligibleProgramIds.has(a.programId)
  );
  const userEvents = getUserEvents();

  const categories: ActivityCategory[] = [
    'preventive_care',
    'fitness',
    'nutrition',
    'education',
    'compliance',
  ];

  function hasCompletedToday(activityId: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return userEvents.some(
      (e) =>
        e.activityId === activityId &&
        e.timestamp.split('T')[0] === today &&
        e.status !== 'rejected'
    );
  }

  function getCompletionCount(activityId: string): number {
    return userEvents.filter(
      (e) => e.activityId === activityId && e.status === 'validated'
    ).length;
  }

  function handleComplete(activity: Activity) {
    dispatch({ type: 'COMPLETE_ACTIVITY', activityId: activity.id });
    setConfirmActivity(null);
    setSuccessMessage(
      `${activity.name} logged! ${
        activity.validationMethod === 'self_reported'
          ? `You earned ${activity.pointsValue} points!`
          : 'Pending validation.'
      }`
    );
    setTimeout(() => setSuccessMessage(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Activities</h1>
        <p className="text-zinc-500 mt-1">
          Complete activities to earn points. Activities are grouped by category.
        </p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {activePrograms.map((program) => (
        <Card key={program.id}>
          <CardHeader>
            <CardTitle>{program.name}</CardTitle>
            <CardDescription>{program.description}</CardDescription>
            <div className="flex gap-2 mt-2">
              <Badge variant="success">Active</Badge>
              <Badge variant="outline">
                {program.startDate} — {program.endDate}
              </Badge>
              <Badge variant="secondary">
                Max {program.maxPoints.daily}/day
              </Badge>
            </div>
          </CardHeader>
        </Card>
      ))}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {categoryLabels[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {programActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                completedToday={hasCompletedToday(activity.id)}
                completionCount={getCompletionCount(activity.id)}
                onComplete={() => setConfirmActivity(activity)}
              />
            ))}
          </div>
        </TabsContent>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {programActivities
                .filter((a) => a.category === cat)
                .map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    completedToday={hasCompletedToday(activity.id)}
                    completionCount={getCompletionCount(activity.id)}
                    onComplete={() => setConfirmActivity(activity)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Confirmation dialog */}
      <Dialog open={!!confirmActivity} onOpenChange={() => setConfirmActivity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Activity</DialogTitle>
            <DialogDescription>
              {confirmActivity && (
                <>
                  Are you sure you want to log "{confirmActivity.name}"?
                  <br />
                  {confirmActivity.validationMethod === 'self_reported'
                    ? `You'll earn ${confirmActivity.pointsValue} points immediately.`
                    : 'This will be submitted for validation.'}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmActivity(null)}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => confirmActivity && handleComplete(confirmActivity)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActivityCard({
  activity,
  completedToday,
  completionCount,
  onComplete,
}: {
  activity: Activity;
  completedToday: boolean;
  completionCount: number;
  onComplete: () => void;
}) {
  const isOneTime = activity.frequency === 'one_time';
  const isDisabled = completedToday || (isOneTime && completionCount > 0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{activity.icon}</span>
          <Badge variant={categoryColors[activity.category] as "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"}>
            {categoryLabels[activity.category]}
          </Badge>
        </div>
        <h3 className="font-semibold text-zinc-900">{activity.name}</h3>
        <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{activity.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
            +{activity.pointsValue} pts
          </span>
          <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
            {frequencyLabels[activity.frequency]}
          </span>
          <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
            {validationLabels[activity.validationMethod]}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-zinc-400">
            Completed {completionCount} time{completionCount !== 1 ? 's' : ''}
          </span>
          <Button
            size="sm"
            variant={isDisabled ? 'secondary' : 'success'}
            disabled={isDisabled}
            onClick={onComplete}
          >
            {isDisabled ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Done
              </>
            ) : activity.validationMethod === 'self_reported' ? (
              'Log Activity'
            ) : (
              <>
                <Clock className="h-3.5 w-3.5 mr-1" />
                Submit
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
