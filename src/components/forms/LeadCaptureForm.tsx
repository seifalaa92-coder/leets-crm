"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadCaptureFormProps {
  isOpen: boolean;
  onClose: () => void;
  triggerSource?: string;
  sessionId?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interestType: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  interestType?: string;
}

const interestOptions = [
  { value: "", label: "Select your interest" },
  { value: "court_booking", label: "Court Booking" },
  { value: "coaching", label: "Private Coaching" },
  { value: "membership", label: "Membership" },
  { value: "general", label: "General Inquiry" },
];

export function LeadCaptureForm({ 
  isOpen, 
  onClose, 
  triggerSource = "modal",
  sessionId 
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interestType: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      newErrors.lastName = "Last name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    const phoneRegex = /^[+]?[\d\s-]{8,}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Valid phone number is required";
    }

    if (!formData.interestType) {
      newErrors.interestType = "Please select an interest";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const getUtmParams = () => {
    if (typeof window === "undefined") return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get("utm_source") || undefined,
      utm_medium: urlParams.get("utm_medium") || undefined,
      utm_campaign: urlParams.get("utm_campaign") || undefined,
      utm_content: urlParams.get("utm_content") || undefined,
      utm_term: urlParams.get("utm_term") || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        interestType: formData.interestType,
        message: formData.message,
        sessionId: sessionId || localStorage.getItem("visitorSessionId"),
        formLocation: triggerSource,
        landingPage: typeof window !== "undefined" ? window.location.href : "",
        referrer: typeof window !== "undefined" ? document.referrer : "",
        utmParams: getUtmParams(),
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form after success
        setTimeout(() => {
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            interestType: "",
            message: "",
          });
        }, 2000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Content */}
            <div className="relative bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#EA553B]/20 via-transparent to-[#EA553B]/10 pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="relative px-8 pt-8 pb-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EA553B]/10 border border-[#EA553B]/30 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#EA553B] animate-pulse" />
                  <span className="text-[#EA553B] text-xs font-semibold tracking-wider uppercase">
                    Get Started
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">
                  Join LEETS
                </h2>
                <p className="text-white/60 font-body text-sm">
                  Fill out the form below and we&apos;ll get back to you within 24 hours
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="relative px-8 pb-8 space-y-5">
                {/* Success Message */}
                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="font-display text-lg text-white mb-1">Thank You!</h3>
                      <p className="text-white/60 text-sm">We&apos;ve received your inquiry and will contact you soon.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center"
                    >
                      <p className="text-red-400 text-sm">{errorMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {submitStatus !== "success" && (
                  <>
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-white/80 text-sm font-medium mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                            errors.firstName ? "border-red-500/50" : "border-white/10"
                          } text-white placeholder-white/30 focus:border-[#EA553B] focus:outline-none focus:ring-1 focus:ring-[#EA553B]/50 transition-all`}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-red-400 text-xs">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-white/80 text-sm font-medium mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                            errors.lastName ? "border-red-500/50" : "border-white/10"
                          } text-white placeholder-white/30 focus:border-[#EA553B] focus:outline-none focus:ring-1 focus:ring-[#EA553B]/50 transition-all`}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-red-400 text-xs">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.email ? "border-red-500/50" : "border-white/10"
                        } text-white placeholder-white/30 focus:border-[#EA553B] focus:outline-none focus:ring-1 focus:ring-[#EA553B]/50 transition-all`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-red-400 text-xs">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-white/80 text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.phone ? "border-red-500/50" : "border-white/10"
                        } text-white placeholder-white/30 focus:border-[#EA553B] focus:outline-none focus:ring-1 focus:ring-[#EA553B]/50 transition-all`}
                        placeholder="+966 50 123 4567"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-red-400 text-xs">{errors.phone}</p>
                      )}
                    </div>

                    {/* Interest Type */}
                    <div>
                      <label htmlFor="interestType" className="block text-white/80 text-sm font-medium mb-2">
                        I&apos;m Interested In *
                      </label>
                      <select
                        id="interestType"
                        name="interestType"
                        value={formData.interestType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                          errors.interestType ? "border-red-500/50" : "border-white/10"
                        } text-white focus:border-[#EA553B] focus:outline-none focus:ring-1 focus:ring-[#EA553B]/50 transition-all appearance-none cursor-pointer`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5rem",
                        }}
                      >
                        {interestOptions.map((option) => (
                          <option key={option.value} value={option.value} className="bg-[#0F172A] text-white">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.interestType && (
                        <p className="mt-1 text-red-400 text-xs">{errors.interestType}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-white/80 text-sm font-medium mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#EA553B] focus:outline-none focus:ring-1 focus:ring-[#EA553B]/50 transition-all resize-none"
                        placeholder="Tell us more about what you're looking for..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#EA553B] hover:bg-[#D14028] text-white font-display text-lg tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Get in Touch"
                      )}
                    </button>

                    <p className="text-center text-white/40 text-xs">
                      By submitting, you agree to our privacy policy
                    </p>
                  </>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
