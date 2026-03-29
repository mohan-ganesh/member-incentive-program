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
  Badge,
} from '../types';

// --- Badges ---
export const ALL_BADGES: Badge[] = [
  { id: 'badge-1', name: 'First Steps', description: 'Complete your first activity', icon: '🏃' },
  { id: 'badge-2', name: 'Streak Master', description: '7-day activity streak', icon: '🔥' },
  { id: 'badge-3', name: 'Health Champion', description: 'Earn 1000 points', icon: '🏆' },
  { id: 'badge-4', name: 'Wellness Warrior', description: 'Complete 50 activities', icon: '⚔️' },
  { id: 'badge-5', name: 'Nutrition Pro', description: 'Log meals for 30 days', icon: '🥗' },
  { id: 'badge-6', name: 'Step Legend', description: 'Walk 10k steps 10 times', icon: '👟' },
];

// --- Users ---
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'member',
    dateOfBirth: '1990-05-15',
    planType: 'premium',
    geography: 'US-CA',
    joinedAt: '2025-01-10T08:00:00Z',
    level: 'gold',
    totalPointsEarned: 2450,
    totalPointsRedeemed: 500,
    streakDays: 12,
    badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[2]],
  },
  {
    id: 'user-2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'member',
    dateOfBirth: '1985-08-22',
    planType: 'basic',
    geography: 'US-NY',
    joinedAt: '2025-02-01T08:00:00Z',
    level: 'silver',
    totalPointsEarned: 1200,
    totalPointsRedeemed: 200,
    streakDays: 5,
    badges: [ALL_BADGES[0]],
  },
  {
    id: 'user-3',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'member',
    dateOfBirth: '1978-12-03',
    planType: 'premium',
    geography: 'US-TX',
    joinedAt: '2025-01-20T08:00:00Z',
    level: 'bronze',
    totalPointsEarned: 450,
    totalPointsRedeemed: 0,
    streakDays: 2,
    badges: [],
  },
  {
    id: 'admin-1',
    name: 'Dr. Sarah Admin',
    email: 'admin@wellness.com',
    role: 'admin',
    dateOfBirth: '1975-03-10',
    planType: 'staff',
    geography: 'US-CA',
    joinedAt: '2024-12-01T08:00:00Z',
    level: 'platinum',
    totalPointsEarned: 0,
    totalPointsRedeemed: 0,
    streakDays: 0,
    badges: [],
  },
];

// --- Programs ---
export const MOCK_PROGRAMS: Program[] = [
  {
    id: 'prog-1',
    name: 'Healthy Living 2025',
    description: 'A comprehensive wellness program rewarding members for healthy behaviors including fitness, nutrition, and preventive care.',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    eligibility: {
      minAge: 18,
      maxAge: 65,
      planTypes: ['basic', 'premium'],
      geographies: ['US-CA', 'US-NY', 'US-TX'],
    },
    maxPoints: { daily: 200, monthly: 3000, lifetime: 25000 },
    activities: ['act-1', 'act-2', 'act-3', 'act-4', 'act-5', 'act-6'],
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prog-2',
    name: 'Step Challenge Q1',
    description: 'Quarterly step challenge — earn bonus points for meeting daily step goals.',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    status: 'completed',
    eligibility: {
      planTypes: ['basic', 'premium'],
    },
    maxPoints: { daily: 100, monthly: 2000, lifetime: 5000 },
    activities: ['act-7'],
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z',
  },
];

// --- Activities ---
export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    programId: 'prog-1',
    name: 'Annual Health Checkup',
    description: 'Complete your annual physical examination with a provider.',
    category: 'preventive_care',
    pointsValue: 500,
    frequency: 'one_time',
    validationMethod: 'provider_verified',
    icon: '🏥',
    isActive: true,
  },
  {
    id: 'act-2',
    programId: 'prog-1',
    name: 'Daily Steps (10,000)',
    description: 'Walk at least 10,000 steps in a day.',
    category: 'fitness',
    pointsValue: 50,
    frequency: 'daily',
    validationMethod: 'device_based',
    icon: '🚶',
    isActive: true,
  },
  {
    id: 'act-3',
    programId: 'prog-1',
    name: 'Log a Healthy Meal',
    description: 'Log a balanced, healthy meal in the nutrition tracker.',
    category: 'nutrition',
    pointsValue: 20,
    frequency: 'daily',
    validationMethod: 'self_reported',
    icon: '🥗',
    isActive: true,
  },
  {
    id: 'act-4',
    programId: 'prog-1',
    name: 'Complete Health Quiz',
    description: 'Take a health education quiz and score 80% or above.',
    category: 'education',
    pointsValue: 100,
    frequency: 'weekly',
    validationMethod: 'self_reported',
    icon: '📚',
    isActive: true,
  },
  {
    id: 'act-5',
    programId: 'prog-1',
    name: 'Medication Adherence',
    description: 'Confirm daily medication taken as prescribed.',
    category: 'compliance',
    pointsValue: 30,
    frequency: 'daily',
    validationMethod: 'self_reported',
    icon: '💊',
    isActive: true,
  },
  {
    id: 'act-6',
    programId: 'prog-1',
    name: 'Gym Workout Session',
    description: 'Complete a gym workout session of at least 30 minutes.',
    category: 'fitness',
    pointsValue: 75,
    frequency: 'daily',
    validationMethod: 'device_based',
    icon: '🏋️',
    isActive: true,
  },
  {
    id: 'act-7',
    programId: 'prog-2',
    name: 'Step Challenge Entry',
    description: 'Log your daily steps for the step challenge.',
    category: 'fitness',
    pointsValue: 40,
    frequency: 'daily',
    validationMethod: 'device_based',
    icon: '👟',
    isActive: false,
  },
];

// --- Events ---
const today = new Date();
function daysAgo(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_EVENTS: ActivityEvent[] = [
  { id: 'evt-1', userId: 'user-1', activityId: 'act-2', programId: 'prog-1', timestamp: daysAgo(0), source: 'wearable', status: 'validated', pointsAwarded: 50, validatedAt: daysAgo(0) },
  { id: 'evt-2', userId: 'user-1', activityId: 'act-3', programId: 'prog-1', timestamp: daysAgo(0), source: 'manual', status: 'validated', pointsAwarded: 20, validatedAt: daysAgo(0) },
  { id: 'evt-3', userId: 'user-1', activityId: 'act-2', programId: 'prog-1', timestamp: daysAgo(1), source: 'wearable', status: 'validated', pointsAwarded: 50, validatedAt: daysAgo(1) },
  { id: 'evt-4', userId: 'user-1', activityId: 'act-4', programId: 'prog-1', timestamp: daysAgo(2), source: 'manual', status: 'validated', pointsAwarded: 100, validatedAt: daysAgo(2) },
  { id: 'evt-5', userId: 'user-1', activityId: 'act-1', programId: 'prog-1', timestamp: daysAgo(5), source: 'claims', status: 'validated', pointsAwarded: 500, validatedAt: daysAgo(4) },
  { id: 'evt-6', userId: 'user-1', activityId: 'act-6', programId: 'prog-1', timestamp: daysAgo(1), source: 'wearable', status: 'validated', pointsAwarded: 75, validatedAt: daysAgo(1) },
  { id: 'evt-7', userId: 'user-2', activityId: 'act-2', programId: 'prog-1', timestamp: daysAgo(0), source: 'wearable', status: 'validated', pointsAwarded: 50, validatedAt: daysAgo(0) },
  { id: 'evt-8', userId: 'user-2', activityId: 'act-3', programId: 'prog-1', timestamp: daysAgo(1), source: 'manual', status: 'pending' },
  { id: 'evt-9', userId: 'user-3', activityId: 'act-5', programId: 'prog-1', timestamp: daysAgo(0), source: 'manual', status: 'validated', pointsAwarded: 30, validatedAt: daysAgo(0) },
  { id: 'evt-10', userId: 'user-1', activityId: 'act-5', programId: 'prog-1', timestamp: daysAgo(0), source: 'manual', status: 'pending' },
];

// --- Ledger ---
export const MOCK_LEDGER: LedgerEntry[] = [
  { id: 'led-1', userId: 'user-1', activityId: 'act-1', eventId: 'evt-5', points: 500, type: 'earn', description: 'Annual Health Checkup completed', timestamp: daysAgo(5), expiryDate: '2026-12-31', balanceAfter: 500 },
  { id: 'led-2', userId: 'user-1', activityId: 'act-2', eventId: 'evt-3', points: 50, type: 'earn', description: 'Daily Steps (10,000) completed', timestamp: daysAgo(1), expiryDate: '2026-12-31', balanceAfter: 550 },
  { id: 'led-3', userId: 'user-1', activityId: 'act-6', eventId: 'evt-6', points: 75, type: 'earn', description: 'Gym Workout Session completed', timestamp: daysAgo(1), expiryDate: '2026-12-31', balanceAfter: 625 },
  { id: 'led-4', userId: 'user-1', activityId: 'act-4', eventId: 'evt-4', points: 100, type: 'earn', description: 'Health Quiz completed', timestamp: daysAgo(2), expiryDate: '2026-12-31', balanceAfter: 725 },
  { id: 'led-5', userId: 'user-1', points: 200, type: 'bonus', description: '7-day streak bonus!', timestamp: daysAgo(1), balanceAfter: 925 },
  { id: 'led-6', userId: 'user-1', activityId: 'act-2', eventId: 'evt-1', points: 50, type: 'earn', description: 'Daily Steps (10,000) completed', timestamp: daysAgo(0), expiryDate: '2026-12-31', balanceAfter: 975 },
  { id: 'led-7', userId: 'user-1', activityId: 'act-3', eventId: 'evt-2', points: 20, type: 'earn', description: 'Logged a healthy meal', timestamp: daysAgo(0), expiryDate: '2026-12-31', balanceAfter: 995 },
  { id: 'led-8', userId: 'user-1', points: -500, type: 'redemption', description: 'Redeemed: $25 Amazon Gift Card', timestamp: daysAgo(3), balanceAfter: 1450 },
  { id: 'led-9', userId: 'user-2', activityId: 'act-2', eventId: 'evt-7', points: 50, type: 'earn', description: 'Daily Steps (10,000) completed', timestamp: daysAgo(0), expiryDate: '2026-12-31', balanceAfter: 1050 },
  { id: 'led-10', userId: 'user-3', activityId: 'act-5', eventId: 'evt-9', points: 30, type: 'earn', description: 'Medication Adherence logged', timestamp: daysAgo(0), expiryDate: '2026-12-31', balanceAfter: 480 },
];

// --- Rewards ---
export const MOCK_REWARDS: Reward[] = [
  { id: 'rew-1', name: '$25 Amazon Gift Card', description: 'A $25 Amazon.com e-gift card delivered to your email.', category: 'gift_card', pointsCost: 500, inventory: 100, isActive: true },
  { id: 'rew-2', name: '$50 Amazon Gift Card', description: 'A $50 Amazon.com e-gift card delivered to your email.', category: 'gift_card', pointsCost: 900, inventory: 50, isActive: true },
  { id: 'rew-3', name: 'Premium Plan Discount (10%)', description: '10% off your next premium plan renewal.', category: 'premium_discount', pointsCost: 1500, inventory: 999, isActive: true },
  { id: 'rew-4', name: 'Fitness Tracker Band', description: 'A basic fitness tracker wristband.', category: 'merchandise', pointsCost: 2000, inventory: 25, isActive: true },
  { id: 'rew-5', name: 'Free Flu Shot', description: 'Complimentary flu vaccination at a partner pharmacy.', category: 'health_benefit', pointsCost: 300, inventory: 500, isActive: true },
  { id: 'rew-6', name: 'Yoga Mat', description: 'Premium eco-friendly yoga mat.', category: 'merchandise', pointsCost: 1200, inventory: 30, isActive: true },
];

// --- Redemptions ---
export const MOCK_REDEMPTIONS: Redemption[] = [
  { id: 'rdm-1', userId: 'user-1', rewardId: 'rew-1', pointsSpent: 500, status: 'fulfilled', requestedAt: daysAgo(3), processedAt: daysAgo(2) },
  { id: 'rdm-2', userId: 'user-2', rewardId: 'rew-5', pointsSpent: 300, status: 'approved', requestedAt: daysAgo(1) },
];

// --- Rules ---
export const MOCK_RULES: Rule[] = [
  {
    id: 'rule-1',
    name: 'Standard Points Award',
    description: 'Award activity points when an event is validated.',
    programId: 'prog-1',
    conditions: [{ field: 'event.status', operator: 'eq', value: 'validated' }],
    actions: [{ type: 'award_points', value: 0, description: 'Award activity-defined points' }],
    priority: 1,
    isActive: true,
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'rule-2',
    name: '7-Day Streak Bonus',
    description: 'Award 200 bonus points when a member hits a 7-day streak.',
    programId: 'prog-1',
    conditions: [{ field: 'user.streakDays', operator: 'gte', value: 7 }],
    actions: [{ type: 'award_bonus', value: 200, description: '7-day streak bonus' }],
    priority: 2,
    isActive: true,
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'rule-3',
    name: 'Gold Level Up',
    description: 'Promote member to Gold when they earn 2000+ lifetime points.',
    programId: 'prog-1',
    conditions: [{ field: 'user.totalPointsEarned', operator: 'gte', value: 2000 }],
    actions: [{ type: 'level_up', value: 'gold', description: 'Promote to Gold' }],
    priority: 3,
    isActive: true,
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'rule-4',
    name: 'First Activity Badge',
    description: 'Award "First Steps" badge on completing the first activity.',
    programId: 'prog-1',
    conditions: [{ field: 'user.totalActivities', operator: 'eq', value: 1 }],
    actions: [{ type: 'award_badge', value: 'badge-1', description: 'First Steps badge' }],
    priority: 4,
    isActive: true,
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'rule-5',
    name: 'Daily Points Cap',
    description: 'Do not exceed 200 points in a single day.',
    programId: 'prog-1',
    conditions: [{ field: 'user.dailyPoints', operator: 'lte', value: 200 }],
    actions: [{ type: 'award_points', value: 0, description: 'Cap enforcement' }],
    priority: 0,
    isActive: true,
    createdAt: '2024-12-01T10:00:00Z',
  },
];

// --- Notifications ---
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', userId: 'user-1', type: 'points_earned', title: 'Points Earned!', message: 'You earned 50 points for completing Daily Steps.', read: false, timestamp: daysAgo(0) },
  { id: 'notif-2', userId: 'user-1', type: 'badge_earned', title: 'Badge Unlocked!', message: 'You earned the "Health Champion" badge!', read: false, timestamp: daysAgo(1) },
  { id: 'notif-3', userId: 'user-1', type: 'streak_reminder', title: 'Keep Your Streak!', message: "You're on a 12-day streak! Don't break it.", read: true, timestamp: daysAgo(1) },
  { id: 'notif-4', userId: 'user-1', type: 'redemption_status', title: 'Reward Fulfilled', message: 'Your $25 Amazon Gift Card has been sent to your email.', read: true, timestamp: daysAgo(2) },
  { id: 'notif-5', userId: 'user-2', type: 'points_earned', title: 'Points Earned!', message: 'You earned 50 points for completing Daily Steps.', read: false, timestamp: daysAgo(0) },
  { id: 'notif-6', userId: 'user-1', type: 'activity_reminder', title: 'Activity Reminder', message: "Don't forget to log your healthy meal today!", read: false, timestamp: daysAgo(0) },
];
