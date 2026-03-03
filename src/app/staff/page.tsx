/**
 * Staff Page
 * 
 * Employee management and attendance tracking.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage employees and track attendance</p>
        </div>
        <Button>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button className="flex-1" variant="outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Clock In
              </Button>
              <Button className="flex-1" variant="outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Clock Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-amber-600 font-medium">Not Clocked In</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Clock In</span>
                <span className="text-gray-900">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hours Today</span>
                <span className="text-gray-900">0h 0m</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Staff list and management interface.</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Features:</p>
            <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
              <li>Clock in/out tracking</li>
              <li>Attendance history</li>
              <li>Late arrival and absence reports</li>
              <li>Monthly summary reports</li>
              <li>QR code clock-in option</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
