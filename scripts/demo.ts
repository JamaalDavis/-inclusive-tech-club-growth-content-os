import { generateContentBrief, formatBriefAsMarkdown } from "../src/services/content-brief-generator.js";
import { generateLinkedInPost, formatLinkedInPostAsMarkdown } from "../src/services/linkedin-post-generator.js";
import { checkVoice, formatVoiceCheckAsMarkdown } from "../src/services/voice-checker.js";
import { reviewForInclusion, formatInclusionReviewAsMarkdown } from "../src/services/inclusion-reviewer.js";
import { generateNewsletter, formatNewsletterAsMarkdown } from "../src/services/newsletter-generator.js";

const SEPARATOR = "\n" + "─".repeat(60) + "\n";

const RAW_IDEA = `
Most product teams think they've solved accessibility when they pass a WCAG audit.
But WCAG measures the technical floor — not whether disabled users can actually complete tasks.
The gap between compliance and real usability is where revenue is lost.
Inaccessible checkout flows, broken keyboard navigation, and low-contrast error messages are
costing e-commerce teams measurable revenue in abandoned carts and support ticket volume.
Compliance is not the goal. Usability is the goal. And right now most teams are stopping at compliance.
`.trim();

console.log("━".repeat(60));
console.log("  INCLUSIVE TECH CLUB GROWTH CONTENT OS — DEMO RUN");
console.log("━".repeat(60));
console.log("\nRaw idea input:\n");
console.log(RAW_IDEA);

// ── STEP 1: CONTENT BRIEF ────────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 1 OF 4 — CONTENT BRIEF GENERATOR");
console.log(SEPARATOR);

const brief = generateContentBrief({ raw_idea: RAW_IDEA });
console.log(formatBriefAsMarkdown(brief));

// ── STEP 2: LINKEDIN POST ────────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 2 OF 4 — LINKEDIN POST GENERATOR (medium format)");
console.log(SEPARATOR);

const linkedinPost = generateLinkedInPost(brief, "medium");
console.log(formatLinkedInPostAsMarkdown(linkedinPost, brief));

// ── STEP 3: VOICE CHECK ──────────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 3 OF 4 — VOICE CHECKER");
console.log(SEPARATOR);

// Simulate a draft with a few of the voice issues Jamaal wants to avoid
const draftWithIssues = `
In today's fast-paced digital landscape, accessibility is important and we need to leverage
best practices to revolutionize the seamless user experience for all users.
Today I want to talk about how studies show that most companies fail to prioritize accessibility.
We should unlock the power of inclusion to game-change the way teams build products.
`.trim();

console.log("Testing voice checker on a draft with common issues:\n");
const voiceResult = checkVoice(draftWithIssues);
console.log(formatVoiceCheckAsMarkdown(voiceResult));

console.log("\nNow testing on clean, Jamaal-style content:\n");
const cleanDraft = `
Passing a WCAG audit is not the same as making an accessible product.
WCAG measures the minimum technical bar. It does not measure whether a screen reader user
can complete checkout, whether a keyboard user can navigate your error states,
or whether someone with low vision can read your confirmation email.
The gap between compliance and usability is where disabled customers leave.
That gap has a cost — in abandoned carts, failed applications, and support ticket volume.
The teams winning on accessibility are not the ones who pass audits.
They are the ones who treat disabled users as full design stakeholders.
`;

const voiceResultClean = checkVoice(cleanDraft);
console.log(formatVoiceCheckAsMarkdown(voiceResultClean));

// ── STEP 4: INCLUSION REVIEW ─────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 4 OF 4 — INCLUSION REVIEWER");
console.log(SEPARATOR);

console.log("Testing inclusion reviewer on draft with problematic framing:\n");
const problematicDraft = `
Our product is designed for normal users, but we also have a special needs mode
for wheelchair-bound users and visually impaired people.
We believe in accessibility and diversity is our strength.
This affects only an edge case of users so it is not a top priority.
AI is bias-free and can automatically solve accessibility problems for us.
`;

const inclusionResult = reviewForInclusion(problematicDraft);
console.log(formatInclusionReviewAsMarkdown(inclusionResult));

console.log("\nNow testing on the clean brief-derived content:\n");
const cleanInclusionDraft = `
Most product teams stop at WCAG compliance. That is not the ceiling — it is the floor.
Disabled users are not an afterthought. They are a market segment with real purchasing power
that inaccessible products actively exclude. The structural default in most product organizations
assumes able-bodied, neurotypical, English-speaking users. That assumption has a cost:
abandoned checkouts, inaccessible forms, and products that work for some people and not others.
The business stakes are real. The design response needs to match.
`;

const cleanInclusionResult = reviewForInclusion(cleanInclusionDraft);
console.log(formatInclusionReviewAsMarkdown(cleanInclusionResult));

// ── BONUS: NEWSLETTER SCAFFOLD ───────────────────────────────

console.log(SEPARATOR);
console.log("BONUS — NEWSLETTER SCAFFOLD from the same brief");
console.log(SEPARATOR);

const newsletter = generateNewsletter(brief);
console.log(formatNewsletterAsMarkdown(newsletter));

// ── SUMMARY ──────────────────────────────────────────────────

console.log(SEPARATOR);
console.log("SYSTEM SUMMARY");
console.log(SEPARATOR);
console.log(`Brief generated:    ✓  Pillar: ${brief.content_pillar}`);
console.log(`                       Funnel: ${brief.funnel_stage}`);
console.log(`                       Audience: ${brief.target_audience}`);
console.log(`                       Value: ${brief.value_categories.slice(0, 2).join(", ")}`);
console.log(`LinkedIn post:      ✓  Format: ${linkedinPost.format} | Status: ${linkedinPost.approval_status}`);
console.log(`Voice check:        ${voiceResult.verdict === "pass" ? "✓  PASS" : "✗  REVISE"} (${voiceResult.score}/100) — draft with issues`);
console.log(`                    ${voiceResultClean.verdict === "pass" ? "✓  PASS" : "✗  REVISE"} (${voiceResultClean.score}/100) — clean draft`);
console.log(`Inclusion review:   ${inclusionResult.status === "block" ? "✗  BLOCK" : "✓"} — draft with issues`);
console.log(`                    ${cleanInclusionResult.status === "pass" ? "✓  PASS" : cleanInclusionResult.status.toUpperCase()} — clean draft`);
console.log(`Newsletter:         ✓  Scaffold ready for Jamaal to fill`);
console.log(`\nAll outputs at status: DRAFTED — awaiting Jamaal review before publishing.\n`);
