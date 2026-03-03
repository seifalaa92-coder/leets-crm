"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

const TIME_SLOTS = [
  { time: "06:00", available: true },
  { time: "07:00", available: true },
  { time: "08:00", available: true },
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:00", available: false },
  { time: "13:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
  { time: "18:00", available: true },
  { time: "19:00", available: true },
  { time: "20:00", available: true },
  { time: "21:00", available: true },
  { time: "22:00", available: true },
];

export default function BookCourtPage() {
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1);

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const handleContinue = () => {
    if (step === 1 && selectedCourt) {
      setStep(2);
    }
  };

  const handleBook = () => {
    alert(`Booking confirmed!\n\nCourt: ${selectedCourt?.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\nPrice: ${selectedCourt?.hourlyRate} SAR`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
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
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 1 ? "bg-orange-500 text-white" : "bg-gray-200"}`}>
            <span className="font-medium">1. Select Court</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200">
            <div className={`h-full bg-orange-500 transition-all ${step >= 2 ? "w-full" : "w-0"}`} />
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 2 ? "bg-orange-500 text-white" : "bg-gray-200"}`}>
            <span className="font-medium">2. Book</span>
          </div>
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold mb-6">Choose Your Court</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              { COURTS.map((court) => (
                <button
                  key={court.id}
                  onClick={() => court.isAvailable && setSelectedCourt(court)}
                  disabled={!court.isAvailable}
                  className={`
                    p-5 rounded-xl border-2 text-left transition-all
                    ${selectedCourt?.id === court.id 
                      ? "border-orange-500 bg-orange-50" 
                      : court.isAvailable 
                        ? "border-gray-200 bg-white hover:border-orange-300" 
                        : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${court.type === "indoor" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                        {court.type}
                      </span>
                    </div>
                    <span className="font-bold text-lg">{court.hourlyRate} SAR<span className="text-sm text-gray-500">/hr</span></span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{court.name}</h3>
                  <p className="text-sm text-gray-500">{court.features.join(" • ")}</p>
                  {!court.isAvailable && <span className="text-xs text-red-500 font-medium">Not Available</span>}
                </button>
              ))}
            </div>

            {selectedCourt && (
              <button
                onClick={handleContinue}
                className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg"
              >
                Continue - {selectedCourt.hourlyRate} SAR/hr
              </button>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700">
                ← Back
              </button>
              <h1 className="text-2xl font-bold">Complete Your Booking</h1>
            </div>

            {/* Selected Court Summary */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-orange-700">Court</p>
                  <p className="font-bold text-lg">{selectedCourt?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-700">Price</p>
                  <p className="font-bold text-lg">{selectedCourt?.hourlyRate} SAR<span className="text-sm">/hr</span></p>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3">Select Date</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`
                        flex-shrink-0 w-16 py-3 rounded-lg border text-center transition-all
                        ${isSelected 
                          ? "border-orange-500 bg-orange-500 text-white" 
                          : "border-gray-200 bg-white hover:border-orange-300"
                        }
                      `}
                    >
                      <div className="text-xs font-medium">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                      <div className="text-lg font-bold">{date.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3">Select Time</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`
                      py-3 rounded-lg border text-center font-medium transition-all
                      ${selectedTime === slot.time 
                        ? "border-orange-500 bg-orange-500 text-white" 
                        : slot.available 
                          ? "border-gray-200 bg-white hover:border-orange-300" 
                          : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                      }
                    `}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBook}
              disabled={!selectedDate || !selectedTime}
              className={`
                w-full py-4 rounded-xl font-bold text-lg transition-all
                ${selectedDate && selectedTime
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {selectedDate && selectedTime 
                ? `Book for ${selectedDate} at ${selectedTime} - ${selectedCourt?.hourlyRate} SAR`
                : "Select date and time to continue"
              }
            </button>
          </>
        )}
      </main>
    </div>
  );
}
