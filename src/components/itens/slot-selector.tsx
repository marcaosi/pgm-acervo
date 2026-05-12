"use client"

import { useState } from "react"

interface SlotSelectorProps {
  locations: Array<{
    id: string
    name: string
    groupers: Array<{
      id: string
      name: string
      slots: Array<{ id: string; name: string; code: string }>
    }>
  }>
  initialSlotId?: string | null
}

export function SlotSelector({ locations, initialSlotId }: SlotSelectorProps) {
  const initialLocation = initialSlotId
    ? locations.find((l) => l.groupers.some((g) => g.slots.some((s) => s.id === initialSlotId)))
    : undefined
  const initialGrouper = initialLocation?.groupers.find((g) =>
    g.slots.some((s) => s.id === initialSlotId)
  )

  const [selectedLocationId, setSelectedLocationId] = useState(initialLocation?.id ?? "")
  const [selectedGrouperId, setSelectedGrouperId] = useState(initialGrouper?.id ?? "")
  const [selectedSlotId, setSelectedSlotId] = useState(initialSlotId ?? "")

  const groupers =
    locations.find((l) => l.id === selectedLocationId)?.groupers ?? []
  const slots =
    groupers.find((g) => g.id === selectedGrouperId)?.slots ?? []

  const selectClass =
    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <select
        className={selectClass}
        value={selectedLocationId}
        onChange={(e) => {
          setSelectedLocationId(e.target.value)
          setSelectedGrouperId("")
          setSelectedSlotId("")
        }}
      >
        <option value="">Local</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={selectedGrouperId}
        disabled={!selectedLocationId}
        onChange={(e) => {
          setSelectedGrouperId(e.target.value)
          setSelectedSlotId("")
        }}
      >
        <option value="">Agrupador</option>
        {groupers.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <select
        name="slotId"
        className={selectClass}
        value={selectedSlotId}
        disabled={!selectedGrouperId}
        onChange={(e) => setSelectedSlotId(e.target.value)}
      >
        <option value="">Slot (opcional)</option>
        {slots.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {s.code}
          </option>
        ))}
      </select>
    </div>
  )
}
