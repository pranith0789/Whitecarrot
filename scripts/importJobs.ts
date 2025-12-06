// scripts/importJobs.ts
import "dotenv/config";
import fs from "fs";
import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function importJobsFromCSV(path = "public/jobs.csv") {
  const rows: any[] = [];

  fs.createReadStream(path)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      console.log("Parsed rows:", rows.length);

      const jobs = rows.map((r) => ({
        title: r.title || null,
        work_policy: r.work_policy || null,
        location: r.location || null,
        department: r.department || null,
        employment_type: r.employment_type || null,
        experience_level: r.experience_level || null,
        job_type: r.job_type || null,
        salary_range: r.salary_range || null,
        job_slug: r.job_slug || null,
        posted_days_ago: Number(r.posted_days_ago || 0),
      }));

      const { error } = await supabase.from("jobs").insert(jobs);

      if (error) {
        console.error("❌ Insert error:", error);
      } else {
        console.log("✅ Imported", jobs.length, "jobs");
      }
    });
}

importJobsFromCSV().catch((err) => console.error(err));
