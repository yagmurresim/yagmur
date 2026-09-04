import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const number = cleaned.startsWith("90") ? cleaned : `90${cleaned.replace(/^0/, "")}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildInstagramUrl(handle: string): string {
  const cleaned = handle.startsWith("@") ? handle.slice(1) : handle;
  return `https://www.instagram.com/${cleaned}/`;
}

export function buildMapsUrl(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function programFormatLabel(formats: string[]): string {
  const labels: Record<string, string> = {
    group: "Grup",
    individual: "Birebir",
  };
  return formats.map((f) => labels[f] ?? f).join(" & ");
}

export function applicationStatusLabel(status: string): {
  label: string;
  color: string;
} {
  const map: Record<string, { label: string; color: string }> = {
    NEW: { label: "Yeni", color: "violet" },
    CONTACTED: { label: "İletişime Geçildi", color: "blue" },
    INTRO_PLANNED: { label: "Tanışma Dersi", color: "orange" },
    ENROLLED: { label: "Kayıt Oldu", color: "green" },
    CLOSED: { label: "Kapandı", color: "gray" },
  };
  return map[status] ?? { label: status, color: "gray" };
}

export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}