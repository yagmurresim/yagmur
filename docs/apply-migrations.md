# Migration uygulama

Bu projedeki SQL dosyaları henüz hiçbir veritabanında çalıştırılmadı. Uygulamayı deploy etmeden **önce** zinciri uygulayın.

## Fresh proje (mevcut durum)

Signup kapalı tutun. SQL Editor’da her dosyayı ayrı çalıştırın; bir önceki `COMMIT` olmadan sonrakine geçmeyin. 001–007 dosyalarının her biri `BEGIN`/`COMMIT` taşır — yarım kalırsa transaction rollback olur.

1. `001_initial_schema.sql` — şema + `is_admin()` write politikaları
2. `002_seed.sql` — program seed (`ON CONFLICT (slug) DO NOTHING`)
3. `003_admin_security.sql` — idempotent sertleştirme (001 ile aynı politikalar)
4. `004_singleton_fix.sql` — singleton, FAQ seed, KVKK CHECK, silme tetikleyicisi
5. `005_policy_refinements.sql` — profil kolon GRANT + media public-read
6. `006_storage_and_constraints.sql` — **private** `site-media` bucket + storage RLS
7. `007_data_api_grants.sql` — explicit Data API GRANT matrisi + `is_admin()` EXECUTE
8. `008_whatsapp_crm.sql` — staff lead kaydı: yaş opsiyonel, kaynak kanalı, takip indeksi
9. `009_intro_slots.sql` — haftalık tanışma saati ızgarası + `applications.intro_slot_id`
10. `010_intro_grid_seed.sql` — her gün grup (2 saat) ve birebir müzik (1 saat) ızgarası
11. `011_intro_month_horizon.sql` — rezervasyon bu ayla sınırlı; geçmiş günler kapalı

Sonra:

```sql
INSERT INTO profiles (id, display_name, role)
VALUES ('<auth-user-uuid>', 'Admin', 'admin');
```

### RLS / GRANT smoke (üç oturum)

PostgREST RLS altında yetkisiz `SELECT` çoğu zaman “permission denied” üretmez; başarılı yanıt `[]` döner. Test kriteri:

| Aktör | Beklenen |
|---|---|
| `authenticated`, profil yok | `applications` SELECT → `[]` (hassas satır yok) |
| `authenticated`, profil yok | `contact_messages` SELECT → `[]` |
| `authenticated`, profil yok | draft `programs` UPDATE → 0 satır / error |
| `admin` profil | aynı satırlar görünür, UPDATE etkiler |
| `anon` | `site-media` unpublished object SELECT reddedilir / 400 |
| `anon` | published `programs` SELECT satır döner |

Medya özelliği kullanılabilir ilan edilmeden (upload UI + serving):

```
draft asset → anon göremez
published-linked → public sayfada 200
unpublish → yeni anon erişim kapanır
```

`getPublicUrl()` private bucket’ta dosya indirmez. Serving `createSignedUrl` veya authenticated download ile kurulmalı.

## Mevcut DB (eski 001 zaten uygulandıysa)

`001` ve `002`’yi tekrar çalıştırmayın. Yalnızca henüz olmayan ileri dosyaları uygulayın (`003` → `010`).

## Yeni tablo kuralı

`007` yalnız apply anındaki tablolara GRANT verir. Sonraki her Data API tablosu kendi migration’ında **GRANT + RLS** taşımak zorunda. `ALTER DEFAULT PRIVILEGES` kullanma.

`004` KVKK CHECK eklemeden önce mevcut `FALSE` satır varsa transaction rollback olur. Preflight mesajı sayıları verir.

## Uygulama deploy sırası

```
001–010 COMMIT
→ admin profil
→ RLS / GRANT smoke
→ app deploy
```

Push auto-deploy ediyorsa migration’lar commit olmadan push etmeyin.
