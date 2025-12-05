import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

export async function GET(req: Request, { params }: { params: { companyId: string } }) {
  const { companyId } = await params;
  console.log("API companyId =", companyId);


  if (!companyId) {
    return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
  }

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}
