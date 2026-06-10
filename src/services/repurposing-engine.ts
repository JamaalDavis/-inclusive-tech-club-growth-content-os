import type {
  ContentFormat,
  ContentPillar,
  FunnelStage,
  Audience,
  ValueCategory,
  Channel,
} from "../types.js";

export type SourceAssetType =
  | "research_note"
  | "transcript"
  | "linkedin_post"
  | "newsletter"
  | "messy_notes"
  | "workshop_idea"
  | "article";

export interface SourceAsset {
  type: SourceAssetType;
  title: string;
  content: string;
  content_pillar: ContentPillar;
  funnel_stage: FunnelStage;
  primary_audience: Audience;
  value_categories: ValueCategory[];
}

export interface RepurposeRecommendation {
  format: ContentFormat;
  channel: Channel;
  rationale: string;
  adaptation_notes: string;
  estimated_effort: "low" | "medium" | "high";
  preserves_pillar: boolean;
  preserves_audience: boolean;
}

export interface RepurposeMap {
  source: SourceAsset;
  recommendations: RepurposeRecommendation[];
  primary_recommendation: RepurposeRecommendation;
}

const FORMAT_TO_CHANNEL: Record<ContentFormat, Channel> = {
  linkedin_post: "linkedin",
  newsletter: "newsletter",
  carousel: "carousel",
  video_script: "video",
  lead_magnet: "lead_magnet",
  nurture_email: "email",
  content_brief: "linkedin",
};

const SOURCE_REPURPOSE_MAP: Record<SourceAssetType, ContentFormat[]> = {
  research_note: [
    "content_brief",
    "linkedin_post",
    "newsletter",
    "carousel",
    "lead_magnet",
    "video_script",
  ],
  transcript: ["content_brief", "newsletter", "linkedin_post", "carousel", "video_script"],
  linkedin_post: ["newsletter", "carousel", "video_script", "nurture_email"],
  newsletter: ["linkedin_post", "carousel", "video_script", "lead_magnet", "nurture_email"],
  messy_notes: ["content_brief", "linkedin_post", "newsletter"],
  workshop_idea: ["lead_magnet", "newsletter", "carousel", "linkedin_post", "nurture_email"],
  article: ["content_brief", "linkedin_post", "newsletter", "carousel", "video_script"],
};

const ADAPTATION_NOTES: Record<string, string> = {
  research_note_to_linkedin_post:
    "Extract the single sharpest insight from the research. Strip jargon. Lead with the business or human cost. The post should feel like a practitioner sharing something from the field, not summarizing a paper.",

  research_note_to_newsletter:
    "The newsletter can hold the complexity the LinkedIn post can't. Preserve the systemic analysis, add practical application, and connect to business value in the second half.",

  research_note_to_carousel:
    "The carousel is visual argument, not visual summary. Turn the research into a clear point of view with 5–10 slides. One insight per slide. The framework slide is where the research becomes actionable.",

  research_note_to_lead_magnet:
    "A lead magnet from research should give the reader something they can use independently. Framework, checklist, canvas, or reference guide. Do not just repackage the research — distill what a practitioner needs to apply it.",

  transcript_to_newsletter:
    "Transcripts are raw and often redundant. Identify the 2–3 most substantive ideas. Build the newsletter around those. The conversational tone is a gift — preserve it, but edit for clarity and structure.",

  transcript_to_linkedin_post:
    "Find the single best line or insight from the transcript. That becomes the hook. Strip the rest. A post is not a summary — it is one idea, done well.",

  linkedin_post_to_newsletter:
    "The post was a signal. The newsletter is the analysis. Go further on the power dynamics, the systemic cause, and the practical application. Give subscribers something they couldn't get from the post.",

  linkedin_post_to_carousel:
    "Decompose the post into a visual argument. The hook becomes slide 1. Each key point becomes a slide. The CTA becomes the last slide. Add visual direction and alt text.",

  newsletter_to_linkedin_post:
    "Extract the sharpest single insight from the newsletter. This is not a summary — it is a teaser that gives real value and makes people want to read the full piece.",

  newsletter_to_lead_magnet:
    "If a newsletter section contains a framework or checklist, extract and expand it. A lead magnet should standalone — someone who never read the newsletter should find it immediately useful.",

  workshop_idea_to_lead_magnet:
    "The lead magnet is the workshop's free sample. What's the one exercise or framework that demonstrates the value of the full workshop? Give that away. It should make people want more.",

  messy_notes_to_content_brief:
    "Do not draft content from messy notes. Generate a brief first. The brief is the forcing function that separates the insight from the noise.",
};

function getAdaptationNotes(sourceType: SourceAssetType, format: ContentFormat): string {
  const key = `${sourceType}_to_${format}`;
  return (
    ADAPTATION_NOTES[key] ??
    `Adapt ${sourceType} to ${format} format. Preserve original content pillar, business value framing, and audience intent. Do not change the core argument — adapt the structure and depth to the new format.`
  );
}

function estimateEffort(sourceType: SourceAssetType, format: ContentFormat): "low" | "medium" | "high" {
  const lowEffort: Array<[SourceAssetType, ContentFormat]> = [
    ["linkedin_post", "newsletter"],
    ["newsletter", "linkedin_post"],
    ["newsletter", "nurture_email"],
  ];

  const highEffort: Array<[SourceAssetType, ContentFormat]> = [
    ["messy_notes", "lead_magnet"],
    ["research_note", "lead_magnet"],
    ["transcript", "lead_magnet"],
    ["workshop_idea", "lead_magnet"],
  ];

  if (lowEffort.some(([s, f]) => s === sourceType && f === format)) return "low";
  if (highEffort.some(([s, f]) => s === sourceType && f === format)) return "high";
  return "medium";
}

export function buildRepurposeMap(source: SourceAsset): RepurposeMap {
  const formats = SOURCE_REPURPOSE_MAP[source.type] ?? ["content_brief", "linkedin_post"];

  const recommendations: RepurposeRecommendation[] = formats.map((format) => ({
    format,
    channel: FORMAT_TO_CHANNEL[format],
    rationale: `${source.type} → ${format}: This format serves the ${source.funnel_stage} funnel stage and reaches ${source.primary_audience} on ${FORMAT_TO_CHANNEL[format]}.`,
    adaptation_notes: getAdaptationNotes(source.type, format),
    estimated_effort: estimateEffort(source.type, format),
    preserves_pillar: true,
    preserves_audience: true,
  }));

  const primary = recommendations[0];

  return {
    source,
    recommendations,
    primary_recommendation: primary,
  };
}

export function formatRepurposeMapAsMarkdown(map: RepurposeMap): string {
  const recs = map.recommendations
    .map(
      (r) => `### → ${r.format} (${r.channel})

**Effort:** ${r.estimated_effort}
**Rationale:** ${r.rationale}
**How to adapt:** ${r.adaptation_notes}
`
    )
    .join("\n");

  return `# Repurpose Map

## Source Asset
- **Type:** ${map.source.type}
- **Title:** ${map.source.title}
- **Pillar:** ${map.source.content_pillar}
- **Funnel Stage:** ${map.source.funnel_stage}
- **Audience:** ${map.source.primary_audience}

## Primary Recommendation
**→ ${map.primary_recommendation.format}**
${map.primary_recommendation.adaptation_notes}

---

## All Repurpose Options

${recs}

---
*Status: DRAFTED — review recommendations and confirm with Jamaal before producing derivative assets*
`;
}
