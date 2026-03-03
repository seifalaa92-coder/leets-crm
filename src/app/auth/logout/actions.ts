/**
 * Logout Action
 * 
 * Server action to handle user logout.
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
