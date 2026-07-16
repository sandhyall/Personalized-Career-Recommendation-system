export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
export const ML_URL =
  import.meta.env.VITE_ML_URL || "http://localhost:5002";
export const USER_API = `${API_URL}/user`;

export function getSession() {
  return {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    name: localStorage.getItem("name") || "Student",
  };
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
}

export function isLoggedIn() {
  const { token, userId } = getSession();
  return Boolean(token && userId);
}

export function toCareerSlug(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function fetchLatestRecommendations(userId) {
  const res = await fetch(`${API_URL}/api/history/${userId}`);
  if (!res.ok) throw new Error("Could not load recommendation history");
  const history = await res.json();
  if (!Array.isArray(history) || history.length === 0) return null;
  const latest = history[history.length - 1];
  const data = Array.isArray(latest?.data) ? latest.data : [];
  if (!data.length) return null;
  return { recommendations: data, date: latest.date };
}

export async function fetchProgress(userId) {
  const res = await fetch(`${API_URL}/api/progress/${userId}`);
  if (!res.ok) throw new Error("Could not load progress");
  return res.json();
}

export async function updateSkillsApi(userId, slug, completedSkills) {
  const res = await fetch(`${API_URL}/api/progress/skills`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, slug, completedSkills }),
  });
  if (!res.ok) throw new Error("Failed to update skills");
  return res.json();
}

export async function updateResourceApi(userId, slug, resource, completed) {
  const res = await fetch(`${API_URL}/api/progress/resources`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, slug, resource, completed }),
  });
  if (!res.ok) throw new Error("Failed to update resource");
  return res.json();
}

export async function updateChallengeApi(userId, slug, challengeId, completed) {
  const res = await fetch(`${API_URL}/api/progress/challenges`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, slug, challengeId, completed }),
  });
  if (!res.ok) throw new Error("Failed to update challenge");
  return res.json();
}

export async function startProjectApi(userId, slug) {
  const res = await fetch(`${API_URL}/api/progress/project/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, slug }),
  });
  if (!res.ok) throw new Error("Failed to start project");
  return res.json();
}

export async function activateCareerApi(userId, slug) {
  const res = await fetch(`${API_URL}/api/progress/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, slug }),
  });
  if (!res.ok) throw new Error("Failed to activate career");
  return res.json();
}

/** Add / backfill a career on the student path so Mark Done + projects work. */
export async function ensureCareerApi(userId, slug) {
  const res = await fetch(`${API_URL}/api/progress/ensure-career`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, slug }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to open career path");
  return data;
}

export function projectStatusLabel(status) {
  const map = {
    not_started: "Not Started",
    in_progress: "In Progress",
    pending_review: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    completed: "Approved",
  };
  return map[status] || "Not Started";
}

export async function listCareerProjectsApi(userId, slug) {
  const res = await fetch(`${API_URL}/api/projects/student/${userId}/career/${slug}`);
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

export async function listStudentProjectsApi(userId) {
  const res = await fetch(`${API_URL}/api/projects/student/${userId}`);
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

export async function submitProjectApi(formData) {
  const res = await fetch(`${API_URL}/api/projects/submit`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Project submission failed");
  return data;
}

export async function resubmitProjectApi(projectId, formData) {
  const res = await fetch(`${API_URL}/api/projects/${projectId}/resubmit`, {
    method: "PUT",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Resubmit failed");
  return data;
}

export async function adminListProjectsApi(status) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`${API_URL}/api/projects/admin/all${q}`);
  if (!res.ok) throw new Error("Failed to load admin projects");
  return res.json();
}

export async function adminApproveProjectApi(projectId, body = {}) {
  const res = await fetch(`${API_URL}/api/projects/admin/${projectId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Approve failed");
  return data;
}

export async function adminRejectProjectApi(projectId, body = {}) {
  const res = await fetch(`${API_URL}/api/projects/admin/${projectId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Reject failed");
  return data;
}
