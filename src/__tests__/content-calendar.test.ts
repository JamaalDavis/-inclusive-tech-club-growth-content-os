import { describe, it, expect, beforeEach } from "vitest";
import {
  createCalendarEntry,
  updateEntryStatus,
  getEntriesByStatus,
  getEntriesByChannel,
  getEntriesByPillar,
  getEntriesByDateRange,
  exportCalendarAsJSON,
  exportCalendarAsMarkdown,
  loadCalendar,
  getCalendar,
} from "../services/content-calendar.js";
import type { CalendarEntry } from "../types.js";

beforeEach(() => {
  loadCalendar({ entries: [], last_updated: new Date().toISOString() });
});

describe("content-calendar", () => {
  describe("createCalendarEntry", () => {
    it("creates an entry with required fields", () => {
      const entry = createCalendarEntry({
        date: "2026-06-15",
        title: "Accessibility is revenue protection",
        channel: "linkedin",
        content_pillar: "inclusive_design_as_business_value",
        funnel_stage: "awareness",
        cta: "Download the Value Map",
      });

      expect(entry.id).toBeTruthy();
      expect(entry.title).toBe("Accessibility is revenue protection");
      expect(entry.channel).toBe("linkedin");
      expect(entry.status).toBe("idea");
    });

    it("sets default status to idea", () => {
      const entry = createCalendarEntry({
        date: "2026-06-15",
        title: "Test entry",
        channel: "newsletter",
        content_pillar: "human_centered_ai",
        funnel_stage: "education",
        cta: "Subscribe",
      });
      expect(entry.status).toBe("idea");
    });

    it("accepts optional notes and repurpose links", () => {
      const entry = createCalendarEntry({
        date: "2026-06-20",
        title: "AI bias explainer",
        channel: "linkedin",
        content_pillar: "human_centered_ai",
        funnel_stage: "awareness",
        cta: "Subscribe",
        notes: "Tie to upcoming AI governance news",
        repurpose_links: ["newsletter-2026-06-22", "carousel-ai-bias"],
      });
      expect(entry.notes).toBe("Tie to upcoming AI governance news");
      expect(entry.repurpose_links).toHaveLength(2);
    });

    it("adds entry to calendar state", () => {
      createCalendarEntry({
        date: "2026-06-15",
        title: "Test",
        channel: "linkedin",
        content_pillar: "inclusive_design_as_business_value",
        funnel_stage: "awareness",
        cta: "Subscribe",
      });
      expect(getCalendar().entries).toHaveLength(1);
    });
  });

  describe("updateEntryStatus", () => {
    it("updates entry status", () => {
      const entry = createCalendarEntry({
        date: "2026-06-15",
        title: "Test",
        channel: "linkedin",
        content_pillar: "inclusive_design_as_business_value",
        funnel_stage: "awareness",
        cta: "Subscribe",
      });

      const updated = updateEntryStatus(entry.id, "drafted");
      expect(updated?.status).toBe("drafted");
    });

    it("returns null for non-existent id", () => {
      const result = updateEntryStatus("nonexistent-id", "approved");
      expect(result).toBeNull();
    });

    it("progresses through approval states correctly", () => {
      const entry = createCalendarEntry({
        date: "2026-06-15",
        title: "Test",
        channel: "linkedin",
        content_pillar: "inclusive_design_as_business_value",
        funnel_stage: "awareness",
        cta: "Subscribe",
      });

      updateEntryStatus(entry.id, "briefed");
      updateEntryStatus(entry.id, "drafted");
      updateEntryStatus(entry.id, "reviewed");
      const approved = updateEntryStatus(entry.id, "approved");
      expect(approved?.status).toBe("approved");
    });
  });

  describe("filtering", () => {
    beforeEach(() => {
      createCalendarEntry({
        date: "2026-06-10",
        title: "LinkedIn post 1",
        channel: "linkedin",
        content_pillar: "inclusive_design_as_business_value",
        funnel_stage: "awareness",
        cta: "Subscribe",
      });
      createCalendarEntry({
        date: "2026-06-12",
        title: "Newsletter 1",
        channel: "newsletter",
        content_pillar: "human_centered_ai",
        funnel_stage: "education",
        cta: "Subscribe",
      });
      createCalendarEntry({
        date: "2026-06-15",
        title: "LinkedIn post 2",
        channel: "linkedin",
        content_pillar: "human_centered_ai",
        funnel_stage: "awareness",
        cta: "Download",
      });
    });

    it("filters by channel", () => {
      const linkedin = getEntriesByChannel("linkedin");
      expect(linkedin).toHaveLength(2);
      expect(linkedin.every((e) => e.channel === "linkedin")).toBe(true);
    });

    it("filters by pillar", () => {
      const ai = getEntriesByPillar("human_centered_ai");
      expect(ai).toHaveLength(2);
    });

    it("filters by status", () => {
      const allEntries = getCalendar().entries;
      updateEntryStatus(allEntries[0].id, "approved");
      const approved = getEntriesByStatus("approved");
      expect(approved).toHaveLength(1);
    });

    it("filters by date range", () => {
      const range = getEntriesByDateRange("2026-06-11", "2026-06-14");
      expect(range).toHaveLength(1);
      expect(range[0].title).toBe("Newsletter 1");
    });
  });

  describe("exportCalendarAsJSON", () => {
    it("exports valid JSON", () => {
      createCalendarEntry({
        date: "2026-06-15",
        title: "Test",
        channel: "linkedin",
        content_pillar: "inclusive_design_as_business_value",
        funnel_stage: "awareness",
        cta: "Subscribe",
      });

      const json = exportCalendarAsJSON();
      expect(() => JSON.parse(json)).not.toThrow();

      const parsed = JSON.parse(json) as { entries: CalendarEntry[] };
      expect(parsed.entries).toHaveLength(1);
      expect(parsed.entries[0].title).toBe("Test");
    });
  });

  describe("exportCalendarAsMarkdown", () => {
    it("returns empty message for empty calendar", () => {
      const md = exportCalendarAsMarkdown();
      expect(md).toContain("No entries scheduled");
    });

    it("exports entries as markdown with status symbols", () => {
      createCalendarEntry({
        date: "2026-06-15",
        title: "Accessibility post",
        channel: "linkedin",
        content_pillar: "accessibility_beyond_compliance",
        funnel_stage: "awareness",
        cta: "Subscribe",
      });

      const md = exportCalendarAsMarkdown();
      expect(md).toContain("Accessibility post");
      expect(md).toContain("linkedin");
      expect(md).toContain("idea");
      expect(md).toContain("Status Key");
    });

    it("sorts entries by date", () => {
      createCalendarEntry({
        date: "2026-06-20",
        title: "Later post",
        channel: "linkedin",
        content_pillar: "human_centered_ai",
        funnel_stage: "awareness",
        cta: "Subscribe",
      });
      createCalendarEntry({
        date: "2026-06-10",
        title: "Earlier post",
        channel: "linkedin",
        content_pillar: "human_centered_ai",
        funnel_stage: "awareness",
        cta: "Subscribe",
      });

      const md = exportCalendarAsMarkdown();
      const earlierIndex = md.indexOf("Earlier post");
      const laterIndex = md.indexOf("Later post");
      expect(earlierIndex).toBeLessThan(laterIndex);
    });
  });
});
