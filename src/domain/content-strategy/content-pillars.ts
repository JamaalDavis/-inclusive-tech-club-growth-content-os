import type {
  ContentPillar,
  Channel,
  FunnelStage,
  Audience,
  ContentFormat,
} from "../../types.js";

export interface PillarDefinition {
  id: ContentPillar;
  name: string;
  core_argument: string;
  target_audiences: Audience[];
  example_angles: string[];
  recommended_channels: Channel[];
  funnel_stages: FunnelStage[];
  cta_types: string[];
  keywords: string[];
}

export const CONTENT_PILLARS: Record<ContentPillar, PillarDefinition> = {
  inclusive_design_as_business_value: {
    id: "inclusive_design_as_business_value",
    name: "Inclusive Design as Business Value",
    core_argument:
      "Accessibility and inclusive design are revenue protection, risk reduction, and market expansion. Excluding people has a measurable business cost.",
    target_audiences: ["product_leaders", "founders_and_operators", "potential_clients"],
    example_angles: [
      "Accessibility failures as revenue leaks",
      "The cost of inaccessible checkout flows",
      "How bad design creates support ticket debt",
      "Inclusion as competitive differentiation",
      "Disabled consumers as underserved market",
      "Legal and reputational risk from inaccessible products",
    ],
    recommended_channels: ["linkedin", "newsletter", "lead_magnet"],
    funnel_stages: ["awareness", "education", "conversion"],
    cta_types: [
      "Download the Inclusive Design Value Map",
      "Book a workshop",
      "Subscribe to the newsletter",
    ],
    keywords: [
      "revenue",
      "business value",
      "conversion",
      "ROI",
      "cost",
      "risk",
      "market",
      "abandoned cart",
      "churn",
      "support tickets",
      "legal",
      "compliance",
      "competitive",
      "profit",
      "loss",
    ],
  },

  human_centered_ai: {
    id: "human_centered_ai",
    name: "Human-Centered AI",
    core_argument:
      "AI is not neutral. It encodes the biases of its builders. The question is not whether AI can move faster — it is who gets harmed when it moves fast without accountability.",
    target_audiences: ["product_leaders", "inclusive_design_practitioners", "founders_and_operators"],
    example_angles: [
      "AI bias in hiring, healthcare, and financial products",
      "Agentic workflows and the erosion of human oversight",
      "AI tools that promise accessibility but deliver theater",
      "Human-in-the-loop design as a structural requirement",
      "Inclusive AI prototyping practices",
      "AI governance as inclusive design",
    ],
    recommended_channels: ["linkedin", "newsletter", "carousel", "video"],
    funnel_stages: ["awareness", "education"],
    cta_types: [
      "Subscribe to newsletter",
      "Download AI governance framework",
      "Workshop inquiry",
    ],
    keywords: [
      "AI",
      "artificial intelligence",
      "machine learning",
      "algorithm",
      "bias",
      "automation",
      "agentic",
      "LLM",
      "model",
      "ChatGPT",
      "governance",
      "accountability",
      "oversight",
      "human-in-the-loop",
    ],
  },

  power_dynamics_in_product_design: {
    id: "power_dynamics_in_product_design",
    name: "Power Dynamics in Product Design",
    core_argument:
      "Every product encodes decisions about who matters and whose needs count. These are political decisions made under the cover of UX and business requirements.",
    target_audiences: [
      "inclusive_design_practitioners",
      "product_leaders",
      "accessibility_advocates",
    ],
    example_angles: [
      "Who defines the default user and what that means",
      "The invisible labor required of users when design fails them",
      "Surveillance features packaged as personalization",
      "Design decisions as policy decisions",
      "Who gets to name problems in a product organization",
    ],
    recommended_channels: ["linkedin", "newsletter", "carousel"],
    funnel_stages: ["awareness", "education", "nurture"],
    cta_types: ["Subscribe to newsletter", "Join the community", "Share this post"],
    keywords: [
      "power",
      "equity",
      "politics",
      "privilege",
      "default user",
      "exclusion",
      "marginalization",
      "surveillance",
      "labor",
      "invisible",
      "policy",
      "structural",
      "systemic",
      "oppression",
    ],
  },

  accessibility_beyond_compliance: {
    id: "accessibility_beyond_compliance",
    name: "Accessibility Beyond Compliance",
    core_argument:
      "WCAG is the floor, not the ceiling. Cognitive accessibility, plain language, neurodiversity, and multimodal interaction are all part of the real work.",
    target_audiences: [
      "accessibility_advocates",
      "inclusive_design_practitioners",
      "product_leaders",
    ],
    example_angles: [
      "Cognitive accessibility as the next frontier",
      "Plain language as a design discipline",
      "Neurodiversity and the limits of audit-based approaches",
      "Assistive technology as a design constraint, not an afterthought",
      "The gap between WCAG conformance and actual usability",
    ],
    recommended_channels: ["linkedin", "newsletter", "carousel", "video"],
    funnel_stages: ["education", "nurture", "conversion"],
    cta_types: [
      "Download accessibility checklist",
      "Book workshop",
      "Subscribe to newsletter",
    ],
    keywords: [
      "WCAG",
      "accessibility",
      "a11y",
      "screen reader",
      "keyboard",
      "cognitive",
      "neurodiversity",
      "ADHD",
      "autism",
      "dyslexia",
      "plain language",
      "caption",
      "alt text",
      "assistive technology",
      "disability",
    ],
  },

  inclusive_tech_club_builds: {
    id: "inclusive_tech_club_builds",
    name: "Inclusive Tech Club Builds",
    core_argument:
      "Inclusive Tech Club is not just content. We build tools, frameworks, and systems that make inclusive design operational.",
    target_audiences: [
      "inclusive_design_practitioners",
      "potential_clients",
      "newsletter_subscribers",
    ],
    example_angles: [
      "Launching a new framework or canvas",
      "Behind-the-scenes on how the content OS works",
      "A new prompt kit for AI-assisted inclusive design",
      "Case study applying frameworks to a real problem",
      "Community highlights and member work",
    ],
    recommended_channels: ["linkedin", "newsletter", "lead_magnet"],
    funnel_stages: ["conversion", "offer", "retention"],
    cta_types: ["Download the tool", "Join the community", "Work with us"],
    keywords: [
      "framework",
      "canvas",
      "template",
      "toolkit",
      "tool",
      "build",
      "system",
      "process",
      "methodology",
      "prompt",
      "checklist",
      "guide",
      "resource",
    ],
  },
};

export function recommendPillar(rawIdea: string): PillarDefinition[] {
  const idea = rawIdea.toLowerCase();
  const scores: Array<{ pillar: PillarDefinition; score: number }> = [];

  for (const pillar of Object.values(CONTENT_PILLARS)) {
    const score = pillar.keywords.filter((kw) => idea.includes(kw)).length;
    scores.push({ pillar, score });
  }

  scores.sort((a, b) => b.score - a.score);

  const topScore = scores[0].score;
  if (topScore === 0) {
    return [CONTENT_PILLARS.inclusive_design_as_business_value];
  }

  return scores.filter((s) => s.score > 0).map((s) => s.pillar);
}

export function getPillarById(id: ContentPillar): PillarDefinition {
  return CONTENT_PILLARS[id];
}

export function getRecommendedFormats(pillar: ContentPillar): ContentFormat[] {
  const formatMap: Record<ContentPillar, ContentFormat[]> = {
    inclusive_design_as_business_value: [
      "linkedin_post",
      "newsletter",
      "lead_magnet",
      "content_brief",
    ],
    human_centered_ai: ["linkedin_post", "newsletter", "carousel", "video_script"],
    power_dynamics_in_product_design: ["linkedin_post", "newsletter", "carousel"],
    accessibility_beyond_compliance: [
      "linkedin_post",
      "newsletter",
      "carousel",
      "video_script",
      "lead_magnet",
    ],
    inclusive_tech_club_builds: ["linkedin_post", "newsletter", "lead_magnet", "carousel"],
  };
  return formatMap[pillar];
}
