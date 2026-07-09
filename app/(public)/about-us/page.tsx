import Link from "next/link";
import { ChevronRight, Store, Truck, ShieldCheck, Heart } from "lucide-react";

export const metadata = {
  title: "About Us | Sreedhar Store",
  description: "Learn more about Sreedhar Store",
};

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-neutral-900 font-medium">About Us</span>
      </nav>

      <div className="rounded-3xl bg-white shadow-sm border border-neutral-200 overflow-hidden">
        <div className="bg-brand-50 p-10 text-center sm:p-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">Welcome to Sreedhar Store</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-700">
            Your trusted neighborhood hypermarket, committed to bringing the freshest produce and everyday essentials directly to your doorstep in Bukkapatnam and beyond.
          </p>
        </div>

        <div className="p-8 sm:p-12 lg:px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Story</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Sreedhar Store began with a simple idea: to make grocery shopping seamless, affordable, and accessible for everyone in Puttaparthi. For years, we have been a staple in the Bukkapatnam community, known for our wide selection and commitment to quality.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Today, we are taking our legacy online. We've combined our years of retail experience with modern technology to create a shopping experience that fits perfectly into your busy lifestyle. Whether you need fresh vegetables, dairy, or household items, we ensure you get the best products at prices below MRP.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-start p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <Store className="h-8 w-8 text-brand-600 mb-4" />
                <h3 className="font-bold text-neutral-900 mb-2">Local Roots</h3>
                <p className="text-sm text-neutral-600">Deeply embedded in the Bukkapatnam community, understanding exactly what you need.</p>
              </div>
              
              <div className="flex flex-col items-start p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <Truck className="h-8 w-8 text-brand-600 mb-4" />
                <h3 className="font-bold text-neutral-900 mb-2">Fast Delivery</h3>
                <p className="text-sm text-neutral-600">Reliable and swift delivery services ensuring your groceries arrive fresh and on time.</p>
              </div>
              
              <div className="flex flex-col items-start p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <ShieldCheck className="h-8 w-8 text-brand-600 mb-4" />
                <h3 className="font-bold text-neutral-900 mb-2">Quality Assured</h3>
                <p className="text-sm text-neutral-600">Every product is handpicked and quality checked before it makes its way to your home.</p>
              </div>

              <div className="flex flex-col items-start p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <Heart className="h-8 w-8 text-brand-600 mb-4" />
                <h3 className="font-bold text-neutral-900 mb-2">Customer First</h3>
                <p className="text-sm text-neutral-600">Your satisfaction is our priority. We are always here to listen and improve.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
