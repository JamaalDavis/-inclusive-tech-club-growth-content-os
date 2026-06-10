import type { ContentBrief, ContentMetadata } from "../types.js";
import { generateContentMetadata } from "../domain/value-map/value-map-engine.js";
import { mapToValueCategories } from "../domain/value-map/value-map-engine.js";

export interface NewsletterDraft {
  title: string;
  opening_thesis: string;
  the_problem: string;
  why_it_matters: string;
  inclusive_design_lens: string;
  business_value_translation: string;
  action_step: string;
  cta: string;
  metadata: ContentMetadata;
  approval_status: "drafted";
}

export interface NewsletterFromLinkedInInput {
  linkedin_post_body: string;
  brief: ContentBrief;
}

const SECTION_SCAFFOLDS = {
  opening_thesis: `[State the central argument in 2–3 sentences. This is the thesis that everything else in this issue supports. Direct, not hedged. Should make the reader feel like they've already gotten something useful just from reading this.]`,

  the_problem: `[Name the specific, real problem this newsletter is addressing. Not the symptom — the system. Who created it? What maintains it? What does it cost? Keep it concrete, not abstract. 2–4 short paragraphs.]`,

  why_it_matters: `[Connect the problem to business stakes, human stakes, or both. What happens if this doesn't change? Who pays that cost? Be specific. Use a real example if one is available, or mark [EXAMPLE NEEDED]. 2–3 paragraphs.]`,

  inclusive_design_lens: `[Apply inclusive design thinking to the problem. This is the analysis that is uniquely Inclusive Tech Club. Name the power dynamics. Surface the intersectional dimension. Challenge the default framing. 2–4 paragraphs.]`,

  business_value_translation: `[Translate the inclusive design insight into terms that work in a business conversation. Revenue, risk, cost, brand — pick the ones that apply. Give product leaders and founders the language to use in their next meeting. 2–3 paragraphs.]`,

  action_step: `[Give the reader one thing they can do this week. Not a vague "think about it." A specific action, question to ask, or experiment to run. 1–2 paragraphs.]`,
};

export function generateNewsletter(brief: ContentBrief): NewsletterDraft {
  const title = `[Newsletter Title] — ${brief.core_thesis.slice(0, 60)}`;

  const valueMapping = mapToValueCategories(brief.raw_idea, brief.content_pillar);

  const metadata = generateContentMetadata({
    content_title: title,
    channel: "newsletter",
    funnel_stage: brief.funnel_stage,
    primary_audience: brief.target_audience,
    content_pillar: brief.content_pillar,
    value_mapping: valueMapping,
    cta: brief.cta,
    repurpose_options: ["linkedin_post", "carousel", "lead_magnet"],
  });

  return {
    title,
    opening_thesis: SECTION_SCAFFOLDS.opening_thesis,
    the_problem: SECTION_SCAFFOLDS.the_problem,
    why_it_matters: SECTION_SCAFFOLDS.why_it_matters,
    inclusive_design_lens: SECTION_SCAFFOLDS.inclusive_design_lens,
    business_value_translation: SECTION_SCAFFOLDS.business_value_translation,
    action_step: SECTION_SCAFFOLDS.action_step,
    cta: brief.cta,
    metadata,
    approval_status: "drafted",
  };
}

export function generateNewsletterFromLinkedInPost(
  input: NewsletterFromLinkedInInput
): NewsletterDraft {
  const { linkedin_post_body, brief } = input;

  const valueMapping = mapToValueCategories(brief.raw_idea, brief.content_pillar);
  const title = `[Expanded from LinkedIn] ${brief.core_thesis.slice(0, 60)}`;

  const metadata = generateContentMetadata({
    content_title: title,
    channel: "newsletter",
    funnel_stage: brief.funnel_stage,
    primary_audience: "newsletter_subscribers",
    content_pillar: brief.content_pillar,
    value_mapping: valueMapping,
    cta: brief.cta,
    repurpose_options: ["carousel", "lead_magnet"],
  });

  return {
    title,
    opening_thesis: `[Expand from LinkedIn post opening. The post said: "${linkedin_post_body.slice(0, 200)}..." — take this further. Add the context you couldn't fit in 3,000 characters.]`,
    the_problem: `[The LinkedIn post touched on the problem. The newsletter goes deeper. Name the system, the history, the specific cost. Give the reader something they couldn't have gotten from the post alone.]`,
    why_it_matters: SECTION_SCAFFOLDS.why_it_matters,
    inclusive_design_lens: `[The LinkedIn post was limited by format. Here you can add the intersectional analysis, the power dynamics framing, and the nuance that the algorithm punishes. Use the space.]`,
    business_value_translation: SECTION_SCAFFOLDS.business_value_translation,
    action_step: SECTION_SCAFFOLDS.action_step,
    cta: brief.cta,
    metadata,
    approval_status: "drafted",
  };
}

export function formatNewsletterAsMarkdown(draft: NewsletterDraft): string {
  return `# Newsletter Draft

## Title
${draft.title}

## Opening Thesis
${draft.opening_thesis}

## The Problem
${draft.the_problem}

## Why It Matters
${draft.why_it_matters}

## Inclusive Design Lens
${draft.inclusive_design_lens}

## Business Value Translation
${draft.business_value_translation}

## Action Step
${draft.action_step}

## CTA
${draft.cta}

---

## Metadata
- **Pillar:** ${draft.metadata.content_pillar}
- **Funnel Stage:** ${draft.metadata.funnel_stage}
- **Audience:** ${draft.metadata.primary_audience}
- **Value Categories:** ${draft.metadata.value_categories.join(", ")}
- **Repurpose Options:** ${draft.metadata.repurpose_options.join(", ")}

---
*Status: DRAFTED — awaiting voice check, inclusion review, and Jamaal approval before sending*
`;
}
