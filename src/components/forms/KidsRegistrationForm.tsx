"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  level: string;
  notes: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  interest?: string;
  level?: string;
}

const interestOptions = [
  { value: "", label: "Select an option" },
  { value: "private_coaching", label: "Private Coaching" },
  { value: "group_sessions", label: "Group Sessions" },
  { value: "fitness_training", label: "Padel-Specific Fitness" },
  { value: "beginners_course", label: "Beginners Course" },
  { value: "tournament_prep", label: "Tournament Preparation" },
  { value: "kids_program", label: "Kids Program (Ages 6-14)" },
  { value: "other", label: "Other" },
];

const levelOptions = [
  { value: "", label: "Select your level" },
  { value: "beginner", label: "Beginner — Never played" },
  { value: "novice", label: "Novice — Played a few times" },
  { value: "intermediate", label: "Intermediate — Can rally and keep score" },
  { value: "advanced", label: "Advanced — Competitive player" },
];

export function KidsRegistrationForm() {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    level: "",
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

    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      newErrors.firstName = "Required";
    }
    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      newErrors.lastName = "Required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email required";
    }
    const phoneRegex = /^[+]?[\d\s-]{8,}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Valid phone required";
    }
    if (!formData.interest) {
      newErrors.interest = "Please select an option";
    }
    if (!formData.level) {
      newErrors.level = "Please select your level";
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
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          interest: "",
          level: "",
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
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-dark via-neutral-dark to-neutral-dark" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand" />
              <span className="text-brand font-label">
                Start Your Journey
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-white mb-4">
              Book a Coaching Session
            </h2>
            <p className="font-body text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              Tell us about your goals and we&apos;ll match you with the right coach and program.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
                <h3 className="font-display text-2xl text-white mb-2">Thank You!</h3>
                <p className="text-white/60">We&apos;ll reach out to schedule your first session.</p>
              </motion.div>
            )}

            {submitStatus !== "success" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="space-y-5">
                    <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#EA553B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Info
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">First Name *</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputClass("firstName")} placeholder="Ahmed" />
                        {errors.firstName && <p className="mt-1 text-red-400 text-xs">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Last Name *</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={inputClass("lastName")} placeholder="Al-Saud" />
                        {errors.lastName && <p className="mt-1 text-red-400 text-xs">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass("email")} placeholder="you@example.com" />
                        {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass("phone")} placeholder="+966 50 123 4567" />
                        {errors.phone && <p className="mt-1 text-red-400 text-xs">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Training Info */}
                  <div className="space-y-5">
                    <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#EA553B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Training Details
                    </h3>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">I&apos;m interested in *</label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        className={`${inputClass("interest")} appearance-none cursor-pointer`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5rem",
                        }}
                      >
                        {interestOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#0F172A] text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.interest && <p className="mt-1 text-red-400 text-xs">{errors.interest}</p>}
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Current Level *</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className={`${inputClass("level")} appearance-none cursor-pointer`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5rem",
                        }}
                      >
                        {levelOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#0F172A] text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.level && <p className="mt-1 text-red-400 text-xs">{errors.level}</p>}
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#EA553B] focus:outline-none focus:ring-1 focus:ring-[#EA553B]/50 transition-all resize-none"
                        placeholder="Any questions or preferences..."
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
                    className="w-full py-5 rounded-2xl bg-brand hover:bg-brand-dark text-white font-display text-xl tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-brand/20"
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
                        Get Started
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
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: "🎾", text: "Expert Coaches" },
            { icon: "🏋️", text: "Padel-Specific Fitness" },
            { icon: "📊", text: "Video Analysis" },
            { icon: "🏆", text: "All Levels Welcome" },
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
