import DebriefClient from "./client";
import { SESSION_IDS } from "../page";

export function generateStaticParams() {
  return SESSION_IDS.map((id) => ({ id }));
}

export default function Page() {
  return <DebriefClient />;
}
