interface ViloyatCardProps {
  name: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}

export default function ViloyatCard({
  name,
  count,
  selected,
  onClick,
}: ViloyatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl p-4 text-left transition-all hover:shadow-md border border-outline-variant/15 ${
        selected
          ? 'bg-primary text-on-primary shadow-ambient'
          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
      }`}
    >
      <span className={`material-symbols-outlined shrink-0 text-[20px] ${selected ? 'text-on-primary' : 'text-primary'}`}>
        location_on
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-headline text-sm font-semibold">
          {name}
        </p>
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${selected ? 'bg-on-primary/20 text-on-primary' : 'bg-primary/10 text-primary'}`}>
        {count} loyiha
      </span>
    </button>
  );
}
