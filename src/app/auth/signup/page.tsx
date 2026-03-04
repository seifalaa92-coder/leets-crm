/**
 * Sign Up Page
 * 
 * Member registration with full profile information.
 */

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Name, email, and phone are required");
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            age: formData.age || null,
            role: "member",
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError.message);
        throw new Error(authError.message);
      }

      // Try to create client record
      if (authData.user) {
        try {
          await supabase.from("clients").insert({
            user_id: authData.user.id,
            first_name: formData.fullName.split(' ').slice(0, -1).join(' ') || formData.fullName,
            last_name: formData.fullName.split(' ').slice(-1).join(' ') || "",
            email: formData.email,
            phone: formData.phone,
            age: formData.age ? parseInt(formData.age) : null,
          });
        } catch (e) {
          console.log("Client table note");
        }

        // Send email notification
        try {
          await fetch('/api/signup-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              age: formData.age,
            }),
          });
        } catch (notifyError) {
          console.log('Notification error');
        }
      }

      // Redirect to login
      router.push("/auth/login?message=Account created! Please check your email to verify.");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <a 
        href="/" 
        className="fixed top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </a>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join Leets Sports today</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name *"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <Input
              label="Email *"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Phone Number *"
              type="tel"
              placeholder="+966 XX XXX XXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <Input
              label="Age"
              type="number"
              placeholder="Your age (optional)"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              min="1"
              max="150"
            />

            <Input
              label="Password *"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              helperText="At least 6 characters"
            />

            <Input
              label="Confirm Password *"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg"
              isLoading={isLoading}
            >
              Create Account
            </Button>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/auth/login" className="text-orange-500 font-bold hover:underline">
                Sign in here
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
