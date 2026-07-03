import { Heart, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const wishlistItems = [
    {
      id: "prod-1",
      name: "Fresh Red Apples",
      brand: "Farm Fresh",
      price: "₹120",
      originalPrice: "₹150",
      unit: "1 kg",
      inStock: true,
      image: "/placeholder-apple.jpg", // Using placeholder for now, or just colored box
    },
    {
      id: "prod-2",
      name: "Whole Wheat Bread",
      brand: "Modern",
      price: "₹45",
      originalPrice: "₹55",
      unit: "400 g",
      inStock: true,
      image: "/placeholder-bread.jpg",
    },
    {
      id: "prod-3",
      name: "Organic Milk",
      brand: "Nandini",
      price: "₹30",
      originalPrice: "₹30",
      unit: "500 ml",
      inStock: false,
      image: "/placeholder-milk.jpg",
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">My Wishlist</h1>
          <p className="mt-1 text-sm text-neutral-500">Save your favorite items for later.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-neutral-300 py-2 pl-10 pr-3 text-sm placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Search wishlist..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card hover:shadow-elevated transition-shadow">
            <div className="relative aspect-square bg-neutral-100 flex items-center justify-center p-4">
              {/* Product Image Placeholder */}
              <div className="text-6xl">{item.name.includes("Apple") ? "🍎" : item.name.includes("Bread") ? "🍞" : "🥛"}</div>
              <button className="absolute right-2 top-2 rounded-full p-1.5 text-danger-500 hover:bg-neutral-200/50 transition-colors">
                <Heart className="h-5 w-5 fill-current" />
              </button>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-1 text-xs text-neutral-500">{item.brand}</div>
              <h3 className="mb-2 line-clamp-2 text-sm font-medium text-neutral-900">
                <Link href={`/product/${item.id}`} className="hover:underline">
                  {item.name}
                </Link>
              </h3>
              <div className="mb-3 text-xs text-neutral-500">{item.unit}</div>
              <div className="mt-auto flex items-end justify-between">
                <div>
                  <div className="text-base font-semibold text-neutral-900">{item.price}</div>
                  {item.originalPrice !== item.price && (
                    <div className="text-xs text-neutral-400 line-through">{item.originalPrice}</div>
                  )}
                </div>
                {item.inStock ? (
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 text-white transition-colors hover:bg-brand-600">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">Add to cart</span>
                  </button>
                ) : (
                  <span className="text-xs font-medium text-danger-500">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}