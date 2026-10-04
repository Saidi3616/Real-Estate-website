import Link from "next/link";
import PropertyForm from "@/components/PropertyForm";

// Opret en ny bolig (/admin/properties/new).
export default function NewProperty() {
  return (
    <>
      <Link href="/admin/properties" className="text-sm font-medium text-emerald-700">
        ← Tilbage til listen
      </Link>
      <h1 className="my-4 text-2xl font-bold">Ny bolig</h1>
      <PropertyForm />
    </>
  );
}
