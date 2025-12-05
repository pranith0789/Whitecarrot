// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";

// export async function GET(req: Request, { params }: { params: { companyid: string } }) {
//   const { companyid } = await params;
//   console.log("API companyId =", companyid);

//   if (!companyid) {
//     return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
//   }

//   const supabase = supabaseServer();

//   const { data, error } = await supabase
//     .from("company_sections")
//     .select("*")
//     .eq("company_id", companyid)
//     .order("position");

//   if (error) return NextResponse.json({ error }, { status: 500 });

//   return NextResponse.json(data);
// }



// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";

// // -----------------------------------------------
// // GET → Fetch all sections for a company
// // -----------------------------------------------
// export async function GET(
//   req: Request,
//   { params }: { params: { companyId: string } }
// ) {
//   const { companyId } = await params;

//   if (!companyId) {
//     return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
//   }

//   const supabase = supabaseServer();

//   const { data, error } = await supabase
//     .from("company_sections")
//     .select("*")
//     .eq("company_id", companyId)
//     .order("position");

//   if (error) return NextResponse.json({ error }, { status: 500 });

//   return NextResponse.json(data);
// }

// // -----------------------------------------------
// // POST → Add a new section
// // -----------------------------------------------
// export async function POST(
//   req: Request,
//   { params }: { params: { companyId: string } }
// ) {
//   const { companyId } = await params;
//   if (!companyId) return NextResponse.json({ error: "Missing companyId" });

//   const body = await req.json();

//   const supabase = supabaseServer();

//   const { data, error } = await supabase
//     .from("company_sections")
//     .insert({
//       company_id: companyId,
//       section_id: body.kind,
//       position: body.position,
//       bg_color: body.bgColor,
//       content: body.content || {},
//     })
//     .select()
//     .single();

//   if (error) return NextResponse.json({ error }, { status: 500 });

//   return NextResponse.json(data);
// }

// // -----------------------------------------------
// // PUT → Update (reorder / color / content)
// // -----------------------------------------------
// export async function PUT(
//   req: Request,
//   { params }: { params: { companyId: string } }
// ) {
//   const { companyId } = await params;
//   if (!companyId) return NextResponse.json({ error: "Missing companyId" });

//   const sections = await req.json();
//   const supabase = supabaseServer();

//   const updates = sections.map((sec: any) => ({
//     id: sec.id,
//     position: sec.position,
//     bg_color: sec.bgColor,
//     content: sec.content || {},
//   }));

//   const { error } = await supabase.from("company_sections").upsert(updates, {
//     onConflict: "id",
//   });

//   if (error) return NextResponse.json({ error }, { status: 500 });

//   return NextResponse.json({ success: true });
// }

// // -----------------------------------------------
// // DELETE → Remove a section
// // -----------------------------------------------
// export async function DELETE(
//   req: Request,
//   { params }: { params: { companyId: string } }
// ) {
//   const { companyId } = await params;
//   if (!companyId) return NextResponse.json({ error: "Missing companyId" });

//   const { id } = await req.json();

//   const supabase = supabaseServer();

//   const { error } = await supabase
//     .from("company_sections")
//     .delete()
//     .eq("id", id)
//     .eq("company_id", companyId);

//   if (error) return NextResponse.json({ error }, { status: 500 });

//   return NextResponse.json({ success: true });
// }


// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";

// export async function GET(
//   req: Request,
//   { params }: { params: { companyId: string } }
// ) {
//   const { companyId } = await params;

//   if (!companyId) {
//     return NextResponse.json([], { status: 200 }); // always array
//   }

//   const supabase = supabaseServer();
//   const { data, error } = await supabase
//     .from("company_sections")
//     .select("*")
//     .eq("company_id", companyId)
//     .order("position");

//   if (error) {
//     console.error("API ERROR", error);
//     return NextResponse.json([], { status: 200 });
//   }

//   return NextResponse.json(data || []);
// }

// // app/api/company/[companyId]/sections/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";

// /**
//  * GET   -> list sections for a company (ordered)
//  * POST  -> create a new section (returns created row)
//  * PUT   -> upsert multiple sections (positions/colors/content)
//  * DELETE-> delete a section by id (expects { id })
//  */

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { companyId: string } }
// ) {
//   const companyId = params ;
//   if (!companyId) return NextResponse.json({ error: "Missing companyId" }, { status: 400 });

//   const supabase = supabaseServer();

//   const { data, error } = await supabase
//     .from("company_sections")
//     .select("*")
//     .eq("company_id", companyId)
//     .order("position", { ascending: true });

//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(data);
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { companyId: string } }
// ) {
//   // create one section
//   const companyId = params;
//   if (!companyId) return NextResponse.json({ error: "Missing companyId" }, { status: 400 });

//   const body = await req.json(); // { kind, position, bgColor, content? }
//   const { kind, position, bgColor = "#ffffff", content = {} } = body;

//   const supabase = supabaseServer();
//   const { data, error } = await supabase
//     .from("company_sections")
//     .insert({
//       company_id: companyId,
//       section_id: kind,
//       position,
//       bg_color: bgColor,
//       content,
//     })
//     .select()
//     .single();

//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(data);
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { companyId: string } }
// ) {
//   // Upsert multiple sections (reorder or update fields)
//   const companyId = params;
//   if (!companyId) return NextResponse.json({ error: "Missing companyId" }, { status: 400 });

//   const body = await req.json(); // expect array: [{ id, position, bgColor, content? }, ...]
//   if (!Array.isArray(body)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

//   // Prepare payload: include company_id to be safe
//   const payload = body.map((s: any) => ({
//     id: s.id,
//     company_id: companyId,
//     position: s.position,
//     bg_color: s.bgColor ?? s.bg_color ?? "#ffffff",
//     content: s.content ?? s.content,
//   }));

//   const supabase = supabaseServer();
//   const { error } = await supabase
//     .from("company_sections")
//     .upsert(payload, { onConflict: "id" });

//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json({ success: true });
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { companyId: string } }
// ) {
//   const companyId = params;
//   if (!companyId) return NextResponse.json({ error: "Missing companyId" }, { status: 400 });

//   const body = await req.json(); // { id }
//   const id = body?.id;
//   if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

//   const supabase = supabaseServer();
//   const { error } = await supabase
//     .from("company_sections")
//     .delete()
//     .eq("id", id)
//     .eq("company_id", companyId);

//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json({ success: true });
// }


// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";

// /* =========================================
//    GET — return all sections safely
// ========================================= */
// export async function GET(
//   req: Request,
//   { params }: { params: { companyId: string } }
// ) {
//   const { companyId } = params;

//   if (!companyId) return NextResponse.json([]);

//   const supabase = supabaseServer();
//   const { data, error } = await supabase
//     .from("company_sections")
//     .select("*")
//     .eq("company_id", companyId)
//     .order("position");

//   if (error) {
//     console.error("GET ERROR:", error);
//     return NextResponse.json([]);
//   }

//   return NextResponse.json(data || []);
// }

// /* =========================================
//    POST — create ONE new section
// ========================================= */
// export async function POST(
//   req: Request,
//   { params }: { params: { companyId: string } }
// ) {
//   const { companyId } = params;

//   if (!companyId) return NextResponse.json({});

//   const body = await req.json();
//   const { kind, position, bgColor = "#ffffff", content = {} } = body;

//   const supabase = supabaseServer();
//   const { data, error } = await supabase
//     .from("company_sections")
//     .insert({
//       company_id: companyId,
//       section_id: kind,
//       position,
//       bg_color: bgColor,
//       content,
//     })
//     .select()
//     .single();

//   if (error) {
//     console.error("POST ERROR:", error);
//     return NextResponse.json({});
//   }

//   return NextResponse.json(data || {});
// }

// /* =========================================
//    PUT — upsert multiple sections (reorder + update)
// ========================================= */
// export async function PUT(
//   req: Request,
//   { params }: { params: { companyId: string } }
// ) {
//   const { companyId } = params;
//   if (!companyId) return NextResponse.json({ success: false });

//   const body = await req.json(); // expect array

//   if (!Array.isArray(body)) return NextResponse.json({ success: false });

//   const payload = body.map((s: any) => ({
//     id: s.id,
//     company_id: companyId,
//     position: s.position,
//     bg_color: s.bgColor ?? s.bg_color ?? "#ffffff",
//     content: s.content ?? {},
//   }));

//   const supabase = supabaseServer();
//   const { error } = await supabase.from("company_sections").upsert(payload);

//   if (error) {
//     console.error("PUT ERROR:", error);
//     return NextResponse.json({ success: false });
//   }

//   return NextResponse.json({ success: true });
// }

// /* =========================================
//    DELETE — remove one section
// ========================================= */
// export async function DELETE(
//   req: Request,
//   { params }: { params: { companyId: string } }
// ) {
//   const { companyId } = params;
//   if (!companyId) return NextResponse.json({ success: false });

//   const { id } = await req.json();
//   if (!id) return NextResponse.json({ success: false });

//   const supabase = supabaseServer();
//   const { error } = await supabase
//     .from("company_sections")
//     .delete()
//     .eq("id", id)
//     .eq("company_id", companyId);

//   if (error) {
//     console.error("DELETE ERROR:", error);
//     return NextResponse.json({ success: false });
//   }

//   return NextResponse.json({ success: true });
// }



// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";

// export async function GET(
//   req: Request,
//   ctx: { params: Promise<{ companyId: string }> }
// ) {
//   const { companyId } = await ctx.params; // ← IMPORTANT FIX

//   console.log("GET API -> companyId =", companyId);

//   if (!companyId) {
//     return NextResponse.json([], { status: 200 });
//   }

//   const supabase = supabaseServer();
//   const { data, error } = await supabase
//     .from("company_sections")
//     .select("*")
//     .eq("company_id", companyId)
//     .order("position", { ascending: true });

//   if (error) {
//     console.error("Supabase GET Error:", error);
//     return NextResponse.json([], { status: 200 });
//   }

//   return NextResponse.json(data || []);
// }


// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";

// type CtxParams = { params: Promise<{ companyId: string }> };

// // Helper: reindex positions 1..N for a company
// async function reindexPositions(supabase: any, companyId: string) {
//   const { data: sections, error } = await supabase
//     .from("company_sections")
//     .select("id")
//     .eq("company_id", companyId)
//     .order("position", { ascending: true });

//   if (error) throw error;

//   if (!sections || sections.length === 0) return;

//   // update each row's position to its index+1
//   for (let i = 0; i < sections.length; i++) {
//     const id = sections[i].id;
//     const newPos = i + 1;
//     await supabase
//       .from("company_sections")
//       .update({ position: newPos })
//       .eq("id", id);
//   }
// }

// /* ------------------------- GET ------------------------- */
// export async function GET(req: Request, ctx: CtxParams) {
//   try {
//     const { companyId } = await ctx.params;

//     console.log("GET API -> companyId =", companyId);

//     if (!companyId) return NextResponse.json([], { status: 200 });

//     const supabase = supabaseServer();
//     const { data, error } = await supabase
//       .from("company_sections")
//       .select("*")
//       .eq("company_id", companyId)
//       .order("position", { ascending: true });

//     if (error) {
//       console.error("Supabase GET Error:", error);
//       return NextResponse.json({ error: "DB error" }, { status: 500 });
//     }

//     return NextResponse.json(data || [], { status: 200 });
//   } catch (err) {
//     console.error("GET error:", err);
//     return NextResponse.json({ error: "server error" }, { status: 500 });
//   }
// }

// /* ------------------------- POST (create) -------------------------
//  Expected body JSON:
//  {
//    "type": "about" | "intro" | ...,
//    "title": "optional",
//    "content": { ... } or string,
//    "position": 2   // optional. If missing append to end.
//  }
// -------------------------------------------------------------- */
// export async function POST(req: Request, ctx: CtxParams) {
//   try {
//     const { companyId } = await ctx.params;
//     const body = await req.json();

//     if (!companyId) return NextResponse.json({ error: "missing companyId" }, { status: 400 });

//     const { type = null, title = null, content = null, position = null } = body;

//     const supabase = supabaseServer();

//     // Determine position: if not provided, append to end
//     let finalPosition = position;
//     if (finalPosition == null) {
//       const { count } = await supabase
//         .from("company_sections")
//         .select("id", { count: "exact", head: true });

//       // If head:true returns count under count property; fall back to 0
//       finalPosition = (count ?? 0) + 1;
//     }

//     // Insert new section
//     const { data: insertData, error: insertError } = await supabase
//       .from("company_sections")
//       .insert([
//         {
//           company_id: companyId,
//           type,
//           title,
//           content,
//           position: finalPosition,
//           created_at: new Date().toISOString(),
//         },
//       ])
//       .select()
//       .single();

//     if (insertError) {
//       console.error("Supabase INSERT Error:", insertError);
//       return NextResponse.json({ error: "insert error" }, { status: 500 });
//     }

//     // Reindex to be safe (keeps positions consistent)
//     await reindexPositions(supabase, companyId);

//     return NextResponse.json(insertData, { status: 201 });
//   } catch (err) {
//     console.error("POST error:", err);
//     return NextResponse.json({ error: "server error" }, { status: 500 });
//   }
// }

// /* ------------------------- PUT (update) -------------------------
//  Expected body JSON:
//  {
//    "id": "<section-id>",            // REQUIRED
//    "type": "...",                   // optional
//    "title": "...",                  // optional
//    "content": {...},                // optional
//    "position": 3                    // optional (will be applied, then positions reindexed)
//  }
// -------------------------------------------------------------- */
// export async function PUT(req: Request, ctx: CtxParams) {
//   try {
//     const { companyId } = await ctx.params;
//     const body = await req.json();

//     if (!companyId) return NextResponse.json({ error: "missing companyId" }, { status: 400 });

//     const { id, type, title, content, position } = body;
//     if (!id) return NextResponse.json({ error: "missing section id" }, { status: 400 });

//     const supabase = supabaseServer();

//     const updatePayload: any = {};
//     if (type !== undefined) updatePayload.type = type;
//     if (title !== undefined) updatePayload.title = title;
//     if (content !== undefined) updatePayload.content = content;
//     if (position !== undefined) updatePayload.position = position;

//     const { data: updateData, error: updateError } = await supabase
//       .from("company_sections")
//       .update(updatePayload)
//       .eq("id", id)
//       .select()
//       .single();

//     if (updateError) {
//       console.error("Supabase UPDATE Error:", updateError);
//       return NextResponse.json({ error: "update error" }, { status: 500 });
//     }

//     // Reindex positions so ordering is consistent
//     await reindexPositions(supabase, companyId);

//     return NextResponse.json(updateData, { status: 200 });
//   } catch (err) {
//     console.error("PUT error:", err);
//     return NextResponse.json({ error: "server error" }, { status: 500 });
//   }
// }

// /* ------------------------- DELETE -------------------------
//  Expected body JSON:
//  { "id": "<section-id>" }
// -------------------------------------------------------------- */
// export async function DELETE(req: Request, ctx: CtxParams) {
//   try {
//     const { companyId } = await ctx.params;
//     const body = await req.json();

//     if (!companyId) return NextResponse.json({ error: "missing companyId" }, { status: 400 });

//     const { id } = body;
//     if (!id) return NextResponse.json({ error: "missing section id" }, { status: 400 });

//     const supabase = supabaseServer();

//     // Optionally: fetch the row (to check existence)
//     const { data: existing } = await supabase.from("company_sections").select("id").eq("id", id).single();
//     if (!existing) return NextResponse.json({ error: "section not found" }, { status: 404 });

//     const { error: delError } = await supabase.from("company_sections").delete().eq("id", id);

//     if (delError) {
//       console.error("Supabase DELETE Error:", delError);
//       return NextResponse.json({ error: "delete error" }, { status: 500 });
//     }

//     // Reindex positions after deletion
//     await reindexPositions(supabase, companyId);

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (err) {
//     console.error("DELETE error:", err);
//     return NextResponse.json({ error: "server error" }, { status: 500 });
//   }
// }

// UPDATED API ROUTE WITH FIXED section_id HANDLING

// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/app/lib/supabase";

// type CtxParams = { params: Promise<{ companyId: string }> };

// // Helper: reindex positions
// async function reindexPositions(supabase: any, companyId: string) {
//   const { data: sections } = await supabase
//     .from("company_sections")
//     .select("id")
//     .eq("company_id", companyId)
//     .order("position", { ascending: true });

//   if (!sections) return;

//   for (let i = 0; i < sections.length; i++) {
//     await supabase
//       .from("company_sections")
//       .update({ position: i + 1 })
//       .eq("id", sections[i].id);
//   }
// }

// /* ------------------------- GET ------------------------- */
// export async function GET(req: Request, ctx: CtxParams) {
//   try {
//     const { companyId } = await ctx.params;
//     const supabase = supabaseServer();

//     const { data, error } = await supabase
//       .from("company_sections")
//       .select("*")
//       .eq("company_id", companyId)
//       .order("position", { ascending: true });

//     if (error) return NextResponse.json({ error }, { status: 500 });

//     return NextResponse.json(data || [], { status: 200 });
//   } catch (err) {
//     return NextResponse.json({ error: "server error" }, { status: 500 });
//   }
// }

// /* ------------------------- POST (CREATE) ------------------------- */
// export async function POST(req: Request, ctx: CtxParams) {
//   try {
//     const { companyId } = await ctx.params;
//     const body = await req.json();

//     const { section_id, type, title, content, position, bg_color } = body;

//     if (!section_id)
//       return NextResponse.json(
//         { error: "section_id is required" },
//         { status: 400 }
//       );

//     const supabase = supabaseServer();

//     // Compute position if missing
//     let finalPos = position;
//     if (!finalPos) {
//       const { count } = await supabase
//         .from("company_sections")
//         .select("id", { count: "exact", head: true });
//       finalPos = (count ?? 0) + 1;
//     }

//     const { data, error } = await supabase
//       .from("company_sections")
//       .insert([
//         {
//           company_id: companyId,
//           section_id, // REQUIRED
//           type,
//           title,
//           content,
//           position: finalPos,
//           bg_color: bg_color ?? "#ffffff",
//           created_at: new Date().toISOString(),
//         },
//       ])
//       .select()
//       .single();

//     if (error) return NextResponse.json({ error }, { status: 500 });

//     await reindexPositions(supabase, companyId);

//     return NextResponse.json(data, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ error: "server error" }, { status: 500 });
//   }
// }

// /* ------------------------- PUT (UPDATE) ------------------------- */
// export async function PUT(req: Request, ctx: CtxParams) {
//   try {
//     const { companyId } = await ctx.params;
//     const body = await req.json();

//     const { id, type, title, content, position, section_id } = body;

//     if (!id)
//       return NextResponse.json({ error: "missing id" }, { status: 400 });

//     const supabase = supabaseServer();

//     const updatePayload: any = {};

//     // KEEP DB CONSISTENT
//     if (type !== undefined) {
//       updatePayload.type = type;
//       updatePayload.section_id = type;
//     }

//     if (section_id !== undefined) updatePayload.section_id = section_id;
//     if (title !== undefined) updatePayload.title = title;
//     if (content !== undefined) updatePayload.content = content;
//     if (position !== undefined) updatePayload.position = position;

//     const { data, error } = await supabase
//       .from("company_sections")
//       .update(updatePayload)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) return NextResponse.json({ error }, { status: 500 });

//     await reindexPositions(supabase, companyId);

//     return NextResponse.json(data, { status: 200 });
//   } catch (err) {
//     return NextResponse.json({ error: "server error" }, { status: 500 });
//   }
// }

// /* ------------------------- DELETE ------------------------- */
// export async function DELETE(req: Request, ctx: CtxParams) {
//   try {
//     const { companyId } = await ctx.params;
//     const body = await req.json();

//     const { id } = body;
//     if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

//     const supabase = supabaseServer();

//     const { error } = await supabase
//       .from("company_sections")
//       .delete()
//       .eq("id", id);

//     if (error) return NextResponse.json({ error }, { status: 500 });

//     await reindexPositions(supabase, companyId);

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (err) {
//     return NextResponse.json({ error: "server error" }, { status: 500 });
//   }
// }


// UPDATED API ROUTE WITH FIXED section_id HANDLING

import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

type CtxParams = { params: Promise<{ companyId: string }> };

// Helper: reindex positions
async function reindexPositions(supabase: any, companyId: string) {
  const { data: sections } = await supabase
    .from("company_sections")
    .select("id")
    .eq("company_id", companyId)
    .order("position", { ascending: true });

  if (!sections) return;

  for (let i = 0; i < sections.length; i++) {
    await supabase
      .from("company_sections")
      .update({ position: i + 1 })
      .eq("id", sections[i].id);
  }
}

/* ------------------------- GET ------------------------- */
export async function GET(req: Request, ctx: CtxParams) {
  try {
    const { companyId } = await ctx.params;
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from("company_sections")
      .select("*")
      .eq("company_id", companyId)
      .order("position", { ascending: true });

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(data || [], { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

/* ------------------------- POST (CREATE) ------------------------- */
export async function POST(req: Request, ctx: CtxParams) {
  try {
    const { companyId } = await ctx.params;
    const body = await req.json();

    const { section_id, type, title, content, position, bg_color } = body;

    if (!section_id)
      return NextResponse.json(
        { error: "section_id is required" },
        { status: 400 }
      );

    const supabase = supabaseServer();

    // Compute position if missing
    let finalPos = position;
    if (!finalPos) {
      const { count } = await supabase
        .from("company_sections")
        .select("id", { count: "exact", head: true });
      finalPos = (count ?? 0) + 1;
    }

    const { data, error } = await supabase
      .from("company_sections")
      .insert([
        {
          company_id: companyId,
          section_id, // REQUIRED
          type,
          title,
          content,
          position: finalPos,
          bg_color: bg_color ?? "#ffffff",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) return NextResponse.json({ error }, { status: 500 });

    await reindexPositions(supabase, companyId);

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

/* ------------------------- PUT (UPDATE) ------------------------- */
export async function PUT(req: Request, ctx: CtxParams) {
  try {
    const { companyId } = await ctx.params;
    const body = await req.json();

    const { id, type, title, content, position, section_id } = body;

    if (!id)
      return NextResponse.json({ error: "missing id" }, { status: 400 });

    const supabase = supabaseServer();

    const updatePayload: any = {};

    // KEEP DB CONSISTENT
    if (type !== undefined) {
      updatePayload.type = type;
      updatePayload.section_id = type;
    }

    if (section_id !== undefined) updatePayload.section_id = section_id;
    if (title !== undefined) updatePayload.title = title;
    if (content !== undefined) updatePayload.content = content;
    if (position !== undefined) updatePayload.position = position;

    const { data, error } = await supabase
      .from("company_sections")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error }, { status: 500 });

    await reindexPositions(supabase, companyId);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

/* ------------------------- DELETE ------------------------- */
export async function DELETE(req: Request, ctx: CtxParams) {
  try {
    const { companyId } = await ctx.params;
    const body = await req.json();

    const { id } = body;
    if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

    const supabase = supabaseServer();

    const { error } = await supabase
      .from("company_sections")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error }, { status: 500 });

    await reindexPositions(supabase, companyId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
