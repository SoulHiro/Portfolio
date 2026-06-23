export function PostBlockquote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6 my-8 py-1">
      <div className="w-0.5 flex-shrink-0 bg-muted-foreground/40 rounded-full" />
      <blockquote className="font-display italic text-quote text-muted-foreground leading-relaxed">
        {children}
      </blockquote>
    </div>
  );
}
