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

## İletişim ve tanışma dersi

Lead iki yoldan gelir: sitedeki tanışma formu veya WhatsApp / telefon.

- [ ] Header CTA `/ucretsiz-tanisma-dersi` açıyor
- [ ] `/ucretsiz-tanisma-dersi` form + WhatsApp yedek
- [ ] `/iletisim` form yok; WhatsApp + telefon + Instagram + adres
- [ ] Eğitim sayfalarındaki CTA tanışma dersi
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

Form açık rızaya dayanmıyor (KVKK m.5/2-c/e/f). KVKK kutusu yok; gönder üstünde aydınlatma linki. 18 yaş altı: veli adı + veli telefonu + temsil beyanı.

- [x] Avukat aydınlatma + gizlilik metinlerini verdi (`web-intro-1.0`, 06.09.2026)
- [x] `/kvkk-aydinlatma-metni` ve `/gizlilik` yayında (noindex)
- [x] Form: KVKK kutusu yok; gönder üstünde aydınlatma linki; 18 yaş altı veli
- [x] 012: veli beyanı RPC’de zorunlu; `privacy_notice_*` + `guardian_*` (SQL Editor’da uygulanacak)
- [x] `legal/kvkk-web-intro-1.0.md` ve `legal/gizlilik-web-intro-1.0.md` arşiv (değiştirme)
- [x] Footer’da iki link
- [x] Veri sorumlusu: Yağmur Ataş
- [x] KVKK iletişim: kvkk@yagmursanat.com (hesabın açılması akademiye ait)
- [ ] Supabase / Vercel Türkiye SCC imkânı (m.9) — avukat/akademi
- [ ] Vercel plan: Hobby ise Pro
- [ ] 6 aylık başvuru imha mekanizması
- [ ] WhatsApp DTA / Türkiye SCC teyidi
- [ ] WhatsApp sohbetleri akademi telefonunda yönetiliyor
- [ ] Analitik / çerez banner kapalı kaldı