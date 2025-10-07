# Farm Management Dashboard - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based Design (Dashboard/SaaS Applications)
**Primary References:** Linear (clean dashboard aesthetics), Notion (organized layouts), modern agricultural tech platforms
**Justification:** This is a utility-focused farm management application requiring clear data visualization, efficient workflows, and professional presentation of agricultural data.

## Core Design Elements

### A. Color Palette

**Primary Colors (Agricultural Theme):**
- Primary Green: 142 71% 45% (farm/growth theme)
- Dark Green: 142 60% 30% (accents, active states)
- Success Green: 142 76% 36%

**Neutral Palette:**
- Background (Light): 0 0% 98%
- Background (Dark): 0 0% 5%
- Card Background (Light): 0 0% 100%
- Card Background (Dark): 0 0% 10%
- Border Color: 0 0% 90% (light) / 0 0% 20% (dark)
- Text Primary: 0 0% 10% (light) / 0 0% 95% (dark)
- Text Secondary: 0 0% 45% (light) / 0 0% 60% (dark)

**Status Colors:**
- Warning/Alert: 38 92% 50%
- Danger/Critical: 0 84% 60%
- Info Blue: 217 91% 60%

### B. Typography

**Font Family:**
- Primary: 'Inter' from Google Fonts
- Fallback: system-ui, -apple-system, sans-serif

**Type Scale:**
- Headings (h1): text-3xl font-bold (Dashboard titles)
- Headings (h2): text-2xl font-semibold (Widget/Card titles)
- Headings (h3): text-lg font-semibold (Section headers)
- Body Large: text-base (Primary content)
- Body: text-sm (Secondary content, descriptions)
- Small/Caption: text-xs (Labels, metadata)

### C. Layout System

**Spacing Units:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24 for consistency
- Component padding: p-4, p-6, p-8
- Card spacing: gap-4, gap-6
- Section margins: mb-6, mb-8
- Grid gaps: gap-4, gap-6

**Container Structure:**
- Sidebar: Fixed width 280px (w-70)
- Main Content: Flexible with max-width constraints
- Card Grid: 2-column on tablet (md:grid-cols-2), 3-column on desktop (lg:grid-cols-3)
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### D. Component Library

**Navigation Components:**
- **Sidebar:** Fixed left sidebar with farmer profile section at top, navigation links below
  - Profile photo (circular, w-20 h-20)
  - Farm name and location
  - Edit profile button
  - Navigation tabs with active state indicator (green border/background)
  
- **Header:** Top bar with welcome message, date, and logout button
  - Height: h-16
  - Background: bg-white dark:bg-gray-900
  - Border: border-b

**Dashboard Tabs:**
- Horizontal tab navigation below header
- Active tab: green underline (border-b-2 border-green-600)
- Hover state: subtle background change

**Widget/Card Components:**
- Rounded corners: rounded-lg
- Shadow: shadow-md
- Padding: p-6
- Background: white (light mode) / gray-800 (dark mode)
- Border: subtle border-gray-200

**Widget Types (Overview Page):**
1. **Weather Widget:** Icon + temperature + conditions
2. **Soil Health Widget:** Status indicator + moisture/pH metrics
3. **Crop Status Widget:** List of crops with health indicators
4. **Machinery Widget:** Equipment status grid
5. **Alerts Widget:** List with urgency indicators (colored dots)
6. **Inventory Widget:** Stock levels with status badges

**Management Page Cards:**
1. **Crop Management:** Table/list with crop names, area, health status
2. **Equipment Maintenance:** Equipment cards with fuel level progress bars
3. **Irrigation Schedule:** Calendar-style display with "Schedule New" CTA button
4. **Harvest Countdown:** Progress bars showing days until harvest

**Analytics Page:**
- 2x3 grid of chart containers (lg:grid-cols-2)
- Each chart card: min-h-80
- Chart types: Line charts, bar charts, area charts using Recharts
- Chart colors: Green theme variations

**Form Elements:**
- Input fields: rounded-md border-gray-300 focus:ring-green-500
- Buttons (Primary): bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2
- Buttons (Secondary): border border-gray-300 bg-white hover:bg-gray-50
- Select dropdowns: Consistent with input styling

**Status Badges:**
- Excellent/Good: bg-green-100 text-green-800 (light) / bg-green-900 text-green-200 (dark)
- Fair/Warning: bg-yellow-100 text-yellow-800
- Poor/Critical: bg-red-100 text-red-800
- Rounded: rounded-full px-3 py-1 text-xs font-semibold

**Data Visualization:**
- Progress bars: h-2 rounded-full bg-gray-200 with green fill
- Percentage indicators: text-sm font-medium
- Chart colors: Green scale (#10b981, #059669, #047857)

### E. Animations

**Minimal, Purposeful Animations:**
- Card hover: subtle scale (hover:scale-[1.02] transition-transform)
- Button interactions: Native browser states only
- Tab transitions: Smooth content fade-in
- Loading states: Simple spinner with green color

## Page-Specific Guidelines

### Login/Register Pages
- Centered layout with max-w-md container
- Logo/farm icon at top
- Form card with shadow-xl
- Green primary button for submit
- Link to alternate page (login ↔ register)

### Dashboard Layout
- Persistent sidebar (left, w-70)
- Main content area with header and tab navigation
- Content area: padding p-6 to p-8
- Responsive: Sidebar collapses to hamburger menu on mobile

### Overview Dashboard
- 6 widgets in responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Equal height cards where possible
- Icons from Heroicons (outline style)

### Management Dashboard  
- 4 main sections in 2x2 grid
- Each section is a feature-rich card
- "Schedule New Irrigation" uses modal or slide-over panel

### Analytics Dashboard
- 6 chart placeholders in 2-column grid (lg:grid-cols-2)
- Recharts with green color scheme
- Each chart has title and metric summary

## Images

No hero images required for this dashboard application. The application uses:
- **User profile photos:** Circular avatars in sidebar (placeholder or uploaded)
- **Weather icons:** Simple SVG icons for weather conditions
- **Equipment images:** Optional thumbnails in equipment cards
- **Crop icons:** Optional small icons representing crop types

All imagery should be functional and data-supporting, not decorative.

## Accessibility

- WCAG AA contrast compliance (green on white/dark backgrounds)
- Focus states: ring-2 ring-green-500 ring-offset-2
- Screen reader labels for all interactive elements
- Keyboard navigation support for tabs and forms
- Consistent dark mode throughout including inputs