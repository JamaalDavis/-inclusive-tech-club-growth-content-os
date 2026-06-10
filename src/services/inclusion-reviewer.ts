import type { InclusionReviewResult, ReviewStatus } from "../types.js";

const SHALLOW_INCLUSION_PATTERNS: Array<{ pattern: RegExp; flag: string }> = [
  {
    pattern: /\b(everyone|all users|every user|all people)\b.*\b(can|should|will)\b/i,
    flag: 'Shallow universalism: "everyone can/should/will" flattens real differences in access and ability.',
  },
  {
    pattern: /\binclusion is (important|key|critical|essential|vital)\b/i,
    flag: "Performative importance statement. Show why it matters with a specific consequence, not an adjective.",
  },
  {
    pattern: /\b(inclusive culture|culture of inclusion|inclusive workplace)\b/i,
    flag: 'Culture-only framing. "Culture of inclusion" without structural specifics is DEI theater.',
  },
  {
    pattern: /\b(diversity and inclusion|D&I|DEI)\b(?! program| initiative| policy| training)/i,
    flag: "DEI used as noun-phrase shorthand. Be specific about which dimension of inclusion and which mechanism.",
  },
  {
    pattern: /\bwe believe in (accessibility|inclusion|diversity)\b/i,
    flag: 'Belief-statement without evidence. "We believe in" is not a commitment — it\'s a press release.',
  },
];

const POWER_DYNAMICS_GAPS: Array<{ pattern: RegExp; flag: string }> = [
  {
    pattern: /\b(user error|human error|user mistake)\b/i,
    flag: "\"User error\" framing shifts blame to the user rather than examining the design decision.",
  },
  {
    pattern: /\b(edge case|corner case|minority of users|small percentage)\b/i,
    flag: 'Edge case framing minimizes real user needs. Who decided this was an edge? At what cost?',
  },
  {
    pattern: /\b(the disabled|disabled individuals|people suffering from)\b/i,
    flag: 'Medical model language detected. Use "disabled people" or "people with disabilities" (identity-first or person-first per community preference). "Suffering from" is paternalistic.',
  },
  {
    pattern: /\b(helping|help the|serve the|cater to)\s+(disabled|elderly|senior|low-income)\b/i,
    flag: "Charity framing detected. These are users with needs and rights, not beneficiaries of your help.",
  },
];

const ACCESSIBILITY_GAP_PATTERNS: Array<{ pattern: RegExp; flag: string }> = [
  {
    pattern: /\b(visually impaired|hearing impaired|physically impaired)\b/i,
    flag: 'Outdated impairment language. Prefer "blind or low-vision users," "deaf or hard-of-hearing users," "users with mobility disabilities."',
  },
  {
    pattern: /visual.*accessib/i,
    flag: "Accessibility discussion focused only on visual access. Check for cognitive, motor, and auditory dimensions.",
  },
  {
    pattern: /\bWCAG\b.*\b(done|complete|finished|covered|handled)\b/i,
    flag: "WCAG compliance framed as completion. WCAG is the floor. Usability and cognitive access are beyond it.",
  },
  {
    pattern: /\b(blind users|blind people)\b(?!.*\b(low.vision|color)\b)/i,
    flag: "Consider expanding to include low-vision users who have different needs than blind users.",
  },
];

const HARMFUL_FRAMING_PATTERNS: Array<{ pattern: RegExp; flag: string }> = [
  {
    pattern: /\b(normal users|typical users|regular users|mainstream users)\b/i,
    flag: '"Normal/typical/regular users" implies others are abnormal. Name the specific user group.',
  },
  {
    pattern: /\b(despite (his|her|their) disability)\b/i,
    flag: '"Despite disability" framing is inspirational-ableism. Disability is not an obstacle to be overcome.',
  },
  {
    pattern: /\b(special needs|specially abled|differently abled)\b/i,
    flag: '"Special needs" and "differently abled" are euphemisms many disabled people find condescending. Use direct language.',
  },
  {
    pattern: /\b(wheelchair.bound|confined to a wheelchair)\b/i,
    flag: '"Wheelchair-bound" is outdated. Use "wheelchair user" — a wheelchair is a tool of liberation, not confinement.',
  },
];

const OVERCONFIDENT_AI_PATTERNS: Array<{ pattern: RegExp; flag: string }> = [
  {
    pattern: /\bAI (can|will|is able to) (solve|fix|eliminate|end|prevent)\b/i,
    flag: "Overconfident AI capability claim. AI does not solve systemic problems. It can support, but specify how.",
  },
  {
    pattern: /\b(AI.generated|automatically generated|AI.created)\s+(accessible|inclusive)\b/i,
    flag: "AI-generated accessibility is not the same as accessible design. Automation produces drafts, not decisions.",
  },
  {
    pattern: /\bAI (is|will be) (bias.free|unbiased|objective|neutral|fair)\b/i,
    flag: "AI neutrality claim. AI systems encode the biases of their data and builders. This claim needs strong qualification.",
  },
];

function scoreFromFlags(
  shallow: number,
  power: number,
  accessibility: number,
  harmful: number,
  ai: number
): ReviewStatus {
  if (harmful > 0) return "block";
  if (ai > 0) return "block";
  const total = shallow + power + accessibility;
  if (total >= 3) return "block";
  if (total >= 1) return "revise";
  return "pass";
}

export function reviewForInclusion(draft: string): InclusionReviewResult {
  const shallowFlags = SHALLOW_INCLUSION_PATTERNS.filter(({ pattern }) =>
    pattern.test(draft)
  ).map(({ flag }) => flag);

  const powerGaps = POWER_DYNAMICS_GAPS.filter(({ pattern }) =>
    pattern.test(draft)
  ).map(({ flag }) => flag);

  const accessibilityGaps = ACCESSIBILITY_GAP_PATTERNS.filter(({ pattern }) =>
    pattern.test(draft)
  ).map(({ flag }) => flag);

  const harmfulFlags = HARMFUL_FRAMING_PATTERNS.filter(({ pattern }) =>
    pattern.test(draft)
  ).map(({ flag }) => flag);

  const aiFlags = OVERCONFIDENT_AI_PATTERNS.filter(({ pattern }) =>
    pattern.test(draft)
  ).map(({ flag }) => flag);

  const status = scoreFromFlags(
    shallowFlags.length,
    powerGaps.length,
    accessibilityGaps.length,
    harmfulFlags.length,
    aiFlags.length
  );

  const recommendedEdits = buildRecommendedEdits(
    shallowFlags,
    powerGaps,
    accessibilityGaps,
    harmfulFlags,
    aiFlags
  );

  return {
    status,
    shallow_inclusion_flags: shallowFlags,
    power_dynamics_gaps: powerGaps,
    accessibility_gaps: accessibilityGaps,
    harmful_framing_flags: harmfulFlags,
    unsupported_claim_flags: [],
    overconfident_ai_flags: aiFlags,
    recommended_edits: recommendedEdits,
  };
}

function buildRecommendedEdits(
  shallow: string[],
  power: string[],
  accessibility: string[],
  harmful: string[],
  ai: string[]
): string[] {
  const edits: string[] = [];

  if (harmful.length > 0) {
    edits.push(
      "PRIORITY: Fix harmful framing flags before anything else. These directly harm the communities you're writing about."
    );
  }

  if (ai.length > 0) {
    edits.push(
      "PRIORITY: Remove or qualify overconfident AI claims. Replace with specific, bounded, verifiable claims about what AI can do."
    );
  }

  if (shallow.length > 0) {
    edits.push(
      "Replace performative inclusion language with operational specifics. What mechanism? What measurement? What commitment?"
    );
  }

  if (power.length > 0) {
    edits.push(
      "Add power dynamics analysis: who benefits from current design, who pays the cost, what maintains the status quo?"
    );
  }

  if (accessibility.length > 0) {
    edits.push(
      "Expand accessibility framing beyond visual or compliance dimensions. Include cognitive, motor, and auditory access."
    );
  }

  return edits;
}

export function formatInclusionReviewAsMarkdown(result: InclusionReviewResult): string {
  const statusEmoji = result.status === "pass" ? "PASS" : result.status === "revise" ? "REVISE" : "BLOCK";

  function formatList(items: string[]): string {
    return items.length > 0 ? items.map((i) => `- ${i}`).join("\n") : "- None found";
  }

  return `# Inclusion Review

**Status:** ${statusEmoji}

## Shallow Inclusion Flags
${formatList(result.shallow_inclusion_flags)}

## Power Dynamics Gaps
${formatList(result.power_dynamics_gaps)}

## Accessibility Gaps
${formatList(result.accessibility_gaps)}

## Harmful Framing
${formatList(result.harmful_framing_flags)}

## Overconfident AI Claims
${formatList(result.overconfident_ai_flags)}

## Recommended Edits
${formatList(result.recommended_edits)}

---
*${result.status === "block" ? "BLOCKED — do not advance until flagged items are resolved and Jamaal approves." : result.status === "revise" ? "REVISION REQUIRED — address flagged items before approval." : "Ready for Jamaal's final review."}*
`;
}
