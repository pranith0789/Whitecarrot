import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

// -------------------- GET --------------------
export async function GET(req: Request, ctx: any) {
  const params = await ctx.params;
  const companyId = params.companyId;
  if (!companyId || companyId === "undefined") {
    return NextResponse.json(
      { error: "Invalid companyId" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("company_sections")
    .select("*")
    .eq("company_id", companyId)
    .order("position", { ascending: true });

  if (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// -------------------- POST (Create Section) --------------------
export async function POST(
  req: Request,
  ctx: { params: Promise<{ companyId: string }> }
) {
  const params = await ctx.params; // ⭐ MUST AWAIT
  const companyId = params.companyId;

  const body = await req.json();

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("company_sections")
    .insert({
      ...body,
      company_id: companyId, // IMPORTANT
    })
    .select("*")
    .single();

  if (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// -------------------- PUT (Update Section) --------------------
export async function PUT(
  req: Request,
  ctx: { params: Promise<{ companyId: string }> }
) {
  const params = await ctx.params; // ⭐ MUST AWAIT
  const companyId = params.companyId;

  const body = await req.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Missing section id" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("company_sections")
    .update(updateData)
    .eq("id", id)
    .eq("company_id", companyId)
    .select("*")
    .single();

  if (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// -------------------- DELETE --------------------
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ companyId: string }> }
) {
  const params = await ctx.params;          // ⭐ MUST AWAIT
  const companyId = params.companyId;

  const body = await req.json();
  const id = body.id;

  if (!id) {
    return NextResponse.json(
      { error: "Missing section id" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();        // REQUIRED

  const { error } = await supabase
    .from("company_sections")
    .delete()
    .eq("id", id)
    .eq("company_id", companyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
