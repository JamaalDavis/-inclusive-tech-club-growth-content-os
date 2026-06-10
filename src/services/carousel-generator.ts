import type { ContentBrief, ContentMetadata } from "../types.js";
import { generateContentMetadata } from "../domain/value-map/value-map-engine.js";
import { mapToValueCategories } from "../domain/value-map/value-map-engine.js";

export type CarouselLength = 5 | 7 | 10;

export interface CarouselSlide {
  slide_number: number;
  headline: string;
  body: string;
  visual_direction: string;
  accessibility_notes: string;
  alt_text: string;
}

export interface CarouselOutline {
  title: string;
  format: CarouselLength;
  slides: CarouselSlide[];
  metadata: ContentMetadata;
  approval_status: "drafted";
}

const SLIDE_ROLES: Record<CarouselLength, string[]> = {
  5: ["hook", "problem", "insight", "practical_application", "cta"],
  7: ["hook", "problem", "why_it_happens", "insight", "framework", "practical_application", "cta"],
  10: [
    "hook",
    "problem",
    "scale_of_problem",
    "root_cause",
    "who_pays_the_cost",
    "insight",
    "framework",
    "practical_application",
    "business_case",
    "cta",
  ],
};

const ROLE_SCAFFOLDS: Record<string, { headline: string; body: string; visual: string }> = {
  hook: {
    headline: "[Strong opening statement — the uncomfortable truth or surprising cost. Short. No windup.]",
    body: "[1–2 sentences that earn the swipe. Name the specific problem. Do not summarize what you're about to cover.]",
    visual: "Bold text on clean background. High contrast (min 4.5:1). No decorative images that compete with headline.",
  },
  problem: {
    headline: "[Name the problem clearly. Not a question — a statement.]",
    body: "[2–3 sentences. Specific, not abstract. Who experiences this problem? What does it cost them?]",
    visual: "Text-heavy slide. Use supporting icon or minimal illustration. Avoid stock photography of 'frustration'.",
  },
  scale_of_problem: {
    headline: "[Statistic or scope statement. Use only sourced data — mark with [CITATION NEEDED] if unverified.]",
    body: "[Context for the number. Why does this scale matter? Who is in that number?]",
    visual: "Data visualization or bold statistic. Ensure contrast on numbers. Provide text equivalent in alt text.",
  },
  root_cause: {
    headline: "[Name the system or decision that created this problem. Not the symptom — the cause.]",
    body: "[2–3 sentences. What organizational, structural, or design decision produced this outcome?]",
    visual: "Simple diagram or text. Avoid complexity — one cause, named clearly.",
  },
  why_it_happens: {
    headline: "[Name the structural reason — not user error, system design.]",
    body: "[2–3 sentences. What incentives, decisions, or defaults maintain this problem?]",
    visual: "Clean text layout. Supporting icon if it clarifies — no decorative images.",
  },
  who_pays_the_cost: {
    headline: "[Name who bears the cost of this design failure.]",
    body: "[2–3 sentences. Specific communities, user types, or stakeholders. Center their experience, not organizational convenience.]",
    visual: "Text-primary. If using human illustration, use diverse representation. No tokenism.",
  },
  insight: {
    headline: "[The reframe. The thing most teams get wrong. The insight that changes the way the reader sees the problem.]",
    body: "[2–3 sentences. Practical, not academic. Something they can use.]",
    visual: "Pull quote treatment or contrast-heavy typographic layout. Alt text should contain full quote.",
  },
  framework: {
    headline: "[Name the framework or model in 5 words or fewer.]",
    body: "[3–5 bullet points or numbered steps. Plain language. Each item standalone-readable.]",
    visual: "Simple numbered or bulleted list. Strong heading hierarchy. Ensure list items are keyboard/screen-reader friendly in alt text.",
  },
  practical_application: {
    headline: "[What to do. Starts with a verb.]",
    body: "[2–3 specific, actionable steps. Not 'think about' — 'add to your brief', 'ask this question', 'run this audit'.]",
    visual: "Checklist or step layout. Visual hierarchy matches logical order. Checkboxes described in alt text.",
  },
  business_case: {
    headline: "[Connect to business value in plain language. Revenue, risk, or cost.]",
    body: "[2–3 sentences. The argument a product leader can bring to their next meeting.]",
    visual: "Text-primary. Consider icon representing the value category (cost, risk, revenue).",
  },
  cta: {
    headline: "[One clear ask. Download, subscribe, follow, or book.]",
    body: "[1 sentence. Specific benefit of taking the action. Not 'check out my content.']",
    visual: "High-contrast CTA button if applicable. Action text must meet 3:1 contrast against background. Alt text contains full CTA.",
  },
};

function buildSlide(
  slideNumber: number,
  role: string,
  brief: ContentBrief
): CarouselSlide {
  const scaffold = ROLE_SCAFFOLDS[role] ?? ROLE_SCAFFOLDS.insight;

  const altText = `Slide ${slideNumber} of carousel on: ${brief.core_thesis.slice(0, 100)}. [ALT TEXT: Write a description of the visual content + full text of any text on screen.]`;

  return {
    slide_number: slideNumber,
    headline: scaffold.headline,
    body: scaffold.body,
    visual_direction: scaffold.visual,
    accessibility_notes: `Minimum 4.5:1 contrast ratio for body text. 3:1 for large text and UI elements. Font size minimum 16px equivalent. No text in images without text alternative.`,
    alt_text: altText,
  };
}

export function generateCarousel(brief: ContentBrief, length: CarouselLength = 7): CarouselOutline {
  const roles = SLIDE_ROLES[length];
  const slides = roles.map((role, index) => buildSlide(index + 1, role, brief));

  const valueMapping = mapToValueCategories(brief.raw_idea, brief.content_pillar);
  const title = `[Carousel] ${brief.core_thesis.slice(0, 60)}`;

  const metadata = generateContentMetadata({
    content_title: title,
    channel: "carousel",
    funnel_stage: brief.funnel_stage,
    primary_audience: brief.target_audience,
    content_pillar: brief.content_pillar,
    value_mapping: valueMapping,
    cta: brief.cta,
    repurpose_options: ["linkedin_post", "newsletter", "video_script"],
  });

  return {
    title,
    format: length,
    slides,
    metadata,
    approval_status: "drafted",
  };
}

export function formatCarouselAsMarkdown(outline: CarouselOutline): string {
  const slidesContent = outline.slides
    .map(
      (slide) => `## Slide ${slide.slide_number}

**Headline:** ${slide.headline}

**Body:** ${slide.body}

**Visual Direction:** ${slide.visual_direction}

**Accessibility Notes:** ${slide.accessibility_notes}

**Alt Text:** ${slide.alt_text}
`
    )
    .join("\n---\n\n");

  return `# Carousel Outline — ${outline.format} Slides

**Title:** ${outline.title}

---

${slidesContent}

---

## Metadata
- **Pillar:** ${outline.metadata.content_pillar}
- **Funnel Stage:** ${outline.metadata.funnel_stage}
- **Audience:** ${outline.metadata.primary_audience}
- **Value Categories:** ${outline.metadata.value_categories.join(", ")}
- **Repurpose Options:** ${outline.metadata.repurpose_options.join(", ")}

---
*Status: DRAFTED — awaiting voice check, inclusion review, and Jamaal approval before publishing*
`;
}
