export type ContentPillar =
  | "inclusive_design_as_business_value"
  | "human_centered_ai"
  | "power_dynamics_in_product_design"
  | "accessibility_beyond_compliance"
  | "inclusive_tech_club_builds";

export type FunnelStage =
  | "awareness"
  | "education"
  | "conversion"
  | "nurture"
  | "offer"
  | "retention";

export type ValueCategory =
  | "revenue_protection"
  | "revenue_growth"
  | "cost_reduction"
  | "risk_reduction"
  | "operational_efficiency"
  | "trust_and_brand"
  | "community_power";

export type Channel =
  | "linkedin"
  | "newsletter"
  | "carousel"
  | "video"
  | "lead_magnet"
  | "email"
  | "website";

export type Audience =
  | "product_leaders"
  | "inclusive_design_practitioners"
  | "founders_and_operators"
  | "accessibility_advocates"
  | "potential_clients"
  | "general_linkedin"
  | "newsletter_subscribers";

export type ContentFormat =
  | "linkedin_post"
  | "newsletter"
  | "carousel"
  | "video_script"
  | "lead_magnet"
  | "nurture_email"
  | "content_brief";

export type ApprovalStatus =
  | "idea"
  | "briefed"
  | "drafted"
  | "reviewed"
  | "approved"
  | "published"
  | "repurposed";

export type ReviewStatus = "pass" | "revise" | "block";

export interface ContentMetadata {
  content_title: string;
  channel: Channel;
  funnel_stage: FunnelStage;
  primary_audience: Audience;
  content_pillar: ContentPillar;
  value_categories: ValueCategory[];
  cta: string;
  repurpose_options: ContentFormat[];
  approval_status: ApprovalStatus;
}

export interface ContentBrief {
  raw_idea: string;
  core_thesis: string;
  target_audience: Audience;
  content_pillar: ContentPillar;
  funnel_stage: FunnelStage;
  value_categories: ValueCategory[];
  power_dynamics_angle: string;
  accessibility_inclusion_angle: string;
  recommended_formats: ContentFormat[];
  cta: string;
  claims_needing_citation: string[];
  risks: string[];
  approval_status: ApprovalStatus;
}

export interface VoiceCheckResult {
  score: number;
  banned_phrases_found: string[];
  weak_hooks: string[];
  vague_claims: string[];
  missing_systems_thinking: boolean;
  rewrite_suggestions: string[];
  verdict: "pass" | "revise";
}

export interface InclusionReviewResult {
  status: ReviewStatus;
  shallow_inclusion_flags: string[];
  power_dynamics_gaps: string[];
  accessibility_gaps: string[];
  harmful_framing_flags: string[];
  unsupported_claim_flags: string[];
  overconfident_ai_flags: string[];
  recommended_edits: string[];
}

export interface CalendarEntry {
  id: string;
  date: string;
  title: string;
  channel: Channel;
  content_pillar: ContentPillar;
  funnel_stage: FunnelStage;
  cta: string;
  status: ApprovalStatus;
  repurpose_links: string[];
  notes: string;
}

export interface CrmExportRow {
  content_title: string;
  audience_segment: Audience;
  funnel_stage: FunnelStage;
  cta: string;
  lead_magnet: string;
  email_sequence: string;
  value_category: ValueCategory;
}
