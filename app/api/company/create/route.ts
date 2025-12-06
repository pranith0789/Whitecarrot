import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";
import { defaultSections } from "@/app/lib/SectionsConfig";

export async function POST(req: Request) {
  const { userId } = await req.json();
  const supabase = supabaseServer();

  // Create company
  const { data: company, error: companyErr } = await supabase
    .from("companies")
    .insert({ name: "New Company", user_id: userId })
    .select()
    .single();

  if (companyErr) return NextResponse.json({ error: companyErr });

  const id = company.id;

  // Insert default sections
  const payload = defaultSections.map((sec, index) => ({
    company_id: id,
    section_id: sec.id,
    position: index + 1,
    bg_color: "#ffffff",
    content: {},
  }));

  await supabase.from("company_sections").insert(payload);

  return NextResponse.json({ success: true, companyId: id });
}
