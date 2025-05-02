"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// Form schema
const formSchema = z.object({
  customer_id: z.string().uuid("Wybierz klienta"),
  title: z.string().min(5, "Tytuł musi mieć co najmniej 5 znaków"),
  description: z.string().optional(),
  valid_days: z.number().int().min(1).max(90),
  options: z.array(
    z.object({
      title: z.string().min(3, "Tytuł opcji musi mieć co najmniej 3 znaki"),
      description: z.string().min(10, "Opis opcji musi mieć co najmniej 10 znaków"),
      is_recommended: z.boolean().default(false),
      products: z.array(
        z.object({
          inventory_id: z.string().uuid("Wybierz produkt"),
          name: z.string(),
          description: z.string(),
          price: z.number().min(0),
          quantity: z.number().int().min(1),
          discount_percentage: z.number().int().min(0).max(100).optional(),
          original_price: z.number().min(0).optional(),
          stock_status: z.enum(['in_stock', 'low_stock', 'out_of_stock']).optional(),
          features: z.array(z.string()).optional(),
          image: z.string().optional(),
        })
      ).min(1, "Dodaj co najmniej jeden produkt"),
      services: z.array(
        z.object({
          service_id: z.string().uuid("Wybierz usługę"),
          name: z.string(),
          description: z.string(),
          price: z.number().min(0),
        })
      ).min(1, "Dodaj co najmniej jedną usługę"),
    })
  ).min(1, "Dodaj co najmniej jedną opcję"),
});

type FormData = z.infer<typeof formSchema>;

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type InventoryItem = {
  id: string;
  item_name: string;
  description: string;
  price: number;
  quantity_in_stock: number;
  features?: string | string[];
  image_url?: string | null;
};

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export function OfferGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("option0");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Oferta na montaż klimatyzacji",
      valid_days: 14,
      options: [
        {
          title: "Pakiet Podstawowy",
          description: "Ekonomiczne rozwiązanie dla małych pomieszczeń",
          is_recommended: false,
          products: [
            {
              inventory_id: "",
              name: "",
              description: "",
              price: 0,
              quantity: 1,
              features: [],
              stock_status: "in_stock",
            },
          ],
          services: [
            {
              service_id: "",
              name: "",
              description: "",
              price: 0,
            },
          ],
        },
      ],
    },
  });

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: "options",
  });

  // Create field arrays for products and services in each option
  const optionsWithArrays = optionFields.map((option, optionIndex) => {
    const productsArray = useFieldArray({
      control: form.control,
      name: `options.${optionIndex}.products`,
    });

    const servicesArray = useFieldArray({
      control: form.control,
      name: `options.${optionIndex}.services`,
    });

    return {
      ...option,
      productsArray,
      servicesArray,
    };
  });

  // Fetch customers, inventory and services on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const supabase = createClient();

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from("customers")
        .select("id, name, email, phone")
        .order("name");

      if (customersError) {
        console.error("Error fetching customers:", customersError);
        toast.error("Błąd podczas pobierania listy klientów");
      } else {
        setCustomers(customersData || []);
      }

      // Fetch inventory
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory")
        .select("id, item_name, description, quantity, unit, location")
        .order("item_name");

      if (inventoryError) {
        console.error("Error fetching inventory:", inventoryError);
        toast.error("Błąd podczas pobierania listy produktów");
      } else {
        // Transform the data to include the fields we need
        const transformedInventory = (inventoryData || []).map(item => ({
          id: item.id,
          item_name: item.item_name || "",
          description: item.description || "",
          price: 0, // Default price since it's not in the schema
          quantity_in_stock: item.quantity || 0,
          features: [],
          image_url: null
        }));
        setInventory(transformedInventory);
      }

      // Use sample services data since there's no services table yet
      const sampleServices = [
        { id: "s1", name: "Montaż klimatyzacji ściennej", description: "Standardowy montaż jednostki ściennej", price: 800 },
        { id: "s2", name: "Montaż klimatyzacji kanałowej", description: "Montaż jednostki kanałowej z podłączeniem", price: 1500 },
        { id: "s3", name: "Montaż klimatyzacji kasetonowej", description: "Montaż jednostki kasetonowej w suficie podwieszanym", price: 1200 },
        { id: "s4", name: "Montaż klimatyzacji przypodłogowej", description: "Montaż jednostki przypodłogowej", price: 900 },
        { id: "s5", name: "Montaż klimatyzacji multi-split", description: "Montaż systemu multi-split z kilkoma jednostkami", price: 2000 },
        { id: "s6", name: "Instalacja rurociągu chłodniczego", description: "Dodatkowa instalacja rurociągu chłodniczego", price: 150 },
        { id: "s7", name: "Wykonanie odpływu skroplin", description: "Instalacja odpływu skroplin", price: 100 },
        { id: "s8", name: "Wykonanie przebicia przez ścianę", description: "Wykonanie otworu w ścianie na instalację", price: 120 },
        { id: "s9", name: "Montaż sterownika przewodowego", description: "Instalacja i konfiguracja sterownika przewodowego", price: 200 },
        { id: "s10", name: "Uruchomienie i test systemu", description: "Pierwsze uruchomienie i testowanie systemu", price: 250 },
      ];

      setServices(sampleServices);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Handle product selection
  const handleProductSelect = (optionIndex: number, productIndex: number, inventoryId: string) => {
    const selectedProduct = inventory.find((item) => item.id === inventoryId);
    if (selectedProduct) {
      form.setValue(`options.${optionIndex}.products.${productIndex}.name`, selectedProduct.item_name);
      form.setValue(`options.${optionIndex}.products.${productIndex}.description`, selectedProduct.description);
      form.setValue(`options.${optionIndex}.products.${productIndex}.price`, selectedProduct.price);

      // Set stock status based on quantity in inventory
      if (selectedProduct.quantity_in_stock > 10) {
        form.setValue(`options.${optionIndex}.products.${productIndex}.stock_status`, 'in_stock');
      } else if (selectedProduct.quantity_in_stock > 0) {
        form.setValue(`options.${optionIndex}.products.${productIndex}.stock_status`, 'low_stock');
      } else {
        form.setValue(`options.${optionIndex}.products.${productIndex}.stock_status`, 'out_of_stock');
      }

      // Set features if available
      if (selectedProduct.features) {
        try {
          const featuresArray = typeof selectedProduct.features === 'string'
            ? JSON.parse(selectedProduct.features)
            : selectedProduct.features;

          form.setValue(`options.${optionIndex}.products.${productIndex}.features`, featuresArray);
        } catch (e) {
          console.error("Error parsing product features:", e);
        }
      }

      // Set image if available
      if (selectedProduct.image_url) {
        form.setValue(`options.${optionIndex}.products.${productIndex}.image`, selectedProduct.image_url);
      }
    }
  };

  // Handle service selection
  const handleServiceSelect = (optionIndex: number, serviceIndex: number, serviceId: string) => {
    const selectedService = services.find((item) => item.id === serviceId);
    if (selectedService) {
      form.setValue(`options.${optionIndex}.services.${serviceIndex}.name`, selectedService.name);
      form.setValue(`options.${optionIndex}.services.${serviceIndex}.description`, selectedService.description);
      form.setValue(`options.${optionIndex}.services.${serviceIndex}.price`, selectedService.price);
    }
  };

  const addNewOption = () => {
    appendOption({
      title: `Pakiet ${optionFields.length + 1}`,
      description: "Opis pakietu",
      is_recommended: false,
      products: [{
        inventory_id: "",
        name: "",
        description: "",
        price: 0,
        quantity: 1,
        features: [],
        stock_status: "in_stock"
      }],
      services: [{ service_id: "", name: "", description: "", price: 0 }],
    });

    // Switch to the new tab
    setActiveTab(`option${optionFields.length}`);
  };

  async function onSubmit(data: FormData) {
    setIsGenerating(true);
    try {
      // Call API to create offer
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Wystąpił błąd podczas generowania oferty");
      }

      const { token } = await response.json();
      const fullUrl = `${window.location.origin}/offers/${token}`;

      setGeneratedUrl(fullUrl);
      toast.success("Oferta została wygenerowana!");
    } catch (error) {
      console.error("Error generating offer:", error);
      toast.error(error instanceof Error ? error.message : "Wystąpił błąd podczas generowania oferty");
    } finally {
      setIsGenerating(false);
    }
  }

  function copyToClipboard() {
    if (!generatedUrl) return;

    navigator.clipboard
      .writeText(generatedUrl)
      .then(() => {
        setIsCopied(true);
        toast.success("Link skopiowany do schowka!");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Nie udało się skopiować linku");
      });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Ładowanie danych...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Generator ofert</h1>
        <p className="text-muted-foreground">
          Stwórz spersonalizowaną ofertę dla klienta z różnymi opcjami do wyboru
        </p>
      </div>

      {generatedUrl ? (
        <Card>
          <CardHeader>
            <CardTitle>Oferta wygenerowana</CardTitle>
            <CardDescription>
              Oferta została pomyślnie wygenerowana. Skopiuj poniższy link i wyślij go do klienta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input value={generatedUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={isCopied}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setGeneratedUrl(null)}>
              Wróć do edycji
            </Button>
            <Button onClick={() => window.open(generatedUrl, "_blank")}>
              Otwórz ofertę
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informacje podstawowe</CardTitle>
                <CardDescription>
                  Wprowadź podstawowe informacje o ofercie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Klient</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz klienta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} ({customer.phone})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Wybierz klienta, dla którego tworzysz ofertę
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tytuł oferty</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Wprowadź tytuł oferty, np. "Oferta na montaż klimatyzacji"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opis oferty</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Wprowadź opis oferty..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Opcjonalny opis oferty, który będzie widoczny dla klienta
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valid_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ważność oferty (dni)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={90}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Określ, przez ile dni oferta będzie ważna
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Opcje oferty</CardTitle>
                    <CardDescription>
                      Dodaj różne opcje/pakiety do wyboru dla klienta
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addNewOption} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj opcję
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    {optionsWithArrays.map((option, index) => (
                      <TabsTrigger key={option.id} value={`option${index}`}>
                        {form.watch(`options.${index}.title`) || `Opcja ${index + 1}`}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {optionsWithArrays.map((option, optionIndex) => (
                    <TabsContent key={option.id} value={`option${optionIndex}`} className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-4 flex-1">
                          <FormField
                            control={form.control}
                            name={`options.${optionIndex}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nazwa opcji</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`options.${optionIndex}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Opis opcji</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Wprowadź opis opcji..."
                                    className="min-h-[80px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`options.${optionIndex}.is_recommended`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Polecana opcja</FormLabel>
                                  <FormDescription>
                                    Zaznacz, jeśli ta opcja ma być oznaczona jako polecana
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {optionFields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              removeOption(optionIndex);
                              setActiveTab(`option${Math.max(0, optionIndex - 1)}`);
                            }}
                            className="ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Produkty</h3>
                          {option.productsArray.fields.map((product, productIndex) => (
                            <div
                              key={product.id}
                              className="flex flex-col gap-4 p-4 border rounded-md mb-4"
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium">Produkt {productIndex + 1}</h4>
                                {option.productsArray.fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => option.productsArray.remove(productIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              <FormField
                                control={form.control}
                                name={`options.${optionIndex}.products.${productIndex}.inventory_id`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Produkt</FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        handleProductSelect(optionIndex, productIndex, value);
                                      }}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Wybierz produkt" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {inventory.map((item) => (
                                          <SelectItem key={item.id} value={item.id}>
                                            {item.item_name} - {item.price.toLocaleString()} zł
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`options.${optionIndex}.products.${productIndex}.quantity`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Ilość</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min={1}
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`options.${optionIndex}.products.${productIndex}.discount_percentage`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Zniżka (%)</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min={0}
                                          max={100}
                                          placeholder="0"
                                          {...field}
                                          value={field.value || ""}
                                          onChange={(e) => {
                                            const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                                            field.onChange(value);

                                            // If discount is added, save original price
                                            if (value && value > 0) {
                                              const currentPrice = form.getValues(`options.${optionIndex}.products.${productIndex}.price`);
                                              const originalPrice = form.getValues(`options.${optionIndex}.products.${productIndex}.original_price`);

                                              if (!originalPrice) {
                                                form.setValue(
                                                  `options.${optionIndex}.products.${productIndex}.original_price`,
                                                  currentPrice
                                                );
                                              }
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Opcjonalna zniżka dla tego produktu
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              option.productsArray.append({
                                inventory_id: "",
                                name: "",
                                description: "",
                                price: 0,
                                quantity: 1,
                                features: [],
                                stock_status: "in_stock",
                              })
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Dodaj produkt
                          </Button>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-2">Usługi</h3>
                          {option.servicesArray.fields.map((service, serviceIndex) => (
                            <div
                              key={service.id}
                              className="flex flex-col gap-4 p-4 border rounded-md mb-4"
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium">Usługa {serviceIndex + 1}</h4>
                                {option.servicesArray.fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => option.servicesArray.remove(serviceIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              <FormField
                                control={form.control}
                                name={`options.${optionIndex}.services.${serviceIndex}.service_id`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Usługa</FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        handleServiceSelect(optionIndex, serviceIndex, value);
                                      }}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Wybierz usługę" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {services.map((item) => (
                                          <SelectItem key={item.id} value={item.id}>
                                            {item.name} - {item.price.toLocaleString()} zł
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              option.servicesArray.append({
                                service_id: "",
                                name: "",
                                description: "",
                                price: 0,
                              })
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Dodaj usługę
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generowanie...
                  </>
                ) : (
                  "Wygeneruj ofertę"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
