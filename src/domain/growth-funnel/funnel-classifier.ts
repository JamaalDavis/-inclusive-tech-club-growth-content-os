import type { FunnelStage, Channel, ContentFormat, Audience } from "../../types.js";

export interface FunnelStageDefinition {
  id: FunnelStage;
  name: string;
  goal: string;
  content_types: ContentFormat[];
  recommended_channels: Channel[];
  cta_strategy: string;
  success_metrics: string[];
  keywords: string[];
}

export interface FunnelClassification {
  primary_stage: FunnelStage;
  secondary_stage: FunnelStage | null;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  recommended_formats: ContentFormat[];
  cta_strategy: string;
}

export const FUNNEL_STAGES: Record<FunnelStage, FunnelStageDefinition> = {
  awareness: {
    id: "awareness",
    name: "Awareness",
    goal: "Reach new people who don't know Inclusive Tech Club yet",
    content_types: ["linkedin_post", "video_script"],
    recommended_channels: ["linkedin", "video"],
    cta_strategy: "Soft CTA — follow, share, or comment. No hard ask.",
    success_metrics: [
      "LinkedIn impressions",
      "Post reach",
      "New followers",
      "Comments from non-followers",
    ],
    keywords: [
      "problem",
      "did you know",
      "most teams",
      "unpopular opinion",
      "hot take",
      "nobody talks about",
      "the real reason",
      "what if",
      "surprising",
      "wrong",
    ],
  },

  education: {
    id: "education",
    name: "Education",
    goal: "Build trust by demonstrating expertise on inclusive design, AI, and power dynamics",
    content_types: ["newsletter", "carousel", "linkedin_post"],
    recommended_channels: ["newsletter", "linkedin", "carousel"],
    cta_strategy: "Subscribe to newsletter, save this post, or download a free resource.",
    success_metrics: [
      "Newsletter open rate",
      "Newsletter click rate",
      "Carousel saves",
      "Time on page",
    ],
    keywords: [
      "how to",
      "framework",
      "explain",
      "guide",
      "understand",
      "learn",
      "deep dive",
      "breakdown",
      "the truth about",
      "here's what",
      "let me show you",
    ],
  },

  conversion: {
    id: "conversion",
    name: "Conversion",
    goal: "Turn engaged audience into email subscribers or lead magnet downloaders",
    content_types: ["lead_magnet", "linkedin_post", "newsletter"],
    recommended_channels: ["linkedin", "newsletter", "lead_magnet"],
    cta_strategy:
      "Clear download CTA for a specific, high-value free resource. One action only.",
    success_metrics: [
      "Lead magnet downloads",
      "Email signups",
      "Landing page conversion rate",
      "CTA click-through rate",
    ],
    keywords: [
      "download",
      "free",
      "template",
      "checklist",
      "resource",
      "toolkit",
      "grab",
      "get",
      "access",
      "sign up",
    ],
  },

  nurture: {
    id: "nurture",
    name: "Nurture",
    goal: "Deepen relationship with subscribers through consistent, high-value content",
    content_types: ["nurture_email", "newsletter"],
    recommended_channels: ["email", "newsletter"],
    cta_strategy: "Reply to this email, share with someone, or explore more resources.",
    success_metrics: [
      "Email reply rate",
      "Click-through rate",
      "Unsubscribe rate (want it low)",
      "Forwarding rate",
    ],
    keywords: [
      "subscribers",
      "community",
      "deeper",
      "story",
      "case study",
      "behind the scenes",
      "reflection",
      "update",
      "this week",
    ],
  },

  offer: {
    id: "offer",
    name: "Offer",
    goal: "Generate revenue through workshops, consulting, courses, or memberships",
    content_types: ["nurture_email", "newsletter", "linkedin_post"],
    recommended_channels: ["email", "linkedin", "website"],
    cta_strategy:
      "Direct, specific offer with clear outcome. Book a call, register now, join the waitlist.",
    success_metrics: [
      "Discovery calls booked",
      "Workshop registrations",
      "Revenue generated",
      "Consultation inquiries",
    ],
    keywords: [
      "workshop",
      "course",
      "training",
      "consulting",
      "work with",
      "hire",
      "engage",
      "book",
      "register",
      "waitlist",
      "limited spots",
    ],
  },

  retention: {
    id: "retention",
    name: "Retention",
    goal: "Keep existing community members and clients engaged and growing",
    content_types: ["newsletter", "nurture_email"],
    recommended_channels: ["email", "newsletter"],
    cta_strategy: "Community participation, referral, or exclusive content access.",
    success_metrics: [
      "Community active members",
      "Renewal rate",
      "Referral rate",
      "Event attendance",
    ],
    keywords: [
      "members",
      "community",
      "exclusive",
      "insiders",
      "update",
      "milestone",
      "together",
      "growth",
      "renewal",
    ],
  },
};

export function classifyFunnelStage(rawIdea: string): FunnelClassification {
  const idea = rawIdea.toLowerCase();
  const scores: Array<{ stage: FunnelStageDefinition; score: number }> = [];

  for (const stage of Object.values(FUNNEL_STAGES)) {
    const score = stage.keywords.filter((kw) => idea.includes(kw)).length;
    scores.push({ stage, score });
  }

  scores.sort((a, b) => b.score - a.score);

  const topStage = scores[0];
  const secondStage = scores[1];

  const confidence: "high" | "medium" | "low" =
    topStage.score >= 3 ? "high" : topStage.score >= 1 ? "medium" : "low";

  const primary = topStage.score > 0 ? topStage.stage : FUNNEL_STAGES.awareness;
  const secondary =
    secondStage.score > 0 && secondStage.stage.id !== primary.id
      ? secondStage.stage
      : null;

  return {
    primary_stage: primary.id,
    secondary_stage: secondary ? secondary.id : null,
    confidence,
    reasoning:
      topStage.score === 0
        ? "No clear keyword signals found. Defaulting to awareness stage."
        : `Found ${topStage.score} keyword match(es) for ${primary.name} stage.`,
    recommended_formats: primary.content_types,
    cta_strategy: primary.cta_strategy,
  };
}

export function getFunnelStageById(id: FunnelStage): FunnelStageDefinition {
  return FUNNEL_STAGES[id];
}

export function getAudienceByFunnelStage(stage: FunnelStage): Audience[] {
  const audienceMap: Record<FunnelStage, Audience[]> = {
    awareness: ["general_linkedin", "product_leaders", "founders_and_operators"],
    education: ["product_leaders", "inclusive_design_practitioners", "accessibility_advocates"],
    conversion: [
      "product_leaders",
      "inclusive_design_practitioners",
      "founders_and_operators",
    ],
    nurture: ["newsletter_subscribers"],
    offer: ["newsletter_subscribers", "potential_clients"],
    retention: ["newsletter_subscribers"],
  };
  return audienceMap[stage];
}
