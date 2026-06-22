import pool from "@/lib/db";

export type AdminDashboardData = {
  metrics: {
    label: string;
    value: number;
    tone: "green" | "gold" | "blue" | "neutral";
  }[];
  recentContacts: {
    id: string;
    full_name: string;
    email: string;
    subject: string;
    status: string;
    created_at: string;
  }[];
  recentApplications: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
    created_at: string;
    job_title: string | null;
  }[];
};

async function count(sql: string) {
  const res = await pool.query<{ total: string }>(sql);
  return Number(res.rows[0]?.total ?? 0);
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const [
      activeHeroSlides,
      galleryItems,
      openJobs,
      unreadContacts,
      pendingApplications,
      recentContacts,
      recentApplications,
    ] = await Promise.all([
      count("SELECT COUNT(*) AS total FROM hero_slides WHERE is_active = TRUE"),
      count("SELECT COUNT(*) AS total FROM gallery_items WHERE is_active = TRUE"),
      count("SELECT COUNT(*) AS total FROM job_openings WHERE is_active = TRUE"),
      count("SELECT COUNT(*) AS total FROM contact_submissions WHERE status IN ('new', 'read')"),
      count("SELECT COUNT(*) AS total FROM job_applications WHERE status IN ('submitted', 'under_review', 'shortlisted')"),
      pool.query(`
        SELECT id, full_name, email, subject, status, submitted_at AS created_at
        FROM contact_submissions
        ORDER BY submitted_at DESC
        LIMIT 5
      `),
      pool.query(`
        SELECT a.id, a.first_name, a.last_name, a.email, a.status, a.submitted_at AS created_at, j.title AS job_title
        FROM job_applications a
        LEFT JOIN job_openings j ON j.id = a.job_id
        ORDER BY a.submitted_at DESC
        LIMIT 5
      `),
    ]);

    return {
      metrics: [
        { label: "Active hero slides", value: activeHeroSlides, tone: "green" },
        { label: "Gallery items", value: galleryItems, tone: "blue" },
        { label: "Open jobs", value: openJobs, tone: "gold" },
        { label: "Contact inbox", value: unreadContacts, tone: "neutral" },
        { label: "Hiring pipeline", value: pendingApplications, tone: "green" },
      ],
      recentContacts: recentContacts.rows,
      recentApplications: recentApplications.rows,
    };
  } catch (error) {
    console.error("[admin dashboard]", error);
    return {
      metrics: [
        { label: "Active hero slides", value: 0, tone: "green" },
        { label: "Gallery items", value: 0, tone: "blue" },
        { label: "Open jobs", value: 0, tone: "gold" },
        { label: "Contact inbox", value: 0, tone: "neutral" },
        { label: "Hiring pipeline", value: 0, tone: "green" },
      ],
      recentContacts: [],
      recentApplications: [],
    };
  }
}
