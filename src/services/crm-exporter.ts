import type { CrmExportRow, ContentMetadata, Audience, FunnelStage, ValueCategory } from "../types.js";

export interface LeadMagnetMapping {
  audience: Audience;
  funnel_stage: FunnelStage;
  lead_magnet: string;
  email_sequence: string;
  tags: string[];
}

const LEAD_MAGNET_MAPPINGS: LeadMagnetMapping[] = [
  {
    audience: "product_leaders",
    funnel_stage: "awareness",
    lead_magnet: "Inclusive Design Value Map",
    email_sequence: "product-leader-nurture-v1",
    tags: ["product-leader", "business-case", "awareness"],
  },
  {
    audience: "product_leaders",
    funnel_stage: "education",
    lead_magnet: "Inclusive Design Value Map",
    email_sequence: "product-leader-nurture-v1",
    tags: ["product-leader", "business-case", "education"],
  },
  {
    audience: "product_leaders",
    funnel_stage: "conversion",
    lead_magnet: "Inclusive Design Value Map",
    email_sequence: "product-leader-workshop-interest",
    tags: ["product-leader", "workshop-interest", "hot-lead"],
  },
  {
    audience: "inclusive_design_practitioners",
    funnel_stage: "awareness",
    lead_magnet: "Accessibility Beyond Compliance Checklist",
    email_sequence: "practitioner-nurture-v1",
    tags: ["practitioner", "accessibility", "awareness"],
  },
  {
    audience: "inclusive_design_practitioners",
    funnel_stage: "education",
    lead_magnet: "Accessibility Beyond Compliance Checklist",
    email_sequence: "practitioner-nurture-v1",
    tags: ["practitioner", "accessibility", "education"],
  },
  {
    audience: "founders_and_operators",
    funnel_stage: "awareness",
    lead_magnet: "Inclusive Design Starter Kit",
    email_sequence: "founder-nurture-v1",
    tags: ["founder", "startup", "awareness"],
  },
  {
    audience: "founders_and_operators",
    funnel_stage: "conversion",
    lead_magnet: "Inclusive Design Starter Kit",
    email_sequence: "founder-consulting-interest",
    tags: ["founder", "consulting-interest", "hot-lead"],
  },
  {
    audience: "accessibility_advocates",
    funnel_stage: "education",
    lead_magnet: "Power Dynamics in Product Design Framework",
    email_sequence: "advocate-community-nurture",
    tags: ["advocate", "community", "power-dynamics"],
  },
  {
    audience: "potential_clients",
    funnel_stage: "offer",
    lead_magnet: "ITC Capabilities Overview",
    email_sequence: "client-conversion-sequence",
    tags: ["potential-client", "offer-stage", "hot-lead"],
  },
  {
    audience: "newsletter_subscribers",
    funnel_stage: "nurture",
    lead_magnet: "Newsletter Archive",
    email_sequence: "newsletter-subscriber-ongoing",
    tags: ["subscriber", "nurture", "engaged"],
  },
];

function findLeadMagnetMapping(
  audience: Audience,
  funnel_stage: FunnelStage
): LeadMagnetMapping {
  const exact = LEAD_MAGNET_MAPPINGS.find(
    (m) => m.audience === audience && m.funnel_stage === funnel_stage
  );

  if (exact) return exact;

  const byAudience = LEAD_MAGNET_MAPPINGS.find((m) => m.audience === audience);
  if (byAudience) return byAudience;

  return {
    audience,
    funnel_stage,
    lead_magnet: "Inclusive Design Value Map",
    email_sequence: "general-nurture-v1",
    tags: [audience, funnel_stage],
  };
}

export function buildCrmRow(metadata: ContentMetadata): CrmExportRow {
  const mapping = findLeadMagnetMapping(
    metadata.primary_audience,
    metadata.funnel_stage
  );

  const primaryValueCategory: ValueCategory =
    metadata.value_categories[0] ?? "trust_and_brand";

  return {
    content_title: metadata.content_title,
    audience_segment: metadata.primary_audience,
    funnel_stage: metadata.funnel_stage,
    cta: metadata.cta,
    lead_magnet: mapping.lead_magnet,
    email_sequence: mapping.email_sequence,
    value_category: primaryValueCategory,
  };
}

export function buildCrmRows(metadataList: ContentMetadata[]): CrmExportRow[] {
  return metadataList.map(buildCrmRow);
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportAsCsv(rows: CrmExportRow[]): string {
  const headers = [
    "content_title",
    "audience_segment",
    "funnel_stage",
    "cta",
    "lead_magnet",
    "email_sequence",
    "value_category",
  ];

  const headerRow = headers.join(",");

  const dataRows = rows.map((row) =>
    [
      escapeCsvField(row.content_title),
      escapeCsvField(row.audience_segment),
      escapeCsvField(row.funnel_stage),
      escapeCsvField(row.cta),
      escapeCsvField(row.lead_magnet),
      escapeCsvField(row.email_sequence),
      escapeCsvField(row.value_category),
    ].join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

export function exportAsMarkdown(rows: CrmExportRow[]): string {
  if (rows.length === 0) return "# CRM Export\n\nNo rows to export.\n";

  const tableHeader =
    "| Content Title | Audience | Funnel Stage | CTA | Lead Magnet | Email Sequence | Value Category |";
  const tableDivider =
    "|---|---|---|---|---|---|---|";

  const tableRows = rows.map(
    (row) =>
      `| ${row.content_title} | ${row.audience_segment} | ${row.funnel_stage} | ${row.cta} | ${row.lead_magnet} | ${row.email_sequence} | ${row.value_category} |`
  );

  return `# CRM Export

${tableHeader}
${tableDivider}
${tableRows.join("\n")}

---
*${rows.length} row(s) exported. Review before importing to HubSpot or CRM.*
`;
}

export function getLeadMagnetMappings(): LeadMagnetMapping[] {
  return [...LEAD_MAGNET_MAPPINGS];
}
