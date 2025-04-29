import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Sample HVAC products data
const sampleProducts = [
  { name: 'Klimatyzator ścienny Mitsubishi MSZ-AP25VG', unitPrice: 3200 },
  { name: 'Klimatyzator ścienny Daikin FTXM25R', unitPrice: 3500 },
  { name: 'Klimatyzator ścienny LG Standard Plus PC12SQ', unitPrice: 2800 },
  { name: 'Klimatyzator ścienny Samsung Wind-Free Comfort AR09TXFCAWKNEU', unitPrice: 3100 },
  { name: 'Klimatyzator kanałowy Mitsubishi SEZ-M35DA', unitPrice: 5200 },
  { name: 'Klimatyzator kanałowy Daikin FDXM35F9', unitPrice: 5500 },
  { name: 'Klimatyzator kasetonowy Mitsubishi SLZ-M35FA', unitPrice: 4800 },
  { name: 'Klimatyzator kasetonowy Daikin FCAG35B', unitPrice: 5100 },
  { name: 'Pompa ciepła Mitsubishi Ecodan PUHZ-SW75VAA', unitPrice: 25000 },
  { name: 'Pompa ciepła Daikin Altherma 3 ERGA06DV', unitPrice: 28000 },
  { name: 'Pompa ciepła Panasonic Aquarea T-CAP 9kW', unitPrice: 26500 },
  { name: 'Rekuperator Vents VUT 350 PE EC', unitPrice: 8500 },
  { name: 'Rekuperator Thessla Green AirPack Home 400h', unitPrice: 9200 },
  { name: 'Rekuperator Daikin VAM350J', unitPrice: 10500 },
  { name: 'Rura miedziana chłodnicza 1/4" (mb)', unitPrice: 25 },
  { name: 'Rura miedziana chłodnicza 3/8" (mb)', unitPrice: 35 },
  { name: 'Rura miedziana chłodnicza 1/2" (mb)', unitPrice: 45 },
  { name: 'Rura miedziana chłodnicza 5/8" (mb)', unitPrice: 55 },
  { name: 'Izolacja termiczna do rur 1/4" (mb)', unitPrice: 8 },
  { name: 'Izolacja termiczna do rur 3/8" (mb)', unitPrice: 10 },
  { name: 'Izolacja termiczna do rur 1/2" (mb)', unitPrice: 12 },
  { name: 'Izolacja termiczna do rur 5/8" (mb)', unitPrice: 15 },
  { name: 'Czynnik chłodniczy R32 (kg)', unitPrice: 120 },
  { name: 'Czynnik chłodniczy R410A (kg)', unitPrice: 100 },
  { name: 'Uchwyt ścienny do jednostki zewnętrznej', unitPrice: 150 },
  { name: 'Pompka skroplin Mini Orange', unitPrice: 250 },
  { name: 'Sterownik przewodowy Mitsubishi PAR-40MAA', unitPrice: 650 },
  { name: 'Sterownik przewodowy Daikin BRC1H519W', unitPrice: 700 },
  { name: 'Moduł WiFi Mitsubishi MAC-567IF-E', unitPrice: 550 },
  { name: 'Moduł WiFi Daikin BRP069B42', unitPrice: 600 },
];

// Sample HVAC services data
const sampleServices = [
  { id: '1', name: 'Montaż klimatyzacji ściennej', price: 800 },
  { id: '2', name: 'Montaż klimatyzacji kanałowej', price: 1500 },
  { id: '3', name: 'Montaż klimatyzacji kasetonowej', price: 1200 },
  { id: '4', name: 'Montaż pompy ciepła', price: 3500 },
  { id: '5', name: 'Montaż rekuperacji', price: 4000 },
  { id: '6', name: 'Wykonanie instalacji freonowej (do 3m)', price: 300 },
  { id: '7', name: 'Wykonanie instalacji freonowej (każdy dodatkowy metr)', price: 100 },
  { id: '8', name: 'Wykonanie odpływu skroplin (do 3m)', price: 150 },
  { id: '9', name: 'Wykonanie odpływu skroplin (każdy dodatkowy metr)', price: 50 },
  { id: '10', name: 'Wykonanie przebicia przez ścianę', price: 200 },
  { id: '11', name: 'Wykonanie instalacji elektrycznej (do 3m)', price: 200 },
  { id: '12', name: 'Wykonanie instalacji elektrycznej (każdy dodatkowy metr)', price: 70 },
  { id: '13', name: 'Uruchomienie i test systemu klimatyzacji', price: 250 },
  { id: '14', name: 'Uruchomienie i test pompy ciepła', price: 500 },
  { id: '15', name: 'Uruchomienie i test rekuperacji', price: 400 },
  { id: '16', name: 'Szkolenie użytkownika z obsługi systemu', price: 150 },
  { id: '17', name: 'Serwis gwarancyjny - pierwszy rok', price: 0 },
  { id: '18', name: 'Pakiet serwisowy - 2 przeglądy rocznie', price: 400 },
  { id: '19', name: 'Pakiet serwisowy premium - 4 przeglądy rocznie', price: 700 },
  { id: '20', name: 'Rozszerzona gwarancja - dodatkowe 2 lata', price: 800 },
];

// Function to analyze customer needs and generate product and service recommendations
function analyzeCustomerNeeds(prompt: string, customerName: string) {
  // This is a simplified rule-based system that would ideally be replaced with a real AI model
  const promptLower = prompt.toLowerCase();
  const products = [];
  const services = [];
  
  // Analyze space size
  let roomCount = 1;
  let spaceSize = 0;
  
  // Try to extract room count
  const roomMatch = promptLower.match(/(\d+)\s*(pok[oó]j|pok[oó]je|pokoi|pomieszcze[nń]|sypialnie)/);
  if (roomMatch) {
    roomCount = parseInt(roomMatch[1]);
  }
  
  // Try to extract space size
  const sizeMatch = promptLower.match(/(\d+)\s*m2/);
  if (sizeMatch) {
    spaceSize = parseInt(sizeMatch[1]);
  }
  
  // Determine system type
  const needsAC = promptLower.includes('klimatyzac') || 
                 promptLower.includes('chłodzen') || 
                 promptLower.includes('klima');
                 
  const needsHeatPump = promptLower.includes('pomp') && 
                       (promptLower.includes('ciepł') || promptLower.includes('ogrzew'));
                       
  const needsRecuperation = promptLower.includes('rekuperac') || 
                          promptLower.includes('wentylac') ||
                          promptLower.includes('świeże powietrze');
  
  // Determine building type
  const isNewBuilding = promptLower.includes('nowe budownictwo') || 
                      promptLower.includes('nowy budynek') ||
                      promptLower.includes('z 202');
                      
  const isOldBuilding = promptLower.includes('stare budownictwo') || 
                      promptLower.includes('stary budynek');
  
  // Generate recommendations based on analysis
  if (needsAC) {
    // Determine AC units based on room count and space size
    for (let i = 0; i < roomCount; i++) {
      let acSize = 'small';
      let roomSize = spaceSize / roomCount;
      
      if (roomSize > 30) acSize = 'large';
      else if (roomSize > 20) acSize = 'medium';
      
      // Select appropriate AC model
      let acModel;
      if (acSize === 'small') {
        acModel = sampleProducts.find(p => p.name.includes('MSZ-AP25VG') || p.name.includes('FTXM25R'));
      } else if (acSize === 'medium') {
        acModel = sampleProducts.find(p => p.name.includes('Standard Plus') || p.name.includes('Wind-Free'));
      } else {
        acModel = sampleProducts.find(p => p.name.includes('MSZ-AP') || p.name.includes('FTXM'));
      }
      
      if (acModel) {
        products.push({
          name: acModel.name,
          qty: 1,
          unitPrice: acModel.unitPrice
        });
      }
    }
    
    // Add installation services
    const installationService = sampleServices.find(s => s.name.includes('Montaż klimatyzacji ściennej'));
    if (installationService) {
      services.push({
        id: installationService.id,
        name: installationService.name,
        price: installationService.price * roomCount
      });
    }
    
    // Add piping
    const pipingLength = Math.max(5, Math.ceil(spaceSize / 10)); // Estimate piping length
    const piping = sampleProducts.find(p => p.name.includes('Rura miedziana') && p.name.includes('1/4'));
    if (piping) {
      products.push({
        name: piping.name,
        qty: pipingLength,
        unitPrice: piping.unitPrice
      });
    }
    
    // Add insulation
    const insulation = sampleProducts.find(p => p.name.includes('Izolacja termiczna') && p.name.includes('1/4'));
    if (insulation) {
      products.push({
        name: insulation.name,
        qty: pipingLength,
        unitPrice: insulation.unitPrice
      });
    }
    
    // Add refrigerant
    const refrigerant = sampleProducts.find(p => p.name.includes('Czynnik chłodniczy R32'));
    if (refrigerant) {
      products.push({
        name: refrigerant.name,
        qty: Math.ceil(roomCount * 0.5), // Estimate refrigerant amount
        unitPrice: refrigerant.unitPrice
      });
    }
    
    // Add mounting bracket
    const bracket = sampleProducts.find(p => p.name.includes('Uchwyt ścienny'));
    if (bracket) {
      products.push({
        name: bracket.name,
        qty: roomCount,
        unitPrice: bracket.unitPrice
      });
    }
    
    // Add WiFi module if it's a new building
    if (isNewBuilding) {
      const wifiModule = sampleProducts.find(p => p.name.includes('Moduł WiFi'));
      if (wifiModule) {
        products.push({
          name: wifiModule.name,
          qty: roomCount,
          unitPrice: wifiModule.unitPrice
        });
      }
    }
    
    // Add additional services
    const pipingService = sampleServices.find(s => s.name.includes('Wykonanie instalacji freonowej (do 3m)'));
    if (pipingService) {
      services.push({
        id: pipingService.id,
        name: pipingService.name,
        price: pipingService.price * roomCount
      });
    }
    
    const drainageService = sampleServices.find(s => s.name.includes('Wykonanie odpływu skroplin (do 3m)'));
    if (drainageService) {
      services.push({
        id: drainageService.id,
        name: drainageService.name,
        price: drainageService.price * roomCount
      });
    }
    
    const startupService = sampleServices.find(s => s.name.includes('Uruchomienie i test systemu klimatyzacji'));
    if (startupService) {
      services.push({
        id: startupService.id,
        name: startupService.name,
        price: startupService.price
      });
    }
    
    const trainingService = sampleServices.find(s => s.name.includes('Szkolenie użytkownika'));
    if (trainingService) {
      services.push({
        id: trainingService.id,
        name: trainingService.name,
        price: trainingService.price
      });
    }
    
    // Add maintenance package
    const maintenanceService = sampleServices.find(s => s.name.includes('Pakiet serwisowy - 2 przeglądy'));
    if (maintenanceService) {
      services.push({
        id: maintenanceService.id,
        name: maintenanceService.name,
        price: maintenanceService.price
      });
    }
  }
  
  if (needsHeatPump) {
    // Select heat pump based on space size
    let heatPumpModel;
    if (spaceSize > 150) {
      heatPumpModel = sampleProducts.find(p => p.name.includes('Daikin Altherma'));
    } else if (spaceSize > 100) {
      heatPumpModel = sampleProducts.find(p => p.name.includes('Mitsubishi Ecodan'));
    } else {
      heatPumpModel = sampleProducts.find(p => p.name.includes('Panasonic Aquarea'));
    }
    
    if (heatPumpModel) {
      products.push({
        name: heatPumpModel.name,
        qty: 1,
        unitPrice: heatPumpModel.unitPrice
      });
    }
    
    // Add installation service
    const installationService = sampleServices.find(s => s.name.includes('Montaż pompy ciepła'));
    if (installationService) {
      services.push({
        id: installationService.id,
        name: installationService.name,
        price: installationService.price
      });
    }
    
    // Add startup service
    const startupService = sampleServices.find(s => s.name.includes('Uruchomienie i test pompy ciepła'));
    if (startupService) {
      services.push({
        id: startupService.id,
        name: startupService.name,
        price: startupService.price
      });
    }
    
    // Add extended warranty
    const warrantyService = sampleServices.find(s => s.name.includes('Rozszerzona gwarancja'));
    if (warrantyService) {
      services.push({
        id: warrantyService.id,
        name: warrantyService.name,
        price: warrantyService.price
      });
    }
  }
  
  if (needsRecuperation) {
    // Select recuperator based on space size
    let recuperatorModel;
    if (spaceSize > 150) {
      recuperatorModel = sampleProducts.find(p => p.name.includes('Daikin VAM'));
    } else if (spaceSize > 100) {
      recuperatorModel = sampleProducts.find(p => p.name.includes('Thessla Green'));
    } else {
      recuperatorModel = sampleProducts.find(p => p.name.includes('Vents VUT'));
    }
    
    if (recuperatorModel) {
      products.push({
        name: recuperatorModel.name,
        qty: 1,
        unitPrice: recuperatorModel.unitPrice
      });
    }
    
    // Add installation service
    const installationService = sampleServices.find(s => s.name.includes('Montaż rekuperacji'));
    if (installationService) {
      services.push({
        id: installationService.id,
        name: installationService.name,
        price: installationService.price
      });
    }
    
    // Add startup service
    const startupService = sampleServices.find(s => s.name.includes('Uruchomienie i test rekuperacji'));
    if (startupService) {
      services.push({
        id: startupService.id,
        name: startupService.name,
        price: startupService.price
      });
    }
  }
  
  // If no specific system was mentioned, recommend based on space size
  if (!needsAC && !needsHeatPump && !needsRecuperation) {
    // Default to AC for small spaces
    if (spaceSize < 100) {
      const acModel = sampleProducts.find(p => p.name.includes('MSZ-AP25VG'));
      if (acModel) {
        products.push({
          name: acModel.name,
          qty: Math.max(1, Math.ceil(roomCount / 2)),
          unitPrice: acModel.unitPrice
        });
      }
      
      const installationService = sampleServices.find(s => s.name.includes('Montaż klimatyzacji ściennej'));
      if (installationService) {
        services.push({
          id: installationService.id,
          name: installationService.name,
          price: installationService.price * Math.max(1, Math.ceil(roomCount / 2))
        });
      }
    } 
    // Recommend heat pump for larger spaces
    else {
      const heatPumpModel = sampleProducts.find(p => p.name.includes('Mitsubishi Ecodan'));
      if (heatPumpModel) {
        products.push({
          name: heatPumpModel.name,
          qty: 1,
          unitPrice: heatPumpModel.unitPrice
        });
      }
      
      const installationService = sampleServices.find(s => s.name.includes('Montaż pompy ciepła'));
      if (installationService) {
        services.push({
          id: installationService.id,
          name: installationService.name,
          price: installationService.price
        });
      }
    }
  }
  
  return { products, services };
}

export async function POST(request: Request) {
  try {
    const { prompt, customerName } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would call an AI service
    // For now, we'll use our rule-based system
    const suggestions = analyzeCustomerNeeds(prompt, customerName);
    
    return NextResponse.json(suggestions);
  } catch (error: any) {
    console.error('Error generating AI pricing suggestions:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}