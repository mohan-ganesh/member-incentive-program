// ============================================================
// Core Domain Model Types for Wellness Incentive Platform
// ============================================================

// --- User / Member ---
export type UserRole = 'member' | 'admin' | 'partner';
export type MemberLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dateOfBirth: string;
  planType: string;
  geography: string;
  joinedAt: string;
  level: MemberLevel;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  streakDays: number;
  badges: Badge[];
  avatarUrl?: string;
  /** The employer group this member belongs to (if any) */
  employerGroupId?: string;
}

// --- Employer Group ---
export interface EmployerGroup {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  contactEmail?: string;
  isActive: boolean;
  createdAt: string;
}

// --- Program ---
export type ProgramStatus = 'draft' | 'active' | 'paused' | 'completed';

/**
 * Discriminates the regulatory environment the program operates under.
 * - commercial: Employer-sponsored / individual ACA plans (ERISA / ACA caps)
 * - medicare:   Medicare Advantage or Part D plans (CMS Star Ratings / HEDIS)
 * - medicaid:   State Medicaid / CHIP plans (state-specific rules)
 */
export type ProgramType = 'commercial' | 'medicare' | 'medicaid';

/** CMS / ACA regulatory incentive caps — enforced per program type */
export interface IncentiveCap {
  /** Max points value per single activity occurrence */
  perActivityMaxValue?: number;
  /** Max cumulative incentive value per member per year (in dollar-equivalent) */
  annualMaxValue?: number;
  /** Regulatory note shown to admins for awareness */
  regulatoryNote?: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  programType: ProgramType;
  startDate: string;
  endDate: string;
  status: ProgramStatus;
  eligibility: EligibilityCriteria;
  maxPoints: PointsCap;
  incentiveCap?: IncentiveCap;
  /** HEDIS / quality measure codes this program contributes to */
  hedisAlignments?: string[];
  activities: string[]; // activity IDs
  createdAt: string;
  updatedAt: string;
}

export interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  planTypes?: string[];
  geographies?: string[];
  /**
   * If set, only members belonging to one of these employer groups
   * are eligible for the program. Empty / undefined = open to all.
   */
  employerGroupIds?: string[];
}

export interface PointsCap {
  daily: number;
  monthly: number;
  lifetime: number;
}

// --- Activity ---
export type ActivityCategory =
  | 'preventive_care'
  | 'fitness'
  | 'nutrition'
  | 'education'
  | 'compliance';

export type ActivityFrequency = 'one_time' | 'daily' | 'weekly' | 'monthly';

export type ValidationMethod =
  | 'self_reported'
  | 'device_based'
  | 'provider_verified';

export interface Activity {
  id: string;
  programId: string;
  name: string;
  description: string;
  category: ActivityCategory;
  pointsValue: number;
  frequency: ActivityFrequency;
  validationMethod: ValidationMethod;
  expiryDays?: number;
  icon?: string;
  isActive: boolean;
}

// --- Event (Activity Completion) ---
export type EventStatus = 'pending' | 'validated' | 'rejected';
export type EventSource = 'manual' | 'wearable' | 'claims' | 'partner';

export interface ActivityEvent {
  id: string;
  userId: string;
  activityId: string;
  programId: string;
  timestamp: string;
  source: EventSource;
  status: EventStatus;
  rawData?: Record<string, unknown>;
  validatedAt?: string;
  pointsAwarded?: number;
}

// --- Points Ledger ---
export type LedgerEntryType = 'earn' | 'bonus' | 'adjustment' | 'redemption' | 'reversal' | 'expiry';

export interface LedgerEntry {
  id: string;
  userId: string;
  activityId?: string;
  eventId?: string;
  points: number;
  type: LedgerEntryType;
  description: string;
  timestamp: string;
  expiryDate?: string;
  balanceAfter: number;
}

// --- Rewards / Redemption ---
export type RewardCategory = 'gift_card' | 'premium_discount' | 'merchandise' | 'health_benefit';
export type RedemptionStatus = 'requested' | 'approved' | 'fulfilled' | 'rejected';

export interface Reward {
  id: string;
  name: string;
  description: string;
  category: RewardCategory;
  pointsCost: number;
  imageUrl?: string;
  inventory: number;
  isActive: boolean;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardId: string;
  pointsSpent: number;
  status: RedemptionStatus;
  requestedAt: string;
  processedAt?: string;
}

// --- Rules Engine ---
export type RuleConditionOperator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'between';

export interface RuleCondition {
  field: string;
  operator: RuleConditionOperator;
  value: string | number | string[] | number[];
}

export type RuleActionType = 'award_points' | 'award_bonus' | 'award_badge' | 'level_up';

export interface RuleAction {
  type: RuleActionType;
  value: number | string;
  description?: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  programId: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  isActive: boolean;
  createdAt: string;
}

// --- Gamification ---
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

// --- Notifications ---
export type NotificationType = 'points_earned' | 'streak_reminder' | 'badge_earned' | 'level_up' | 'redemption_status' | 'activity_reminder';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

// --- Analytics ---
export interface ProgramAnalytics {
  totalMembers: number;
  activeMembers: number;
  totalPointsAwarded: number;
  totalRedemptions: number;
  activitiesCompleted: number;
  participationRate: number;
  dailyActivityData: { date: string; activities: number; points: number }[];
  categoryBreakdown: { category: string; count: number }[];
}

// --- Quality & Care Gaps ---
export interface HEDISMeasure {
  id: string;
  code: string; // e.g., "BCS" (Breast Cancer Screening), "COL" (Colorectal Cancer Screening)
  name: string;
  description: string;
}

export interface CareGap {
  id: string;
  memberId: string;
  measureId: string; // references HEDISMeasure.id
  status: 'open' | 'closed';
  identifiedAt: string;
  closedAt?: string;
  associatedActivityId?: string; // The activity that, when completed, closes this gap
}
