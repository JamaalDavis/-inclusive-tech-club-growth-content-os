import { describe, it, expect } from "vitest";
import {
  classifyFunnelStage,
  getFunnelStageById,
  getAudienceByFunnelStage,
  FUNNEL_STAGES,
} from "../domain/growth-funnel/funnel-classifier.js";

describe("funnel-classifier", () => {
  describe("classifyFunnelStage", () => {
    it("classifies awareness for hot take / problem content", () => {
      const result = classifyFunnelStage(
        "Nobody talks about the real reason accessibility fails — the wrong problem is being defined"
      );
      expect(result.primary_stage).toBe("awareness");
    });

    it("classifies education for how-to and framework content", () => {
      const result = classifyFunnelStage(
        "A guide to understanding how to apply the inclusive design framework step by step"
      );
      expect(result.primary_stage).toBe("education");
    });

    it("classifies conversion for download/resource content", () => {
      const result = classifyFunnelStage(
        "Free download: get the Inclusive Design Value Map template and checklist"
      );
      expect(result.primary_stage).toBe("conversion");
    });

    it("classifies nurture for subscriber-focused content", () => {
      const result = classifyFunnelStage(
        "This week for subscribers: a behind the scenes look at how we built the community"
      );
      expect(result.primary_stage).toBe("nurture");
    });

    it("classifies offer for workshop and consulting content", () => {
      const result = classifyFunnelStage(
        "Limited spots available for the inclusive design workshop — register now to book your place"
      );
      expect(result.primary_stage).toBe("offer");
    });

    it("classifies retention for member/exclusive content", () => {
      const result = classifyFunnelStage(
        "Community members exclusive update: renewal and growth milestone"
      );
      expect(result.primary_stage).toBe("retention");
    });

    it("defaults to awareness with low confidence when no keywords match", () => {
      const result = classifyFunnelStage("completely ambiguous text with no signals");
      expect(result.primary_stage).toBe("awareness");
      expect(result.confidence).toBe("low");
    });

    it("returns high confidence with multiple keyword matches", () => {
      const result = classifyFunnelStage(
        "free download template checklist get access sign up"
      );
      expect(result.confidence).toBe("high");
    });

    it("returns secondary stage when two stages match", () => {
      const result = classifyFunnelStage(
        "download this free guide and learn how to apply the framework step by step"
      );
      expect(result.secondary_stage).not.toBeNull();
    });

    it("includes recommended_formats in result", () => {
      const result = classifyFunnelStage("a new tutorial guide breakdown");
      expect(result.recommended_formats).toBeDefined();
      expect(result.recommended_formats.length).toBeGreaterThan(0);
    });
  });

  describe("getFunnelStageById", () => {
    it("returns all six stages correctly", () => {
      const stages: Array<keyof typeof FUNNEL_STAGES> = [
        "awareness",
        "education",
        "conversion",
        "nurture",
        "offer",
        "retention",
      ];
      for (const stage of stages) {
        const def = getFunnelStageById(stage);
        expect(def.id).toBe(stage);
        expect(def.goal).toBeTruthy();
        expect(def.content_types.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getAudienceByFunnelStage", () => {
    it("returns audiences for each stage", () => {
      const audiences = getAudienceByFunnelStage("awareness");
      expect(audiences).toContain("general_linkedin");
    });

    it("returns newsletter_subscribers for nurture stage", () => {
      const audiences = getAudienceByFunnelStage("nurture");
      expect(audiences).toContain("newsletter_subscribers");
    });
  });
});
