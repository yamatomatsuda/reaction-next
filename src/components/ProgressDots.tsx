type Props = { total: number; done: number };

export function ProgressDots({ total, done }: Props) {
  return (
    <div className="flex justify-center gap-2" aria-label={`${done} / ${total} 回`}>
      {Array.from({ length: total }, (_, i) => (
        <i
          key={i}
          className={`size-3 rounded-full border-2 ${
            i < done ? "border-go bg-go" : "border-muted bg-panel"
          }`}
        />
      ))}
    </div>
  );
}
