import { describe, it, expect } from "vitest";
import {
  recommendPillar,
  getPillarById,
  getRecommendedFormats,
  CONTENT_PILLARS,
} from "../domain/content-strategy/content-pillars.js";

describe("content-pillars", () => {
  describe("recommendPillar", () => {
    it("returns inclusive_design_as_business_value for revenue-related ideas", () => {
      const result = recommendPillar("Our abandoned cart rate is high and revenue is suffering from poor checkout accessibility");
      expect(result[0].id).toBe("inclusive_design_as_business_value");
    });

    it("returns human_centered_ai for AI-related ideas", () => {
      const result = recommendPillar("How AI bias in hiring algorithms affects underrepresented groups");
      expect(result[0].id).toBe("human_centered_ai");
    });

    it("returns power_dynamics_in_product_design for power-related ideas", () => {
      const result = recommendPillar("Who decides the default user and what does that structural exclusion cost?");
      expect(result[0].id).toBe("power_dynamics_in_product_design");
    });

    it("returns accessibility_beyond_compliance for WCAG/cognitive ideas", () => {
      const result = recommendPillar("WCAG compliance audit passed but cognitive accessibility is still broken for users with ADHD");
      expect(result[0].id).toBe("accessibility_beyond_compliance");
    });

    it("returns inclusive_tech_club_builds for tool/framework ideas", () => {
      const result = recommendPillar("Building a new framework and template for inclusive design practitioners");
      expect(result[0].id).toBe("inclusive_tech_club_builds");
    });

    it("returns a default pillar when no keywords match", () => {
      const result = recommendPillar("something completely unrelated that has no keywords");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("inclusive_design_as_business_value");
    });

    it("returns multiple pillars when multiple keywords match", () => {
      const result = recommendPillar(
        "AI bias causes revenue loss and legal risk for companies that fail to check their algorithms"
      );
      expect(result.length).toBeGreaterThan(1);
    });
  });

  describe("getPillarById", () => {
    it("returns correct pillar for each id", () => {
      const pillar = getPillarById("human_centered_ai");
      expect(pillar.id).toBe("human_centered_ai");
      expect(pillar.name).toBe("Human-Centered AI");
    });

    it("all five pillars are retrievable", () => {
      const ids = Object.keys(CONTENT_PILLARS);
      expect(ids).toHaveLength(5);
      for (const id of ids) {
        const pillar = CONTENT_PILLARS[id as keyof typeof CONTENT_PILLARS];
        expect(pillar).toBeDefined();
        expect(pillar.id).toBe(id);
        expect(pillar.name).toBeTruthy();
        expect(pillar.target_audiences.length).toBeGreaterThan(0);
        expect(pillar.keywords.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getRecommendedFormats", () => {
    it("returns formats for each pillar", () => {
      const formats = getRecommendedFormats("inclusive_design_as_business_value");
      expect(formats).toContain("linkedin_post");
      expect(formats).toContain("newsletter");
    });

    it("human_centered_ai includes video format", () => {
      const formats = getRecommendedFormats("human_centered_ai");
      expect(formats).toContain("video_script");
    });
  });
});
