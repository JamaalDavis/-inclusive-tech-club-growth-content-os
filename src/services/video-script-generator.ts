import type { ContentBrief, ContentMetadata } from "../types.js";
import { generateContentMetadata } from "../domain/value-map/value-map-engine.js";
import { mapToValueCategories } from "../domain/value-map/value-map-engine.js";

export type VideoLength = 30 | 60 | 90;

export interface VideoSection {
  section: string;
  duration_seconds: number;
  narration: string;
  on_screen_text: string;
  scene_direction: string;
  accessibility_notes: string;
}

export interface VideoScript {
  title: string;
  total_duration: VideoLength;
  hook: VideoSection;
  body: VideoSection[];
  cta: VideoSection;
  caption_guidance: string;
  metadata: ContentMetadata;
  approval_status: "drafted";
}

const TIMING: Record<VideoLength, { hook: number; body_total: number; cta: number }> = {
  30: { hook: 5, body_total: 20, cta: 5 },
  60: { hook: 8, body_total: 44, cta: 8 },
  90: { hook: 10, body_total: 68, cta: 12 },
};

const BODY_SECTIONS: Record<VideoLength, string[]> = {
  30: ["core_insight"],
  60: ["problem", "insight", "takeaway"],
  90: ["problem", "why_it_happens", "insight", "practical_application"],
};

const SECTION_NARRATION_SCAFFOLDS: Record<string, string> = {
  hook: `[Start mid-thought or mid-scene. No "Hey everyone." No "Today I want to talk about." Drop into the uncomfortable truth or surprising cost. One sentence that makes the viewer feel seen or challenged.]`,
  problem: `[Name the specific problem in plain language. What breaks? Who gets excluded? What does it cost? 2–3 short sentences. Speaking pace for LinkedIn video: ~2.5 words per second.]`,
  why_it_happens: `[Name the structural cause. Not "teams don't care enough." What incentive, default, or decision created this? 2–3 sentences.]`,
  core_insight: `[The one reframe. The insight that changes how the viewer sees this problem. State it directly, then let it land. Don't rush to the next point.]`,
  insight: `[The reframe. State it directly. Give the viewer a beat to process before moving forward.]`,
  practical_application: `[One thing they can do. Starts with a verb. "Next time you're reviewing a design... ask this." Specific, not generic.]`,
  takeaway: `[Compress the insight to its most useful form. "The rule of thumb here is..." or "The question to ask is..." One sentence they will remember.]`,
};

const SECTION_ON_SCREEN_TEXT: Record<string, string> = {
  hook: `[On-screen text: Pull out the key claim. 5–7 words max. High contrast against background.]`,
  problem: `[On-screen text: Name of the problem or the cost. E.g. "This costs you customers." or "Here's what breaks."]`,
  why_it_happens: `[On-screen text: Root cause in 5 words. E.g. "Design defaults exclude by design."]`,
  core_insight: `[On-screen text: The insight statement. If it fits on screen in 8 words, use it verbatim.]`,
  insight: `[On-screen text: Reframe in 6–8 words.]`,
  practical_application: `[On-screen text: The action. E.g. "Ask: who does this exclude by default?"]`,
  takeaway: `[On-screen text: The takeaway sentence in full.]`,
};

function buildSection(
  sectionName: string,
  durationSeconds: number
): VideoSection {
  return {
    section: sectionName,
    duration_seconds: durationSeconds,
    narration:
      SECTION_NARRATION_SCAFFOLDS[sectionName] ??
      `[Narration for ${sectionName} section — approximately ${durationSeconds} seconds / ${Math.round(durationSeconds * 2.5)} words]`,
    on_screen_text:
      SECTION_ON_SCREEN_TEXT[sectionName] ??
      `[On-screen text for ${sectionName}]`,
    scene_direction: `[Scene direction: talking head / screen share / B-roll / text animation. Keep background uncluttered. Consistent lighting. Face visible for lip-reading accessibility.]`,
    accessibility_notes: `Captions required. On-screen text must meet 4.5:1 contrast. Avoid flashing content (max 3 flashes/second). If using background music, keep it under 20% volume.`,
  };
}

export function generateVideoScript(brief: ContentBrief, length: VideoLength = 60): VideoScript {
  const timing = TIMING[length];
  const bodySectionNames = BODY_SECTIONS[length];

  const bodyDurationPerSection = Math.floor(timing.body_total / bodySectionNames.length);

  const hook = buildSection("hook", timing.hook);
  const body = bodySectionNames.map((name) => buildSection(name, bodyDurationPerSection));
  const ctaSection: VideoSection = {
    section: "cta",
    duration_seconds: timing.cta,
    narration: `[CTA narration: ${brief.cta}. One sentence. Specific. What do they get by taking this action?]`,
    on_screen_text: `[On-screen CTA: "${brief.cta}" — or shortened version. Include link or handle.]`,
    scene_direction: `[CTA card or text overlay. High contrast. Link visible on screen. Mention in audio for audio-only viewers.]`,
    accessibility_notes: `CTA must be spoken aloud in narration AND displayed on screen. Link text must be descriptive, not "click here."`,
  };

  const captionGuidance = `
Caption requirements for this video:
- Auto-captions must be reviewed and corrected before publishing
- Caption font: minimum 22px, high contrast (white text / black outline or dark background)
- Caption accuracy target: 99%+ (not auto-caption quality)
- Speaker identified in captions if multiple speakers
- Non-speech sounds described: [applause], [music], [sound effect]
- Caption file format: SRT preferred for LinkedIn
`.trim();

  const valueMapping = mapToValueCategories(brief.raw_idea, brief.content_pillar);
  const title = `[${length}s Video] ${brief.core_thesis.slice(0, 60)}`;

  const metadata = generateContentMetadata({
    content_title: title,
    channel: "video",
    funnel_stage: brief.funnel_stage,
    primary_audience: brief.target_audience,
    content_pillar: brief.content_pillar,
    value_mapping: valueMapping,
    cta: brief.cta,
    repurpose_options: ["linkedin_post", "carousel", "newsletter"],
  });

  return {
    title,
    total_duration: length,
    hook,
    body,
    cta: ctaSection,
    caption_guidance: captionGuidance,
    metadata,
    approval_status: "drafted",
  };
}

export function formatVideoScriptAsMarkdown(script: VideoScript): string {
  function formatSection(section: VideoSection): string {
    return `### ${section.section.replace(/_/g, " ").toUpperCase()} (${section.duration_seconds}s)

**Narration:**
${section.narration}

**On-Screen Text:**
${section.on_screen_text}

**Scene Direction:**
${section.scene_direction}

**Accessibility Notes:**
${section.accessibility_notes}
`;
  }

  const allSections = [script.hook, ...script.body, script.cta]
    .map(formatSection)
    .join("\n---\n\n");

  return `# Video Script — ${script.total_duration}s

**Title:** ${script.title}

---

${allSections}

---

## Caption Guidance
${script.caption_guidance}

---

## Metadata
- **Pillar:** ${script.metadata.content_pillar}
- **Funnel Stage:** ${script.metadata.funnel_stage}
- **Audience:** ${script.metadata.primary_audience}
- **Value Categories:** ${script.metadata.value_categories.join(", ")}
- **Repurpose Options:** ${script.metadata.repurpose_options.join(", ")}

---
*Status: DRAFTED — awaiting voice check, inclusion review, and Jamaal approval before filming*
`;
}
