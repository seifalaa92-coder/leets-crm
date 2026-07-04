/**
 * Payments Page
 * 
 * Manual payment tracking and POS interface.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">Record and track all payments</p>
        </div>
        <Link href="/payments/new">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Record Payment
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Payment tracking interface will be implemented here.</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Features:</p>
            <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
              <li>Manual payment entry (Cash, Card, Bank Transfer)</li>
              <li>Payment receipt generation</li>
              <li>Daily cash drawer summary</li>
              <li>Outstanding balances tracking</li>
              <li>Refund processing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
