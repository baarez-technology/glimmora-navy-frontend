import ShipDetailClient from "./client";

export function generateStaticParams() {
  return [
    { id: "INS-VIKRANT" },
    { id: "INS-VIKRAMADITYA" },
    { id: "INS-KOLKATA" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipDetailClient shipId={id} />;
}
