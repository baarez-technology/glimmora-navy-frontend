import SessionDetailClient from "./client";

// Placeholder sample IDs for static export prerendering.
// Real session IDs are UUIDs fetched from the backend at runtime.
export const SESSION_IDS = [
  "BRM-047",
  "CIC-012",
  "ENG-089",
  "DC-034",
  "UAV-007",
  "BRM-046",
  "WAR-018",
  "DC-033",
];

export function generateStaticParams() {
  return SESSION_IDS.map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SessionDetailClient sessionId={id} />;
}
