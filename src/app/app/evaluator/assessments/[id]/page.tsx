import AssessmentDetailClient from "./client";

// Placeholder sample IDs for static export prerendering.
// Real session IDs are UUIDs fetched from the backend at runtime.
export function generateStaticParams() {
  return [
    { id: "EVAL-044" },
    { id: "EVAL-045" },
    { id: "EVAL-047" },
    { id: "EVAL-048" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssessmentDetailClient id={id} />;
}
