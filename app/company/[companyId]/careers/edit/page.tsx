"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";

type Job = {
  id?: string;
  company_id: string;
  title: string;
  work_policy: string;
  location: string;
  department: string;
  employment_type: string;
  experience_level: string;
  job_type: string;
  salary_range: string;
  job_slug: string;
  posted_days_ago: number;
  position?: number | null;
  created_at?:string
};

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.companyId as string;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // LEFT PANEL PAGINATION
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedJobs = jobs.slice(start, end);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  // Load jobs
async function loadJobs() {
  setLoading(true);
  try {
    const res = await fetch(`/api/jobs`);
    const list: Job[] = await res.json();

    // Sort: newest first
    const sorted = list.sort((a, b) => {
      // If created_at exists → use it
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      // Fallback: Sort by id (newer UUIDs tend to be higher)
      if (a.id && b.id) return b.id.localeCompare(a.id);

      return 0;
    });

    setJobs(sorted);
    setSelectedJob(sorted[0] ?? null);

  } catch (err) {
    console.error("Failed to load jobs", err);
    alert("Failed to load jobs");
  }

  setLoading(false);
}


  useEffect(() => {
    loadJobs();
  }, []);

  // Create job
  async function handleCreateJob() {
    setCreating(true);
    try {
      const newJob = {
        company_id: companyId,
        title: "New Job Title",
        work_policy: "Remote",
        location: "",
        department: "",
        employment_type: "Full time",
        experience_level: "Junior",
        job_type: "Permanent",
        salary_range: "",
        job_slug: `new-job-${Date.now()}`,
        posted_days_ago: 0,
        position: jobs.length + 1,
      };

      const res = await fetch(`/api/jobs`, {
        method: "POST",
        body: JSON.stringify(newJob),
        headers: { "Content-Type": "application/json" },
      });

      const created = await res.json();
      setJobs((prev) => [...prev, created.job]);
      setSelectedJob(created.job);
    } catch (err) {
      alert("Create job failed");
    }
    setCreating(false);
  }

  // Save job
  async function handleSaveJob(job: Job) {
    setSaving(true);
    try {
      await fetch(`/api/jobs/${job.id}`, {
        method: "PUT",
        body: JSON.stringify(job),
        headers: { "Content-Type": "application/json" },
      });

      setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
    } catch (err) {
      alert("Save failed");
      console.error(err);
    }
    setSaving(false);
  }

  // Delete job
  async function handleDeleteJob(id?: string) {
    if (!id || !confirm("Delete this job?")) return;

    const prev = jobs;
    setJobs((p) => p.filter((j) => j.id !== id));

    try {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    } catch (err) {
      alert("Delete failed");
      setJobs(prev);
    }
  }

  // Drag drop reorder (within page)
  function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const localList = [...paginatedJobs];
    const [moved] = localList.splice(result.source.index, 1);
    localList.splice(result.destination.index, 0, moved);

    const updated = [...jobs];
    for (let i = 0; i < localList.length; i++) {
      const globalIndex = start + i;
      updated[globalIndex] = { ...localList[i], position: globalIndex + 1 };
    }

    setJobs(updated);
    persistOrder(updated);
  }

  async function persistOrder(list: Job[]) {
    setSaving(true);

    try {
      list.forEach(async (job) => {
        await fetch(`/api/jobs/${job.id}`, {
          method: "PUT",
          body: JSON.stringify({ position: job.position }),
          headers: { "Content-Type": "application/json" },
        });
      });
    } catch (e) {
      alert("Failed to save order");
      loadJobs();
    }

    setSaving(false);
  }

  function patchSelected(patch: Partial<Job>) {
    if (!selectedJob) return;

    const updated = { ...selectedJob, ...patch };

    setSelectedJob(updated);
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  }

  function slugify(s: string) {
    return s.toLowerCase().replace(/\s+/g, "-");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white border rounded-full shadow hover:bg-gray-100"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-semibold">Careers Editor</h1>
          </div>

          <button
            onClick={handleCreateJob}
            disabled={creating}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
          >
            <PlusCircle size={16} /> Add Job
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PANEL — NOW WITH PAGINATION */}
          <div className="col-span-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-medium mb-3">Open Positions</h2>

              {loading ? (
                <p>Loading…</p>
              ) : (
                <>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="jobs">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {paginatedJobs.map((job, index) => (
                            <Draggable
                              key={job.id}
                              draggableId={job.id!}
                              index={index}
                            >
                              {(prov) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  onClick={() => setSelectedJob(job)}
                                  className={`p-3 border rounded-lg mb-2 cursor-pointer flex justify-between ${
                                    selectedJob?.id === job.id
                                      ? "bg-blue-50 border-blue-400"
                                      : "bg-white"
                                  }`}
                                >
                                  <span>{job.title}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteJob(job.id);
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {/* Pagination Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      ◀ Prev
                    </button>

                    <span>
                      Page {page} / {totalPages}
                    </span>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Next ▶
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT PANEL — No change */}
          <div className="col-span-8">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium mb-4">Job Details</h3>

              {!selectedJob ? (
                <p>Select a job to edit.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Title</label>
                    <input
                      className="border p-2 rounded w-full"
                      value={selectedJob.title}
                      onChange={(e) =>
                        patchSelected({
                          title: e.target.value,
                          job_slug: slugify(e.target.value),
                        })
                      }
                    />

                    <label className="text-sm mt-3 block">Location</label>
                    <input
                      className="border p-2 rounded w-full"
                      value={selectedJob.location}
                      onChange={(e) =>
                        patchSelected({ location: e.target.value })
                      }
                    />

                    <label className="text-sm mt-3 block">Department</label>
                    <input
                      className="border p-2 rounded w-full"
                      value={selectedJob.department}
                      onChange={(e) =>
                        patchSelected({ department: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm">Experience Level</label>
                    <input
                      className="border p-2 rounded w-full"
                      value={selectedJob.experience_level}
                      onChange={(e) =>
                        patchSelected({ experience_level: e.target.value })
                      }
                    />

                    <label className="text-sm mt-3 block">Salary Range</label>
                    <input
                      className="border p-2 rounded w-full"
                      value={selectedJob.salary_range}
                      onChange={(e) =>
                        patchSelected({ salary_range: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {selectedJob && (
                <button
                  onClick={() => handleSaveJob(selectedJob)}
                  disabled={saving}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                >
                  {saving ? "Saving…" : "Save Job"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
