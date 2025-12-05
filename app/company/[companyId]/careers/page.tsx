"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import JobCard from "@/app/components/JobCard";
import { Search } from "lucide-react";

export default function CareersPage() {
  const { companyId } = useParams();

  const [jobs, setJobs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    department: "",
    experience_level: "",
    work_policy: "",
    job_type: "",
  });
  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);
  const perPage = 10;

  // Fetch jobs
  useEffect(() => {
    async function loadJobs() {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    }
    loadJobs();
  }, []);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
    setPage(1);
  };

  const parseSalary = (range: string) => {
    if (!range) return 0;
    const match = range.match(/(\d+)[^\d]+(\d+)/);
    if (!match) return 0;
    return (parseInt(match[1]) + parseInt(match[2])) / 2;
  };

  const experienceMap: Record<string, number> = {
    Intern: 1,
    Junior: 2,
    Mid: 3,
    Senior: 4,
    Lead: 5,
  };

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase()) ||
        job.department.toLowerCase().includes(query.toLowerCase());

      const matchesLocation = !filters.location || job.location === filters.location;
      const matchesDepartment = !filters.department || job.department === filters.department;
      const matchesExperience = !filters.experience_level || job.experience_level === filters.experience_level;
      const matchesPolicy = !filters.work_policy || job.work_policy === filters.work_policy;
      const matchesJobType = !filters.job_type || job.job_type === filters.job_type;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesDepartment &&
        matchesExperience &&
        matchesPolicy &&
        matchesJobType
      );
    });

    // Sorting
    result = result.sort((a, b) => {
      if (sortBy === "newest") return a.posted_days_ago - b.posted_days_ago;
      if (sortBy === "salary") return parseSalary(b.salary_range) - parseSalary(a.salary_range);
      if (sortBy === "experience")
        return (experienceMap[b.experience_level] || 0) -
               (experienceMap[a.experience_level] || 0);
      return 0;
    });

    return result;
  }, [jobs, query, filters, sortBy]);

  const paginatedJobs = filteredJobs.slice(0, page * perPage);

  return (
    <>
      {/* NAVBAR */}
      <Navbar
        sections={[
          { id: "intro", label: "Intro" },
          { id: "about", label: "About Us" },
          { id: "culture", label: "Culture" },
          { id: "employeeVoice", label: "Employee Voice" },
          { id: "careers", label: "Careers" },
        ]}
        activeSection="careers"
        companyId={companyId as string}
      />

      {/* HERO HEADER */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16 mt-16">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold mb-3">Join Our Team</h1>
          <p className="text-lg text-blue-100">
            Explore roles where you can grow, innovate, and build the future with us.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4 flex gap-10">

        {/* LEFT FILTER PANEL */}
        <div className="w-1/4 hidden lg:block sticky top-28 h-fit bg-white shadow-md rounded-xl p-5 border">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          <div className="flex flex-col gap-4">
            <select className="filter-select" onChange={(e) => updateFilter("location", e.target.value)}>
              <option value="">Location</option>
              {Array.from(new Set(jobs.map((j) => j.location))).map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>

            <select className="filter-select" onChange={(e) => updateFilter("department", e.target.value)}>
              <option value="">Department</option>
              {Array.from(new Set(jobs.map((j) => j.department))).map((dep) => (
                <option key={dep}>{dep}</option>
              ))}
            </select>

            <select className="filter-select" onChange={(e) => updateFilter("experience_level", e.target.value)}>
              <option value="">Experience Level</option>
              {Array.from(new Set(jobs.map((j) => j.experience_level))).map((exp) => (
                <option key={exp}>{exp}</option>
              ))}
            </select>

            <select className="filter-select" onChange={(e) => updateFilter("work_policy", e.target.value)}>
              <option value="">Work Policy</option>
              {Array.from(new Set(jobs.map((j) => j.work_policy))).map((wp) => (
                <option key={wp}>{wp}</option>
              ))}
            </select>

            <select className="filter-select" onChange={(e) => updateFilter("job_type", e.target.value)}>
              <option value="">Job Type</option>
              {Array.from(new Set(jobs.map((j) => j.job_type))).map((jt) => (
                <option key={jt}>{jt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1">

          {/* SEARCH BAR */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search job title, department or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 p-3 border rounded-xl shadow-sm"
            />
          </div>

          {/* SORT ROW */}
          <div className="flex justify-end mb-4">
            <select
              className="p-2 border rounded-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="salary">Highest Salary</option>
              <option value="experience">Experience Level</option>
            </select>
          </div>

          {/* FILTER CHIPS */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(filters).map(([key, value]) =>
              value ? (
                <span
                  key={key}
                  onClick={() => removeFilter(key)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full cursor-pointer text-sm"
                >
                  {key.replace("_", " ")}: {value} ✕
                </span>
              ) : null
            )}
          </div>

          {/* JOB LIST */}
          {paginatedJobs.length > 0 ? (
            <div className="flex flex-col gap-6">
              {paginatedJobs.map((job, index) => (
                <JobCard key={index} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg mt-10">No jobs found.</p>
          )}

          {/* LOAD MORE */}
          {paginatedJobs.length < filteredJobs.length && (
            <button
              onClick={() => setPage(page + 1)}
              className="mt-10 mx-auto block px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md"
            >
              Load More Jobs
            </button>
          )}
        </div>
      </div>
    </>
  );
}
