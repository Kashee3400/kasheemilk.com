"use client";
// ─── ApplicationModal.tsx ──────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./JoinUs.module.css";
import { JobApplicationInput, JobOpeningRow } from "@/types/db";

interface Props {
    job: JobOpeningRow;
    onClose: () => void;
}

type FieldErrors = Partial<Record<keyof JobApplicationInput | string, string>>;

const HEAR_OPTIONS = [
    "LinkedIn", "Naukri", "Indeed", "Company Website",
    "Employee Referral", "Job Fair", "Other",
];

const NOTICE_OPTIONS = [
    { label: "Immediate", value: "0" },
    { label: "15 days", value: "15" },
    { label: "30 days", value: "30" },
    { label: "60 days", value: "60" },
    { label: "90 days", value: "90" },
];

export default function ApplicationModal({ job, onClose }: Props) {
    const [form, setForm] = useState<Partial<JobApplicationInput>>({ job_id: job.id, salary_currency: "INR" });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [applicationId, setApplicationId] = useState<string>();
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Focus first input on open
    useEffect(() => { firstInputRef.current?.focus(); }, []);

    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    // Escape key
    const handleKey = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    }, [onClose]);
    useEffect(() => {
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [handleKey]);

    const set = (field: keyof JobApplicationInput, value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    };

    const clientValidate = (): FieldErrors => {
        const e: FieldErrors = {};
        if (!form.first_name?.trim()) e.first_name = "Required";
        if (!form.last_name?.trim()) e.last_name = "Required";
        if (!form.email?.trim()) e.email = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
        if (!form.phone?.trim()) e.phone = "Required";
        if (form.total_experience_years === undefined || form.total_experience_years === null)
            e.total_experience_years = "Required";
        if (!form.resume_url?.trim()) e.resume_url = "Please add your resume link or upload URL";
        return e;
    };

    const handleSubmit = async () => {
        const clientErrors = clientValidate();
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            // Scroll to first error
            const firstErrorField = document.querySelector(`.${styles.inputError}`);
            firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/careers/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setApplicationId(data.application_id);
                setSubmitted(true);
            } else if (data.errors) {
                const serverErrors: FieldErrors = {};
                for (const err of data.errors) serverErrors[err.field] = err.message;
                setErrors(serverErrors);
            } else {
                setErrors({ _global: data.message ?? "Something went wrong. Please try again." });
            }
        } catch {
            setErrors({ _global: "Network error. Please check your connection and try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const formatSalaryRange = (job: JobOpeningRow) => {
        if (!job.salary_visible || !job.salary_min) return null;
        const fmt = (n: number) =>
            n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString("en-IN")}`;
        return job.salary_max ? `${fmt(job.salary_min)} – ${fmt(job.salary_max)}` : fmt(job.salary_min);
    };

    return (
        <div
            className={styles.modalBackdrop}
            role="dialog"
            aria-modal="true"
            aria-label={`Apply for ${job.title}`}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className={styles.modal}>

                {/* ── Header ──────────────────────────────────────────────────────── */}
                <div className={styles.modalHeader}>
                    <div>
                        <p className={styles.modalJobTitle}>{job.title}</p>
                        <p className={styles.modalJobDept}>
                            {job.department_id ?? "Kashee Milk"} · {job.location}
                            {formatSalaryRange(job) && ` · ${formatSalaryRange(job)}`}
                        </p>
                    </div>
                    <button className={styles.modalClose} onClick={onClose} aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {submitted ? (
                        /* ── Success ────────────────────────────────────────────────── */
                        <div className={styles.successState}>
                            <div className={styles.successIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#52b788" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3 className={styles.successTitle}>Application Submitted!</h3>
                            <p className={styles.successMessage}>
                                Thanks for applying for <strong>{job.title}</strong>. We have received your application and will be in touch within 5 business days.
                            </p>
                            {applicationId && <p className={styles.successId}>Reference: {applicationId}</p>}
                            <button className={styles.successCloseBtn} onClick={onClose}>Close</button>
                        </div>
                    ) : (
                        /* ── Form ───────────────────────────────────────────────────── */
                        <>
                            {errors._global && (
                                <div style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "#f97316" }}>
                                    {errors._global}
                                </div>
                            )}

                            {/* Personal Information */}
                            <div className={styles.formSection}>
                                <p className={styles.formSectionTitle}>Personal Information</p>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>First Name <span className={styles.required}>*</span></label>
                                        <input ref={firstInputRef} className={`${styles.formInput} ${errors.first_name ? styles.inputError : ""}`}
                                            type="text" placeholder="Priya" value={form.first_name ?? ""}
                                            onChange={(e) => set("first_name", e.target.value)} />
                                        {errors.first_name && <p className={styles.fieldError}>{errors.first_name}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Last Name <span className={styles.required}>*</span></label>
                                        <input className={`${styles.formInput} ${errors.last_name ? styles.inputError : ""}`}
                                            type="text" placeholder="Sharma" value={form.last_name ?? ""}
                                            onChange={(e) => set("last_name", e.target.value)} />
                                        {errors.last_name && <p className={styles.fieldError}>{errors.last_name}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Email Address <span className={styles.required}>*</span></label>
                                        <input className={`${styles.formInput} ${errors.email ? styles.inputError : ""}`}
                                            type="email" placeholder="priya@example.com" value={form.email ?? ""}
                                            onChange={(e) => set("email", e.target.value)} />
                                        {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Phone Number <span className={styles.required}>*</span></label>
                                        <input className={`${styles.formInput} ${errors.phone ? styles.inputError : ""}`}
                                            type="tel" placeholder="+91 98765 43210" value={form.phone ?? ""}
                                            onChange={(e) => set("phone", e.target.value)} />
                                        {errors.phone && <p className={styles.fieldError}>{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Professional Background */}
                            <div className={styles.formSection}>
                                <p className={styles.formSectionTitle}>Professional Background</p>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Current Role</label>
                                        <input className={styles.formInput} type="text" placeholder="e.g. Software Engineer"
                                            value={form.current_job_role ?? ""} onChange={(e) => set("current_job_role", e.target.value)} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Current Company</label>
                                        <input className={styles.formInput} type="text" placeholder="e.g. Infosys"
                                            value={form.current_company ?? ""} onChange={(e) => set("current_company", e.target.value)} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Total Experience (years) <span className={styles.required}>*</span></label>
                                        <input className={`${styles.formInput} ${errors.total_experience_years ? styles.inputError : ""}`}
                                            type="number" min="0" max="50" step="0.5" placeholder="3.5"
                                            value={form.total_experience_years ?? ""}
                                            onChange={(e) => set("total_experience_years", parseFloat(e.target.value) || 0)} />
                                        {errors.total_experience_years && <p className={styles.fieldError}>{errors.total_experience_years}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Notice Period</label>
                                        <select className={styles.formSelect} value={form.notice_period_days ?? ""}
                                            onChange={(e) => set("notice_period_days", e.target.value ? parseInt(e.target.value) : undefined)}>
                                            <option value="">Select notice period</option>
                                            {NOTICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Expected Salary (₹ per annum)</label>
                                        <input className={styles.formInput} type="number" placeholder="1200000"
                                            value={form.expected_salary ?? ""}
                                            onChange={(e) => set("expected_salary", e.target.value ? parseFloat(e.target.value) : undefined)} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Available From</label>
                                        <input className={styles.formInput} type="date"
                                            value={form.available_from ?? ""}
                                            onChange={(e) => set("available_from", e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            {/* Resume & Links */}
                            <div className={styles.formSection}>
                                <p className={styles.formSectionTitle}>Resume & Links</p>
                                <div className={styles.formRow}>
                                    <div className={`${styles.formGroup} ${styles.formRowFull}`}>
                                        <label className={styles.formLabel}>Resume URL <span className={styles.required}>*</span></label>
                                        <input className={`${styles.formInput} ${errors.resume_url ? styles.inputError : ""}`}
                                            type="url" placeholder="https://drive.google.com/your-resume.pdf"
                                            value={form.resume_url ?? ""}
                                            onChange={(e) => set("resume_url", e.target.value)} />
                                        <p className={styles.formHint}>Upload to Google Drive / Dropbox and paste the shareable link. PDF preferred.</p>
                                        {errors.resume_url && <p className={styles.fieldError}>{errors.resume_url}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>LinkedIn Profile</label>
                                        <input className={`${styles.formInput} ${errors.linkedin_url ? styles.inputError : ""}`}
                                            type="url" placeholder="https://linkedin.com/in/yourname"
                                            value={form.linkedin_url ?? ""}
                                            onChange={(e) => set("linkedin_url", e.target.value)} />
                                        {errors.linkedin_url && <p className={styles.fieldError}>{errors.linkedin_url}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Portfolio / Personal Site</label>
                                        <input className={`${styles.formInput} ${errors.portfolio_url ? styles.inputError : ""}`}
                                            type="url" placeholder="https://yoursite.com"
                                            value={form.portfolio_url ?? ""}
                                            onChange={(e) => set("portfolio_url", e.target.value)} />
                                        {errors.portfolio_url && <p className={styles.fieldError}>{errors.portfolio_url}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>GitHub Profile</label>
                                        <input className={`${styles.formInput} ${errors.github_url ? styles.inputError : ""}`}
                                            type="url" placeholder="https://github.com/yourhandle"
                                            value={form.github_url ?? ""}
                                            onChange={(e) => set("github_url", e.target.value)} />
                                        {errors.github_url && <p className={styles.fieldError}>{errors.github_url}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Questions */}
                            <div className={styles.formSection}>
                                <p className={styles.formSectionTitle}>Additional Questions</p>
                                <div className={styles.formRow}>
                                    <div className={`${styles.formGroup} ${styles.formRowFull}`}>
                                        <label className={styles.formLabel}>Cover Letter <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional, but we read them)</span></label>
                                        <textarea className={styles.formTextarea}
                                            placeholder="Tell us why you want to join Kashee Milk and what makes you a great fit for this role..."
                                            value={form.cover_letter ?? ""}
                                            onChange={(e) => set("cover_letter", e.target.value)}
                                            rows={5} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>How did you hear about us?</label>
                                        <select className={styles.formSelect} value={form.how_did_you_hear ?? ""}
                                            onChange={(e) => set("how_did_you_hear", e.target.value)}>
                                            <option value="">Select an option</option>
                                            {HEAR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup} style={{ justifyContent: "flex-end" }}>
                                        <div className={styles.checkboxGroup} style={{ marginTop: "auto", paddingBottom: "0.5rem" }}>
                                            <input id="relocate" type="checkbox" className={styles.formCheckbox}
                                                checked={form.willing_to_relocate ?? false}
                                                onChange={(e) => set("willing_to_relocate", e.target.checked)} />
                                            <label htmlFor="relocate" className={styles.checkboxLabel}>
                                                I am willing to relocate if required
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className={styles.formSubmitRow}>
                                <p className={styles.formPrivacyNote}>
                                    Your information is kept strictly confidential and used only for this application.
                                </p>
                                <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                                    {submitting ? (
                                        <><span className={styles.submitBtnSpinner} /> Submitting…</>
                                    ) : (
                                        <>Submit Application
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}