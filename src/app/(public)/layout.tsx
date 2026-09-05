import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { getSiteSettings, getDefaultSettings } from "@/server/queries/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = (await getSiteSettings()) ?? getDefaultSettings();

  return (
    <>
      <ScrollToTop />
      <SiteHeader settings={settings} />
      <main id="main-content">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}