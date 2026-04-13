import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBookingsForOwner } from "@/app/actions/booking"
import { getMyProperties } from "@/app/actions/property"
import { Building, ClipboardList } from "lucide-react"
import StatusUpdater from "./StatusUpdater"

export default async function OwnerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "OWNER") {
    redirect("/login")
  }

  const [properties, bookings] = await Promise.all([
    getMyProperties(),
    getBookingsForOwner()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Properties Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Building className="mr-2 text-indigo-600 w-5 h-5" /> My Properties
            </h2>
            <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{properties.length} Active</span>
          </div>

          <div className="p-0">
            {properties.length === 0 ? (
              <div className="p-10 text-center text-gray-500">No properties added yet.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {properties.map((prop) => (
                  <li key={prop.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                      <h3 className="font-bold text-gray-900">{prop.title}</h3>
                      <p className="text-sm text-gray-500">${prop.price}/day</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bookings Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <ClipboardList className="mr-2 text-indigo-600 w-5 h-5" /> Recent Requests
            </h2>
          </div>

          <div className="p-0 max-h-[500px] overflow-y-auto">
            {bookings.length === 0 ? (
              <div className="p-10 text-center text-gray-500">No booking requests.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.id} className="p-5 hover:bg-gray-50 transition">
                    <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-start">
                         <div>
                           <h3 className="font-bold text-gray-900 text-sm">{booking.property.title}</h3>
                           <p className="text-xs text-gray-500 mt-1">Tenant: {booking.tenant.name}</p>
                         </div>
                         <div className="text-right">
                           <div className="text-sm font-bold text-indigo-600">${booking.totalAmount}</div>
                           <div className="text-xs text-gray-500 mt-1">
                             {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                           </div>
                         </div>
                       </div>
                       <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                         <span className="text-xs text-gray-500">Status</span>
                         <StatusUpdater bookingId={booking.id} initialStatus={booking.status} />
                       </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
