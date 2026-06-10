import { describe, it, expect } from "vitest";
import {
  buildCrmRow,
  buildCrmRows,
  exportAsCsv,
  exportAsMarkdown,
  getLeadMagnetMappings,
} from "../services/crm-exporter.js";
import type { ContentMetadata } from "../types.js";

const sampleMetadata: ContentMetadata = {
  content_title: "Why accessibility is revenue protection",
  channel: "linkedin",
  funnel_stage: "awareness",
  primary_audience: "product_leaders",
  content_pillar: "inclusive_design_as_business_value",
  value_categories: ["revenue_protection", "risk_reduction"],
  cta: "Download the Inclusive Design Value Map",
  repurpose_options: ["newsletter", "carousel"],
  approval_status: "approved",
};

describe("crm-exporter", () => {
  describe("buildCrmRow", () => {
    it("maps metadata to a CRM row", () => {
      const row = buildCrmRow(sampleMetadata);

      expect(row.content_title).toBe("Why accessibility is revenue protection");
      expect(row.audience_segment).toBe("product_leaders");
      expect(row.funnel_stage).toBe("awareness");
      expect(row.cta).toBe("Download the Inclusive Design Value Map");
      expect(row.lead_magnet).toBeTruthy();
      expect(row.email_sequence).toBeTruthy();
      expect(row.value_category).toBeTruthy();
    });

    it("maps product_leaders + awareness to the correct lead magnet", () => {
      const row = buildCrmRow(sampleMetadata);
      expect(row.lead_magnet).toBe("Inclusive Design Value Map");
    });

    it("maps product_leaders + conversion to workshop interest sequence", () => {
      const conversionMetadata: ContentMetadata = {
        ...sampleMetadata,
        funnel_stage: "conversion",
      };
      const row = buildCrmRow(conversionMetadata);
      expect(row.email_sequence).toContain("workshop-interest");
    });

    it("maps founders to starter kit", () => {
      const founderMetadata: ContentMetadata = {
        ...sampleMetadata,
        primary_audience: "founders_and_operators",
        funnel_stage: "awareness",
      };
      const row = buildCrmRow(founderMetadata);
      expect(row.lead_magnet).toContain("Starter Kit");
    });

    it("falls back to general nurture sequence for unknown combination", () => {
      const unknownMetadata: ContentMetadata = {
        ...sampleMetadata,
        primary_audience: "general_linkedin",
        funnel_stage: "retention",
      };
      const row = buildCrmRow(unknownMetadata);
      expect(row.email_sequence).toBeTruthy();
    });

    it("uses primary value category as value_category field", () => {
      const row = buildCrmRow(sampleMetadata);
      expect(row.value_category).toBe("revenue_protection");
    });
  });

  describe("buildCrmRows", () => {
    it("builds multiple rows from multiple metadata objects", () => {
      const metadata2: ContentMetadata = {
        ...sampleMetadata,
        content_title: "AI bias in hiring",
        primary_audience: "inclusive_design_practitioners",
        content_pillar: "human_centered_ai",
      };

      const rows = buildCrmRows([sampleMetadata, metadata2]);
      expect(rows).toHaveLength(2);
      expect(rows[0].content_title).toBe("Why accessibility is revenue protection");
      expect(rows[1].content_title).toBe("AI bias in hiring");
    });

    it("returns empty array for empty input", () => {
      const rows = buildCrmRows([]);
      expect(rows).toHaveLength(0);
    });
  });

  describe("exportAsCsv", () => {
    it("exports valid CSV with header row", () => {
      const rows = buildCrmRows([sampleMetadata]);
      const csv = exportAsCsv(rows);

      const lines = csv.split("\n");
      expect(lines[0]).toContain("content_title");
      expect(lines[0]).toContain("audience_segment");
      expect(lines[0]).toContain("funnel_stage");
      expect(lines[0]).toContain("email_sequence");
      expect(lines[0]).toContain("value_category");
    });

    it("includes data rows", () => {
      const rows = buildCrmRows([sampleMetadata]);
      const csv = exportAsCsv(rows);
      const lines = csv.split("\n");
      expect(lines).toHaveLength(2);
      expect(lines[1]).toContain("product_leaders");
    });

    it("escapes commas in field values", () => {
      const metaWithComma: ContentMetadata = {
        ...sampleMetadata,
        content_title: "Accessibility, revenue, and risk",
      };
      const rows = buildCrmRows([metaWithComma]);
      const csv = exportAsCsv(rows);
      expect(csv).toContain('"Accessibility, revenue, and risk"');
    });

    it("returns valid CSV for empty rows", () => {
      const csv = exportAsCsv([]);
      expect(csv).toContain("content_title");
      const lines = csv.split("\n").filter(Boolean);
      expect(lines).toHaveLength(1);
    });
  });

  describe("exportAsMarkdown", () => {
    it("returns empty message for no rows", () => {
      const md = exportAsMarkdown([]);
      expect(md).toContain("No rows to export");
    });

    it("exports rows as markdown table", () => {
      const rows = buildCrmRows([sampleMetadata]);
      const md = exportAsMarkdown(rows);

      expect(md).toContain("# CRM Export");
      expect(md).toContain("product_leaders");
      expect(md).toContain("awareness");
      expect(md).toContain("1 row(s) exported");
    });

    it("includes table header row", () => {
      const rows = buildCrmRows([sampleMetadata]);
      const md = exportAsMarkdown(rows);
      expect(md).toContain("| Content Title |");
      expect(md).toContain("| Audience |");
    });
  });

  describe("getLeadMagnetMappings", () => {
    it("returns all mappings as a copy", () => {
      const mappings = getLeadMagnetMappings();
      expect(mappings.length).toBeGreaterThan(0);
      expect(mappings[0].lead_magnet).toBeTruthy();
    });
  });
});
