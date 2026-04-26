import InstructorDetailClient from "./client";

export function generateStaticParams() {
  return [{ id: "I-001" }, { id: "I-002" }, { id: "I-003" }];
}

export default function Page() {
  return <InstructorDetailClient />;
}
