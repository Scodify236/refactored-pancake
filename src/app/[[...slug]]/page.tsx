import ClientApp from "@/components/ClientApp";

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["reviews"] },
    { slug: ["appeal"] },
    { slug: ["admin"] },
    { slug: ["support"] },
    { slug: ["terms"] },
    { slug: ["privacy"] },
  ];
}

export default function CatchAllPage() {
  return <ClientApp />;
}
