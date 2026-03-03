/**
 * LEETS Sports Venue CRM - TypeScript Type Definitions
 * 
 * This file contains all type definitions for the application.
 * Keeping types centralized ensures consistency across the codebase.
 */

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export type UserRole = "super_admin" | "manager" | "coach" | "front_desk" | "member";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface UserProfile extends User {
  // Extended profile information
  dateOfBirth: string | null;
  gender: "male" | "female" | "other" | null;
  nationality: string | null;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  } | null;
}

// ============================================================================
// MEMBERSHIP TYPES
// ============================================================================

export type MembershipTierType = "monthly" | "annual" | "day_pass" | "corporate";
export type MembershipStatus = "active" | "expired" | "suspended" | "cancelled" | "pending";

export interface MembershipTier {
  id: string;
  name: string;
  type: MembershipTierType;
  durationDays: number;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  clientId: string;
  tierId: string;
  tier: MembershipTier;
  startDate: string;
  endDate: string;
  price: number;
  status: MembershipStatus;
  autoRenew: boolean;
  companyName: string | null;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
}

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface Client {
  id: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  firstNameAr: string | null;
  lastNameAr: string | null;
  email: string;
  phone: string;
  photoUrl: string | null;
  dateOfBirth: string | null;
  gender: "male" | "female" | "other" | null;
  nationality: string | null;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  } | null;
  notes: string | null;
  isActive: boolean;
  referredBy: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  currentMembership: Membership | null;
  loyaltyPoints: number;
}

export interface ClientWithDetails extends Client {
  membershipHistory: Membership[];
  bookingHistory: Booking[];
  paymentHistory: Payment[];
  attendanceLog: AccessLog[];
  loyaltyTransactions: LoyaltyTransaction[];
}

// ============================================================================
// QR CODE & ACCESS CONTROL TYPES
// ============================================================================

export interface QRCode {
  id: string;
  clientId: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}

export type AccessType = "entry" | "exit";
export type AccessStatus = "granted" | "denied" | "expired_membership" | "invalid_qr";

export interface AccessLog {
  id: string;
  clientId: string;
  client: Client;
  qrCodeId: string;
  accessType: AccessType;
  status: AccessStatus;
  scannedBy: string | null;
  scannedAt: string;
  location: string | null;
  notes: string | null;
}

// ============================================================================
// EMPLOYEE ATTENDANCE TYPES
// ============================================================================

export interface EmployeeAttendance {
  id: string;
  userId: string;
  user: User;
  clockInAt: string;
  clockOutAt: string | null;
  clockInMethod: "app" | "qr" | "manual";
  clockOutMethod: "app" | "qr" | "manual" | null;
  totalHours: number | null;
  isLate: boolean;
  lateReason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// LOYALTY PROGRAM TYPES
// ============================================================================

export type LoyaltyTransactionType = "earned" | "redeemed" | "adjusted" | "bonus";

export interface LoyaltyTransaction {
  id: string;
  clientId: string;
  type: LoyaltyTransactionType;
  points: number;
  reason: string;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
  createdBy: string | null;
}

export interface Reward {
  id: string;
  name: string;
  nameAr: string | null;
  description: string;
  descriptionAr: string | null;
  pointsCost: number;
  quantityAvailable: number | null;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RewardRedemption {
  id: string;
  clientId: string;
  rewardId: string;
  reward: Reward;
  pointsUsed: number;
  status: "pending" | "fulfilled" | "cancelled";
  redeemedAt: string;
  fulfilledAt: string | null;
  fulfilledBy: string | null;
}

// ============================================================================
// CLASS & BOOKING TYPES
// ============================================================================

export type ClassType = "group" | "private" | "open_play" | "tournament";
export type ClassStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type BookingStatus = "confirmed" | "cancelled" | "waitlist" | "attended" | "no_show";

export interface Court {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ClassSchedule {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  type: ClassType;
  courtId: string;
  court: Court;
  coachId: string;
  coach: User;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxCapacity: number;
  price: number;
  status: ClassStatus;
  isRecurring: boolean;
  recurringPattern: string | null;
  createdAt: string;
  updatedAt: string;
  // Computed fields
  currentBookings: number;
  availableSpots: number;
}

export interface Booking {
  id: string;
  clientId: string;
  client: Client;
  classId: string;
  class: ClassSchedule;
  status: BookingStatus;
  price: number;
  paid: boolean;
  paymentId: string | null;
  bookedAt: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  checkedInAt: string | null;
}

export interface WaitlistEntry {
  id: string;
  clientId: string;
  client: Client;
  classId: string;
  position: number;
  status: "waiting" | "promoted" | "expired";
  createdAt: string;
  promotedAt: string | null;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export type PaymentMethod = "cash" | "card" | "bank_transfer" | "check" | "other";
export type PaymentCategory = "membership" | "class" | "day_pass" | "merchandise" | "other";
export type PaymentStatus = "completed" | "pending" | "failed" | "refunded";

export interface Payment {
  id: string;
  clientId: string;
  client: Client;
  amount: number;
  method: PaymentMethod;
  category: PaymentCategory;
  referenceNumber: string | null;
  status: PaymentStatus;
  recordedBy: string;
  recordedByUser: User;
  notes: string | null;
  receiptUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  payment: Payment;
  amount: number;
  reason: string;
  approvedBy: string;
  approvedByUser: User;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  processedAt: string | null;
  notes: string | null;
}

// ============================================================================
// SALES & LEADS TYPES
// ============================================================================

export type LeadStatus = "new" | "contacted" | "trial_scheduled" | "trial_completed" | "converted" | "churned" | "lost";
export type LeadSource = "walk_in" | "referral" | "social_media" | "website" | "phone" | "other";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interestType: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string | null;
  assignedToUser: User | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  convertedAt: string | null;
  convertedToClientId: string | null;
}

export interface LeadNote {
  id: string;
  leadId: string;
  note: string;
  followUpDate: string | null;
  createdBy: string;
  createdByUser: User;
  createdAt: string;
}

export interface SalesMetrics {
  totalRevenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  revenueByCategory: {
    membership: number;
    classBooking: number;
    dayPass: number;
    corporate: number;
  };
  leads: {
    total: number;
    new: number;
    converted: number;
    conversionRate: number;
  };
  activeMembers: number;
  averageRevenuePerMember: number;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = "membership_expiry" | "class_reminder" | "payment_received" | "booking_confirmed" | "announcement" | "points_earned" | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any> | null;
  isRead: boolean;
  sentVia: ("push" | "email" | "sms")[];
  createdAt: string;
  readAt: string | null;
}

// ============================================================================
// SYSTEM & SETTINGS TYPES
// ============================================================================

export interface VenueSettings {
  id: string;
  name: string;
  nameAr: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  timezone: string;
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  currency: string;
  currencySymbol: string;
  loyaltyPointsPerCurrency: number;
  referralBonusPoints: number;
  attendanceStreakThreshold: number;
  attendanceStreakBonus: number;
  classCancellationWindowHours: number;
  features: {
    waitlist: boolean;
    referralBonuses: boolean;
    loyaltyProgram: boolean;
    employeeAttendance: boolean;
  };
  updatedAt: string;
  updatedBy: string | null;
}

export interface SystemLog {
  id: string;
  userId: string | null;
  user: User | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  message: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardMetrics {
  totalActiveMembers: number;
  expiringThisWeek: number;
  expiredThisMonth: number;
  newSignupsThisMonth: number;
  todayRevenue: number;
  classesToday: number;
  staffOnDuty: number;
  attendanceToday: number;
}

export interface RecentActivity {
  id: string;
  type: "member_checkin" | "new_member" | "payment" | "class_booking" | "membership_expiry";
  description: string;
  timestamp: string;
  userName: string | null;
}
