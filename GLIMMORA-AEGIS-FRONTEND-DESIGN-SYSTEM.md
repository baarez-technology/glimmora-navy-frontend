# GLIMMORA AEGIS -- NAVY
## Complete Frontend Design System & Product Experience Architecture
### Version 1.0 | Classified: Restricted -- For Official Use Only

---

## 1. APPLICATION SITEMAP

```
GLIMMORA AEGIS -- NAVY
|
|-- PUBLIC WEBSITE (/)
|   |-- / ............................ Hero Landing Page
|   |-- /about ...................... About / Mission
|   |-- /platform .................. Platform Overview & Capabilities
|   |-- /features .................. Feature Deep Dive
|   |-- /defense-tech .............. Defense Technology Showcase
|   |-- /contact ................... Contact & Inquiry
|   |-- /login ..................... Authentication Portal
|
|-- WEB APPLICATION (/app)
|   |
|   |-- /app/dashboard .................. Command Center Dashboard (Main)
|   |
|   |-- TRAINING DOMAINS
|   |   |-- /app/bridge-training ............. Bridge, Navigation & Seamanship
|   |   |-- /app/cic-warfare ................ CIC / Operations Room & Warfare
|   |   |-- /app/engineering ................ Engineering, Propulsion & Platform
|   |   |-- /app/damage-control ............. Damage Control & Survivability
|   |   |-- /app/small-boats ................ Small Boats, Boarding & Maritime Security
|   |   |-- /app/unmanned-systems ........... Unmanned & Autonomous Maritime Systems
|   |
|   |-- AI & INTELLIGENCE
|   |   |-- /app/ai-instructor .............. Adaptive AI Instructor Panel
|   |   |-- /app/predictive-engine .......... Predictive Decision Intelligence
|   |   |-- /app/own-llm .................... OwnLLM Navy Knowledge Interface
|   |
|   |-- DIGITAL TWIN
|   |   |-- /app/digital-twin ............... 3D Digital Twin Viewer
|   |   |-- /app/digital-twin/ship/[id] ..... Ship-Specific Twin
|   |   |-- /app/digital-twin/cognitive ..... Cognitive Digital Twin Monitor
|   |
|   |-- AR/VR TRAINING
|   |   |-- /app/ar-vr/modules .............. AR/VR Training Module Library
|   |   |-- /app/ar-vr/sessions ............. Active / Past Sessions
|   |   |-- /app/ar-vr/authoring ............ Instructor Authoring Tool
|   |
|   |-- WARFARE SIMULATION
|   |   |-- /app/warfare-sim ................ Autonomous Multi-Agent Warfare Sim
|   |   |-- /app/swarm-ai ................... Swarm AI Control Room
|   |   |-- /app/cross-domain ............... Cross-Domain Battle Simulation
|   |   |-- /app/scenario-engine ............ Synthetic Scenario Generation Engine
|   |
|   |-- ANALYTICS & EVALUATION
|   |   |-- /app/analytics .................. Simulator Intelligence & Analytics
|   |   |-- /app/analytics/performance ...... Performance Analytics
|   |   |-- /app/analytics/competency ....... Competency Tracking
|   |   |-- /app/analytics/reports .......... Report Builder
|   |
|   |-- LEARNING & CERTIFICATION
|   |   |-- /app/learning ................... Learning Lifecycle Manager
|   |   |-- /app/certification .............. Certification & Qualification Tracker
|   |   |-- /app/remediation ................ Targeted Remediation Plans
|   |
|   |-- PERSONNEL & FLEET
|   |   |-- /app/trainees ................... Trainee Management
|   |   |-- /app/instructors ................ Instructor Management
|   |   |-- /app/fleet ...................... Fleet Rollout Enterprise Dashboard
|   |
|   |-- ADMINISTRATION
|   |   |-- /app/admin ...................... Admin Panel
|   |   |-- /app/admin/roles ................ Role-Based Access Control
|   |   |-- /app/admin/security ............. Security & Governance
|   |   |-- /app/admin/audit ................ Audit Logs & Compliance
|   |   |-- /app/admin/content .............. Content Ingestion & Validation
|   |
|   |-- USER
|       |-- /app/profile ................... User Profile
|       |-- /app/notifications ............. Notification Center
|       |-- /app/settings .................. Settings
```

---

## 2. UI ARCHITECTURE

### 2.1 Layout System

```
+------------------------------------------------------------------+
|  TOPBAR (64px)                                                     |
|  [Logo] [Breadcrumb] [Search] [Alerts] [AI Widget] [Profile]     |
+----------+-------------------------------------------------------+
|          |                                                         |
| SIDEBAR  |  MAIN CONTENT AREA                                     |
| (280px)  |                                                         |
| Collaps- |  +---------------------------------------------------+ |
| ible     |  | PAGE HEADER                                       | |
|          |  | Title + Actions + Filters                         | |
| [Nav     |  +---------------------------------------------------+ |
|  Groups] |  |                                                     | |
|          |  | CONTENT GRID                                       | |
| - Dash   |  | (CSS Grid / Flexbox responsive layout)             | |
| - Train  |  |                                                     | |
| - AI     |  | +-------------+ +-------------+ +-------------+   | |
| - Twin   |  | | Glass Card  | | Glass Card  | | Glass Card  |   | |
| - AR/VR  |  | |             | |             | |             |   | |
| - War    |  | +-------------+ +-------------+ +-------------+   | |
| - Analyt |  |                                                     | |
| - Learn  |  | +---------------------------------------------+   | |
| - Fleet  |  | | Full-Width Panel                              |   | |
| - Admin  |  | |                                               |   | |
|          |  | +---------------------------------------------+   | |
| [Bottom  |  |                                                     | |
|  Actions]|  +---------------------------------------------------+ |
+----------+-------------------------------------------------------+
|  STATUS BAR (32px) [System Status] [Connection] [Classification]  |
+------------------------------------------------------------------+
|                                                                    |
|  FLOATING AI ASSISTANT WIDGET (bottom-right)                      |
|  [Expandable orb with pulse animation]                            |
+------------------------------------------------------------------+
```

### 2.2 Component Hierarchy

```
<AppShell>
  <ThemeProvider>
    <TopBar />
    <Sidebar />
    <MainContent>
      <PageHeader />
      <ContentArea>
        {children}
      </ContentArea>
    </MainContent>
    <StatusBar />
    <AIAssistantWidget />
    <NotificationToaster />
    <CommandPalette /> {/* Ctrl+K */}
  </ThemeProvider>
</AppShell>
```

---

## 3. COLOR PALETTE

### 3.1 Core Colors

| Token                    | Hex       | Usage                                    |
|--------------------------|-----------|------------------------------------------|
| `--aegis-void`           | `#030712` | Deepest background, app shell            |
| `--aegis-abyss`          | `#0a0f1e` | Primary background                       |
| `--aegis-deep-navy`      | `#0d1526` | Card backgrounds, panels                 |
| `--aegis-navy`           | `#111d35` | Secondary surfaces                       |
| `--aegis-steel`          | `#1a2744` | Elevated surfaces, sidebar               |
| `--aegis-gunmetal`       | `#2a3a5c` | Borders, dividers                        |
| `--aegis-slate`          | `#3d4f6f` | Inactive elements                        |
| `--aegis-mist`           | `#8899b8` | Secondary text                           |
| `--aegis-cloud`          | `#b8c5db` | Primary text                             |
| `--aegis-white`          | `#e8edf5` | Headings, emphasis                       |

### 3.2 Accent / Signal Colors

| Token                    | Hex       | Usage                                    |
|--------------------------|-----------|------------------------------------------|
| `--aegis-cyan`           | `#00e5ff` | Primary accent, active states, links     |
| `--aegis-cyan-glow`      | `#00e5ff40`| Glow effects, shadows                   |
| `--aegis-cyan-deep`      | `#0097a7` | Hover states                             |
| `--aegis-blue`           | `#2979ff` | Secondary accent, info states            |
| `--aegis-electric`       | `#448aff` | Interactive highlights                   |
| `--aegis-gold`           | `#ffd740` | Warnings, premium badges, rank           |
| `--aegis-amber`          | `#ffab40` | Caution states                           |
| `--aegis-red`            | `#ff1744` | Errors, critical alerts, hostile tracks  |
| `--aegis-red-glow`       | `#ff174440`| Danger glow                             |
| `--aegis-green`          | `#00e676` | Success, friendly tracks, online         |
| `--aegis-green-glow`     | `#00e67640`| Success glow                            |
| `--aegis-purple`         | `#7c4dff` | AI/Intelligence indicators               |
| `--aegis-orange`         | `#ff6d00` | Threat level, fire indicators            |

### 3.3 Semantic Force Colors (Warfare Simulation)

| Token                    | Hex       | Usage                                    |
|--------------------------|-----------|------------------------------------------|
| `--force-blue`           | `#2979ff` | Blue force (friendly)                    |
| `--force-red`            | `#ff1744` | Red force (hostile)                      |
| `--force-green`          | `#00e676` | Neutral force                            |
| `--force-white`          | `#e8edf5` | White force (civilian shipping)          |
| `--force-yellow`         | `#ffd740` | Unknown / Pending classification         |

### 3.4 Gradient Definitions

```css
--gradient-glass:     linear-gradient(135deg, rgba(13,21,38,0.7), rgba(26,39,68,0.4));
--gradient-card:      linear-gradient(145deg, rgba(17,29,53,0.8), rgba(10,15,30,0.6));
--gradient-cyan:      linear-gradient(135deg, #00e5ff, #0097a7);
--gradient-danger:    linear-gradient(135deg, #ff1744, #d50000);
--gradient-hero:      linear-gradient(180deg, #030712 0%, #0a0f1e 40%, #0d1526 100%);
--gradient-sidebar:   linear-gradient(180deg, #0d1526, #111d35);
--gradient-topbar:    linear-gradient(90deg, rgba(13,21,38,0.95), rgba(17,29,53,0.9));
--gradient-radial:    radial-gradient(ellipse at center, rgba(0,229,255,0.08) 0%, transparent 70%);
--gradient-glow:      radial-gradient(circle, rgba(0,229,255,0.15), transparent 60%);
```

---

## 4. TYPOGRAPHY SYSTEM

### 4.1 Font Stack

```
--font-display:   'Orbitron', 'Rajdhani', system-ui, sans-serif;
--font-heading:   'Rajdhani', 'Inter', system-ui, sans-serif;
--font-body:      'Inter', 'Segoe UI', system-ui, sans-serif;
--font-mono:      'JetBrains Mono', 'Fira Code', monospace;
--font-data:      'Space Mono', 'JetBrains Mono', monospace;
```

### 4.2 Type Scale

| Level          | Font              | Size    | Weight | Letter Spacing | Line Height | Usage                        |
|----------------|-------------------|---------|--------|----------------|-------------|------------------------------|
| Display XL     | Orbitron          | 72px    | 900    | +0.04em        | 1.0         | Hero headline                |
| Display LG     | Orbitron          | 56px    | 700    | +0.03em        | 1.1         | Section headlines             |
| Display        | Orbitron          | 40px    | 700    | +0.02em        | 1.15        | Page titles                  |
| H1             | Rajdhani          | 32px    | 700    | +0.02em        | 1.2         | Major section heads          |
| H2             | Rajdhani          | 24px    | 600    | +0.015em       | 1.3         | Card titles                  |
| H3             | Rajdhani          | 20px    | 600    | +0.01em        | 1.4         | Subsection heads             |
| H4             | Inter             | 16px    | 600    | +0.01em        | 1.4         | Label emphasis               |
| Body LG        | Inter             | 16px    | 400    | 0              | 1.6         | Primary body text            |
| Body           | Inter             | 14px    | 400    | 0              | 1.5         | Default body text            |
| Body SM        | Inter             | 13px    | 400    | +0.005em       | 1.5         | Secondary text               |
| Caption        | Inter             | 12px    | 500    | +0.02em        | 1.4         | Labels, captions             |
| Overline       | Rajdhani          | 11px    | 700    | +0.08em        | 1.3         | Category labels (UPPERCASE)  |
| Data           | Space Mono        | 14px    | 400    | +0.02em        | 1.4         | Metrics, readings, codes     |
| Data LG        | Space Mono        | 28px    | 700    | +0.02em        | 1.0         | KPI numbers                  |
| Badge          | Rajdhani          | 10px    | 700    | +0.06em        | 1.0         | Status badges (UPPERCASE)    |

---

## 5. DESIGN TOKENS

### 5.1 Spacing

```
--space-1:  4px      --space-6:  24px
--space-2:  8px      --space-7:  32px
--space-3:  12px     --space-8:  40px
--space-4:  16px     --space-9:  48px
--space-5:  20px     --space-10: 64px
```

### 5.2 Border Radius

```
--radius-sm:    4px    (buttons, badges)
--radius-md:    8px    (cards, inputs)
--radius-lg:    12px   (panels, modals)
--radius-xl:    16px   (hero cards)
--radius-2xl:   24px   (floating widgets)
--radius-full:  9999px (avatars, orbs)
```

### 5.3 Shadows & Glows

```
--shadow-card:     0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
--shadow-elevated: 0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
--shadow-modal:    0 16px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4);
--shadow-cyan:     0 0 20px rgba(0,229,255,0.15), 0 0 60px rgba(0,229,255,0.05);
--shadow-red:      0 0 20px rgba(255,23,68,0.15), 0 0 60px rgba(255,23,68,0.05);
--shadow-inner:    inset 0 1px 4px rgba(0,0,0,0.3);
--glow-cyan:       0 0 8px #00e5ff, 0 0 24px rgba(0,229,255,0.3);
--glow-pulse:      0 0 12px #00e5ff, 0 0 40px rgba(0,229,255,0.2), 0 0 80px rgba(0,229,255,0.1);
```

### 5.4 Glass / Frost Effects

```
--glass-bg:        rgba(13, 21, 38, 0.6);
--glass-border:    1px solid rgba(255, 255, 255, 0.06);
--glass-backdrop:  blur(16px) saturate(180%);
--glass-bg-hover:  rgba(17, 29, 53, 0.7);
--glass-shine:     linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%);
```

### 5.5 Z-Index Scale

```
--z-base:       0
--z-dropdown:   100
--z-sticky:     200
--z-sidebar:    300
--z-topbar:     400
--z-modal:      500
--z-toast:      600
--z-tooltip:    700
--z-ai-widget:  800
--z-command:    900
```

---

## 6. ANIMATION SYSTEM

### 6.1 Transition Tokens

```
--ease-default:   cubic-bezier(0.4, 0, 0.2, 1);       /* Standard */
--ease-in:        cubic-bezier(0.4, 0, 1, 1);          /* Accelerate */
--ease-out:       cubic-bezier(0, 0, 0.2, 1);          /* Decelerate */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);   /* Overshoot */
--ease-tactical:  cubic-bezier(0.16, 1, 0.3, 1);       /* Military snap */

--duration-fast:   150ms
--duration-base:   250ms
--duration-slow:   400ms
--duration-reveal: 800ms
--duration-cinematic: 1200ms
```

### 6.2 Animation Library (Framer Motion Variants)

```typescript
// Page transition
const pageVariants = {
  initial:  { opacity: 0, y: 20, filter: "blur(8px)" },
  animate:  { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16,1,0.3,1] }},
  exit:     { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.3 }}
};

// Stagger children
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 }}
};

// Card entrance
const cardVariants = {
  initial:  { opacity: 0, y: 30, scale: 0.96 },
  animate:  { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16,1,0.3,1] }},
  hover:    { y: -4, scale: 1.01, boxShadow: "0 0 30px rgba(0,229,255,0.12)" }
};

// Radar sweep (CSS keyframe)
@keyframes radar-sweep {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

// Pulse glow
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(0,229,255,0.3); }
  50%      { box-shadow: 0 0 24px rgba(0,229,255,0.5), 0 0 60px rgba(0,229,255,0.15); }
}

// Grid scan line
@keyframes grid-scan {
  0%   { transform: translateY(-100%); opacity: 0; }
  50%  { opacity: 0.6; }
  100% { transform: translateY(100vh); opacity: 0; }
}

// Data counter (number tick-up)
@keyframes count-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

// Holographic shimmer
@keyframes holo-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

### 6.3 Micro-Interactions

| Interaction              | Animation                                          |
|--------------------------|---------------------------------------------------|
| Button hover             | Scale 1.02 + cyan border glow fade-in (150ms)     |
| Card hover               | Lift -4px + subtle cyan shadow bloom (250ms)       |
| Nav item active          | Left cyan bar slide-in + bg opacity shift (200ms)  |
| Toggle switch            | Spring-physics slide + color morph (300ms spring)  |
| Dropdown open            | Scale Y from 0.95 + opacity + blur clear (200ms)  |
| Modal appear             | Backdrop blur + card scale from 0.9 (400ms)        |
| Toast notification       | Slide in from right + progress bar drain (auto)    |
| Data refresh             | Number flip counter animation (600ms)              |
| Sidebar collapse         | Width morph 280px -> 72px + icon rotate (300ms)    |
| Chart load               | SVG path draw + data point pop-in stagger (800ms)  |
| Radar ping               | Expanding concentric rings with fade (2s loop)     |
| Status badge change      | Color morph + subtle pulse (400ms)                 |
| AI Widget pulse          | Breathing glow orb (3s infinite ease-in-out)       |
| Page scroll reveal       | Intersection observer slide-up + blur clear        |

---

## 7. COMPONENT LIBRARY

### 7.1 Core Components

```
Layout:
  AppShell           - Root layout wrapper
  Sidebar            - Collapsible nav with grouped sections
  TopBar             - Search, alerts, AI toggle, profile
  StatusBar          - Bottom system status strip
  PageHeader         - Title, breadcrumbs, actions
  ContentGrid        - Responsive grid wrapper
  GlassPanel         - Frosted glass container
  CommandCenterLayout - Full-screen tactical layout

Navigation:
  NavGroup           - Sidebar section with icon + label
  NavItem            - Individual nav link with active state
  Breadcrumbs        - Hierarchical path display
  CommandPalette     - Ctrl+K search overlay
  TabsNavigation     - Horizontal tab bar

Data Display:
  MetricCard         - KPI with number, trend, sparkline
  StatBlock          - Large data number with label
  DataTable          - Sortable, filterable table with glass rows
  Timeline           - Vertical event timeline
  ActivityFeed       - Real-time event log
  CompetencyRadar    - Spider/radar chart for skills
  ProgressRing       - Circular progress indicator
  StatusBadge        - Colored status pill (ONLINE, ALERT, etc.)
  RankBadge          - Military rank display
  ForceMarker        - Blue/Red/Neutral force icon

Charts & Visualization:
  TacticalMap        - 2D/3D tactical plot
  RadarDisplay       - Animated radar sweep with contacts
  HeatMap            - Performance heat grid
  GaugeCluster       - Engineering gauges (temp, pressure, RPM)
  FlowDiagram        - System flow / pipe diagram
  WaveformDisplay    - Signal / sonar waveform
  OrbitalChart       - 3D orbiting data visualization
  BattleTimeline     - Horizontal engagement timeline

3D Components:
  ShipViewer         - Three.js ship digital twin viewer
  CompartmentExplorer - Interior compartment walkthrough
  BattlespaceView    - 3D tactical environment
  EngineRoomExplorer - Engineering 3D walkthrough
  SwarmVisualizer    - 3D swarm behavior renderer

Forms & Input:
  GlassInput         - Frosted text input
  GlassSelect        - Dropdown selector
  GlassTextarea      - Multi-line input
  SliderControl      - Range slider with glow thumb
  ToggleSwitch       - Animated toggle
  DateRangePicker    - Tactical date selector
  SearchBar          - Global search with suggestions

Feedback:
  ToastNotification  - Slide-in alert with category icon
  AlertBanner        - Full-width warning/info strip
  ConfirmDialog      - Destructive action confirmation
  LoadingSpinner     - Radar-style loading animation
  SkeletonCard       - Glass shimmer placeholder
  ProgressBar        - Linear progress with glow

Overlays:
  Modal              - Centered dialog with backdrop blur
  Drawer             - Slide-in side panel
  Popover            - Contextual popup
  Tooltip            - Hover info with arrow
  CommandPalette     - Full-screen search/command overlay

AI Components:
  AIAssistantWidget  - Floating orb with chat expansion
  AIResponseCard     - Formatted AI response with citations
  AISuggestionChip   - Actionable AI recommendation
  AIConfidenceMeter  - Confidence bar with percentage
```

---

## 8. PAGE-BY-PAGE UI BREAKDOWN

### 8.1 PUBLIC LANDING PAGE

```
HERO SECTION
+------------------------------------------------------------------+
| [Full-screen dark gradient background]                            |
| [Animated tactical grid with perspective]                         |
| [3D rotating ship wireframe hologram - Three.js]                  |
|                                                                    |
|   GLIMMORA AEGIS                           [Radar sweep bg effect] |
|   - N A V Y -                                                      |
|                                                                    |
|   "AGI-First 3D Digital Twin &                                    |
|    AR/VR Naval Training Platform"                                 |
|                                                                    |
|   [Typewriter effect subtitle cycling through capabilities]       |
|                                                                    |
|   [ Request Demo ]  [ Explore Platform ]                          |
|   (Cyan glow btn)   (Ghost glass btn)                             |
|                                                                    |
|   [Floating badges: "100% Offline" "Air-Gapped" "Sovereign"]     |
|                                                                    |
| [Scroll indicator with pulsing chevron]                           |
+------------------------------------------------------------------+

WHY CHOOSE US
+------------------------------------------------------------------+
| [Overline: "WHY GLIMMORA AEGIS"]                                  |
| [H1: "The Future of Naval Training"]                              |
|                                                                    |
| +------------------+ +------------------+ +------------------+    |
| | [Icon: Brain]    | | [Icon: Ship]     | | [Icon: VR]       |    |
| | AGI Intelligence | | 3D Digital Twin  | | AR/VR Immersion  |    |
| | Offline AI that  | | High-fidelity    | | Full immersive   |    |
| | teaches, adapts  | | ship models with | | training across  |    |
| | and assesses     | | live behaviors   | | all domains      |    |
| +------------------+ +------------------+ +------------------+    |
| +------------------+ +------------------+ +------------------+    |
| | [Icon: Shield]   | | [Icon: Radar]    | | [Icon: Chart]    |    |
| | Sovereign &      | | Multi-Agent      | | Analytics &      |    |
| | Air-Gapped       | | Warfare Sim      | | Certification    |    |
| +------------------+ +------------------+ +------------------+    |
+------------------------------------------------------------------+

PLATFORM SHOWCASE (Horizontal scroll / parallax)
+------------------------------------------------------------------+
| [Large 3D scene: Ship digital twin rotating with system overlays] |
| [As user scrolls, sections of the ship illuminate]                |
|                                                                    |
| Bridge >> CIC >> Engineering >> DC >> Small Boats >> Unmanned     |
|                                                                    |
| [Each section fades in with capability description + stats]       |
+------------------------------------------------------------------+

CAPABILITIES GRID
+------------------------------------------------------------------+
| [Bento grid layout - mixed card sizes]                            |
|                                                                    |
| +--Large Card (2x2)----+ +--Card--+ +--Card--+                   |
| | Adaptive AI          | | Swarm  | | Cross  |                   |
| | Instructor           | | AI     | | Domain |                   |
| | [Animation showing   | |        | | Battle |                   |
| |  AI teaching modes]  | |        | |        |                   |
| +----------------------+ +--------+ +--------+                   |
| +--Card--+ +--Card--+ +--Large Card (2x1)----+                   |
| | Predict| | Cogn.  | | Scenario Generation   |                   |
| | Engine | | Twin   | | Engine                |                   |
| +--------+ +--------+ +----------------------+                   |
+------------------------------------------------------------------+

DEFENSE TECH SECTION
+------------------------------------------------------------------+
| [Dark cinematic section with particle effects]                    |
| [Counter animation: "500+ Scenarios" "24/7 Offline" "6 Domains"] |
| [Animated stats cards with number tick-up on scroll intersection] |
+------------------------------------------------------------------+

CONTACT / CTA
+------------------------------------------------------------------+
| [Glass form panel centered]                                       |
| [Fields: Name, Organization, Role, Email, Message]               |
| [Submit button with loading state]                                |
| [Background: Subtle tactical grid with breathing glow]           |
+------------------------------------------------------------------+
```

### 8.2 COMMAND CENTER DASHBOARD (/app/dashboard)

```
+------------------------------------------------------------------+
| TOPBAR                                                             |
| [Glimmora Logo] | Dashboard | [Search] | [Alerts 3] | [Profile] |
+------+-----------------------------------------------------------+
|      |                                                             |
| SIDE | +--SYSTEM STATUS BAR (full width)------------------------+ |
| BAR  | | [Server: ONLINE] [AI: ACTIVE] [Twin: SYNCED] [Class: R] | |
|      | +-------------------------------------------------------+ |
|      |                                                             |
|      | +--KPI ROW (4 cards)------------------------------------+ |
|      | | Active    | Scenarios  | Competency  | Fleet          | |
|      | | Trainees  | Running    | Score Avg   | Readiness      | |
|      | | [247]     | [12]       | [78.4%]     | [91.2%]        | |
|      | | +14 today | 3 warfare  | +2.1% week  | 4 ships active | |
|      | | [sparkln] | [sparkln]  | [sparkln]   | [sparkln]      | |
|      | +-------------------------------------------------------+ |
|      |                                                             |
|      | +--MAIN ROW (2 panels)----------------------------------+ |
|      | | TRAINING ACTIVITY MAP      | REAL-TIME ANALYTICS       | |
|      | | [3D globe/map with active  | [Live updating charts]    | |
|      | |  training locations marked  | - Sessions by domain      | |
|      | |  with pulsing dots]         | - Performance trend       | |
|      | |                             | - Error frequency         | |
|      | |                             | - Competency distribution | |
|      | +---------------------------+-------------------------+ |
|      |                                                             |
|      | +--BOTTOM ROW (3 panels)---------------------------------+ |
|      | | RECENT SESSIONS    | AI INSTRUCTOR   | ALERTS &         | |
|      | | [Table: Recent     | INSIGHTS        | NOTIFICATIONS    | |
|      | |  training sessions | [AI-generated   | [Priority-sorted | |
|      | |  with status,     | recommendations | alert feed with  | |
|      | |  scores, domain]  | for training    | severity badges] | |
|      | |                   | improvements]   |                  | |
|      | +------------------+-----------------+------------------+ |
+------+-----------------------------------------------------------+
| STATUS: System Nominal | Deployment: Air-Gapped | RESTRICTED     |
+------------------------------------------------------------------+
```

### 8.3 AI INSTRUCTOR PANEL (/app/ai-instructor)

```
+------------------------------------------------------------------+
| AI INSTRUCTOR DASHBOARD                              [Configure]  |
+------------------------------------------------------------------+
|                                                                    |
| +--INSTRUCTOR MODE SELECTOR (horizontal tabs)--------------------+|
| | [Silent Observe] [Hinting] [Guided Q] [Corrective] [Challenge]||
| +---------------------------------------------------------------+|
|                                                                    |
| +--LEFT COLUMN (60%)-------------+ +--RIGHT COLUMN (40%)--------+|
| | ACTIVE SESSIONS MONITOR        | | AI INTERVENTION LOG         ||
| | +----------------------------+ | | [Timeline of AI actions]    ||
| | | Session: BRM-047           | | | 14:23 - Hint sent to T.043 ||
| | | Trainee: LT J. Kumar      | | | 14:21 - Challenge escalated ||
| | | Domain: Bridge Navigation  | | | 14:19 - Silent observation  ||
| | | Status: [ACTIVE - 47min]   | | | 14:15 - Session started     ||
| | | AI Mode: Guided Questioning| | |                              ||
| | | Confidence: [====== 82%]   | | +----------------------------+||
| | | Last Action: "Why did you  | | | COMPETENCY IMPACT           ||
| | |  alter course to port?"    | | | [Radar chart showing        ||
| | +----------------------------+ | |  competency changes from     ||
| | +----------------------------+ | |  AI interventions]           ||
| | | Session: CIC-012           | | |                              ||
| | | ...                        | | +----------------------------+||
| | +----------------------------+ | | POLICY CONTROLS             ||
| +--------------------------------+ | [Toggle switches for        ||
|                                    | intervention thresholds,     ||
|                                    | approval requirements]       ||
|                                    +----------------------------+||
+------------------------------------------------------------------+
```

### 8.4 DIGITAL TWIN SHIP VIEWER (/app/digital-twin)

```
+------------------------------------------------------------------+
| 3D DIGITAL TWIN                                    [Ship Select]  |
+------------------------------------------------------------------+
|                                                                    |
| +--3D VIEWPORT (full width, 70vh)-------------------------------+|
| |                                                                 ||
| |    [Three.js rendered ship model]                              ||
| |    [Rotate / Zoom / Pan controls]                              ||
| |    [System highlight overlays on hover]                        ||
| |    [Compartment click-through navigation]                      ||
| |                                                                 ||
| |    [Floating labels: "Bridge" "CIC" "Engine Room" "DC Central"]||
| |                                                                 ||
| |    [Bottom toolbar: Wireframe | Solid | X-Ray | Systems]      ||
| |    [Layer toggles: Hull | Propulsion | Electrical | Piping]    ||
| |                                                                 ||
| +---------------------------------------------------------------+|
|                                                                    |
| +--SYSTEM PANELS (horizontal scroll cards)----------------------+|
| | [Propulsion]  [Power Gen]  [Fuel]  [Firefighting]  [Comms]    ||
| | Status: OK    Status: OK   85%     Status: OK      Status: OK ||
| | [Gauge]       [Gauge]      [Bar]   [Gauge]         [Gauge]    ||
| +---------------------------------------------------------------+|
|                                                                    |
| +--DETAIL PANEL (expandable)------------------------------------+|
| | Selected: Main Propulsion System                                ||
| | [Schematic diagram] [Component list] [Fault history]           ||
| +---------------------------------------------------------------+|
+------------------------------------------------------------------+
```

### 8.5 WARFARE SIMULATION CENTER (/app/warfare-sim)

```
+------------------------------------------------------------------+
| AUTONOMOUS MULTI-AGENT WARFARE SIMULATION        [New Scenario]   |
+------------------------------------------------------------------+
|                                                                    |
| +--TACTICAL MAP (full width, 65vh)------------------------------+|
| |                                                                 ||
| |  [2D/3D tactical plot - ocean chart with grid]                 ||
| |  [Blue force icons with track lines]                           ||
| |  [Red force icons with predicted movement]                     ||
| |  [Neutral/civilian shipping tracks]                            ||
| |  [Sensor coverage circles with transparency]                   ||
| |  [Weapon engagement envelopes (dashed)]                        ||
| |  [Swarm clusters with formation indicators]                    ||
| |                                                                 ||
| |  [Mini-map corner overlay]                                     ||
| |  [Time control: |<< << [PLAY] >> >>| Speed: 2x]               ||
| |  [Legend: Force colors + track types]                          ||
| |                                                                 ||
| +---------------------------------------------------------------+|
|                                                                    |
| +--CONTROL PANELS (bottom row, 3 columns)----------------------+|
| | AGENT STATUS         | FORCE COMPOSITION    | BATTLE ANALYTICS||
| | [List of active      | [Blue: 4 ships,      | [Engagement     ||
| |  agents with their   |  2 UAV, 1 USV]       |  timeline]      ||
| |  current objectives, | [Red: 6 ships,       | [Casualty       ||
| |  doctrine state,     |  12 UAV swarm,       |  report]        ||
| |  autonomy level]     |  3 UUV]              | [Score card]    ||
| +---------------------+----------------------+-----------------+|
+------------------------------------------------------------------+
```

### 8.6 SWARM AI CONTROL ROOM (/app/swarm-ai)

```
+------------------------------------------------------------------+
| SWARM AI & EMERGENT BEHAVIOR MODELING              [Launch Sim]   |
+------------------------------------------------------------------+
|                                                                    |
| +--3D SWARM VISUALIZATION (center, 60vh)------------------------+|
| |  [Three.js particle system showing swarm entities]              ||
| |  [Color-coded by role: scout/decoy/strike/defense]             ||
| |  [Connection lines between coordinating units]                  ||
| |  [Formation shape indicators]                                   ||
| |  [Behavior state labels floating above clusters]               ||
| +---------------------------------------------------------------+|
|                                                                    |
| +--LEFT PANEL (30%)---+ +--RIGHT PANEL (70%)-------------------+|
| | SWARM PARAMETERS    | | EMERGENT BEHAVIOR LOG                 ||
| | Entity Count: [24]  | | [Real-time log of emergent phenomena] ||
| | Formation: [V-shape]| | 14:23 - Leader-loss recovery observed ||
| | Aggression: [===--] | | 14:22 - Target reassignment cascade   ||
| | Coordination: [High]| | 14:20 - Congestion at waypoint alpha  ||
| | Stochasticity: [Low]| |                                        ||
| | [Apply] [Reset]     | | [EMERGENT PATTERN HEATMAP]            ||
| +---------------------+ +--------------------------------------+|
+------------------------------------------------------------------+
```

### 8.7 ANALYTICS & INTELLIGENCE CENTER (/app/analytics)

```
+------------------------------------------------------------------+
| SIMULATOR INTELLIGENCE & ANALYTICS                  [Export PDF]  |
+------------------------------------------------------------------+
|                                                                    |
| +--FILTER BAR----------------------------------------------+     |
| | Domain: [All] | Ship: [All] | Cohort: [2024-B] | Range: [30d] |
| +----------------------------------------------------------+     |
|                                                                    |
| +--KPI ROW (6 metrics)----------------------------------------+  |
| | Procedural   | Avg Time to  | Safety Event | Error    | Pass |  |
| | Compliance   | Complete     | Detection    | Rate     | Rate |  |
| | [94.2%]      | [23m 14s]    | [99.1%]      | [3.2%]   | [87%]|  |
| +-------------------------------------------------------------+  |
|                                                                    |
| +--CHARTS ROW (2 columns)-------------------------------------+  |
| | PERFORMANCE TREND                | COMPETENCY RADAR           |  |
| | [Line chart: 6 domains over     | [Spider chart: Bridge,     |  |
| |  time with trend lines]         |  CIC, Eng, DC, Boats, UAV] |  |
| +-------------------------------+-----------------------------+  |
|                                                                    |
| +--BOTTOM ROW (2 columns)-------------------------------------+  |
| | ERROR PATTERN HEATMAP            | CROSS-SESSION COMPARISON   |  |
| | [Heatmap: errors by category     | [Grouped bar chart:        |  |
| |  and training stage]             |  session-over-session]      |  |
| +-------------------------------+-----------------------------+  |
|                                                                    |
| +--DATA TABLE--------------------------------------------------+  |
| | [Sortable table: Trainee, Domain, Score, Errors, Trend, etc] |  |
| +-------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### 8.8 FLEET ROLLOUT ENTERPRISE DASHBOARD (/app/fleet)

```
+------------------------------------------------------------------+
| FLEET ENTERPRISE DASHBOARD                       [Sync Status]    |
+------------------------------------------------------------------+
|                                                                    |
| +--MAP VIEW (full width, 50vh)----------------------------------+|
| | [Map of naval bases with status indicators]                     ||
| | [Each base: icon + trainee count + readiness score]            ||
| | [Connection lines showing data sync status]                     ||
| | [Color intensity = activity level]                              ||
| +---------------------------------------------------------------+|
|                                                                    |
| +--BASE CARDS (horizontal scroll)-------------------------------+|
| | [Base Alpha]  [Base Bravo]  [Base Charlie]  [INS Vikrant]     ||
| | 120 trainees  89 trainees   204 trainees    67 trainees       ||
| | Ready: 94%    Ready: 87%    Ready: 91%      Ready: 96%        ||
| | [Sparkline]   [Sparkline]   [Sparkline]     [Sparkline]       ||
| +---------------------------------------------------------------+|
|                                                                    |
| +--FLEET METRICS (3 columns)------------------------------------+|
| | READINESS BY DOMAIN    | QUALIFICATION STATUS  | DEPLOYMENT    ||
| | [Stacked bar chart]    | [Donut charts per     | SCHEDULE      ||
| |                        |  certification level]  | [Timeline]    ||
| +------------------------+----------------------+---------------+|
+------------------------------------------------------------------+
```

### 8.9 SCENARIO GENERATION ENGINE (/app/scenario-engine)

```
+------------------------------------------------------------------+
| SYNTHETIC SCENARIO GENERATION ENGINE              [Generate New]  |
+------------------------------------------------------------------+
|                                                                    |
| +--BUILDER PANEL (left 40%)--------+ +--PREVIEW (right 60%)----+|
| | SCENARIO PARAMETERS              | | [Live preview of         ||
| |                                   | |  generated scenario      ||
| | Domain: [Bridge Navigation  v]   | |  parameters and           ||
| | Difficulty: [====>--- Advanced]  | |  conditions on map]       ||
| | Weather: [Heavy Rain v]          | |                            ||
| | Sea State: [5 v]                 | | [Scenario timeline        ||
| | Visibility: [Reduced v]          | |  with inject markers]     ||
| | Traffic: [Dense v]               | |                            ||
| | Threat Profile: [Multi-axis v]   | | [Decision tree            ||
| | Engineering: [Degraded v]        | |  showing branch            ||
| | Casualties: [Progressive v]     | |  points]                   ||
| | Cross-Domain: [Cyber + EW v]    | |                            ||
| |                                   | +---------------------------+|
| | [Generate Family]                | |                            ||
| | [Generate Remediation]           | | APPROVAL STATUS            ||
| | [Generate Red Cell]              | | [Pending Review]           ||
| +----------------------------------+ | [Approve] [Reject] [Edit] ||
|                                      +---------------------------+|
+------------------------------------------------------------------+
```

---

## 9. UX FLOWS

### 9.1 Authentication Flow
```
Login Page -> MFA Challenge -> Role Selection (if multi-role) -> Dashboard
```

### 9.2 Training Session Flow
```
Dashboard -> Select Domain -> Browse Scenarios -> Configure Session ->
Launch Session -> [Active Training with AI Instructor] ->
Session Complete -> Auto-Debrief Generation -> Review & Sign-off
```

### 9.3 Instructor Authoring Flow
```
Scenario Engine -> Set Parameters -> Generate Variants -> Review ->
Approve -> Publish to Library -> Assign to Cohort/Individual
```

### 9.4 Competency Evaluation Flow
```
Analytics -> Select Trainee -> View Multi-Domain Radar ->
Drill into Weak Area -> View Session Replay -> Generate Remediation Plan ->
Assign Remediation Exercises -> Track Progress
```

### 9.5 AI Instructor Interaction Flow
```
Session Active -> AI Monitors Actions -> Detects Hesitation/Error ->
Selects Intervention Mode -> Delivers Prompt -> Logs Response ->
Updates Competency Model -> Adjusts Difficulty if Needed
```

---

## 10. MOBILE RESPONSIVE STRATEGY

### Breakpoints
```
--bp-mobile:    0 - 639px      (Single column, bottom nav)
--bp-tablet:    640 - 1023px   (Two column, collapsible sidebar)
--bp-desktop:   1024 - 1439px  (Full layout, sidebar visible)
--bp-wide:      1440px+        (Extended panels, data-dense views)
--bp-ultra:     1920px+        (Command center mode, multi-panel)
```

### Responsive Adaptations
| Component          | Mobile              | Tablet             | Desktop            |
|--------------------|---------------------|--------------------|---------------------|
| Sidebar            | Bottom sheet nav    | Collapsible overlay | Fixed sidebar 280px |
| TopBar             | Simplified icons    | Full bar           | Full bar            |
| Dashboard KPIs     | 2-column stack      | 2x2 grid           | 4-column row        |
| Charts             | Single column       | 2-column           | Side-by-side        |
| 3D Viewer          | Touch gesture zoom  | Full with panel    | Full with side panel|
| Data Tables        | Card view mode      | Horizontal scroll  | Full table          |
| AI Widget          | Full-screen chat    | Side panel         | Floating orb        |
| Tactical Map       | Simplified view     | Full with overlay  | Full multi-layer    |

---

## 11. RECOMMENDED TECH STACK

### Core Framework
| Layer              | Technology                    | Version    |
|--------------------|-------------------------------|------------|
| Framework          | Next.js (App Router)          | 15.x       |
| Language           | TypeScript                    | 5.x        |
| Styling            | Tailwind CSS                  | 4.x        |
| Component Base     | shadcn/ui                     | latest     |
| Icons              | Lucide React + custom SVG     | latest     |

### Animation & 3D
| Layer              | Technology                    | Purpose              |
|--------------------|-------------------------------|----------------------|
| Motion             | Framer Motion                 | Page/component anim  |
| Cinematic          | GSAP                          | Scroll, timeline FX  |
| 3D Engine          | Three.js + React Three Fiber  | Ship twins, swarm    |
| 3D Helpers         | @react-three/drei             | 3D utilities         |
| 3D Post-process    | @react-three/postprocessing   | Bloom, glow effects  |

### Data & State
| Layer              | Technology                    | Purpose              |
|--------------------|-------------------------------|----------------------|
| State Management   | Zustand                       | Client state         |
| Server State       | TanStack Query                | API cache & sync     |
| Charts             | Recharts + ECharts            | Analytics viz        |
| Maps               | Mapbox GL / Deck.gl           | Tactical maps        |
| Tables             | TanStack Table                | Data grids           |
| Forms              | React Hook Form + Zod         | Form management      |

### Infrastructure
| Layer              | Technology                    | Purpose              |
|--------------------|-------------------------------|----------------------|
| Auth               | Custom JWT (air-gapped)       | Authentication       |
| API                | tRPC or REST                  | Backend communication|
| Real-time          | WebSocket (native)            | Live updates         |
| Testing            | Vitest + Playwright           | Unit + E2E           |
| Linting            | ESLint + Prettier             | Code quality         |

---

## 12. PREMIUM DESIGN RECOMMENDATIONS

### 12.1 Best Homepage Hero Animation
- **3D holographic ship** rotating slowly with system callout lines that animate on scroll
- **Particle field** behind the ship that responds to mouse movement (parallax depth)
- **Typewriter effect** cycling through key capabilities: "Digital Twin" -> "AI Instructor" -> "Warfare Simulation" -> "AR/VR Training"
- **Radar sweep** effect in background that pulses every 3 seconds
- **Counter animation** on scroll: numbers tick up from 0 to final values

### 12.2 Best Onboarding Flow
1. **Role Selection** - Visual card selection (Instructor / Trainee / Admin / Evaluator)
2. **Domain Interest** - Select primary training domains with animated ship sections
3. **Dashboard Tour** - Guided spotlight overlay with 5-step walkthrough
4. **First Action** - Contextual CTA: "Launch your first training scenario" or "Review your assigned trainees"

### 12.3 $100M+ Product Feel Checklist
- Every loading state has a branded radar-spin animation (never a generic spinner)
- All page transitions use coordinated exit/enter with blur/scale/slide
- Data visualizations use custom-branded color palette, never default chart colors
- Empty states have illustrated tactical graphics with helpful CTAs
- Error pages have cinematic "SIGNAL LOST" themed designs
- Classification banner visible at all times (RESTRICTED / CONFIDENTIAL)
- Audio-optional tactical UI sounds for critical alerts (configurable)
- Print-optimized report generation with branded PDF headers
- Keyboard shortcuts for every major action (military users prefer keyboards)
- Command palette (Ctrl+K) for instant navigation and actions
- Every metric shows trend direction with color-coded arrows
- Session replay uses timeline scrubbing with cinematic playback controls

### 12.4 Premium SaaS Inspirations
- **Palantir Foundry** - Data density, tactical map overlays, dark UI
- **Anduril Lattice** - Defense-grade UX, force tracking, command views
- **Apple Vision Pro** - Glassmorphism, spatial depth, premium feel
- **Tesla UI** - Real-time system monitoring, clean gauges, dark theme
- **Bloomberg Terminal** - Data density, keyboard-first, customizable layouts
- **Figma** - Collaborative workspace, smooth interactions, command palette

---

## 13. CLASSIFICATION BANNER SYSTEM

Every page MUST display a classification banner:

```
+------------------------------------------------------------------+
| RESTRICTED -- FOR OFFICIAL USE ONLY | GLIMMORA AEGIS NAVY | v1.0 |
+------------------------------------------------------------------+
```

- Color: `--aegis-gold` text on `--aegis-void` background
- Position: Fixed top (above topbar) or integrated into topbar
- Always visible, never hidden by scroll or overlay
- Classification level configurable per deployment

---

*End of Frontend Design System Document*
*GLIMMORA AEGIS -- NAVY | Version 1.0*
*Designed for sovereign, air-gapped deployment*
