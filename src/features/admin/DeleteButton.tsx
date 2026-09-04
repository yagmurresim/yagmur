"use client";

interface DeleteButtonProps {
  label?: string;
  confirmMessage?: string;
  formAction: (formData: FormData) => void | Promise<void>;
}

export function DeleteButton({
  label = "Sil",
  confirmMessage = "Bu kaydı silmek istediğinizden emin misiniz?",
  formAction,
}: DeleteButtonProps) {
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="h-9 px-4 text-sm text-red-600 border border-red-200 rounded-[8px] hover:bg-red-50 transition-colors"
      >
        {label}
      </button>
    </form>
  );
}