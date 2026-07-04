/**
 * Reports Page
 * 
 * Analytics and reporting dashboard.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View detailed reports and insights</p>
        </div>
        <Button variant="outline">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-400">Revenue chart will be displayed here</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-xl font-bold text-gray-900">AED 0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">This Year</p>
                <p className="text-xl font-bold text-gray-900">AED 0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-400">Membership chart will be displayed here</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">New Sign-ups</p>
                <p className="text-xl font-bold text-gray-900">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Churn Rate</p>
                <p className="text-xl font-bold text-gray-900">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Revenue by Category", desc: "Breakdown by membership, classes, day passes" },
              { name: "Attendance Report", desc: "Daily check-ins and member visits" },
              { name: "Sales Pipeline", desc: "Lead conversion and funnel metrics" },
              { name: "Class Utilization", desc: "Booking rates and court usage" },
              { name: "Staff Attendance", desc: "Employee hours and punctuality" },
              { name: "Loyalty Program", desc: "Points issued and rewards redeemed" },
            ].map((report) => (
              <div key={report.name} className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
