import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Mesajlar" };

export default async function AdminMesajlarPage() {
  let messages: Array<{
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    message: string;
    status: string;
    created_at: string;
  }> = [];
  let fetchError = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("id, name, phone, email, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) fetchError = true;
    else messages = data ?? [];
  } catch {
    fetchError = true;
  }

  return (
    <div className="max-w-[900px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">İletişim Mesajları</h1>
        <p className="text-ink-muted mt-1">{messages.length} mesaj</p>
      </div>

      {fetchError && (
        <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-4 text-sm text-amber-800 mb-6">
          Veritabanı bağlantısı kurulamadı.
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-16 text-ink-muted border border-line rounded-[10px] bg-white">
          <p>Henüz mesaj yok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 bg-white border rounded-[10px] ${
                msg.status === "unread" ? "border-violet/40" : "border-line"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-medium text-ink">{msg.name}</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {[msg.phone, msg.email].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {msg.status === "unread" && (
                    <span className="inline-flex text-[11px] font-medium text-violet bg-violet/10 px-2 py-0.5 rounded-full">
                      Okunmadı
                    </span>
                  )}
                  <span className="text-xs text-ink-muted">{formatDate(msg.created_at)}</span>
                </div>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}