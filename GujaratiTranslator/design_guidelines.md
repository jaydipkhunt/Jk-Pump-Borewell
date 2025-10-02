# Borwell Quotation Manager - Design Guidelines

## Design Approach
**Selected System**: Material Design principles adapted for mobile-first productivity
**Rationale**: Function-focused quotation management tool requiring efficient data entry, clear numerical displays, and professional appearance for business credibility.

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 25 85% 53% (Professional blue for headers, CTAs)
- Surface: 0 0% 100% (Clean white background)
- Surface Variant: 220 20% 97% (Card backgrounds)
- Border: 220 15% 85% (Subtle dividers)
- Text Primary: 220 20% 15%
- Text Secondary: 220 10% 45%
- Success: 142 76% 36% (Total calculations)
- Danger: 0 72% 51% (Delete actions)

**Dark Mode:**
- Primary: 210 100% 65%
- Surface: 220 20% 12% (Main background)
- Surface Variant: 220 18% 18% (Card backgrounds)
- Border: 220 15% 25%
- Text Primary: 0 0% 95%
- Text Secondary: 220 10% 65%
- Success: 142 76% 45%
- Danger: 0 72% 58%

### B. Typography
- **Primary Font**: Inter (Google Fonts) - clean, professional, excellent number rendering
- **Headings**: font-semibold, tracking-tight
  - H1: text-2xl (Mobile), text-3xl (Desktop)
  - H2: text-xl (Mobile), text-2xl (Desktop)
  - H3: text-lg
- **Body**: text-base, font-normal
- **Numbers/Prices**: font-medium, tabular-nums (for alignment)
- **Labels**: text-sm, font-medium, text-secondary

### C. Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 (mobile), p-6 (desktop)
- Section spacing: space-y-6 (mobile), space-y-8 (desktop)
- Form field gaps: gap-4
- Card spacing: p-4, rounded-lg

**Grid Structure**:
- Mobile: Single column, full-width cards
- Desktop: max-w-7xl container, 2-column layout where appropriate (quotation form + preview)

### D. Component Library

**Navigation:**
- Bottom navigation bar (mobile) with 3 tabs: "New Quotation", "History", "Settings"
- Desktop: Side navigation panel
- Active state: primary color with icon fill
- Icons: Material Icons (CDN)

**Quotation Form:**
- Sticky header with customer name, date, quotation number
- Item table: Striped rows (alternate surface variant background)
- Editable cells: Input fields with minimal border, focus state with primary ring
- Add Item button: Prominent, fixed at bottom on mobile
- Total section: Highlighted card with success color, larger font (text-2xl)

**Item Rows (Table-like):**
- Columns: Item Name (40%), Quantity (20%), Price (20%), Total (20%)
- Mobile: Stack into card format with labels
- Desktop: Traditional table layout
- Delete icon: Small, right-aligned, danger color on hover

**History List:**
- Card-based layout with shadow-sm
- Each card shows: Customer name (font-semibold), date (text-secondary), quotation # (text-sm), total (font-semibold, success color)
- Actions: View, Edit, Duplicate, Delete icons (Material Icons)
- Search bar at top: Full-width with search icon

**Buttons:**
- Primary CTA: bg-primary, text-white, px-6, py-3, rounded-lg, font-medium
- Secondary: variant="outline", border-2
- Icon buttons: p-2, rounded-full, hover:bg-surface-variant
- Export/Share buttons: Icon + text, bg-surface-variant

**Forms & Inputs:**
- Text inputs: border-2, border-border, rounded-lg, p-3, focus:ring-2 focus:ring-primary
- Date picker: Native with consistent styling
- Dropdowns: Full-width on mobile
- Labels: Above inputs, font-medium, mb-2

**PDF Preview Modal:**
- Full-screen overlay with blurred backdrop
- White card centered with quotation preview
- Close button: Top-right, icon only
- Export actions at bottom: WhatsApp, Email, Download

**Settings Page:**
- Section cards with icon headers
- Default items list: Editable table with add/remove actions
- GST toggle: Switch component with label
- Warranty text: Textarea with character count

### E. Interactions & States
- Button hover: Subtle scale (scale-105), brightness increase
- Card hover: shadow-md transition
- Active input: ring-2, ring-primary
- Loading states: Spinner with primary color
- Success notification: Toast at top with success color
- Error states: Red border on inputs, error text below

---

## Mobile Optimization
- Touch targets: Minimum 44px height
- Swipe actions: Swipe left on history items to reveal delete
- Bottom sheet modals: For item editing on mobile
- Fixed action buttons: Bottom-right corner for "Add Item"
- Responsive tables: Transform to cards on mobile (<768px)

## PWA Specific
- Install prompt: Banner at top on first visit
- Offline indicator: Small badge in navigation when offline
- Loading skeleton: Gray animated placeholders while syncing

---

**Key Principle**: Prioritize data clarity and efficient input over decorative elements. Every pixel serves the goal of fast, accurate quotation creation.