import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

// ❌ DO NOT type ctx, Next.js uses a special internal type
export async function GET(req: Request, context: any) {
  const { id } = await context.params; // MUST await this

  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("section_template_fields")
      .select("*")
      .eq("template_id", id)
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("GET /api/template/[id]/fields error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
