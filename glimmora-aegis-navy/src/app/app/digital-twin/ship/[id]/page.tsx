import ShipDetailClient from "./client";

export function generateStaticParams() {
  return [
    { id: "INS-VIKRANT" },
    { id: "INS-VIKRAMADITYA" },
    { id: "INS-KOLKATA" },
  ];
}

export default function Page() {
  return <ShipDetailClient />;
}
