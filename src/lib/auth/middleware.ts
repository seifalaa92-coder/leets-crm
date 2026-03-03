/**
 * Auth Middleware
 * 
 * Protects routes based on user authentication and role.
 * Redirects unauthorized users to login page.
 * 
 * DEVELOPMENT MODE: 
 * - Set DEV_BYPASS_AUTH=true in .env.local to bypass login
 * - Set DEV_BYPASS_ROLE=member to view as client (options: super_admin, manager, coach, front_desk, member)
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

// Development bypass settings
const BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === "true";
const BYPASS_ROLE = (process.env.DEV_BYPASS_ROLE || "super_admin") as UserRole;

// Mock users for different roles
const MOCK_USERS: Record<UserRole, any> = {
  super_admin: {
    id: "dev-admin-uuid",
    email: "admin@leets.com",
    profile: {
      id: "dev-admin-uuid",
      role: "super_admin" as UserRole,
      first_name: "Admin",
      last_name: "User",
      email: "admin@leets.com",
      phone: "+966500000001",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    }
  },
  manager: {
    id: "dev-manager-uuid",
    email: "manager@leets.com",
    profile: {
      id: "dev-manager-uuid",
      role: "manager" as UserRole,
      first_name: "Manager",
      last_name: "User",
      email: "manager@leets.com",
      phone: "+966500000002",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    }
  },
  coach: {
    id: "dev-coach-uuid",
    email: "coach@leets.com",
    profile: {
      id: "dev-coach-uuid",
      role: "coach" as UserRole,
      first_name: "Coach",
      last_name: "User",
      email: "coach@leets.com",
      phone: "+966500000003",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    }
  },
  front_desk: {
    id: "dev-frontdesk-uuid",
    email: "frontdesk@leets.com",
    profile: {
      id: "dev-frontdesk-uuid",
      role: "front_desk" as UserRole,
      first_name: "Front Desk",
      last_name: "Staff",
      email: "frontdesk@leets.com",
      phone: "+966500000004",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    }
  },
  member: {
    id: "dev-member-uuid",
    email: "member@leets.com",
    profile: {
      id: "dev-member-uuid",
      role: "member" as UserRole,
      first_name: "Ahmed",
      last_name: "Hassan",
      email: "member@leets.com",
      phone: "+966500000005",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    }
  }
};

// Get current mock user based on role
const getMockUser = () => MOCK_USERS[BYPASS_ROLE] || MOCK_USERS.super_admin;

/**
 * Check if user is authenticated
 */
export async function requireAuth() {
  if (BYPASS_AUTH) {
    return { user: getMockUser() };
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return session;
}

/**
 * Check if user has required role
 */
export async function requireRole(allowedRoles: UserRole[]) {
  if (BYPASS_AUTH) {
    const mockUser = getMockUser();
    return { 
      session: { user: mockUser }, 
      profile: mockUser.profile 
    };
  }

  const session = await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return { session, profile };
}

/**
 * Get current user with profile
 */
export async function getCurrentUser() {
  if (BYPASS_AUTH) {
    return getMockUser();
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return {
    ...session.user,
    profile,
  };
}

/**
 * Get user role
 */
export async function getUserRole(): Promise<UserRole | null> {
  if (BYPASS_AUTH) {
    return BYPASS_ROLE;
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  return profile?.role || null;
}
