import { getProperties } from "@/app/actions/property"
import Link from "next/link"
import { Search, MapPin, Star } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function Home(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const searchTerm = searchParams?.q || "";
  
  const properties = await getProperties({ searchTerm })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 text-white overflow-hidden py-32">
        <div className="absolute inset-0 top-0 left-0 w-full h-full object-cover opacity-20 pointer-events-none mix-blend-overlay">
          <img src="https://images.unsplash.com/photo-1564013799912-fa8269e96f92?q=80&w=2070&auto=format&fit=crop" alt="Hero background" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Find Your Next Perfect Stay.
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10">
            Book premium college apartments and luxury suites with ease. 
          </p>
          
          <form className="max-w-3xl mx-auto bg-white rounded-full p-2 flex shadow-xl" method="GET" action="/">
            <div className="flex-1 flex items-center pl-4 bg-transparent text-gray-900">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                name="q"
                defaultValue={searchTerm}
                placeholder="Search by city, property name, etc." 
                className="w-full py-3 bg-transparent outline-none border-none text-lg placeholder-gray-400 font-medium"
              />
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Properties Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {searchTerm ? `Search Results for "${searchTerm}"` : "Featured Properties"}
          </h2>
          <p className="text-gray-500 mt-2">Discover our hand-picked selection of top-tier accommodations.</p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl text-gray-600 font-semibold mb-2">No properties found.</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria.</p>
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-6 py-2 rounded-lg">
              Clear Search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => {
              const avgRating = property.reviews.length > 0 
                ? (property.reviews.reduce((a, b) => a + b.rating, 0) / property.reviews.length).toFixed(1) 
                : "New";

              return (
                <Link href={`/property/${property.id}`} key={property.id} className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                  <div className="relative h-60 overflow-hidden">
                    {property.imageUrl ? (
                      <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{avgRating}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{property.title}</h3>
                    </div>
                    <div className="flex items-center text-gray-500 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
                      <MapPin className="w-4 h-4 mr-1 shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </div>
                    <div className="mt-auto flex justify-between items-end border-t pt-4">
                      <div>
                        <span className="text-2xl font-bold text-indigo-700">${property.price}</span>
                        <span className="text-gray-500 text-sm"> / day</span>
                      </div>
                      <span className="text-sm text-gray-400">By {property.owner.name}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
