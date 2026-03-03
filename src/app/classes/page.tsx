/**
 * Classes Page
 * 
 * Class scheduling and booking management.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes & Schedule</h1>
          <p className="text-gray-500 mt-1">Manage padel classes and bookings</p>
        </div>
        <Link href="/classes/new">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Class
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Calendar view of all scheduled classes.</p>
            <div className="mt-4 p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
              <p className="text-gray-400">Calendar component will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Today's Classes</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Bookings</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Courts</span>
              <span className="font-semibold">4</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">List of upcoming classes with booking status.</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Features:</p>
            <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
              <li>Class types: Group, Private, Open Play, Tournament</li>
              <li>Court assignment and scheduling</li>
              <li>Coach assignment</li>
              <li>Member booking and waitlist</li>
              <li>Recurring class support</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
