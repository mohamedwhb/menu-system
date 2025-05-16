"use client"

import { useEffect, useRef, useState } from "react"
import { Spinner } from "@/components/ui/spinner"

interface FloorPlan3DViewProps {
  floorPlan: any
  selectedFloorId: string
  selectedRoomId: string
}

export function FloorPlan3DView({ floorPlan, selectedFloorId, selectedRoomId }: FloorPlan3DViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [renderer, setRenderer] = useState<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let scene: any = null
    let camera: any = null
    let renderer: any = null
    let controls: any = null
    let animationFrameId: number | null = null

    const initScene = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamically import Three.js
        const THREE = await import("three")
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls")

        // Initialize scene
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf9fafb)

        // Initialize camera
        camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000,
        )
        camera.position.set(0, 300, 300)

        // Initialize renderer
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        containerRef.current.appendChild(renderer.domElement)
        setRenderer(renderer)

        // Initialize controls
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.minDistance = 100
        controls.maxDistance = 500
        controls.maxPolarAngle = Math.PI / 2 - 0.1 // Prevent going below the floor

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        // Add directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(200, 300, 200)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = 1024
        directionalLight.shadow.mapSize.height = 1024
        scene.add(directionalLight)

        // Create floor
        const floorGeometry = new THREE.PlaneGeometry(600, 600)
        const floorMaterial = new THREE.MeshStandardMaterial({
          color: 0xe0e0e0,
          roughness: 0.8,
          metalness: 0.2,
        })
        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -Math.PI / 2
        floor.position.y = -0.5
        floor.receiveShadow = true
        scene.add(floor)

        // Find selected floor and room
        const selectedFloorObj = floorPlan.floors.find((f: any) => f.id === selectedFloorId)
        if (!selectedFloorObj) {
          setIsLoading(false)
          return
        }

        const selectedRoom = selectedFloorObj.rooms.find((r: any) => r.id === selectedRoomId)
        if (!selectedRoom) {
          setIsLoading(false)
          return
        }

        // Create walls
        selectedRoom.walls.forEach((wall: any) => {
          if (wall.type === "wall" || wall.type === "window") {
            const start = new THREE.Vector3(wall.x1 - 300, 0, wall.y1 - 300)
            const end = new THREE.Vector3(wall.x2 - 300, 0, wall.y2 - 300)

            // Calculate wall dimensions
            const length = start.distanceTo(end)
            const height = 40
            const thickness = 4

            // Create wall geometry
            const wallGeometry = new THREE.BoxGeometry(length, height, thickness)
            const wallMaterial = new THREE.MeshStandardMaterial({
              color: wall.type === "wall" ? 0xf5f5f5 : 0xa5f3fc,
              transparent: wall.type === "window",
              opacity: wall.type === "window" ? 0.3 : 1,
              roughness: 0.7,
              metalness: 0.2,
            })
            const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial)
            wallMesh.castShadow = true
            wallMesh.receiveShadow = true

            // Position and rotate wall
            const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
            wallMesh.position.set(midpoint.x, height / 2, midpoint.z)

            // Calculate rotation angle
            const direction = new THREE.Vector3().subVectors(end, start)
            const angle = Math.atan2(direction.z, direction.x)
            wallMesh.rotation.y = angle + Math.PI / 2

            scene.add(wallMesh)
          } else if (wall.type === "door") {
            // Create door frame
            const start = new THREE.Vector3(wall.x1 - 300, 0, wall.y1 - 300)
            const end = new THREE.Vector3(wall.x2 - 300, 0, wall.y2 - 300)

            // Calculate door dimensions
            const length = start.distanceTo(end)
            const height = 40
            const thickness = 4

            // Create door frame geometry (top part)
            const frameGeometry = new THREE.BoxGeometry(length, 5, thickness)
            const frameMaterial = new THREE.MeshStandardMaterial({
              color: 0xf5f5f5,
              roughness: 0.7,
              metalness: 0.2,
            })
            const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial)
            frameMesh.castShadow = true
            frameMesh.receiveShadow = true

            // Position and rotate frame
            const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
            frameMesh.position.set(midpoint.x, height - 2.5, midpoint.z)

            // Calculate rotation angle
            const direction = new THREE.Vector3().subVectors(end, start)
            const angle = Math.atan2(direction.z, direction.x)
            frameMesh.rotation.y = angle + Math.PI / 2

            scene.add(frameMesh)

            // Create door sides (left and right posts)
            const postGeometry = new THREE.BoxGeometry(thickness, height, thickness)
            const leftPost = new THREE.Mesh(postGeometry, frameMaterial)
            leftPost.position.set(start.x, height / 2, start.z)
            leftPost.castShadow = true
            leftPost.receiveShadow = true
            scene.add(leftPost)

            const rightPost = new THREE.Mesh(postGeometry, frameMaterial)
            rightPost.position.set(end.x, height / 2, end.z)
            rightPost.castShadow = true
            rightPost.receiveShadow = true
            scene.add(rightPost)
          }
        })

        // Create tables
        selectedRoom.tables.forEach((table: any) => {
          // Table top
          let tableGeometry
          const tableWidth = table.width
          const tableDepth = table.height

          if (table.shape === "circle" || table.shape === "oval") {
            // For circular tables, use cylinder geometry
            const radius = Math.min(tableWidth, tableDepth) / 2
            tableGeometry = new THREE.CylinderGeometry(radius, radius, 2, 32)
          } else {
            // For rectangular tables
            tableGeometry = new THREE.BoxGeometry(tableWidth, 2, tableDepth)
          }

          // Choose table color based on status
          let tableColor
          switch (table.status) {
            case "available":
              tableColor = 0x16a34a // Green
              break
            case "reserved":
              tableColor = 0xca8a04 // Yellow
              break
            case "occupied":
              tableColor = 0xdc2626 // Red
              break
            default:
              tableColor = 0x6b7280 // Gray
          }

          const tableMaterial = new THREE.MeshStandardMaterial({
            color: tableColor,
            roughness: 0.7,
            metalness: 0.2,
          })
          const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial)
          tableMesh.position.set(table.x - 300, 15, table.y - 300)
          tableMesh.rotation.y = (table.rotation * Math.PI) / 180
          tableMesh.castShadow = true
          tableMesh.receiveShadow = true
          scene.add(tableMesh)

          // Table legs
          const legGeometry = new THREE.CylinderGeometry(2, 2, 15, 8)
          const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x4b5563,
            roughness: 0.8,
            metalness: 0.2,
          })

          if (table.shape === "circle" || table.shape === "oval") {
            // For circular tables, add a single central leg
            const leg = new THREE.Mesh(legGeometry, legMaterial)
            leg.position.set(table.x - 300, 7.5, table.y - 300)
            leg.castShadow = true
            leg.receiveShadow = true
            scene.add(leg)
          } else {
            // For rectangular tables, add four legs
            const legPositions = [
              { x: -tableWidth / 2 + 5, z: -tableDepth / 2 + 5 },
              { x: tableWidth / 2 - 5, z: -tableDepth / 2 + 5 },
              { x: tableWidth / 2 - 5, z: tableDepth / 2 - 5 },
              { x: -tableWidth / 2 + 5, z: tableDepth / 2 - 5 },
            ]

            legPositions.forEach((pos) => {
              const leg = new THREE.Mesh(legGeometry, legMaterial)
              // Apply table rotation to leg positions
              const angle = (table.rotation * Math.PI) / 180
              const rotatedX = pos.x * Math.cos(angle) - pos.z * Math.sin(angle)
              const rotatedZ = pos.x * Math.sin(angle) + pos.z * Math.cos(angle)
              leg.position.set(table.x - 300 + rotatedX, 7.5, table.y - 300 + rotatedZ)
              leg.castShadow = true
              leg.receiveShadow = true
              scene.add(leg)
            })
          }

          // We'll skip 3D text for table numbers as it requires font loading
          // Instead, we'll use a simple indicator
          const indicatorGeometry = new THREE.BoxGeometry(5, 1, 5)
          const indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
          const indicatorMesh = new THREE.Mesh(indicatorGeometry, indicatorMaterial)
          indicatorMesh.position.set(table.x - 300, 17, table.y - 300)
          scene.add(indicatorMesh)
        })

        // Animation loop
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }

        animate()

        // Handle resize
        const handleResize = () => {
          if (!containerRef.current) return
          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(containerRef.current.clientWidth / containerRef.current.clientHeight)
        }

        window.addEventListener("resize", handleResize)

        setIsLoading(false)

        // Return cleanup function
        return () => {
          window.removeEventListener("resize", handleResize)
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId)
          }
          if (renderer && containerRef.current) {
            containerRef.current.removeChild(renderer.domElement)
          }
          if (renderer) {
            renderer.dispose()
          }
        }
      } catch (err) {
        console.error("Error initializing 3D scene:", err)
        setError("Fehler beim Laden der 3D-Ansicht. Bitte versuchen Sie es später erneut.")
        setIsLoading(false)
      }
    }

    const cleanup = initScene()

    return () => {
      if (typeof cleanup === "function") {
        cleanup()
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (renderer && containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [floorPlan, selectedFloorId, selectedRoomId])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (renderer && containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      if (renderer) {
        renderer.dispose()
      }
    }
  }, [renderer])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Spinner />
          <span className="ml-2">Lade 3D Ansicht...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50">
          <div className="text-red-500 mb-2">{error}</div>
          <div className="text-sm text-gray-500 max-w-md text-center">
            Die 3D-Ansicht konnte nicht geladen werden. Bitte verwenden Sie die 2D-Ansicht oder versuchen Sie es später
            erneut.
          </div>
        </div>
      )}
      {!isLoading && !error && !renderer && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-sm text-gray-500 max-w-md text-center">
            3D-Ansicht ist in dieser Umgebung nicht verfügbar. Bitte verwenden Sie die 2D-Ansicht.
          </div>
        </div>
      )}
    </div>
  )
}
