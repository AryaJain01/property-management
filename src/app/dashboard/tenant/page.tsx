import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getMyBookings } from "@/app/actions/booking"
import Link from "next/link"
import { Calendar, ChevronRight } from "lucide-react"

export default async function TenantDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "TENANT") {
    redirect("/login")
  }

  const bookings = await getMyBookings()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tenant Dashboard</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-2 text-indigo-600" /> My Bookings
          </h2>
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg">
            Book New Trip
          </Link>
        </div>

        <div className="p-0">
          {bookings.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              You don't have any bookings yet.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li key={booking.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{booking.property.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                        <span className={`px-2.5 py-1 rounded-full ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                        <span>•</span>
                        <span className="text-gray-900">Total: ${booking.totalAmount}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                       <button className="flex items-center text-indigo-600 font-medium hover:text-indigo-800">
                         View Details <ChevronRight className="w-4 h-4 ml-1" />
                       </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
