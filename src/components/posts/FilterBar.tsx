import { POST_TYPES, type PostType } from "@/types/post";

interface Props {
  active: PostType | "all";
  onChange: (t: PostType | "all") => void;
  query: string;
  onQuery: (s: string) => void;
  counts: Record<string, number>;
}

const FilterBar = ({ active, onChange, query, onQuery, counts }: Props) => {
  const items: { value: PostType | "all"; label: string }[] = [
    { value: "all", label: "All" },
    ...POST_TYPES,
  ];
  return (
    <div className="sticky top-20 z-30 -mx-4 px-4 py-3 backdrop-blur-md bg-background/85 border-b border-border">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {items.map((it) => {
          const isActive = active === it.value;
          const count = it.value === "all" ? Object.values(counts).reduce((a, b) => a + b, 0) : counts[it.value] ?? 0;
          return (
            <button
              key={it.value}
              onClick={() => onChange(it.value)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {it.label} <span className="opacity-60 ml-1">{count}</span>
            </button>
          );
        })}
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search tags or text…"
          className="ml-auto min-w-[180px] px-4 py-1.5 rounded-full text-xs bg-card border border-border focus:border-accent outline-none transition-colors"
        />
      </div>
    </div>
  );
};

export default FilterBar;
