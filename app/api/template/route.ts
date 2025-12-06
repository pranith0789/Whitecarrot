import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

export async function GET() {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("section_templates")
    .select("*")
    // .eq("is_default",false)
    .order("id");

  if (error) {
    return NextResponse.json([]);
  }

  // MUST return an array
  return NextResponse.json(data || []);
}
