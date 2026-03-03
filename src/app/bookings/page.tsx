"use client";

/**
 * My Bookings Page
 * Shows all court bookings and coaching sessions
 */

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LeetsIcon } from "@/components/ui/LeetsLogo";

type BookingType = "court" | "coaching";

interface Booking {
  id: string;
  type: BookingType;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: "upcoming" | "completed" | "cancelled";
  coachName?: string;
  courtName?: string;
}

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: "1",
    type: "court",
    title: "Court A",
    subtitle: "Indoor Padel Court",
    date: "Today",
    time: "6:00 PM",
    duration: "1 hour",
    price: 150,
    status: "upcoming",
    courtName: "Court A",
  },
  {
    id: "2",
    type: "coaching",
    title: "Coach Seif",
    subtitle: "Padel Fundamentals",
    date: "Tomorrow",
    time: "7:00 PM",
    duration: "1 hour",
    price: 500,
    status: "upcoming",
    coachName: "Coach Seif",
  },
  {
    id: "3",
    type: "court",
    title: "Court B",
    subtitle: "Outdoor Padel Court",
    date: "Feb 20, 2026",
    time: "5:00 PM",
    duration: "1.5 hours",
    price: 225,
    status: "upcoming",
    courtName: "Court B",
  },
  {
    id: "4",
    type: "coaching",
    title: "Coach Ahmed",
    subtitle: "Advanced Techniques",
    date: "Feb 22, 2026",
    time: "6:00 PM",
    duration: "1 hour",
    price: 400,
    status: "upcoming",
    coachName: "Coach Ahmed",
  },
  {
    id: "5",
    type: "court",
    title: "Court A",
    subtitle: "Indoor Padel Court",
    date: "Feb 15, 2026",
    time: "4:00 PM",
    duration: "1 hour",
    price: 150,
    status: "completed",
    courtName: "Court A",
  },
  {
    id: "6",
    type: "coaching",
    title: "Coach Maria",
    subtitle: "Beginner Training",
    date: "Feb 10, 2026",
    time: "3:00 PM",
    duration: "1 hour",
    price: 450,
    status: "completed",
    coachName: "Coach Maria",
  },
];

// Icons
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
  </svg>
);

const CourtIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
  </svg>
);

const CoachIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "completed">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = mockBookings.filter((booking) => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  const upcomingCount = mockBookings.filter((b) => b.status === "upcoming").length;
  const completedCount = mockBookings.filter((b) => b.status === "completed").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-600";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      {/* Top Navigation Bar with Logo */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <LeetsIcon className="w-10 h-10" />
            <div className="hidden sm:block">
              <span className="font-display text-xl text-black tracking-tight">LEETS</span>
              <span className="block font-body text-[10px] text-[#EA553B] uppercase tracking-wider">Sports CRM</span>
            </div>
          </Link>

          {/* Dashboard Button */}
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-body text-sm text-gray-700 hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl text-black mb-2">My Bookings</h1>
          <p className="font-body text-gray-600">Manage your court bookings and coaching sessions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeTab === "all" ? "border-[#EA553B] bg-[#EA553B]/5" : "border-gray-200 bg-white"
            }`}
          >
            <p className={`font-display text-2xl ${activeTab === "all" ? "text-[#EA553B]" : "text-black"}`}>
              {mockBookings.length}
            </p>
            <p className="font-body text-sm text-gray-500">All Bookings</p>
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeTab === "upcoming" ? "border-[#EA553B] bg-[#EA553B]/5" : "border-gray-200 bg-white"
            }`}
          >
            <p className={`font-display text-2xl ${activeTab === "upcoming" ? "text-[#EA553B]" : "text-black"}`}>
              {upcomingCount}
            </p>
            <p className="font-body text-sm text-gray-500">Upcoming</p>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              activeTab === "completed" ? "border-[#EA553B] bg-[#EA553B]/5" : "border-gray-200 bg-white"
            }`}
          >
            <p className={`font-display text-2xl ${activeTab === "completed" ? "text-[#EA553B]" : "text-black"}`}>
              {completedCount}
            </p>
            <p className="font-body text-sm text-gray-500">Completed</p>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Link
            href="/classes/book-court"
            className="flex-1 bg-[#EA553B] hover:bg-[#D14028] text-white py-3 px-4 rounded-xl font-display text-sm text-center transition-colors flex items-center justify-center gap-2"
          >
            <CourtIcon />
            Book Court
          </Link>
          <Link
            href="/classes/book-coach"
            className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3 px-4 rounded-xl font-display text-sm text-center transition-colors flex items-center justify-center gap-2"
          >
            <CoachIcon />
            Book Coach
          </Link>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredBookings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon />
                </div>
                <h3 className="font-display text-xl text-black mb-2">No bookings found</h3>
                <p className="font-body text-gray-500 mb-6">Start by booking a court or coaching session</p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/classes/book-court"
                    className="bg-[#EA553B] text-white px-6 py-3 rounded-xl font-display"
                  >
                    Book Court
                  </Link>
                  <Link
                    href="/classes/book-coach"
                    className="bg-[#8B5CF6] text-white px-6 py-3 rounded-xl font-display"
                  >
                    Book Coach
                  </Link>
                </div>
              </motion.div>
            ) : (
              filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        booking.type === "court" ? "bg-[#EA553B]/10 text-[#EA553B]" : "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                      }`}
                    >
                      {booking.type === "court" ? <CourtIcon /> : <CoachIcon />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-lg text-black">{booking.title}</h3>
                          <p className="font-body text-sm text-gray-500">{booking.subtitle}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <CalendarIcon />
                          <span className="font-body">{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <ClockIcon />
                          <span className="font-body">{booking.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="font-body text-sm text-gray-500">{booking.duration}</span>
                        <span className="font-display text-lg text-[#EA553B]">{booking.price} SAR</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === "upcoming" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-body text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <XIcon />
                        Cancel
                      </button>
                      <button className="flex-1 bg-[#EA553B] hover:bg-[#D14028] text-white py-2 rounded-lg font-body text-sm transition-colors flex items-center justify-center gap-2">
                        <CheckIcon />
                        Check In
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl text-black mb-2">Cancel Booking?</h3>
              <p className="font-body text-gray-600 mb-6">
                Are you sure you want to cancel your {selectedBooking.type === "court" ? "court booking" : "coaching session"} with {selectedBooking.title}?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-body"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-body"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
