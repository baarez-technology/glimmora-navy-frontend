import InstructorDetailClient from "./client";

// Placeholder sample IDs for static export prerendering.
// Real instructor IDs are UUIDs fetched from the backend at runtime.
export function generateStaticParams() {
  return [{ id: "I-001" }, { id: "I-002" }, { id: "I-003" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InstructorDetailClient id={id} />;
}
