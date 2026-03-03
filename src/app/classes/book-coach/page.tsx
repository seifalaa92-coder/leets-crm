"use client";

/**
 * Book Coaching Class Page - NO EMOJIS VERSION
 * Uses SVG icons and styled elements instead
 */

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LeetsIcon } from "@/components/ui/LeetsLogo";

// SVG Icon Components
const UserIcon = () => (
  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-500 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-8 h-8 text-[#EA553B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BankIcon = () => (
  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CashIcon = () => (
  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

// Coach Avatar Component
function CoachAvatar({ name, color = "#EA553B" }: { name: string; color?: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div 
      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-display"
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}

// Coach data
const coaches = [
  {
    id: "seif",
    name: "Seif",
    fullName: "Coach Seif",
    specialty: "Padel Fundamentals & Strategy",
    experience: "8+ years",
    certifications: ["ITF Certified", "Padel Pro"],
    rate: 500,
    currency: "SAR",
    avatarColor: "#EA553B",
    bio: "Professional padel coach specializing in technique improvement and match strategy. Former national team player with extensive tournament experience.",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    rating: 4.9,
    reviews: 127,
    languages: ["English", "Arabic"],
  },
  {
    id: "ahmed",
    name: "Ahmed",
    fullName: "Coach Ahmed",
    specialty: "Advanced Techniques",
    experience: "5+ years",
    certifications: ["Padel Coach Level 2"],
    rate: 400,
    currency: "SAR",
    avatarColor: "#3B82F6",
    bio: "Specialized in advanced padel techniques and competitive play preparation. Focus on improving power shots and defensive positioning.",
    availability: ["Sun", "Mon", "Wed", "Fri"],
    rating: 4.7,
    reviews: 89,
    languages: ["Arabic", "English"],
  },
  {
    id: "maria",
    name: "Maria",
    fullName: "Coach Maria",
    specialty: "Beginner to Intermediate",
    experience: "6+ years",
    certifications: ["Professional Padel Coach"],
    rate: 450,
    currency: "SAR",
    avatarColor: "#8B5CF6",
    bio: "Patient and encouraging coach perfect for beginners and intermediate players. Specializes in building strong fundamentals and confidence.",
    availability: ["Tue", "Thu", "Sat", "Sun"],
    rating: 4.8,
    reviews: 156,
    languages: ["English", "Spanish"],
  },
];

// Time slots
const timeSlots = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM",
  "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
];

// Duration options
const durations = [
  { value: 60, label: "1 Hour", multiplier: 1 },
  { value: 90, label: "1.5 Hours", multiplier: 1.4 },
  { value: 120, label: "2 Hours", multiplier: 1.8 },
];

export default function BookCoachingPage() {
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [step, setStep] = useState<number>(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const coach = coaches.find(c => c.id === selectedCoach);
  const durationOption = durations.find(d => d.value === selectedDuration);
  
  const calculateTotal = () => {
    if (!coach || !durationOption) return 0;
    return Math.round(coach.rate * durationOption.multiplier);
  };

  const handleCoachSelect = (coachId: string) => {
    setSelectedCoach(coachId);
    setStep(2);
  };

  const handleBooking = () => {
    setShowConfirmation(true);
  };

  const resetBooking = () => {
    setSelectedCoach(null);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedDuration(60);
    setStep(1);
    setShowConfirmation(false);
  };

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pb-20">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="font-display text-xl text-black">Booking Confirmed!</h1>
          </div>
        </header>

        <div className="p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon />
            </div>
            
            <h2 className="font-display text-2xl text-black mb-2">Booking Successful!</h2>
            <p className="font-body text-gray-600 mb-6">
              Your coaching session has been booked. Check your email for confirmation.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <CoachAvatar name={coach?.name || ""} color={coach?.avatarColor} />
                <div>
                  <p className="font-display text-lg text-black">{coach?.fullName}</p>
                  <p className="font-body text-sm text-gray-500">{coach?.specialty}</p>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-gray-500">Date</span>
                  <span className="font-body text-sm text-black">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-gray-500">Time</span>
                  <span className="font-body text-sm text-black">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-gray-500">Duration</span>
                  <span className="font-body text-sm text-black">{durationOption?.label}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-display text-base text-black">Total</span>
                  <span className="font-display text-lg text-[#EA553B]">{calculateTotal()} SAR</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/bookings"
                className="block w-full bg-[#EA553B] text-white py-3 rounded-xl font-display text-center"
              >
                View My Bookings
              </Link>
              <button
                onClick={resetBooking}
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-body"
              >
                Book Another Session
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      {/* Top Navigation Bar with Logo */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Links to Dashboard */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <LeetsIcon className="w-10 h-10" />
            <div className="hidden sm:block">
              <span className="font-display text-xl text-black tracking-tight">LEETS</span>
              <span className="block font-body text-[10px] text-[#EA553B] uppercase tracking-wider">Sports CRM</span>
            </div>
          </Link>

          {/* Back Button */}
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-body text-sm text-gray-700 hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <h1 className="font-display text-2xl text-black">Book Coaching</h1>
        </div>
      </header>

      <div className="p-4">
        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-sm ${
                step >= s ? "bg-[#EA553B] text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-8 h-0.5 ${step > s ? "bg-[#EA553B]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Coach */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display text-lg text-black mb-4">Select Your Coach</h2>
            <div className="space-y-4">
              {coaches.map((coach) => (
                <button
                  key={coach.id}
                  onClick={() => handleCoachSelect(coach.id)}
                  className="w-full bg-white rounded-2xl p-4 border border-gray-200 text-left transition-all active:scale-[0.98] hover:border-[#EA553B] hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <CoachAvatar name={coach.name} color={coach.avatarColor} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg text-black">{coach.fullName}</h3>
                          <p className="font-body text-sm text-[#EA553B]">{coach.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl text-[#EA553B]">{coach.rate} SAR</p>
                          <p className="font-body text-xs text-gray-500">per hour</p>
                        </div>
                      </div>
                      <p className="font-body text-sm text-gray-600 mt-2 line-clamp-2">{coach.bio}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="font-body text-gray-500 flex items-center">
                          <StarIcon /> {coach.rating}
                        </span>
                        <span className="font-body text-gray-500">({coach.reviews} reviews)</span>
                        <span className="font-body text-gray-500">{coach.experience}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {coach.certifications.map((cert) => (
                          <span key={cert} className="px-2 py-1 bg-gray-100 rounded text-xs font-body text-gray-600">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && coach && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Selected Coach Summary */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
              <div className="flex items-center gap-3">
                <CoachAvatar name={coach.name} color={coach.avatarColor} />
                <div className="flex-1">
                  <h3 className="font-display text-lg text-black">{coach.fullName}</h3>
                  <p className="font-body text-sm text-[#EA553B]">{coach.rate} SAR/hour</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <h2 className="font-display text-lg text-black mb-3">Select Date</h2>
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
              {dates.map((date) => (
                <button
                  key={date.date}
                  onClick={() => setSelectedDate(date.date)}
                  className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                    selectedDate === date.date
                      ? "border-[#EA553B] bg-[#EA553B]/10"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="font-body text-xs text-gray-500 uppercase">{date.day}</span>
                  <span className={`font-display text-xl ${selectedDate === date.date ? "text-[#EA553B]" : "text-black"}`}>
                    {date.dayNum}
                  </span>
                  <span className="font-body text-xs text-gray-500">{date.month}</span>
                </button>
              ))}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <>
                <h2 className="font-display text-lg text-black mb-3">Select Time</h2>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 rounded-xl font-body text-sm border-2 transition-all ${
                        selectedTime === time
                          ? "border-[#EA553B] bg-[#EA553B] text-white"
                          : "border-gray-200 bg-white text-black"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Duration Selection */}
            {selectedTime && (
              <>
                <h2 className="font-display text-lg text-black mb-3">Duration</h2>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {durations.map((duration) => (
                    <button
                      key={duration.value}
                      onClick={() => setSelectedDuration(duration.value)}
                      className={`py-3 px-2 rounded-xl border-2 transition-all ${
                        selectedDuration === duration.value
                          ? "border-[#EA553B] bg-[#EA553B]/10"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <p className={`font-display text-sm ${selectedDuration === duration.value ? "text-[#EA553B]" : "text-black"}`}>
                        {duration.label}
                      </p>
                      <p className="font-body text-xs text-gray-500">
                        {Math.round(coach.rate * duration.multiplier)} SAR
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Continue Button */}
            {selectedDate && selectedTime && (
              <button
                onClick={() => setStep(3)}
                className="w-full bg-[#EA553B] text-white py-4 rounded-xl font-display text-lg mt-4"
              >
                Continue
              </button>
            )}
          </motion.div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && coach && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display text-lg text-black mb-4">Review Booking</h2>
            
            <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-6">
              {/* Coach Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <CoachAvatar name={coach.name} color={coach.avatarColor} />
                <div>
                  <h3 className="font-display text-xl text-black">{coach.fullName}</h3>
                  <p className="font-body text-sm text-gray-500">{coach.specialty}</p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-600">Date</span>
                  <span className="font-display text-black">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-600">Time</span>
                  <span className="font-display text-black">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-600">Duration</span>
                  <span className="font-display text-black">{durationOption?.label}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-600">Rate</span>
                  <span className="font-display text-black">{coach.rate} SAR/hour</span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-display text-lg text-black">Total Amount</span>
                    <span className="font-display text-2xl text-[#EA553B]">{calculateTotal()} SAR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-body text-sm text-gray-600 mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-[#EA553B] cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-[#EA553B]" />
                  <CreditCardIcon />
                  <div className="flex-1">
                    <p className="font-body text-sm text-black">Credit Card</p>
                    <p className="font-body text-xs text-gray-500">Visa, Mastercard, Mada</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-gray-200 cursor-pointer">
                  <input type="radio" name="payment" className="w-5 h-5" />
                  <BankIcon />
                  <div className="flex-1">
                    <p className="font-body text-sm text-black">Bank Transfer</p>
                    <p className="font-body text-xs text-gray-500">Local bank transfer</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-gray-200 cursor-pointer">
                  <input type="radio" name="payment" className="w-5 h-5" />
                  <CashIcon />
                  <div className="flex-1">
                    <p className="font-body text-sm text-black">Cash at Venue</p>
                    <p className="font-body text-xs text-gray-500">Pay when you arrive</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <h3 className="font-body text-sm text-gray-600 mb-2">Special Requests (Optional)</h3>
              <textarea
                placeholder="Any specific areas you want to focus on?"
                className="w-full p-4 rounded-xl border border-gray-200 font-body text-sm resize-none h-24 focus:border-[#EA553B] focus:outline-none"
              />
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleBooking}
              className="w-full bg-[#EA553B] text-white py-4 rounded-xl font-display text-lg mb-3"
            >
              Confirm Booking ({calculateTotal()} SAR)
            </button>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-body"
            >
              Back
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
