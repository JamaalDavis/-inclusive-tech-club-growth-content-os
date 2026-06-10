import { describe, it, expect } from "vitest";
import {
  mapToValueCategories,
  generateContentMetadata,
} from "../domain/value-map/value-map-engine.js";

describe("value-map-engine", () => {
  describe("mapToValueCategories", () => {
    it("identifies revenue_protection for checkout/conversion content", () => {
      const result = mapToValueCategories(
        "Inaccessible checkout flows are causing abandoned carts and lost revenue for e-commerce teams",
        "inclusive_design_as_business_value"
      );
      expect(result.primary_categories).toContain("revenue_protection");
    });

    it("identifies risk_reduction for legal/compliance content", () => {
      const result = mapToValueCategories(
        "ADA lawsuits and WCAG compliance failures create serious legal liability and reputational risk",
        "accessibility_beyond_compliance"
      );
      expect(result.primary_categories).toContain("risk_reduction");
    });

    it("identifies cost_reduction for support ticket content", () => {
      const result = mapToValueCategories(
        "Bad design creates support tickets and expensive rework cycles that could be reduced at the start",
        "inclusive_design_as_business_value"
      );
      expect(result.primary_categories).toContain("cost_reduction");
    });

    it("identifies trust_and_brand for brand content", () => {
      const result = mapToValueCategories(
        "How your brand reputation and public trust depend on your commitment to inclusive design",
        "power_dynamics_in_product_design"
      );
      expect(result.primary_categories).toContain("trust_and_brand");
    });

    it("identifies community_power for community content", () => {
      const result = mapToValueCategories(
        "Building community advocates and practitioner networks creates word of mouth growth",
        "inclusive_tech_club_builds"
      );
      expect(result.primary_categories).toContain("community_power");
    });

    it("falls back to pillar defaults when no keywords match", () => {
      const result = mapToValueCategories(
        "completely unrelated text with no matching keywords whatsoever",
        "inclusive_design_as_business_value"
      );
      expect(result.primary_categories.length).toBeGreaterThan(0);
    });

    it("returns a business case summary string", () => {
      const result = mapToValueCategories(
        "abandoned cart revenue loss from accessibility failures",
        "inclusive_design_as_business_value"
      );
      expect(result.business_case_summary).toBeTruthy();
      expect(typeof result.business_case_summary).toBe("string");
    });

    it("returns matched keywords", () => {
      const result = mapToValueCategories(
        "The checkout process causes churn and abandoned cart revenue loss",
        "inclusive_design_as_business_value"
      );
      expect(result.keywords_matched.length).toBeGreaterThan(0);
    });
  });

  describe("generateContentMetadata", () => {
    it("generates valid metadata object", () => {
      const valueMapping = mapToValueCategories(
        "Accessibility reduces legal risk and supports trust",
        "accessibility_beyond_compliance"
      );

      const metadata = generateContentMetadata({
        content_title: "Why accessibility reduces legal risk",
        channel: "linkedin",
        funnel_stage: "awareness",
        primary_audience: "product_leaders",
        content_pillar: "accessibility_beyond_compliance",
        value_mapping: valueMapping,
        cta: "Download the checklist",
        repurpose_options: ["newsletter", "carousel"],
      });

      expect(metadata.content_title).toBe("Why accessibility reduces legal risk");
      expect(metadata.channel).toBe("linkedin");
      expect(metadata.funnel_stage).toBe("awareness");
      expect(metadata.primary_audience).toBe("product_leaders");
      expect(metadata.value_categories.length).toBeGreaterThan(0);
      expect(metadata.repurpose_options).toContain("newsletter");
      expect(metadata.approval_status).toBe("drafted");
    });

    it("always sets approval_status to drafted", () => {
      const valueMapping = mapToValueCategories("test content", "human_centered_ai");
      const metadata = generateContentMetadata({
        content_title: "test",
        channel: "newsletter",
        funnel_stage: "education",
        primary_audience: "inclusive_design_practitioners",
        content_pillar: "human_centered_ai",
        value_mapping: valueMapping,
        cta: "Subscribe",
        repurpose_options: [],
      });
      expect(metadata.approval_status).toBe("drafted");
    });
  });
});
