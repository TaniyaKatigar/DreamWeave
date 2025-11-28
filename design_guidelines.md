# DreamWeave Design Guidelines

## Design Approach
**Reference-Based:** Drawing inspiration from Linear (clean interactions), Notion (information hierarchy), and modern EdTech platforms like Coursera. Focus on clarity, trust-building, and seamless AR integration.

## Core Design Principles
1. **Clarity First:** Students need confidence - every element should reduce anxiety and build trust
2. **Progressive Disclosure:** Guide users through career exploration without overwhelming
3. **Future-Forward:** Modern, tech-forward aesthetic that reflects innovation in career guidance

---

## Typography System

**Font Stack:**
- Primary: Inter (Google Fonts) - headings, UI elements
- Secondary: System UI - body text, forms

**Hierarchy:**
- Hero Headline: 4xl (mobile) → 6xl (desktop), font-weight: 700, letter-spacing: tight
- Section Headings: 2xl → 4xl, font-weight: 600
- Subsections: xl → 2xl, font-weight: 600
- Body: base → lg, font-weight: 400, line-height: relaxed
- Captions/Labels: sm → base, font-weight: 500
- Quiz Questions: lg → xl, font-weight: 600
- Career Titles: xl → 2xl, font-weight: 700

---

## Layout & Spacing System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistency
- Component padding: p-6 (mobile), p-8 (tablet), p-12 (desktop)
- Section spacing: py-16 (mobile), py-20 (tablet), py-32 (desktop)
- Card spacing: p-6 → p-8
- Grid gaps: gap-6 → gap-8

**Container Strategy:**
- Full-width sections: w-full with max-w-7xl mx-auto px-6
- Content blocks: max-w-4xl for readability
- Quiz interface: max-w-2xl centered
- AR viewer: Full viewport width on mobile, max-w-4xl on desktop

---

## Landing Page Structure

### 1. Hero Section (80vh)
- Split layout: 60% text/CTA + 40% demo visual
- Headline emphasizing "Experience Your Future Career"
- Subheading (2-3 lines) explaining WebAR + AI approach
- Primary CTA: "Start Career Quiz" (large, prominent)
- Secondary CTA: "Watch Demo" (ghost button)
- Trust indicator: "Trusted by 10,000+ students" with user avatars
- Background: Subtle gradient mesh overlay

### 2. Problem Statement (2-column on desktop)
- Left: Statistics cards (3 metrics in grid: career mismatch rates, student dropouts, employability gap)
- Right: Explanatory text with bold callouts
- Use metric cards with large numbers (4xl) and context text below

### 3. How It Works (3-step timeline)
- Horizontal timeline on desktop, vertical on mobile
- Step cards with: Icon (120px circle) + Title + Description
- Steps: "Take Quiz" → "Explore AR" → "Get Insights"
- Visual connector lines between steps

### 4. Features Showcase (Grid layout)
- 3 columns on desktop, 1 on mobile
- Feature cards with:
  - Icon (64px, top-aligned)
  - Feature title (xl, font-weight: 600)
  - 2-3 sentence description
  - "Learn more" link
- Features: WebAR Previews, AI Matching, Future Predictions, Career Library, Personalized Reports, Expert Insights

### 5. AR Preview Demo
- Full-width section with embedded model-viewer demo
- Side-by-side: AR viewer (left, 60%) + explanation bullets (right, 40%)
- Fallback image/video for devices without AR capability
- Device frame mockup showing mobile AR experience

### 6. Impact Metrics (4-column grid)
- Large centered numbers with animated counters
- Metrics: Students Helped, Careers Explored, AR Previews Completed, Average Match Score
- Icon above each metric

### 7. Testimonials (2-column cards)
- Student photo (circular, 80px) + Quote + Name + School
- 4 testimonials total, masonry grid layout
- Alternating card heights for visual interest

### 8. CTA Section
- Centered content with generous padding (py-24)
- Headline: "Ready to discover your ideal career?"
- Primary CTA button (extra large)
- Supporting text: "Free • No credit card • 6-minute quiz"
- Background: Subtle pattern overlay

### 9. Footer (3-column)
- Column 1: Logo + mission statement (2 sentences)
- Column 2: Quick links (About, Careers Library, FAQ, Contact)
- Column 3: Newsletter signup + Social links
- Bottom bar: Copyright + Privacy Policy + Terms

---

## Application Interface Components

### Quiz Interface
- Progress bar at top (thin, 4px height, rounded)
- Question card: Centered, max-w-2xl, p-12, elevated shadow
- Question number indicator: "Question 3 of 6" (small text, top)
- Question text: Large (xl), centered, mb-8
- Answer options: Full-width buttons, p-6, text-left, mb-4
- Navigation: "Back" (ghost) + "Next" (primary) buttons at bottom

### Career Match Results (InsightCard)
- Card layout: p-8, rounded-2xl, shadow-xl
- Top section: Career title (3xl) + Match percentage (circular badge, 4xl)
- Grid layout for metrics (2×2):
  - Salary Range (icon + value + trend arrow)
  - Growth Potential (progress bar + percentage)
  - Stress Index (visual indicator + description)
  - Match Score (radial progress + number)
- Bottom section: Primary CTA "View AR Preview" + Secondary "Download Report"

### AR Preview Interface
- Header: Career title + Back button
- Main area: model-viewer component (min-height: 70vh)
- AR controls: Bottom sheet with:
  - "View in Your Space" button (AR mode activation)
  - Info panel explaining AR controls
  - Career context bullets (3-4 items)
- Fallback: High-quality image carousel if AR unsupported

### PDF Report Layout (1-page)
- Header: DreamWave logo + Student name
- Career recommendation: Large centered title
- Match breakdown: Horizontal bar charts for different criteria
- Future projections: Timeline graphic
- Recommended next steps: Bullet list
- Footer: "Generated via DreamWeave • [Date]"

---

## Component Library

### Buttons
- Primary: px-8, py-4, rounded-full, font-semibold, text-lg
- Secondary: Border-2, px-8, py-4, rounded-full
- Ghost: Transparent, underline on hover
- Icon buttons: Square (48px), rounded-lg, centered icon

### Cards
- Elevated: shadow-lg, rounded-2xl, p-6
- Flat: border-2, rounded-xl, p-6
- Interactive: Subtle scale transform on hover (scale-105)

### Form Inputs
- Text fields: px-6, py-4, rounded-xl, border-2, text-base
- Labels: mb-2, font-medium, text-sm
- Error states: Border change + error text below (text-sm)

### Navigation
- Top nav: Sticky, backdrop-blur, py-4, horizontal flex
- Logo: 40px height
- Nav links: text-base, font-medium, spacing-x-8
- Mobile: Hamburger menu → full-screen overlay

### Icons
- Use Heroicons (outline for navigation, solid for features)
- Consistent sizing: 24px (UI), 64px (features), 120px (process steps)

---

## Animations
- Page transitions: Subtle fade-in (300ms)
- AR model loading: Skeleton placeholder → smooth reveal
- Scroll reveals: Fade-up on section entry (subtle, 400ms delay)
- Quiz progression: Slide transitions between questions
- **No** distracting hover animations on cards

---

## Images

**Hero Section:** 
Large illustration/photo showing a student using AR on phone with career environment overlay visible on screen. Should convey innovation and clarity. Position: Right 40% of hero section.

**Features Section:**
Icon-based graphics (no photos) - clean, modern iconography representing each feature.

**AR Demo Section:**
Screenshot/mockup of AR interface showing workplace preview with UI controls visible. Should demonstrate the experience clearly.

**Testimonial Section:**
4 authentic student photos (diverse representation), circular crops, placed at top of each testimonial card.

**Footer:**
Logo only, no decorative images.