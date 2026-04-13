import { getPropertyById } from "@/app/actions/property"
import { notFound } from "next/navigation"
import { MapPin, Star, User, Building, Phone } from "lucide-react"
import BookingForm from "./BookingForm"

export default async function PropertyDetails(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const property = await getPropertyById(parseInt(params.id));

  if (!property) return notFound();

  const avgRating = property.reviews.length > 0 
    ? (property.reviews.reduce((a, b) => a + b.rating, 0) / property.reviews.length).toFixed(1) 
    : "New";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{property.title}</h1>
      <div className="flex items-center text-gray-600 mb-8 space-x-4">
        <div className="flex items-center space-x-1 font-semibold">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span>{avgRating}</span>
          <span className="text-gray-400 font-normal">({property.reviews.length} reviews)</span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center space-x-1">
          <MapPin className="w-5 h-5 text-gray-400" />
          <span className="underline">{property.address}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-12 h-[50vh] rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
        {property.imageUrl ? (
          <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full">No image uploaded</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10 border-r border-gray-100 pr-10">
          
          <div className="flex justify-between items-center pb-8 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Hosted by {property.owner.name}</h2>
              <p className="text-gray-500 flex items-center space-x-2">
                <Building className="w-4 h-4" /> <span>Professional Host</span>
              </p>
            </div>
            <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
              {property.owner.name.charAt(0)}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">About this property</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{property.description}</p>
          </div>
          
          <div className="pb-8 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
            {property.reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet for this property.</p>
            ) : (
              <div className="space-y-6">
                {property.reviews.map((review) => (
                  <div key={review.id} className="bg-slate-50 p-6 rounded-2xl">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {review.tenant?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{review.tenant?.name || "Unknown User"}</div>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Booking Form */}
        <div className="lg:col-span-1">
          <BookingForm propertyId={property.id} price={property.price} />
        </div>
      </div>
    </div>
  )
}
