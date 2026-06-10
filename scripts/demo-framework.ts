import { generateContentBrief, formatBriefAsMarkdown } from "../src/services/content-brief-generator.js";
import { generateLinkedInPost, formatLinkedInPostAsMarkdown } from "../src/services/linkedin-post-generator.js";
import { generateCarousel, formatCarouselAsMarkdown } from "../src/services/carousel-generator.js";
import { checkVoice, formatVoiceCheckAsMarkdown } from "../src/services/voice-checker.js";
import { reviewForInclusion, formatInclusionReviewAsMarkdown } from "../src/services/inclusion-reviewer.js";
import { buildRepurposeMap, formatRepurposeMapAsMarkdown } from "../src/services/repurposing-engine.js";

const SEPARATOR = "\n" + "─".repeat(60) + "\n";

// ── SOURCE MATERIAL ───────────────────────────────────────────
// Extracted from Jamaal's Inclusive Storytelling Accessibility
// Gap Analysis framework artifact.

const RAW_IDEA = `
Inclusive Storytelling Accessibility Gap Analysis
Where legacy accessibility approaches fall short — and what to do next.

Gap analysis helps move teams from compliance add-ons to inclusive system design.

Five areas where current approaches break:

1. ENTRY POINTS
   Gap: access options are hidden or unavailable at the start
   Impact: users face friction before they can engage
   Shift: present modality choices early and clearly
   Priority: High

2. CONTENT DELIVERY
   Gap: story is designed for one dominant mode, usually text or visuals
   Impact: comprehension drops for users with different needs or contexts
   Shift: plan text, audio, captions, and assistive pathways together
   Priority: High

3. TRANSITIONS ACROSS MODES
   Gap: switching formats causes loss of place, progress, or meaning
   Impact: users must restart or reconstruct context
   Shift: preserve continuity across modalities
   Priority: High

4. TESTING AND VALIDATION
   Gap: teams rely on checklists or automated scans only
   Impact: lived experience gaps remain invisible
   Shift: test with disabled, neurodivergent, multilingual, and edge-case users
   Priority: High

5. OWNERSHIP AND GOVERNANCE
   Gap: accessibility is siloed or added late
   Impact: inclusion becomes expensive cleanup and uneven quality
   Shift: assign shared ownership across design, content, engineering, research, and leadership
   Priority: Medium-High

Signals of maturity:
- Accessibility decisions happen upstream
- Teams measure comprehension, not just compliance
- Users can change modes without losing meaning
- Inclusive design is shared across functions

Core thesis: "The goal is not just access to the story — it is trustworthy meaning across forms."
`.trim();

console.log("━".repeat(60));
console.log("  ITC CONTENT OS — FRAMEWORK PIPELINE RUN");
console.log("  Source: Inclusive Storytelling Accessibility Gap Analysis");
console.log("━".repeat(60));

// ── STEP 1: CONTENT BRIEF ─────────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 1 — CONTENT BRIEF");
console.log(SEPARATOR);

const brief = generateContentBrief({
  raw_idea: RAW_IDEA,
  override_pillar: "inclusive_tech_club_builds",
  override_audience: "inclusive_design_practitioners",
  override_funnel_stage: "conversion",
});

// Fill in the core thesis from the framework's own closing line
brief.core_thesis =
  "Accessibility compliance is a floor that most teams treat as a ceiling — and the five gaps in how we tell stories inclusively show exactly where things break and why.";

console.log(formatBriefAsMarkdown(brief));

// ── STEP 2: LINKEDIN POST ─────────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 2 — LINKEDIN POST (medium)");
console.log("  Angle: Governance gap — accessibility siloed = expensive cleanup");
console.log(SEPARATOR);

const post = generateLinkedInPost(brief, "medium");

// Overlay the specific angle for this post
const postWithAngle = {
  ...post,
  hook: `Accessibility siloed at the end of the process doesn't just miss users. It creates expensive cleanup.`,
  body: `Here's what that looks like in practice:

A team ships a product. Accessibility is added in the final sprint.
The captions are wrong. The modality switching loses the user's place.
The entry point buries the access options three taps deep.

Now you're doing remediation instead of design.
The cost of fixing it post-launch is 3–5x the cost of building it right.
And disabled users already left.

I built a gap analysis framework to map exactly where inclusive storytelling breaks down.
Five areas. All avoidable. Most of them organizational, not technical.

The governance gap is the one that causes the other four.
When no one owns inclusion across design, content, engineering, and research —
inclusion becomes everyone's afterthought and nobody's accountability.

The signal of maturity isn't passing an audit.
It's making accessibility decisions upstream, before the content structure is locked.`,
  inclusive_design_lesson: `Accessibility siloed is accessibility compromised. Shared ownership across functions isn't a process preference — it's the structural condition that makes the other four gaps fixable.`,
  cta: `I built a full gap analysis framework for this. Grab it below.`,
};

console.log(formatLinkedInPostAsMarkdown(postWithAngle, brief));

// ── STEP 3: 5-SLIDE CAROUSEL ──────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 3 — 5-SLIDE CAROUSEL");
console.log("  One slide per gap — the framework as a visual argument");
console.log(SEPARATOR);

const carousel = generateCarousel(brief, 5);

// Overlay the specific content from the framework
const carouselWithContent = {
  ...carousel,
  title: "5 Gaps in Inclusive Storytelling — and what to do about each one",
  slides: [
    {
      slide_number: 1,
      headline: `Your accessibility approach has 5 gaps.\nMost teams only see one of them.`,
      body: `Legacy accessibility is compliance theater.\nHere are the 5 places inclusive storytelling actually breaks —\nand what to shift for each one. Swipe.`,
      visual_direction: `Bold headline, clean background, high contrast. "5 gaps" as the anchor. No icons — text-first.`,
      accessibility_notes: `Minimum 4.5:1 contrast. No animation on this slide. Full text in alt text.`,
      alt_text: `Slide 1 of 5. Headline: "Your accessibility approach has 5 gaps. Most teams only see one of them." Subtext introduces a 5-part framework on inclusive storytelling gaps.`,
    },
    {
      slide_number: 2,
      headline: `Gap 1: Entry Points`,
      body: `Current gap: access options are hidden or unavailable at the start.\n\nImpact: users hit friction before they can engage.\n\nShift: present modality choices early and clearly.\n\nIf someone has to find the accessible version, you've already failed.`,
      visual_direction: `"Gap 1" label at top. Two-column layout: gap/impact on left, shift on right. Subtle divider. No decorative icons.`,
      accessibility_notes: `Column layout must linearize correctly for screen readers. Left-to-right reading order. Full content in alt text.`,
      alt_text: `Slide 2 of 5. Gap 1: Entry Points. Gap: access options hidden at the start. Impact: friction before engagement. Shift: present modality choices early and clearly.`,
    },
    {
      slide_number: 3,
      headline: `Gap 4: Testing & Validation`,
      body: `Current gap: teams rely on checklists or automated scans only.\n\nImpact: lived experience gaps remain invisible.\n\nShift: test with disabled, neurodivergent, multilingual, and edge-case users.\n\nAn audit can't tell you what a checklist can't see.`,
      visual_direction: `"Gap 4" label. Quote treatment for the bottom line. Consider a simple before/after contrast: checklist icon vs. diverse user group icon (use text description if icon quality uncertain).`,
      accessibility_notes: `If icons used, include role="img" aria-label. Quote text must be in alt text verbatim. High contrast required for any icon.`,
      alt_text: `Slide 3 of 5. Gap 4: Testing and Validation. Gap: checklists and automated scans only. Impact: lived experience gaps stay invisible. Shift: test with disabled, neurodivergent, multilingual, and edge-case users. Quote: "An audit can't tell you what a checklist can't see."`,
    },
    {
      slide_number: 4,
      headline: `Gap 5: Ownership & Governance`,
      body: `Current gap: accessibility is siloed or added late.\n\nImpact: inclusion becomes expensive cleanup and uneven quality.\n\nShift: shared ownership across design, content, engineering, research, and leadership.\n\nThis gap causes the other four.`,
      visual_direction: `"Gap 5" label. "This gap causes the other four." as a pull quote — highest visual weight on the slide. Bold.`,
      accessibility_notes: `Pull quote must be in alt text verbatim. Do not use color alone to distinguish the quote — use weight and size.`,
      alt_text: `Slide 4 of 5. Gap 5: Ownership and Governance. Gap: accessibility siloed or added late. Impact: expensive cleanup, uneven quality. Shift: shared ownership across all functions. Key point: "This gap causes the other four."`,
    },
    {
      slide_number: 5,
      headline: `The goal is not just access to the story.\nIt is trustworthy meaning across forms.`,
      body: `The full gap analysis framework — all 5 gaps, all recommended shifts, and the signals of maturity — is available as a free download.\n\nLink in comments.`,
      visual_direction: `Quote treatment. Clean, full-bleed. The line is the whole slide — let it breathe. High contrast. Inclusive Tech Club logo mark bottom right.`,
      accessibility_notes: `Full quote in alt text. Logo requires alt text: "Inclusive Tech Club". CTA text must meet contrast requirements.`,
      alt_text: `Slide 5 of 5. Quote: "The goal is not just access to the story — it is trustworthy meaning across forms." Call to action: download the full gap analysis framework — link in comments.`,
    },
  ],
};

console.log(formatCarouselAsMarkdown(carouselWithContent));

// ── STEP 4: VOICE CHECK ───────────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 4 — VOICE CHECK on the LinkedIn post body");
console.log(SEPARATOR);

const voiceResult = checkVoice(postWithAngle.body + "\n" + postWithAngle.inclusive_design_lesson);
console.log(formatVoiceCheckAsMarkdown(voiceResult));

// ── STEP 5: INCLUSION REVIEW ──────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 5 — INCLUSION REVIEW on full post content");
console.log(SEPARATOR);

const fullPostText = [
  postWithAngle.hook,
  postWithAngle.body,
  postWithAngle.inclusive_design_lesson,
].join("\n\n");

const inclusionResult = reviewForInclusion(fullPostText);
console.log(formatInclusionReviewAsMarkdown(inclusionResult));

// ── STEP 6: REPURPOSE MAP ──────────────────────────────────────

console.log(SEPARATOR);
console.log("STEP 6 — REPURPOSE MAP");
console.log("  What else can this framework become?");
console.log(SEPARATOR);

const repurposeMap = buildRepurposeMap({
  type: "research_note",
  title: "Inclusive Storytelling Accessibility Gap Analysis",
  content: RAW_IDEA,
  content_pillar: "inclusive_tech_club_builds",
  funnel_stage: "conversion",
  primary_audience: "inclusive_design_practitioners",
  value_categories: ["trust_and_brand", "cost_reduction", "community_power"],
});

console.log(formatRepurposeMapAsMarkdown(repurposeMap));

// ── SUMMARY ───────────────────────────────────────────────────

console.log(SEPARATOR);
console.log("PIPELINE SUMMARY");
console.log(SEPARATOR);
console.log(`Source:             Inclusive Storytelling Accessibility Gap Analysis`);
console.log(`Pillar:             ${brief.content_pillar}`);
console.log(`Audience:           ${brief.target_audience}`);
console.log(`Funnel stage:       ${brief.funnel_stage}`);
console.log(`Value categories:   ${brief.value_categories.slice(0, 3).join(", ")}`);
console.log(`─`);
console.log(`Brief:              ✓  core thesis set`);
console.log(`LinkedIn post:      ✓  governance gap angle — ${postWithAngle.approval_status}`);
console.log(`Carousel:           ✓  5 slides, one per gap — ${carouselWithContent.approval_status}`);
console.log(`Voice check:        ${voiceResult.verdict === "pass" ? "✓  PASS" : "✗  REVISE"} (${voiceResult.score}/100)`);
console.log(`Inclusion review:   ${inclusionResult.status === "pass" ? "✓  PASS" : inclusionResult.status.toUpperCase()}`);
console.log(`Repurpose options:  ${repurposeMap.recommendations.length} derivative assets identified`);
console.log(`─`);
console.log(`All outputs:        DRAFTED — awaiting Jamaal review before publishing\n`);
