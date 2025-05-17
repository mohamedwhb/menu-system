"use client"

import { Suspense } from "react"
import { FloorPlanEditor } from "./floor-plan-editor"

export function FloorPlanEditorWrapper() {
  return (
    <Suspense fallback={<div>Loading floor plan...</div>}>
      <FloorPlanEditor />
    </Suspense>
  )
} 