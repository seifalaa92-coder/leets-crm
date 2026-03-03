"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  interest_type: string;
  status: string;
  source: string;
  created_at: string;
  notes: string;
  utm_source?: string;
  device_type?: string;
  country?: string;
}

interface Analytics {
  summary: {
    totalLeads: number;
    newLeads: number;
    convertedLeads: number;
    conversionRate: number;
  };
  leadsByStatus: Record<string, number>;
  leadsBySource: Record<string, number>;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  trial_scheduled: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
  churned: "bg-gray-100 text-gray-800",
};

const interestLabels: Record<string, string> = {
  court_booking: "Court Booking",
  coaching: "Private Coaching",
  membership: "Membership",
  general: "General Inquiry",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch leads and analytics
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch leads
      const leadsResponse = await fetch("/api/leads");
      const leadsData = await leadsResponse.json();
      
      if (leadsResponse.ok) {
        setLeads(leadsData.leads || []);
      }

      // Fetch analytics
      const analyticsResponse = await fetch("/api/analytics?days=30");
      const analyticsData = await analyticsResponse.json();
      
      if (analyticsResponse.ok) {
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Update lead status
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Interest", "Status", "Source", "Date"];
    const rows = filteredLeads.map((lead) => [
      `${lead.first_name} ${lead.last_name}`,
      lead.email,
      lead.phone,
      interestLabels[lead.interest_type] || lead.interest_type,
      lead.status,
      lead.source,
      new Date(lead.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  const closeLeadDetail = () => {
    setIsDetailOpen(false);
    setSelectedLead(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA553B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Leads</h1>
          <p className="text-gray-500 mt-1">Track prospects and conversions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </Button>
          <Button onClick={() => window.location.reload()}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{analytics?.summary?.totalLeads || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{analytics?.summary?.newLeads || 0}</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{analytics?.summary?.convertedLeads || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Successful conversions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#EA553B]">{analytics?.summary?.conversionRate?.toFixed(1) || 0}%</p>
            <p className="text-xs text-gray-500 mt-1">Leads to visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(analytics?.leadsByStatus || {}).map(([status, count]) => (
          <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600 capitalize">{status.replace("_", " ")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:border-[#EA553B] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="trial_scheduled">Trial Scheduled</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          {statusFilter && (
            <Button variant="outline" onClick={() => setStatusFilter("")}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lead List ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Interest</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No leads found. Start capturing leads from your website!
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{lead.first_name} {lead.last_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {interestLabels[lead.interest_type] || lead.interest_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[lead.status] || "bg-gray-100 text-gray-800"}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="trial_scheduled">Trial Scheduled</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 capitalize">{lead.source || "Direct"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" onClick={() => openLeadDetail(lead)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeLeadDetail}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedLead.first_name} {selectedLead.last_name}
                    </h2>
                    <p className="text-gray-500">Lead Details</p>
                  </div>
                  <button
                    onClick={closeLeadDetail}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedLead.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{selectedLead.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Interest</label>
                      <p className="text-gray-900">{interestLabels[selectedLead.interest_type] || selectedLead.interest_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedLead.status]}`}>
                        {selectedLead.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Source</label>
                      <p className="text-gray-900 capitalize">{selectedLead.source || "Direct"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Device</label>
                      <p className="text-gray-900 capitalize">{selectedLead.device_type || "Unknown"}</p>
                    </div>
                  </div>

                  {selectedLead.country && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Location</label>
                      <p className="text-gray-900">{selectedLead.country}</p>
                    </div>
                  )}

                  {selectedLead.utm_source && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">UTM Source</label>
                      <p className="text-gray-900">{selectedLead.utm_source}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">Submitted</label>
                    <p className="text-gray-900">{new Date(selectedLead.created_at).toLocaleString()}</p>
                  </div>

                  {selectedLead.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Message</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{selectedLead.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => window.open(`mailto:${selectedLead.email}`, "_blank")}
                    >
                      Send Email
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`tel:${selectedLead.phone}`, "_blank")}
                    >
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
