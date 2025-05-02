import { Metadata } from "next"
import { notFound } from "next/navigation"
import { DynamicOfferView } from "@/components/offers/DynamicOfferView"
import { getOfferByToken, getAvailableInstallationDates, approveOffer } from "@/lib/api/offers"

export const metadata: Metadata = {
  title: "Oferta HVAC - GodLike CRM",
  description: "Spersonalizowana oferta na usługi HVAC",
}

export default async function DynamicOfferPage({ params }: { params: { token: string } }) {
  const offer = await getOfferByToken(params.token);

  if (!offer) {
    notFound();
  }

  // Pobierz dostępne terminy montażu tylko jeśli oferta jest aktywna
  const availableDates = offer.status === "pending"
    ? await getAvailableInstallationDates()
    : [];

  // Mapuj dane oferty do formatu oczekiwanego przez komponent
  const mappedOptions = offer.options.map(option => ({
    id: option.id,
    title: option.title,
    description: option.description || "",
    recommended: option.is_recommended,
    totalPrice: option.total_price,
    products: option.products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || "",
      image: "/placeholder-product.jpg", // Placeholder image
      price: product.price,
      features: [
        `Ilość: ${product.quantity} szt.`,
        `Cena jednostkowa: ${product.price.toLocaleString()} zł`,
      ],
    })),
    services: option.services.map(service => ({
      id: service.id,
      name: service.name,
      price: service.price,
    })),
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <DynamicOfferView
        token={params.token}
        clientName={offer.customer.name}
        offerDate={offer.createdAt}
        validUntil={offer.validUntil}
        options={mappedOptions}
        status={offer.status}
        availableDates={availableDates}
        onApprove={async (optionId, dateId) => {
          if (dateId) {
            await approveOffer(params.token, optionId, dateId);
          } else {
            await approveOffer(params.token, optionId, "");
          }
        }}
      />
    </div>
  )
}
