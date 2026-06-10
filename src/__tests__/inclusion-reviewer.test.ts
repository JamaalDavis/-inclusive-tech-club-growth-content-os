import { describe, it, expect } from "vitest";
import { reviewForInclusion } from "../services/inclusion-reviewer.js";

describe("inclusion-reviewer", () => {
  describe("shallow inclusion detection", () => {
    it("flags 'everyone can' universalism", () => {
      const result = reviewForInclusion(
        "With this design, everyone can access the product equally and should benefit from our work."
      );
      expect(result.shallow_inclusion_flags.length).toBeGreaterThan(0);
    });

    it("flags performative importance statements", () => {
      const result = reviewForInclusion("Inclusion is important and we believe in making it central to everything we do.");
      expect(result.shallow_inclusion_flags.length).toBeGreaterThan(0);
    });

    it("flags 'we believe in accessibility' statements", () => {
      const result = reviewForInclusion("At our company, we believe in accessibility and inclusion as core values.");
      expect(result.shallow_inclusion_flags.length).toBeGreaterThan(0);
    });

    it("passes clean content with no shallow flags", () => {
      const result = reviewForInclusion(
        "Inaccessible checkout flows exclude disabled users and cost e-commerce teams revenue. The structural default in most checkout designs assumes mouse navigation, color perception, and no cognitive load from the interface."
      );
      expect(result.shallow_inclusion_flags).toHaveLength(0);
    });
  });

  describe("power dynamics gap detection", () => {
    it("flags 'user error' framing", () => {
      const result = reviewForInclusion(
        "Most of these issues come down to user error and not following the intended flow."
      );
      expect(result.power_dynamics_gaps.length).toBeGreaterThan(0);
    });

    it("flags 'edge case' framing", () => {
      const result = reviewForInclusion(
        "This affects only an edge case of users and is not a priority for the main product."
      );
      expect(result.power_dynamics_gaps.length).toBeGreaterThan(0);
    });

    it("flags 'the disabled' medical model language", () => {
      const result = reviewForInclusion(
        "We need to build features that help the disabled use our product more effectively."
      );
      expect(result.power_dynamics_gaps.length).toBeGreaterThan(0);
    });

    it("flags charity framing toward disabled users", () => {
      const result = reviewForInclusion(
        "Our goal is to help the disabled community access services they previously could not use."
      );
      expect(result.power_dynamics_gaps.length).toBeGreaterThan(0);
    });
  });

  describe("accessibility gap detection", () => {
    it("flags outdated impairment language", () => {
      const result = reviewForInclusion(
        "We built features for visually impaired and hearing impaired users."
      );
      expect(result.accessibility_gaps.length).toBeGreaterThan(0);
    });

    it("flags WCAG-as-completion framing", () => {
      const result = reviewForInclusion(
        "We ran a WCAG audit and now accessibility is done and handled."
      );
      expect(result.accessibility_gaps.length).toBeGreaterThan(0);
    });
  });

  describe("harmful framing detection", () => {
    it("flags 'normal users' language and blocks", () => {
      const result = reviewForInclusion(
        "We optimize primarily for normal users and then add accessibility features on top."
      );
      expect(result.harmful_framing_flags.length).toBeGreaterThan(0);
      expect(result.status).toBe("block");
    });

    it("flags 'wheelchair-bound' and blocks", () => {
      const result = reviewForInclusion(
        "Our app was designed with wheelchair-bound users in mind for navigation features."
      );
      expect(result.harmful_framing_flags.length).toBeGreaterThan(0);
      expect(result.status).toBe("block");
    });

    it("flags 'special needs' language and blocks", () => {
      const result = reviewForInclusion(
        "We built a special needs mode for users with disabilities."
      );
      expect(result.harmful_framing_flags.length).toBeGreaterThan(0);
      expect(result.status).toBe("block");
    });
  });

  describe("overconfident AI claim detection", () => {
    it("flags AI neutrality claims and blocks", () => {
      const result = reviewForInclusion(
        "Unlike human designers, AI is bias-free and will eliminate discrimination from our hiring process."
      );
      expect(result.overconfident_ai_flags.length).toBeGreaterThan(0);
      expect(result.status).toBe("block");
    });

    it("flags AI solve-everything claims and blocks", () => {
      const result = reviewForInclusion(
        "AI can solve accessibility problems automatically once deployed."
      );
      expect(result.overconfident_ai_flags.length).toBeGreaterThan(0);
      expect(result.status).toBe("block");
    });
  });

  describe("status scoring", () => {
    it("returns pass for clean content", () => {
      const result = reviewForInclusion(
        "Disabled people deserve the same design consideration as any other user segment. They represent a significant portion of the market that most product teams exclude by default. The cost of that exclusion is measurable: abandoned flows, support tickets, and lost revenue. Building inclusively from the start costs less than retrofitting later."
      );
      expect(result.status).toBe("pass");
    });

    it("returns revise for content with one shallow flag", () => {
      const result = reviewForInclusion(
        "Inclusion is important to us and we want to build better products."
      );
      expect(result.status).toBe("revise");
    });

    it("returns block for any harmful framing", () => {
      const result = reviewForInclusion(
        "We designed this primarily for regular users, with a separate mode for special needs."
      );
      expect(result.status).toBe("block");
    });

    it("always includes recommended edits when status is not pass", () => {
      const result = reviewForInclusion(
        "Inclusion is important and we believe in helping disabled people use our products."
      );
      expect(result.status).not.toBe("pass");
      expect(result.recommended_edits.length).toBeGreaterThan(0);
    });
  });
});
