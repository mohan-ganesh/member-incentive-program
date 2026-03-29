import type { Rule, RuleCondition, ActivityEvent, User, Activity, LedgerEntry } from '../types';

/**
 * Rules Engine - Evaluates configurable JSON-based rules
 * Supports: conditional logic, caps, eligibility, bonus calculations
 */

type ContextValue = string | number | string[] | undefined;

interface RuleContext {
  event: ActivityEvent;
  user: User;
  activity: Activity;
  dailyPoints: number;
  monthlyPoints: number;
  totalActivities: number;
}

function getContextValue(context: RuleContext, field: string): ContextValue {
  const parts = field.split('.');
  if (parts.length !== 2) return undefined;
  const [obj, key] = parts;

  switch (obj) {
    case 'event': {
      const eventMap: Record<string, ContextValue> = {
        status: context.event.status,
        source: context.event.source,
      };
      return eventMap[key];
    }
    case 'user': {
      const userMap: Record<string, ContextValue> = {
        streakDays: context.user.streakDays,
        totalPointsEarned: context.user.totalPointsEarned,
        level: context.user.level,
        planType: context.user.planType,
        dailyPoints: context.dailyPoints,
        monthlyPoints: context.monthlyPoints,
        totalActivities: context.totalActivities,
      };
      return userMap[key];
    }
    case 'activity': {
      const activityMap: Record<string, ContextValue> = {
        category: context.activity.category,
        frequency: context.activity.frequency,
        pointsValue: context.activity.pointsValue,
      };
      return activityMap[key];
    }
    default:
      return undefined;
  }
}

function evaluateCondition(condition: RuleCondition, context: RuleContext): boolean {
  const contextValue = getContextValue(context, condition.field);
  if (contextValue === undefined) return false;

  const { operator, value } = condition;

  switch (operator) {
    case 'eq':
      return contextValue === value;
    case 'gt':
      return typeof contextValue === 'number' && typeof value === 'number' && contextValue > value;
    case 'gte':
      return typeof contextValue === 'number' && typeof value === 'number' && contextValue >= value;
    case 'lt':
      return typeof contextValue === 'number' && typeof value === 'number' && contextValue < value;
    case 'lte':
      return typeof contextValue === 'number' && typeof value === 'number' && contextValue <= value;
    case 'in':
      return Array.isArray(value) && (value as (string | number)[]).includes(contextValue as string);
    case 'between':
      return (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof contextValue === 'number' &&
        typeof value[0] === 'number' &&
        typeof value[1] === 'number' &&
        contextValue >= value[0] &&
        contextValue <= value[1]
      );
    default:
      return false;
  }
}

export function evaluateRules(
  rules: Rule[],
  context: RuleContext
): { pointsToAward: number; bonusPoints: number; badgeId?: string; newLevel?: string } {
  const activeRules = rules
    .filter((r) => r.isActive)
    .sort((a, b) => a.priority - b.priority);

  let pointsToAward = 0;
  let bonusPoints = 0;
  let badgeId: string | undefined;
  let newLevel: string | undefined;

  for (const rule of activeRules) {
    const allConditionsMet = rule.conditions.every((c) => evaluateCondition(c, context));

    if (allConditionsMet) {
      for (const action of rule.actions) {
        switch (action.type) {
          case 'award_points':
            pointsToAward = typeof action.value === 'number' && action.value > 0
              ? action.value
              : context.activity.pointsValue;
            break;
          case 'award_bonus':
            bonusPoints += typeof action.value === 'number' ? action.value : 0;
            break;
          case 'award_badge':
            badgeId = String(action.value);
            break;
          case 'level_up':
            newLevel = String(action.value);
            break;
        }
      }
    }
  }

  return { pointsToAward, bonusPoints, badgeId, newLevel };
}

/**
 * Calculate daily points from ledger for a given user and date
 */
export function getDailyPoints(ledger: LedgerEntry[], userId: string, date: Date): number {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return ledger
    .filter(
      (e) =>
        e.userId === userId &&
        e.points > 0 &&
        new Date(e.timestamp) >= dayStart &&
        new Date(e.timestamp) <= dayEnd
    )
    .reduce((sum, e) => sum + e.points, 0);
}

/**
 * Calculate monthly points from ledger for a given user and month
 */
export function getMonthlyPoints(ledger: LedgerEntry[], userId: string, date: Date): number {
  const month = date.getMonth();
  const year = date.getFullYear();

  return ledger
    .filter((e) => {
      const d = new Date(e.timestamp);
      return (
        e.userId === userId &&
        e.points > 0 &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    })
    .reduce((sum, e) => sum + e.points, 0);
}
