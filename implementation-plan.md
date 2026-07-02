# Implementation Plan — General Store Online (Local Delivery E-commerce)

> **Update note:** This revision merges the original MVP plan with the full feature list from
> `Changes required.md`. The new list is significantly larger than the original MVP scope
> (adds a delivery-boy role, coupons, wishlist, reviews, banners, analytics, audit logs,
> security settings, import/export, and a full notification system). Where the new
> requirements conflict with an earlier "Confirmed Business Rule," that rule has been updated
> below and the change is called out explicitly so it can be reviewed.

## 0. What Changed From the Original Plan (Scope Delta)

* **New user role:** `DELIVERY_BOY` added (needed for "Assign Delivery Boy" in Order
  Management). Original plan had `CUSTOMER`/`ADMIN` only.
* **Coupons pulled into initial build:** Cart requires "Apply Coupon" and Checkout requires a
  "Coupon" section — this was previously deferred to Phase 7 backlog. Now in scope.
* **Wishlist pulled into initial build:** Full wishlist feature set (add/remove, move to cart,
  stock/price display, sharing, sorting, search) was not in the original plan at all.
* **Reviews pulled into initial build:** Product reviews with admin approve/delete.
* **Banner management:** Homepage/Offer/Festival banners — new admin module.
* **Catalog operations:** Import/Export products (CSV), Brand as its own manageable entity
  (previously just a free-text field on `Product`).
* **Admin analytics, reports, audit logs, and security settings:** All new — dashboard cards,
  sales/orders/revenue charts, daily/weekly/monthly reports, full audit trail, login
  history/failed attempts/active sessions.
* **Customer notification system:** In-app notification center with granular category filters
  and channel toggles (email/SMS/push), not just transactional emails.
* **Address management upgraded:** Google Maps pinning, auto-detect location, address types,
  delivery-availability check — original plan had a simple flat `Address` model.
* **Help & Support module:** FAQs, contact info, policy pages, feedback/ratings — new.
* **Payment Methods setting:** Admin can configure available payment methods. **Actual online
  payment gateway integration (Razorpay/UPI) remains a Phase 7/backlog item** unless you
  confirm you want it moved into the initial build — COD stays the only *live* payment method
  at launch, but the data model and settings screen now support adding more later without a
  schema change.

Everything else from the original plan (tech stack, order lifecycle, return policy, general
directory conventions) is unchanged and extended below.

---

## 1. Project Summary

A local-delivery e-commerce platform for a general/grocery store. Customers browse products
organized by category → subcategory → product → variant, place orders online, pay cash on
delivery (with the door left open for more payment methods later), and can cancel, return
(replacement-only), review, and wishlist products. A delivery boy can be assigned to an order.
Admin manages catalog, stock, orders, marketing (banners/coupons/notifications), and store
operations (reports, analytics, audit logs, security) from a dashboard.

**Confirmed Business Rules**

* Delivery: local area only, no multi-city logistics
* Payment: Cash on Delivery is the only *active* method at launch; other methods are
  configurable in Settings for future enablement
* Delivery charge: ₹50 flat if order value < ₹500, free if ≥ ₹500
* Order lifecycle: `PLACED → CONFIRMED → PACKED → OUT_FOR_DELIVERY → DELIVERED`
* Cancellation: allowed only up to `CONFIRMED` status
* Returns: window of 1–2 days after delivery, **replacement only** (no cash/online refund,
  since payment is COD), eligibility depends on product/category (`returnable` flag)
* Coupons: percentage or flat-amount, admin-created, optional min-order-value and
  expiry/usage-limit, applied at cart/checkout
* Notifications: Email (via Nodemailer) at key order/account stages, plus an in-app
  notification center with read/unread state and category filters
* Users: `CUSTOMER`, `ADMIN`, and `DELIVERY_BOY` roles
* Product variants: size/weight/quantity based, each variant has its own price and stock, all
  variants shown on a single product page (Flipkart-style selector)
* Brands and Categories are both independently manageable entities (for filtering and admin
  catalog operations), not just free-text fields

---

## 2. Tech Stack (versions as of mid-2026 — pin exact patch at project init)

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack default) | Node.js ≥ 20.9 required; run `npx create-next-app@latest` to pull current stable |
| Language | **TypeScript 5.x** | Strict mode enabled |
| ORM | **Prisma ORM 7.x** | Ships as ESM; requires `prisma.config.ts`; query engine runs as WASM |
| Database | **Neon (Serverless Postgres)** | Use `@prisma/adapter-neon` or Neon's HTTP driver for edge/serverless compatibility |
| Styling | **Tailwind CSS v4** | CSS-first config (`@theme` in globals.css, no `tailwind.config.js` needed) |
| Auth | **Better Auth** (latest) | Use `@better-auth/prisma-adapter`; email/password + OTP plugin (needed for OTP Verification page + mobile verify) |
| Email | **Nodemailer** | Via SMTP (e.g. Gmail app password, Brevo, or Resend SMTP relay) |
| Charts | **Recharts** | Admin dashboard cards/charts, analytics, reports |
| CSV Import/Export | **papaparse** (client) / **csv-parse** + **csv-stringify** (server) | Product import/export |
| Maps | **Google Maps JavaScript API + Geocoding API** | Address pin-on-map, auto-detect location, PIN/ZIP validation |
| File/Image storage | **Object storage with signed URLs** (e.g. Vercel Blob, S3, or Cloudinary) | Product images, banner images |
| Deployment | Vercel (recommended for Next.js) or any Node host | Neon pairs natively with serverless deploys |

> ⚠️ Before running `npm install`, verify exact current versions with `npm view <package> version`,
> since all of these ship frequent releases. Do not hardcode version numbers into `package.json`
> from memory — resolve at install time with `@latest`.

---

## 3. Project Directory Structure

```
general-store/
├── prisma/
│   ├── schema.prisma
│   ├── prisma.config.ts
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (public)/                          # Landing + customer-facing, no auth required
│   │   │   ├── page.tsx                        # Landing/home page (banners, categories, deals)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                    # All products / search results
│   │   │   │   └── [slug]/page.tsx             # Single product: variants, reviews, wishlist
│   │   │   ├── category/[slug]/page.tsx
│   │   │   ├── brands/[slug]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── help/page.tsx                   # FAQ, contact us
│   │   │   ├── policies/[slug]/page.tsx        # Privacy, T&C, Return/Refund, Shipping, Cancellation
│   │   │   └── about/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── verify-otp/page.tsx
│   │   ├── (customer)/                         # Requires CUSTOMER auth
│   │   │   ├── account/
│   │   │   │   ├── page.tsx                    # Personal Details tab
│   │   │   │   ├── address/page.tsx
│   │   │   │   ├── orders/page.tsx
│   │   │   │   ├── orders/[id]/page.tsx
│   │   │   │   ├── orders/[id]/return/page.tsx
│   │   │   │   ├── wishlist/page.tsx
│   │   │   │   ├── notifications/page.tsx
│   │   │   │   ├── help/page.tsx
│   │   │   │   └── change-password/page.tsx
│   │   │   └── checkout/page.tsx
│   │   ├── (admin)/                            # Requires ADMIN auth
│   │   │   ├── dashboard/page.tsx              # Cards + Sales/Orders/Revenue charts
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                    # list, delete
│   │   │   │   ├── new/page.tsx
│   │   │   │   ├── [id]/edit/page.tsx
│   │   │   │   ├── import/page.tsx
│   │   │   │   └── export/page.tsx
│   │   │   ├── categories/page.tsx             # add/edit/delete
│   │   │   ├── brands/page.tsx                 # add/edit/delete
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx                    # current stock, low-stock alerts
│   │   │   │   └── history/page.tsx            # stock movement log
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                    # view, accept, reject, filter
│   │   │   │   └── [id]/page.tsx                # assign delivery boy, print invoice, update status
│   │   │   ├── returns/page.tsx
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx                    # view, block, edit
│   │   │   │   └── [id]/page.tsx                # order history
│   │   │   ├── delivery-boys/page.tsx          # manage delivery personnel
│   │   │   ├── banners/page.tsx                # homepage/offer/festival banners
│   │   │   ├── reviews/page.tsx                # approve/delete
│   │   │   ├── reports/page.tsx                # daily/weekly/monthly, top products, low stock, customers
│   │   │   ├── notifications/send/page.tsx     # send offers / order updates / new products
│   │   │   ├── coupons/page.tsx                # create/edit/deactivate coupons
│   │   │   ├── settings/page.tsx               # store info, delivery charges, payment methods,
│   │   │   │                                    # business rules, email settings, currency, languages
│   │   │   ├── analytics/page.tsx              # revenue/sales/growth/product/customer-growth charts
│   │   │   ├── audit-logs/page.tsx             # login, product, order, admin, settings change logs
│   │   │   └── security/page.tsx               # login history, failed attempts, active sessions
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts          # Better Auth handler
│   │   │   ├── products/route.ts
│   │   │   ├── products/import/route.ts
│   │   │   ├── products/export/route.ts
│   │   │   ├── categories/route.ts
│   │   │   ├── brands/route.ts
│   │   │   ├── inventory/route.ts
│   │   │   ├── cart/route.ts
│   │   │   ├── coupons/apply/route.ts
│   │   │   ├── wishlist/route.ts
│   │   │   ├── reviews/route.ts
│   │   │   ├── orders/route.ts
│   │   │   ├── orders/[id]/status/route.ts
│   │   │   ├── orders/[id]/assign-delivery/route.ts
│   │   │   ├── orders/[id]/invoice/route.ts
│   │   │   ├── returns/route.ts
│   │   │   ├── banners/route.ts
│   │   │   ├── notifications/route.ts
│   │   │   ├── reports/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   ├── audit-logs/route.ts
│   │   │   ├── settings/route.ts
│   │   │   └── webhooks/                       # future: payment gateway
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                                 # buttons, inputs, badges, modals
│   │   ├── product/                            # ProductCard, VariantSelector, ReviewList, WishlistButton
│   │   ├── cart/                                # CartItem, CouponInput
│   │   ├── admin/                               # tables, forms, charts, ImportExportPanel
│   │   ├── notifications/                       # NotificationBell, NotificationList
│   │   ├── maps/                                 # AddressMapPicker
│   │   └── layout/                              # Header, Footer, Sidebar, BannerCarousel
│   ├── lib/
│   │   ├── auth.ts                             # Better Auth server config
│   │   ├── auth-client.ts                      # Better Auth client hooks
│   │   ├── prisma.ts                           # Prisma client singleton
│   │   ├── mailer.ts                           # Nodemailer transport + templates
│   │   ├── rbac.ts                             # role guard helpers (CUSTOMER/ADMIN/DELIVERY_BOY)
│   │   ├── audit.ts                            # writeAuditLog() helper called from mutations
│   │   ├── coupons.ts                          # coupon validation/apply logic
│   │   ├── maps.ts                             # geocoding + PIN validation helpers
│   │   └── validators/                         # zod schemas per entity
│   ├── emails/                                 # email HTML templates
│   ├── hooks/
│   ├── types/
│   └── middleware.ts                           # route protection, RBAC checks
├── public/
├── .env.example
├── next.config.ts
├── tailwind config (via globals.css @theme)
├── tsconfig.json
└── package.json
```

---

## 4. Database Structure (Prisma Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CUSTOMER
  ADMIN
  DELIVERY_BOY
}

enum OrderStatus {
  PLACED
  CONFIRMED
  PACKED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
  REJECTED
}

enum ReturnStatus {
  REQUESTED
  APPROVED
  REJECTED
  REPLACEMENT_SCHEDULED
  CLOSED
}

enum AddressType {
  HOME
  WORK
  OTHER
}

enum BannerType {
  HOMEPAGE
  OFFER
  FESTIVAL
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

enum CouponType {
  PERCENTAGE
  FLAT
}

enum NotificationCategory {
  ORDERS
  OFFERS
  PAYMENTS
  ACCOUNT
  RESTOCK
  PRICE_DROP
}

model User {
  id                String    @id @default(cuid())
  name              String
  email             String    @unique
  emailVerified     Boolean   @default(false)
  phone             String?   @unique
  password          String?   // hashed, managed by Better Auth
  role              Role      @default(CUSTOMER)
  isBlocked         Boolean   @default(false)
  addresses         Address[]
  orders            Order[]
  deliveries        Order[]   @relation("DeliveryBoyOrders")
  wishlistItems     WishlistItem[]
  reviews           Review[]
  notifications     Notification[]
  notificationPrefs NotificationPreference?
  sessions          Session[]
  accounts          Account[]
  auditLogs         AuditLog[]
  loginHistory      LoginHistory[]
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

// Better Auth required models
model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
}

model Account {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  providerId String
  accountId  String
  password   String?
  createdAt  DateTime @default(now())
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
}

model Address {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        AddressType @default(HOME)
  fullName    String
  mobile      String
  houseNo     String
  street      String
  landmark    String?
  city        String
  state       String
  pincode     String
  country     String      @default("India")
  latitude    Float?
  longitude   Float?
  isDefault   Boolean     @default(false)
  orders      Order[]
}

model Brand {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  logoUrl  String?
  products Product[]
}

model Category {
  id           String     @id @default(cuid())
  name         String
  slug         String     @unique
  parentId     String?
  parent       Category?  @relation("CategoryToSubcategory", fields: [parentId], references: [id])
  children     Category[] @relation("CategoryToSubcategory")
  isReturnable Boolean    @default(true)   // default return eligibility for products in this category
  products     Product[]
  imageUrl     String?
}

model Product {
  id            String         @id @default(cuid())
  name          String
  slug          String         @unique
  description   String?
  brandId       String?
  brand         Brand?         @relation(fields: [brandId], references: [id])
  categoryId    String
  category      Category       @relation(fields: [categoryId], references: [id])
  isReturnable  Boolean?       // override category default if set
  isActive      Boolean        @default(true)
  images        String[]
  variants      Variant[]
  reviews       Review[]
  wishlistItems WishlistItem[]
  avgRating     Decimal?       @db.Decimal(2, 1)  // denormalized, recomputed on review approve
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Variant {
  id           String         @id @default(cuid())
  productId    String
  product      Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  label        String         // "500ml", "1L", "5L"
  unit         String         // ml, L, kg, g, pcs
  price        Decimal        @db.Decimal(10, 2)
  stock        Int            @default(0)
  lowStockAt   Int            @default(10)  // threshold for low-stock alert
  sku          String         @unique
  orderItems   OrderItem[]
  cartItems    CartItem[]
  stockHistory StockHistory[]
}

model StockHistory {
  id        String   @id @default(cuid())
  variantId String
  variant   Variant  @relation(fields: [variantId], references: [id], onDelete: Cascade)
  change    Int      // positive = restock, negative = deduction
  reason    String   // "order", "manual adjustment", "return restock", etc.
  changedBy String?  // admin userId, null if system-generated
  createdAt DateTime @default(now())
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  items     CartItem[]
  couponId  String?
  coupon    Coupon?    @relation(fields: [couponId], references: [id])
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variantId String
  variant   Variant @relation(fields: [variantId], references: [id])
  quantity  Int     @default(1)

  @@unique([cartId, variantId])
}

model Coupon {
  id            String     @id @default(cuid())
  code          String     @unique
  type          CouponType
  value         Decimal    @db.Decimal(10, 2)  // percentage or flat amount
  minOrderValue Decimal?   @db.Decimal(10, 2)
  maxDiscount   Decimal?   @db.Decimal(10, 2)  // cap for percentage coupons
  usageLimit    Int?
  usedCount     Int        @default(0)
  isActive      Boolean    @default(true)
  expiresAt     DateTime?
  carts         Cart[]
  orders        Order[]
  createdAt     DateTime   @default(now())
}

model Order {
  id             String           @id @default(cuid())
  orderNumber    String           @unique   // human-readable e.g. ORD-00231
  userId         String
  user           User             @relation(fields: [userId], references: [id])
  addressId      String
  address        Address          @relation(fields: [addressId], references: [id])
  status         OrderStatus      @default(PLACED)
  items          OrderItem[]
  subtotal       Decimal          @db.Decimal(10, 2)
  deliveryCharge Decimal          @db.Decimal(10, 2)
  couponId       String?
  coupon         Coupon?          @relation(fields: [couponId], references: [id])
  discountAmount Decimal          @default(0) @db.Decimal(10, 2)
  totalAmount    Decimal          @db.Decimal(10, 2)
  paymentMethod  String           @default("COD")
  deliveryBoyId  String?
  deliveryBoy    User?            @relation("DeliveryBoyOrders", fields: [deliveryBoyId], references: [id])
  cancelledAt    DateTime?
  cancelReason   String?
  rejectedAt     DateTime?
  rejectReason   String?
  returns        ReturnRequest[]
  statusHistory  OrderStatusLog[]
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

model OrderItem {
  id           String  @id @default(cuid())
  orderId      String
  order        Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variantId    String
  variant      Variant @relation(fields: [variantId], references: [id])
  quantity     Int
  priceAtOrder Decimal @db.Decimal(10, 2)  // snapshot, price may change later
}

model OrderStatusLog {
  id        String      @id @default(cuid())
  orderId   String
  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  status    OrderStatus
  note      String?
  changedBy String?     // admin/delivery-boy userId
  changedAt DateTime    @default(now())
}

model ReturnRequest {
  id          String       @id @default(cuid())
  orderId     String
  order       Order        @relation(fields: [orderId], references: [id])
  orderItemId String
  reason      String
  status      ReturnStatus @default(REQUESTED)
  adminNote   String?
  requestedAt DateTime     @default(now())
  resolvedAt  DateTime?
}

model Review {
  id        String       @id @default(cuid())
  productId String
  product   Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    String
  user      User         @relation(fields: [userId], references: [id])
  rating    Int          // 1-5
  comment   String?
  status    ReviewStatus @default(PENDING)
  createdAt DateTime     @default(now())
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  addedAt   DateTime @default(now())

  @@unique([userId, productId])
}

model Banner {
  id        String     @id @default(cuid())
  type      BannerType
  title     String
  imageUrl  String
  linkUrl   String?
  isActive  Boolean    @default(true)
  startsAt  DateTime?
  endsAt    DateTime?
  createdAt DateTime   @default(now())
}

model Notification {
  id        String                @id @default(cuid())
  userId    String
  user      User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  category  NotificationCategory
  title     String
  body      String
  isRead    Boolean               @default(false)
  createdAt DateTime              @default(now())
}

model NotificationPreference {
  id       String  @id @default(cuid())
  userId   String  @unique
  user     User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  email    Boolean @default(true)
  sms      Boolean @default(false)
  push     Boolean @default(false)
}

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  user       User?    @relation(fields: [userId], references: [id])
  action     String   // "PRODUCT_UPDATED", "ORDER_STATUS_CHANGED", "SETTINGS_CHANGED", etc.
  entityType String
  entityId   String?
  metadata   Json?
  createdAt  DateTime @default(now())
}

model LoginHistory {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  success   Boolean
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
}

model StoreSetting {
  id              String  @id @default(cuid())
  storeName       String
  storeAddress    String?
  supportPhone    String?
  supportEmail    String?
  whatsappNumber  String?
  currency        String  @default("INR")
  language        String  @default("en")
  deliveryChargeFlat  Decimal @default(50) @db.Decimal(10, 2)
  freeDeliveryAbove  Decimal @default(500) @db.Decimal(10, 2)
  activePaymentMethods String[] @default(["COD"])
  smtpFromEmail   String?
}
```

**Indexing notes:** add `@@index` on `Product.categoryId`, `Product.brandId`, `Order.userId`,
`Order.status`, `Order.deliveryBoyId`, `OrderItem.orderId`, `Notification.userId`,
`AuditLog.entityType`, and `Review.productId` once query patterns stabilize — Prisma +
Postgres will need these for catalog filtering, admin order-list, notification-center, and
report performance at scale.

---

## 5. RBAC (Role-Based Access Control)

**Roles:** `CUSTOMER`, `ADMIN`, `DELIVERY_BOY` — stored on the `User.role` field, set by
Better Auth session.

| Area | Customer | Admin | Delivery Boy |
|---|---|---|---|
| Browse catalog | ✅ | ✅ | — |
| Cart / Checkout / Coupons | ✅ (own cart only) | ❌ | — |
| Wishlist / Reviews | ✅ (own only) | ✅ (approve/delete reviews) | — |
| View own orders | ✅ | ✅ (all orders) | ✅ (assigned orders only) |
| Cancel own order (pre-Confirmed) | ✅ | ✅ (override) | ❌ |
| Request return | ✅ (own order, within window) | — | — |
| Manage products/categories/brands | ❌ | ✅ | ❌ |
| Update stock/price | ❌ | ✅ | ❌ |
| Update order status | ❌ | ✅ | ✅ (limited: Packed → Out for Delivery → Delivered, for assigned orders) |
| Assign delivery boy | ❌ | ✅ | ❌ |
| Approve/reject returns | ❌ | ✅ | ❌ |
| View/block customer list | ❌ | ✅ | ❌ |
| Manage banners/coupons/notifications-send | ❌ | ✅ | ❌ |
| View reports/analytics/audit logs/security | ❌ | ✅ | ❌ |
| Manage store settings | ❌ | ✅ | ❌ |

**Enforcement layers (defense in depth):**

1. **Middleware** (`src/middleware.ts`) — blocks route access to `(admin)` group unless
   session role is `ADMIN`; blocks `(customer)` routes unless authenticated; a lightweight
   `(delivery)` route group (or admin sub-view) restricts order-status updates to a
   delivery boy's own assigned orders.
2. **Server Actions / API routes** — every mutating action re-checks `session.user.role`
   server-side. Never trust client-sent role claims.
3. **Data-layer scoping** — customer queries always filter `where: { userId: session.user.id }`
   and delivery-boy order queries always filter `where: { deliveryBoyId: session.user.id }`, so
   no user can fetch data outside their own scope by guessing an ID.

```ts
// lib/rbac.ts (concept)
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function requireDeliveryBoy() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "DELIVERY_BOY") {
    throw new Error("Forbidden");
  }
  return session;
}
```

Every mutating action that changes catalog, orders, settings, or admin activity should also
call `writeAuditLog()` (see `lib/audit.ts`) so the Audit Logs screen has real data instead of
being backfilled later.

---

## 6. Security Requirements

* **Authentication:** Better Auth with hashed + salted credentials (handled internally by
  the library); enforce strong password policy (min 8 chars, at least 1 number); OTP plugin
  enabled for mobile/email verification.
* **Session management:** HTTP-only, secure, `SameSite=Lax` cookies; short-lived session
  tokens with rotation on privilege-sensitive actions; sessions listed and revocable from
  **Security Settings → Active Sessions**.
* **Login tracking:** Every login attempt (success and failure) is written to `LoginHistory`
  and surfaced in **Security Settings → Login History / Failed Attempts**; consider a simple
  lockout/backoff after repeated failures on one account.
* **Input validation:** Every API route/server action validates input with `zod` before
  touching the database — never trust client payloads (price, stock, role, coupon values, etc.).
* **Authorization:** RBAC checks server-side on every mutation (see Section 5) — client-side
  role checks are for UX only, never for security.
* **SQL/Injection safety:** Prisma parameterizes all queries by default — avoid
  `$queryRawUnsafe` entirely; if raw SQL is ever needed, use `$queryRaw` with tagged templates
  only.
* **Rate limiting:** Apply rate limits on `/api/auth/*`, checkout, coupon-apply, and
  return-request routes to prevent brute force / abuse (e.g. Upstash Redis or in-memory
  limiter for low traffic).
* **CSRF protection:** Better Auth issues same-site cookies; ensure state-changing routes are
  POST/PUT/DELETE only, never GET.
* **Environment secrets:** `DATABASE_URL`, SMTP credentials, Google Maps API key, and Better
  Auth secret stored in `.env` (never committed) and as encrypted environment variables on the
  hosting platform.
* **Price integrity:** Always recompute order total (subtotal, delivery charge, coupon
  discount) server-side from `Variant.price` and `Coupon` rules at order time — never trust a
  client-submitted total.
* **Stock race conditions:** Decrement stock inside a Prisma transaction at order placement,
  and write a `StockHistory` row, to prevent overselling under concurrent checkouts.
* **File/image uploads:** Product images and banner images validated for file type/size and
  stored via a signed-URL object storage (not raw filesystem) to avoid path traversal.
* **Least privilege DB access:** Neon connection string scoped to the app's own database/role;
  no superuser credentials in the app runtime.
* **HTTPS everywhere:** Enforced by hosting platform (Vercel does this by default).
* **Audit trail:** `OrderStatusLog` and the new global `AuditLog` table give a durable history
  of who changed what, when — useful for dispute resolution given COD + replacement-only
  returns, and required by the new Audit Logs admin screen.
* **Coupon abuse prevention:** Server-side check on `usageLimit`/`usedCount` and
  `minOrderValue` inside the same transaction that places the order, to prevent race-condition
  over-redemption.

---

## 7. UI Design Guidelines

* **Design tone:** Clean, functional, trustworthy — closer to Blinkit/local kirana app than a
  luxury e-commerce brand. Prioritize scanability over decoration.
* **Navigation:** Persistent header with Search, Wishlist icon, Notification bell (unread
  count badge), Cart icon (with count), Account. Category menu accessible from home and a
  sticky sub-nav on category/product pages.
* **Color system:** One primary brand color (e.g. store's own branding) + neutral grays;
  green/red reserved consistently for stock status and order status badges; a distinct accent
  color for offer/festival banners and coupon badges.
* **Typography:** One clean sans-serif (e.g. Inter) — large legible price text, since many
  users will browse on mobile.
* **Mobile-first:** Assume most customers order from phones. Bottom-fixed "Add to Cart" bar
  on product pages; large tap targets throughout.
* **Homepage banners:** Auto-rotating carousel for Homepage/Offer/Festival banners, dismissible
  on mobile after first view per session.
* **Product card:** Image, name, brand, starting price ("From ₹60"), average rating (stars),
  stock badge, wishlist heart, quick-add.
* **Product page:** Image gallery, variant selector (pill/chip style, price updates live),
  returnable/non-returnable badge, rating + review list, quantity stepper, sticky add-to-cart,
  wishlist toggle.
* **Cart/Checkout:** Single-page checkout where possible — address selection (with map
  picker), coupon input with live discount preview, order summary, delivery charge shown
  transparently (₹50 or "FREE" above ₹500), COD confirmation, single "Place Order" action.
* **Order status:** Visual stepper (Placed → Confirmed → Packed → Out for Delivery →
  Delivered) matching the diagram already agreed on, with cancel/return actions surfaced only
  at the stages where they're valid, and delivery-boy contact info shown once assigned.
* **Notification center:** Simple list grouped by category (Orders/Offers/Payments/Account)
  with read/unread state, mark-all-read, and per-channel toggle switches in settings.
* **Admin dashboard:** Data-table-first (orders, products) with inline status updates, clear
  low-stock indicators, top-of-page KPI cards (Total Products, Total Orders, Pending Orders,
  Today's Sales, Revenue, Customers, Low Stock, Recent Orders), and Sales/Orders/Revenue trend
  charts — since the actual admin workflow is "check dashboard → check orders → prepare →
  update status."
* Use **Tailwind CSS v4** utility classes directly; keep a small shared component library
  (`components/ui`) for buttons, badges, and form inputs to keep visual consistency without a
  heavy design system.

---

## 8. Pages Overview

### Public / Landing (no auth)

* Hero banner carousel (Homepage/Offer/Festival banners)
* Category shortcuts (grid of 6–8 categories)
* Featured/deal products, brand shortcuts
* Search bar (prominent)
* Footer: delivery area info, contact, policies

### Authentication Pages

* Login, Register (Name, Email, Mobile, Password, Confirm Password, Address, City, State, Pin
  code)
* Forgot / Reset Password
* Verify Email, OTP Verification (mobile)
* Change Password (authenticated)

### Shopping Cart

* Quantity update, remove product, apply coupon (live discount preview), total price,
  delivery charge, checkout button

### Checkout Page

* Delivery address (select/add, map picker), payment method (COD; others shown as
  "coming soon" if disabled in Settings), order summary, coupon, Place Order

### Customer Dashboard (auth required, role = CUSTOMER)

* **Personal Details** — profile edit
* **Address** — add/edit/delete, set default, address type (Home/Work/Other), map pin,
  PIN/ZIP validation, delivery-availability check
* **Orders** — list with status badges → detail page with status stepper; view, cancel
  (if eligible), download invoice, return product (if eligible), track order
* **Wishlist** — add/remove, move to cart, stock/price/discount display, restock alert opt-in,
  share, sort (price/popularity/newest), search within wishlist
* **Notifications** — category-filtered list, mark read/unread, delete, clear all, per-channel
  toggles (email/SMS/push)
* **Help & Support** — searchable FAQ (by category: Order/Payment/Delivery/Returns/Account),
  Contact Us (phone, email, WhatsApp, hours, store address on map), Policies (Privacy, T&C,
  Return/Refund, Shipping, Cancellation), Feedback & Ratings (shopping experience, support,
  feature suggestions, complaints), Account Assistance (change/reset password, verify
  email/mobile, manage login devices, delete-account request)
* **Logout / Delete Account**

### Admin Dashboard (auth required, role = ADMIN)

* **Dashboard** — KPI cards (Total Products, Total Orders, Pending Orders, Today's Sales,
  Revenue, Customers, Low Stock, Recent Orders) + Sales/Orders/Revenue charts
* **Products** — list/search/filter, create/edit/delete product + variants, images,
  import/export (CSV), stock management shortcut, category/brand assignment
* **Categories** — add/edit/delete, tree management
* **Brands** — add/edit/delete
* **Inventory** — current stock, low-stock alerts, stock history, update stock
* **Orders** — view, accept/reject, assign delivery boy, print invoice, update status
  (cancellation cutoff enforced automatically at `CONFIRMED`)
* **Returns** — queue of requested returns → approve/reject → mark replacement
  scheduled/closed
* **Customers** — view, block/unblock, edit, order history
* **Delivery Boys** — manage delivery personnel, view their assigned/completed orders
* **Banners** — manage Homepage/Offer/Festival banners (image, link, active window)
* **Reviews** — approve/delete
* **Reports** — daily/weekly/monthly sales, top products, low stock, customer reports
  (exportable)
* **Notifications** — send Offers / Order Updates / New Product announcements to customers
* **Coupons** — create/edit/deactivate, usage tracking
* **Settings** — store information, delivery charges, payment methods, business rules, email
  settings, currency, languages
* **Analytics** — Revenue, Sales, Growth, Product Performance, Customer Growth charts
* **Audit Logs** — Login, Product Changes, Order Updates, Admin Activities, Settings Changes
* **Security Settings** — Login History, Failed Attempts, Active Sessions

---

## 9. Email Notifications (Nodemailer)

**Transport setup (`lib/mailer.ts`):**

```ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

**Trigger points and templates:**

| Event | Recipient | Content |
|---|---|---|
| Account registered | Customer | Welcome + verify email |
| OTP requested | Customer | OTP code for verification |
| Order placed | Customer | Order summary, items, total, delivery address |
| Order confirmed | Customer | Confirmation notice |
| Order packed | Customer | "Being prepared" notice |
| Out for delivery | Customer | Delivery today notice + delivery boy contact, ETA |
| Delivered | Customer | Delivery confirmation + return window reminder (1–2 days) + review request |
| Order cancelled / rejected | Customer | Cancellation/rejection confirmation |
| Return requested | Admin | New return to review |
| Return approved/rejected | Customer | Outcome + next steps |
| Replacement scheduled | Customer | Replacement delivery notice |
| Wishlist item back in stock | Customer | Restock notice |
| Wishlist item price drop | Customer | Price-drop alert |
| New offer / festival sale | Customer (opted-in) | Marketing email, admin-triggered from Notifications module |
| New login / password change | Customer | Security alert |
| New order (admin copy) | Admin | So admin sees new orders immediately without checking dashboard constantly |

Keep templates in `src/emails/` as simple HTML strings or JSX-to-HTML (e.g. `react-email` is
optional — plain HTML template functions are sufficient for this scale). Send emails from
server actions/API routes only, never from the client. In-app notifications (the
`Notification` model) are written alongside the email send so the Notification Center always
reflects the same events, respecting each user's `NotificationPreference`.

---

## 10. Implementation Phases

Each phase below lists the exact files/routes from Section 3's directory structure that get
built, so progress can be checked directly against the tree rather than against a vague task
name.

### **Phase 0 — Setup (Week 1)**

* Initialize Next.js 16 + TypeScript project, Tailwind v4, ESLint → scaffolds
  `next.config.ts`, `tsconfig.json`, `src/app/globals.css`, `package.json`
* `prisma/schema.prisma`, `prisma/prisma.config.ts` — connect to Neon, run first migration
* `src/lib/prisma.ts` — Prisma client singleton
* `src/lib/auth.ts`, `src/lib/auth-client.ts` — Better Auth (email/password + OTP plugin),
  `src/app/api/auth/[...all]/route.ts`
* `src/lib/mailer.ts` — Nodemailer transport with a test SMTP account
* `src/middleware.ts` — stub route-group protection (fleshed out in Phase 7)
* `src/app/layout.tsx` — root layout, deploy a "hello world" build to validate the pipeline

### **Phase 1 — Core Catalog (Weeks 2–3)**

* Prisma models: `Brand`, `Category`, `Product`, `Variant`, `StockHistory`; `prisma/seed.ts`
  for demo data
* `src/app/api/categories/route.ts`, `src/app/api/brands/route.ts`, `src/app/api/products/route.ts`
* Admin: `(admin)/categories/page.tsx`, `(admin)/brands/page.tsx`, `(admin)/products/page.tsx`,
  `(admin)/products/new/page.tsx`, `(admin)/products/[id]/edit/page.tsx`
* Public: `(public)/page.tsx`, `(public)/category/[slug]/page.tsx`,
  `(public)/brands/[slug]/page.tsx`, `(public)/products/page.tsx`,
  `(public)/products/[slug]/page.tsx`
* `components/product/ProductCard`, `VariantSelector`; `lib/validators/` zod schemas for
  product/category/brand
* Basic search (by product name) on `(public)/products/page.tsx`

### **Phase 2 — Cart, Coupons & Checkout (Weeks 3–4)**

* Prisma models: `Cart`, `CartItem`, `Coupon`; `src/lib/coupons.ts` — apply/validate logic
* `src/app/api/cart/route.ts`, `src/app/api/coupons/apply/route.ts`
* `(customer)/checkout/page.tsx`, `components/cart/CartItem`, `components/cart/CouponInput`
* `(public)/cart/page.tsx`
* Address: `Address` model, `src/lib/maps.ts`, `components/maps/AddressMapPicker`,
  `(customer)/account/address/page.tsx`
* `src/app/api/orders/route.ts` — order placement (COD), stock decrement + `StockHistory`
  write inside a transaction
* Order-confirmation email template in `src/emails/`, first `Notification` write

### **Phase 3 — Order Lifecycle, Delivery & Admin Operations (Weeks 4–5)**

* `(customer)/account/orders/page.tsx`, `(customer)/account/orders/[id]/page.tsx` — status
  stepper
* `(admin)/orders/page.tsx`, `(admin)/orders/[id]/page.tsx` — accept/reject, assign delivery
  boy, print invoice, update status
* `src/app/api/orders/[id]/status/route.ts`, `src/app/api/orders/[id]/assign-delivery/route.ts`,
  `src/app/api/orders/[id]/invoice/route.ts`
* `DELIVERY_BOY` role added to `User`; `(admin)/delivery-boys/page.tsx`; delivery-boy-scoped
  view for assigned orders (reuses `(admin)/orders/[id]/page.tsx` under a role check)
* Cancellation flow (cutoff at `CONFIRMED`) enforced in `src/app/api/orders/[id]/status/route.ts`
* `OrderStatusLog` writes; status-change emails/notifications at each stage

### **Phase 4 — Returns, Reviews & Wishlist (Week 6)**

* `ReturnRequest` model; `(customer)/account/orders/[id]/return/page.tsx`,
  `src/app/api/returns/route.ts`; `(admin)/returns/page.tsx`
* `Review` model; `src/app/api/reviews/route.ts`; review form + list on
  `(public)/products/[slug]/page.tsx`; `(admin)/reviews/page.tsx` approve/delete;
  `avgRating` recompute on approve
* `WishlistItem` model; `src/app/api/wishlist/route.ts`; `(customer)/account/wishlist/page.tsx`;
  `components/product/WishlistButton`
* Related emails + `Notification` writes (return outcome, review request, restock/price-drop)

### **Phase 5 — Marketing, Notifications & Support (Week 7)**

* `Banner` model; `src/app/api/banners/route.ts`; `(admin)/banners/page.tsx`;
  `components/layout/BannerCarousel` on `(public)/page.tsx`
* `Notification`, `NotificationPreference` models; `src/app/api/notifications/route.ts`;
  `(admin)/notifications/send/page.tsx`; `(customer)/account/notifications/page.tsx`;
  `components/notifications/NotificationBell`, `NotificationList`
* `(public)/help/page.tsx`, `(customer)/account/help/page.tsx`, `(public)/policies/[slug]/page.tsx`

### **Phase 6 — Admin Analytics, Reports, Audit & Security (Week 8)**

* `(admin)/dashboard/page.tsx` — KPI cards + Sales/Orders/Revenue charts (Recharts)
* `(admin)/reports/page.tsx`, `src/app/api/reports/route.ts`
* `(admin)/analytics/page.tsx`, `src/app/api/analytics/route.ts`
* `AuditLog` model, `src/lib/audit.ts` writer wired into every admin mutation from Phases 1–5;
  `(admin)/audit-logs/page.tsx`, `src/app/api/audit-logs/route.ts`
* `LoginHistory` model (written from Better Auth login hook); `(admin)/security/page.tsx`
* `(admin)/products/import/page.tsx`, `(admin)/products/export/page.tsx`,
  `src/app/api/products/import/route.ts`, `src/app/api/products/export/route.ts`
* `StoreSetting` model; `(admin)/settings/page.tsx`, `src/app/api/settings/route.ts`

### **Phase 7 — RBAC, Security Hardening & Polish (Week 9)**

* `src/middleware.ts` finalized — full route-group protection across
  `(customer)` / `(admin)` / delivery-boy-scoped views
* Rate limiting on `/api/auth/*`, `/api/orders`, `/api/coupons/apply`, `/api/returns`
* `zod` validation audit across every route listed in Phases 1–6
* `(customer)/account/page.tsx` (Personal Details) + `(customer)/account/change-password/page.tsx`
  finalized; low-stock indicators on `(admin)/dashboard/page.tsx` and `(admin)/inventory/page.tsx`
* Mobile responsiveness pass, accessibility check across all pages

### **Phase 8 — Testing & Launch Prep (Week 10)**

* End-to-end test of full order lifecycle (place → confirm → pack → assign delivery →
  deliver → return) using `prisma/seed.ts` demo data
* Load-test `src/app/api/orders/route.ts` and `src/app/api/coupons/apply/route.ts` for
  concurrent stock decrements and coupon redemptions
* Real SMTP provider setup (production-grade, not test account) in `src/lib/mailer.ts`
* Final UI review with real product data
* Soft launch to a small set of real local customers

### **Phase 9 — Post-Launch / Future (Backlog, not in initial build)**

* Online payment gateway (Razorpay/UPI) activation via `src/app/api/webhooks/` — data
  model/settings already support it, gateway integration itself deferred per earlier decision
* WhatsApp notifications (manual → automated via Business API)
* Delivery time slots, order cut-off logic
* Multi-language content (beyond the Settings toggle scaffolding)
* Store credit / cash-refund path if payment model changes later

---

## 11. NPM Packages to Install

> Versions aren't pinned here on purpose — resolve everything with `@latest` at install time
> per the note in Section 2, then let `package.json` lock whatever comes down.

**Core framework**
```bash
npx create-next-app@latest general-store --typescript --tailwind --app --turbopack
cd general-store
```

**Database / ORM**
```bash
npm install @prisma/client @prisma/adapter-neon @neondatabase/serverless
npm install -D prisma
```

**Auth**
```bash
npm install better-auth
npm install @better-auth/prisma-adapter
```

**Email**
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

**Validation**
```bash
npm install zod
```

**Admin charts (Dashboard KPIs, Sales/Orders/Revenue, Analytics)**
```bash
npm install recharts
```

**CSV import/export (Products)**
```bash
npm install papaparse csv-parse csv-stringify
npm install -D @types/papaparse
```

**Google Maps (address pin, auto-detect, PIN validation)**
```bash
npm install @googlemaps/js-api-loader
npm install -D @types/google.maps
```

**File/image storage (product images, banners)** — pick one:
```bash
# Option A: Vercel Blob (simplest if deploying to Vercel)
npm install @vercel/blob

# Option B: S3-compatible storage
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Rate limiting** (Section 6 requirement on auth/checkout/coupon/return routes)
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Dev tooling**
```bash
npm install -D eslint eslint-config-next prettier prettier-plugin-tailwindcss
```

Run `npm view <package> version` before installing anything above if you want to sanity-check
current versions ahead of time — the `@latest` tag will still resolve correctly either way.

---

## 12. Open Items to Revisit Later

* Whether the online payment gateway should be pulled forward into the initial build now that
  a "Payment Methods" settings screen exists, or stay in Phase 9 backlog as originally decided
* Exact low-stock threshold default (`Variant.lowStockAt`) — currently defaulted to 10, confirm
  per-category if needed
* Whether delivery boys are store employees (simple admin-created accounts) or need their own
  self-registration flow
* Coupon stacking rules (can a customer combine an offer banner discount with a coupon code?)
* WhatsApp notification implementation approach (manual vs. Business API)
* Review moderation policy (auto-publish vs. always require admin approval)

---

## 13. Environment Variables

`.env.example` (committed, no real secrets) and `.env.local` (gitignored, real values for your
machine) are provided alongside this plan. Summary of what each variable is for:

| Variable | Used for |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string, read by Prisma |
| `BETTER_AUTH_SECRET` | Session/token signing secret for Better Auth |
| `BETTER_AUTH_URL` | Base URL Better Auth uses for callbacks (matches your deployed/local URL) |
| `NEXT_PUBLIC_APP_URL` | Public base URL used in emails/links and client-side fetches |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Nodemailer transport (Section 9) |
| `SMTP_FROM_EMAIL` | "From" address on all outgoing emails |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JS + Geocoding API — address pin picker, PIN validation |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage for product images/banners (Option A in Section 11) |
| `S3_*` variables | Only needed if you choose Option B (S3-compatible storage) instead of Vercel Blob |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limiting on auth/checkout/coupon/return routes |
| `NODE_ENV` | Standard Next.js environment flag |

Never commit `.env.local` — it holds real credentials. `.env.example` should be the only one
checked into version control.
