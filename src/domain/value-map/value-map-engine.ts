import type {
  ValueCategory,
  ContentPillar,
  FunnelStage,
  Audience,
  Channel,
  ContentFormat,
  ContentMetadata,
  ApprovalStatus,
} from "../../types.js";

export interface ValueMapping {
  primary_categories: ValueCategory[];
  supporting_categories: ValueCategory[];
  business_case_summary: string;
  keywords_matched: string[];
}

const VALUE_KEYWORDS: Record<ValueCategory, string[]> = {
  revenue_protection: [
    "abandoned cart",
    "lost revenue",
    "checkout",
    "conversion rate",
    "churn",
    "retention",
    "existing customers",
    "protect revenue",
    "prevent loss",
    "leaking",
  ],
  revenue_growth: [
    "new market",
    "market expansion",
    "underserved",
    "growth",
    "acquisition",
    "reach more",
    "new customers",
    "expand",
    "competitive advantage",
    "differentiation",
  ],
  cost_reduction: [
    "support tickets",
    "support cost",
    "rework",
    "technical debt",
    "expensive to fix",
    "retroactive",
    "cheaper to build",
    "reduce cost",
    "efficiency",
    "waste",
  ],
  risk_reduction: [
    "legal",
    "lawsuit",
    "ADA",
    "WCAG",
    "compliance",
    "liability",
    "reputational",
    "PR risk",
    "harm",
    "audit",
    "regulation",
  ],
  operational_efficiency: [
    "process",
    "workflow",
    "faster",
    "streamline",
    "automate",
    "scale",
    "repeatable",
    "systematic",
    "operations",
    "pipeline",
  ],
  trust_and_brand: [
    "trust",
    "brand",
    "reputation",
    "credibility",
    "authority",
    "loyalty",
    "perception",
    "values",
    "public",
    "signal",
  ],
  community_power: [
    "community",
    "belonging",
    "advocates",
    "referral",
    "word of mouth",
    "network",
    "collective",
    "movement",
    "members",
    "practitioners",
  ],
};

const PILLAR_DEFAULT_VALUES: Record<ContentPillar, ValueCategory[]> = {
  inclusive_design_as_business_value: [
    "revenue_protection",
    "risk_reduction",
    "trust_and_brand",
  ],
  human_centered_ai: ["risk_reduction", "trust_and_brand", "operational_efficiency"],
  power_dynamics_in_product_design: ["trust_and_brand", "community_power", "risk_reduction"],
  accessibility_beyond_compliance: ["risk_reduction", "revenue_protection", "trust_and_brand"],
  inclusive_tech_club_builds: ["community_power", "trust_and_brand", "operational_efficiency"],
};

export function mapToValueCategories(
  rawContent: string,
  pillar: ContentPillar
): ValueMapping {
  const content = rawContent.toLowerCase();
  const matched: Record<ValueCategory, number> = {
    revenue_protection: 0,
    revenue_growth: 0,
    cost_reduction: 0,
    risk_reduction: 0,
    operational_efficiency: 0,
    trust_and_brand: 0,
    community_power: 0,
  };

  const allMatched: string[] = [];

  for (const [category, keywords] of Object.entries(VALUE_KEYWORDS)) {
    for (const kw of keywords) {
      if (content.includes(kw)) {
        matched[category as ValueCategory]++;
        allMatched.push(kw);
      }
    }
  }

  const sortedCategories = (Object.entries(matched) as [ValueCategory, number][])
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0)
    .map(([cat]) => cat);

  const pillarDefaults = PILLAR_DEFAULT_VALUES[pillar];

  const primary =
    sortedCategories.length > 0
      ? sortedCategories.slice(0, 2)
      : pillarDefaults.slice(0, 2);

  const supporting = [
    ...sortedCategories.slice(2),
    ...pillarDefaults.filter((d) => !primary.includes(d)),
  ].slice(0, 3);

  return {
    primary_categories: primary,
    supporting_categories: supporting,
    business_case_summary: buildBusinessCaseSummary(primary),
    keywords_matched: allMatched,
  };
}

function buildBusinessCaseSummary(categories: ValueCategory[]): string {
  const summaries: Record<ValueCategory, string> = {
    revenue_protection:
      "This content makes the case that inaccessible or exclusionary design directly costs revenue.",
    revenue_growth:
      "This content frames inclusive design as a path to reaching underserved markets and growing the business.",
    cost_reduction:
      "This content shows how building inclusively from the start reduces expensive rework and support costs.",
    risk_reduction:
      "This content highlights the legal, reputational, and regulatory risks of inaccessible products.",
    operational_efficiency:
      "This content connects inclusive design practices to faster, more scalable operations.",
    trust_and_brand:
      "This content builds the case that inclusive design signals trustworthiness and brand integrity.",
    community_power:
      "This content reinforces the value of community, collective advocacy, and practitioner networks.",
  };

  return categories.map((c) => summaries[c]).join(" ");
}

export function generateContentMetadata(params: {
  content_title: string;
  channel: Channel;
  funnel_stage: FunnelStage;
  primary_audience: Audience;
  content_pillar: ContentPillar;
  value_mapping: ValueMapping;
  cta: string;
  repurpose_options: ContentFormat[];
}): ContentMetadata {
  return {
    content_title: params.content_title,
    channel: params.channel,
    funnel_stage: params.funnel_stage,
    primary_audience: params.primary_audience,
    content_pillar: params.content_pillar,
    value_categories: [
      ...params.value_mapping.primary_categories,
      ...params.value_mapping.supporting_categories,
    ],
    cta: params.cta,
    repurpose_options: params.repurpose_options,
    approval_status: "drafted" as ApprovalStatus,
  };
}
