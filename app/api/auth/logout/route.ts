import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

export async function POST() {
  const supabase = supabaseServer();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
