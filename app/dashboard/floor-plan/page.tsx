import { Suspense } from "react"
import { FloorPlanHeader } from "@/components/dashboard/floor-plan/floor-plan-header"
import { FloorPlanEditor } from "@/components/dashboard/floor-plan/floor-plan-editor"
import { FloorPlanSidebar } from "@/components/dashboard/floor-plan/floor-plan-sidebar"

export default function FloorPlanPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const planId = typeof searchParams.id === "string" ? searchParams.id : "default"

  return (
    <div className="space-y-6">
      <FloorPlanHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-[#EAEAEA] bg-white p-6 shadow-sm h-[calc(100vh-13rem)]">
            <Suspense fallback={<div>Loading floor plan...</div>}>
              <FloorPlanEditor initialPlanId={planId} />
            </Suspense>
          </div>
        </div>

        <div className="lg:col-span-1">
          <FloorPlanSidebar />
        </div>
      </div>
    </div>
  )
}
