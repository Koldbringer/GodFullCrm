// Crm/lib/api/offers.ts
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export type OfferProduct = {
  inventory_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

export type OfferService = {
  service_id: string;
  name: string;
  description: string;
  price: number;
};

export type OfferOption = {
  title: string;
  description: string;
  is_recommended: boolean;
  products: OfferProduct[];
  services: OfferService[];
};

export type CreateOfferData = {
  customer_id: string;
  title: string;
  description?: string;
  valid_days: number;
  options: OfferOption[];
};

/**
 * Creates a new offer in the database and returns the token
 */
export async function createOffer(data: CreateOfferData) {
  const supabase = createClient(cookies());
  const token = uuidv4();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + data.valid_days);

  // Start a transaction by using the same timestamp for all operations
  const timestamp = new Date().toISOString();

  // 1. Create the offer
  const { data: offerData, error: offerError } = await supabase
    .from("offers")
    .insert({
      customer_id: data.customer_id,
      title: data.title,
      description: data.description,
      valid_until: validUntil.toISOString(),
      status: "pending",
      token,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select("id")
    .single();

  if (offerError || !offerData) {
    console.error("Error creating offer:", offerError);
    throw new Error("Failed to create offer");
  }

  const offerId = offerData.id;

  // 2. Create offer options
  for (const option of data.options) {
    // Calculate total price
    const productsTotal = option.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const servicesTotal = option.services.reduce((sum, s) => sum + s.price, 0);
    const totalPrice = productsTotal + servicesTotal;

    const { data: optionData, error: optionError } = await supabase
      .from("offer_options")
      .insert({
        offer_id: offerId,
        title: option.title,
        description: option.description,
        is_recommended: option.is_recommended,
        total_price: totalPrice,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select("id")
      .single();

    if (optionError || !optionData) {
      console.error("Error creating offer option:", optionError);
      throw new Error("Failed to create offer option");
    }

    const optionId = optionData.id;

    // 3. Create offer products
    for (const product of option.products) {
      const { error: productError } = await supabase.from("offer_products").insert({
        offer_option_id: optionId,
        inventory_id: product.inventory_id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        created_at: timestamp,
        updated_at: timestamp,
      });

      if (productError) {
        console.error("Error creating offer product:", productError);
        throw new Error("Failed to create offer product");
      }
    }

    // 4. Create offer services
    for (const service of option.services) {
      const { error: serviceError } = await supabase.from("offer_services").insert({
        offer_option_id: optionId,
        service_id: service.service_id,
        name: service.name,
        description: service.description,
        price: service.price,
        created_at: timestamp,
        updated_at: timestamp,
      });

      if (serviceError) {
        console.error("Error creating offer service:", serviceError);
        throw new Error("Failed to create offer service");
      }
    }
  }

  return token;
}

/**
 * Gets offer data by token
 */
export async function getOfferByToken(token: string) {
  const supabase = createClient(cookies());

  // 1. Get the offer
  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select(`
      id,
      customer_id,
      title,
      description,
      valid_until,
      status,
      created_at,
      selected_option_id,
      selected_installation_date,
      customers (
        name,
        email,
        phone
      )
    `)
    .eq("token", token)
    .single();

  if (offerError || !offer) {
    console.error("Error getting offer:", offerError);
    return null;
  }

  // Check if offer is expired
  if (new Date(offer.valid_until) < new Date() && offer.status === "pending") {
    // Update offer status to expired
    await supabase
      .from("offers")
      .update({ status: "expired", updated_at: new Date().toISOString() })
      .eq("id", offer.id);
    
    offer.status = "expired";
  }

  // 2. Get offer options
  const { data: options, error: optionsError } = await supabase
    .from("offer_options")
    .select(`
      id,
      title,
      description,
      is_recommended,
      total_price
    `)
    .eq("offer_id", offer.id);

  if (optionsError) {
    console.error("Error getting offer options:", optionsError);
    return null;
  }

  // 3. Get products and services for each option
  const optionsWithDetails = await Promise.all(
    options.map(async (option) => {
      // Get products
      const { data: products, error: productsError } = await supabase
        .from("offer_products")
        .select(`
          id,
          inventory_id,
          name,
          description,
          price,
          quantity
        `)
        .eq("offer_option_id", option.id);

      if (productsError) {
        console.error("Error getting offer products:", productsError);
        return null;
      }

      // Get services
      const { data: services, error: servicesError } = await supabase
        .from("offer_services")
        .select(`
          id,
          service_id,
          name,
          description,
          price
        `)
        .eq("offer_option_id", option.id);

      if (servicesError) {
        console.error("Error getting offer services:", servicesError);
        return null;
      }

      return {
        ...option,
        products,
        services,
      };
    })
  );

  // Filter out any null options (in case of errors)
  const validOptions = optionsWithDetails.filter(Boolean);

  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    validUntil: offer.valid_until,
    status: offer.status,
    createdAt: offer.created_at,
    selectedOptionId: offer.selected_option_id,
    selectedInstallationDate: offer.selected_installation_date,
    customer: offer.customers,
    options: validOptions,
  };
}

/**
 * Approves an offer with the selected option and installation date
 */
export async function approveOffer(token: string, optionId: string, installationDateId: string) {
  const supabase = createClient(cookies());

  // 1. Get the offer
  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id, status, valid_until")
    .eq("token", token)
    .single();

  if (offerError || !offer) {
    console.error("Error getting offer:", offerError);
    throw new Error("Offer not found");
  }

  // Check if offer is expired
  if (new Date(offer.valid_until) < new Date()) {
    throw new Error("Offer has expired");
  }

  // Check if offer is already approved or rejected
  if (offer.status !== "pending") {
    throw new Error(`Offer is already ${offer.status}`);
  }

  // 2. Get the installation date
  const { data: installationDate, error: dateError } = await supabase
    .from("available_installation_dates")
    .select("id, date, slots_available")
    .eq("id", installationDateId)
    .single();

  if (dateError || !installationDate) {
    console.error("Error getting installation date:", dateError);
    throw new Error("Installation date not found");
  }

  // Check if there are available slots
  if (installationDate.slots_available < 1) {
    throw new Error("No available slots for this installation date");
  }

  // 3. Update the offer
  const { error: updateError } = await supabase
    .from("offers")
    .update({
      status: "approved",
      selected_option_id: optionId,
      selected_installation_date: installationDate.date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", offer.id);

  if (updateError) {
    console.error("Error updating offer:", updateError);
    throw new Error("Failed to approve offer");
  }

  // 4. Decrease available slots for the installation date
  const { error: slotError } = await supabase
    .from("available_installation_dates")
    .update({
      slots_available: installationDate.slots_available - 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", installationDateId);

  if (slotError) {
    console.error("Error updating installation date slots:", slotError);
    // We don't throw here because the offer is already approved
  }

  return true;
}

/**
 * Rejects an offer
 */
export async function rejectOffer(token: string, reason?: string) {
  const supabase = createClient(cookies());

  // Get the offer
  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id, status")
    .eq("token", token)
    .single();

  if (offerError || !offer) {
    console.error("Error getting offer:", offerError);
    throw new Error("Offer not found");
  }

  // Check if offer is already approved or rejected
  if (offer.status !== "pending") {
    throw new Error(`Offer is already ${offer.status}`);
  }

  // Update the offer
  const { error: updateError } = await supabase
    .from("offers")
    .update({
      status: "rejected",
      description: reason ? `${offer.description || ""}\n\nRejection reason: ${reason}` : offer.description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", offer.id);

  if (updateError) {
    console.error("Error rejecting offer:", updateError);
    throw new Error("Failed to reject offer");
  }

  return true;
}

/**
 * Gets available installation dates
 */
export async function getAvailableInstallationDates() {
  const supabase = createClient(cookies());

  const { data, error } = await supabase
    .from("available_installation_dates")
    .select("id, date, slots_available, slots_total")
    .gt("slots_available", 0)
    .gt("date", new Date().toISOString())
    .order("date", { ascending: true });

  if (error) {
    console.error("Error getting available installation dates:", error);
    throw new Error("Failed to get available installation dates");
  }

  return data;
}
