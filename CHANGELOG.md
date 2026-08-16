# Changelog

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