# Avukat brief — Yağmur Sanat Akademisi web sitesi

Bu belgeyi avukata olduğu gibi iletebilirsiniz. Amaç: canlıya çıkmadan önce **KVKK aydınlatma metni** ve **gizlilik politikası** almak.

Biz hukuki metin yazmıyoruz. Avukatın ihtiyaç duyduğu **fiili durum** aşağıda.

---

## 1. Ne istiyoruz (teslimat)

İki ayrı, yayınlanabilir Türkçe metin:

1. **KVKK Aydınlatma Metni** — 6698 sayılı Kanun md. 10 kapsamında. Formlarda checkbox ile kabul ettirilecek. URL: `https://<CANLI-DOMAIN>/kvkk-aydinlatma-metni`
2. **Gizlilik Politikası** — site ziyaretçisi + form dolduran için. URL: `https://<CANLI-DOMAIN>/gizlilik`

Ayrıca lütfen şunları da netleştirin:

- Metin **versiyon numarası** (ör. `1.0` veya tarih: `2026-09-04`)
- Metnin **yürürlük tarihi**
- Checkbox metninin hukuken yeterli olup olmadığı (aşağıda mevcut cümle var)
- 18 yaş altı öğrenci + veli adı için ek bir onay / veli aydınlatması gerekip gerekmediği
- Çerez / analitik: şu an kapalı; ileride açılırsa ne gerekir

Word veya düz metin yeter. HTML şart değil.

---

## 2. Veri sorumlusu (sizin doldurmanız gerekenler)

Avukata götürmeden önce bunları doldurun; boş bırakmayın.

| Alan | Değer |
|---|---|
| Ticari unvan | Özel Yağmur Sanat Akademisi Kursu |
| Marka adı | Yağmur Sanat Akademisi |
| Adres | İmbatlı Mahallesi, Yeni Girne No:205/B, Karşıyaka / İzmir |
| Telefon | 0554 595 95 75 |
| WhatsApp | +90 554 595 95 75 |
| Instagram | @yagmursanatakademi |
| E-posta (KVKK başvuruları için) | **[DOLDUR]** örn. info@... |
| MERSİS / vergi no | **[DOLDUR]** |
| KEİP / KVKK başvuru adresi (varsa) | **[DOLDUR]** |
| Canlı site domain | **[DOLDUR]** örn. https://yagmursanatakademisi.com |
| MEB onaylı kurs mu? | Evet (sitede “MEB Onaylı Kurs” olarak gösteriliyor) |

Veri sorumlusu: kursun tüzel kişiliği. Yazılımı yapan kişi veri sorumlusu değil.

---

## 3. Site ne işe yarıyor

Karşıyaka’da resim / piyano / keman / gitar kursu tanıtım sitesi.

- Eğitimleri anlatır
- **Ücretsiz tanışma dersi başvurusu** alır (anında rezervasyon / ödeme yok)
- İletişim formu alır
- Admin paneli: başvuruları ve mesajları yönetir (yalnızca akademi çalışanı)

Şu an **yok / yapılmıyor:**

- Online ödeme, üyelik, öğrenci paneli
- Fotoğraf / belge yükleme (medya özelliği kapalı)
- Çerez banner’ı, reklam piksel’i
- Analitik (Google Analytics / Plausible) — kodda opsiyonel, varsayılan **kapalı**
- E-posta / SMS otomatik pazarlama
- Üçüncü kişiye lead satışı

---

## 4. Toplanan kişisel veriler (form alanları — birebir)

### A) Ücretsiz tanışma dersi başvurusu (`/ucretsiz-tanisma-dersi`)

Zorunlu:

- Öğrenci ad soyad
- Öğrenci yaş (tam sayı, min. 4)
- Telefon (Türkiye cep)
- Eğitim seçimi (Resim / Piyano / Keman / Gitar)
- KVKK checkbox = evet

Koşullu zorunlu:

- Öğrenci 18 yaşından küçükse **veli ad soyad** zorunlu

İsteğe bağlı:

- E-posta
- Mevcut seviye (ilk kez / biraz deneyim / daha önce eğitim / belirtmek istemiyor)
- Tercih edilen iletişim kanalı (WhatsApp veya telefon)
- Tercih edilen iletişim zamanı
- Serbest mesaj (max 1000 karakter)

Sistemin eklediği (kullanıcı görmez, formdan gelmez):

- `kvkk_consent = true` (checkbox yoksa kayıt olmaz)
- `kvkk_version` — kodda şu an `"1.0"`; avukatın verdiği versiyonla değiştirilecek
- `consented_at` — sunucu saati
- `status = NEW`
- Formun geldiği sayfa (`Referer`, varsa)
- IP adresi — **başvuru satırına yazılmıyor**; yalnız rate limit için Redis’te saatlik sayaç (`rl:apply:<ip>`, 5 istek / 1 saat). Saat dolunca anahtar düşer.

### B) İletişim formu (`/iletisim`)

Zorunlu: ad soyad, mesaj (min. 10 karakter), KVKK checkbox  
İsteğe bağlı: telefon, e-posta  
Aynı şekilde: `kvkk_consent`, `kvkk_version`, `consented_at`, `status = unread`  
IP yine yalnız rate limit.

### C) Site ziyareti

Sayfa içeriği herkese açık. Ziyaretçi hesabı yok.  
Hosting (Vercel) ve tarayıcı teknik logları olabilir — bunu da metinde genel “altyapı sağlayıcı” olarak geçirin.

### D) Admin paneli

Akademi çalışanı e-posta + şifre ile girer (Supabase Auth).  
`profiles` tablosunda yalnızca `display_name` ve `role=admin`.  
Başvuru/mesaj okuma yalnız admin.

---

## 5. İşleme amaçları (teknik gerçek)

Veriler **yalnızca** şu işler için kullanılıyor:

1. Tanışma dersi / kurs kaydı talebini almak
2. Telefon veya WhatsApp ile geri dönmek
3. Admin panelinde başvuruyu takip etmek (durum: Yeni → İletişime geçildi → Tanışma planlandı → Kayıt oldu → Kapandı) ve iç not düşmek
4. İletişim mesajını okuyup cevaplamak
5. Formu bot / spam’den korumak (IP sayacı)

Kullanılmıyor: reklam, profilleme, otomatik karar, üçüncü kişiye satış, e-bülten.

WhatsApp: kullanıcı “WhatsApp” seçerse akademi o numaraya yazar. WhatsApp Meta’ya aittir; aktarım yurt dışı olabilir — avukatın metinde geçirmesi gerekir.

---

## 6. Hukuki sebep (avukatın seçmesi)

Bizim varsayımımız (avukat teyit etsin):

- Form: **açık rıza** (checkbox, metin linki, kayıt olmadan submit yok)
- Geri arama / tanışma organizasyonu: rıza ve/veya sözleşme öncesi adımlar
- MEB kurs kaydı ileride olursa: yasal yükümlülük ayrıca doğabilir — şu an sitede kayıt sözleşmesi yok

Checkbox şu an şöyle:

> “KVKK Aydınlatma Metni’ni okudum, kişisel verilerimin işlenmesine onay veriyorum.”

Avukat bu cümleyi değiştirebilir; siteye birebir koyarız.

---

## 7. Nerede tutuluyor, kim erişiyor

| Nerede | Ne | Kim |
|---|---|---|
| Supabase (PostgreSQL) — AB bölgesi seçilecek | Başvuru ve mesaj satırları | Yalnız akademi admin’i + sunucu (service role) |
| Upstash Redis | IP başına saatlik istek sayısı | Sunucu; başvuru kaydına bağlanmaz |
| Vercel | Site hosting, sunucu logları | Altyapı |
| Admin’in tarayıcısı | Panelde ad / telefon görünür | Akademi çalışanı |

Anonim internet kullanıcısı başvuruları **okuyamaz**.  
Yedekleme: Supabase’in kendi yedekleri. Ayrı bir yedek ürünümüz yok.

Saklama süresi **kodda yok**. Avukat süre yazmalı; örnek tartışma:

- Olumsuz / kapanmış başvuru: 1 yıl?
- Kayıt olan öğrenci: mevzuattaki öğrenci dosyası süresi (MEB) — bu site o dosyayı tutmuyor, yalnızca ilk talep
- İletişim mesajı: 1 yıl?

Süre netleşince hem metne hem (isterseniz) silme takvimine yazarız.

---

## 8. Aktarım

- **Supabase**: veritabanı. Proje oluşturulurken bölge **Avrupa (Frankfurt / benzeri)** seçilmeli. ABD seçilirse avukatın yurt dışı aktarım metni gerekir.
- **Vercel**: sitenin çalıştığı yer; ABD aktarımı olabilir.
- **Upstash**: IP sayacı; bölge seçimine bağlı.
- **WhatsApp / Instagram**: kullanıcı kendi seçerse.

Alıcı listesi: akademi çalışanları, barındırma / veritabanı sağlayıcıları, (isteğe bağlı) WhatsApp.

---

## 9. Haklar ve başvuru

Kullanıcı: erişim, düzeltme, silme, itiraz, rızayı geri çekme, KVKK Kurulu’na şikayet.

Teknik olarak silme: admin panelinden satır silme henüz başvuru için yok; avukat “e-posta / telefon ile talep” yazabilir, biz elle sileriz. İleride silme butonu eklenebilir.

---

## 10. Çocuklar

Kurs 4 yaştan başlıyor. 18 yaş altı için veli adı zorunlu.  
Ayrı bir “veli rızası” checkbox’ı yok — tek KVKK kutusu.  
Avukat: tek kutu yeterli mi, yoksa veli için ikinci cümle / ikinci kutu mu gerekir? Cevabı metne ve forma yansıtırız.

---

## 11. Çerez / analitik

Şu an **analitik kapalı**. Çerez banner’ı yok.  
Metin: “zorunlu teknik çerezler (oturum, güvenlik); pazarlama çerezi yok.”  
İleride GA4 veya Plausible açılırsa avukattan ek cümle + (GA4 ise) çerez onayı isteriz. Şimdilik “ileride eklenebilir” notu yeterli.

---

## 12. Avukattan net cevap beklediğimiz sorular

1. İki metin (aydınlatma + gizlilik) — yayınlanabilir hali.
2. Versiyon numarası nedir? (biz `KVKK_VERSION` olarak DB’ye bunu yazacağız)
3. Checkbox cümlesi bu haliyle olur mu?
4. 18 yaş altı için ek veli onayı gerekir mi?
5. Saklama süreleri nedir?
6. Supabase bölgesi AB olursa yurt dışı aktarım paragrafı gerekir mi? Vercel için?
7. WhatsApp geri dönüşü ayrı rıza ister mi, yoksa “iletişim kanalı tercihi” yeterli mi?
8. Formda “açık rıza” mı, yoksa aydınlatma + meşru menfaat / sözleşme öncesi mi? (metin buna göre yazılsın)
9. Domain ve unvan yukarıdaki tablodaki gibi mi, yoksa tapu/ticaret sicilindeki birebir yazım farklı mı?

---

## 13. Bize dönüş formatı

- Aydınlatma metni: başlıklı, numaralı maddeler, düz Türkçe
- Gizlilik: ayrı belge
- İlk satırda: **Versiyon** ve **Tarih**
- “Bu taslaktır” uyarısı olmasın; canlıya koyacağız

Metin gelince `/kvkk-aydinlatma-metni` ve `/gizlilik` sayfalarına yerleştirilir; yer tutucu kaldırılır; `KVKK_VERSION` avukatın versiyonuyla eşitlenir.
