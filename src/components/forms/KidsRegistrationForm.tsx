"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface KidFormData {
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  kidName: string;
  kidAge: string;
  sportInterest: string;
  notes: string;
}

interface FormErrors {
  parentFirstName?: string;
  parentLastName?: string;
  parentEmail?: string;
  parentPhone?: string;
  kidName?: string;
  kidAge?: string;
  sportInterest?: string;
}

const sportOptions = [
  { value: "", label: "Select a sport" },
  { value: "padel", label: "Padel" },
  { value: "tennis", label: "Tennis" },
  { value: "swimming", label: "Swimming" },
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "multi_sport", label: "Multi-Sport" },
  { value: "other", label: "Other" },
];

export function KidsRegistrationForm() {
  const [formData, setFormData] = useState<KidFormData>({
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    kidName: "",
    kidAge: "",
    sportInterest: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.parentFirstName.trim() || formData.parentFirstName.length < 2) {
      newErrors.parentFirstName = "Required";
    }
    if (!formData.parentLastName.trim() || formData.parentLastName.length < 2) {
      newErrors.parentLastName = "Required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.parentEmail.trim() || !emailRegex.test(formData.parentEmail)) {
      newErrors.parentEmail = "Valid email required";
    }
    const phoneRegex = /^[+]?[\d\s-]{8,}$/;
    if (!formData.parentPhone.trim() || !phoneRegex.test(formData.parentPhone)) {
      newErrors.parentPhone = "Valid phone required";
    }
    if (!formData.kidName.trim() || formData.kidName.length < 2) {
      newErrors.kidName = "Required";
    }
    if (!formData.kidAge.trim()) {
      newErrors.kidAge = "Required";
    }
    if (!formData.sportInterest) {
      newErrors.sportInterest = "Please select a sport";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/kids-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          parentFirstName: "",
          parentLastName: "",
          parentEmail: "",
          parentPhone: "",
          kidName: "",
          kidAge: "",
          sportInterest: "",
          notes: "",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border ${
      errors[fieldName] ? "border-red-500/50" : "border-white/10"
    } text-white placeholder-white/30 focus:border-[#EA553B] focus:outline-none focus:ring-1 focus:ring-[#EA553B]/50 transition-all`;

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0F172A] to-[#0F172A]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#EA553B]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#EA553B]/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA553B]/10 border border-[#EA553B]/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#EA553B] animate-pulse" />
              <span className="text-[#EA553B] text-sm font-semibold tracking-wider uppercase">
                Now Enrolling
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-white mb-4">
              Kids Sports Programs
            </h2>
            <p className="font-body text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              Give your child the gift of sports. Professional coaching in a fun, safe environment.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-[#0F172A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#EA553B]/15 via-transparent to-[#EA553B]/10 pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative px-6 sm:px-10 py-10 space-y-6">
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-white mb-2">Registration Received!</h3>
                <p className="text-white/60">We&apos;ll reach out with kids program details soon.</p>
              </motion.div>
            )}

            {submitStatus !== "success" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Parent Info */}
                  <div className="space-y-5">
                    <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#EA553B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Parent / Guardian Info
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">First Name *</label>
                        <input type="text" name="parentFirstName" value={formData.parentFirstName} onChange={handleInputChange} className={inputClass("parentFirstName")} placeholder="Ahmed" />
                        {errors.parentFirstName && <p className="mt-1 text-red-400 text-xs">{errors.parentFirstName}</p>}
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Last Name *</label>
                        <input type="text" name="parentLastName" value={formData.parentLastName} onChange={handleInputChange} className={inputClass("parentLastName")} placeholder="Al-Saud" />
                        {errors.parentLastName && <p className="mt-1 text-red-400 text-xs">{errors.parentLastName}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Email *</label>
                        <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleInputChange} className={inputClass("parentEmail")} placeholder="parent@example.com" />
                        {errors.parentEmail && <p className="mt-1 text-red-400 text-xs">{errors.parentEmail}</p>}
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Phone *</label>
                        <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} className={inputClass("parentPhone")} placeholder="+966 50 123 4567" />
                        {errors.parentPhone && <p className="mt-1 text-red-400 text-xs">{errors.parentPhone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Kid Info */}
                  <div className="space-y-5">
                    <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#EA553B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Child&apos;s Info
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Child&apos;s Name *</label>
                        <input type="text" name="kidName" value={formData.kidName} onChange={handleInputChange} className={inputClass("kidName")} placeholder="Faisal" />
                        {errors.kidName && <p className="mt-1 text-red-400 text-xs">{errors.kidName}</p>}
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Age *</label>
                        <input type="number" name="kidAge" value={formData.kidAge} onChange={handleInputChange} className={inputClass("kidAge")} placeholder="8" min="3" max="18" />
                        {errors.kidAge && <p className="mt-1 text-red-400 text-xs">{errors.kidAge}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Sport Interest *</label>
                      <select
                        name="sportInterest"
                        value={formData.sportInterest}
                        onChange={handleInputChange}
                        className={`${inputClass("sportInterest")} appearance-none cursor-pointer`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5rem",
                        }}
                      >
                        {sportOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#0F172A] text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.sportInterest && <p className="mt-1 text-red-400 text-xs">{errors.sportInterest}</p>}
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#EA553B] focus:outline-none focus:ring-1 focus:ring-[#EA553B]/50 transition-all resize-none"
                        placeholder="Any special requirements or questions..."
                      />
                    </div>
                  </div>
                </div>

                {submitStatus === "error" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#EA553B] to-[#D14028] hover:from-[#D14028] hover:to-[#C03020] text-white font-display text-xl tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-[#EA553B]/20"
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
                    <>
                      Register My Child
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-white/40 text-xs">
                  By submitting, you agree to our privacy policy
                </p>
              </>
            )}
          </form>
        </motion.div>

        {/* Benefits Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: "🎾", text: "Professional Coaching" },
            { icon: "🏊", text: "Safe Environment" },
            { icon: "🏆", text: "Ages 4-18" },
            { icon: "📅", text: "Flexible Schedules" },
          ].map((benefit, i) => (
            <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-3xl mb-2">{benefit.icon}</div>
              <p className="font-body text-sm text-white/70">{benefit.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
