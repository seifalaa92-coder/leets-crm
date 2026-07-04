/**
 * Admin Page
 * 
 * System administration and settings.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/middleware";

export default async function AdminPage() {
  await requireRole(["super_admin"]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">System settings and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Manage staff accounts and roles</p>
            <Button variant="outline" className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Venue Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Configure venue details and operating hours</p>
            <Button variant="outline" className="w-full">Edit Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Manage membership plans and pricing</p>
            <Button variant="outline" className="w-full">Edit Tiers</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loyalty Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Configure points earning rules and rewards</p>
            <Button variant="outline" className="w-full">Edit Program</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Manage padel courts and availability</p>
            <Button variant="outline" className="w-full">Manage Courts</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">View activity logs and audit trail</p>
            <Button variant="outline" className="w-full">View Logs</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Send announcements and notifications to members.</p>
          <div className="mt-4 flex gap-4">
            <Button variant="outline">Send Email</Button>
            <Button variant="outline">Send Push</Button>
            <Button variant="outline">SMS Campaign</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
