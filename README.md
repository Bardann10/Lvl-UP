# Level-Up – Personal Productivity Planner

A mobile-first responsive planner application built with **React + Vite**.  
Track daily habits, to-do tasks, monthly goals, yearly goals, a calendar view, achievements, and statistics — all stored locally in the browser.

---

## Getting started

```bash
npm install
npm run dev      # development server
npm run build    # production build
npm run lint     # ESLint check
npm run preview  # preview production build
```

---

## Architecture overview

The project follows a scalable, feature-organised folder structure:

```
src/
├── app/
│   └── router.jsx            # Route path constants & nav item config
├── layout/
│   ├── Layout.jsx            # App shell (header + sidebar + bottom nav + content)
│   ├── Header.jsx            # Sticky top navigation bar
│   ├── Sidebar.jsx           # Desktop sidebar with nav links
│   └── BottomNav.jsx         # Mobile bottom navigation
├── pages/
│   ├── Dashboard.jsx         # Home overview
│   ├── DailyTargets.jsx      # Daily habits + to-do tasks (tabs)
│   ├── ToDoTasks.jsx         # Standalone task planner
│   ├── MonthlyGoals.jsx      # Monthly goals with progress
│   ├── YearlyGoals.jsx       # Yearly goals with progress
│   ├── Calendar.jsx          # Monthly calendar with day detail
│   ├── Search.jsx            # Cross-collection search
│   ├── Settings.jsx          # Theme, notifications, backup/restore
│   ├── Statistics.jsx        # Habit completion statistics & heat map
│   └── Achievements.jsx      # Unlock-based badge system
├── features/
│   └── quickAdd/
│       └── QuickAddModal.jsx # FAB quick-add modal (goal or task)
├── shared/
│   ├── ui/
│   │   ├── Button.jsx        # Button with primary/secondary/ghost variants
│   │   ├── Card.jsx          # Generic Card + StatCard
│   │   ├── EmptyState.jsx    # Empty-list placeholder
│   │   ├── Fab.jsx           # Floating Action Button
│   │   ├── Modal.jsx         # Accessible overlay modal (focus trap, ESC, backdrop)
│   │   ├── ConfirmDialog.jsx # Styled confirm dialog (replaces window.confirm)
│   │   ├── PageHeader.jsx    # Standardised page header (eyebrow + title + action)
│   │   ├── ProgressRing.jsx  # SVG circular progress indicator
│   │   └── MonthCalendar.jsx # Colour-coded monthly calendar grid
│   └── providers/
│       └── ToastProvider.jsx # Context provider + useToast hook
├── services/
│   ├── storage.js            # LocalStorage load/save + defaultData
│   └── notifications.js      # Browser notification helper
├── utils/
│   └── date.js               # Date formatting & key helpers
├── styles/
│   └── tokens.css            # CSS custom property design tokens
├── App.jsx                   # Router + provider wiring + global state
├── main.jsx                  # Entry point
└── index.css                 # Tailwind base + global typography
```

---

## Component map

| Component | Location | Purpose |
|---|---|---|
| `Layout` | `layout/Layout.jsx` | App shell; composes Header, Sidebar, BottomNav |
| `Header` | `layout/Header.jsx` | Sticky top bar with logo and settings link |
| `Sidebar` | `layout/Sidebar.jsx` | Desktop left-rail navigation (hidden on mobile) |
| `BottomNav` | `layout/BottomNav.jsx` | Fixed bottom nav visible on mobile only |
| `Button` | `shared/ui/Button.jsx` | Reusable button with variant support |
| `Card` | `shared/ui/Card.jsx` | Surface card; `StatCard` for metric display |
| `EmptyState` | `shared/ui/EmptyState.jsx` | Empty-list placeholder with optional action |
| `Fab` | `shared/ui/Fab.jsx` | Floating action button (fixed, mobile-aware) |
| `Modal` | `shared/ui/Modal.jsx` | Accessible dialog with focus trap & ESC close |
| `ConfirmDialog` | `shared/ui/ConfirmDialog.jsx` | Confirm/cancel dialog built on Modal |
| `PageHeader` | `shared/ui/PageHeader.jsx` | Consistent page title section |
| `ProgressRing` | `shared/ui/ProgressRing.jsx` | SVG circular progress ring |
| `MonthCalendar` | `shared/ui/MonthCalendar.jsx` | Calendar grid with day-status indicators |
| `ToastProvider` | `shared/providers/ToastProvider.jsx` | Global toast notification context |
| `QuickAddModal` | `features/quickAdd/QuickAddModal.jsx` | Quick-add for goals and tasks via FAB |

---

## Design system

Design tokens are defined as CSS custom properties in `src/styles/tokens.css`:

- **Colours** – `--color-bg`, `--color-surface`, `--color-accent` (sky-400), `--color-success`, `--color-danger`, etc.
- **Radii** – `--radius-sm` through `--radius-xl` (10 px → 32 px)
- **Shadows** – `--shadow-card`, `--shadow-modal`, `--shadow-accent`
- **Transitions** – `--transition-fast`, `--transition-default`, `--transition-slow`
- **Typography** – `--font-sans`, font-weight scale

Component styling uses **Tailwind CSS** utility classes throughout, with the tokens available for custom CSS when needed.

---

## Routing

Routes are declared in `src/app/router.jsx` (`ROUTES` constants and `NAV_ITEMS` array) and rendered in `src/App.jsx`.

| Path | Page |
|---|---|
| `/` | Dashboard |
| `/daily-goals` | Daily Goals & Tasks |
| `/to-do-tasks` | To-Do Task Planner |
| `/monthly-goals` | Monthly Goals |
| `/yearly-goals` | Yearly Goals |
| `/calendar` | Calendar |
| `/search` | Search |
| `/settings` | Settings |
| `/statistics` | Statistics |
| `/achievements` | Achievements |

---

## Data flow

All app state lives in `App.jsx` (`AppShell`) as a single `data` object loaded from and persisted to `localStorage` via `src/services/storage.js`.  
Pages receive sliced state and setter functions as props — no external state library is required.
