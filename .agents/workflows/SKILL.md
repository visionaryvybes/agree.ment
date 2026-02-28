---
description: Premium UI Development - Component Vocabulary, Vibe Coding Best Practices, and Self-Improving Memory
version: 1.0.0
last_updated: 2026-02-28
---

# 🧠 Premium UI Development Skill

This is a living knowledge base. It learns from each project, tracks what works, and avoids repeating mistakes.

---

## 1. THE 60 UI COMPONENT VOCABULARY

Always use the correct name. Never invent new names when standard ones exist.

### Layout & Structure
| Component | Also Known As | Description |
|-----------|--------------|-------------|
| **Hero** | Jumbotron, Banner | Large banner, usually first on page, full-width imagery |
| **Header** | Navbar, App Bar | Top of page — site name + main navigation |
| **Footer** | — | Bottom of page — legal, copyright, links |
| **Card** | Tile | Container for a single entity (article, contact, task) |
| **Stack** | — | Wrapper for consistent spacing between children |
| **Separator** | Divider, HR | Line between two elements |
| **Drawer** | Tray, Flyout, Sheet | Panel sliding from screen edge |
| **Modal** | Dialog, Popup | Overlay requiring user interaction before continuing |
| **Accordion** | Collapse, Disclosure, Expandable | Vertical stack toggling content visibility |
| **Tabs** | Tabbed interface | Navigate multiple panels in same space |
| **Carousel** | Content slider | Multiple slides, swipe/scroll/button navigation |
| **Empty state** | — | Shown when no data exists, with alternative actions |
| **Skeleton** | Skeleton loader | Placeholder layout for loading content |

### Navigation
| Component | Also Known As | Description |
|-----------|--------------|-------------|
| **Navigation** | Nav, Menu | Container for navigation links |
| **Breadcrumbs** | Breadcrumb trail | Location path in navigational hierarchy |
| **Pagination** | — | Splitting content across pages |
| **Skip link** | — | Keyboard accessibility for skipping sections |
| **Tree view** | — | Nested hierarchical display (TOC, directories) |
| **Link** | Anchor, Hyperlink | Reference to another resource |

### Data Display
| Component | Also Known As | Description |
|-----------|--------------|-------------|
| **Badge** | Tag, Label, Chip | Small label for status/metadata |
| **Avatar** | — | Graphical user representation (photo, initials) |
| **Icon** | — | Graphic symbol indicating purpose |
| **Image** | Picture | Image embedding element |
| **Table** | Data Table | Rows/columns for large datasets |
| **List** | — | Grouped collection of related items |
| **Quote** | Pull quote, Block quote | Quotation display |
| **Tooltip** | — | Hover-triggered information popup |
| **Popover** | — | Click-triggered popup with interactive content |
| **Toast** | Snackbar | Floating alert notification |
| **Alert** | Notification, Banner, Callout | Prominent status change notification |
| **Progress bar** | — | Horizontal completion indicator |
| **Progress indicator** | Stepper, Timeline, Meter | Discrete step progress |
| **Rating** | — | Star rating display/input |
| **Spinner** | Loader | Background process indicator |

### Form Controls
| Component | Also Known As | Description |
|-----------|--------------|-------------|
| **Button** | — | Triggers actions (submit, toggle) |
| **Button group** | Toolbar | Wrapper for related buttons |
| **Text input** | — | Single-line text field |
| **Textarea** | Textbox | Multi-line text field |
| **Select** | Dropdown | Choose from predefined options |
| **Combobox** | Autocomplete, Autosuggest | Select + free text filter |
| **Checkbox** | — | Binary or multi-select input |
| **Radio button** | Radio group | Single selection from list |
| **Toggle** | Switch | Binary on/off control |
| **Slider** | Range input | Value within a range |
| **Date input** | — | Separate day/month/year fields |
| **Datepicker** | Calendar | Visual calendar date selection |
| **Color picker** | — | Color selection input |
| **File upload** | Dropzone | File upload from device |
| **File** | Attachment, Download | File representation |
| **Search input** | Search | Content search field |
| **Segmented control** | Toggle button group | Switch between options/views |
| **Stepper** | Nudger, Counter | Numeric increment/decrement |
| **Label** | Form label | Text label for inputs |
| **Fieldset** | — | Wrapper for related form fields |
| **Form** | — | Grouping of input controls |
| **Rich text editor** | RTE, WYSIWYG | Formatted text editing |
| **Heading** | — | Title/caption for sections |
| **Video** | — | Video embedding |
| **Visually hidden** | Screen reader only | Accessible but invisible content |

---

## 2. VIBE CODING COMMANDMENTS

### The 18 DOs
1. **Use ready-made auth** — Clerk, Supabase Auth. Never build from scratch.
2. **Use Tailwind + shadcn/ui** — Figma to working UI in 2-3 hours.
3. **Use Zustand + Server Components** — No Redux, no 6-layer Context.
4. **Use tRPC / Server Actions** — No custom REST APIs for MVPs.
5. **Deploy with Vercel one-click** — Push to main = deployed.
6. **Use Prisma + managed Postgres** — No raw SQL for MVPs.
7. **Validate with Zod + React Hook Form** — Predictable, trustworthy forms.
8. **Use Stripe for payments** — 45 min integration, never DIY.
9. **Add Sentry early** — Know what broke before users tell you.
10. **Set up analytics (PostHog/Plausible)** — Data from day one.
11. **Store secrets in .env** — Never hardcode API keys.
12. **Use UploadThing/Cloudinary** — Don't DIY file uploads.
13. **Set up preview deployments** — Every PR gets a URL.
14. **Use Radix + shadcn** — Don't build UI primitives from scratch.
15. **Write README from day 1** — 20 min saves 4 hours.
16. **Keep folders clean and modular** — Components, hooks, utils, types.
17. **Add onboarding + empty states** — Confused users leave.
18. **Use Lighthouse** — Score below 70 = red flag. Fix before launch.

### The 18 DON'Ts
1. Don't build auth from scratch
2. Don't write raw CSS for everything (use Tailwind)
3. Don't over-engineer state management
4. Don't build custom APIs too early
5. Don't deploy manually
6. Don't write raw SQL everywhere
7. Don't build your own payment system
8. Don't roll your own search engine (use Algolia/Meilisearch)
9. Don't skip logging and monitoring
10. Don't hardcode API keys
11. Don't DIY file uploads
12. Don't push straight to main
13. Don't build realtime systems alone (use Supabase Realtime/Pusher)
14. Don't ignore performance
15. Don't assume users will figure it out
16. Don't postpone refactoring forever
17. Don't rely on memory for decisions (document them)
18. Don't chase perfect before shipping — Ship. Iterate.

---

## 3. PREMIUM AESTHETIC RULES (Learned from AgreeMint Project)

### Typography
- Serif for display headings (Instrument Serif, Playfair Display)
- Inter/SF Pro for body text
- Letter-spacing: -0.02em for headings, 0.1em for labels
- Font hierarchy: Display > H1 > H2 (uppercase tracking) > Body

### Color System
- Warm backgrounds (#FBFAF9, #F5F3EF) — NOT pure white
- Multi-layer shadows for realistic depth
- Accent colors: use named CSS variables, not hardcoded
- **CRITICAL**: Never use dynamic Tailwind classes for colors that can be purged. Write explicit CSS classes instead.

### Animations
- Use `framer-motion` for entrance/exit animations
- Stagger children: 0.02-0.05s (fast perceived loading)
- Physics easing: `[0.2, 0.8, 0.2, 1]` cubic-bezier
- Hover: `translateY(-6px)` + shadow lift for cards
- Floating: `animate={{ y: [0, -20, 0] }}` for hero elements

### Layout Anti-Patterns (Bugs to Never Repeat)
- Always add `min-width: 0` to flex children that can overflow
- Never use `overflow: hidden` on a parent without `max-width: 100%`
- Image fallbacks: render fallback icon UNDERNEATH, fade out broken image
- Sidebar grids: use `lg:grid-cols-4` with `lg:col-span-3` for main content

---

## 4. DEPLOYMENT CHECKLIST

- [ ] `npm run build` succeeds with zero errors
- [ ] All images verified present in `public/`
- [ ] `.env.local` has all required variables
- [ ] `.gitignore` excludes node_modules, .env*, .next/
- [ ] Git committed with descriptive message
- [ ] Vercel deployment: `vercel --yes --prod`
- [ ] GitHub repo created and linked to Vercel for CI/CD
- [ ] Preview deployments enabled

---

## 5. SELF-IMPROVEMENT LOG

### Session 1 (2026-02-28): AgreeMint Project
**Mistakes Made:**
- Used dynamic Tailwind classes (`bg-amber-100 text-amber-700`) for Escalation Engine — they got purged in production. **Fix**: Write explicit CSS classes.
- Built a "Blueprint" hero that looked like a broken loading state. **Fix**: Ship recognizable UI patterns (Card Stack, not abstract code blocks).
- Template images failed silently with `display: none`. **Fix**: Layer fallback icon underneath, fade out broken image via opacity.
- `npm install` broke due to `napi-postinstall` missing globally. **Fix**: Install it globally first, or use `--ignore-scripts` + manual rebuild.

**Wins:**
- 3D Card Stack hero with framer-motion is universally understood as premium
- Glassmorphic icon containers with hover glow effects scale well
- Explicit CSS escalation classes (`.esc-amber`, `.esc-red` etc.) are purge-proof

---

*This file is updated after each project session. Read it before starting any new UI work.*
