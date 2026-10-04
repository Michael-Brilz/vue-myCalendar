# Changelog

## [1.0.0] - 2026-10-04

This release closes all MVP gaps and marks the first stable public API.

### Added

#### Title field in default form
- The built-in event form now includes a **title input** as the first field. Previously the title had to be wired in via `additionalFields`.

#### "Today" button
- A **Today** button appears in the navigation bar (left of the arrows). Clicking it resets the calendar to the current week or month. Label is customizable via `labelsAndSettings.todayButtonLabel`.

#### Current time indicator
- A **red horizontal line** (with a dot on the left) marks the current time in the week view. It updates every minute via `setInterval` and only appears in today's column.
- Themeable via `--current-time-color`.

#### Click-to-create
- Clicking an **empty time slot** in the week view pre-fills `date`, `start`, and `end` in the form (snapped to 15-minute grid) and emits **`@slot-click`** `{ date, start, end }`.
- Clicking an **empty month cell** pre-fills `date` and emits `@slot-click` `{ date }`.
- Does nothing when `:readonly="true"`.

#### All-day events
- Events with `allDay: true` are shown in a compact **banner row** above the hour grid in the week view, not inside the time grid.
- Month view was already correct (chips).
- Demo includes a sample all-day event.

#### `readonly` prop
- New `readonly` prop (default `false`). When `true`: the form is hidden, drag & drop is disabled, and the popup hides the delete button, save button, and add-input rows for todos/participants.

#### `event` scoped slot
- The inner content of each week-view event block is now exposed via **`<slot name="event" :event :time-range>`**. Consumers can render fully custom markup while the component keeps positioning and drag logic.

#### `@range-change` event
- Emitted on mount and on every navigation. Payload: `{ start: string, end: string, view: 'week' | 'month' }` where `start`/`end` are `YYYY-MM-DD` strings of the first and last visible day. Use this for lazy-loading events from a server.

#### Mobile horizontal scroll
- The week view is now wrapped in a scroll container (`overflow-x: auto`). The grid has a `min-width: 560px` so it remains usable on narrow screens without collapsing.

#### SSR compatibility
- `window.matchMedia` and `setInterval` calls are now guarded with `typeof window !== 'undefined'`, making the component compatible with Nuxt and other SSR environments.

### Changed
- `theme.css` reduced to only body background overrides for light/dark; all duplicated/outdated legacy variables (e.g. `--info-button-color`, `--weekday-bg-color`, `--hour-cell-bg-color`) have been removed. All theming goes through `.calendar-theme` CSS variables in `ScheduleForm.vue`.
- `overlapLayout` computed now operates only on timed (non-allDay) events, preventing allDay events from being included in the column-packing algorithm.
- Month cell day-number and chip buttons now use `@click.stop` to prevent the new cell click-to-create handler from triggering simultaneously.

### Fixed
- `todayYmd` is now a reactive computed based on `timeZone`, so "today" highlighting is always correct in non-local zones.

---

## [0.9.0] - 2026-10-04

### Added

#### Rich event cards (week view)
- Events in the week view now show a **time range** (`09:00 – 10:00`) below the title.
- Compact **badges** appear for `room`, `link` (🔗 indicator), and participant count (👥 N) — all hidden via `overflow: hidden` in short slots.
- A **left color stripe** (darker border) gives each event a cleaner visual structure.
- Clicking anywhere on an event opens the popup (the separate info-button icon is removed).

#### Modern event detail popup
- **Colored header strip** matching `event.color` with the event title and time range at a glance.
- **Meta section** with dedicated rows for:
  - 📅 Date and time (resolved from `date`/`start`/`end` or UTC `startsAt`/`endsAt`)
  - 📍 Room/location (inline-editable)
  - 🔗 Online link — rendered as a **clickable anchor** that opens in a new tab
  - 👤 Teacher/presenter (inline-editable)
- **Description** / `info` displayed as a readable text block.
- **Participants** redesigned as removable **pill chips**; add with Enter or the + button.
- **Todos** redesigned as a bullet list with per-item hover-reveal delete and keyboard-friendly add input.
- Delete button with a red hover state; close button moved to the header action group.
- Clicking the overlay backdrop closes the popup.

#### EventInfo fields documented
- `room`, `link`, `teacher`, `description` are now officially documented fields with dedicated popup rendering (they were already part of the interface but had no special treatment).

### Changed
- `popupFields` defaults to `[]` (show all fields). Previously the demo defaulted to `['title', 'date', 'start', 'end']`, which hid room, link, and other fields. An empty array now means "show everything" as intended.
- The `--popup-border-radius` default raised to `12px` for a more modern card look.

### Removed
- The floating SVG info-button inside week-view events is removed. The entire event area is now the click target for opening the popup.

---

## [0.8.0] - 2026-08-16

This release makes the calendar time-zone correct, adds a month view with proper
overlap handling, replaces the drag-and-drop engine with a smoother pointer-based
one (live preview + time tooltip), and exposes every visual part of the component
through CSS variables.

### Added

#### Time zones
- **`timeZone` prop** (IANA name, e.g. `'Europe/Berlin'`). Controls the zone in
  which events are rendered and in which drops are interpreted. Defaults to the
  browser's zone, so omitting it keeps the previous behaviour.
- **`EventInfo.startsAt` / `EventInfo.endsAt`** — preferred absolute time fields
  as UTC ISO-8601 with `Z` (e.g. `'2026-06-28T07:00:00Z'`). Recommended for all
  new integrations. The legacy `date` / `start` / `end` fields remain supported.
- **`weekStartsOn` prop** (`0` = Sunday, `1` = Monday). Defaults to `1` (Monday),
  matching the previous fixed layout. Applies to both week and month views.

#### Month view
- **Month view** in addition to the week view. Switch with the built-in toggle
  buttons or control it externally via **`v-model:view`** (`'week' | 'month'`).
- **`update:view` event** emitted when the active view changes (enables
  `v-model:view`).
- **`weekViewLabel` / `monthViewLabel`** in `LabelsAndSettings` for the toggle
  button captions (default `'Week'` / `'Month'`).
- Clicking a day number or the "+N more" indicator in the month view jumps into
  the week view of that day.

#### Overlap handling (week view)
- Overlapping events now render **side by side in columns** instead of stacking
  on top of each other. Non-overlapping events keep full width.

#### Drag & drop
- The drag engine was rewritten on top of **pointer events** (replacing the
  native HTML5 drag). This brings:
    - A **live preview ghost** of the event at the snapped drop position.
    - A **floating time tooltip** that follows the cursor, showing the target start
      time (`HH:MM – HH:MM` in the week view) or the target date (in the month view).
    - Correct **grab-offset** handling: the event stays under the cursor where it
      was grabbed, instead of snapping its start to the cursor.
    - Touch support (`touch-action: none` on draggable items).
- A short-move threshold distinguishes a click from a drag, so clicking the info
  button or a month chip still opens the popup.

#### Theming
- **Full CSS-variable coverage** for every visual part of the calendar: grid
  lines, event blocks, buttons, navigation, view toggle, month view (cells, day
  numbers, chips, today highlight, drop target), drag preview, drag tooltip, and
  the popup (title, labels, inputs, icons, save button).
- **`--font-family`** variable on the calendar root.

### Fixed
- **Weekday/date calculation no longer shifts by one day in the evening.** The
  previous version converted local dates to UTC (`toISOString().substring(...)`)
  before extracting the day, which caused the visible week to jump depending on
  the time of day and the user's zone. Dates are now resolved correctly in the
  target zone.
- **Daylight-saving edge cases** are handled when converting a wall-clock time
  back to UTC (drag/drop, form submit). On the two DST-transition nights the
  result is deterministic instead of silently shifting by an hour.

### Changed (backwards compatible)
- The legacy `date` / `start` / `end` fields are still fully supported. They are
  interpreted as **wall-clock time in `timeZone`** and normalized to UTC
  internally.
- Events emitted by drag & drop now include **both** the new UTC fields
  (`startsAt` / `endsAt`) **and** the derived legacy fields (`date` / `start` /
  `end`), so existing handlers that read `.date` / `.start` / `.end` keep working
  unchanged.
- Previously hardcoded colors in the month view and popup are now driven by CSS
  variables, each keeping its old value as a fallback. There is no visual change
  unless the new variables are set.

### Migration
No changes are required for existing usage — the calendar keeps working as before.

To adopt the new capabilities:

1. **Multi-time-zone correctness:** pass `timeZone` explicitly and switch your
   event data to `startsAt` / `endsAt` (UTC). The backend should store and send
   UTC; the calendar renders it in `timeZone`.
2. **Popup theming:** the popup renders outside the calendar root (fixed
   position), so its `--popup-*` variables must be set on a **shared ancestor**
   (e.g. `:root` or `body`), not on the `custom-class` element. Kalender-Variablen
   (grid, events, buttons, month) work on `custom-class` as before.
3. **`update-event` persistence:** the host must write the updated event back
   into `schedules` (replace by `id`, do not append). The calendar no longer
   keeps a divergent internal copy after a drag.

### Notes / known limitations
- The event **inner markup** (title, time, info button) is not yet slot-based.
  Colors, borders, radii and fonts are fully themeable via variables, but
  changing the *structure* of an event block (e.g. avatars, participant counts,
  a colored side stripe) would require an `event` scoped slot, which is not part
  of this release.
- Reactions to other users / realtime updates of events are the host's
  responsibility: pass fresh `schedules` in (prop-driven). The component has no
  internal event cache that would diverge from the prop.

## [0.7.1] - 2025-02-07
### Fixed
- Default form now correctly hidden when using custom `#form` slot
- `resetForm()` now properly resets all fields including `title` and `description`

## [0.7.0] - 2026-02-07
### Added
- **Custom Form Slot** – Replace the default form with your own design using scoped slots
- Scoped slot props: `newEvent`, `addEvent`, `additionalFields`, `labels`, `resetForm`
- `resetForm()` method to clear form fields programmatically


## [0.6.0] - 2025-08-18
### Added
- You can now move and drag entries with the mouse

### Changed
- Improved calendar styling
- Redesigned the default popup to make it cleareressert