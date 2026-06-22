"use client";
// ─── JoinUsClient.tsx ──────────────────────────────────────────────────────────
// Handles: jobs filtering, department pills, apply modal trigger.
// Pure interactivity layer — all content comes from server props.

import { useState, useTransition, useCallback } from "react";
import dynamic from "next/dynamic";
import styles from "./JoinUs.module.css";
import type { CareersData, CareersConfig, ActiveJobRow } from "@/types/db";

const ApplicationModal = dynamic(() => import("./ApplicationModal"), { ssr: false });

// ══════════════════════════════════════════════════════════════════════════════
// Derived item types — always use API payload shape, never raw DB row types
// ══════════════════════════════════════════════════════════════════════════════
type Job = CareersData["jobs"][number];           // ActiveJobRow (has department_name)
type Department = CareersData["departments"][number];    // Pick — no is_active/created_at etc.
type Value = CareersData["values"][number];
type Benefit = CareersData["benefits"][number];
type Testimonial = CareersData["testimonials"][number];   // Pick — no is_active
type HiringStep = CareersData["hiringProcess"][number];

// ── Config accessor ───────────────────────────────────────────────────────────
// config is Partial<CareersConfig> — every key uses dotted notation
// e.g. "careers.values_heading" not "values_heading" or sections.values_heading
function c(config: CareersData["config"], key: keyof CareersConfig): string {
    return config?.[key] ?? "";
}

// ── Filter constants ──────────────────────────────────────────────────────────
const TYPE_FILTERS = [
    { label: "All Types", value: "" },
    { label: "Full-Time", value: "full_time" },
    { label: "Part-Time", value: "part_time" },
    { label: "Contract", value: "contract" },
    { label: "Internship", value: "internship" },
] as const;

const MODE_FILTERS = [
    { label: "Any Location", value: "" },
    { label: "On-Site", value: "onsite" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
] as const;

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
    full_time: "Full-Time", part_time: "Part-Time",
    contract: "Contract", internship: "Internship",
};
const WORK_MODE_LABELS: Record<string, string> = {
    onsite: "On-Site", remote: "Remote", hybrid: "Hybrid",
};
const EXP_LEVEL_LABELS: Record<string, string> = {
    entry: "Entry Level", mid: "Mid Level", senior: "Senior",
    lead: "Lead", executive: "Executive",
};

// ── Salary formatter ──────────────────────────────────────────────────────────
// was: formatSalary(job: JobOpeningRow) — fine since ActiveJobRow extends it,
//      but typed explicitly as Job for clarity
function formatSalary(job: Job): string | null {
    if (!job.salary_visible || !job.salary_min) return null;
    const fmt = (n: number) =>
        n >= 100000
            ? `₹${(n / 100000).toFixed(1)}L`
            : `₹${n.toLocaleString("en-IN")}`;
    return job.salary_max
        ? `${fmt(job.salary_min)} – ${fmt(job.salary_max)} / yr`
        : `${fmt(job.salary_min)} / yr`;
}

// ── Separator ─────────────────────────────────────────────────────────────────
function FilterSep() {
    return (
        <span style={{
            width: 1, height: "1.5rem",
            background: "rgba(255,255,255,0.1)",
            margin: "0 0.25rem", flexShrink: 0,
        }} />
    );
}

interface Props {
    data: CareersData;
}

// ══════════════════════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════════════════════
export default function JoinUsClient({ data }: Props) {

    const { values, benefits, testimonials, hiringProcess, departments, config } = data;

    const [jobs, setJobs] = useState<CareersData["jobs"]>(data.jobs);
    const [activeDept, setActiveDept] = useState("all");
    const [activeType, setActiveType] = useState("");
    const [activeMode, setActiveMode] = useState("");
    const [isPending, startTransition] = useTransition();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    // ── Job filter fetch ───────────────────────────────────────────────────────
    const fetchJobs = useCallback((dept: string, type: string, mode: string) => {
        startTransition(async () => {
            const params = new URLSearchParams();
            if (dept && dept !== "all") params.set("department", dept);
            if (type) params.set("type", type);
            if (mode) params.set("mode", mode);
            const res = await fetch(`/api/careers/jobs?${params}`);
            const json = await res.json();
            setJobs(json.jobs as ActiveJobRow[]);
        });
    }, []);

    const setDept = (slug: string) => { setActiveDept(slug); fetchJobs(slug, activeType, activeMode); };
    const setType = (t: string) => { setActiveType(t); fetchJobs(activeDept, t, activeMode); };
    const setMode = (m: string) => { setActiveMode(m); fetchJobs(activeDept, activeType, m); };

    return (
        <>
            {/* ══ VALUES ══════════════════════════════════════════════════════════ */}
            <div className={styles.valuesSection}>
                <div className={styles.section} style={{ padding: "0 2rem" }}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.sectionLabel}>Our DNA</p>
                        <h2 className={styles.sectionHeading}>
                            {c(config, "careers.values_heading")}
                        </h2>
                        <p className={styles.sectionSubheading}>
                            {c(config, "careers.values_subheading")}
                        </p>
                    </div>
                </div>
                <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 2rem 4rem" }}>
                    <div className={styles.valuesGrid}>
                        {values.map((v: Value) => (
                            <div key={v.id} className={styles.valueCard}>
                                <span className={styles.valueIcon}>{v.icon}</span>
                                <h3 className={styles.valueTitle}>{v.title}</h3>
                                <p className={styles.valueDesc}>{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <hr className={styles.sectionDivider} />

            {/* ══ BENEFITS ════════════════════════════════════════════════════════ */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Why Join Us</p>
                    <h2 className={styles.sectionHeading}>
                        {c(config, "careers.benefits_heading")}
                    </h2>
                    <p className={styles.sectionSubheading}>
                        {c(config, "careers.benefits_subheading")}
                    </p>
                </div>
                <div className={styles.benefitsGrid}>
                    {benefits.map((b: Benefit) => (
                        <div key={b.id} className={styles.benefitCard}>
                            <span className={styles.benefitIcon}>{b.icon}</span>
                            <h3 className={styles.benefitTitle}>{b.title}</h3>
                            <p className={styles.benefitDesc}>{b.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <hr className={styles.sectionDivider} />

            {/* ══ JOB OPENINGS ════════════════════════════════════════════════════ */}
            <div className={styles.openingsSection} id="openings">
                <div className={styles.openingsInner}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.sectionLabel}>Current Openings</p>
                        <h2 className={styles.sectionHeading}>
                            {c(config, "careers.openings_heading")}
                        </h2>
                        <p className={styles.sectionSubheading}>
                            {c(config, "careers.openings_subheading")}
                        </p>
                    </div>

                    {/* ── Filters ─────────────────────────────────────────────── */}
                    <div className={styles.jobFilters}>
                        <button
                            className={`${styles.filterPill} ${activeDept === "all" ? styles.activePill : ""}`}
                            onClick={() => setDept("all")}
                        >
                            All Departments
                        </button>
                        {departments.map((d: Department) => (
                            <button
                                key={d.id}
                                className={`${styles.filterPill} ${activeDept === d.slug ? styles.activePill : ""}`}
                                onClick={() => setDept(d.slug)}
                            >
                                {d.name}
                            </button>
                        ))}

                        <FilterSep />

                        {TYPE_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                className={`${styles.filterPill} ${activeType === f.value ? styles.activePill : ""}`}
                                onClick={() => setType(f.value)}
                            >
                                {f.label}
                            </button>
                        ))}

                        <FilterSep />

                        {MODE_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                className={`${styles.filterPill} ${activeMode === f.value ? styles.activePill : ""}`}
                                onClick={() => setMode(f.value)}
                            >
                                {f.label}
                            </button>
                        ))}

                        <span
                            style={{
                                marginLeft: "auto", fontSize: "0.75rem",
                                color: "rgba(245,240,232,0.35)", whiteSpace: "nowrap",
                            }}
                            aria-live="polite"
                        >
                            {isPending ? "Filtering…" : `${jobs.length} role${jobs.length !== 1 ? "s" : ""}`}
                        </span>
                    </div>

                    {/* ── Job list ─────────────────────────────────────────────── */}
                    {isPending ? (
                        <div className={styles.jobList}>
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`${styles.skeleton} ${styles.skeletonJobCard}`}
                                    style={{ height: "6rem" }}
                                />
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className={styles.emptyJobs}>
                            <span className={styles.emptyJobsIcon}>🌿</span>
                            No openings match your filters right now. Check back soon or clear the filters.
                        </div>
                    ) : (
                        <div className={styles.jobList} role="list">
                            {jobs.map((job: Job) => (
                                <div key={job.id} className={styles.jobCard} role="listitem">
                                    <div className={styles.jobCardLeft}>
                                        <div className={styles.jobCardTopRow}>
                                            <h3 className={styles.jobTitle}>{job.title}</h3>
                                            {job.is_featured && (
                                                <span className={styles.featuredBadge}>Featured</span>
                                            )}
                                        </div>
                                        <div className={styles.jobMeta}>
                                            <span className={styles.jobMetaItem}>
                                                <svg className={styles.jobMetaIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                                {job.location}
                                            </span>
                                            <span className={styles.jobMetaItem}>
                                                <svg className={styles.jobMetaIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                </svg>
                                                {job.department_name}
                                            </span>
                                            <span className={styles.jobMetaItem}>
                                                {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                                            </span>
                                            <span className={styles.jobMetaItem}>
                                                {WORK_MODE_LABELS[job.work_mode]}
                                            </span>
                                            <span className={styles.jobMetaItem}>
                                                {EXP_LEVEL_LABELS[job.experience_level]}
                                            </span>
                                        </div>
                                        <p className={styles.jobSummary}>{job.summary}</p>
                                        {job.tags.length > 0 && (
                                            <div className={styles.jobTags}>
                                                {job.tags.map((t) => (
                                                    <span key={t} className={styles.jobTag}>{t}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.jobCardRight}>
                                        {formatSalary(job) && (
                                            <span className={styles.jobSalary}>{formatSalary(job)}</span>
                                        )}
                                        <button
                                            className={styles.applyBtn}
                                            onClick={() => setSelectedJob(job)}
                                        >
                                            Apply Now
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <hr className={styles.sectionDivider} />

            {/* ══ HIRING PROCESS ══════════════════════════════════════════════════ */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>The Process</p>
                    <h2 className={styles.sectionHeading}>
                        {c(config, "careers.process_heading")}
                    </h2>
                    <p className={styles.sectionSubheading}>
                        {c(config, "careers.process_subheading")}
                    </p>
                </div>
                <div className={styles.processTrack}>
                    {hiringProcess.map((step: HiringStep) => (
                        <div key={step.id} className={styles.processStep}>
                            <div className={styles.processStepLeft}>
                                <div className={styles.processStepNumber}>{step.step_number}</div>
                            </div>
                            <div className={styles.processStepRight}>
                                <h3 className={styles.processStepTitle}>{step.title}</h3>
                                <p className={styles.processStepDesc}>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <hr className={styles.sectionDivider} />

            {/* ══ TESTIMONIALS ════════════════════════════════════════════════════ */}
            <div className={styles.testimonialsSection}>
                <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 2rem" }}>
                    <p className={styles.sectionLabel}>Employee Stories</p>
                    <h2 className={styles.sectionHeading}>
                        {c(config, "careers.testimonials_heading")}
                    </h2>
                </div>
                <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 2rem" }}>
                    <div className={styles.testimonialsGrid}>
                        {testimonials.map((t: Testimonial) => (
                            <div key={t.id} className={styles.testimonialCard}>
                                <span className={styles.testimonialQuoteMark} aria-hidden="true">"</span>
                                <p className={styles.testimonialQuote}>{t.quote}</p>
                                <div className={styles.testimonialAuthor}>
                                    <div className={styles.testimonialAvatar}>
                                        {t.author_avatar_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={t.author_avatar_url}
                                                alt={t.author_name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            t.author_name.split(" ").map((n) => n[0]).slice(0, 2).join("")
                                        )}
                                    </div>
                                    <div>
                                        <p className={styles.testimonialName}>{t.author_name}</p>
                                        <p className={styles.testimonialRole}>{t.author_role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ APPLICATION MODAL ═══════════════════════════════════════════════ */}
            {selectedJob && (
                <ApplicationModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </>
    );
}