"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SiteHeader } from "@/components/leets/Shell";

interface Court {
  id: string;
  name: string;
  number: number;
  type: "indoor" | "outdoor";
  features: string[];
  hourlyRate: number;
  isAvailable: boolean;
}

const COURTS: Court[] = [
  { id: "court-1", name: "Club de Padel Alpha", number: 1, type: "indoor", features: ["Climate Controlled", "Premium Surface"], hourlyRate: 180, isAvailable: true },
  { id: "court-2", name: "Club de Padel Beta", number: 2, type: "indoor", features: ["Climate Controlled", "Premium Surface"], hourlyRate: 180, isAvailable: true },
  { id: "court-3", name: "Club de Padel Premier", number: 3, type: "outdoor", features: ["Open Air", "Professional Grade"], hourlyRate: 150, isAvailable: true },
  { id: "court-4", name: "Sunset Court", number: 4, type: "outdoor", features: ["Open Air", "Evening Lights"], hourlyRate: 150, isAvailable: false },
];

const TIME_SLOTS = [
  { time: "06:00", available: true }, { time: "07:00", available: true }, { time: "08:00", available: true }, { time: "09:00", available: true },
  { time: "10:00", available: true }, { time: "11:00", available: true }, { time: "12:00", available: false }, { time: "13:00", available: false },
  { time: "14:00", available: true }, { time: "15:00", available: true }, { time: "16:00", available: true }, { time: "17:00", available: true },
  { time: "18:00", available: true }, { time: "19:00", available: true }, { time: "20:00", available: true }, { time: "21:00", available: true }, { time: "22:00", available: true },
];

export default function BookCourtPage() {
  const supabase = createClient();
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time].sort());
  };

  const totalPrice = selectedCourt ? selectedCourt.hourlyRate * selectedTimes.length : 0;

  const handleContinue = () => {
    if (step === 1 && selectedCourt) setStep(2);
  };

  const handleBook = async () => {
    if (!selectedCourt || !selectedDate || selectedTimes.length === 0) return;
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Please sign in to book a court");
        return;
      }

      // Save booking to database
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        court_name: selectedCourt.name,
        booking_date: selectedDate,
        booking_times: selectedTimes,
        total_hours: selectedTimes.length,
        total_price: selectedCourt.hourlyRate * selectedTimes.length,
        status: "confirmed",
      });

      if (error) {
        console.error("Booking error:", error);
        alert("Failed to book. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/[0.05] rounded-2xl shadow-xl p-8 text-center border border-white/10">
          <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-white/70 mb-6">Your court has been booked for {selectedDate}</p>
          <div className="bg-white/[0.03] rounded-xl p-4 mb-6 text-left border border-white/10">
            <p className="text-white/70"><strong className="text-white">Court:</strong> {selectedCourt?.name}</p>
            <p className="text-white/70"><strong className="text-white">Date:</strong> {selectedDate}</p>
            <p className="text-white/70"><strong className="text-white">Time:</strong> {selectedTimes.join(", ")}</p>
            <p className="text-white/70"><strong className="text-white">Hours:</strong> {selectedTimes.length}</p>
            <p className="text-white/70"><strong className="text-white">Total:</strong> {totalPrice} SAR</p>
          </div>
          <Link href="/dashboard" className="block w-full bg-[#EA553B] hover:bg-[#FF6B4F] text-white font-bold py-3 px-6 rounded-lg">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
<SiteHeader />

      <main className="max-w-4xl mx-auto px-4 py-8 text-white">
        <div className="flex items-center gap-2 mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 1 ? "bg-[#EA553B] text-white" : "bg-white/10 text-white/70"}`}><span className="font-medium">1. Select Court</span></div>
          <div className="flex-1 h-1 bg-white/10"><div className={`h-full bg-[#EA553B] transition-all ${step >= 2 ? "w-full" : "w-0"}`} /></div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 2 ? "bg-[#EA553B] text-white" : "bg-white/10 text-white/70"}`}><span className="font-medium">2. Book</span></div>
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold mb-6 text-white">Choose Your Court</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COURTS.map((court) => (
                <button key={court.id} onClick={() => court.isAvailable && setSelectedCourt(court)} disabled={!court.isAvailable}
                  className={`p-5 rounded-xl border-2 text-left transition-all text-white ${selectedCourt?.id === court.id ? "border-[#EA553B] bg-[#EA553B]/10" : court.isAvailable ? "border-white/10 bg-white/[0.05] hover:border-[#EA553B]/60" : "border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed"}`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${court.type === "indoor" ? "bg-blue-500/15 text-blue-400" : "bg-emerald-500/15 text-emerald-400"}`}>{court.type}</span>
                    <span className="font-bold text-lg text-white">{court.hourlyRate} SAR<span className="text-sm text-white/50">/hr</span></span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-white">{court.name}</h3>
                  <p className="text-sm text-white/50">{court.features.join(" • ")}</p>
                </button>
              ))}
            </div>
            {selectedCourt && <button onClick={handleContinue} className="w-full mt-8 bg-[#EA553B] hover:bg-[#FF6B4F] text-white font-bold py-4 rounded-xl text-lg">Continue - {selectedCourt.hourlyRate} SAR/hr</button>}
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setStep(1)} className="text-white/50 hover:text-white">← Back</button>
              <h1 className="text-2xl font-bold text-white">Complete Your Booking</h1>
            </div>

            <div className="bg-[#EA553B]/10 border border-[#EA553B]/30 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div><p className="text-sm text-[#EA553B]">Court</p><p className="font-bold text-lg text-white">{selectedCourt?.name}</p></div>
                <div className="text-right"><p className="text-sm text-[#EA553B]">Price</p><p className="font-bold text-lg text-white">{selectedCourt?.hourlyRate} SAR<span className="text-sm">/hr</span></p></div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3 text-white">Select Date</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0];
                  return (
                    <button key={dateStr} onClick={() => setSelectedDate(dateStr)}
                      className={`flex-shrink-0 w-16 py-3 rounded-lg border text-center transition-all text-white ${selectedDate === dateStr ? "border-[#EA553B] bg-[#EA553B] text-white" : "border-white/10 bg-white/[0.05] hover:border-[#EA553B]/60"}`}>
                      <div className="text-xs font-medium">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                      <div className="text-lg font-bold">{date.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3 text-white">Select Time Slots (click multiple)</h2>
              <p className="text-sm text-white/50 mb-3">Selected: {selectedTimes.length} hour(s)</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button key={slot.time} onClick={() => slot.available && toggleTime(slot.time)} disabled={!slot.available}
                    className={`py-3 rounded-lg border text-center font-medium transition-all text-white ${selectedTimes.includes(slot.time) ? "border-[#EA553B] bg-[#EA553B] text-white" : slot.available ? "border-white/10 bg-white/[0.05] hover:border-[#EA553B]/60" : "border-white/5 bg-white/[0.02] text-white/30 cursor-not-allowed line-through"}`}>
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {selectedTimes.length > 0 && (
              <div className="bg-[#EA553B]/10 border-2 border-[#EA553B]/30 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-white mb-3">Your Booking Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-[#EA553B]">Court</p><p className="font-bold text-white">{selectedCourt?.name}</p></div>
                  <div><p className="text-[#EA553B]">Date</p><p className="font-bold text-white">{selectedDate}</p></div>
                  <div><p className="text-[#EA553B]">Time Slots</p><p className="font-bold text-white">{selectedTimes.join(", ")}</p></div>
                  <div><p className="text-[#EA553B]">Hours</p><p className="font-bold text-white">{selectedTimes.length} hour(s)</p></div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#EA553B]/30">
                  <div className="flex justify-between items-center"><span className="font-bold text-white">Total</span><span className="font-bold text-2xl text-[#EA553B]">{totalPrice} SAR</span></div>
                </div>
              </div>
            )}

            <button onClick={handleBook} disabled={selectedTimes.length === 0 || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selectedTimes.length > 0 && !isLoading ? "bg-[#EA553B] hover:bg-[#FF6B4F] text-white" : "bg-white/10 text-white/30 cursor-not-allowed"}`}>
              {isLoading ? "Booking..." : selectedTimes.length > 0 ? `Book ${selectedTimes.length} hour(s) for ${totalPrice} SAR` : "Select time slots to continue"}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
