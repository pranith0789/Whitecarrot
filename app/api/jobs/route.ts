import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";
import { randomUUID } from "crypto";

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from("jobs").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = supabaseServer();
  const body = await req.json();

  if (!body.title) {
    return NextResponse.json({ error: "Job title is required" }, { status: 400 });
  }

  const payload = {
    id: randomUUID(), // generate job ID
    title: body.title,
    work_policy: body.work_policy ?? "",
    location: body.location ?? "",
    department: body.department ?? "",
    employment_type: body.employment_type ?? "",
    experience_level: body.experience_level ?? "",
    job_type: body.job_type ?? "",
    salary_range: body.salary_range ?? "",
    job_slug: body.job_slug ?? "",
    posted_days_ago: body.posted_days_ago ?? 0,
  };

  const { data, error } = await supabase
    .from("jobs")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ job: data });
}
