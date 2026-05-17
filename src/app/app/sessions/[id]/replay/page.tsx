import ReplayClient from "./client";
import { SESSION_IDS } from "../page";

export function generateStaticParams() {
  return SESSION_IDS.map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReplayClient sessionId={id} />;
}
