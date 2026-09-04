# Yağmur Sanat Akademisi — Production Launch Checklist

Bu liste, sitenin yayına alınmadan önce tamamlanması gereken adımları içermektedir.

---

## Teknik

- [ ] Production domain satın alındı ve DNS yapılandırıldı
- [ ] Vercel projesine özel domain bağlandı
- [ ] `NEXT_PUBLIC_SITE_URL` production domain ile güncellendi
- [ ] SSL sertifikası aktif ve HTTPS çalışıyor
- [ ] Production build hatasız tamamlandı (`npm run build`)
- [ ] Preview deploy'lar `noindex` olarak işaretli
- [ ] Admin rotaları `noindex`
- [ ] Sitemap doğru URL'lerle oluşturuluyor (`/sitemap.xml`)
- [ ] `robots.txt` doğru yapılandırıldı
- [ ] Canonical URL'ler production domain'i kullanıyor
- [ ] Güvenlik header'ları aktif (X-Frame-Options, X-Content-Type-Options vb.)

---

## Supabase

Ayrıntılı sıra: `docs/apply-migrations.md`. Uygulama, 001–007 COMMIT olmadan deploy edilmemeli.

- [ ] Supabase projesi oluşturuldu
- [ ] Email signup kapalı (yalnızca davetli admin)
- [ ] `001` → `007` sırasıyla, her dosya COMMIT olduktan sonra uygulandı
- [ ] Seed verisi doğrulandı (programs, faqs, site_settings, homepage_content)
- [ ] Admin kullanıcı 1 oluşturuldu ve `profiles.role = 'admin'`
- [ ] Admin kullanıcı 2 oluşturuldu ve `profiles.role = 'admin'`
- [ ] Smoke: authenticated + profil yok → `applications` / `contact_messages` SELECT `[]`
- [ ] Smoke: authenticated + profil yok → draft `programs` UPDATE 0 satır
- [ ] Smoke: admin aynı satırları görür ve günceller
- [ ] `site-media` bucket **private** (006); Dashboard’dan public yapılmadı
- [ ] Yayınlanmamış storage object anon URL ile 400/403
- [ ] `SUPABASE_SERVICE_ROLE_KEY` Vercel environment variables'a eklendi
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` eklendi
- [ ] Admin login test edildi (her iki kullanıcı)
- [ ] Logout test edildi
- [ ] Admin `/admin/login` açınca panele yönleniyor (sidebar’lı login yok)

---

## İletişim (WhatsApp)

Sitede başvuru / iletişim formu yok. Lead WhatsApp ve telefonla gelir.

- [ ] Header CTA `wa.me/905545959575` açıyor
- [ ] `/ucretsiz-tanisma-dersi` WhatsApp + telefon gösteriyor
- [ ] `/iletisim` form yok; WhatsApp + telefon + Instagram + adres
- [ ] Eğitim sayfalarındaki CTA WhatsApp
- [ ] WhatsApp ön doldurulmuş mesaj doğru
- [ ] `tel:+905545959575` arama başlatıyor

---

## Rate Limiting

Public form kaldırıldığı için Upstash artık lansman zorunluluğu değil.

---

## İçerik ve NAP

- [ ] **Adres, Google Business Profile ve resmî kurum kayıtlarıyla exact NAP yazımı doğrulandı** ⚠️
- [ ] Google Business Profile NAP, site ile eşleşiyor
- [ ] Telefon numaraları tıklandığında doğru numaraya yönlendiriyor
- [ ] WhatsApp mesaj akışı test edildi
- [ ] Instagram linki `@yagmursanatakademi`

---

## Hukuki

Public form ve KVKK/gizlilik sayfaları kaldırıldı (`/kvkk-aydinlatma-metni` ve `/gizlilik` → `/iletisim`). Site kişisel veri toplamaz; iletişim WhatsApp / telefon.

- [ ] WhatsApp sohbetleri akademi telefonunda yönetiliyor
- [ ] Analitik / çerez banner kapalı kaldı