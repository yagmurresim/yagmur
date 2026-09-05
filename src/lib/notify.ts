export async function notifyAcademy(subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) {
    console.info("[notify] skipped (RESEND_API_KEY / NOTIFY_EMAIL missing)");
    return;
  }

  const from = process.env.NOTIFY_FROM ?? "Yağmur Sanat <noreply@yagmursanatakademisi.com>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    if (!res.ok) {
      console.error("[notify] Resend failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[notify] Resend error:", err);
  }
}
