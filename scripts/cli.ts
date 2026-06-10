/**
 * CLI interface to the ITC Content OS TypeScript services.
 * Used by .claude/skills and .claude/agents to invoke the rules engine.
 *
 * Usage:
 *   npx tsx scripts/cli.ts brief        "<raw idea>"
 *   npx tsx scripts/cli.ts linkedin     "<raw idea>" [short|medium|carousel_intro]
 *   npx tsx scripts/cli.ts newsletter   "<raw idea>"
 *   npx tsx scripts/cli.ts carousel     "<raw idea>" [5|7|10]
 *   npx tsx scripts/cli.ts video        "<raw idea>" [30|60|90]
 *   npx tsx scripts/cli.ts repurpose    "<title>" "<type>" "<pillar>" "<funnel>" "<audience>"
 *   npx tsx scripts/cli.ts voice        "<draft text>"
 *   npx tsx scripts/cli.ts inclusion    "<draft text>"
 *   npx tsx scripts/cli.ts calendar     add "<date>" "<title>" "<channel>" "<pillar>" "<funnel>" "<cta>"
 *   npx tsx scripts/cli.ts calendar     export [json|markdown]
 */

import { generateContentBrief, formatBriefAsMarkdown } from "../src/services/content-brief-generator.js";
import { generateLinkedInPost, formatLinkedInPostAsMarkdown } from "../src/services/linkedin-post-generator.js";
import { generateNewsletter, formatNewsletterAsMarkdown } from "../src/services/newsletter-generator.js";
import { generateCarousel, formatCarouselAsMarkdown } from "../src/services/carousel-generator.js";
import { generateVideoScript, formatVideoScriptAsMarkdown } from "../src/services/video-script-generator.js";
import { buildRepurposeMap, formatRepurposeMapAsMarkdown } from "../src/services/repurposing-engine.js";
import { checkVoice, formatVoiceCheckAsMarkdown } from "../src/services/voice-checker.js";
import { reviewForInclusion, formatInclusionReviewAsMarkdown } from "../src/services/inclusion-reviewer.js";
import {
  createCalendarEntry,
  exportCalendarAsJSON,
  exportCalendarAsMarkdown,
} from "../src/services/content-calendar.js";
import type {
  ContentPillar,
  FunnelStage,
  Channel,
  Audience,
} from "../src/types.js";
import type { LinkedInFormat } from "../src/services/linkedin-post-generator.js";
import type { CarouselLength } from "../src/services/carousel-generator.js";
import type { VideoLength } from "../src/services/video-script-generator.js";
import type { SourceAssetType } from "../src/services/repurposing-engine.js";

const [, , command, ...args] = process.argv;

function require_arg(value: string | undefined, name: string): string {
  if (!value) {
    console.error(`Missing required argument: ${name}`);
    process.exit(1);
  }
  return value;
}

switch (command) {
  case "brief": {
    const raw_idea = require_arg(args[0], "raw idea");
    const brief = generateContentBrief({ raw_idea });
    console.log(formatBriefAsMarkdown(brief));
    break;
  }

  case "linkedin": {
    const raw_idea = require_arg(args[0], "raw idea");
    const format = (args[1] ?? "medium") as LinkedInFormat;
    const brief = generateContentBrief({ raw_idea });
    const post = generateLinkedInPost(brief, format);
    console.log(formatLinkedInPostAsMarkdown(post, brief));
    break;
  }

  case "newsletter": {
    const raw_idea = require_arg(args[0], "raw idea");
    const brief = generateContentBrief({ raw_idea });
    const draft = generateNewsletter(brief);
    console.log(formatNewsletterAsMarkdown(draft));
    break;
  }

  case "carousel": {
    const raw_idea = require_arg(args[0], "raw idea");
    const length = parseInt(args[1] ?? "7") as CarouselLength;
    const brief = generateContentBrief({ raw_idea });
    const outline = generateCarousel(brief, length);
    console.log(formatCarouselAsMarkdown(outline));
    break;
  }

  case "video": {
    const raw_idea = require_arg(args[0], "raw idea");
    const length = parseInt(args[1] ?? "60") as VideoLength;
    const brief = generateContentBrief({ raw_idea });
    const script = generateVideoScript(brief, length);
    console.log(formatVideoScriptAsMarkdown(script));
    break;
  }

  case "repurpose": {
    const title   = require_arg(args[0], "title");
    const type    = require_arg(args[1], "source type") as SourceAssetType;
    const pillar  = require_arg(args[2], "content pillar") as ContentPillar;
    const funnel  = require_arg(args[3], "funnel stage") as FunnelStage;
    const audience = require_arg(args[4], "audience") as Audience;
    const map = buildRepurposeMap({
      type,
      title,
      content: title,
      content_pillar: pillar,
      funnel_stage: funnel,
      primary_audience: audience,
      value_categories: ["trust_and_brand"],
    });
    console.log(formatRepurposeMapAsMarkdown(map));
    break;
  }

  case "voice": {
    const draft = require_arg(args[0], "draft text");
    const result = checkVoice(draft);
    console.log(formatVoiceCheckAsMarkdown(result));
    // Exit 1 if revise so agents can check $?
    if (result.verdict === "revise") process.exit(1);
    break;
  }

  case "inclusion": {
    const draft = require_arg(args[0], "draft text");
    const result = reviewForInclusion(draft);
    console.log(formatInclusionReviewAsMarkdown(result));
    if (result.status === "block") process.exit(2);
    if (result.status === "revise") process.exit(1);
    break;
  }

  case "calendar": {
    const sub = args[0];
    if (sub === "add") {
      const entry = createCalendarEntry({
        date:            require_arg(args[1], "date"),
        title:           require_arg(args[2], "title"),
        channel:         require_arg(args[3], "channel") as Channel,
        content_pillar:  require_arg(args[4], "pillar") as ContentPillar,
        funnel_stage:    require_arg(args[5], "funnel") as FunnelStage,
        cta:             require_arg(args[6], "cta"),
      });
      console.log(JSON.stringify(entry, null, 2));
    } else if (sub === "export") {
      const fmt = args[1] ?? "markdown";
      console.log(fmt === "json" ? exportCalendarAsJSON() : exportCalendarAsMarkdown());
    }
    break;
  }

  default:
    console.log(`
ITC Content OS CLI

Commands:
  brief        "<raw idea>"
  linkedin     "<raw idea>" [short|medium|carousel_intro]
  newsletter   "<raw idea>"
  carousel     "<raw idea>" [5|7|10]
  video        "<raw idea>" [30|60|90]
  repurpose    "<title>" "<type>" "<pillar>" "<funnel>" "<audience>"
  voice        "<draft text>"         — exits 1 if revise
  inclusion    "<draft text>"         — exits 1 if revise, 2 if block
  calendar     add <date> <title> <channel> <pillar> <funnel> <cta>
  calendar     export [json|markdown]
`);
}
