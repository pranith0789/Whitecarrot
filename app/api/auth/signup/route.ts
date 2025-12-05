// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";
// import { defaultSections } from "@/app/lib/SectionsConfig";

// export async function POST(req: Request) {
//   const { email, password } = await req.json();
//   const supabase = supabaseServer();

//   // 1️⃣ Create user
//   const { data: auth, error: authErr } = await supabase.auth.admin.createUser({
//     email,
//     password,
//     email_confirm: true,
//   });

//   if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 });

//   const userId = auth.user.id;

//   // 2️⃣ Create a company for this recruiter
//   const { data: company, error: compErr } = await supabase
//     .from("companies")
//     .insert({ name: email + "'s Company", owner_id: userId })
//     .select()
//     .single();

//   if (compErr) return NextResponse.json({ error: compErr.message }, { status: 500 });

//   const companyId = company.id;

//   // 3️⃣ Insert default company sections
//   const payload = defaultSections.map((s, i) => ({
//     company_id: companyId,
//     section_id: s.id,
//     position: i + 1,
//     bg_color: "#ffffff",
//     content: {},
//   }));

//   await supabase.from("company_sections").insert(payload);

//   return NextResponse.json({ success: true, companyId });
// }

// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";
// import { defaultSections } from "@/app/lib/SectionsConfig";

// export async function POST(req: Request) {
//   const { email, password } = await req.json();
//   const supabase = supabaseServer();

//   // 1. Create user
//   const { data: auth, error: authErr } = await supabase.auth.admin.createUser({
//     email,
//     password,
//     email_confirm: true,
//   });

//   if (authErr) {
//     return NextResponse.json({ error: authErr.message }, { status: 400 });
//   }

//   const userId = auth.user.id;

//   // 2. Create company
//   const { data: company, error: compErr } = await supabase
//     .from("companies")
//     .insert({
//       name: `${email}'s Company`,
//       owner_id: userId
//     })
//     .select()
//     .single();

//   if (compErr) {
//     return NextResponse.json({ error: compErr.message }, { status: 500 });
//   }

//   const companyId = company.id;

//   // 3. Insert default sections
//   const initialSections = defaultSections.map((s, index) => ({
//     company_id: companyId,
//     section_id: s.id,
//     position: index + 1,
//     bg_color: "#ffffff",
//     content: {},
//   }));

//   await supabase.from("company_sections").insert(initialSections);

//   // 4. Return companyId so FE can redirect
//   return NextResponse.json({ success: true, companyId });
// }


// File: app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";
import { defaultSections } from "@/app/lib/SectionsConfig";

export async function POST(req: Request) {
  const { email, password, companyName } = await req.json();
  const supabase = supabaseServer();

  // 1. Validate input
  if (!email || !password || !companyName) {
    return NextResponse.json(
      { error: "Email, password, and company name are required" },
      { status: 400 }
    );
  }

  // 2. Create User
  const { data: auth, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr) {
    return NextResponse.json({ error: authErr.message }, { status: 400 });
  }

  const userId = auth.user.id;

  // 3. Create Company with user-provided name
  const { data: company, error: compErr } = await supabase
    .from("companies")
    .insert({
      name: companyName.trim(),
      owner_id: userId,
    })
    .select()
    .single();

  if (compErr) {
    return NextResponse.json({ error: compErr.message }, { status: 500 });
  }

  const companyId = company.id;

  // 4. Insert default sections for the company
  const initialSections = defaultSections.map((section, index) => ({
    company_id: companyId,
    section_id: section.id,
    position: index + 1,
    bg_color: "#ffffff",
    content: {},
  }));

  await supabase.from("company_sections").insert(initialSections);

  return NextResponse.json({ success: true, companyId });
}
