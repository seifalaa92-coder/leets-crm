"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Booking {
  id: string;
  court_name: string;
  booking_date: string;
  booking_times: string[];
  total_hours: number;
  total_price: number;
  status: string;
  created_at: string;
}

export default function BookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("booking_date", { ascending: false });

      if (data) setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const isUpcoming = (date: string) => {
    return new Date(date) >= new Date();
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "upcoming") return isUpcoming(booking.booking_date);
    if (filter === "past") return !isUpcoming(booking.booking_date);
    return true;
  });

  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (!error) {
      loadBookings();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/leets-logo.png" alt="Leets" className="w-8 h-8" />
            <span className="font-bold text-xl">LEETS</span>
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "upcoming", "past"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f 
                  ? "bg-orange-500 text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-500 mb-6">Book your first court now!</p>
            <Link href="/classes/book-court" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold">
              Book a Court
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{booking.court_name}</h3>
                    <p className="text-gray-500">{new Date(booking.booking_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === "confirmed" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium">{booking.booking_times?.join(", ") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium">{booking.total_hours} hour(s)</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-bold text-orange-600">{booking.total_price} SAR</p>
                  </div>
                </div>

                {isUpcoming(booking.booking_date) && booking.status === "confirmed" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
