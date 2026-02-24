"use client"

interface EmptyViewProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function EmptyView({ icon, title, description }: EmptyViewProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-20">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        {icon}
      </div>
      <h3 className="mb-1.5 text-base font-bold text-foreground text-center">{title}</h3>
      <p className="text-xs text-muted-foreground text-center max-w-[220px] leading-relaxed">
        {description}
      </p>
    </div>
  )
}
