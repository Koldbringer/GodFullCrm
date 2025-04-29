import OfferGeneratorForm from "@/components/offers/OfferGeneratorForm";
import OffersList from "@/components/offers/OffersList";

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Generator ofert MDX</h1>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <OfferGeneratorForm />
        <OffersList />
      </div>
    </div>
  );
}
