import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

async function getKidsRegistrations() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("interest_type", "kids_registration")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching kids registrations:", error);
    return [];
  }

  return data;
}

export default async function KidsRegistrationsPage() {
  const registrations = await getKidsRegistrations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kids Registrations</h1>
          <p className="text-gray-500 mt-1">
            {registrations.length} registration{registrations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Parent</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Phone</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Child Details</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      No kids registrations yet
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg: any) => (
                    <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">{reg.first_name} {reg.last_name}</div>
                      </td>
                      <td className="py-3 px-2 text-gray-600">{reg.email}</td>
                      <td className="py-3 px-2 text-gray-600">{reg.phone}</td>
                      <td className="py-3 px-2 text-gray-600 max-w-xs truncate">{reg.notes}</td>
                      <td className="py-3 px-2 text-gray-500 whitespace-nowrap">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
