/**
 * Classes Page
 *
 * Class scheduling and booking management.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Classes & Schedule</h1>
        <p className="text-gray-500 mt-1">Manage padel classes and bookings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Calendar view of all scheduled classes for the week.
            </p>
            <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
              <p className="text-sm font-medium text-gray-600">No classes scheduled yet</p>
              <p className="mt-1 text-sm text-gray-400">
                Your weekly class schedule will appear here once classes are created.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Today&apos;s Classes</span>
              <span className="font-semibold">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Bookings</span>
              <span className="font-semibold">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Courts</span>
              <span className="font-semibold">—</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}