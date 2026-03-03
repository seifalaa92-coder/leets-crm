"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeetsIcon } from "@/components/ui/LeetsLogo";

// ============================================================================
// SVG Icons Components
// ============================================================================

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const CourtIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="8" width="40" height="32" rx="2" />
    <line x1="24" y1="8" x2="24" y2="40" />
    <line x1="4" y1="24" x2="44" y2="24" />
    <circle cx="24" cy="24" r="4" />
    <path d="M 8 12 Q 8 8 12 8" />
    <path d="M 40 12 Q 40 8 36 8" />
    <path d="M 8 36 Q 8 40 12 40" />
    <path d="M 40 36 Q 40 40 36 40" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PriceTagIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Court {
  id: string;
  name: string;
  number: number;
  type: "indoor" | "outdoor";
  features: string[];
  hourlyRate: number;
  isAvailable: boolean;
}

interface TimeSlot {
  id: string;
  time: string;
  hour: number;
  minute: number;
  isAvailable: boolean;
  isPeakHour: boolean;
  priceMultiplier: number;
}

interface BookingSummary {
  court: Court | null;
  date: Date | null;
  startTime: TimeSlot | null;
  duration: number;
  totalPrice: number;
}

// ============================================================================
// Constants
// ============================================================================

const COURTS: Court[] = [
  {
    id: "court-1",
    name: "Clay Court Alpha",
    number: 1,
    type: "indoor",
    features: ["Climate Controlled", "Premium Surface"],
    hourlyRate: 180,
    isAvailable: true,
  },
  {
    id: "court-2",
    name: "Clay Court Beta",
    number: 2,
    type: "indoor",
    features: ["Climate Controlled", "Premium Surface"],
    hourlyRate: 180,
    isAvailable: true,
  },
  {
    id: "court-3",
    name: "Ahmed Alaa's Zalata Court",
    number: 3,
    type: "outdoor",
    features: ["Open Air", "Professional Grade"],
    hourlyRate: 150,
    isAvailable: true,
  },
  {
    id: "court-4",
    name: "Sunset Court",
    number: 4,
    type: "outdoor",
    features: ["Open Air", "Evening Lights"],
    hourlyRate: 150,
    isAvailable: false,
  },
];

const DURATION_OPTIONS = [
  { value: 60, label: "60 min", priceMultiplier: 1 },
  { value: 90, label: "90 min", priceMultiplier: 1.4 },
  { value: 120, label: "120 min", priceMultiplier: 1.8 },
];

const PEAK_HOURS = [17, 18, 19, 20, 21]; // 5 PM to 9 PM

// ============================================================================
// Utility Functions
// ============================================================================

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 10;
  const endHour = 23;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === endHour && minute === 30) break;

      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const isPeak = PEAK_HOURS.includes(hour);
      const isAvailable = Math.random() > 0.3; // Simulate availability

      slots.push({
        id: `slot-${hour}-${minute}`,
        time: timeString,
        hour,
        minute,
        isAvailable,
        isPeakHour: isPeak,
        priceMultiplier: isPeak ? 1.3 : 1,
      });
    }
  }

  return slots;
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// ============================================================================
// Components
// ============================================================================

export default function BookCourtPage() {
  // State
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);

  // Calculate total price
  const calculateTotalPrice = (): number => {
    if (!selectedCourt || !selectedTimeSlot) return 0;

    const basePrice = selectedCourt.hourlyRate;
    const timeMultiplier = selectedTimeSlot.priceMultiplier;
    const durationMultiplier = DURATION_OPTIONS.find((d) => d.value === selectedDuration)?.priceMultiplier || 1;

    return Math.round(basePrice * timeMultiplier * durationMultiplier);
  };

  const totalPrice = calculateTotalPrice();

  // Calendar navigation
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Calendar render
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: React.ReactNode[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = isSameDay(date, selectedDate);
      const isTodayDate = isToday(date);
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <button
          key={day}
          onClick={() => {
            if (!isPast) {
              setSelectedDate(date);
              setIsCalendarOpen(false);
            }
          }}
          disabled={isPast}
          className={`
            h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium
            transition-all duration-200 ease-out
            ${isPast
              ? "text-gray-300 cursor-not-allowed"
              : isSelected
              ? "bg-[#E8461A] text-white shadow-[0_4px_20px_rgba(232,70,26,0.35)]"
              : isTodayDate
              ? "bg-[#E8461A]/10 text-[#E8461A] border-2 border-[#E8461A]"
              : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Progress to next step
  const canProceedToStep2 = selectedCourt !== null;
  const canProceedToStep3 = selectedCourt && selectedDate && selectedTimeSlot;

  return (
    <div className="min-h-screen bg-[#F5F4F0] p-4 sm:p-6 lg:p-8">
      {/* Top Navigation Bar with Logo */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-[#E0D9CF]">
          {/* Logo - Links to Dashboard */}
          <a 
            href="/dashboard" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <LeetsIcon className="w-10 h-10" />
            <div className="hidden sm:block">
              <span className="font-display text-xl text-black tracking-tight">LEETS</span>
              <span className="block font-body text-[10px] text-[#EA553B] uppercase tracking-wider">Sports CRM</span>
            </div>
          </a>

          {/* Back to Dashboard Button */}
          <a 
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-body text-sm text-gray-700 hidden sm:inline">Dashboard</span>
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#C85A2A] rounded-xl shadow-lg">
                <CourtIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl sm:text-4xl text-[#111111]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    lineHeight: 0.95,
                  }}
                >
                  Book a Padel Court
                </h1>
                <p className="text-gray-500 mt-1 text-sm">Select your preferred court, date, and time</p>
              </div>
            </div>
          </div>

          {/* Booking Progress */}
          <div className="flex items-center gap-2 bg-white rounded-full p-1.5 shadow-sm border border-[#E0D9CF]">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                  ${bookingStep === step
                    ? "bg-[#E8461A] text-white shadow-[0_4px_20px_rgba(232,70,26,0.35)]"
                    : bookingStep > step
                    ? "bg-[#2ECC71]/15 text-[#1a9e55]"
                    : "text-gray-400"
                  }
                `}
              >
                <div
                  className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-xs
                  ${bookingStep === step
                      ? "bg-white/20"
                      : bookingStep > step
                      ? "bg-[#2ECC71] text-white"
                      : "bg-gray-200"
                    }
                `}
                >
                  {bookingStep > step ? <CheckIcon className="w-3 h-3" /> : step}
                </div>
                <span className="hidden sm:inline">
                  {step === 1 ? "Court" : step === 2 ? "Time" : "Confirm"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Court Selection & Time Slots */}
        <div className="lg:col-span-2 space-y-6">
          {/* Court Selection */}
          <Card
            className={`
              border border-[#E0D9CF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden
              ${bookingStep === 1 ? "ring-2 ring-[#E8461A]" : ""}
            `}
          >
            <CardHeader className="border-b border-[#E0D9CF] bg-gradient-to-r from-white to-[#F5F4F0]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#C85A2A]/10 rounded-lg">
                    <CourtIcon className="w-5 h-5 text-[#C85A2A]" />
                  </div>
                  <CardTitle
                    className="text-xl text-[#111111]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Select Court
                  </CardTitle>
                </div>
                <span className="text-xs font-semibold text-[#E8461A] uppercase tracking-wider">
                  Step 1 of 3
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COURTS.map((court, index) => (
                  <button
                    key={court.id}
                    onClick={() => {
                      if (court.isAvailable) {
                        setSelectedCourt(court);
                      }
                    }}
                    disabled={!court.isAvailable}
                    className={`
                      relative group text-left rounded-xl p-5 transition-all duration-300 ease-out
                      ${selectedCourt?.id === court.id
                        ? "bg-[#C85A2A] text-white shadow-[0_8px_40px_rgba(200,90,42,0.35)] scale-[1.02]"
                        : court.isAvailable
                        ? "bg-white border-2 border-[#E0D9CF] hover:border-[#C85A2A] hover:shadow-[0_4px_20px_rgba(200,90,42,0.15)]"
                        : "bg-gray-100 border-2 border-gray-200 cursor-not-allowed opacity-60"
                      }
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Availability Badge */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`
                          w-3 h-3 rounded-full
                          ${court.isAvailable
                            ? selectedCourt?.id === court.id
                              ? "bg-white"
                              : "bg-[#2ECC71] shadow-[0_0_8px_rgba(46,204,113,0.6)]"
                            : "bg-[#E74C3C]"
                          }
                        `}
                      />
                    </div>

                    {/* Court Visual */}
                    <div className="mb-4">
                      <div
                        className={`
                          w-full aspect-[4/3] rounded-lg flex items-center justify-center
                          ${selectedCourt?.id === court.id
                            ? "bg-white/10"
                            : court.isAvailable
                            ? "bg-[#F0EBE3]"
                            : "bg-gray-200"
                          }
                        `}
                      >
                        <CourtIcon
                          className={`w-16 h-16 ${
                            selectedCourt?.id === court.id
                              ? "text-white/80"
                              : court.isAvailable
                              ? "text-[#C85A2A]"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Court Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`
                            px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider
                            ${selectedCourt?.id === court.id
                              ? "bg-white/20 text-white"
                              : court.type === "indoor"
                              ? "bg-[#E8461A]/10 text-[#E8461A]"
                              : "bg-[#3ABFBF]/10 text-[#3ABFBF]"
                            }
                          `}
                        >
                          {court.type}
                        </span>
                        <span className="text-xs font-medium opacity-60">
                          Court #{court.number}
                        </span>
                      </div>
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {court.name}
                      </h3>
                      <p
                        className={`text-sm mb-3 ${
                          selectedCourt?.id === court.id ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        {court.features.join(" • ")}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <PriceTagIcon
                            className={`w-4 h-4 ${
                              selectedCourt?.id === court.id ? "text-white/80" : "text-[#C85A2A]"
                            }`}
                          />
                          <span
                            className={`font-bold ${
                              selectedCourt?.id === court.id ? "text-white" : "text-[#111111]"
                            }`}
                          >
                            {court.hourlyRate} SAR
                          </span>
                          <span
                            className={`text-xs ${
                              selectedCourt?.id === court.id ? "text-white/60" : "text-gray-400"
                            }`}
                          >
                            /hr
                          </span>
                        </div>
                        {!court.isAvailable && (
                          <span className="text-xs font-semibold text-[#E74C3C] uppercase">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {selectedCourt?.id === court.id && (
                      <div className="absolute bottom-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-[#C85A2A]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date & Time Selection */}
          <Card
            className={`
              border border-[#E0D9CF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden
              ${bookingStep === 2 ? "ring-2 ring-[#E8461A]" : ""}
              ${!selectedCourt ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <CardHeader className="border-b border-[#E0D9CF] bg-gradient-to-r from-white to-[#F5F4F0]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#E8461A]/10 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-[#E8461A]" />
                  </div>
                  <CardTitle
                    className="text-xl text-[#111111]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Select Date & Time
                  </CardTitle>
                </div>
                <span className="text-xs font-semibold text-[#E8461A] uppercase tracking-wider">
                  Step 2 of 3
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Date Picker */}
              <div className="mb-6">
                <label
                  className="block text-xs font-semibold text-[#2D2D2D] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Date
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-[#E0D9CF] rounded-xl hover:border-[#E8461A] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-[#E8461A]" />
                      <span className="font-medium text-[#111111]">{formatDate(selectedDate)}</span>
                    </div>
                    <ChevronRightIcon
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isCalendarOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Calendar Dropdown */}
                  {isCalendarOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#E0D9CF] z-20 p-4 animate-fade-in">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => navigateMonth("prev")}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <span
                          className="font-bold text-[#111111]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {currentMonth.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <button
                          onClick={() => navigateMonth("next")}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Weekday Headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div
                            key={day}
                            className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-2"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Duration Selector */}
              <div className="mb-6">
                <label
                  className="block text-xs font-semibold text-[#2D2D2D] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Duration
                </label>
                <div className="flex gap-3">
                  {DURATION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedDuration(option.value)}
                      className={`
                        flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200
                        ${selectedDuration === option.value
                          ? "bg-[#E8461A] text-white shadow-[0_4px_20px_rgba(232,70,26,0.35)]"
                          : "bg-white border-2 border-[#E0D9CF] text-[#111111] hover:border-[#E8461A]"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label
                    className="block text-xs font-semibold text-[#2D2D2D] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Available Time Slots
                  </label>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2ECC71]" />
                      <span className="text-gray-500">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F39C12]" />
                      <span className="text-gray-500">Peak Hour</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#E0D9CF]" />
                      <span className="text-gray-500">Booked</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={slot.id}
                      onClick={() => {
                        if (slot.isAvailable) {
                          setSelectedTimeSlot(slot);
                        }
                      }}
                      disabled={!slot.isAvailable}
                      className={`
                        py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200
                        ${selectedTimeSlot?.id === slot.id
                          ? "bg-[#E8461A] text-white shadow-[0_4px_20px_rgba(232,70,26,0.35)] scale-105"
                          : !slot.isAvailable
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : slot.isPeakHour
                          ? "bg-[#F39C12]/10 text-[#F39C12] border border-[#F39C12]/30 hover:bg-[#F39C12]/20"
                          : "bg-white border border-[#E0D9CF] text-[#111111] hover:border-[#E8461A] hover:shadow-sm"
                        }
                      `}
                      style={{
                        animationDelay: `${index * 25}ms`,
                      }}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Summary Card */}
            <Card className="border border-[#E0D9CF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden bg-gradient-to-b from-white to-[#F5F4F0]">
              <CardHeader className="border-b border-[#E0D9CF] bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#2ECC71]/10 rounded-lg">
                    <SparklesIcon className="w-5 h-5 text-[#2ECC71]" />
                  </div>
                  <CardTitle
                    className="text-xl text-[#111111]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Booking Summary
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Selected Court */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <CourtIcon className="w-4 h-4" />
                    <span>Court</span>
                  </div>
                  {selectedCourt ? (
                    <div className="p-4 bg-[#C85A2A]/5 rounded-xl border border-[#C85A2A]/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#C85A2A] rounded-lg flex items-center justify-center">
                          <CourtIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p
                            className="font-bold text-[#111111]"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {selectedCourt.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedCourt.type} • {selectedCourt.hourlyRate} SAR/hr
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                      <p className="text-sm text-gray-400">No court selected</p>
                    </div>
                  )}
                </div>

                {/* Selected Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Date & Time</span>
                  </div>
                  {selectedDate && selectedTimeSlot ? (
                    <div className="p-4 bg-[#E8461A]/5 rounded-xl border border-[#E8461A]/20">
                      <p className="font-semibold text-[#111111]">
                        {formatDate(selectedDate)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ClockIcon className="w-4 h-4 text-[#E8461A]" />
                        <span className="text-sm text-gray-600">
                          {selectedTimeSlot.time} -{" "}
                          {(() => {
                            const [hours, minutes] = selectedTimeSlot.time.split(":").map(Number);
                            const durationHours = Math.floor(selectedDuration / 60);
                            const durationMinutes = selectedDuration % 60;
                            const endHour = hours + durationHours + Math.floor((minutes + durationMinutes) / 60);
                            const endMinute = (minutes + durationMinutes) % 60;
                            return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
                          })()}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({selectedDuration} min)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                      <p className="text-sm text-gray-400">No time selected</p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-[#E0D9CF]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <PriceTagIcon className="w-4 h-4" />
                    <span>Price Breakdown</span>
                  </div>
                  {selectedCourt && selectedTimeSlot ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Base Rate ({selectedDuration} min)</span>
                        <span>{selectedCourt.hourlyRate} SAR/hr</span>
                      </div>
                      {selectedTimeSlot.isPeakHour && (
                        <div className="flex justify-between text-[#F39C12]">
                          <span>Peak Hour (+30%)</span>
                          <span>x 1.3</span>
                        </div>
                      )}
                      {selectedDuration > 60 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Duration Discount</span>
                          <span className="text-[#2ECC71]">
                            -{(1 - (DURATION_OPTIONS.find((d) => d.value === selectedDuration)?.priceMultiplier || 1) / (selectedDuration / 60)) * 100}%
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>VAT (15%)</span>
                        <span>Included</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                      <p className="text-sm text-gray-400">Price will be calculated</p>
                    </div>
                  )}
                </div>

                {/* Total Price */}
                <div className="pt-4 border-t-2 border-[#E0D9CF]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Total Amount
                      </p>
                      <p className="text-3xl font-bold text-[#111111]" style={{ fontFamily: "var(--font-display)" }}>
                        {totalPrice > 0 ? `${totalPrice} SAR` : "--"}
                      </p>
                    </div>
                    {totalPrice > 0 && (
                      <div className="w-12 h-12 bg-[#2ECC71]/10 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-6 h-6 text-[#2ECC71]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button
                    disabled={!canProceedToStep3}
                    className={`
                      w-full py-4 text-base font-bold uppercase tracking-wider transition-all duration-300
                      ${canProceedToStep3
                        ? "bg-[#E8461A] hover:bg-[#C93B14] text-white shadow-[0_4px_20px_rgba(232,70,26,0.35)] hover:shadow-[0_8px_40px_rgba(232,70,26,0.45)] hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }
                    `}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Confirm Booking
                    <ChevronRightIcon className="w-5 h-5 ml-2" />
                  </Button>

                  <button
                    onClick={() => {
                      setSelectedCourt(null);
                      setSelectedTimeSlot(null);
                      setSelectedDate(new Date());
                      setSelectedDuration(60);
                    }}
                    className="w-full py-3 text-sm font-semibold text-gray-500 uppercase tracking-wider hover:text-[#E8461A] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Reset Selection
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="border border-[#E0D9CF] shadow-sm overflow-hidden bg-white">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#3498DB]/10 rounded-lg shrink-0">
                    <InfoIcon className="w-5 h-5 text-[#3498DB]" />
                  </div>
                  <div>
                    <h4
                      className="font-bold text-[#111111] mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Booking Information
                    </h4>
                    <ul className="text-xs text-gray-500 space-y-1.5">
                      <li>• Cancellations must be made 24 hours in advance</li>
                      <li>• Please arrive 10 minutes before your session</li>
                      <li>• Rackets and balls available at reception</li>
                      <li>• Maximum 4 players per court</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Need help?{" "}
                <a href="#" className="text-[#E8461A] font-semibold hover:underline">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay (placeholder for future implementation) */}
      {bookingStep === 3 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="w-full max-w-md mx-4 border border-[#E0D9CF] shadow-[0_20px_60px_rgba(0,0,0,0.20)] animate-slide-up">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-[#2ECC71] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_40px_rgba(46,204,113,0.45)]">
                <CheckIcon className="w-10 h-10 text-white" />
              </div>
              <h2
                className="text-2xl font-bold text-[#111111] mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Booking Confirmed!
              </h2>
              <p className="text-gray-500 mb-6">
                Your court has been successfully booked. A confirmation email has been sent to you.
              </p>
              <div className="p-4 bg-[#F5F4F0] rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Court</span>
                  <span className="font-semibold text-[#111111]">{selectedCourt?.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="font-semibold text-[#111111]">
                    {selectedDate?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="font-semibold text-[#111111]">{selectedTimeSlot?.time}</span>
                </div>
              </div>
              <Button
                onClick={() => setBookingStep(1)}
                className="w-full py-4 bg-[#E8461A] hover:bg-[#C93B14] text-white font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(232,70,26,0.35)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Book Another Court
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
