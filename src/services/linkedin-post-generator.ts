import type { ContentBrief, ContentMetadata } from "../types.js";
import { generateContentMetadata } from "../domain/value-map/value-map-engine.js";
import { mapToValueCategories } from "../domain/value-map/value-map-engine.js";

export type LinkedInFormat = "short" | "medium" | "carousel_intro";

export interface LinkedInPost {
  format: LinkedInFormat;
  hook: string;
  body: string;
  inclusive_design_lesson: string;
  cta: string | null;
  first_comment: string | null;
  hashtags: string[];
  metadata: ContentMetadata;
  approval_status: "drafted";
}

const PILLAR_HASHTAGS: Record<string, string[]> = {
  inclusive_design_as_business_value: [
    "#InclusiveDesign",
    "#Accessibility",
    "#ProductDesign",
    "#BusinessValue",
    "#InclusiveTechClub",
  ],
  human_centered_ai: [
    "#HumanCenteredAI",
    "#AIGovernance",
    "#ResponsibleAI",
    "#InclusiveDesign",
    "#InclusiveTechClub",
  ],
  power_dynamics_in_product_design: [
    "#ProductDesign",
    "#DesignJustice",
    "#InclusiveDesign",
    "#PowerDynamics",
    "#InclusiveTechClub",
  ],
  accessibility_beyond_compliance: [
    "#Accessibility",
    "#A11y",
    "#InclusiveDesign",
    "#WCAG",
    "#InclusiveTechClub",
  ],
  inclusive_tech_club_builds: [
    "#InclusiveTechClub",
    "#InclusiveDesign",
    "#ProductDesign",
    "#Accessibility",
  ],
};

const HOOK_SCAFFOLDS: Record<LinkedInFormat, string> = {
  short: `[Start with a specific uncomfortable truth, a number that surprises, or a direct challenge to a common assumption. One sentence. No windup.]`,
  medium: `[Start with the real cost, the specific failure, or the thing most product teams get wrong. One to two sentences. No "I want to talk about X" framing.]`,
  carousel_intro: `[Start with the tension or problem this carousel will resolve. Strong enough to make someone swipe. One sentence.]`,
};

const BODY_SCAFFOLDS: Record<LinkedInFormat, string> = {
  short: `[2–3 short paragraphs. One idea per paragraph. State the problem, name the system behind it, connect to business or human stakes. No filler.]`,
  medium: `[4–6 short paragraphs. Problem → system → stakes → insight. One clear thread. No tangents. Short sentences.]`,
  carousel_intro: `[2–3 sentences. Preview the problem this carousel addresses. Tease the first key insight without giving it away.]`,
};

function buildFirstComment(cta: string, leadMagnetAvailable: boolean): string | null {
  if (!leadMagnetAvailable) return null;
  return `${cta} — link in comments 👇`;
}

export function generateLinkedInPost(
  brief: ContentBrief,
  format: LinkedInFormat = "medium"
): LinkedInPost {
  const hook = HOOK_SCAFFOLDS[format];
  const body = BODY_SCAFFOLDS[format];

  const lesson = `[State the practical inclusive design takeaway in one sentence. Something a product leader or designer can bring back to their team today.]`;

  const cta = format !== "short" ? brief.cta : null;

  const hashtags =
    PILLAR_HASHTAGS[brief.content_pillar] ??
    PILLAR_HASHTAGS["inclusive_design_as_business_value"];

  const valueMapping = mapToValueCategories(brief.raw_idea, brief.content_pillar);

  const metadata = generateContentMetadata({
    content_title: `[LinkedIn Post] ${brief.core_thesis.slice(0, 60)}`,
    channel: "linkedin",
    funnel_stage: brief.funnel_stage,
    primary_audience: brief.target_audience,
    content_pillar: brief.content_pillar,
    value_mapping: valueMapping,
    cta: brief.cta,
    repurpose_options: ["newsletter", "carousel", "video_script"],
  });

  return {
    format,
    hook,
    body,
    inclusive_design_lesson: lesson,
    cta,
    first_comment: buildFirstComment(brief.cta, format === "medium"),
    hashtags,
    metadata,
    approval_status: "drafted",
  };
}

export function formatLinkedInPostAsMarkdown(post: LinkedInPost, brief: ContentBrief): string {
  const ctaBlock = post.cta ? `\n## CTA\n${post.cta}` : "";
  const firstCommentBlock = post.first_comment
    ? `\n## First Comment (link drop)\n${post.first_comment}`
    : "";

  return `# LinkedIn Post — ${post.format}

## Brief Reference
**Core Thesis:** ${brief.core_thesis}
**Audience:** ${brief.target_audience}
**Pillar:** ${brief.content_pillar}

---

## Hook
${post.hook}

## Body
${post.body}

## Inclusive Design Lesson
${post.inclusive_design_lesson}
${ctaBlock}${firstCommentBlock}

## Hashtags
${post.hashtags.join(" ")}

---

## Metadata
- **Pillar:** ${post.metadata.content_pillar}
- **Funnel Stage:** ${post.metadata.funnel_stage}
- **Audience:** ${post.metadata.primary_audience}
- **Value Categories:** ${post.metadata.value_categories.join(", ")}
- **Repurpose Options:** ${post.metadata.repurpose_options.join(", ")}

---
*Status: DRAFTED — awaiting voice check, inclusion review, and Jamaal approval before publishing*
`;
}
