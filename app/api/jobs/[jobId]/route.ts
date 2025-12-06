import { supabaseServer } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: any) {
  const { jobId } = await context.params;
  const body = await req.json();

  const supabase = supabaseServer();
  const { error } = await supabase
    .from("jobs")
    .update(body)
    .eq("id", jobId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, context: any) {
  const { jobId } = await context.params;

  const supabase = supabaseServer();
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
