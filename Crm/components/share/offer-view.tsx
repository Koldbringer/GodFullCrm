import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/lib/services/dynamic-links';
import { formatDate } from '@/lib/utils';
import { OfferApprovalForm } from '@/components/offers/offer-approval-form';

interface OfferViewProps {
  link: DynamicLink;
}

export async function OfferView({ link }: OfferViewProps) {
  const supabase = createClient(cookies());
  
  // If no resource ID is provided, we can't fetch the offer
  if (!link.resource_id) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Oferta niedostępna</CardTitle>
            <CardDescription>
              Nie można znaleźć oferty powiązanej z tym linkiem.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  // Fetch the offer
  const { data: offer, error } = await supabase
    .from('offers')
    .select(`
      *,
      customers:customer_id(*),
      options:offer_options(*)
    `)
    .eq('id', link.resource_id)
    .single();
  
  if (error || !offer) {
    console.error('Error fetching offer:', error);
    return notFound();
  }
  
  // Fetch products and services for each option
  const optionsWithDetails = await Promise.all(
    offer.options.map(async (option: any) => {
      const { data: products } = await supabase
        .from('offer_products')
        .select('*')
        .eq('option_id', option.id);
      
      const { data: services } = await supabase
        .from('offer_services')
        .select('*')
        .eq('option_id', option.id);
      
      return {
        ...option,
        products: products || [],
        services: services || [],
      };
    })
  );
  
  // Calculate total for each option
  const optionsWithTotals = optionsWithDetails.map((option: any) => {
    const productsTotal = option.products.reduce(
      (sum: number, product: any) => sum + product.price * product.quantity,
      0
    );
    
    const servicesTotal = option.services.reduce(
      (sum: number, service: any) => sum + service.price,
      0
    );
    
    return {
      ...option,
      total: productsTotal + servicesTotal,
    };
  });
  
  return (
    <div className="container py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{offer.title}</CardTitle>
          <CardDescription>
            Oferta dla: {offer.customers?.name || 'Nieznany klient'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Opis oferty</h3>
              <p className="text-muted-foreground">{offer.description || 'Brak opisu'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Szczegóły</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Data utworzenia:</div>
                <div>{formatDate(offer.created_at)}</div>
                <div>Ważna do:</div>
                <div>{formatDate(offer.valid_until)}</div>
                <div>Status:</div>
                <div>{offer.status}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {optionsWithTotals.map((option: any) => (
          <Card key={option.id} className={option.recommended ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {option.title}
                {option.recommended && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Rekomendowane
                  </span>
                )}
              </CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Produkty</h4>
                  <ul className="space-y-2">
                    {option.products.map((product: any) => (
                      <li key={product.id} className="flex justify-between text-sm">
                        <span>
                          {product.name} x{product.quantity}
                        </span>
                        <span>{product.price.toLocaleString('pl-PL')} zł</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Usługi</h4>
                  <ul className="space-y-2">
                    {option.services.map((service: any) => (
                      <li key={service.id} className="flex justify-between text-sm">
                        <span>{service.name}</span>
                        <span>{service.price.toLocaleString('pl-PL')} zł</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Razem:</span>
                    <span>{option.total.toLocaleString('pl-PL')} zł</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={option.id === offer.selected_option_id ? "default" : "outline"} 
                className="w-full"
                disabled={offer.status !== 'pending'}
              >
                {option.id === offer.selected_option_id 
                  ? "Wybrana opcja" 
                  : "Wybierz tę opcję"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {offer.status === 'pending' && (
        <OfferApprovalForm offerId={offer.id} />
      )}
      
      {offer.status !== 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>
              {offer.status === 'approved' 
                ? 'Oferta została zatwierdzona' 
                : offer.status === 'rejected'
                ? 'Oferta została odrzucona'
                : 'Oferta wygasła'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {offer.status === 'approved' 
                ? 'Dziękujemy za zatwierdzenie oferty. Skontaktujemy się z Tobą wkrótce w celu ustalenia szczegółów.' 
                : offer.status === 'rejected'
                ? 'Dziękujemy za informację. Jeśli masz pytania lub potrzebujesz innej oferty, skontaktuj się z nami.'
                : 'Ta oferta wygasła. Skontaktuj się z nami, aby otrzymać aktualną ofertę.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
