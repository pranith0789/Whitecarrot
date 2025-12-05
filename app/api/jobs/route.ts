import { NextResponse } from "next/server";

const SHEET_ID = "16HRj1fHXuq10AxU-RtC6Qd1KBODsqvO4J4v3i1qGcD0";
const SHEET_NAME = "Sample Jobs Data"; // <-- change to your tab name
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_NAME}&tqx=out:json`;

export async function GET() {
  try {
    const res = await fetch(URL);
    const text = await res.text();

    // Google Sheets JSON comes wrapped; we must strip prefix + suffix
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rows = json.table.rows.slice(1).map((row: any) => {
      const c = row.c;

      return {
        title: c[0]?.v || "",
        work_policy: c[1]?.v || "",
        location: c[2]?.v || "",
        department: c[3]?.v || "",
        employment_type: c[4]?.v || "",
        experience_level: c[5]?.v || "",
        job_type: c[6]?.v || "",
        salary_range: c[7]?.v || "",
        job_slug: c[8]?.v || "",
        posted_days_ago: c[9]?.v || "",
      };
    });

    return NextResponse.json({ success: true, jobs: rows });
  } catch (error) {
    console.error("Error fetching sheet:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load jobs" },
      { status: 500 }
    );
  }
}
