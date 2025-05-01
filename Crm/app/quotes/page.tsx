import { Metadata } from "next";
import { OfferGenerator } from "@/components/offers/OfferGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OffersList from "@/components/offers/OffersList";
import OfferGeneratorForm from "@/components/offers/OfferGeneratorForm";

export const metadata: Metadata = {
  title: "Generator ofert - GodLike CRM",
  description: "Tworzenie i zarządzanie ofertami dla klientów",
};

export default function QuotesPage() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Generator ofert</TabsTrigger>
          <TabsTrigger value="mdx">Generator MDX</TabsTrigger>
          <TabsTrigger value="list">Lista ofert</TabsTrigger>
        </TabsList>
        <TabsContent value="generator">
          <OfferGenerator />
        </TabsContent>
        <TabsContent value="mdx">
          <div className="max-w-5xl mx-auto">
            <OfferGeneratorForm />
          </div>
        </TabsContent>
        <TabsContent value="list">
          <OffersList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
