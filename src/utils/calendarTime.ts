/**
 * Time helpers for the calendar.
 * Internally uses absolute UTC instants and formats them in a target IANA time zone.
 *
 * Uses only Intl.DateTimeFormat.
 */

export interface ZonedParts {
    year: number
    month: number // 1-12
    day: number // 1-31
    hour: number // 0-23
    minute: number
    ymd: string // 'YYYY-MM-DD' in the target zone
    minutesOfDay: number // 0-1439
}

/**
 * Splits a Date into local parts for the target time zone.
 */
export function zonedParts(instant: Date, timeZone: string): ZonedParts {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })

    const lookup: Record<string, string> = {}

    for (const part of formatter.formatToParts(instant)) {
        if (part.type !== 'literal') {
            lookup[part.type] = part.value
        }
    }

    const year = Number(lookup.year)
    const month = Number(lookup.month)
    const day = Number(lookup.day)

    // Some locales may return midnight as 24.
    const hour = Number(lookup.hour) % 24
    const minute = Number(lookup.minute)

    return {
        year,
        month,
        day,
        hour,
        minute,
        ymd: `${lookup.year}-${lookup.month}-${lookup.day}`,
        minutesOfDay: hour * 60 + minute,
    }
}

/**
 * Returns 'YYYY-MM-DD' in the target time zone.
 */
export function zonedYmd(instant: Date, timeZone: string): string {
    return zonedParts(instant, timeZone).ymd
}

/**
 * Returns minutes since midnight in the target time zone.
 */
export function minutesOfDayInZone(instant: Date, timeZone: string): number {
    return zonedParts(instant, timeZone).minutesOfDay
}

/**
 * Returns 'HH:MM' in the target time zone.
 */
export function formatHm(instant: Date, timeZone: string): string {
    const parts = zonedParts(instant, timeZone)

    return `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`
}

/**
 * Returns the time zone offset in minutes.
 * Positive values are east of UTC.
 */
export function zoneOffsetMinutes(instant: Date, timeZone: string): number {
    const utc = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })

    const zoned = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })

    const asMs = (formatter: Intl.DateTimeFormat): number => {
        const map: Record<string, number> = {}

        for (const part of formatter.formatToParts(instant)) {
            if (part.type !== 'literal') {
                map[part.type] = Number(part.value)
            }
        }

        return Date.UTC(
            map.year,
            map.month - 1,
            map.day,
            map.hour % 24,
            map.minute,
            map.second,
        )
    }

    return Math.round((asMs(zoned) - asMs(utc)) / 60000)
}

/**
 * Converts local wall time in a target zone to a UTC Date.
 * Uses a second pass for DST changes.
 */
export function zonedWallTimeToUtc(
    year: number,
    month: number, // 1-12
    day: number,
    hour: number,
    minute: number,
    timeZone: string,
): Date {
    // First guess: treat local time as UTC.
    const naiveUtcMs = Date.UTC(
        year,
        month - 1,
        day,
        hour,
        minute,
        0,
    )

    const guess = new Date(naiveUtcMs)

    // Offset at the guessed instant.
    const offset = zoneOffsetMinutes(guess, timeZone)

    // Convert local time to the real UTC instant.
    const correctedMs = naiveUtcMs - offset * 60000
    const corrected = new Date(correctedMs)

    // Check again in case the offset changed across a DST boundary.
    const offsetAfter = zoneOffsetMinutes(corrected, timeZone)

    if (offsetAfter !== offset) {
        return new Date(
            naiveUtcMs - offsetAfter * 60000,
        )
    }

    return corrected
}

/**
 * Returns the start of the week as 'YYYY-MM-DD'.
 * 1 = Monday, 0 = Sunday.
 */
export function startOfWeekYmd(
    instant: Date,
    timeZone: string,
    weekStartsOn: 0 | 1 = 1,
): string {
    const parts = zonedParts(
        instant,
        timeZone,
    )

    // Get weekday in the target time zone.
    const weekdayName = new Intl.DateTimeFormat('en-US', {
        timeZone,
        weekday: 'short',
    }).format(instant)

    const weekdayIndex = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
    ].indexOf(weekdayName)

    const diff = (
        weekdayIndex
        - weekStartsOn
        + 7
    ) % 7

    // Use UTC noon to avoid DST changes around midnight.
    const anchor = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        12,
        0,
        0,
    )

    const start = new Date(
        anchor - diff * 86400000,
    )

    const y = start.getUTCFullYear()
    const m = String(
        start.getUTCMonth() + 1,
    ).padStart(2, '0')

    const d = String(
        start.getUTCDate(),
    ).padStart(2, '0')

    return `${y}-${m}-${d}`
}

/**
 * Adds days to a 'YYYY-MM-DD' value.
 */
export function addDaysYmd(
    ymd: string,
    days: number,
): string {
    const [y, m, d] = ymd
        .split('-')
        .map(Number)

    // Use UTC noon as a safe date-only anchor.
    const base = Date.UTC(
        y,
        m - 1,
        d,
        12,
        0,
        0,
    )

    const shifted = new Date(
        base + days * 86400000,
    )

    const yy = shifted.getUTCFullYear()

    const mm = String(
        shifted.getUTCMonth() + 1,
    ).padStart(2, '0')

    const dd = String(
        shifted.getUTCDate(),
    ).padStart(2, '0')

    return `${yy}-${mm}-${dd}`
}

/**
 * Returns the weekday index.
 * 0 = Sunday, 6 = Saturday.
 */
export function weekdayIndexOfYmd(
    ymd: string,
): number {
    const [y, m, d] = ymd
        .split('-')
        .map(Number)

    return new Date(
        Date.UTC(
            y,
            m - 1,
            d,
            12,
        ),
    ).getUTCDay()
}

/**
 * Returns the number of days in a month.
 */
export function daysInMonth(
    year: number,
    month: number,
): number {
    return new Date(
        Date.UTC(
            year,
            month,
            0,
        ),
    ).getUTCDate()
}

/**
 * Returns 42 dates for a six-week month grid.
 */
export function monthGridYmds(
    year: number,
    month: number,
    weekStartsOn: 0 | 1,
): string[] {
    const firstYmd =
        `${year}-${String(month).padStart(2, '0')}-01`

    const lead = (
        weekdayIndexOfYmd(firstYmd)
        - weekStartsOn
        + 7
    ) % 7

    const gridStart = addDaysYmd(
        firstYmd,
        -lead,
    )

    return Array.from(
        { length: 42 },
        (_, i) => addDaysYmd(
            gridStart,
            i,
        ),
    )
}