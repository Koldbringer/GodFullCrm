import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Sample services data (will be replaced with Supabase data)
const sampleServices = [
  { id: '1', name: 'Montaż klimatyzacji ściennej', price: 800 },
  { id: '2', name: 'Montaż klimatyzacji kanałowej', price: 1500 },
  { id: '3', name: 'Montaż klimatyzacji kasetonowej', price: 1200 },
  { id: '4', name: 'Montaż pompy ciepła', price: 3500 },
  { id: '5', name: 'Montaż rekuperacji', price: 4000 },
  { id: '6', name: 'Serwis klimatyzacji', price: 250 },
  { id: '7', name: 'Serwis pompy ciepła', price: 350 },
  { id: '8', name: 'Czyszczenie klimatyzacji', price: 200 },
  { id: '9', name: 'Dezynfekcja klimatyzacji', price: 150 },
  { id: '10', name: 'Przegląd techniczny', price: 180 },
  { id: '11', name: 'Naprawa klimatyzacji', price: 400 },
  { id: '12', name: 'Naprawa pompy ciepła', price: 600 },
  { id: '13', name: 'Instalacja elektryczna', price: 1000 },
  { id: '14', name: 'Wykonanie instalacji freonowej', price: 1200 },
  { id: '15', name: 'Wykonanie odpływu skroplin', price: 300 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  
  try {
    // Create Supabase client
    const supabase = createClient();
    
    // Try to fetch services from Supabase
    const { data: servicesData, error } = await supabase
      .from('services')
      .select('id, name, price')
      .ilike('name', `%${search}%`)
      .limit(20);
    
    // If there's an error or no data, use sample data
    if (error || !servicesData || servicesData.length === 0) {
      console.log('Using sample services data');
      // Filter sample data based on search term
      const filteredServices = sampleServices.filter(
        service => service.name.toLowerCase().includes(search)
      );
      
      return NextResponse.json(filteredServices);
    }
    
    // Return data from Supabase
    return NextResponse.json(servicesData);
  } catch (error) {
    console.error('Error fetching services:', error);
    
    // Fallback to sample data in case of error
    const filteredServices = sampleServices.filter(
      service => service.name.toLowerCase().includes(search)
    );
    
    return NextResponse.json(filteredServices);
  }
}

// POST endpoint to create a new service
export async function POST(request: Request) {
  try {
    const { name, price } = await request.json();
    
    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('services')
      .insert([{ name, price }])
      .select();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}