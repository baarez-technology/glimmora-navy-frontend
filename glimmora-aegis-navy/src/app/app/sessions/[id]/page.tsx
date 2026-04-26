import SessionDetailClient from "./client";

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

export default function Page() {
  return <SessionDetailClient />;
}
