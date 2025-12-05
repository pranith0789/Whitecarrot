"use client";

import { useEffect, useState } from "react";
import JobCard from "@/app/components/JobCard";
import SectionWrapper from "@/app/components/SectionWrapper";
import Navbar from '@/app/components/Navbar'
export default function Careers() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function loadJobs() {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      console.log("Jobs received:", data.jobs);
      setJobs(data.jobs || []);
    }
    loadJobs();
  }, []);

  return (
    <SectionWrapper id="careers" className="min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Careers</h1>

      <div className="flex flex-col gap-6">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))
        ) : (
          <p className="text-center text-gray-500">Loading jobs...</p>
        )}
      </div>
    </SectionWrapper>
  );
}
