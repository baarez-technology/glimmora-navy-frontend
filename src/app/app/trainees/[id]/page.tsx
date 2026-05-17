import TraineeDetailClient from "./client";

// Placeholder sample IDs for static export prerendering.
// Real trainee IDs are UUIDs fetched from the backend at runtime.
export function generateStaticParams() {
  return [{ id: "T-001" }, { id: "T-002" }, { id: "T-003" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TraineeDetailClient id={id} />;
}
