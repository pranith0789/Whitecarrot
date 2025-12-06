import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

export async function POST(req: Request) {
  const { email, password, companyName } = await req.json();
  const supabase = supabaseServer();

  // 1. Create User
  const { data: auth, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr) {
    return NextResponse.json({ error: authErr.message }, { status: 400 });
  }

  const userId = auth.user.id;

  // 2. Create Company
  const { data: company, error: compErr } = await supabase
    .from("companies")
    .insert({ name: companyName, owner_id: userId })
    .select()
    .single();

  if (compErr) {
    return NextResponse.json({ error: compErr.message }, { status: 400 });
  }

  const companyId = company.id;

  // 3. Fetch all template rows (ORDER BY position is required!)
  const { data: templates, error: tplErr } = await supabase
    .from("section_templates")
    .select("*")
    .eq("is_default",true)
    .order("position", { ascending: true });

  if (tplErr || !templates || templates.length === 0) {
    return NextResponse.json(
      { error: "No templates found in DB." },
      { status: 500 }
    );
  }

  // 4. Insert default sections (one entry per template)
  const defaultSections = templates.map((tpl, index) => ({
    company_id: companyId,
    section_id: tpl.id, // MUST match renderer key, e.g., intro_video
    type: tpl.type,
    content: tpl.content ?? {}, // safe JSON
    position: index + 1,
    bg_color: tpl.bg_color ?? "#ffffff",
  }));

  const { error: insertErr } = await supabase
    .from("company_sections")
    .insert(defaultSections);

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, companyId });
}
