export async function fetchTemplates() {
  const res = await fetch("/api/template");
  if (!res.ok) throw new Error("Failed to load templates");
  return res.json();
}

export async function fetchTemplateFields(templateId: string) {
  const res = await fetch(`/api/template/${templateId}/fields`);
  if (!res.ok) throw new Error("Failed to load template fields");
  return res.json();
}
