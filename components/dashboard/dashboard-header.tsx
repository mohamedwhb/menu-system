interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight text-[#1F1F1F]">{title}</h1>
      {description && <p className="text-sm text-[#6B7280]">{description}</p>}
    </div>
  )
}
