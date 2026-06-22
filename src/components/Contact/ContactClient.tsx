"use client";
// ─── ContactClient.tsx ─────────────────────────────────────────────────────────
// Handles: office tab switching, contact form, FAQ accordion, WhatsApp float.
// All copy, flags, offices, hours, social come from server props — zero hardcode.

import { useState } from "react";
import Link from "next/link";
import styles from "./Contact.module.css";

import { Icons, SOCIAL_ICONS } from '../ui/icons';
import { ContactData, ContactSubject, ContactSubmissionInput } from "@/types/db";

const SUBJECT_OPTIONS: { value: ContactSubject; label: string }[] = [
  { value: "general", label: "General Enquiry" },
  { value: "product_query", label: "Product Query" },
  { value: "complaint", label: "Complaint" },
  { value: "partnership", label: "Partnership" },
  { value: "media", label: "Media / Press" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Other" },
];

type FieldErrors = Partial<Record<keyof ContactSubmissionInput | "_global", string>>;

// ── Component ──────────────────────────────────────────────────────────────────
export default function ContactClient({ data }: { data: ContactData }) {
  const { featureFlags: flags, config, offices, officeHours, socialLinks, faqItems } = data;

  // Active office tab (multi-office mode)
  const [activeOfficeId, setActiveOfficeId] = useState(
    offices.find((o) => o.is_primary)?.id ?? offices[0]?.id ?? ""
  );
  const activeOffice = offices.find((o) => o.id === activeOfficeId) ?? offices[0];

  // Form state
  const [form, setForm] = useState<Partial<ContactSubmissionInput>>({ subject: "general" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState<string>();

  const set = (field: keyof ContactSubmissionInput, value: unknown) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const handleSubmit = async () => {
    // Client-side guard
    const e: FieldErrors = {};
    if (!form.full_name?.trim()) e.full_name = "Required";
    if (!form.email?.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.subject) e.subject = "Required";
    if (!form.message?.trim()) e.message = "Required";
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, office_id: activeOffice?.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionRef(data.submission_id);
        setSubmitted(true);
      } else if (data.errors) {
        const se: FieldErrors = {};
        for (const err of data.errors) se[err.field as keyof ContactSubmissionInput] = err.message;
        setErrors(se);
      } else {
        setErrors({ _global: data.error ?? "Something went wrong." });
      }
    } catch {
      setErrors({ _global: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ══ MAIN BODY ══════════════════════════════════════════════════════ */}
      <div className={styles.contactBody}>
        <div className={styles.contactGrid}>

          {/* ── LEFT: Info panel ─────────────────────────────────────────── */}
          <div className={styles.infoPanel}>
            <div className={styles.infoPanelHeader}>
              <p className={styles.sectionLabel}>{config['contact.page_label']}</p>
              <h2 className={styles.sectionHeading}>{config['contact.info_panel_heading']}</h2>
              <p className={styles.sectionSubheading}>{config['contact.info_panel_subheading']}</p>
            </div>

            {/* Office tabs (only shown when flag + multiple offices) */}
            {flags["contact.multi_office"] && offices.length > 1 && (
              <div className={styles.officeTabs}>
                {offices.map((o) => (
                  <button
                    key={o.id}
                    className={`${styles.officeTab} ${o.id === activeOfficeId ? styles.officeTabActive : ""}`}
                    onClick={() => setActiveOfficeId(o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}

            {/* Info cards */}
            {activeOffice && (
              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}><Icons.MapPin /></div>
                  <div className={styles.infoCardBody}>
                    <p className={styles.infoCardLabel}>Address</p>
                    <p className={styles.infoCardValue}>
                      {activeOffice.address_line1}
                      {activeOffice.address_line2 && <><br />{activeOffice.address_line2}</>}
                      <br />{activeOffice.city}, {activeOffice.state} – {activeOffice.pincode}
                    </p>
                    {activeOffice.map_link_url && (
                      <a href={activeOffice.map_link_url} target="_blank" rel="noopener noreferrer"
                        className={styles.mapOpenLink} style={{ marginTop: "0.35rem" }}>
                        Open in Maps <Icons.ExternalLink />
                      </a>
                    )}
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}><Icons.Phone /></div>
                  <div className={styles.infoCardBody}>
                    <p className={styles.infoCardLabel}>Phone</p>
                    <a href={`tel:${activeOffice.phone.replace(/\s/g, "")}`}
                      className={styles.infoCardLink}>{activeOffice.phone}</a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}><Icons.Mail /></div>
                  <div className={styles.infoCardBody}>
                    <p className={styles.infoCardLabel}>Email</p>
                    <a href={`mailto:${activeOffice.email}`}
                      className={styles.infoCardLink}>{activeOffice.email}</a>
                  </div>
                </div>
              </div>
            )}

            {/* Office hours */}
            {flags["contact.office_hours"] && officeHours.length > 0 && (
              <div className={styles.hoursCard}>
                <p className={styles.hoursTitle}>
                  <Icons.Clock /> &nbsp;{config["contact.hours_heading"]}
                </p>
                {officeHours.map((h) => (
                  <div key={h.id} className={styles.hoursRow}>
                    <span className={styles.hoursDays}>{h.days_label}</span>
                    <span className={h.is_closed ? styles.hoursClosed : styles.hoursTime}>
                      {h.hours_label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Social links */}
            {flags["contact.social_links"] && socialLinks.length > 0 && (
              <div className={styles.socialRow}>
                {socialLinks.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    className={styles.socialBtn}>
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Form panel ─────────────────────────────────────────── */}
          <div className={styles.formPanel}>
            {submitted ? (
              /* Success state */
              <div className={styles.successState}>
                <div className={styles.successIcon}>
                  <Icons.Check />
                </div>
                <h3 className={styles.successTitle}>{config['contact.form_success_heading']}</h3>
                <p className={styles.successBody}>{config['contact.form_success_body']}</p>
                {submissionRef && <span className={styles.successRef}>{submissionRef}</span>}
                <button className={styles.successReset} onClick={() => { setSubmitted(false); setForm({ subject: "general" }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className={styles.formPanelHeader}>
                  <p className={styles.sectionLabel}>{config['contact.page_label']}</p>
                  <h3 className={styles.sectionHeading}>{config['contact.form_heading']}</h3>
                  <p className={styles.sectionSubheading}>{config['contact.form_subheading']}</p>
                </div>

                <div className={styles.formPanelBody}>
                  {errors._global && (
                    <div className={styles.globalError}>{errors._global}</div>
                  )}

                  {/* Row 1: Name + Email */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Full Name<span className={styles.formRequired}>*</span>
                      </label>
                      <input
                        className={`${styles.formInput} ${errors.full_name ? styles.inputError : ""}`}
                        type="text" placeholder="Priya Sharma"
                        value={form.full_name ?? ""}
                        onChange={(e) => set("full_name", e.target.value)}
                      />
                      {errors.full_name && <p className={styles.fieldError}>{errors.full_name}</p>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Email Address<span className={styles.formRequired}>*</span>
                      </label>
                      <input
                        className={`${styles.formInput} ${errors.email ? styles.inputError : ""}`}
                        type="email" placeholder="priya@example.com"
                        value={form.email ?? ""}
                        onChange={(e) => set("email", e.target.value)}
                      />
                      {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
                    </div>
                  </div>

                  {/* Row 2: Phone + Subject */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Phone Number</label>
                      <input
                        className={`${styles.formInput} ${errors.phone ? styles.inputError : ""}`}
                        type="tel" placeholder="+91 98765 43210"
                        value={form.phone ?? ""}
                        onChange={(e) => set("phone", e.target.value)}
                      />
                      {errors.phone && <p className={styles.fieldError}>{errors.phone}</p>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Subject<span className={styles.formRequired}>*</span>
                      </label>
                      <select
                        className={`${styles.formSelect} ${errors.subject ? styles.inputError : ""}`}
                        value={form.subject ?? "general"}
                        onChange={(e) => set("subject", e.target.value as ContactSubject)}
                      >
                        {SUBJECT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      {errors.subject && <p className={styles.fieldError}>{errors.subject}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className={styles.formRow}>
                    <div className={`${styles.formGroup} ${styles.formRowFull}`}>
                      <label className={styles.formLabel}>
                        Message<span className={styles.formRequired}>*</span>
                      </label>
                      <textarea
                        className={`${styles.formTextarea} ${errors.message ? styles.inputError : ""}`}
                        placeholder="How can we help you?"
                        rows={5}
                        value={form.message ?? ""}
                        onChange={(e) => set("message", e.target.value)}
                      />
                      {errors.message && <p className={styles.fieldError}>{errors.message}</p>}
                    </div>
                  </div>

                  {/* Newsletter opt-in */}
                  {flags["contact.newsletter_signup"] && (
                    <div className={styles.checkboxRow}>
                      <input
                        id="newsletter"
                        type="checkbox"
                        className={styles.formCheckbox}
                        checked={form.newsletter_opt_in ?? false}
                        onChange={(e) => set("newsletter_opt_in", e.target.checked)}
                      />
                      <label htmlFor="newsletter" className={styles.checkboxLabel}>
                        Subscribe to Kashee Milk updates — product news, offers, and stories from the farm.
                      </label>
                    </div>
                  )}

                  {/* Footer */}
                  <div className={styles.formFooter}>
                    <p className={styles.formPrivacy}>
                      Your information is kept confidential and never shared with third parties.
                    </p>
                    <button
                      className={styles.submitBtn}
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <><span className={styles.submitSpinner} /> Sending…</>
                      ) : (
                        <>{config['contact.form_submit_label']} <Icons.Arrow /></>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══ MAP ══════════════════════════════════════════════════════════════ */}
      {flags["contact.map"] && activeOffice && (
        <div className={styles.mapSection}>
          <div className={styles.mapContainer}>
            <div className={styles.mapWrapper}>
              {flags["contact.map_interactive"] && activeOffice.map_embed_url ? (
                <iframe
                  className={styles.mapIframe}
                  src={activeOffice.map_embed_url}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${activeOffice.label} location map`}
                  allowFullScreen
                />
              ) : (
                <div className={styles.mapPlaceholder}>
                  <span className={styles.mapPlaceholderIcon}>📍</span>
                  <span>
                    {activeOffice.address_line1}, {activeOffice.city}, {activeOffice.state}
                  </span>
                  {activeOffice.map_link_url && (
                    <a href={activeOffice.map_link_url} target="_blank" rel="noopener noreferrer"
                      className={styles.mapOpenLink}>
                      Open in Google Maps <Icons.ExternalLink />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ FAQ TEASER ═══════════════════════════════════════════════════════ */}
      {flags["contact.faq_teaser"] && faqItems.length > 0 && (
        <>
          <hr className={styles.sectionDivider} />
          <div className={styles.faqSection}>
            <div className={styles.faqInner}>
              <div className={styles.faqHeader}>
                <div>
                  <p className={styles.sectionLabel}>Quick Answers</p>
                  <h2 className={styles.sectionHeading}>{config['contact.faq_heading']}</h2>
                </div>
                <Link href={config["contact.faq_cta_href"] || ""} className={styles.faqCtaLink}>
                  {config["contact.faq_cta_label"]} <Icons.Arrow />
                </Link>
              </div>
              <div className={styles.faqGrid}>
                {faqItems.map((f) => (
                  <div key={f.id} className={styles.faqItem}>
                    <p className={styles.faqQuestion}>{f.question}</p>
                    <p className={styles.faqAnswer}>{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══ WHATSAPP FLOAT ═══════════════════════════════════════════════════ */}
      {flags["contact.whatsapp_cta"] && config["contact.whatsapp_number"] && (
        <a
          href={`https://wa.me/${config["contact.whatsapp_number"].replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappFloat}
          aria-label={config["contact.whatsapp_label"] ?? "Chat on WhatsApp"}
        >
          <Icons.Whatsapp />
          {config["contact.whatsapp_label"] ?? "WhatsApp"}
        </a>
      )}
    </>
  );
}