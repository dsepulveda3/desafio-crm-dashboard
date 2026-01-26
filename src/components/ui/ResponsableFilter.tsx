"use client";

interface ResponsableFilterProps {
  responsables: string[];
  selected: string | null;
  onChange: (responsable: string | null) => void;
}

export function ResponsableFilter({
  responsables,
  selected,
  onChange,
}: ResponsableFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-400">Filtrar por:</span>
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
          selected === null
            ? "bg-white text-slate-900"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        Todos
      </button>
      {responsables.map((resp) => (
        <button
          key={resp}
          onClick={() => onChange(resp)}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            selected === resp
              ? "bg-white text-slate-900"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {resp}
        </button>
      ))}
    </div>
  );
}
