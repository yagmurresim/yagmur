# Yağmur Sanat Akademisi — Web Sitesi

Production-ready web sitesi + admin paneli + CRM lite.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Supabase · Framer Motion

---

## Yerel Geliştirme

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. Ortam değişkenlerini ayarla

```bash
cp .env.example .env.local
```

`.env.local` dosyasını açıp Supabase ve diğer değerleri gir.

### 3. Supabase Kurulumu

Migration'lar henüz hiçbir veritabanında çalıştırılmadı. Uygulamayı deploy etmeden **önce** veritabanını kurun. Signup / public trafik açıkken 001–007'yi ayrı SQL Editor sekmelerinde çalıştırmayın. Her dosya `BEGIN`/`COMMIT` taşır.

**Fresh proje (bu durum):**

1. Auth → Providers → Email: signup kapalı tutun (yalnızca davetli admin).
2. SQL Editor'da **tek oturumda, sırayla, her dosya COMMIT olduktan sonra** şunları uygulayın:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_seed.sql
supabase/migrations/003_admin_security.sql
supabase/migrations/004_singleton_fix.sql
supabase/migrations/005_policy_refinements.sql
supabase/migrations/006_storage_and_constraints.sql
supabase/migrations/007_data_api_grants.sql
```

3. Admin kullanıcısını oluşturun (aşağıdaki adım 5).
4. RLS smoke test (aşağıdaki checklist).
5. Ancak ondan sonra uygulamayı deploy edin.

**Mevcut bir DB'de 001 zaten uygulandıysa:** 001 ve 002'yi tekrar çalıştırmayın. Yalnızca henüz uygulanmamış ileri migration'ları (003+) uygulayın.

Veya [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase db push
```

### 4. Storage

`006_storage_and_constraints.sql` `site-media` bucket'ını **private** oluşturur. Dashboard'dan public bucket açmayın. Yayınlanmış görseller `storage.objects` RLS ile okunur; taslak dosyalar public URL ile açılmaz.

### 5. Admin kullanıcısı oluştur

Supabase Dashboard → Authentication → Users → Add user:

```
E-posta: admin@akademi.com   (istediğin herhangi bir e-posta)
Şifre: GüçlüBirŞifre123!
```

İki admin oluşturabilirsin (aynı yöntemi tekrarla).

Kullanıcı oluşturduktan sonra `profiles` tablosuna satır ekle:

```sql
INSERT INTO profiles (id, display_name, role)
VALUES ('<user-uuid-buraya>', 'Admin', 'admin');
```

### 6. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcı: http://localhost:3000

Admin panel: http://localhost:3000/admin/login

---

## Build

> **Önemli:** Sandbox ortamında `node_modules` symlink olduğu için Turbopack build alamaz.
> Build'i terminal üzerinden (sandbox dışında) çalıştırman gerekiyor:

```bash
npm run build
```

### TypeScript kontrolü

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

---

## Deployment (Vercel + Supabase)

1. GitHub'a push yap
2. Vercel → New Project → repo'yu bağla
3. Environment Variables bölümüne `.env.example`'daki değişkenlerin production değerlerini gir
4. Deploy

**Önemli:** `NEXT_PUBLIC_SITE_URL` değerini production domain'inle güncelle.

Preview deployment'lar otomatik olarak `noindex` alır (next.config.ts'de yapılandırılmıştır).

---

## Proje Yapısı

```
src/
  app/
    (public)/          Public sayfalar (route group)
    admin/             Admin panel
    api/               API routes (gerekirse)
  components/
    brand/             Logo, BrandLine SVG animasyonu
    layout/            Header, Footer
    ui/                Button, FormField, StatusBadge
  features/
    admin/             Admin bileşenleri (sidebar, form, CRM actions)
    admin/             Takip CRM, program ve SSS formları
    contact/           İletişim formu
    faq/               SSS accordion
    home/              Homepage section'ları
  lib/
    contact.ts         WhatsApp / telefon sabitleri
    seo.ts             Metadata builder, Organization schema
    supabase/          Client, server, admin client
    utils.ts           Yardımcı fonksiyonlar
  server/
    actions/           Admin CRUD
    queries/           DB sorgu helper'ları
    queries/           DB sorgu helper'ları
  types/               TypeScript tipleri
supabase/
  migrations/          SQL migration dosyaları
docs/
  apply-migrations.md  DB migration uygulama sırası (deploy öncesi)
  launch-checklist.md  Production lansmanı kontrol listesi
  photo-shoot-brief.md Fotoğraf çekimi brief'i
```

---

## Public Rotalar

| Rota | Sayfa |
|---|---|
| `/` | Ana sayfa |
| `/akademi` | Akademi hakkında |
| `/egitimler` | Eğitimler listesi |
| `/egitimler/resim-kursu` | Resim eğitimi |
| `/egitimler/piyano-kursu` | Piyano eğitimi |
| `/egitimler/keman-kursu` | Keman eğitimi |
| `/egitimler/gitar-kursu` | Gitar eğitimi |
| `/ucretsiz-tanisma-dersi` | WhatsApp / telefon CTA |
| `/sss` | SSS |
| `/iletisim` | WhatsApp, telefon, adres |

---

## Admin Rotalar

| Rota | Sayfa |
|---|---|
| `/admin/login` | Giriş |
| `/admin` | Genel bakış |
| `/admin/basvurular` | WhatsApp / telefon takip CRM |
| `/admin/basvurular/yeni` | Elle kayıt ekle |
| `/admin/basvurular/[id]` | Kayıt detayı, not, takip tarihi |
| `/admin/egitimler` | Program CRUD |
| `/admin/egitmenler` | Eğitmen CRUD |
| `/admin/sss` | SSS CRUD |
| `/admin/medya` | Medya yönetimi |
| `/admin/ayarlar` | Site ayarları |

---

## Güvenlik

- Admin rotalar proxy + layout ile korunur (Supabase Auth + `profiles.role`)
- Public sitede form yok; kişisel veri toplanmaz. İletişim WhatsApp (`+905545959575`) ve telefon
- RLS: admin paneli tabloları `is_admin()` ile yazılır
- `SUPABASE_SERVICE_ROLE_KEY` client bundle'a girmez

---

## Ortam Değişkenleri

Tüm değişkenler için `.env.example` dosyasına bak.

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Production domain |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server-only, başvuru kaydetme için |
| `UPSTASH_REDIS_REST_URL` | ❌ | Kullanılmıyor (public form yok) |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ | Kullanılmıyor |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | ❌ | `none` / `plausible` / `ga4` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible kullanılıyorsa | Domain |
| `NEXT_PUBLIC_GA_ID` | GA4 kullanılıyorsa | Measurement ID |

---

## Production Lansmanı

`docs/launch-checklist.md` dosyasındaki tüm maddeleri tamamla.

**Özellikle dikkat:**
- [ ] Adres, Google Business Profile ile doğrulanmıştır
- [ ] WhatsApp `+905545959575` tüm CTA'larda açılıyor
- [ ] `NEXT_PUBLIC_SITE_URL` production domain'e ayarlanmıştır
- [ ] Admin kullanıcıları oluşturulmuştur