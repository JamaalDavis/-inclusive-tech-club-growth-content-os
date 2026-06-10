import type { VoiceCheckResult } from "../types.js";

const BANNED_PHRASES: string[] = [
  "in today's fast-paced digital landscape",
  "unlock the power",
  "diversity is our strength",
  "seamless user experience",
  "seamless experience",
  "leverage synergies",
  "leverage the power",
  "game-changing",
  "game changer",
  "revolutionize",
  "revolutionary",
  "delve",
  "delve into",
  "elevate your",
  "elevate the",
  "innovative solution",
  "innovative approach",
  "at the end of the day",
  "moving the needle",
  "best practices",
  "low-hanging fruit",
  "thought leader",
  "thought leadership",
  "certainly!",
  "absolutely!",
  "of course!",
  "in conclusion,",
  "to sum up,",
  "furthermore,",
  "it's important to note that",
  "it's worth mentioning",
  "it's worth noting",
  "creates a space for",
  "enables a journey",
  "fast-paced world",
  "rapidly evolving",
  "digital transformation",
  "unlock your potential",
  "empower your team",
  "harness the power",
  "paradigm shift",
  "robust solution",
  "scalable solution",
  "cutting-edge",
  "state-of-the-art",
  "world-class",
  "best-in-class",
];

const WEAK_HOOK_PATTERNS: RegExp[] = [
  /^(i\s+want\s+to\s+talk\s+about)/i,
  /^(today\s+i\s+(want|am going|will))/i,
  /^(in\s+this\s+post)/i,
  /^(as\s+we\s+all\s+know)/i,
  /^(it\s+goes\s+without\s+saying)/i,
  /^(this\s+is\s+a\s+reminder)/i,
  /^(hi\s+everyone)/i,
  /^(hello\s+everyone)/i,
];

const VAGUE_CLAIM_PATTERNS: RegExp[] = [
  /many\s+(companies|organizations|teams|people)\s+(don't|do not|fail to|struggle to)/i,
  /most\s+(companies|organizations|teams|people)\s+(don't|do not|fail to|struggle to)/i,
  /everyone\s+(knows|agrees|understands)/i,
  /it\s+is\s+(obvious|clear)\s+that/i,
  /studies\s+show\s+that\b(?!\s+\[)/i,
  /research\s+suggests\s+that\b(?!\s+\[)/i,
];

const SYSTEMS_THINKING_SIGNALS: RegExp[] = [
  /\b(system|structural|institutional|organizational|power|policy|incentive|default)\b/i,
  /\b(who\s+(benefits|pays|decides|gets|loses))\b/i,
  /\b(root\s+cause|upstream|downstream|feedback\s+loop)\b/i,
];

function detectBannedPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  return BANNED_PHRASES.filter((phrase) => lower.includes(phrase.toLowerCase()));
}

function detectWeakHooks(text: string): string[] {
  const firstSentence = text.split(/[.!?]/)[0]?.trim() ?? "";
  return WEAK_HOOK_PATTERNS.filter((p) => p.test(firstSentence)).map(
    () => `Weak hook detected: "${firstSentence.slice(0, 80)}..."`
  );
}

function detectVagueClaims(text: string): string[] {
  return VAGUE_CLAIM_PATTERNS.filter((p) => p.test(text)).map(
    (p) => `Vague claim pattern: "${text.match(p)?.[0]}"`
  );
}

function hasSystemsThinking(text: string): boolean {
  return SYSTEMS_THINKING_SIGNALS.some((p) => p.test(text));
}

function buildRewrites(banned: string[], vague: string[], weakHooks: string[]): string[] {
  const suggestions: string[] = [];

  for (const phrase of banned.slice(0, 3)) {
    const rewrites: Record<string, string> = {
      "game-changing": "Replace with specific impact: 'reduces support costs by X' or 'cuts audit time in half'",
      "revolutionize": "Replace with concrete change: 'change how teams audit for accessibility' or 'shift how product teams make inclusion decisions'",
      "seamless user experience": "Replace with specific outcome: 'checkout flow that works for keyboard users' or 'form that screen readers can navigate'",
      "delve": "Replace with 'explore', 'examine', 'break down', or 'look at'",
      "innovative solution": "Name the actual solution. What does it do? Replace with the specific thing.",
      "best practices": "Name the practice. 'Best practices for accessibility' → 'Early WCAG audit, semantic HTML, keyboard testing'",
      "thought leader": "Delete. Let the content prove the expertise.",
      "leverage": "Replace with 'use', 'apply', 'build on', or the specific verb that describes what you're doing",
    };

    const suggestion = rewrites[phrase] ?? `Remove "${phrase}" — replace with a specific, concrete claim.`;
    suggestions.push(suggestion);
  }

  if (weakHooks.length > 0) {
    suggestions.push(
      "Rewrite the opening. Start with the uncomfortable truth, the surprising cost, or the thing most teams get wrong. Not with your intention to share something."
    );
  }

  if (vague.length > 0) {
    suggestions.push(
      "Replace vague generalization with a specific example or [CITATION NEEDED] placeholder. 'Many companies fail to...' → Name a category or source a number."
    );
  }

  return suggestions;
}

function calculateScore(
  banned: string[],
  weak: string[],
  vague: string[],
  hasSystems: boolean
): number {
  let score = 100;
  score -= banned.length * 10;
  score -= weak.length * 15;
  score -= vague.length * 8;
  if (!hasSystems) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function checkVoice(draft: string): VoiceCheckResult {
  const banned = detectBannedPhrases(draft);
  const weakHooks = detectWeakHooks(draft);
  const vagueClaims = detectVagueClaims(draft);
  const hasSystems = hasSystemsThinking(draft);

  const score = calculateScore(banned, weakHooks, vagueClaims, hasSystems);
  const rewrites = buildRewrites(banned, vagueClaims, weakHooks);

  return {
    score,
    banned_phrases_found: banned,
    weak_hooks: weakHooks,
    vague_claims: vagueClaims,
    missing_systems_thinking: !hasSystems,
    rewrite_suggestions: rewrites,
    verdict: score >= 65 ? "pass" : "revise",
  };
}

export function formatVoiceCheckAsMarkdown(result: VoiceCheckResult): string {
  const bannedBlock =
    result.banned_phrases_found.length > 0
      ? result.banned_phrases_found.map((p) => `- "${p}"`).join("\n")
      : "- None found";

  const hooksBlock =
    result.weak_hooks.length > 0
      ? result.weak_hooks.map((h) => `- ${h}`).join("\n")
      : "- None found";

  const vagueBlock =
    result.vague_claims.length > 0
      ? result.vague_claims.map((v) => `- ${v}`).join("\n")
      : "- None found";

  const rewritesBlock =
    result.rewrite_suggestions.length > 0
      ? result.rewrite_suggestions.map((r) => `- ${r}`).join("\n")
      : "- No rewrites needed";

  const systemsNote = result.missing_systems_thinking
    ? "Missing — add systems-level framing (who benefits, who pays, what maintains this problem)"
    : "Present";

  return `# Voice Check Report

**Score:** ${result.score}/100
**Verdict:** ${result.verdict.toUpperCase()}

## Banned Phrases Found
${bannedBlock}

## Weak Hooks
${hooksBlock}

## Vague Claims
${vagueBlock}

## Systems Thinking
${systemsNote}

## Rewrite Suggestions
${rewritesBlock}

---
*${result.verdict === "pass" ? "Ready for inclusion review." : "Revise before moving forward. Score must reach 65+ to pass."}*
`;
}
