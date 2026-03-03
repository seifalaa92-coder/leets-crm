/**
 * Memberships Page - Modern Design with SAR Currency
 * 
 * Displays membership management with tiers, active memberships, and renewals.
 */

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/middleware";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MembershipWithDetails {
  id: string;
  client_id: string;
  tier_id: string;
  start_date: string;
  end_date: string;
  price: number;
  status: string;
  auto_renew: boolean;
  client: {
    first_name: string;
    last_name: string;
    email: string;
  };
  tier: {
    name: string;
    type: string;
  };
}

async function getMemberships(): Promise<MembershipWithDetails[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("memberships")
    .select(`
      id,
      client_id,
      tier_id,
      start_date,
      end_date,
      price,
      status,
      auto_renew,
      client:clients(first_name, last_name, email),
      tier:membership_tiers(name, type)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching memberships:", error);
    return [];
  }

  return data || [];
}

async function getMembershipTiers() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("membership_tiers")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching tiers:", error);
    return [];
  }

  return data || [];
}

export default async function MembershipsPage() {
  await requireRole(["super_admin", "manager", "front_desk"]);
  
  const [memberships, tiers] = await Promise.all([
    getMemberships(),
    getMembershipTiers(),
  ]);

  const activeMemberships = memberships.filter(m => m.status === "active");
  const expiringSoon = memberships.filter(m => {
    if (m.status !== "active") return false;
    const endDate = new Date(m.end_date);
    const oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() + 7);
    return endDate <= oneWeek;
  });

  return (
    <div className="space-y-8 page-transition">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Memberships
          </h1>
          <p className="text-secondary-500 mt-2 text-lg">
            Manage member subscriptions and renewals
          </p>
        </div>
        <Link href="/memberships/new">
          <Button variant="gradient">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Membership
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Memberships"
          value={activeMemberships.length.toString()}
          trend="+5%"
          icon="users"
          color="blue"
        />
        <StatCard
          title="Expiring This Week"
          value={expiringSoon.length.toString()}
          icon="alert"
          color="amber"
        />
        <StatCard
          title="Auto-Renewal"
          value={activeMemberships.filter(m => m.auto_renew).length.toString()}
          icon="refresh"
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`SAR ${activeMemberships.reduce((sum, m) => sum + m.price, 0).toLocaleString()}`}
          trend="+12%"
          icon="currency"
          color="primary"
        />
      </div>

      {/* Membership Tiers */}
      <Card className="card-modern">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Membership Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div key={tier.id} className="group relative p-6 rounded-2xl bg-gradient-to-br from-secondary-50 to-white border border-secondary-100 hover:border-primary/30 transition-all hover:shadow-soft hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-bold text-lg text-secondary-900 mb-1">{tier.name}</h3>
                <p className="text-3xl font-bold text-gradient mb-2">SAR {tier.price.toLocaleString()}</p>
                <p className="text-sm text-secondary-500 capitalize mb-4">{tier.type}</p>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tier.duration_days} days
                </div>
                <div className="mt-4 pt-4 border-t border-secondary-100">
                  <Link href={`/memberships/tiers/${tier.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Edit Tier
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Memberships */}
      <Card className="card-modern">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Recent Memberships
          </CardTitle>
          <Link href="/memberships/all">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-100">
                  <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Member</th>
                  <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Plan</th>
                  <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Period</th>
                  <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Price</th>
                  <th className="text-left py-4 px-4 font-semibold text-secondary-700 text-sm">Status</th>
                  <th className="text-right py-4 px-4 font-semibold text-secondary-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberships.slice(0, 10).map((membership) => (
                  <tr key={membership.id} className="border-b border-secondary-50 hover:bg-secondary-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold">
                          {membership.client?.first_name?.[0]}{membership.client?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">
                            {membership.client?.first_name} {membership.client?.last_name}
                          </p>
                          <p className="text-sm text-secondary-500">{membership.client?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-secondary-900">{membership.tier?.name}</p>
                      <p className="text-xs text-secondary-500 capitalize">{membership.tier?.type}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-secondary-700">{new Date(membership.start_date).toLocaleDateString()}</p>
                      <p className="text-xs text-secondary-400">to {new Date(membership.end_date).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-secondary-900">SAR {membership.price.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          membership.status === "active" 
                            ? "bg-green-100 text-green-700" 
                            : membership.status === "expired"
                            ? "bg-red-100 text-red-700"
                            : "bg-secondary-100 text-secondary-700"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            membership.status === "active" ? "bg-green-500" :
                            membership.status === "expired" ? "bg-red-500" :
                            "bg-secondary-500"
                          }`} />
                          {membership.status}
                        </span>
                        {membership.auto_renew && (
                          <span className="text-xs text-primary font-medium flex items-center">
                            <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Auto
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/memberships/${membership.id}`}>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  trend,
  icon,
  color = "blue"
}: { 
  title: string; 
  value: string;
  trend?: string;
  icon: string;
  color?: "blue" | "green" | "amber" | "primary" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    primary: "bg-primary/10 text-primary",
    purple: "bg-purple-50 text-purple-600",
  };

  const icons: Record<string, React.ReactNode> = {
    users: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    alert: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    refresh: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    currency: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <Card className="card-modern group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-secondary-900 group-hover:text-gradient transition-all">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
            {icons[icon]}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
