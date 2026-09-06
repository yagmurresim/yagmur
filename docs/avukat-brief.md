# Avukat brief — Yağmur Sanat Akademisi web sitesi

Bu belgeyi avukata olduğu gibi iletebilirsiniz. Hukuki metin yazmıyoruz; fiili durumu ve sizden istediğimiz teslimatı anlatıyoruz.

Canlı site: **https://yagmursanat.com**

---

## 0. Önce site nedir, ne için yaptık

Yağmur Sanat Akademisi (ticari unvan: Özel Yağmur Sanat Akademisi Kursu), Karşıyaka / İzmir’de MEB onaylı bir kurs. Resim, piyano, keman ve gitar dersi verir. 4 yaşından yetişkine.

Site bir **tanıtım + başvuru** sitesidir. Amaç:

1. Akademiyi, eğitimleri ve adresi anlatmak (Karşıyaka İmbatlı, Yeni Girne No:205/B).
2. Velinin veya yetişkinin **ücretsiz tanışma dersi** için gün ve saat seçmesini sağlamak.
3. Seçilen saati akademi çalışanının **admin panelinde** (Takip) görmesini sağlamak; akademi telefon veya WhatsApp ile teyit eder.
4. WhatsApp / telefon ile de yazılabilsin diye iletişim bilgilerini göstermek.

Sitede **online ödeme, üyelik, öğrenci paneli, otomatik kayıt sözleşmesi yoktur.** Tanışma dersi ücretsizdir. Asıl kurs kaydı o dersten sonra, akademide, yüz yüze yapılır.

Daha önce iletişim yalnızca WhatsApp / telefondu; sitede form yoktu. Artık `/ucretsiz-tanisma-dersi` sayfasında **kişisel veri toplayan bir form** var. Bu yüzden KVKK aydınlatma metni ve gizlilik politikası istiyoruz.

---

## 1. Neden bu iki metin şart (hukuki talep, teknik gerekçe değil)

Form şunları kaydeder: **öğrenci adı, yaş, telefon, isteğe bağlı veli adı, seçilen ders saati.** Kurs 4 yaştan başladığı için kayıtların çoğu **çocuk + veli** olacaktır.

6698 sayılı Kanun md. 10: veri sorumlusu, kişisel verileri işlemeden önce ilgili kişiyi aydınlatmak zorundadır. Şu an sitede:

- Formda bir onay kutusu var.
- Kutunun yanında aydınlatma metnine **link yok** — çünkü sayfa yok.
- Footer’da gizlilik / KVKK linki yok.

Yani kişi “kabul ediyorum” diyor ama **neyi okuduğunu gösterecek bir metin yok.** Bu, hem KVKK hem de velinin “çocuğumun adı ve telefonu nereye gitti” sorusu için açık bir boşluk.

Sizden iki yayınlanabilir Türkçe metin istiyoruz; siteye koyacağız, formdaki kutuyu bu metne bağlayacağız.

---

## 2. Sizden teslimat

İki ayrı metin:

1. **KVKK Aydınlatma Metni** — md. 10. URL: `https://yagmursanat.com/kvkk-aydinlatma-metni`
2. **Gizlilik Politikası** — ziyaretçi + form dolduran. URL: `https://yagmursanat.com/gizlilik`

Ayrıca lütfen netleştirin:

- Metin **versiyon numarası** (ör. `web-intro-1.0` veya tarih). Biz her başvuruya bu sürümü kaydediyoruz; şu an kodda `web-intro-1.0`.
- **Yürürlük tarihi**
- Aşağıdaki checkbox cümlesi yeterli mi, yoksa nasıl değişsin
- 18 yaş altı + veli adı için **ikinci kutu / ayrı veli aydınlatması** gerekir mi
- Çerez / analitik şu an kapalı; ileride açılırsa ne gerekir
- Saklama süreleri

Word veya düz metin yeter.

---

## 3. Veri sorumlusu (akademinin doldurması gerekenler)

Veri sorumlusu: kursun tüzel kişiliği. Siteyi yazan kişi veri sorumlusu değildir.

| Alan | Değer |
|---|---|
| Ticari unvan | Özel Yağmur Sanat Akademisi Kursu |
| Marka adı | Yağmur Sanat Akademisi |
| Adres | İmbatlı Mahallesi, Yeni Girne No:205/B, Karşıyaka / İzmir |
| Telefon | 0554 595 95 75 |
| WhatsApp | +90 554 595 95 75 |
| Instagram | @yagmursanatakademi |
| Canlı site | https://yagmursanat.com |
| MEB onaylı kurs | Evet |
| E-posta (KVKK başvuruları) | **[DOLDUR]** |
| MERSİS / vergi no | **[DOLDUR]** |
| KEİP / KVKK başvuru adresi (varsa) | **[DOLDUR]** |

---

## 4. Sitede ne var, ne yok

**Var**

- Herkese açık sayfalar: ana sayfa, akademi, eğitimler (resim / piyano / keman / gitar), SSS, iletişim, ücretsiz tanışma dersi
- Tanışma dersi formu (aşağıda)
- WhatsApp ve telefon linkleri (form dışı iletişim)
- Admin paneli: yalnız akademi çalışanı, e-posta + şifre (Supabase Auth)

**Yok / yapılmıyor**

- İletişim formu (kaldırıldı; `/iletisim` yalnız WhatsApp, telefon, Instagram, adres, harita)
- Online ödeme, üyelik, öğrenci paneli
- Ziyaretçinin fotoğraf / belge yüklemesi
- Çerez banner’ı, reklam pikseli
- Analitik (Google Analytics / Plausible) — kodda opsiyonel, varsayılan **kapalı**
- E-posta / SMS pazarlama, e-bülten
- Lead satışı, profilleme, otomatik karar
- Başvuru sahibine otomatik e-posta (akademiye mail de şu an kapalı; kayıt yalnız admin Takip ekranına düşer)

---

## 5. Toplanan kişisel veriler — birebir, güncel form

Tek public form: **`https://yagmursanat.com/ucretsiz-tanisma-dersi`**

Kullanıcının doldurduğu:

| Alan | Zorunlu mu | Not |
|---|---|---|
| Öğrenci ad soyad | Evet | |
| Öğrenci yaş | Evet | Tam sayı, 4–80 |
| Veli ad soyad | Hayır | Etiket: “Veli (çocuksa)”. 18 yaş altı için teknik olarak zorunlu **değil** — avukat bunu değiştirebilir |
| Telefon | Evet | |
| Eğitim (resim / piyano / keman / gitar) | Evet | Saat seçiminden gelir |
| Grup veya birebir | Eğitime göre | Resim yalnız grup, piyano yalnız birebir |
| Gün ve saat | Evet | Bu ay içinden, geçmiş gün kapalı |
| KVKK onay kutusu | Evet | İşaretlenmeden kayıt olmaz |

Formda **e-posta alanı yoktur.**

Sistemin eklediği (kullanıcı görmez):

- `kvkk_consent = true`
- `kvkk_version` — şu an `"web-intro-1.0"` (istemciden alınmaz; sunucu yazar)
- `consented_at` — sunucu saati
- Seçilen saatin kesin zamanı (`intro_occurrence_at`)
- Durum: `INTRO_PLANNED`
- Kaynak: `web`, sayfa `/ucretsiz-tanisma-dersi`
- Kısa iç not: eğitim adı + saat + yaş (ör. “Tanışma: Resim · … · 8 yaş”)
- Tekrar gönderimi önlemek için rastgele istek kimliği (`booking_request_id`)

IP adresi **başvuru satırına yazılmaz.** Yalnızca aynı IP’den saatte 5’ten fazla denemeyi kesmek için (rate limit) kullanılır; anahtar süre dolunca düşer. Production’da bu sayaç Upstash Redis’te tutulur.

WhatsApp’tan yazanlar formu doldurmaz. Akademi o kişiyi admin Takip’e **elle** ekleyebilir (ad, telefon, yaş, not). Bu da kişisel veridir; aydınlatmanın kapsamına alın.

---

## 6. Checkbox metni (şu an sitede)

> “Ad, telefon, yaş ve seçilen saatin tanışma dersini ayarlamak için işlenmesini kabul ediyorum.”

Aydınlatma metnine link yok. Avukat cümleyi ve linki değiştirir; siteye birebir koyarız.

---

## 7. İşleme amaçları (teknik gerçek)

Veriler yalnızca:

1. Ücretsiz tanışma dersi talebini almak
2. Akademinin telefon veya WhatsApp ile saati teyit etmesi
3. Admin panelinde başvuruyu takip etmek (durum ve iç not)
4. Formu bot / spam’den korumak (IP sayacı)

Kullanılmıyor: reklam, profilleme, otomatik karar, üçüncü kişiye satış, e-bülten.

WhatsApp: akademi, formdaki numaraya yazar. WhatsApp Meta’ya aittir; aktarım yurt dışı olabilir — metinde geçmesi gerekir.

---

## 8. Hukuki sebep (avukatın seçmesi)

Bizim varsayımımız, avukat teyit etsin:

- Form: **açık rıza** (kutu işaretlenmeden kayıt yok)
- Geri arama / ders organizasyonu: rıza ve/veya sözleşme öncesi adımlar
- MEB kurs kaydı sitede yok; yüz yüze, tanışma dersinden sonra

---

## 9. Nerede tutuluyor, kim erişiyor

| Nerede | Ne | Kim |
|---|---|---|
| Supabase (PostgreSQL) | Başvuru satırları | Yalnız akademi admin’i + sunucu |
| Upstash Redis | IP başına saatlik istek sayısı | Sunucu; başvuru kaydına bağlanmaz |
| Vercel | Site hosting, sunucu logları | Altyapı |
| Admin tarayıcısı | Panelde ad / telefon görünür | Akademi çalışanı |

Anonim ziyaretçi başvuruları **okuyamaz.**

Saklama süresi **kodda yok.** Avukat süre yazmalı. Tartışma örneği:

- Olumsuz / kapanmış başvuru: 1 yıl?
- Kayıt olan öğrenci: MEB öğrenci dosyası bu sitede tutulmaz; sitede yalnızca ilk talep vardır
- WhatsApp’tan elle girilen lead: aynı süre?

Süre netleşince metne yazarız; istenirse silme takvimine de.

---

## 10. Aktarım

- **Supabase:** veritabanı. Bölge Avrupa (Frankfurt / benzeri) olmalı. ABD seçildiyse yurt dışı aktarım paragrafı gerekir.
- **Vercel:** sitenin çalıştığı yer; ABD aktarımı olabilir.
- **Upstash:** IP sayacı; bölgeye bağlı.
- **WhatsApp / Instagram:** kullanıcı o kanaldan yazarsa.

Alıcılar: akademi çalışanları, barındırma / veritabanı sağlayıcıları, (kullanıcı yazarsa) WhatsApp.

---

## 11. Haklar ve başvuru

Kullanıcı: erişim, düzeltme, silme, itiraz, rızayı geri çekme, Kurul’a şikayet.

Teknik silme: admin panelinden başvuru satırı silinebilir. Avukat “e-posta / telefon ile talep” yazabilir.

---

## 12. Çocuklar

Kurs 4 yaştan başlar. Formda veli adı **isteğe bağlıdır**; ayrı veli rızası kutusu yoktur. Tek KVKK kutusu.

Avukat: tek kutu yeterli mi? 18 yaş altı için veli adı zorunlu mu, ikinci cümle / ikinci kutu mu gerekir? Cevabı forma yansıtırız.

---

## 13. Çerez / analitik

Analitik kapalı. Çerez banner’ı yok.

Metin önerisi: zorunlu teknik çerezler (oturum, güvenlik); pazarlama çerezi yok.

İleride GA4 veya Plausible açılırsa avukattan ek cümle + (GA4 ise) çerez onayı isteriz.

---

## 14. Avukattan net cevap beklediğimiz sorular

1. İki metin (aydınlatma + gizlilik) — yayınlanabilir hali, “taslak” uyarısı olmasın.
2. Versiyon numarası nedir? (DB’ye `kvkk_version` olarak bunu yazacağız.)
3. Checkbox cümlesi bu haliyle olur mu? Aydınlatmaya nasıl linklensin?
4. 18 yaş altı için ek veli onayı / veli adı zorunluluğu gerekir mi?
5. Saklama süreleri nedir?
6. Supabase bölgesi AB olursa yurt dışı aktarım paragrafı gerekir mi? Vercel için?
7. WhatsApp ile teyit ayrı rıza ister mi?
8. Form “açık rıza” mı, yoksa aydınlatma + meşru menfaat / sözleşme öncesi mi?
9. Unvan ve adres ticaret sicilindeki yazımla birebir mi?

---

## 15. Bize dönüş formatı

- Aydınlatma: başlıklı, numaralı maddeler, düz Türkçe
- Gizlilik: ayrı belge
- İlk satırda **Versiyon** ve **Tarih**

Metin gelince `/kvkk-aydinlatma-metni` ve `/gizlilik` sayfalarına yerleştirilir; form kutusu bu sayfaya linklenir; footer’a iki link eklenir; `kvkk_version` avukatın versiyonuyla eşitlenir.
