// app/company/[companyId]/components/JobCard.tsx

import { ArrowRight } from "lucide-react";

export default function JobCard({ job }: any) {
  return (
    <div className="p-6 rounded-3xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition">
      {/* Job Title */}
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
        {job.title}
      </h2>

      {/* Job Information Grid */}
      <div className="grid grid-cols-2 gap-3 text-gray-700 text-md">

        <p><strong>Work Policy:</strong> {job.work_policy}</p>
        <p><strong>Location:</strong> {job.location}</p>

        <p><strong>Department:</strong> {job.department}</p>
        <p><strong>Employment Type:</strong> {job.employment_type}</p>

        <p><strong>Experience Level:</strong> {job.experience_level}</p>
        <p><strong>Job Type:</strong> {job.job_type}</p>

        <p><strong>Salary Range:</strong> {job.salary_range}</p>
        <p><strong>Slug:</strong> {job.job_slug}</p>
      </div>

      {/* Posted info */}
      <p className="mt-4 text-gray-500 text-sm">
        Posted {job.posted_days_ago} days ago
      </p>

      {/* APPLY BUTTON */}
      <div className="flex justify-end">
        <button
          className="
            mt-6 w-[150px]
            bg-gradient-to-r from-blue-600 to-blue-500
            hover:from-blue-700 hover:to-blue-600
            text-white py-3 rounded-2xl font-semibold
            flex items-center justify-center gap-2
            shadow-md hover:shadow-lg transition
          "
          onClick={() => console.log(`Apply to ${job.title}`)}
        >
          Apply Now
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}
