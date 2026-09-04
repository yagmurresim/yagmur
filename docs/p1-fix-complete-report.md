# P1 düzeltme raporu — tam metin

Migration'lar henüz hiçbir veritabanında çalıştırılmadı.
Uygulama sırası (fresh DB, signup kapalı):

1. `001_initial_schema.sql`
2. `002_seed.sql` (programlar)
3. `003_admin_security.sql`
4. `004_singleton_fix.sql` (site_settings + homepage + FAQ seed)
5. `005_policy_refinements.sql`
6. `006_storage_and_constraints.sql`

Sonra:

```sql
INSERT INTO profiles (id, display_name, role)
VALUES ('<auth-user-uuid>', 'Admin', 'admin');
```

---

# A. Kod düzeltmeleri (özet)

| Dosya | Ne değişti |
|---|---|
| `src/server/actions/admin.ts` | boş string → null; UUID/enum/note Zod; lesson_formats enum; tüm ID parse |
| `src/features/admin/ProgramForm.tsx` | format enum client check; SEO maxLength 70/160 |
| `src/features/admin/InstructorForm.tsx` | SEO maxLength 70/160 |
| `src/features/admin/ApplicationActions.tsx` | not maxLength 2000 |
| `src/proxy.ts` | admin login'de panele redirect |
| `src/app/admin/layout.tsx` | çıplak root layout |
| `src/app/admin/(panel)/layout.tsx` | sidebar yalnız panel sayfalarında |
| `eslint.config.mjs` | next/core-web-vitals + typescript |
| `package.json` | `@eslint/eslintrc`; lint = `eslint .` |
| `tsconfig.json` | `.next/dev` exclude |
| `next.config.ts` | storage path `/storage/v1/object/**` |
| KVKK / gizlilik | yer tutucu; "Yasal Sayfalar admin'i" iddiası yok |
| `docs/apply-migrations.md` | apply talimatı |
| `docs/launch-checklist.md` | 001–006 + hukuki engel |

`npm run lint` ve `tsc --noEmit --incremental false` geçiyor.

---

# B. admin.ts (tam)

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ApplicationStatus, SiteSettings } from "@/types";

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const uuidSchema = z.string().uuid();
const applicationStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "INTRO_PLANNED",
  "ENROLLED",
  "CLOSED",
]);
const noteSchema = z.string().trim().min(1).max(2000);
const optionalUrl = z.preprocess(
  emptyToNull,
  z.string().url().nullable().optional()
);
const optionalNullableString = (max: number) =>
  z.preprocess(emptyToNull, z.string().max(max).nullable().optional());

const SiteSettingsSchema = z.object({
  brand_name: z.string().min(1).max(120).optional(),
  legal_name: optionalNullableString(200),
  phone_display: z.string().max(30).optional(),
  phone_e164: z.string().regex(/^\+\d{7,15}$/).optional(),
  whatsapp_e164: z.string().regex(/^\+\d{7,15}$/).optional(),
  instagram_handle: z.string().max(60).optional(),
  address_line: z.string().max(200).optional(),
  district: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  postal_code: optionalNullableString(20),
  maps_url: optionalUrl,
  meb_display_text: z.string().max(200).optional(),
  default_seo_title: optionalNullableString(70),
  default_seo_description: optionalNullableString(160),
  show_instructors: z.boolean().optional(),
  show_gallery: z.boolean().optional(),
  show_events: z.boolean().optional(),
  show_announcements: z.boolean().optional(),
});

const ProgramWriteSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  short_description: z.string().max(300).nullable().optional(),
  intro: z.string().max(2000).nullable().optional(),
  audience_description: z.string().max(500).nullable().optional(),
  minimum_age: z.number().int().min(0).max(100).nullable().optional(),
  maximum_age: z.number().int().min(0).max(100).nullable().optional(),
  lesson_formats: z.array(z.enum(["individual", "group"])).optional(),
  level_information: z.string().max(500).nullable().optional(),
  approach: z.string().max(1000).nullable().optional(),
  learning_outcomes: z.array(z.string()).nullable().optional(),
  duration_text: z.string().max(200).nullable().optional(),
  preparation_information: z.string().max(1000).nullable().optional(),
  certificate_information: z.string().max(500).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  sort_order: z.number().int().min(0).optional(),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(160).nullable().optional(),
});

const FaqWriteSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(3000),
  status: z.enum(["draft", "published"]),
  sort_order: z.number().int().min(0),
});

const InstructorWriteSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().max(200).nullable().optional(),
  short_bio: z.string().max(500).nullable().optional(),
  bio: z.string().max(5000).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]),
  sort_order: z.number().int().min(0),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(160).nullable().optional(),
});

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify the user has admin role in profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");
  return user;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  await requireAdmin();
  const id = uuidSchema.parse(applicationId);
  const parsedStatus = applicationStatusSchema.parse(status);
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .update({ status: parsedStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function addApplicationNote(
  applicationId: string,
  note: string
): Promise<void> {
  const user = await requireAdmin();
  const id = uuidSchema.parse(applicationId);
  const parsedNote = noteSchema.parse(note);
  const supabase = await createClient();

  const { error } = await supabase.from("application_notes").insert({
    application_id: id,
    author_id: user.id,
    note: parsedNote,
  });

  if (error) throw new Error(error.message);
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<void> {
  await requireAdmin();
  const parsed = SiteSettingsSchema.parse(settings);
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("site_settings")
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("site_settings")
      .insert({ ...parsed });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}

export async function updateProgram(
  id: string,
  data: z.infer<typeof ProgramWriteSchema>
): Promise<void> {
  await requireAdmin();
  const programId = uuidSchema.parse(id);
  const parsed = ProgramWriteSchema.parse(data);
  const supabase = await createClient();

  const { error } = await supabase
    .from("programs")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", programId);

  if (error) throw new Error(error.message);
  revalidatePath("/egitimler", "layout");
}

export async function createProgram(
  data: z.infer<typeof ProgramWriteSchema>
): Promise<string> {
  await requireAdmin();
  const parsed = ProgramWriteSchema.parse(data);
  const supabase = await createClient();

  const { data: created, error } = await supabase
    .from("programs")
    .insert(parsed)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/egitimler", "layout");
  return (created as { id: string }).id;
}

export async function upsertFaq(
  data: z.infer<typeof FaqWriteSchema>,
  id?: string
): Promise<void> {
  await requireAdmin();
  const parsed = FaqWriteSchema.parse(data);
  const faqId = id ? uuidSchema.parse(id) : undefined;
  const supabase = await createClient();

  if (faqId) {
    const { error } = await supabase
      .from("faqs")
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq("id", faqId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("faqs").insert(parsed);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/sss", "layout");
}

export async function deleteFaq(id: string): Promise<void> {
  await requireAdmin();
  const faqId = uuidSchema.parse(id);
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", faqId);
  if (error) throw new Error(error.message);
  revalidatePath("/sss", "layout");
}

export async function createFaq(
  data: z.infer<typeof FaqWriteSchema>
): Promise<void> {
  await requireAdmin();
  const parsed = FaqWriteSchema.parse(data);
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").insert(parsed);
  if (error) throw new Error(error.message);
  revalidatePath("/sss", "layout");
}

export async function updateFaq(
  id: string,
  data: z.infer<typeof FaqWriteSchema>
): Promise<void> {
  await requireAdmin();
  const faqId = uuidSchema.parse(id);
  const parsed = FaqWriteSchema.parse(data);
  const supabase = await createClient();
  const { error } = await supabase
    .from("faqs")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", faqId);
  if (error) throw new Error(error.message);
  revalidatePath("/sss", "layout");
}

export async function createInstructor(
  data: z.infer<typeof InstructorWriteSchema>
): Promise<void> {
  await requireAdmin();
  const parsed = InstructorWriteSchema.parse(data);
  const supabase = await createClient();
  const { error } = await supabase.from("instructors").insert(parsed);
  if (error) throw new Error(error.message);
  revalidatePath("/egitmenler", "layout");
}

export async function updateInstructor(
  id: string,
  data: z.infer<typeof InstructorWriteSchema>
): Promise<void> {
  await requireAdmin();
  const instructorId = uuidSchema.parse(id);
  const parsed = InstructorWriteSchema.parse(data);
  const supabase = await createClient();
  const { error } = await supabase
    .from("instructors")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", instructorId);
  if (error) throw new Error(error.message);
  revalidatePath("/egitmenler", "layout");
}

export async function deleteInstructor(id: string): Promise<void> {
  await requireAdmin();
  const instructorId = uuidSchema.parse(id);
  const supabase = await createClient();
  const { error } = await supabase.from("instructors").delete().eq("id", instructorId);
  if (error) throw new Error(error.message);
  revalidatePath("/egitmenler", "layout");
}
```

---

# C. proxy.ts (tam)

```ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== "production" || pathname === "/admin/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname === "/admin/login") {
    if (!user) return response;
    const { data: loginProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (loginProfile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

---

# D. Admin layout'lar

## src/app/admin/layout.tsx

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Yağmur Sanat Yönetim Paneli",
    default: "Yönetim Paneli",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

```

## src/app/admin/(panel)/layout.tsx

```tsx
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/features/admin/AdminSidebar";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout flex">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 min-h-svh lg:ml-64 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

```

---

# E. eslint.config.mjs

```js
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default eslintConfig;

```

---

# F. Migration + seed — TAM METİN

SQL Editor'da her dosyayı ayrı çalıştır. Bir önceki COMMIT olmadan sonrakine geçme.

## 001_initial_schema.sql

```sql
-- ─── 001_initial_schema ───────────────────────────────────────────────────────
-- Apply ONCE on a fresh database. Do not re-run on an existing project:
-- CREATE POLICY statements will collide.
--
-- Fresh install: apply 001 → 002 → 003 → 004 → 005 → 006 in one sitting
-- before enabling signup or deploying the app. Write policies here already
-- require public.is_admin(); 003–005 are idempotent hardenings.
--
-- Existing DB that already ran an older 001: skip this file, apply only
-- the missing forward migrations (003+).

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Admin',
  role TEXT NOT NULL CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;

-- SECURITY DEFINER so it can read profiles even when RLS is on.
-- search_path is pinned to prevent search_path injection.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  );
$$;

-- ─── Site settings (singleton) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT NOT NULL DEFAULT 'Yağmur Sanat Akademisi',
  legal_name TEXT DEFAULT 'Özel Yağmur Sanat Akademisi Kursu',
  phone_display TEXT NOT NULL DEFAULT '0554 595 95 75',
  phone_e164 TEXT NOT NULL DEFAULT '+905545959575',
  whatsapp_e164 TEXT NOT NULL DEFAULT '+905545959575',
  instagram_handle TEXT NOT NULL DEFAULT '@yagmursanatakademi',
  address_line TEXT NOT NULL DEFAULT 'İmbatlı Mahallesi, Yeni Girne No:205/B',
  district TEXT NOT NULL DEFAULT 'Karşıyaka',
  city TEXT NOT NULL DEFAULT 'İzmir',
  postal_code TEXT,
  maps_url TEXT,
  meb_display_text TEXT NOT NULL DEFAULT 'MEB Onaylı Kurs',
  default_seo_title TEXT DEFAULT 'Yağmur Sanat Akademisi | Karşıyaka Resim ve Müzik Kursu',
  default_seo_description TEXT DEFAULT 'Karşıyaka''da resim, piyano, keman ve gitar eğitimi. MEB onaylı kurs. 4 yaştan yetişkinlere.',
  show_instructors BOOLEAN NOT NULL DEFAULT FALSE,
  show_gallery BOOLEAN NOT NULL DEFAULT FALSE,
  show_events BOOLEAN NOT NULL DEFAULT FALSE,
  show_announcements BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "settings_admin_write" ON site_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Homepage content (singleton) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_eyebrow TEXT DEFAULT 'MEB Onaylı Kurs · Karşıyaka, İzmir',
  hero_title TEXT DEFAULT 'Sanatla kendini keşfet.',
  hero_body TEXT DEFAULT 'Resim, piyano, keman ve gitar eğitimleri. 4 yaştan yetişkinlere.',
  primary_cta_label TEXT DEFAULT 'Ücretsiz Tanışma Dersine Başvur',
  secondary_cta_label TEXT DEFAULT 'Eğitimleri Keşfet',
  academy_heading TEXT DEFAULT 'Sanat ve disiplin bir arada.',
  academy_body TEXT DEFAULT '',
  trust_heading TEXT DEFAULT 'Neden Yağmur Sanat?',
  closing_cta_heading TEXT DEFAULT 'İlk adımı atmak çok kolay.',
  closing_cta_body TEXT DEFAULT 'Ücretsiz tanışma dersi için kısa bir form doldurun.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "homepage_public_read" ON homepage_content
  FOR SELECT USING (TRUE);

CREATE POLICY "homepage_admin_write" ON homepage_content
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Programs ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  intro TEXT,
  audience_description TEXT,
  minimum_age INTEGER,
  maximum_age INTEGER,
  lesson_formats TEXT[] NOT NULL DEFAULT '{}'
    CHECK (lesson_formats <@ ARRAY['individual', 'group']::text[]),
  level_information TEXT,
  approach TEXT,
  learning_outcomes TEXT[],
  duration_text TEXT,
  preparation_information TEXT,
  certificate_information TEXT,
  hero_media_id UUID,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  og_media_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "programs_public_read" ON programs
  FOR SELECT USING (status = 'published');

CREATE POLICY "programs_admin_all" ON programs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Instructors ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  short_bio TEXT,
  bio TEXT,
  portrait_media_id UUID,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "instructors_public_read" ON instructors
  FOR SELECT USING (status = 'published');

CREATE POLICY "instructors_admin_all" ON instructors
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Program instructors ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS program_instructors (
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  PRIMARY KEY (program_id, instructor_id)
);

ALTER TABLE program_instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pi_public_read" ON program_instructors
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM programs p WHERE p.id = program_id AND p.status = 'published')
    AND
    EXISTS (SELECT 1 FROM instructors i WHERE i.id = instructor_id AND i.status = 'published')
  );
CREATE POLICY "pi_admin_all" ON program_instructors
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── FAQs ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faqs_public_read" ON faqs
  FOR SELECT USING (status = 'published');

CREATE POLICY "faqs_admin_all" ON faqs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Applications (PRIVATE) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  student_age INTEGER NOT NULL CHECK (student_age >= 4),
  parent_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  current_level TEXT,
  preferred_contact_channel TEXT CHECK (preferred_contact_channel IN ('whatsapp', 'phone')),
  preferred_contact_time TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'INTRO_PLANNED', 'ENROLLED', 'CLOSED')),
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  kvkk_consent BOOLEAN NOT NULL DEFAULT FALSE,
  kvkk_version TEXT NOT NULL DEFAULT '1.0',
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_to UUID REFERENCES auth.users(id),
  last_contacted_at TIMESTAMPTZ,
  next_action_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- NO public read access — only real admins
CREATE POLICY "applications_admin_all" ON applications
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Application notes (PRIVATE) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS application_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_admin_all" ON application_notes
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Contact messages (PRIVATE) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  kvkk_consent BOOLEAN NOT NULL DEFAULT FALSE,
  kvkk_version TEXT NOT NULL DEFAULT '1.0',
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- NO public read access
CREATE POLICY "contact_admin_all" ON contact_messages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Media assets ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  focal_x REAL,
  focal_y REAL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Public-read policy is created at the end of this file, after gallery/events/posts exist.
CREATE POLICY "media_admin_write" ON media_assets
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Gallery items ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
  title TEXT,
  caption TEXT,
  category TEXT NOT NULL DEFAULT 'academy' CHECK (category IN ('academy', 'classroom', 'student_work', 'event')),
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_read" ON gallery_items FOR SELECT USING (status = 'published');
CREATE POLICY "gallery_admin_all" ON gallery_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Events ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  location_text TEXT,
  cover_media_id UUID REFERENCES media_assets(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "events_admin_all" ON events
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Posts (announcements/blog) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_media_id UUID REFERENCES media_assets(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "posts_admin_all" ON posts
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Legal pages ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "legal_public_read" ON legal_pages FOR SELECT USING (status = 'published');
CREATE POLICY "legal_admin_all" ON legal_pages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- media_assets public read — after all referencing tables exist
CREATE POLICY "media_public_read" ON media_assets
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM programs WHERE hero_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM programs WHERE og_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM instructors WHERE portrait_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM gallery_items WHERE media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM events WHERE cover_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM posts WHERE cover_media_id = media_assets.id AND status = 'published')
    OR public.is_admin()
  );
```

## 002_seed.sql

```sql
-- ─── Seed 002: Programs only ──────────────────────────────────────────────────
-- This file was never applied with the older site_settings / homepage / FAQ
-- seed. Those rows now live in 004_singleton_fix.sql (idempotent).
-- Do not re-run 002 on a database that already has these program slugs.

INSERT INTO programs (name, slug, short_description, intro, lesson_formats, status, sort_order,
  seo_title, seo_description, minimum_age, learning_outcomes)
VALUES
(
  'Resim', 'resim-kursu',
  'Gözlem, renk ve anlatım. Grup ortamında yaratıcı gelişim.',
  'Resim eğitiminde öğrenciler yalnızca teknik beceri kazanmaz; görmek, hissetmek ve ifade etmek öğrenir. Akademimizde grup eğitimi formatında yürütülen resim dersleri, her seviyeye ve her yaşa uygundur.',
  ARRAY['group'], 'published', 1,
  'Karşıyaka Resim Kursu | Yağmur Sanat Akademisi',
  'Karşıyaka''da resim kursu. MEB onaylı grup eğitimi. 4 yaştan yetişkinlere. Güzel Sanatlar hazırlık desteği.',
  4, ARRAY['Gözlem ve renk algısı', 'Grup ortamında sanat', 'MEB onaylı sertifika', 'Güzel Sanatlar hazırlık desteği', 'Sergi fırsatları']
),
(
  'Piyano', 'piyano-kursu',
  'Birebir eğitimle nota okumadan yoruma. Disiplin ve müzikalite.',
  'Piyano eğitimi birebir formatında yürütülür. Nota okumadan yoruma, teknikten müzikaliteye uzanan yolculukta her öğrenci kendi temposunda ilerler.',
  ARRAY['individual'], 'published', 2,
  'Karşıyaka Piyano Kursu | Yağmur Sanat Akademisi',
  'Karşıyaka''da piyano kursu. MEB onaylı birebir eğitim. 4 yaştan yetişkinlere. Ücretsiz tanışma dersi.',
  4, ARRAY['Nota okuma ve yazma', 'Birebir kişisel ilgi', 'MEB onaylı sertifika', 'Konser fırsatları']
),
(
  'Keman', 'keman-kursu',
  'Yay tekniğinden ifadeye. Birebir veya grup formatında.',
  'Keman eğitiminde her öğrenci için uygun format seçilir. Birebir veya grup ortamında yay tekniğinden müzikal ifadeye uzanan kapsamlı bir eğitim sunulur.',
  ARRAY['individual', 'group'], 'published', 3,
  'Karşıyaka Keman Kursu | Yağmur Sanat Akademisi',
  'Karşıyaka''da keman kursu. Birebir ve grup formatlarında. MEB onaylı. Ücretsiz tanışma dersi.',
  4, ARRAY['Yay tekniği ve postür', 'Nota okuma', 'MEB onaylı sertifika', 'Konser fırsatları']
),
(
  'Gitar', 'gitar-kursu',
  'Akustikten elektriğe. Birebir veya grup ortamında.',
  'Gitar eğitimi birebir veya grup formatında sunulur. Teknik ve müzikaliteyi bir arada geliştiren kapsamlı bir eğitim programı uygulanmaktadır.',
  ARRAY['individual', 'group'], 'published', 4,
  'Karşıyaka Gitar Kursu | Yağmur Sanat Akademisi',
  'Karşıyaka''da gitar kursu. Birebir ve grup formatlarında. MEB onaylı. Ücretsiz tanışma dersi.',
  4, ARRAY['Parmak tekniği ve akor', 'Ritim ve melodi', 'MEB onaylı sertifika', 'Konser fırsatları']
)
ON CONFLICT (slug) DO NOTHING;
```

## 003_admin_security.sql

```sql
-- ─── Migration 003: Real admin role enforcement ───────────────────────────────
-- Idempotent hardening. Fresh installs already get is_admin() policies from 001;
-- this file still re-asserts them so existing DBs that ran an older 001 catch up.
-- Safe to re-run: uses CREATE OR REPLACE + DROP IF EXISTS.

BEGIN;

-- ─── 1. is_admin() helper ─────────────────────────────────────────────────────
-- SECURITY DEFINER so it can read profiles even when RLS is on.
-- search_path is pinned to prevent search_path injection.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  );
$$;

-- ─── 2. Drop old weak policies ────────────────────────────────────────────────
-- site_settings
DROP POLICY IF EXISTS "settings_admin_write" ON site_settings;
-- homepage_content
DROP POLICY IF EXISTS "homepage_admin_write" ON homepage_content;
-- programs
DROP POLICY IF EXISTS "programs_admin_all" ON programs;
-- instructors
DROP POLICY IF EXISTS "instructors_admin_all" ON instructors;
-- program_instructors
DROP POLICY IF EXISTS "pi_admin_all" ON program_instructors;
-- faqs
DROP POLICY IF EXISTS "faqs_admin_all" ON faqs;
-- applications
DROP POLICY IF EXISTS "applications_admin_all" ON applications;
-- application_notes
DROP POLICY IF EXISTS "notes_admin_all" ON application_notes;
-- contact_messages
DROP POLICY IF EXISTS "contact_admin_all" ON contact_messages;
-- media_assets
DROP POLICY IF EXISTS "media_admin_write" ON media_assets;
DROP POLICY IF EXISTS "media_public_read" ON media_assets;
-- gallery_items
DROP POLICY IF EXISTS "gallery_admin_all" ON gallery_items;
-- events
DROP POLICY IF EXISTS "events_admin_all" ON events;
-- posts
DROP POLICY IF EXISTS "posts_admin_all" ON posts;
-- legal_pages
DROP POLICY IF EXISTS "legal_admin_all" ON legal_pages;
-- profiles
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- ─── 3. Re-create admin policies using is_admin() ─────────────────────────────

-- site_settings: public reads fine, writes need real admin
CREATE POLICY "settings_admin_write" ON site_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- homepage_content
CREATE POLICY "homepage_admin_write" ON homepage_content
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- programs
CREATE POLICY "programs_admin_all" ON programs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- instructors
CREATE POLICY "instructors_admin_all" ON instructors
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- program_instructors: public can read published links; admin can write
DROP POLICY IF EXISTS "pi_public_read" ON program_instructors;
CREATE POLICY "pi_public_read" ON program_instructors
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM programs p WHERE p.id = program_id AND p.status = 'published')
    AND
    EXISTS (SELECT 1 FROM instructors i WHERE i.id = instructor_id AND i.status = 'published')
  );
CREATE POLICY "pi_admin_all" ON program_instructors
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- faqs
CREATE POLICY "faqs_admin_all" ON faqs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- applications: PRIVATE — only real admins
CREATE POLICY "applications_admin_all" ON applications
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- application_notes: PRIVATE
CREATE POLICY "notes_admin_all" ON application_notes
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- contact_messages: PRIVATE
CREATE POLICY "contact_admin_all" ON contact_messages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- media_assets: published-only public read; admin full access
-- Covers all foreign key references to media_assets across the schema.
CREATE POLICY "media_public_read" ON media_assets
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM programs WHERE hero_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM programs WHERE og_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM instructors WHERE portrait_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM gallery_items WHERE media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM events WHERE cover_media_id = media_assets.id AND status = 'published')
    OR EXISTS (SELECT 1 FROM posts WHERE cover_media_id = media_assets.id AND status = 'published')
    OR public.is_admin()
  );
CREATE POLICY "media_admin_write" ON media_assets
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- gallery_items
CREATE POLICY "gallery_admin_all" ON gallery_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- events
CREATE POLICY "events_admin_all" ON events
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- posts
CREATE POLICY "posts_admin_all" ON posts
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- legal_pages
CREATE POLICY "legal_admin_all" ON legal_pages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── 4. profiles: prevent role self-escalation ────────────────────────────────
-- Strategy: allow row-level UPDATE for own row, but revoke column-level UPDATE
-- on everything except display_name. This avoids recursive policy self-reference.
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Revoke all UPDATE on profiles from authenticated users, then re-grant only
-- display_name. This is the correct way to enforce column-level immutability
-- without a self-referencing RLS subquery.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;

-- ─── 5. Enforce role constraints ──────────────────────────────────────────────
-- Only 'admin' is valid — no other roles exist yet.
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin'));

-- Remove dangerous DEFAULT 'admin' — role must be set explicitly on insert.
-- Existing rows are unaffected; future inserts via service_role require role arg.
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

COMMIT;
```

## 004_singleton_fix.sql

```sql
-- ─── Migration 004: Singleton table enforcement + seed idempotency ────────────
-- Safe to re-run on a fresh DB.
-- On an existing DB: if site_settings or homepage_content has >1 rows from a
-- previous seed replay, this migration will RAISE an exception (fail-loud).
-- Manually delete the duplicate rows before re-running.

BEGIN;

-- ─── 0. Preflight: fail-loud before any constraint is added ───────────────────
DO $$
DECLARE
  dup_questions text;
  invalid_apps integer;
  invalid_contacts integer;
BEGIN
  IF (SELECT count(*) FROM site_settings) > 1 THEN
    RAISE EXCEPTION
      'site_settings has % rows — resolve duplicates before applying singleton constraint.',
      (SELECT count(*) FROM site_settings);
  END IF;

  IF (SELECT count(*) FROM homepage_content) > 1 THEN
    RAISE EXCEPTION
      'homepage_content has % rows — resolve duplicates before applying singleton constraint.',
      (SELECT count(*) FROM homepage_content);
  END IF;

  -- Canonical FAQ questions that 002 may have inserted more than once.
  -- Checked by question text so the message still works if seed_key is NULL
  -- (this transaction would roll back any later backfill on failure).
  SELECT string_agg(question, ', ' ORDER BY question)
    INTO dup_questions
  FROM (
    SELECT question
    FROM faqs
    WHERE question IN (
      'Hangi eğitimler veriliyor?',
      'Hangi yaş gruplarına eğitim veriliyor?',
      'Ücretsiz Tanışma Dersi nedir?',
      'Yağmur Sanat Akademisi nerede?',
      'Akademi MEB onaylı mı?',
      'Ders formatları nelerdir?'
    )
    GROUP BY question
    HAVING count(*) > 1
  ) d;

  IF dup_questions IS NOT NULL THEN
    RAISE EXCEPTION
      'Duplicate FAQ rows for: %. Keep one row per question, delete the extras, then re-run.',
      dup_questions;
  END IF;

  SELECT count(*) INTO invalid_apps
    FROM applications WHERE kvkk_consent IS DISTINCT FROM TRUE;
  SELECT count(*) INTO invalid_contacts
    FROM contact_messages WHERE kvkk_consent IS DISTINCT FROM TRUE;

  IF invalid_apps > 0 OR invalid_contacts > 0 THEN
    RAISE EXCEPTION
      'KVKK preflight failed: % applications and % contact_messages have kvkk_consent <> TRUE. Fix those rows before applying CHECK (kvkk_consent = TRUE).',
      invalid_apps, invalid_contacts;
  END IF;
END $$;

-- ─── 1. site_settings singleton constraint ────────────────────────────────────
-- Add a boolean column that can only be TRUE — enforces exactly one row.
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS singleton BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE site_settings
  DROP CONSTRAINT IF EXISTS site_settings_singleton_key;

ALTER TABLE site_settings
  ADD CONSTRAINT site_settings_singleton_key UNIQUE (singleton);

ALTER TABLE site_settings
  DROP CONSTRAINT IF EXISTS site_settings_singleton_check;

ALTER TABLE site_settings
  ADD CONSTRAINT site_settings_singleton_check CHECK (singleton = TRUE);

-- ─── 2. homepage_content singleton constraint ─────────────────────────────────
ALTER TABLE homepage_content
  ADD COLUMN IF NOT EXISTS singleton BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE homepage_content
  DROP CONSTRAINT IF EXISTS homepage_content_singleton_key;

ALTER TABLE homepage_content
  ADD CONSTRAINT homepage_content_singleton_key UNIQUE (singleton);

ALTER TABLE homepage_content
  DROP CONSTRAINT IF EXISTS homepage_content_singleton_check;

ALTER TABLE homepage_content
  ADD CONSTRAINT homepage_content_singleton_check CHECK (singleton = TRUE);

-- ─── 3. Seed site_settings — idempotent via singleton conflict ────────────────
INSERT INTO site_settings (
  singleton,
  brand_name, legal_name, phone_display, phone_e164, whatsapp_e164,
  instagram_handle, address_line, district, city, meb_display_text,
  default_seo_title, default_seo_description
) VALUES (
  TRUE,
  'Yağmur Sanat Akademisi',
  'Özel Yağmur Sanat Akademisi Kursu',
  '0554 595 95 75',
  '+905545959575',
  '+905545959575',
  '@yagmursanatakademi',
  'İmbatlı Mahallesi, Yeni Girne No:205/B',
  'Karşıyaka',
  'İzmir',
  'MEB Onaylı Kurs',
  'Yağmur Sanat Akademisi | Karşıyaka Resim ve Müzik Kursu',
  'Karşıyaka''da resim, piyano, keman ve gitar eğitimi. MEB onaylı kurs. 4 yaştan yetişkinlere.'
)
ON CONFLICT (singleton) DO NOTHING;

-- ─── 4. Seed homepage_content — idempotent ───────────────────────────────────
INSERT INTO homepage_content (
  singleton,
  hero_eyebrow, hero_title, hero_body, primary_cta_label, secondary_cta_label
) VALUES (
  TRUE,
  'MEB Onaylı Kurs · Karşıyaka, İzmir',
  'Sanatla kendini keşfet.',
  'Resim, piyano, keman ve gitar eğitimleri. 4 yaştan yetişkinlere.',
  'Ücretsiz Tanışma Dersine Başvur',
  'Eğitimleri Keşfet'
)
ON CONFLICT (singleton) DO NOTHING;

-- ─── 5. faqs — add seed_key for idempotent seed ─────────────────────────────
-- Step order matters:
--   a) add column (no constraint yet — backfill must run first)
--   b) backfill existing rows by exact question match
--   c) fail-loud if duplicates remain (from repeated 002 runs)
--   d) THEN add UNIQUE constraint — safe because duplicates are gone
--   e) idempotent INSERT for missing canonical rows

ALTER TABLE faqs
  ADD COLUMN IF NOT EXISTS seed_key TEXT;

-- (a) Backfill before adding unique constraint.
-- Each UPDATE only touches rows where seed_key IS NULL, so re-running is safe.
UPDATE faqs SET seed_key = 'faq-egitimler'
  WHERE seed_key IS NULL AND question = 'Hangi eğitimler veriliyor?';
UPDATE faqs SET seed_key = 'faq-yas'
  WHERE seed_key IS NULL AND question = 'Hangi yaş gruplarına eğitim veriliyor?';
UPDATE faqs SET seed_key = 'faq-tanisma'
  WHERE seed_key IS NULL AND question = 'Ücretsiz Tanışma Dersi nedir?';
UPDATE faqs SET seed_key = 'faq-nerede'
  WHERE seed_key IS NULL AND question = 'Yağmur Sanat Akademisi nerede?';
UPDATE faqs SET seed_key = 'faq-meb'
  WHERE seed_key IS NULL AND question = 'Akademi MEB onaylı mı?';
UPDATE faqs SET seed_key = 'faq-format'
  WHERE seed_key IS NULL AND question = 'Ders formatları nelerdir?';

-- (b) Fail-loud BEFORE adding unique constraint.
-- Canonical-question duplicates are already caught in the opening preflight.
-- This second check covers any remaining seed_key collisions after backfill.
DO $$
DECLARE
  dup_keys text;
BEGIN
  SELECT string_agg(seed_key, ', ' ORDER BY seed_key)
    INTO dup_keys
  FROM (
    SELECT seed_key FROM faqs
    WHERE seed_key IS NOT NULL
    GROUP BY seed_key HAVING count(*) > 1
  ) dupes;

  IF dup_keys IS NOT NULL THEN
    RAISE EXCEPTION
      'Duplicate FAQ seed_key values: %. Keep one row per key, delete the extras, then re-run.',
      dup_keys;
  END IF;
END $$;

-- (c) Now safe to add UNIQUE — no duplicates remain.
ALTER TABLE faqs
  DROP CONSTRAINT IF EXISTS faqs_seed_key_unique;

ALTER TABLE faqs
  ADD CONSTRAINT faqs_seed_key_unique UNIQUE (seed_key);

-- Now insert only missing canonical FAQs idempotently.
INSERT INTO faqs (seed_key, question, answer, status, sort_order) VALUES
('faq-egitimler',
 'Hangi eğitimler veriliyor?',
 'Yağmur Sanat Akademisi''nde resim, piyano, keman ve gitar eğitimleri verilmektedir.',
 'published', 1),
('faq-yas',
 'Hangi yaş gruplarına eğitim veriliyor?',
 'Akademimizde 4 yaşından yetişkinlere kadar her yaş grubuna eğitim verilmektedir. Eğitim içeriği ve formatı yaşa ve seviyeye göre uyarlanmaktadır.',
 'published', 2),
('faq-tanisma',
 'Ücretsiz Tanışma Dersi nedir?',
 'Ücretsiz Tanışma Dersi, siz veya çocuğunuzun akademimizi ve eğitim ortamımızı tanıması için sunduğumuz başlangıç fırsatıdır. Bu bir anında rezervasyon sistemi değildir. Başvurunuzdan sonra akademi ekibi sizinle iletişime geçer ve uygun zaman ayarlanır.',
 'published', 3),
('faq-nerede',
 'Yağmur Sanat Akademisi nerede?',
 'Akademimiz İmbatlı Mahallesi, Yeni Girne No:205/B, Karşıyaka / İzmir adresinde bulunmaktadır.',
 'published', 4),
('faq-meb',
 'Akademi MEB onaylı mı?',
 'Evet. Yağmur Sanat Akademisi, Millî Eğitim Bakanlığı onaylı bir kurs olarak faaliyet göstermektedir. Eğitim programları ve sertifikalarımız MEB onaylıdır.',
 'published', 5),
('faq-format',
 'Ders formatları nelerdir?',
 'Resim eğitimi grup formatında verilmektedir. Piyano eğitimi birebir formattadır. Keman ve gitar eğitimleri ise hem birebir hem de grup formatında sunulmaktadır.',
 'published', 6)
ON CONFLICT (seed_key) DO NOTHING;

-- ─── 6. KVKK DB-level constraints ────────────────────────────────────────────
-- Ensure consent is always explicitly TRUE — default FALSE is still useful for
-- the column default, but actual persisted records must have consent.
ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_kvkk_required,
  ADD CONSTRAINT applications_kvkk_required CHECK (kvkk_consent = TRUE);

ALTER TABLE contact_messages
  DROP CONSTRAINT IF EXISTS contact_kvkk_required,
  ADD CONSTRAINT contact_kvkk_required CHECK (kvkk_consent = TRUE);

-- ─── 7. Singleton rows cannot be deleted ─────────────────────────────────────
-- UNIQUE(singleton) + CHECK(singleton = TRUE) only guarantees "at most one
-- row". A trigger is required so the last (only) row cannot be removed.
CREATE OR REPLACE FUNCTION public.prevent_singleton_delete()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  RAISE EXCEPTION '% is a singleton table — the last row cannot be deleted.', TG_TABLE_NAME;
END;
$$;

DROP TRIGGER IF EXISTS site_settings_no_delete ON site_settings;
CREATE TRIGGER site_settings_no_delete
  BEFORE DELETE ON site_settings
  FOR EACH ROW
  EXECUTE PROCEDURE public.prevent_singleton_delete();

DROP TRIGGER IF EXISTS homepage_content_no_delete ON homepage_content;
CREATE TRIGGER homepage_content_no_delete
  BEFORE DELETE ON homepage_content
  FOR EACH ROW
  EXECUTE PROCEDURE public.prevent_singleton_delete();

COMMIT;
```

## 005_policy_refinements.sql

```sql
-- ─── Migration 005: Policy refinements ───────────────────────────────────────
-- Fixes two issues identified after 003/004:
--
-- 1. profiles UPDATE policy used a recursive self-reference (SELECT FROM profiles
--    inside the policy for profiles). Replaced with column-level GRANT so only
--    display_name can be updated by the authenticated user.
--
-- 2. media_assets public SELECT policy was missing two published-content paths:
--    instructors.portrait_media_id and programs.og_media_id.
--
-- Safe to re-run on an existing DB.

BEGIN;

-- ─── 1. profiles: column-level privilege instead of recursive WITH CHECK ──────
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_display_name_only" ON public.profiles;

-- Allow authenticated users to UPDATE their own profile row (any column).
-- Column-level GRANT below restricts which columns are actually writable.
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Remove all UPDATE privileges from authenticated role on profiles,
-- then grant only display_name. This prevents role self-escalation at
-- the database privilege level without any recursive policy logic.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;

-- updated_at is maintained by the application layer (server actions use
-- service-role client which bypasses RLS and column grants).

-- ─── 2. media_assets: add missing published-content asset paths ───────────────
DROP POLICY IF EXISTS "media_public_read" ON media_assets;

CREATE POLICY "media_public_read" ON media_assets
  FOR SELECT USING (
    -- published program hero image
    EXISTS (
      SELECT 1 FROM programs
      WHERE hero_media_id = media_assets.id
        AND status = 'published'
    )
    -- published program OG image
    OR EXISTS (
      SELECT 1 FROM programs
      WHERE og_media_id = media_assets.id
        AND status = 'published'
    )
    -- published gallery item
    OR EXISTS (
      SELECT 1 FROM gallery_items
      WHERE media_id = media_assets.id
        AND status = 'published'
    )
    -- published event cover
    OR EXISTS (
      SELECT 1 FROM events
      WHERE cover_media_id = media_assets.id
        AND status = 'published'
    )
    -- published post cover
    OR EXISTS (
      SELECT 1 FROM posts
      WHERE cover_media_id = media_assets.id
        AND status = 'published'
    )
    -- published instructor portrait
    OR EXISTS (
      SELECT 1 FROM instructors
      WHERE portrait_media_id = media_assets.id
        AND status = 'published'
    )
    -- admin can always read
    OR public.is_admin()
  );

COMMIT;
```

## 006_storage_and_constraints.sql

```sql
-- ─── Migration 006: Private storage + leftover CHECKs ─────────────────────────
-- Unpublished uploads must not be world-readable via a public bucket URL.
-- site-media is private; storage.objects RLS gates download:
--   published-linked asset → anon SELECT
--   everything else        → admin only
-- Serving published files from a private bucket uses createSignedUrl (or
-- storage download with a policy that allows the caller). The public URL
-- form /storage/v1/object/public/... will 400 by design.
--
-- Safe to re-run.

BEGIN;

-- ─── 1. Private bucket ───────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  FALSE,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = FALSE,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ─── 2. Helper: is this storage object a published-content asset? ────────────
-- media_assets.storage_path MUST equal storage.objects.name (the key inside
-- the bucket, e.g. 'instructors/ali.jpg' — not 'site-media/instructors/ali.jpg').
CREATE OR REPLACE FUNCTION public.is_published_media_path(object_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.media_assets ma
    WHERE ma.storage_path = object_name
      AND (
        EXISTS (SELECT 1 FROM programs WHERE hero_media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM programs WHERE og_media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM instructors WHERE portrait_media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM gallery_items WHERE media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM events WHERE cover_media_id = ma.id AND status = 'published')
        OR EXISTS (SELECT 1 FROM posts WHERE cover_media_id = ma.id AND status = 'published')
      )
  );
$$;

REVOKE ALL ON FUNCTION public.is_published_media_path(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_published_media_path(text) TO anon, authenticated;

-- ─── 3. storage.objects policies for site-media ──────────────────────────────
DROP POLICY IF EXISTS "site_media_select" ON storage.objects;
DROP POLICY IF EXISTS "site_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "site_media_update" ON storage.objects;
DROP POLICY IF EXISTS "site_media_delete" ON storage.objects;

CREATE POLICY "site_media_select" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'site-media'
    AND (public.is_admin() OR public.is_published_media_path(name))
  );

CREATE POLICY "site_media_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'site-media'
    AND public.is_admin()
  );

CREATE POLICY "site_media_update" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'site-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

CREATE POLICY "site_media_delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'site-media' AND public.is_admin());

-- ─── 4. lesson_formats enum CHECK (forward-safe if 001 already ran) ──────────
ALTER TABLE programs
  DROP CONSTRAINT IF EXISTS programs_lesson_formats_check;

ALTER TABLE programs
  ADD CONSTRAINT programs_lesson_formats_check
  CHECK (lesson_formats <@ ARRAY['individual', 'group']::text[]);

COMMIT;
```

---

# G. Admin profil (migration sonrası, SQL Editor)

```sql
INSERT INTO profiles (id, display_name, role)
VALUES ('<auth-user-uuid>', 'Admin', 'admin');
```

# H. RLS smoke

| Aktör | Beklenen |
|---|---|
| authenticated, profil yok | applications SELECT reddedilir |
| authenticated, profil yok | contact_messages SELECT reddedilir |
| authenticated, profil yok | draft programs UPDATE reddedilir |
| admin profil | aynı işlemler izinli |
| anon | site-media içindeki yayınlanmamış object SELECT reddedilir |

# I. Bilerek kapanmayan

1. Avukat onaylı KVKK / gizlilik metni (canlıya çıkış engeli)
2. Medya yükleme UI (bucket private, upload arayüzü yok)
3. 001–006 henüz hiçbir DB'de çalıştırılmadı — senin uygulaman gerekiyor
