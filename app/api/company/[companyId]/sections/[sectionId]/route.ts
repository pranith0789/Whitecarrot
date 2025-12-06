import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

export async function PUT(req: Request, ctx: any) {
  const { companyId, sectionId } = await ctx.params;
  const { content } = await req.json();

  const supabase = supabaseServer();

  const { error } = await supabase
    .from("company_sections")
    .update({ content })
    .eq("company_id", companyId)
    .eq("id", sectionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
