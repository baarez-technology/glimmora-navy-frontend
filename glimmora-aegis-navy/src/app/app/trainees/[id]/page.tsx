import TraineeDetailClient from "./client";

export function generateStaticParams() {
  return [{ id: "T-001" }, { id: "T-002" }, { id: "T-003" }];
}

export default function Page() {
  return <TraineeDetailClient />;
}
