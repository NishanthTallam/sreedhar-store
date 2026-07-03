# Design System — General Store Online

> **Reference note on sources:** sparindia.com is a JS-rendered single-page app, so it doesn't
> expose static HTML/CSS to fetch directly. This system is built from SPAR India's actual,
> verifiable brand identity and product structure (their 2026 app redesign toward a "vibrant,
> intuitive" UI, "Everything Below MRP" pricing message, hypermarket categories spanning
> grocery/fresh produce/seafood/meat/beauty/electronics, the Landmark Rewards loyalty program,
> and a farm-to-store fresh-produce focus) combined with established conventions from the
> current generation of Indian grocery-delivery UIs (Blinkit/Zepto/JioMart-class product grids,
> sticky mobile cart bars, variant chip selectors). Treat the color/spacing/component values
> below as a defensible starting point — swap in exact brand hex codes once you have brand
> guidelines or can screenshot the live site directly.
>
> This document maps every component and screen to the directory structure and page inventory
> already defined in `implementation-plan.md` (§3 Project Directory Structure, §8 Pages
> Overview) so design and code stay in sync.

---

## 1. Brand & Visual Identity

**Positioning:** A trustworthy, everyday hypermarket experience — "everything below MRP,"
farm-fresh produce, wide catalog (groceries → fresh food → household → personal care).
Design should read as **clean, high-density, and price-forward** rather than boutique/luxury —
shoppers are comparison-scanning a grocery list, not browsing for inspiration.

**Design principles**

1. **Scannability over decoration** — grid density and clear price/stock text beat large
   hero imagery once past the homepage.
2. **Price and stock status are always visible** — never require a tap to see price, unit, or
   in-stock state.
3. **Trust signals stay close to the action** — "Below MRP" / discount badges, return policy,
   delivery charge threshold all shown at the moment of decision (product card, cart, checkout).
4. **Mobile is the primary surface** — design mobile layouts first, then expand.

### 1.1 Color System

Defined as CSS variables (Tailwind v4 `@theme` block in `src/app/globals.css`), so both SVG
widgets and components reference the same tokens.

```css
@theme {
  /* Brand */
  --color-brand-50:  #eafbf1;
  --color-brand-100: #cdf4dc;
  --color-brand-300: #6fdd97;
  --color-brand-500: #16a34a;   /* primary — SPAR-style fresh green */
  --color-brand-600: #0f8a3c;
  --color-brand-700: #0c6e30;
  --color-brand-900: #0a4a21;

  /* Accent — offers / festival / urgency */
  --color-accent-500: #f97316;  /* orange — offer badges, "Below MRP" tag */
  --color-accent-600: #ea580c;

  /* Status */
  --color-success-500: #16a34a;
  --color-warning-500: #eab308;  /* low stock */
  --color-danger-500:  #dc2626;  /* out of stock, cancelled, failed */
  --color-info-500:    #2563eb;  /* delivery/tracking */

  /* Order status stepper */
  --color-status-placed:   #94a3b8;
  --color-status-confirmed:#2563eb;
  --color-status-packed:   #eab308;
  --color-status-transit:  #f97316;
  --color-status-delivered:#16a34a;

  /* Neutrals */
  --color-neutral-0:   #ffffff;
  --color-neutral-50:  #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-500: #64748b;
  --color-neutral-700: #334155;
  --color-neutral-900: #0f172a;

  /* Radius / shadow tokens reused across ui/ components */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-card: 0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08);
  --shadow-elevated: 0 8px 24px rgba(15, 23, 42, 0.12);
}
```

**Usage rules**

* `brand-500` = primary CTA (Add to Cart, Place Order, Save), active nav state, price of
  discounted items.
* `accent-500` = offer/discount badges, banner CTA buttons, coupon chips — never used for
  primary navigation, to keep it meaningful.
* Status colors are **only** used for their semantic meaning (order stepper, stock badges,
  toasts) — never repurposed for decoration.

### 1.2 Typography

* **Font:** Inter (or system-ui fallback stack) — legible at small sizes, wide language
  support for future multi-language setting.
* **Scale** (Tailwind default scale, mapped to use-cases):

| Token | Size | Use |
|---|---|---|
| `text-xs` (12px) | Meta text — unit labels, timestamps, SKU |
| `text-sm` (14px) | Body copy, form labels, table cells |
| `text-base` (16px) | Default body, product name on cards |
| `text-lg` (18px) | Section headers, card totals |
| `text-xl`–`text-2xl` (20–24px) | Page titles, KPI card numbers |
| `text-3xl`+ (30px+) | Dashboard hero numbers only (admin KPI cards on desktop) |

* **Price text** is always `font-semibold` minimum — it's the single most important text on a
  product card and must win the scan.
* Line height: `leading-snug` for headings, `leading-relaxed` for body/FAQ/policy text.

### 1.3 Iconography & Imagery

* Icon set: **lucide-react** (already available per system tooling) — consistent 1.5px stroke,
  20/24px sizing.
* Product images: square 1:1 crop, white/light-neutral background, min 600×600px source,
  served responsively (next/image).
* Category images: rounded-square icons on a tinted `brand-50` circle background for the
  homepage category grid (matches the "categorized sections with playful icons" pattern common
  to this class of app).
* Banners: 16:5 aspect ratio on desktop, 4:3 on mobile (cropped via `object-cover`, not
  stretched) — see `BannerCarousel` in §5.

---

## 2. Layout System & Breakpoints

Mobile-first. All components are built for the smallest breakpoint first, then enhanced.

| Breakpoint | Width | Primary use |
|---|---|---|
| `base` (no prefix) | 0–639px | Phones — the default, most-used layout |
| `sm:` | ≥640px | Large phones / small tablets (portrait) |
| `md:` | ≥768px | Tablets |
| `lg:` | ≥1024px | Small laptops — admin sidebar becomes persistent here |
| `xl:` | ≥1280px | Desktop — full product grid density |
| `2xl:` | ≥1536px | Wide desktop — content still caps at `max-w-7xl`, extra space is margin |

**Grid rules**

* Product grid: `grid-cols-2` (base) → `sm:grid-cols-3` → `lg:grid-cols-4` → `xl:grid-cols-5`
* Category shortcuts (homepage): horizontal scroll-snap row on `base`/`sm`, static grid from
  `md:` up
* Admin data tables: horizontally scrollable card-row layout on `base`, real `<table>` from
  `md:` up
* Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` on all public/customer pages

---

## 3. Core UI Elements (`src/components/ui/`)

Shared primitives every other component builds on. Each entry = one file in
`components/ui/`.

| Component | File | Notes |
|---|---|---|
| Button | `Button.tsx` | Variants: `primary` (brand-500 fill), `secondary` (neutral outline), `ghost`, `danger`. Sizes: `sm`/`md`/`lg`. `lg` used only for sticky mobile CTAs (Add to Cart, Place Order). |
| Input | `Input.tsx` | Label above field, error text below in `danger-500`, `sm text-base` to avoid iOS zoom-on-focus. |
| Select | `Select.tsx` | Native `<select>` styled to match `Input` — avoids heavy JS dropdown cost for simple cases (state/city, sort order). |
| Checkbox / Radio | `Checkbox.tsx`, `Radio.tsx` | 20px tap target minimum, `brand-500` checked state. |
| Toggle / Switch | `Toggle.tsx` | Used for notification channel toggles (email/SMS/push), settings booleans. |
| Badge | `Badge.tsx` | Variants: `stock` (in-stock/low-stock/out-of-stock), `discount` (accent), `status` (order status colors), `role` (admin/delivery-boy tags). |
| Card | `Card.tsx` | Base surface: `bg-white rounded-lg shadow-card p-4`. |
| Modal / Dialog | `Modal.tsx` | Bottom-sheet on `base` (slides up, rounded top corners), centered dialog from `md:` up — one component, responsive behavior via CSS, not two separate components. |
| Drawer | `Drawer.tsx` | Slide-in from right (cart drawer, filter panel on mobile), from left (admin mobile nav). |
| Tabs | `Tabs.tsx` | Underline style, horizontal scroll on overflow (used in Customer Account nav on mobile, Admin Reports sub-tabs). |
| Toast | `Toast.tsx` | Bottom-center on mobile, bottom-right on desktop; auto-dismiss 4s; used for "Added to cart," "Coupon applied," error states. |
| Skeleton | `Skeleton.tsx` | Shimmer placeholder for product grid, tables, dashboard cards while loading. |
| Empty State | `EmptyState.tsx` | Icon + short text + optional CTA — used for empty cart, empty wishlist, empty orders, empty admin tables. |
| Pagination | `Pagination.tsx` | Numbered on desktop admin tables, "Load more" button pattern on public/customer infinite lists. |
| Stepper (quantity) | `QuantityStepper.tsx` | `−  2  +` control, used on cart items and product page. |
| Rating Stars | `RatingStars.tsx` | Read-only display mode + interactive input mode (review form), half-star support via `avgRating` decimal. |
| Avatar | `Avatar.tsx` | Initials fallback, used in admin customer table and delivery-boy list. |
| Table | `Table.tsx` | Base table primitive; admin pages compose it with column defs. |
| Breadcrumb | `Breadcrumb.tsx` | Category → subcategory → product trail, hidden on `base` (replaced by back arrow), visible `md:` up. |

**Interaction/motion guideline:** transitions capped at `150–200ms`, `ease-out`; no motion on
first paint (avoid layout shift); respect `prefers-reduced-motion` by disabling
carousel-autoplay and skeleton shimmer animation.

---

## 4. Accessibility Baseline

* Color contrast: body text ≥ 4.5:1, all button/badge text checked against its background
  token above.
* All interactive elements ≥ 44×44px tap target on `base` breakpoint.
* Every icon-only button (wishlist heart, notification bell, cart icon) has an `aria-label`.
* Forms: label always associated via `htmlFor`/`id`, error messages linked via
  `aria-describedby`.
* Focus states: visible `ring-2 ring-brand-500` on all focusable elements — never
  `outline-none` without a replacement.
* Modals/drawers trap focus and restore it to the triggering element on close.

---

## 5. Composite Components (`src/components/`)

Grouped by the sub-folders already defined in the implementation plan's directory structure.

### `components/layout/`

* **Header** — Logo · location/pincode selector · search bar (expands full-width on focus,
  mobile) · Wishlist icon · Notification bell (unread badge) · Cart icon (count badge) ·
  Account menu. Collapses to: Logo + search icon + cart icon + hamburger on `base`; full bar
  from `md:` up.
* **CategoryNav** — Sticky sub-nav under header on category/product listing pages; horizontal
  scroll on `base`.
* **Footer** — Delivery-area note, policy links (`(public)/policies/[slug]`), contact info,
  app-download badges, social links. Accordion sections on `base` (tap to expand), full
  multi-column on `md:` up.
* **BannerCarousel** — Auto-rotating (6s interval, pauses on interaction/hover, disabled under
  reduced-motion), dot indicators, swipeable on touch. Renders `Banner` records filtered by
  `type` + active date window.
* **BottomTabBar** *(mobile only, `base`–`sm`)* — Home · Categories · Wishlist · Cart · Account,
  fixed to viewport bottom, hidden `md:` up where the header covers navigation.

### `components/product/`

* **ProductCard** — Image, name, brand, unit/variant hint ("From ₹60"), rating stars
  (if `avgRating` exists), stock badge, wishlist heart (top-right overlay), quick-add button
  (bottom-right overlay on `base`, inline on `md:` up).
* **VariantSelector** — Horizontal pill/chip row (500ml / 1L / 5L), selected chip filled
  `brand-500`, price and stock update live on selection, disabled+struck-through chip for
  out-of-stock variants.
* **ReviewList / ReviewForm** — Star input + comment textarea (post-delivery only, gated by
  order status), list shows approved reviews only, average recomputed on approval.
* **WishlistButton** — Heart icon toggle, optimistic UI update, filled `danger-500` when
  active.

### `components/cart/`

* **CartItem** — Thumbnail, name+variant, `QuantityStepper`, line total, remove (trash icon).
* **CouponInput** — Text field + "Apply" button, shows live discount preview and a green
  success strip once applied ("Coupon SAVE50 applied — ₹50 off"), red inline error if invalid.

### `components/maps/`

* **AddressMapPicker** — Google Map embed with draggable pin, "Use my location" button
  (auto-detect), reverse-geocoded address fields auto-filled below the map, PIN code field
  validated against serviceable-area list with an inline "We don't deliver here yet" state.

### `components/notifications/`

* **NotificationBell** — Header icon with unread-count badge, opens `NotificationList` in a
  `Drawer` on `base`, dropdown panel on `md:` up.
* **NotificationList** — Grouped by category (Orders/Offers/Payments/Account) with tab filter,
  each row: icon by category, title, relative timestamp, read/unread dot, swipe-to-delete on
  touch.

### `components/admin/`

* **KpiCard** — Big number + label + small trend delta (↑/↓ vs. previous period), used in
  8-card dashboard grid.
* **ChartCard** — Wraps a Recharts line/bar chart with a title and date-range selector.
* **DataTable** — Sort headers, row-select checkboxes, inline status-badge cells, row actions
  menu (kebab icon) — collapses to stacked "card per row" layout on `base`.
* **ImportExportPanel** — Drag-and-drop CSV drop zone + "Download template" + "Export current
  catalog" buttons, with a post-import validation summary (rows added/updated/errored).
* **StatusUpdateControl** — Order-status dropdown/stepper used on `(admin)/orders/[id]`, only
  shows the next valid status per the fixed lifecycle
  (`PLACED → CONFIRMED → PACKED → OUT_FOR_DELIVERY → DELIVERED`).
* **AuditLogRow** — Actor, action, entity, timestamp, expandable JSON diff (from
  `AuditLog.metadata`).

---

## 6. Customer Dashboard — Screen Specs

All under `(customer)/account/*` per the implementation plan.

**Shared shell:** On `base`, account section uses a `Tabs` bar that scrolls horizontally
(Personal · Address · Orders · Wishlist · Notifications · Help). From `md:` up, this becomes a
persistent left sidebar (`w-64`) with the content panel beside it — same pattern as the admin
shell for consistency, just without the KPI/report-heavy modules.

| Screen | Layout notes |
|---|---|
| **Personal Details** (`account/page.tsx`) | Simple stacked form, `Card` wrapper, save button sticky at bottom on `base`. |
| **Address** (`account/address/page.tsx`) | List of `AddressCard`s (name, type badge, snippet, default star) → "Add address" opens `AddressMapPicker` in a full-screen `Modal` on `base`, centered dialog `md:` up. |
| **Orders** (`account/orders/page.tsx`) | Card list: order #, date, item thumbnails (max 3 + "+N"), status `Badge`, total. Tap → detail. |
| **Order Detail** (`account/orders/[id]/page.tsx`) | Vertical status stepper (horizontal on `md:` up) using the status color tokens from §1.1, item list, delivery-boy contact card once assigned, action buttons (Cancel/Return/Track/Download Invoice) shown conditionally by current status. |
| **Wishlist** (`account/wishlist/page.tsx`) | Same `ProductCard` grid as public catalog, plus a sort/filter bar (price/popularity/newest) and a search-within-wishlist input pinned above the grid. |
| **Notifications** (`account/notifications/page.tsx`) | Full-page `NotificationList` with category tab filter and a settings gear → channel `Toggle`s. |
| **Help & Support** (`account/help/page.tsx`) | Searchable FAQ accordion grouped by category, Contact Us card (phone/email/WhatsApp/hours/map embed), Policies link list, Feedback form (`RatingStars` + textarea). |

**Registration/Auth pages** (`(auth)/*`): single-column centered card, `max-w-md`, full-bleed
on `base` with just top padding — matches the low-chrome pattern users expect from OTP/verify
flows.

**Cart & Checkout:**

* `(public)/cart/page.tsx` — item list + `CouponInput` + sticky summary bar (subtotal,
  delivery charge, total, "Proceed to Checkout") pinned to bottom on `base`, sidebar summary
  card on `lg:` up.
* `(customer)/checkout/page.tsx` — vertical accordion of sections (Address → Payment → Coupon
  → Summary) on `base`, each section expandable one at a time; two-column layout (form left,
  sticky summary right) from `lg:` up. "Place Order" button always visible (sticky bottom on
  mobile).

---

## 7. Admin Dashboard — Screen Specs

All under `(admin)/*`.

**Shell:** Persistent left sidebar (`w-60`) from `lg:` up with icon+label nav grouped into
Catalog / Orders / People / Marketing / Insights / System (matching §8 of the implementation
plan). On `base`/`md:`, sidebar becomes a `Drawer` triggered by a hamburger in a slim top bar;
top bar also carries the notification-send shortcut and admin account menu.

| Screen | Layout notes |
|---|---|
| **Dashboard** (`dashboard/page.tsx`) | 8 `KpiCard`s in a `grid-cols-2` (base) → `grid-cols-4` (lg:) grid, followed by 3 `ChartCard`s (Sales/Orders/Revenue) stacked on `base`, side-by-side pairs from `xl:` up. Recent Orders as a compact `DataTable` below. |
| **Products** (`products/page.tsx`) | `DataTable` with thumbnail, name, category, price range, stock, active toggle, row actions. Filter bar (category/brand/stock status) collapses into a `Drawer` on `base`. |
| **Product New/Edit** (`products/new`, `products/[id]/edit`) | Two-column form (`lg:` up): left = name/description/category/brand, right = image uploader + variant repeater (add/remove variant rows: label, unit, price, stock, SKU). Single column stacked on `base`. |
| **Import/Export** (`products/import`, `products/export`) | `ImportExportPanel` — drop zone, template download, validation summary table. |
| **Categories / Brands** (`categories/page.tsx`, `brands/page.tsx`) | Simple list + inline add/edit `Modal`, drag-to-reorder optional for category tree. |
| **Inventory** (`inventory/page.tsx`, `inventory/history/page.tsx`) | Stock table with `warning-500` row highlight for items at/under `lowStockAt`; history is a reverse-chronological `DataTable` filterable by variant. |
| **Orders** (`orders/page.tsx`) | Status-filter tab bar at top (`Tabs`), `DataTable` rows with `StatusUpdateControl` inline; bulk-assign delivery boy action on multi-select. |
| **Order Detail** (`orders/[id]/page.tsx`) | Same stepper component as customer order-detail (shared, reused) plus admin-only controls: accept/reject, assign delivery boy (searchable select), print-invoice button, internal note field. |
| **Returns** (`returns/page.tsx`) | Kanban-style 3 columns (Requested / Approved-Scheduled / Closed) on `lg:` up, tabbed list on `base`. |
| **Customers** (`customers/page.tsx`, `customers/[id]/page.tsx`) | `DataTable` with block/unblock toggle; detail page shows order history reusing the customer's own `Orders` card list. |
| **Delivery Boys** (`delivery-boys/page.tsx`) | Card grid: `Avatar`, name, phone, active-orders count, completed-orders count. |
| **Banners** (`banners/page.tsx`) | Grid of banner thumbnails grouped by type tab (Homepage/Offer/Festival), each with active/inactive toggle and date-range fields. |
| **Reviews** (`reviews/page.tsx`) | Queue list: product thumbnail, rating, comment, approve/reject buttons — filter by pending/approved/rejected. |
| **Reports** (`reports/page.tsx`) | Date-range picker + report-type `Tabs` (Daily/Weekly/Monthly/Top Products/Low Stock/Customers), each rendering a `ChartCard` + exportable `DataTable`. |
| **Notifications → Send** (`notifications/send/page.tsx`) | Form: category (Offers/Order Updates/New Products), audience filter, message composer, "Send" with a confirmation `Modal` (irreversible action). |
| **Coupons** (`coupons/page.tsx`) | `DataTable` (code, type, value, usage, status) + create/edit `Modal` form with live preview of "Customer sees: ₹50 off orders above ₹500." |
| **Settings** (`settings/page.tsx`) | Sectioned form in an accordion on `base` / tabbed panel `lg:` up: Store Info, Delivery Charges, Payment Methods (checkbox list), Business Rules, Email Settings, Currency, Language. |
| **Analytics** (`analytics/page.tsx`) | 5 `ChartCard`s (Revenue/Sales/Growth/Product Performance/Customer Growth) in a responsive masonry-style stack. |
| **Audit Logs** (`audit-logs/page.tsx`) | Filterable `DataTable` of `AuditLogRow`s (by action type, actor, date range). |
| **Security Settings** (`security/page.tsx`) | Three cards: Login History (`DataTable`), Failed Attempts (highlighted `danger-500` rows), Active Sessions (list with "Revoke" button per session). |

---

## 8. Mobile Responsiveness Summary

Quick-reference table for how the biggest layout shifts happen across breakpoints —
useful as a build checklist per screen.

| Pattern | `base` (phone) | `md:`+ (tablet/desktop) |
|---|---|---|
| Primary navigation | Bottom tab bar + hamburger drawer | Full header nav, no bottom bar |
| Admin navigation | Slide-in drawer from hamburger | Persistent left sidebar |
| Product grid | 2 columns | 3–5 columns (`sm`→`xl`) |
| Modals | Bottom sheet, full-width | Centered dialog, fixed max-width |
| Cart/Checkout summary | Sticky bottom bar | Sticky sidebar card |
| Admin tables | Stacked "card per row" | Real `<table>` with sortable headers |
| Account/Admin sub-nav | Horizontal scrolling tabs | Persistent vertical sidebar |
| Filters (product listing) | Drawer triggered by "Filter" button | Persistent left-hand filter column |
| Banner carousel aspect | 4:3 | 16:5 |
| Breadcrumbs | Hidden (back arrow instead) | Visible |

**Testing checklist per screen:** 375px (small phone), 768px (tablet), 1024px (small laptop —
admin sidebar breakpoint), 1440px (desktop). Verify no horizontal scroll at any width, tap
targets ≥44px on `base`, and that sticky bottom bars never cover the last piece of content
(add bottom padding equal to bar height on the scrollable area behind them).

---

## 9. File/Token Reference Summary

* Color, radius, and shadow tokens → `src/app/globals.css` (`@theme` block, §1.1)
* Shared primitives → `src/components/ui/*` (§3)
* Composite/domain components → `src/components/{layout,product,cart,maps,notifications,admin}/*` (§5)
* Screen-level layout decisions → applied directly inside each route file under
  `src/app/(customer)/*` and `src/app/(admin)/*` per §6 and §7, using only the primitives and
  composites above — no one-off styling inside route files beyond page-specific spacing.
