import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase.from("profiles").select("role, email, display_name").eq("id", user.id).single();

  if (!profile || !["admin", "editor", "viewer"].includes(profile.role)) {
    redirect("/admin/login");
  }

  return { user, profile };
}
