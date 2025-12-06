import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = supabaseServer();

  // 1. Sign in user
  const { data: auth, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const userId = auth.user.id;

  // 2. Get company for this recruiter
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", userId)
    .single();

  if (!company) {
    return NextResponse.json({ error: "No company found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    companyId: company.id
  });
}
