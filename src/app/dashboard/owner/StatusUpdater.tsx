"use client"

import { useState } from "react"
import { updateBookingStatus } from "@/app/actions/booking"
import { useRouter } from "next/navigation"

export default function StatusUpdater({ bookingId, initialStatus }: { bookingId: number, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true)
    try {
      await updateBookingStatus(bookingId, newStatus)
      setStatus(newStatus)
      router.refresh()
    } catch (e) {
      alert("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={loading}
      className={`text-sm font-medium rounded-lg px-2.5 py-1 border focus:outline-none focus:ring-2 disabled:opacity-50 ${
        status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200 focus:ring-green-500' : 
        status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500' : 
                                 'bg-yellow-50 text-yellow-700 border-yellow-200 focus:ring-yellow-500'
      }`}
    >
      <option value="PENDING">PENDING</option>
      <option value="CONFIRMED">CONFIRMED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  )
}
