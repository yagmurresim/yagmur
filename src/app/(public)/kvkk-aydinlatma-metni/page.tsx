import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import {
  DATA_CONTROLLER_BUSINESS,
  DATA_CONTROLLER_NAME,
  INTRO_KVKK_EFFECTIVE,
  INTRO_KVKK_VERSION,
  KVKK_EMAIL,
} from "@/lib/kvkk";

export const metadata: Metadata = buildMetadata({
  title: "KVKK Aydınlatma Metni | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi kişisel verilerin işlenmesine ilişkin aydınlatma metni. Ücretsiz tanışma dersi başvuruları.",
  canonical: "/kvkk-aydinlatma-metni",
  noindex: true,
});

export default function KvkkAydinlatmaPage() {
  return (
    <article className="bg-paper pt-32 pb-24 text-ink lg:pt-44 lg:pb-32">
      <div className="mx-auto max-w-[760px] px-6 lg:px-0">
        <p className="text-[13px] text-ink-muted">
          Versiyon {INTRO_KVKK_VERSION}
          <span className="mx-2">·</span>
          Yürürlük {INTRO_KVKK_EFFECTIVE}
        </p>
        <h1 className="font-display mt-4 text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95]">
          Kişisel verilerin işlenmesine ilişkin aydınlatma metni
        </h1>

        <div className="mt-10 flex flex-col gap-8 text-[16px] leading-relaxed text-ink-muted">
          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">1. Veri sorumlusu</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında kişisel
              verileriniz;
            </p>
            <address className="mt-4 not-italic text-ink">
              {DATA_CONTROLLER_NAME}
              <br />
              İşletme/kurum adı: {DATA_CONTROLLER_BUSINESS}
              <br />
              Marka adı: Yağmur Sanat Akademisi
              <br />
              Adres: İmbatlı Mahallesi, Yeni Girne No:205/B, Karşıyaka / İzmir
              <br />
              Telefon: 0554 595 95 75
              <br />
              KVKK ile ilgili soru ve iletişimleriniz için:{" "}
              <a href={`mailto:${KVKK_EMAIL}`} className="text-plum hover:text-violet">
                {KVKK_EMAIL}
              </a>
            </address>
            <p className="mt-4">tarafından veri sorumlusu sıfatıyla işlenmektedir.</p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">2. Bu metin kimleri kapsar?</h2>
            <p>Bu aydınlatma metni;</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                yagmursanat.com üzerinden ücretsiz tanışma dersi talebinde bulunan
                yetişkinleri,
              </li>
              <li>18 yaşından küçük öğrenciler adına başvuru yapan veli veya yasal temsilcileri,</li>
              <li>ücretsiz tanışma dersine katılması planlanan öğrencileri ve</li>
              <li>
                telefon veya WhatsApp üzerinden akademi ile iletişim kurup başvuru
                bilgilerinin akademi takip sistemine kaydedildiği kişileri
              </li>
            </ul>
            <p className="mt-3">kapsar.</p>
            <p className="mt-3">
              18 yaşından küçük öğrenciler için internet sitesi üzerinden yapılan
              başvurunun veli veya yasal temsilci tarafından gerçekleştirilmesi gerekir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">3. Hangi kişisel verileri işliyoruz?</h2>
            <p>
              Ücretsiz tanışma dersi ve ilgili iletişim süreçleri kapsamında aşağıdaki
              kişisel veriler işlenebilir.
            </p>
            <h3 className="mt-5 text-[17px] font-medium text-ink">Kimlik ve öğrenci bilgileri</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>öğrenci ad ve soyadı</li>
              <li>öğrencinin yaşı</li>
              <li>öğrenci 18 yaşından küçükse veli/yasal temsilcinin ad ve soyadı</li>
            </ul>
            <h3 className="mt-5 text-[17px] font-medium text-ink">İletişim bilgileri</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>telefon numarası</li>
            </ul>
            <p className="mt-3">
              18 yaşından küçük öğrenciler bakımından iletişim için veli veya yasal
              temsilcinin telefon numarasının kullanılması esastır.
            </p>
            <h3 className="mt-5 text-[17px] font-medium text-ink">Talep ve randevu bilgileri</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>ilgilenilen eğitim alanı (resim, piyano, keman veya gitar)</li>
              <li>uygun olduğu ölçüde grup veya birebir ders tercihi</li>
              <li>seçilen tanışma dersi günü ve saati</li>
              <li>başvurunun durumu ve kaynağı</li>
              <li>randevu ve başvurunun takibi için gerekli sınırlı iç notlar</li>
            </ul>
            <h3 className="mt-5 text-[17px] font-medium text-ink">İşlem ve güvenlik bilgileri</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>başvurunun oluşturulduğu tarih ve saat</li>
              <li>başvurunun hangi aydınlatma metni sürümü ile gerçekleştirildiği</li>
              <li>teknik işlem/istek kimliği</li>
              <li>
                internet sitesinin güvenliğinin sağlanması ve kötüye kullanımın
                önlenmesi amacıyla sınırlı süreyle işlenen IP ve teknik log bilgileri
              </li>
            </ul>
            <p className="mt-3">
              IP adresi ücretsiz tanışma dersi başvuru kaydının bir parçası olarak
              saklanmaz. IP bilgisi, otomatik başvuru ve kötüye kullanım girişimlerini
              sınırlamak amacıyla teknik güvenlik sistemlerinde geçici olarak işlenebilir.
            </p>
            <p className="mt-3">
              Bu form aracılığıyla sağlık verisi, engellilik bilgisi, biyometrik veri
              veya KVKK kapsamında özel nitelikli başka bir kişisel veri talep
              edilmemektedir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">
              4. Kişisel verilerinizi hangi amaçlarla işliyoruz?
            </h2>
            <p>Kişisel verileriniz yalnızca gerekli olduğu ölçüde;</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>ücretsiz tanışma dersi talebinin alınması ve oluşturulması,</li>
              <li>seçilen ders, gün ve saat bilgilerinin planlanması,</li>
              <li>
                başvuru sahibinin telefon veya uygun iletişim kanalı üzerinden
                bilgilendirilmesi ve randevunun teyit edilmesi,
              </li>
              <li>akademinin başvuru ve randevu süreçlerini takip etmesi,</li>
              <li>aynı kişi tarafından yapılan başvuruların yönetilmesi,</li>
              <li>
                internet sitesinin ve başvuru sisteminin kötüye kullanım, spam, bot ve
                benzeri güvenlik tehditlerine karşı korunması,
              </li>
              <li>olası talep, şikâyet ve hukuki uyuşmazlıkların yönetilmesi ve</li>
              <li>KVKK ve ilgili mevzuattan kaynaklanan yükümlülüklerin yerine getirilmesi</li>
            </ol>
            <p className="mt-3">amaçlarıyla işlenmektedir.</p>
            <p className="mt-3">
              Kişisel verileriniz reklam profili oluşturmak, davranışsal reklam yapmak,
              kişisel verileri üçüncü kişilere satmak veya otomatik karar
              verme/profilleme amacıyla kullanılmaz.
            </p>
            <p className="mt-3">
              Ücretsiz tanışma dersi başvurusu, ücretli kurs kaydı anlamına gelmez.
              Kursa kesin kayıt işlemleri ayrıca ve yüz yüze gerçekleştirilmektedir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">
              5. Kişisel verilerin işlenmesinin hukuki sebepleri
            </h2>
            <p>
              Kişisel verileriniz KVKK’nın 5’inci maddesinde belirtilen kişisel veri
              işleme şartlarına dayanılarak işlenmektedir.
            </p>
            <p className="mt-3">
              Ücretsiz tanışma dersi talebinin alınması, randevunun oluşturulması ve
              talep edilen hizmete ilişkin iletişimin gerçekleştirilmesi bakımından
              kişisel veriler, bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili
              olması kaydıyla kişisel verilerin işlenmesinin gerekli olması hukuki
              sebebine dayanılarak işlenebilir.
            </p>
            <p className="mt-3">
              Başvuruların güvenliğinin sağlanması, kötüye kullanımın önlenmesi,
              başvuruların sınırlı ölçüde takip edilmesi ve akademinin faaliyetlerinin
              güvenli biçimde yürütülmesi bakımından kişisel veriler, ilgili kişinin
              temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun
              meşru menfaati için veri işlenmesinin zorunlu olması hukuki sebebine
              dayanılarak işlenebilir.
            </p>
            <p className="mt-3">
              Olası hukuki uyuşmazlıkların veya taleplerin yönetilmesi amacıyla gerekli
              olan kişisel veriler, bir hakkın tesisi, kullanılması veya korunması için
              veri işlemenin zorunlu olması hukuki sebebine dayanılarak işlenebilir.
            </p>
            <p className="mt-3">
              Bu işlemler için genel nitelikli kişisel verilerin işlenmesi açık rıza
              şartına bağlanmamaktadır. Formda açık rıza kutusu bulunmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">6. Kişisel veriler nasıl toplanır?</h2>
            <p>Kişisel veriler;</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>yagmursanat.com üzerindeki ücretsiz tanışma dersi formu,</li>
              <li>telefon görüşmeleri,</li>
              <li>
                ilgilinin tercih ederek akademi ile iletişim kurduğu WhatsApp gibi
                mesajlaşma kanalları ve
              </li>
              <li>
                gerektiğinde akademi yetkilisinin ilgili kişinin talebi üzerine takip
                sistemine manuel kayıt oluşturması
              </li>
            </ul>
            <p className="mt-3">yoluyla elektronik veya kısmen otomatik yöntemlerle elde edilebilir.</p>
            <p className="mt-3">
              İnternet sitesinin ve bilgi sistemlerinin güvenliğinin sağlanması
              kapsamında sınırlı teknik loglar otomatik yollarla oluşturulabilir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">7. Kişisel veriler kimlere aktarılabilir?</h2>
            <p>
              Kişisel verilerinize yalnızca görevleri gereği erişmesi gereken yetkili
              akademi çalışanları erişebilir.
            </p>
            <p className="mt-3">
              Kişisel verileriniz, hizmetin ve bilgi sistemlerinin çalıştırılması için
              gerekli olduğu ölçüde;
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>barındırma ve internet altyapısı hizmeti sağlayıcılarına,</li>
              <li>veri tabanı ve bulut altyapısı hizmeti sağlayıcılarına,</li>
              <li>
                iletişimin WhatsApp üzerinden gerçekleştirilmesi hâlinde ilgili
                mesajlaşma hizmeti sağlayıcısına,
              </li>
              <li>
                kanunen yetkili kamu kurum ve kuruluşlarına ve yetkili adli/idari
                mercilere
              </li>
            </ul>
            <p className="mt-3">aktarılabilir.</p>
            <p className="mt-3">
              Mevcut teknik altyapıda barındırma ve veri tabanı hizmetleri kapsamında
              Vercel ve Supabase gibi hizmet sağlayıcılardan yararlanılabilmektedir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">
              8. Kişisel verilerin yurt dışına aktarılması
            </h2>
            <p>
              Kullanılan bazı teknoloji ve iletişim hizmeti sağlayıcılarının yurt
              dışında yerleşik olması veya verileri yurt dışındaki sunucularda işlemesi
              nedeniyle kişisel veriler yurt dışına aktarılabilir.
            </p>
            <p className="mt-3">
              Yurt dışına kişisel veri aktarımı, KVKK’nın 9’uncu maddesinde öngörülen
              şartların mevcut olması ve yürürlükteki mevzuatta öngörülen uygun güvence
              mekanizmalarının sağlanması suretiyle gerçekleştirilir.
            </p>
            <p className="mt-3">
              Bu kapsamda veri tabanı, barındırma, güvenlik veya mesajlaşma
              hizmetlerinin sunulması amacıyla yurt dışında bulunan veri işleyenlere
              veri aktarımı gerçekleştirilebilir.
            </p>
            <p className="mt-3">
              WhatsApp üzerinden iletişim kurulması hâlinde telefon numarası ve
              mesajlaşma kapsamında paylaşılan bilgiler WhatsApp hizmetinin teknik
              işleyişi nedeniyle yurt dışında işlenebilir.
            </p>
            <p className="mt-3">
              Instagram, WhatsApp ve Google Maps gibi üçüncü taraf hizmetlere verilen
              bağlantıların kullanıcı tarafından tercih edilerek kullanılması hâlinde
              ilgili hizmet sağlayıcı ayrıca kendi gizlilik ve veri işleme kurallarını
              uygulayabilir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">9. Saklama süreleri</h2>
            <p>
              Ücretsiz tanışma dersi başvurusu ve akademi tarafından aynı amaçla manuel
              olarak oluşturulan başvuru kayıtları, başvurunun veya son anlamlı
              iletişimin tamamlanmasından itibaren en fazla 6 ay süreyle saklanır.
            </p>
            <p className="mt-3">
              Öğrencinin daha sonra kursa kesin kayıt yaptırması hâlinde, ücretsiz
              tanışma dersi kaydı kursun resmî öğrenci dosyasının yerine geçmez ve
              yalnızca tanışma dersi süreci bakımından gerekli süre boyunca muhafaza
              edilir.
            </p>
            <p className="mt-3">
              Bot, spam ve kötüye kullanımın önlenmesi amacıyla kullanılan IP bazlı
              teknik sayaçlar, ilgili güvenlik/rate-limit süresinin sona ermesiyle
              silinir.
            </p>
            <p className="mt-3">
              Barındırma ve bilgi güvenliği sistemlerinde oluşan teknik loglar,
              güvenlik ve hizmetin yürütülmesi için gerekli sınırlı süre boyunca veya
              hizmet sağlayıcının zorunlu teknik saklama süresi ile sınırlı olarak
              tutulur.
            </p>
            <p className="mt-3">
              Kişisel verilerin işlenmesini gerektiren hukuki sebebin ortadan kalkması
              hâlinde veriler KVKK ve ilgili imha mevzuatına uygun şekilde silinir, yok
              edilir veya anonim hâle getirilir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">10. 18 yaşından küçük öğrenciler</h2>
            <p>
              Akademi 4 yaşından itibaren öğrencilere eğitim verdiğinden, ücretsiz
              tanışma dersi başvuruları çocuklara ilişkin kişisel veri içerebilir.
            </p>
            <p className="mt-3">
              18 yaşından küçük bir öğrenci adına yapılan internet başvurusunun veli
              veya yasal temsilci tarafından gerçekleştirilmesi gerekir.
            </p>
            <p className="mt-3">Bu nedenle 18 yaşından küçük öğrenciler için:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>veli/yasal temsilci ad ve soyadı,</li>
              <li>veli/yasal temsilcinin iletişim telefonu ve</li>
              <li>başvuruyu veli/yasal temsilci sıfatıyla yaptığına ilişkin beyan</li>
            </ul>
            <p className="mt-3">alınır.</p>
            <p className="mt-3">
              Çocuklardan internet sitesi üzerinden doğrudan özel nitelikli kişisel
              veri talep edilmez.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">11. KVKK kapsamındaki haklarınız</h2>
            <p>
              KVKK’nın 11’inci maddesi kapsamında veri sorumlusuna başvurarak kişisel
              verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi
              talep etme, işlenme amacını ve amaca uygun kullanılıp kullanılmadığını
              öğrenme, kişisel verilerin aktarıldığı üçüncü kişileri bilme, eksik veya
              yanlış işlenen kişisel verilerin düzeltilmesini isteme, şartları
              oluşmuşsa kişisel verilerin silinmesini veya yok edilmesini isteme,
              düzeltme, silme veya yok etme işlemlerinin kişisel verilerin aktarıldığı
              üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle
              yapılan analiz sonucunda aleyhinize bir sonuç ortaya çıkmasına itiraz
              etme ve kişisel verilerin kanuna aykırı işlenmesi nedeniyle zarara
              uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">12. Başvuru yöntemi</h2>
            <p>KVKK kapsamındaki taleplerinizi;</p>
            <address className="mt-3 not-italic text-ink">
              {DATA_CONTROLLER_NAME}
              <br />
              İmbatlı Mahallesi, Yeni Girne No:205/B, Karşıyaka / İzmir
            </address>
            <p className="mt-3">
              adresine yazılı olarak veya KVKK ve ilgili ikincil mevzuatta öngörülen
              diğer başvuru yöntemlerini kullanarak iletebilirsiniz.
            </p>
            <p className="mt-3">
              KVKK ile ilgili soru ve iletişimleriniz için{" "}
              <a href={`mailto:${KVKK_EMAIL}`} className="text-plum hover:text-violet">
                {KVKK_EMAIL}
              </a>{" "}
              adresinden bize ulaşabilirsiniz.
            </p>
            <p className="mt-3">
              Başvurular, talebin niteliğine göre mümkün olan en kısa sürede ve
              mevzuatta öngörülen azami süre içinde sonuçlandırılır.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">13. Güncellemeler</h2>
            <p>
              Bu aydınlatma metni, kişisel veri işleme faaliyetlerinde, kullanılan
              altyapıda veya ilgili mevzuatta değişiklik olması hâlinde güncellenebilir.
              Güncel metin ve sürüm bilgisi her zaman{" "}
              <Link href="/kvkk-aydinlatma-metni" className="text-plum hover:text-violet">
                yagmursanat.com/kvkk-aydinlatma-metni
              </Link>{" "}
              adresinde yayımlanır.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
