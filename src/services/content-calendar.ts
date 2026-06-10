import type { CalendarEntry, Channel, ContentPillar, FunnelStage, ApprovalStatus } from "../types.js";
import { randomUUID } from "crypto";

export interface CreateCalendarEntryInput {
  date: string;
  title: string;
  channel: Channel;
  content_pillar: ContentPillar;
  funnel_stage: FunnelStage;
  cta: string;
  notes?: string;
  repurpose_links?: string[];
}

export interface ContentCalendar {
  entries: CalendarEntry[];
  last_updated: string;
}

let calendarState: ContentCalendar = {
  entries: [],
  last_updated: new Date().toISOString(),
};

export function createCalendarEntry(input: CreateCalendarEntryInput): CalendarEntry {
  const entry: CalendarEntry = {
    id: randomUUID(),
    date: input.date,
    title: input.title,
    channel: input.channel,
    content_pillar: input.content_pillar,
    funnel_stage: input.funnel_stage,
    cta: input.cta,
    status: "idea",
    repurpose_links: input.repurpose_links ?? [],
    notes: input.notes ?? "",
  };

  calendarState.entries.push(entry);
  calendarState.last_updated = new Date().toISOString();

  return entry;
}

export function updateEntryStatus(id: string, status: ApprovalStatus): CalendarEntry | null {
  const entry = calendarState.entries.find((e) => e.id === id);
  if (!entry) return null;

  entry.status = status;
  calendarState.last_updated = new Date().toISOString();

  return entry;
}

export function getEntriesByStatus(status: ApprovalStatus): CalendarEntry[] {
  return calendarState.entries.filter((e) => e.status === status);
}

export function getEntriesByChannel(channel: Channel): CalendarEntry[] {
  return calendarState.entries.filter((e) => e.channel === channel);
}

export function getEntriesByPillar(pillar: ContentPillar): CalendarEntry[] {
  return calendarState.entries.filter((e) => e.content_pillar === pillar);
}

export function getEntriesByDateRange(startDate: string, endDate: string): CalendarEntry[] {
  return calendarState.entries.filter(
    (e) => e.date >= startDate && e.date <= endDate
  );
}

export function loadCalendar(data: ContentCalendar): void {
  calendarState = data;
}

export function exportCalendarAsJSON(): string {
  return JSON.stringify(calendarState, null, 2);
}

export function exportCalendarAsMarkdown(): string {
  if (calendarState.entries.length === 0) {
    return `# Content Calendar\n\nNo entries scheduled.\n\n*Last updated: ${calendarState.last_updated}*`;
  }

  const sorted = [...calendarState.entries].sort((a, b) => a.date.localeCompare(b.date));

  const STATUS_SYMBOLS: Record<ApprovalStatus, string> = {
    idea: "[ ]",
    briefed: "[B]",
    drafted: "[D]",
    reviewed: "[R]",
    approved: "[A]",
    published: "[P]",
    repurposed: "[RP]",
  };

  const rows = sorted.map((entry) => {
    const status = STATUS_SYMBOLS[entry.status];
    const repurposeNote =
      entry.repurpose_links.length > 0
        ? `\n  - Repurpose: ${entry.repurpose_links.join(", ")}`
        : "";
    const notesNote = entry.notes ? `\n  - Notes: ${entry.notes}` : "";

    return `### ${entry.date} — ${entry.title}
- **Status:** ${status} ${entry.status}
- **Channel:** ${entry.channel}
- **Pillar:** ${entry.content_pillar}
- **Funnel Stage:** ${entry.funnel_stage}
- **CTA:** ${entry.cta}${repurposeNote}${notesNote}
`;
  });

  const statusCounts = sorted.reduce(
    (acc, e) => {
      acc[e.status] = (acc[e.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<ApprovalStatus, number>
  );

  const summaryLines = (Object.entries(statusCounts) as [ApprovalStatus, number][])
    .map(([status, count]) => `- ${STATUS_SYMBOLS[status]} ${status}: ${count}`)
    .join("\n");

  return `# Content Calendar

## Summary
${summaryLines}

*Last updated: ${calendarState.last_updated}*

---

${rows.join("\n")}

---

## Status Key
- [ ] idea
- [B] briefed
- [D] drafted
- [R] reviewed
- [A] approved — Jamaal has signed off
- [P] published
- [RP] repurposed
`;
}

export function getCalendar(): ContentCalendar {
  return calendarState;
}
