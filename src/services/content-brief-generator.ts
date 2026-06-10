import type { ContentBrief, Audience, ContentPillar, FunnelStage, ValueCategory, ContentFormat } from "../types.js";
import { recommendPillar } from "../domain/content-strategy/content-pillars.js";
import { classifyFunnelStage } from "../domain/growth-funnel/funnel-classifier.js";
import { mapToValueCategories } from "../domain/value-map/value-map-engine.js";
import { recommendAudience } from "../domain/audience-map/audience-map.js";

export interface BriefInput {
  raw_idea: string;
  override_pillar?: ContentPillar;
  override_audience?: Audience;
  override_funnel_stage?: FunnelStage;
}

const POWER_DYNAMICS_PROMPTS: Record<ContentPillar, string> = {
  inclusive_design_as_business_value:
    "Who currently benefits from the inaccessible design? Who pays the cost? What organizational incentives maintain the status quo?",
  human_centered_ai:
    "Who built this AI system and whose priorities does it optimize for? Who has no say in how it operates? Who is harmed when it fails?",
  power_dynamics_in_product_design:
    "Who gets to define the 'default user' here? What assumptions are baked in? Who was not in the room when these decisions were made?",
  accessibility_beyond_compliance:
    "Who does WCAG compliance actually protect — users or organizations? What happens when the audit passes but disabled users still can't use the product?",
  inclusive_tech_club_builds:
    "Who is this tool built for? Who might it exclude? What assumptions does it make about the practitioner using it?",
};

const INCLUSION_ANGLE_PROMPTS: Record<ContentPillar, string> = {
  inclusive_design_as_business_value:
    "Which disability communities, marginalized groups, or underserved users are directly affected by this design failure? What does inclusion look like beyond the minimum?",
  human_centered_ai:
    "Which communities are most at risk from algorithmic bias here? Are there intersectional harms (disability + race, gender + class) that should be named?",
  power_dynamics_in_product_design:
    "Who is doing invisible labor to work around this design failure? Is the framing centering organizational convenience or human dignity?",
  accessibility_beyond_compliance:
    "Beyond WCAG, what cognitive, sensory, or situational barriers exist? Is neurodiversity represented in the framing?",
  inclusive_tech_club_builds:
    "Is the tool itself accessible? Does it work for the practitioners it claims to serve, or does it assume a narrow default user?",
};

function extractClaimsNeedingCitation(rawIdea: string): string[] {
  const claims: string[] = [];
  const percentPattern = /\d+%/g;
  const statPatterns = [
    /according to/i,
    /studies show/i,
    /research (shows|suggests|indicates|found)/i,
    /\d+ (million|billion) (people|users|dollars)/i,
    /\d+ out of \d+/i,
    /majority of/i,
    /most companies/i,
  ];

  if (percentPattern.test(rawIdea)) {
    claims.push("Percentage statistics require citation.");
  }

  for (const pattern of statPatterns) {
    if (pattern.test(rawIdea)) {
      claims.push(`Claim pattern detected: "${rawIdea.match(pattern)?.[0]}". Needs source.`);
    }
  }

  return claims;
}

function extractRisks(rawIdea: string, pillar: ContentPillar): string[] {
  const risks: string[] = [];

  if (rawIdea.toLowerCase().includes("always") || rawIdea.toLowerCase().includes("never")) {
    risks.push('Absolute language ("always"/"never") detected. Review for accuracy.');
  }

  if (rawIdea.toLowerCase().includes("all companies") || rawIdea.toLowerCase().includes("every organization")) {
    risks.push('Overgeneralization detected ("all companies"/"every organization"). Add nuance or qualification.');
  }

  const pillarRisks: Record<ContentPillar, string> = {
    inclusive_design_as_business_value:
      "Ensure business case framing does not erase the human stakes. Revenue argument should complement, not replace, equity argument.",
    human_centered_ai:
      "AI claims move fast. Verify any specific tools, companies, or capabilities referenced are current and accurately described.",
    power_dynamics_in_product_design:
      "Be specific about which power dynamics you're naming. Vague systemic critique can feel like performance.",
    accessibility_beyond_compliance:
      "Avoid speaking for disabled communities. Center their perspectives, not organizational interpretations of their needs.",
    inclusive_tech_club_builds:
      "Ensure any tool or framework referenced is real, tested, and available. Do not overpromise capabilities.",
  };

  risks.push(pillarRisks[pillar]);

  return risks;
}

export function generateContentBrief(input: BriefInput): ContentBrief {
  const { raw_idea, override_pillar, override_audience, override_funnel_stage } = input;

  const recommendedPillars = recommendPillar(raw_idea);
  const pillar = override_pillar ?? recommendedPillars[0].id;

  const funnelClassification = classifyFunnelStage(raw_idea);
  const funnel_stage = override_funnel_stage ?? funnelClassification.primary_stage;

  const audience = override_audience ?? recommendAudience(raw_idea, pillar);

  const valueMapping = mapToValueCategories(raw_idea, pillar);
  const value_categories: ValueCategory[] = [
    ...valueMapping.primary_categories,
    ...valueMapping.supporting_categories,
  ];

  const formats: ContentFormat[] = recommendedPillars[0].recommended_channels.map((ch) => {
    const map: Record<string, ContentFormat> = {
      linkedin: "linkedin_post",
      newsletter: "newsletter",
      carousel: "carousel",
      video: "video_script",
      lead_magnet: "lead_magnet",
      email: "nurture_email",
    };
    return map[ch] ?? "linkedin_post";
  });

  const cta = recommendedPillars[0].cta_types[0];

  return {
    raw_idea,
    core_thesis: `[TO FILL: Summarize the single most important insight from this idea in one sentence that would make a product leader stop and think.]`,
    target_audience: audience,
    content_pillar: pillar,
    funnel_stage,
    value_categories,
    power_dynamics_angle: POWER_DYNAMICS_PROMPTS[pillar],
    accessibility_inclusion_angle: INCLUSION_ANGLE_PROMPTS[pillar],
    recommended_formats: formats,
    cta,
    claims_needing_citation: extractClaimsNeedingCitation(raw_idea),
    risks: extractRisks(raw_idea, pillar),
    approval_status: "briefed",
  };
}

export function formatBriefAsMarkdown(brief: ContentBrief): string {
  const citationBlock =
    brief.claims_needing_citation.length > 0
      ? brief.claims_needing_citation.map((c) => `- ${c}`).join("\n")
      : "- None identified";

  const riskBlock = brief.risks.map((r) => `- ${r}`).join("\n");

  return `# Content Brief

## Raw Idea
${brief.raw_idea}

## Core Thesis
${brief.core_thesis}

## Target Audience
${brief.target_audience}

## Content Pillar
${brief.content_pillar}

## Funnel Stage
${brief.funnel_stage}

## Business Value Categories
${brief.value_categories.map((v) => `- ${v}`).join("\n")}

## Power Dynamics Angle
${brief.power_dynamics_angle}

## Accessibility / Inclusion Angle
${brief.accessibility_inclusion_angle}

## Recommended Formats
${brief.recommended_formats.map((f) => `- ${f}`).join("\n")}

## CTA
${brief.cta}

## Claims Needing Citation
${citationBlock}

## Risks
${riskBlock}

---
*Status: ${brief.approval_status} — awaiting Jamaal review*
`;
}
