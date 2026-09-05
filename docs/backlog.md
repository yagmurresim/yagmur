# Backlog

## Tanışma dersi — mail bildirimi (sonra)

Şimdi: siteden seçilen saat `applications`’a düşer (`INTRO_PLANNED`, kaynak: Site). Akademi **Takip** ekranından görür. Mail yok.

Sonra, istenirse:
- [resend.com](https://resend.com) API key
- Vercel env: `RESEND_API_KEY`, `NOTIFY_EMAIL`, `NOTIFY_FROM`
- Gönderen domain Resend’de doğrulanır

Kod hazır (`src/lib/notify.ts`); env yoksa atlar. Kurulum yapılmadan akademi kutusuna mail gitmez.
