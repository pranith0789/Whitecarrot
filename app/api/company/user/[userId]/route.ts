import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

export async function GET(req: Request, { params }: any) {
  const { userId } = params;
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (error) return NextResponse.json({ error });

  return NextResponse.json({ companyId: data.id });
}
