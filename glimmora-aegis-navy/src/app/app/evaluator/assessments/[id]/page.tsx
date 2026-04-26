import AssessmentDetailClient from "./client";

export function generateStaticParams() {
  return [
    { id: "EVAL-044" },
    { id: "EVAL-045" },
    { id: "EVAL-047" },
    { id: "EVAL-048" },
  ];
}

export default function Page() {
  return <AssessmentDetailClient />;
}
