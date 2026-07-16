import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  CheckSquare,
  ChevronRight,
  Lock,
  Target,
} from "lucide-react";

export function calcJobReadiness(completedSkills, requiredSkills) {
  const required = (requiredSkills || []).map((s) => String(s).trim()).filter(Boolean);
  const completedSet = new Set(
    (completedSkills || []).map((s) => String(s).trim().toLowerCase()).filter(Boolean),
  );

  if (!required.length) {
    return {
      readiness_percentage: 0,
      completed_count: 0,
      total_count: 0,
      missing_skills: [],
      label: "No skills listed",
    };
  }

  const matched = [];
  const missing = [];
  required.forEach((skill) => {
    if (completedSet.has(skill.toLowerCase())) matched.push(skill);
    else missing.push(skill);
  });

  const percentage = Math.round((matched.length / required.length) * 1000) / 10;
  let label = "Not Ready Yet";
  if (percentage >= 90) label = "Highly Job Ready";
  else if (percentage >= 70) label = "Job Ready";
  else if (percentage >= 40) label = "Developing";

  return {
    readiness_percentage: percentage,
    completed_count: matched.length,
    total_count: required.length,
    missing_skills: missing,
    label,
  };
}

export function recommendJobsBySkills(career, selectedSkills, requiredSkills, baseJobs = []) {
  const readiness = calcJobReadiness(selectedSkills, requiredSkills);
  const pct = readiness.readiness_percentage;
  if (pct <= 0 || readiness.completed_count === 0) return [];

  const display = String(career || "Role").trim() || "Role";
  const base = Array.isArray(baseJobs) ? baseJobs : [];
  const out = [];

  if (pct < 60) {
    out.push({
      title: `${display} Intern`,
      company_type: "Startup / Training Program",
      level: "Intern",
      reason: `${readiness.completed_count} skills selected`,
    });
    if (pct >= 35 && base[0]) out.push({ ...base[0], reason: "Skill match" });
  } else if (pct < 85) {
    for (const job of base) {
      const level = String(job.level || "").toLowerCase();
      if (["entry", "intern", "junior"].includes(level)) {
        out.push({ ...job, reason: "Skill match" });
      }
      if (out.length >= 3) break;
    }
    if (!out.length) {
      base.slice(0, 2).forEach((job) => out.push({ ...job, reason: "Skill match" }));
    }
  } else {
    base.slice(0, 3).forEach((job) => out.push({ ...job, reason: "Skill match" }));
  }

  return out.slice(0, 3);
}

const readinessColor = (pct) => {
  if (pct >= 70) return "text-emerald-600";
  if (pct >= 40) return "text-amber-600";
  return "text-rose-600";
};

const readinessBar = (pct) => {
  if (pct >= 70) return "bg-emerald-500";
  if (pct >= 40) return "bg-amber-500";
  return "bg-rose-500";
};

const JobReadinessPanel = ({
  career,
  jobs = [],
  requiredSkills = [],
  pathData,
  compact = false,
  showJobs = false,
  nextUnlocked = false,
  initialSkills = [],
  onSkillsChange,
}) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(initialSkills);

  useEffect(() => {
    setSelected(initialSkills || []);
  }, [initialSkills]);

  const readiness = useMemo(
    () => calcJobReadiness(selected, requiredSkills),
    [selected, requiredSkills],
  );

  const recommendedJobs = useMemo(
    () =>
      showJobs
        ? recommendJobsBySkills(career, selected, requiredSkills, jobs)
        : [],
    [career, selected, requiredSkills, jobs, showJobs],
  );

  const toggleSkill = (skill) => {
    setSelected((prev) => {
      const next = prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill];
      onSkillsChange?.(next);
      return next;
    });
  };

  const steps = pathData?.steps || [];
  const nextSteps = steps.filter((s) => s.clickable);

  return (
    <div className={`space-y-6 ${compact ? "" : "mt-6 pt-6 border-t border-slate-100"}`}>
      <div>
        <div className="flex items-center gap-2 mb-3 text-indigo-600">
          <CheckSquare className="w-4 h-4" />
          <span className="font-bold text-xs uppercase tracking-widest">
            Skills to build
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Tap a skill when you feel comfortable with it. This updates your readiness for{" "}
          <span className="font-semibold text-slate-700">{career}</span>.
        </p>

        {requiredSkills.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No required skills listed.</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {requiredSkills.map((skill) => {
              const on = selected.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    on
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {on ? "✓ " : ""}
                  {skill}
                </button>
              );
            })}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Job readiness
              </span>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black ${readinessColor(readiness.readiness_percentage)}`}>
                {readiness.readiness_percentage}%
              </span>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                {readiness.label}
              </p>
            </div>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${readinessBar(readiness.readiness_percentage)}`}
              style={{ width: `${Math.min(readiness.readiness_percentage, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {readiness.completed_count} of {readiness.total_count} skills completed
          </p>
        </div>
      </div>

      {showJobs && (
        <div>
          <div className="flex items-center gap-2 mb-3 text-indigo-600">
            <Briefcase className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-widest">
              Internship / Job Recommendations
            </span>
          </div>
          {recommendedJobs.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No matches yet.</p>
          ) : (
            <ul className="space-y-2">
              {recommendedJobs.map((job, i) => (
                <li
                  key={`${job.title}-${i}`}
                  className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{job.title}</p>
                    <p className="text-[11px] text-slate-500">{job.company_type}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-md">
                    {job.level}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {nextSteps.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 text-indigo-600">
            <ChevronRight className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-widest">
              Next Career Path
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-500 shadow-sm">
              {pathData?.current || career}
            </span>
            {nextSteps.map((step) => (
              <div key={step.slug} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                {nextUnlocked ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/career/${step.slug}`)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-[11px] font-bold hover:bg-[#2563EB] shadow-md active:scale-95 transition-all"
                  >
                    {step.title}
                  </button>
                ) : (
                  <span
                    className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-md text-[11px] font-bold inline-flex items-center gap-1"
                    title="Unlocks after admin approves your project"
                  >
                    <Lock className="w-3 h-3" />
                    {step.title}
                  </span>
                )}
              </div>
            ))}
          </div>
          {!nextUnlocked && (
            <p className="text-[11px] text-slate-400 mt-2">
              Next path unlocks after Watch Guide, Documentation, skills, challenges, GitHub project, and admin approval.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobReadinessPanel;
