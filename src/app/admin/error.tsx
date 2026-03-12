"use client";

export default function AdminError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
      <p className="text-sm">Ocorreu um erro ao carregar a página de administração.</p>
      <button
        className="text-xs underline"
        onClick={reset}
      >
        Tentar novamente
      </button>
    </div>
  );
}
