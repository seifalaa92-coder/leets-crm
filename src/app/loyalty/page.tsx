/**
 * Loyalty Page
 * 
 * Loyalty program and rewards management.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoyaltyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loyalty Program</h1>
          <p className="text-gray-500 mt-1">Manage points and rewards</p>
        </div>
        <Button variant="outline">Program Settings</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Your Points Balance</p>
            <p className="text-4xl font-bold text-primary mt-2">0</p>
            <p className="text-sm text-gray-400 mt-1">points available</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Total Earned</p>
            <p className="text-4xl font-bold text-green-600 mt-2">0</p>
            <p className="text-sm text-gray-400 mt-1">lifetime points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Redeemed</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
            <p className="text-sm text-gray-400 mt-1">points spent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rewards Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Available rewards and redemption options.</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Features:</p>
            <ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1">
              <li>Earn points on purchases (1 point per 1 AED)</li>
              <li>Referral bonuses (100 points per referral)</li>
              <li>Attendance streak bonuses</li>
              <li>Redeem for free classes, discounts, merchandise</li>
              <li>Leaderboard showing top members</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
