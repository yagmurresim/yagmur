import { applicationStatusLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

const COLOR_MAP: Record<string, string> = {
  violet: "bg-violet/10 text-violet",
  blue: "bg-blue-50 text-blue-700",
  orange: "bg-orange-50 text-orange-700",
  green: "bg-green-50 text-green-700",
  gray: "bg-gray-100 text-gray-500",
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color } = applicationStatusLabel(status);
  return (
    <span
      className={cn(
        "inline-flex text-xs font-medium px-2.5 py-1 rounded-full",
        COLOR_MAP[color] ?? COLOR_MAP.gray
      )}
    >
      {label}
    </span>
  );
}