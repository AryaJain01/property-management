"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { createBooking } from "@/app/actions/booking"

export default function BookingForm({ 
  propertyId, 
  price 
}: { 
  propertyId: number, 
  price: number 
}) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Calculate days and total
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const rawDays = start && end ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) : 0;
  const days = rawDays > 0 ? rawDays : 0;
  const total = days * price;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }
    if ((session.user as any).role !== "TENANT") {
      setError("Only tenants can book properties. Please login as a tenant.");
      return;
    }

    if (!startDate || !endDate || days <= 0) {
      setError("Please select valid dates");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const booking = await createBooking(propertyId, new Date(startDate), new Date(endDate));
      router.push(`/dashboard/tenant?bookingSuccess=${booking.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-indigo-100 border border-indigo-50 sticky top-24">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex justify-between items-center">
        <span>Book this stay</span>
        <span className="text-indigo-600 text-3xl">${price}<span className="text-sm text-gray-500 font-normal">/day</span></span>
      </h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleBook} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Check-in</label>
            <input 
              type="date" 
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Check-out</label>
            <input 
              type="date" 
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-6 space-y-3">
          <div className="flex justify-between text-gray-600 font-medium">
            <span>${price} x {days} days</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 font-medium">
            <span>Service fee</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-slate-100 mt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || days <= 0}
          className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-xl mt-6 hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Reserve"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">You won't be charged yet</p>
      </form>
    </div>
  )
}
