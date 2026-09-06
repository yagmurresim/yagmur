import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import {
  DATA_CONTROLLER_BUSINESS,
  DATA_CONTROLLER_NAME,
  INTRO_KVKK_EFFECTIVE,
  KVKK_EMAIL,
} from "@/lib/kvkk";

export const metadata: Metadata = buildMetadata({
  title: "Gizlilik Politikası | Yağmur Sanat Akademisi",
  description:
    "Yağmur Sanat Akademisi gizlilik politikası. Site kullanımı, ücretsiz tanışma dersi başvuruları ve teknik veriler.",
  canonical: "/gizlilik",
  noindex: true,
});

export default function GizlilikPage() {
  return (
    <article className="bg-paper pt-32 pb-24 text-ink lg:pt-44 lg:pb-32">
      <div className="mx-auto max-w-[760px] px-6 lg:px-0">
        <p className="text-[13px] text-ink-muted">
          Yürürlük {INTRO_KVKK_EFFECTIVE}
        </p>
        <h1 className="font-display mt-4 text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95]">
          Gizlilik politikası
        </h1>

        <div className="mt-10 flex flex-col gap-8 text-[16px] leading-relaxed text-ink-muted">
          <p>
            Bu gizlilik politikası, yagmursanat.com internet sitesinin kullanımı
            sırasında kişisel verilerin ve teknik bilgilerin nasıl işlendiğini
            açıklamaktadır. Site, Özel Yağmur Sanat Akademisi Kursu’nun tanıtımı ile
            ücretsiz tanışma dersi taleplerinin alınması amacıyla kullanılmaktadır.
          </p>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">1. Veri sorumlusu</h2>
            <address className="not-italic text-ink">
              {DATA_CONTROLLER_NAME}
              <br />
              Kurum/işletme: {DATA_CONTROLLER_BUSINESS}
              <br />
              Marka: Yağmur Sanat Akademisi
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
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">2. Site hangi amaçla kullanılır?</h2>
            <p>yagmursanat.com;</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Yağmur Sanat Akademisi ve eğitimleri hakkında bilgi sunmak,</li>
              <li>resim, piyano, keman ve gitar eğitimlerini tanıtmak,</li>
              <li>akademinin iletişim ve adres bilgilerini paylaşmak,</li>
              <li>ücretsiz tanışma dersi için gün ve saat seçilmesini sağlamak ve</li>
              <li>başvuruların akademi tarafından takip edilmesini sağlamak</li>
            </ul>
            <p className="mt-3">amacıyla kullanılan bir tanıtım ve başvuru sitesidir.</p>
            <p className="mt-3">
              Site üzerinden online ödeme alınmaz, öğrenci üyeliği oluşturulmaz ve
              kesin kurs kaydı yapılmaz.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">3. Site üzerinden toplanan bilgiler</h2>
            <p>Sitenin ücretsiz tanışma dersi bölümünü kullanmanız hâlinde;</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>öğrenci ad ve soyadı,</li>
              <li>öğrenci yaşı,</li>
              <li>18 yaşından küçük öğrenciler için veli/yasal temsilci ad ve soyadı,</li>
              <li>telefon numarası,</li>
              <li>ilgilenilen eğitim,</li>
              <li>uygun olduğu ölçüde grup/birebir tercihi,</li>
              <li>seçilen gün ve saat,</li>
              <li>başvurunun oluşturulduğu tarih, kaynağı ve durumu,</li>
              <li>aydınlatma metni sürümü ve bilgilendirme kaydı</li>
            </ul>
            <p className="mt-3">işlenebilir.</p>
            <p className="mt-3">
              Sitenin kötüye kullanımını önlemek için IP adresi ve benzeri sınırlı
              teknik veriler geçici olarak işlenebilir. IP adresi ücretsiz tanışma
              dersi başvuru kaydının içine eklenmez.
            </p>
            <p className="mt-3">
              Sitede ziyaretçilerin fotoğraf, kimlik belgesi veya başka bir belge
              yükleyebileceği bir alan bulunmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">4. Telefon ve WhatsApp üzerinden iletişim</h2>
            <p>
              Site üzerindeki telefon veya WhatsApp bağlantılarını kullanarak akademi
              ile doğrudan iletişim kurabilirsiniz. Bu durumda, tarafınızdan paylaşılan
              ad, telefon, yaş, ilgilenilen eğitim ve randevu bilgileri talebinizi
              karşılamak amacıyla akademi tarafından işlenebilir.
            </p>
            <p className="mt-3">
              Başvurunun takibi gerekiyorsa bu bilgiler akademinin takip sistemine
              manuel olarak kaydedilebilir.
            </p>
            <p className="mt-3">
              WhatsApp kullanılması hâlinde kişisel veriler ayrıca WhatsApp hizmetinin
              teknik altyapısı kapsamında işlenebilir ve yurt dışına aktarılabilir.
              WhatsApp’ın kendi hizmetleri bakımından uyguladığı gizlilik kuralları
              ayrıca geçerlidir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">5. Kişisel verilerin kullanım amaçları</h2>
            <p>Toplanan kişisel veriler;</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>talep edilen ücretsiz tanışma dersini oluşturmak,</li>
              <li>uygun gün ve saat planlaması yapmak,</li>
              <li>başvuru sahibiyle randevu hakkında iletişim kurmak,</li>
              <li>başvuruyu akademi içinde takip etmek,</li>
              <li>siteyi ve başvuru sistemini kötüye kullanımdan korumak,</li>
              <li>teknik sorunları ve güvenlik olaylarını tespit etmek ve</li>
              <li>gerektiğinde hukuki yükümlülüklerin yerine getirilmesini sağlamak</li>
            </ul>
            <p className="mt-3">amaçlarıyla kullanılabilir.</p>
            <p className="mt-3">Kişisel veriler;</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>üçüncü kişilere satılmaz,</li>
              <li>reklam profili oluşturmak için kullanılmaz,</li>
              <li>e-posta/SMS pazarlama listesine otomatik olarak eklenmez,</li>
              <li>otomatik karar verme veya profilleme amacıyla kullanılmaz.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">6. Altyapı hizmet sağlayıcıları</h2>
            <p>
              Sitenin ve başvuru sisteminin çalıştırılması sırasında barındırma ve
              veri tabanı hizmeti sağlayıcılarından yararlanılmaktadır. Mevcut teknik
              yapı kapsamında bu hizmetler arasında Vercel ve Supabase bulunabilir.
            </p>
            <p className="mt-3">
              Bu hizmet sağlayıcılar verileri, hizmetin sunulması için gerekli ölçüde
              ve sözleşmesel/veri koruma yükümlülükleri kapsamında işleyebilir. Bazı
              sağlayıcıların yurt dışında bulunması veya yurt dışındaki altyapıları
              kullanması nedeniyle kişisel veriler KVKK’nın yurt dışına aktarım
              hükümleri çerçevesinde yurt dışında işlenebilir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">7. Harici bağlantılar</h2>
            <p>
              Sitede WhatsApp, Instagram ve Google Maps gibi üçüncü taraf hizmetlere
              yönlendiren bağlantılar bulunabilir. Bu bağlantılardan birini
              seçtiğinizde ilgili üçüncü tarafın internet sitesine veya uygulamasına
              yönlendirilirsiniz.
            </p>
            <p className="mt-3">
              Bu üçüncü taraf hizmetlerin kendi gizlilik politikaları ve veri işleme
              uygulamaları bulunmaktadır. Yağmur Sanat Akademisi, bu platformların
              kendi sistemlerinde gerçekleştirdiği bağımsız veri işleme faaliyetlerini
              yönetmez.
            </p>
            <p className="mt-3">
              Sitedeki ücretsiz tanışma dersi formunda verdiğiniz bilgiler bu
              bağlantılara yalnızca bağlantıya tıklamanız nedeniyle otomatik olarak
              aktarılmaz.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">8. Çerezler ve analitik</h2>
            <p>
              Sitenin mevcut yapılandırmasında ziyaretçileri reklam amacıyla takip eden
              reklam/pazarlama çerezleri kullanılmamaktadır. Google Analytics, Meta
              Pixel veya benzeri davranışsal reklam/analitik araçları mevcut durumda
              etkin değildir.
            </p>
            <p className="mt-3">
              Sitenin güvenli ve teknik olarak çalışması için kesinlikle gerekli teknik
              kayıtlar veya zorunlu nitelikte teknolojiler kullanılabilir.
            </p>
            <p className="mt-3">
              İleride analitik, reklam veya zorunlu olmayan başka takip teknolojilerinin
              kullanıma alınması hâlinde bu politika güncellenecek ve mevzuatın
              gerektirdiği durumlarda kullanıcı tercihlerini almaya yönelik uygun çerez
              yönetim mekanizması devreye alınacaktır.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">9. Saklama</h2>
            <p>
              Ücretsiz tanışma dersi başvuruları ve aynı amaçla manuel oluşturulan
              takip kayıtları, başvurunun veya son anlamlı iletişimin tamamlanmasından
              itibaren en fazla 6 ay süreyle tutulur. Bu sürenin sonunda veriler
              bakımından başka bir hukuki saklama sebebi bulunmuyorsa kişisel veriler
              silinir, yok edilir veya anonim hâle getirilir.
            </p>
            <p className="mt-3">
              Bot ve kötüye kullanım önleme amacıyla işlenen IP tabanlı rate-limit
              kayıtları teknik süre sona erdiğinde otomatik olarak silinir. Teknik
              güvenlik ve sistem logları, hizmetin güvenliğinin sağlanması için gerekli
              sınırlı süreyle muhafaza edilebilir.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">10. Veri güvenliği</h2>
            <p>
              Kişisel verilere erişim, görevi gereği bu verilere erişmesi gereken
              yetkili kişilerle sınırlandırılır. Başvuru kayıtları herkese açık
              değildir.
            </p>
            <p className="mt-3">
              Akademi, kişisel verilerin hukuka aykırı işlenmesini, hukuka aykırı
              erişilmesini ve kaybolmasını veya yetkisiz şekilde değiştirilmesini
              önlemek amacıyla uygun teknik ve idari tedbirler uygular.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">11. Çocukların gizliliği</h2>
            <p>
              Akademi 4 yaşından itibaren öğrencilere hizmet verdiği için site
              üzerinden yapılan başvurular çocuklara ilişkin kişisel veri içerebilir.
            </p>
            <p className="mt-3">
              18 yaşından küçük öğrenciler adına internet sitesi üzerinden yapılacak
              başvuruların veli veya yasal temsilci tarafından gerçekleştirilmesi
              gerekir. Bu başvurularda öğrencinin adı ve yaşı ile veli/yasal
              temsilcinin adı ve iletişim bilgisi, yalnızca tanışma dersinin
              düzenlenmesi için gerekli ölçüde işlenir.
            </p>
            <p className="mt-3">
              Site üzerinden çocuklara ilişkin sağlık veya diğer özel nitelikli kişisel
              veriler talep edilmez.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">12. Haklarınız</h2>
            <p>
              Kişisel verileriniz hakkında 6698 sayılı Kişisel Verilerin Korunması
              Kanunu’nun 11’inci maddesinde belirtilen haklara sahipsiniz. Bu haklar
              kapsamında veri sorumlusuna başvurarak kişisel verilerinizin işlenip
              işlenmediğini öğrenebilir, işlenen verilere ilişkin bilgi talep edebilir,
              gerekli şartların bulunması hâlinde düzeltme veya silme talebinde
              bulunabilir ve kanunda düzenlenen diğer haklarınızı kullanabilirsiniz.
            </p>
            <p className="mt-3">
              Başvuru yöntemleri ve ayrıntılı açıklamalar için{" "}
              <Link href="/kvkk-aydinlatma-metni" className="text-plum hover:text-violet">
                KVKK Aydınlatma Metni
              </Link>
              ’ni inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-3 text-2xl text-ink">13. Politika değişiklikleri</h2>
            <p>
              Bu gizlilik politikası; internet sitesinin işlevlerinde, kullanılan
              hizmet sağlayıcılarda, kişisel veri işleme faaliyetlerinde veya
              mevzuatta meydana gelen değişikliklere göre güncellenebilir. Güncel sürüm
              her zaman{" "}
              <Link href="/gizlilik" className="text-plum hover:text-violet">
                yagmursanat.com/gizlilik
              </Link>{" "}
              adresinde yayımlanır.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
