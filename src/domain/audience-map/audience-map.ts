import type { Audience, ContentPillar, FunnelStage, Channel } from "../../types.js";

export interface AudienceProfile {
  id: Audience;
  name: string;
  role_description: string;
  primary_pain_points: string[];
  what_they_need_from_content: string[];
  language_to_use: string[];
  language_to_avoid: string[];
  preferred_channels: Channel[];
  relevant_pillars: ContentPillar[];
  funnel_entry_stage: FunnelStage;
}

export const AUDIENCE_PROFILES: Record<Audience, AudienceProfile> = {
  product_leaders: {
    id: "product_leaders",
    name: "Product Leaders",
    role_description:
      "VPs of Product, CPOs, Directors of Product Management. They set priorities, approve roadmaps, and control budgets. They need to justify inclusion work up and across the organization.",
    primary_pain_points: [
      "Cannot get buy-in from leadership or engineering for accessibility work",
      "Don't know how to quantify the ROI of inclusive design",
      "Worried about legal exposure but don't know how serious the risk is",
      "Feel like inclusion work slows the team down",
      "Have had inclusion initiatives die after a reorg or leadership change",
    ],
    what_they_need_from_content: [
      "Business case arguments they can use in meetings",
      "Data and examples that translate inclusion to revenue or risk",
      "Frameworks they can hand to their teams",
      "Language that works with CFOs and board members",
    ],
    language_to_use: [
      "revenue protection",
      "conversion rate",
      "risk mitigation",
      "market expansion",
      "competitive differentiation",
      "legal exposure",
      "business case",
    ],
    language_to_avoid: [
      "it's the right thing to do",
      "everyone deserves",
      "moral obligation",
      "compliance checkbox",
    ],
    preferred_channels: ["linkedin", "newsletter"],
    relevant_pillars: [
      "inclusive_design_as_business_value",
      "human_centered_ai",
      "accessibility_beyond_compliance",
    ],
    funnel_entry_stage: "awareness",
  },

  inclusive_design_practitioners: {
    id: "inclusive_design_practitioners",
    name: "Inclusive Design Practitioners",
    role_description:
      "UX designers, service designers, product designers, accessibility specialists. They do the work. They want sharper frameworks and better language to advocate internally.",
    primary_pain_points: [
      "Doing inclusion work in an organization that doesn't fully value it",
      "Lack of frameworks that hold up under organizational pressure",
      "Burn out from being the only person in the room who cares",
      "Struggle to connect their work to metrics leadership tracks",
      "Want to go beyond WCAG compliance but don't know where to start",
    ],
    what_they_need_from_content: [
      "Practical frameworks and tools",
      "Language to use with stakeholders who aren't convinced",
      "Community with other practitioners doing the same work",
      "Validation that the hard parts are genuinely hard",
    ],
    language_to_use: [
      "practitioner",
      "framework",
      "in practice",
      "design decision",
      "real work",
      "organizational",
      "constraints",
    ],
    language_to_avoid: [
      "just do X",
      "it's simple",
      "there's no excuse",
      "just follow the guidelines",
    ],
    preferred_channels: ["linkedin", "newsletter", "carousel"],
    relevant_pillars: [
      "accessibility_beyond_compliance",
      "power_dynamics_in_product_design",
      "inclusive_tech_club_builds",
    ],
    funnel_entry_stage: "education",
  },

  founders_and_operators: {
    id: "founders_and_operators",
    name: "Founders and Operators",
    role_description:
      "Startup founders, solo operators, small team leads. Moving fast, building product, and trying to make inclusion part of how they work — not a bolt-on.",
    primary_pain_points: [
      "Moving fast and worried inclusion will slow them down",
      "Don't have a dedicated accessibility resource",
      "Want to do this right but don't know where to start",
      "Worried about legal risk but not sure how serious it is at their scale",
    ],
    what_they_need_from_content: [
      "Practical starting points that don't require a team of six",
      "How to think about inclusion as part of product strategy, not separate from it",
      "What the real risks are and how to prioritize",
    ],
    language_to_use: [
      "starting point",
      "first step",
      "founder",
      "small team",
      "without a specialist",
      "practical",
      "early stage",
    ],
    language_to_avoid: [
      "enterprise",
      "at scale",
      "mature organizations",
      "dedicated team",
      "full audit",
    ],
    preferred_channels: ["linkedin", "newsletter"],
    relevant_pillars: [
      "inclusive_design_as_business_value",
      "inclusive_tech_club_builds",
      "human_centered_ai",
    ],
    funnel_entry_stage: "awareness",
  },

  accessibility_advocates: {
    id: "accessibility_advocates",
    name: "Accessibility Advocates",
    role_description:
      "People with disabilities, disabled activists, accessibility consultants, and people who have personal stakes in this work. They want content that takes their experience seriously.",
    primary_pain_points: [
      "Tired of content that treats them as a use case rather than a full stakeholder",
      "Frustrated by organizations that perform accessibility without committing to it",
      "Want to see power dynamics named, not softened",
      "Looking for content that connects lived experience to systems change",
    ],
    what_they_need_from_content: [
      "Content that names power honestly",
      "Frameworks that center disabled people, not just organization convenience",
      "Community that understands the systemic nature of the problem",
      "Language that doesn't treat accessibility as charity",
    ],
    language_to_use: [
      "disabled people",
      "systemic",
      "power",
      "excluded",
      "stakeholder",
      "lived experience",
      "structural",
    ],
    language_to_avoid: [
      "special needs",
      "differently abled",
      "accessibility heroes",
      "for the disabled",
      "helping people with disabilities",
    ],
    preferred_channels: ["linkedin", "newsletter"],
    relevant_pillars: [
      "power_dynamics_in_product_design",
      "accessibility_beyond_compliance",
      "inclusive_tech_club_builds",
    ],
    funnel_entry_stage: "education",
  },

  potential_clients: {
    id: "potential_clients",
    name: "Potential Clients",
    role_description:
      "Organizations or individuals considering hiring Inclusive Tech Club for workshops, consulting, or advisory work. They need to see proof of expertise and fit.",
    primary_pain_points: [
      "Not sure if Inclusive Tech Club can solve their specific problem",
      "Need to make an internal case for bringing in outside expertise",
      "Comparing options and need differentiation",
    ],
    what_they_need_from_content: [
      "Clear proof of expertise",
      "Examples of problems solved",
      "A distinct point of view they can't get elsewhere",
      "Easy way to take the next step",
    ],
    language_to_use: [
      "case study",
      "results",
      "worked with",
      "helped teams",
      "book a conversation",
      "start here",
    ],
    language_to_avoid: ["thought leader", "guru", "ninja", "visionary"],
    preferred_channels: ["linkedin", "newsletter", "website"],
    relevant_pillars: [
      "inclusive_design_as_business_value",
      "inclusive_tech_club_builds",
      "human_centered_ai",
    ],
    funnel_entry_stage: "conversion",
  },

  general_linkedin: {
    id: "general_linkedin",
    name: "General LinkedIn Audience",
    role_description:
      "Broad LinkedIn network. Mixed roles, varying familiarity with inclusive design. Reached through viral, shareable, or debate-sparking content.",
    primary_pain_points: ["General curiosity", "Vague awareness that inclusion matters"],
    what_they_need_from_content: [
      "A hook that stops the scroll",
      "One clear idea they haven't heard framed this way before",
      "No jargon — needs to land without context",
    ],
    language_to_use: [
      "most companies",
      "here's the thing",
      "nobody talks about",
      "the real reason",
      "this costs money",
    ],
    language_to_avoid: ["WCAG 2.1 AA", "ARIA", "semantic HTML", "service design methodology"],
    preferred_channels: ["linkedin"],
    relevant_pillars: [
      "inclusive_design_as_business_value",
      "power_dynamics_in_product_design",
    ],
    funnel_entry_stage: "awareness",
  },

  newsletter_subscribers: {
    id: "newsletter_subscribers",
    name: "Newsletter Subscribers",
    role_description:
      "People who have opted in to a deeper relationship. They already trust Inclusive Tech Club and want more depth, nuance, and context.",
    primary_pain_points: [
      "Want deeper analysis than what LinkedIn allows",
      "Looking for frameworks they can actually use",
      "Want to feel part of a community of practice",
    ],
    what_they_need_from_content: [
      "Depth and nuance",
      "Behind-the-scenes thinking",
      "Resources and tools",
      "Clear connection to their work",
    ],
    language_to_use: [
      "as subscribers",
      "this week",
      "I've been thinking",
      "here's what I'm seeing",
      "for your work",
    ],
    language_to_avoid: ["click here", "limited time", "exclusive offer", "buy now"],
    preferred_channels: ["newsletter", "email"],
    relevant_pillars: [
      "inclusive_design_as_business_value",
      "human_centered_ai",
      "power_dynamics_in_product_design",
      "accessibility_beyond_compliance",
      "inclusive_tech_club_builds",
    ],
    funnel_entry_stage: "nurture",
  },
};

export function getAudienceProfile(audience: Audience): AudienceProfile {
  return AUDIENCE_PROFILES[audience];
}

export function recommendAudience(rawIdea: string, pillar: ContentPillar): Audience {
  const idea = rawIdea.toLowerCase();

  if (
    idea.includes("business case") ||
    idea.includes("roi") ||
    idea.includes("revenue") ||
    idea.includes("leadership")
  ) {
    return "product_leaders";
  }

  if (
    idea.includes("disabled") ||
    idea.includes("lived experience") ||
    idea.includes("power") ||
    idea.includes("systemic")
  ) {
    return "accessibility_advocates";
  }

  if (
    idea.includes("founder") ||
    idea.includes("startup") ||
    idea.includes("small team") ||
    idea.includes("early stage")
  ) {
    return "founders_and_operators";
  }

  if (
    idea.includes("framework") ||
    idea.includes("practitioner") ||
    idea.includes("designer") ||
    idea.includes("process")
  ) {
    return "inclusive_design_practitioners";
  }

  const pillarDefaultAudience: Record<ContentPillar, Audience> = {
    inclusive_design_as_business_value: "product_leaders",
    human_centered_ai: "product_leaders",
    power_dynamics_in_product_design: "accessibility_advocates",
    accessibility_beyond_compliance: "inclusive_design_practitioners",
    inclusive_tech_club_builds: "inclusive_design_practitioners",
  };

  return pillarDefaultAudience[pillar];
}
