# Document 06 — UI/UX Guidelines (v1.0)
**Project Name:** AppointBrite

## 1. Design Philosophy

AppointBrite aims to feel premium, fast, and trustworthy. We follow the principle of "Progressive Disclosure"—only showing the user the information they need at the exact moment they need it to avoid cognitive overload. 

Because we serve multiple industries (beauty, food, health), the UI must be clean and neutral enough to accommodate any business's imagery without clashing.

## 2. Aesthetics & Branding

### Color Palette
- **Primary Brand Color:** Electric Blue (`#2563EB`) - Used for primary actions, booking buttons, and active states. Conveys trust and tech-forwardness.
- **Secondary Accent:** Coral (`#FF6B6B`) - Used for notifications, destructive actions (cancel booking), and badges.
- **Backgrounds:** 
  - Light Mode: Off-white (`#F8FAFC`) for app background, pure white (`#FFFFFF`) for cards.
  - Dark Mode: Dark Slate (`#0F172A`) for app background, Deep Gray (`#1E293B`) for cards.
- **Text/Typography Colors:** Very Dark Blue (`#0F172A`) for primary text, Slate (`#64748B`) for secondary text.

### Typography
- **Primary Font:** `Inter` (Google Fonts) - Clean, highly legible sans-serif for UI elements, tables, and dashboards.
- **Headings:** `Outfit` (Google Fonts) - Used sparingly for large headers and marketing pages to add a modern, geometric feel.

## 3. Component Library (Material UI - MUI)

We utilize Material UI (MUI) as our base component library, heavily customized via the `ThemeProvider` to match our brand.

- **Buttons:** Fully rounded corners (`borderRadius: 9999px`) for primary consumer-facing buttons to feel friendly. Slightly rounded (`borderRadius: 8px`) for the Business Dashboard to feel professional and maximize space.
- **Cards:** Subtle drop shadows (e.g., `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)`) with zero borders in light mode to create a floating "glass" effect.
- **Inputs & Forms:** Outlined variants with floating labels. Error states must always include descriptive helper text beneath the input.

## 4. Layouts & Responsiveness

### Customer Portal (Mobile-First)
- **Navigation:** Bottom navigation bar on mobile (Search, Bookings, Favorites, Profile). Top navigation bar on Desktop.
- **Search Results:** Vertical list view by default. Toggleable to Map View.
- **Booking Flow:** A step-by-step wizard (BottomSheet on mobile, Modal on desktop) to keep the user focused.

### Business Dashboard (Desktop-First)
- **Navigation:** Left-hand collapsible sidebar. 
- **Calendar View:** Occupies maximum screen real-estate. Must support horizontal scrolling for time slots.
- **Data Tables:** Used for Customer CRM and Analytics. Must be horizontally scrollable on mobile devices with sticky first columns.

## 5. Micro-Interactions & Animations

- **Page Transitions:** Fast fade-ins (150ms).
- **Button Clicks:** Subtle scale-down effect (`transform: scale(0.97)`) on `:active`.
- **Loading States:** Skeleton loaders matching the exact shape of the content to be loaded, rather than generic spinners, to reduce perceived wait time.
- **Success States:** Confetti or checkmark animations when a booking is successfully confirmed.

## 6. Accessibility (a11y)

- All text must meet WCAG 2.1 AA contrast ratios (e.g., Primary Blue on White).
- Forms must have `<label>` elements or `aria-label` attributes.
- Keyboard navigation (Tab) must follow a logical flow, with visible `:focus-visible` outlines.
- Support for screen readers using appropriate `aria-live` regions for dynamic content like search results.
