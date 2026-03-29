import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  User,
  Program,
  Activity,
  ActivityEvent,
  LedgerEntry,
  Reward,
  Redemption,
  Rule,
  Notification,
  ProgramAnalytics,
  EventStatus,
  RedemptionStatus,
  LedgerEntryType,
  ProgramStatus,
} from '../types';
import {
  MOCK_USERS,
  MOCK_PROGRAMS,
  MOCK_ACTIVITIES,
  MOCK_EVENTS,
  MOCK_LEDGER,
  MOCK_REWARDS,
  MOCK_REDEMPTIONS,
  MOCK_RULES,
  MOCK_NOTIFICATIONS,
} from '../data/mockData';
import { evaluateRules, getDailyPoints, getMonthlyPoints } from '../engine/rulesEngine';

// --- State ---
interface AppState {
  currentUser: User;
  users: User[];
  programs: Program[];
  activities: Activity[];
  events: ActivityEvent[];
  ledger: LedgerEntry[];
  rewards: Reward[];
  redemptions: Redemption[];
  rules: Rule[];
  notifications: Notification[];
  viewMode: 'member' | 'admin';
}

// --- Actions ---
type AppAction =
  | { type: 'SWITCH_VIEW'; mode: 'member' | 'admin' }
  | { type: 'SWITCH_USER'; userId: string }
  | { type: 'COMPLETE_ACTIVITY'; activityId: string }
  | { type: 'VALIDATE_EVENT'; eventId: string; status: EventStatus }
  | { type: 'REDEEM_REWARD'; rewardId: string }
  | { type: 'UPDATE_REDEMPTION_STATUS'; redemptionId: string; status: RedemptionStatus }
  | { type: 'READ_NOTIFICATION'; notificationId: string }
  | { type: 'READ_ALL_NOTIFICATIONS' }
  | { type: 'CREATE_PROGRAM'; program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_PROGRAM_STATUS'; programId: string; status: ProgramStatus }
  | { type: 'CREATE_ACTIVITY'; activity: Omit<Activity, 'id'> }
  | { type: 'CREATE_RULE'; rule: Omit<Rule, 'id' | 'createdAt'> }
  | { type: 'ADD_NOTIFICATION'; notification: Omit<Notification, 'id'> };

const initialState: AppState = {
  currentUser: MOCK_USERS[0],
  users: MOCK_USERS,
  programs: MOCK_PROGRAMS,
  activities: MOCK_ACTIVITIES,
  events: MOCK_EVENTS,
  ledger: MOCK_LEDGER,
  rewards: MOCK_REWARDS,
  redemptions: MOCK_REDEMPTIONS,
  rules: MOCK_RULES,
  notifications: MOCK_NOTIFICATIONS,
  viewMode: 'member',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SWITCH_VIEW':
      return { ...state, viewMode: action.mode };

    case 'SWITCH_USER': {
      const user = state.users.find((u) => u.id === action.userId);
      if (!user) return state;
      return { ...state, currentUser: user };
    }

    case 'COMPLETE_ACTIVITY': {
      const activity = state.activities.find((a) => a.id === action.activityId);
      if (!activity) return state;

      const now = new Date().toISOString();
      const eventId = uuidv4();

      // Create event
      const newEvent: ActivityEvent = {
        id: eventId,
        userId: state.currentUser.id,
        activityId: activity.id,
        programId: activity.programId,
        timestamp: now,
        source: activity.validationMethod === 'self_reported' ? 'manual' : 'wearable',
        status: activity.validationMethod === 'self_reported' ? 'validated' : 'pending',
        pointsAwarded: activity.validationMethod === 'self_reported' ? activity.pointsValue : undefined,
        validatedAt: activity.validationMethod === 'self_reported' ? now : undefined,
      };

      // If self-reported, auto-validate and award points
      if (activity.validationMethod === 'self_reported') {
        const dailyPts = getDailyPoints(state.ledger, state.currentUser.id, new Date());
        const monthlyPts = getMonthlyPoints(state.ledger, state.currentUser.id, new Date());
        const totalActivities = state.events.filter(
          (e) => e.userId === state.currentUser.id && e.status === 'validated'
        ).length;

        const context = {
          event: newEvent,
          user: state.currentUser,
          activity,
          dailyPoints: dailyPts,
          monthlyPoints: monthlyPts,
          totalActivities,
        };

        const result = evaluateRules(state.rules, context);
        const currentBalance = getCurrentBalance(state.ledger, state.currentUser.id);

        const newLedgerEntries: LedgerEntry[] = [];

        // Points entry
        if (result.pointsToAward > 0) {
          const newBalance = currentBalance + result.pointsToAward;
          newLedgerEntries.push({
            id: uuidv4(),
            userId: state.currentUser.id,
            activityId: activity.id,
            eventId,
            points: result.pointsToAward,
            type: 'earn' as LedgerEntryType,
            description: `${activity.name} completed`,
            timestamp: now,
            expiryDate: getExpiryDate(activity.expiryDays),
            balanceAfter: newBalance,
          });
        }

        // Bonus entry
        if (result.bonusPoints > 0) {
          const bonusBalance = currentBalance + result.pointsToAward + result.bonusPoints;
          newLedgerEntries.push({
            id: uuidv4(),
            userId: state.currentUser.id,
            points: result.bonusPoints,
            type: 'bonus' as LedgerEntryType,
            description: 'Streak bonus!',
            timestamp: now,
            balanceAfter: bonusBalance,
          });
        }

        // Update user
        const totalEarned = result.pointsToAward + result.bonusPoints;
        const updatedUser: User = {
          ...state.currentUser,
          totalPointsEarned: state.currentUser.totalPointsEarned + totalEarned,
          streakDays: state.currentUser.streakDays + 1,
          level: (result.newLevel as User['level']) || state.currentUser.level,
        };

        const updatedUsers = state.users.map((u) =>
          u.id === updatedUser.id ? updatedUser : u
        );

        // Notification
        const newNotification: Notification = {
          id: uuidv4(),
          userId: state.currentUser.id,
          type: 'points_earned',
          title: 'Points Earned!',
          message: `You earned ${totalEarned} points for completing ${activity.name}.`,
          read: false,
          timestamp: now,
        };

        return {
          ...state,
          currentUser: updatedUser,
          users: updatedUsers,
          events: [...state.events, newEvent],
          ledger: [...state.ledger, ...newLedgerEntries],
          notifications: [newNotification, ...state.notifications],
        };
      }

      // Non-self-reported: just create event as pending
      return {
        ...state,
        events: [...state.events, newEvent],
      };
    }

    case 'VALIDATE_EVENT': {
      const event = state.events.find((e) => e.id === action.eventId);
      if (!event) return state;
      const activity = state.activities.find((a) => a.id === event.activityId);
      if (!activity) return state;
      const user = state.users.find((u) => u.id === event.userId);
      if (!user) return state;

      const now = new Date().toISOString();

      if (action.status === 'validated') {
        const currentBalance = getCurrentBalance(state.ledger, user.id);
        const newBalance = currentBalance + activity.pointsValue;

        const ledgerEntry: LedgerEntry = {
          id: uuidv4(),
          userId: user.id,
          activityId: activity.id,
          eventId: event.id,
          points: activity.pointsValue,
          type: 'earn',
          description: `${activity.name} validated`,
          timestamp: now,
          expiryDate: getExpiryDate(activity.expiryDays),
          balanceAfter: newBalance,
        };

        const updatedUser: User = {
          ...user,
          totalPointsEarned: user.totalPointsEarned + activity.pointsValue,
        };

        return {
          ...state,
          events: state.events.map((e) =>
            e.id === action.eventId
              ? { ...e, status: 'validated', validatedAt: now, pointsAwarded: activity.pointsValue }
              : e
          ),
          ledger: [...state.ledger, ledgerEntry],
          users: state.users.map((u) => (u.id === user.id ? updatedUser : u)),
          currentUser: state.currentUser.id === user.id ? updatedUser : state.currentUser,
        };
      }

      // Rejected
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.eventId ? { ...e, status: 'rejected', validatedAt: now } : e
        ),
      };
    }

    case 'REDEEM_REWARD': {
      const reward = state.rewards.find((r) => r.id === action.rewardId);
      if (!reward) return state;

      const currentBalance = getCurrentBalance(state.ledger, state.currentUser.id);
      if (currentBalance < reward.pointsCost) return state;

      const now = new Date().toISOString();
      const newBalance = currentBalance - reward.pointsCost;

      const redemption: Redemption = {
        id: uuidv4(),
        userId: state.currentUser.id,
        rewardId: reward.id,
        pointsSpent: reward.pointsCost,
        status: 'requested',
        requestedAt: now,
      };

      const ledgerEntry: LedgerEntry = {
        id: uuidv4(),
        userId: state.currentUser.id,
        points: -reward.pointsCost,
        type: 'redemption',
        description: `Redeemed: ${reward.name}`,
        timestamp: now,
        balanceAfter: newBalance,
      };

      const updatedUser: User = {
        ...state.currentUser,
        totalPointsRedeemed: state.currentUser.totalPointsRedeemed + reward.pointsCost,
      };

      const notification: Notification = {
        id: uuidv4(),
        userId: state.currentUser.id,
        type: 'redemption_status',
        title: 'Reward Requested!',
        message: `Your request for "${reward.name}" is being processed.`,
        read: false,
        timestamp: now,
      };

      return {
        ...state,
        currentUser: updatedUser,
        users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        redemptions: [...state.redemptions, redemption],
        ledger: [...state.ledger, ledgerEntry],
        rewards: state.rewards.map((r) =>
          r.id === reward.id ? { ...r, inventory: r.inventory - 1 } : r
        ),
        notifications: [notification, ...state.notifications],
      };
    }

    case 'UPDATE_REDEMPTION_STATUS': {
      return {
        ...state,
        redemptions: state.redemptions.map((r) =>
          r.id === action.redemptionId
            ? { ...r, status: action.status, processedAt: new Date().toISOString() }
            : r
        ),
      };
    }

    case 'READ_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.notificationId ? { ...n, read: true } : n
        ),
      };

    case 'READ_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.userId === state.currentUser.id ? { ...n, read: true } : n
        ),
      };

    case 'CREATE_PROGRAM': {
      const now = new Date().toISOString();
      const newProgram: Program = {
        ...action.program,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, programs: [...state.programs, newProgram] };
    }

    case 'UPDATE_PROGRAM_STATUS':
      return {
        ...state,
        programs: state.programs.map((p) =>
          p.id === action.programId
            ? { ...p, status: action.status, updatedAt: new Date().toISOString() }
            : p
        ),
      };

    case 'CREATE_ACTIVITY': {
      const newActivity: Activity = { ...action.activity, id: uuidv4() };
      return {
        ...state,
        activities: [...state.activities, newActivity],
        programs: state.programs.map((p) =>
          p.id === newActivity.programId
            ? { ...p, activities: [...p.activities, newActivity.id] }
            : p
        ),
      };
    }

    case 'CREATE_RULE': {
      const newRule: Rule = {
        ...action.rule,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      return { ...state, rules: [...state.rules, newRule] };
    }

    case 'ADD_NOTIFICATION': {
      const newNotif: Notification = { ...action.notification, id: uuidv4() };
      return { ...state, notifications: [newNotif, ...state.notifications] };
    }

    default:
      return state;
  }
}

// --- Helpers ---
function getCurrentBalance(ledger: LedgerEntry[], userId: string): number {
  const userEntries = ledger.filter((e) => e.userId === userId);
  if (userEntries.length === 0) return 0;
  return userEntries.reduce((sum, e) => sum + e.points, 0);
}

function getExpiryDate(expiryDays?: number): string {
  const d = new Date();
  d.setDate(d.getDate() + (expiryDays || 365));
  return d.toISOString().split('T')[0];
}

// --- Analytics ---
function computeAnalytics(state: AppState, programId: string): ProgramAnalytics {
  const programEvents = state.events.filter((e) => e.programId === programId);
  const validatedEvents = programEvents.filter((e) => e.status === 'validated');
  const memberIds = new Set(programEvents.map((e) => e.userId));
  const activeMemberIds = new Set(validatedEvents.map((e) => e.userId));
  const totalPointsAwarded = validatedEvents.reduce((s, e) => s + (e.pointsAwarded || 0), 0);
  const programRedemptions = state.redemptions.filter((r) => memberIds.has(r.userId));

  // Daily data for last 7 days
  const dailyActivityData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayEvents = validatedEvents.filter(
      (e) => e.timestamp.split('T')[0] === dateStr
    );
    dailyActivityData.push({
      date: dateStr,
      activities: dayEvents.length,
      points: dayEvents.reduce((s, e) => s + (e.pointsAwarded || 0), 0),
    });
  }

  // Category breakdown
  const categoryMap = new Map<string, number>();
  for (const evt of validatedEvents) {
    const act = state.activities.find((a) => a.id === evt.activityId);
    if (act) {
      categoryMap.set(act.category, (categoryMap.get(act.category) || 0) + 1);
    }
  }
  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count,
  }));

  const totalMembers = state.users.filter((u) => u.role === 'member').length;

  return {
    totalMembers,
    activeMembers: activeMemberIds.size,
    totalPointsAwarded,
    totalRedemptions: programRedemptions.length,
    activitiesCompleted: validatedEvents.length,
    participationRate: totalMembers > 0 ? (activeMemberIds.size / totalMembers) * 100 : 0,
    dailyActivityData,
    categoryBreakdown,
  };
}

// --- Context ---
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getBalance: (userId?: string) => number;
  getAnalytics: (programId: string) => ProgramAnalytics;
  getUserEvents: (userId?: string) => ActivityEvent[];
  getUserLedger: (userId?: string) => LedgerEntry[];
  getUserNotifications: (userId?: string) => Notification[];
  getUserRedemptions: (userId?: string) => Redemption[];
  getUnreadCount: (userId?: string) => number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const getBalance = (userId?: string) =>
    getCurrentBalance(state.ledger, userId || state.currentUser.id);

  const getAnalytics = (programId: string) => computeAnalytics(state, programId);

  const getUserEvents = (userId?: string) =>
    state.events.filter((e) => e.userId === (userId || state.currentUser.id));

  const getUserLedger = (userId?: string) =>
    state.ledger.filter((e) => e.userId === (userId || state.currentUser.id));

  const getUserNotifications = (userId?: string) =>
    state.notifications.filter((n) => n.userId === (userId || state.currentUser.id));

  const getUserRedemptions = (userId?: string) =>
    state.redemptions.filter((r) => r.userId === (userId || state.currentUser.id));

  const getUnreadCount = (userId?: string) =>
    state.notifications.filter(
      (n) => n.userId === (userId || state.currentUser.id) && !n.read
    ).length;

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        getBalance,
        getAnalytics,
        getUserEvents,
        getUserLedger,
        getUserNotifications,
        getUserRedemptions,
        getUnreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
