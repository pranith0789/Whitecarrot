"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import JobCard from "@/app/components/JobCard";

export default function CareersPage() {
  //  const cookieStore = cookies();
  // const supabaseAuth = createClient(cookieStore);

  // const {
  //   data: { user },
  // } = await supabaseAuth.auth.getUser();

  // if (!user) redirect("/auth/login");
  const { companyId } = useParams();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters / Sorting
  const [search, setSearch] = useState("");
  const [workPolicy, setWorkPolicy] = useState("all");
  const [experience, setExperience] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Navbar Sections
  const [navSections, setNavSections] = useState<any[]>([]);

  // Load company sections for navbar
  useEffect(() => {
    async function loadSections() {
      if (!companyId) return;

      const res = await fetch(`/api/company/${companyId}/sections`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const sorted = [...data].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0)
        );

        const normalize = (id: string) =>
          id.toLowerCase().replace(/\s+/g, "-");

        const filtered = sorted
          .filter((s) => s.section_id !== "careers_default")
          .map((s) => ({
            id: normalize(s.section_id),
            label: s.title || s.section_id,
            position: s.position,
          }));

        setNavSections(filtered);
      }
    }

    loadSections();
  }, [companyId]);

  // Pagination (Load More)
  const ITEMS_PER_LOAD = 10;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  // Reset visible count whenever filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [search, workPolicy, experience, sortBy]);

  // Load Jobs
  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/jobs");
      const json = await res.json();

      // FIX: Your API returns an array, not { jobs: [] }
      setJobs(Array.isArray(json) ? json : json.jobs || []);

      setLoading(false);
    }
    load();
  }, []);


  // FILTER + SORT
  const filteredJobs = useMemo(() => {
    let list = [...jobs];

    if (search.trim()) {
      list = list.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (workPolicy !== "all") {
      list = list.filter((job) => job.work_policy === workPolicy);
    }

    if (experience !== "all") {
      list = list.filter((job) => job.experience_level === experience);
    }

    if (sortBy === "newest") {
      list.sort((a, b) => b.posted_days_ago - a.posted_days_ago);
    }
    if (sortBy === "salary") {
      list.sort((a, b) => {
        const salaryA = parseInt(a.salary_range.replace(/\D/g, "")) || 0;
        const salaryB = parseInt(b.salary_range.replace(/\D/g, "")) || 0;
        return salaryB - salaryA;
      });
    }
    if (sortBy === "experience") {
      const order = ["Intern", "Junior", "Mid", "Senior", "Lead"];
      list.sort(
        (a, b) =>
          order.indexOf(a.experience_level) -
          order.indexOf(b.experience_level)
      );
    }

    return list;
  }, [jobs, search, workPolicy, experience, sortBy]);

  // Visible Jobs (Load More)
  const visibleJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  return (
    <>
      {/* NAVBAR */}
      <Navbar
        companyId={companyId as string}
        sections={navSections}
        activeSection="careers"
      />

      <div className="max-w-4xl mx-auto mt-32 px-4 pb-20">
        {/* Invisible anchors for navbar scroll */}
        {navSections.map((sec) => (
          <div key={sec.id} id={sec.id} className="h-0"></div>
        ))}

        <h1 className="text-4xl font-bold mb-6 text-center">
          Open Positions
        </h1>

        {/* FILTER BAR */}
        <div className="bg-white shadow-md p-4 rounded-lg flex flex-wrap gap-4 items-center justify-between">

          <input
            type="text"
            placeholder="Search job title..."
            value={search}
            onChange={(e) => {
              setVisibleCount(ITEMS_PER_LOAD);
              setSearch(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 w-full md:w-64"
          />

          <select
            value={workPolicy}
            onChange={(e) => {
              setVisibleCount(ITEMS_PER_LOAD);
              setWorkPolicy(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 text-md text-bold font-serif"
          >
            <option value="all">Work Policy: None</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>

          <select
            value={experience}
            onChange={(e) => {
              setVisibleCount(ITEMS_PER_LOAD);
              setExperience(e.target.value);
            }}
            className="border rounded-lg px-3 py-2 font-serif text-md"
          >
            <option value="all">Experience: None</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 font-serif"
          >
            <option value="newest">Newest</option>
            <option value="salary">Highest Salary</option>
            <option value="experience">Experience Level</option>
          </select>
        </div>

        {/* JOB LIST */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No jobs match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 mt-10">
            {visibleJobs.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* LOAD MORE BUTTON */}
        {filteredJobs.length > visibleCount && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() =>
                setVisibleCount((prev) => prev + ITEMS_PER_LOAD)
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
            >
              Load More Jobs
            </button>
          </div>
        )}

        {/* END MESSAGE */}
        {filteredJobs.length <= visibleCount && filteredJobs.length > 0 && (
          <p className="text-center text-gray-500 mt-10">
            You've reached the end.
          </p>
        )}
      </div>
    </>
  );
}
