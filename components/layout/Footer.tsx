// components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Store Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
                G
              </div>
              <span className="text-lg font-bold text-surface-900">General Store</span>
            </div>
            <p className="text-sm text-surface-500 leading-relaxed">
              Your trusted local grocery store. Fresh products delivered to your doorstep.
            </p>
            <p className="mt-3 text-sm text-surface-500">
              📍 Local Delivery Area Only
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Help &amp; Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/policies/privacy" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  Return &amp; Refund
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/cancellation" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Delivery info + Copyright */}
        <div className="mt-10 border-t border-surface-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              🚚 Free delivery on orders above ₹500
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-600">
              💵 Cash on Delivery
            </span>
          </div>
          <p className="text-sm text-surface-400">
            © {new Date().getFullYear()} General Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
