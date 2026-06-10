import { describe, it, expect } from "vitest";
import { checkVoice } from "../services/voice-checker.js";

describe("voice-checker", () => {
  describe("banned phrase detection", () => {
    it("detects 'game-changing' as banned", () => {
      const result = checkVoice(
        "This game-changing approach to inclusive design will transform your team."
      );
      expect(result.banned_phrases_found).toContain("game-changing");
    });

    it("detects 'delve' as banned", () => {
      const result = checkVoice(
        "Let's delve into the accessibility implications of this design decision."
      );
      expect(result.banned_phrases_found).toContain("delve");
    });

    it("detects 'seamless user experience' as banned", () => {
      const result = checkVoice(
        "We're building a seamless user experience that serves all customers."
      );
      expect(result.banned_phrases_found).toContain("seamless user experience");
    });

    it("detects 'revolutionize' as banned", () => {
      const result = checkVoice(
        "Inclusive design will revolutionize the way teams think about accessibility."
      );
      expect(result.banned_phrases_found).toContain("revolutionize");
    });

    it("detects 'in today's fast-paced digital landscape' as banned", () => {
      const result = checkVoice(
        "In today's fast-paced digital landscape, inclusion matters more than ever."
      );
      expect(result.banned_phrases_found.some((p) =>
        p.includes("fast-paced digital landscape")
      )).toBe(true);
    });

    it("returns empty banned array for clean content", () => {
      const result = checkVoice(
        "Inaccessible checkout flows cost e-commerce teams revenue. Here is what breaks and why it matters."
      );
      expect(result.banned_phrases_found).toHaveLength(0);
    });

    it("is case-insensitive", () => {
      const result = checkVoice("This is GAME-CHANGING for your team.");
      expect(result.banned_phrases_found).toContain("game-changing");
    });
  });

  describe("weak hook detection", () => {
    it("flags 'I want to talk about' as a weak hook", () => {
      const result = checkVoice(
        "I want to talk about accessibility and why it matters for your business. Here is the thing."
      );
      expect(result.weak_hooks.length).toBeGreaterThan(0);
    });

    it("flags 'Today I want to' as a weak hook", () => {
      const result = checkVoice(
        "Today I want to share something important about inclusive design."
      );
      expect(result.weak_hooks.length).toBeGreaterThan(0);
    });

    it("does not flag a strong opening", () => {
      const result = checkVoice(
        "Accessibility failures cost US e-commerce teams $6.9 billion in lost revenue annually. Here is how to stop the leak."
      );
      expect(result.weak_hooks).toHaveLength(0);
    });
  });

  describe("vague claim detection", () => {
    it("flags unsourced 'studies show' claims", () => {
      const result = checkVoice(
        "Studies show that most companies fail to meet accessibility standards."
      );
      expect(result.vague_claims.length).toBeGreaterThan(0);
    });

    it("does not flag properly cited claims with bracket notation", () => {
      const result = checkVoice(
        "Studies show that [CITATION NEEDED] accessible products outperform their counterparts on retention."
      );
      expect(result.vague_claims).toHaveLength(0);
    });
  });

  describe("systems thinking detection", () => {
    it("recognizes systems-level language", () => {
      const result = checkVoice(
        "The structural incentives of product development prioritize speed over access. The default user is not neutral — it is a policy decision."
      );
      expect(result.missing_systems_thinking).toBe(false);
    });

    it("flags missing systems thinking in shallow content", () => {
      const result = checkVoice(
        "Accessibility is very important and teams should try to do better."
      );
      expect(result.missing_systems_thinking).toBe(true);
    });
  });

  describe("scoring", () => {
    it("returns score between 0 and 100", () => {
      const result = checkVoice("Some content about inclusive design.");
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it("returns pass verdict for clean, systems-aware content", () => {
      const result = checkVoice(
        "Inaccessible checkout flows are not an edge case problem. They are a structural failure with a measurable cost. The default user in most product organizations is implicitly able-bodied, neurotypical, and English-speaking. That default excludes by design — and the business pays for it in abandoned carts, support tickets, and churn."
      );
      expect(result.verdict).toBe("pass");
      expect(result.score).toBeGreaterThanOrEqual(65);
    });

    it("returns revise verdict for content with multiple banned phrases", () => {
      const result = checkVoice(
        "In today's fast-paced digital landscape, we need to leverage synergies and revolutionize the way we approach seamless user experiences to unlock the power of inclusion."
      );
      expect(result.verdict).toBe("revise");
      expect(result.score).toBeLessThan(65);
    });

    it("includes rewrite suggestions when issues found", () => {
      const result = checkVoice(
        "This game-changing approach will revolutionize accessibility."
      );
      expect(result.rewrite_suggestions.length).toBeGreaterThan(0);
    });
  });
});
