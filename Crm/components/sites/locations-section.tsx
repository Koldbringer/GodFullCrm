"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Building, Home, ListFilter, MapPin } from "lucide-react";
import { nanoid } from "nanoid";
import * as React from "react";

// Typy dzielnic
enum District {
  MOKOTOW = "Mokotów",
  SRODMIESCIE = "Śródmieście",
  WOLA = "Wola",
  ZOLIBORZ = "Żoliborz",
  OCHOTA = "Ochota",
  URSYNOW = "Ursynów",
  WILANOW = "Wilanów",
  PRAGA_POLUDNIE = "Praga-Południe",
  PRAGA_POLNOC = "Praga-Północ",
  BIELANY = "Bielany",
}

// Typy budynków
enum BuildingType {
  APARTMENT = "Apartament",
  HOUSE = "Dom",
  VILLA = "Willa",
  PENTHOUSE = "Penthouse",
  STUDIO = "Kawalerka",
  LOFT = "Loft",
}

// Typ filtra
enum FilterType {
  DISTRICT = "Dzielnica",
  BUILDING_TYPE = "Typ budynku",
}

// Operator filtra
enum FilterOperator {
  IS = "to",
  IS_NOT = "nie jest",
  IS_ANY_OF = "jest jednym z",
}

// Interfejs opcji filtra
interface FilterOption {
  name: District | BuildingType | FilterType;
  icon: React.ReactNode;
}

// Interfejs filtra
interface Filter {
  id: string;
  type: FilterType;
  operator: FilterOperator;
  value: string[];
}

// Ikona filtra
const FilterIcon = ({ type }: { type: FilterType | District | BuildingType }) => {
  switch (type) {
    case FilterType.DISTRICT:
      return <MapPin className="size-3.5" />;
    case FilterType.BUILDING_TYPE:
      return <Building className="size-3.5" />;
    case BuildingType.APARTMENT:
    case BuildingType.PENTHOUSE:
    case BuildingType.STUDIO:
    case BuildingType.LOFT:
      return <Building className="size-3.5 text-blue-500" />;
    case BuildingType.HOUSE:
    case BuildingType.VILLA:
      return <Home className="size-3.5 text-green-500" />;
    default:
      return <ListFilter className="size-3.5" />;
  }
};

const LocationsSection = ({
  onFilterChange,
  selectedDistricts = [],
  selectedBuildingTypes = [],
}: {
  onFilterChange?: (districts: string[], buildingTypes: string[]) => void
  selectedDistricts?: string[]
  selectedBuildingTypes?: string[]
}) => {
  const [districts, setDistricts] = React.useState<string[]>(selectedDistricts)
  const [buildingTypes, setBuildingTypes] = React.useState<string[]>(selectedBuildingTypes)

  const handleDistrictChange = (district: string) => {
    const updated = districts.includes(district)
      ? districts.filter((d) => d !== district)
      : [...districts, district]
    setDistricts(updated)
    onFilterChange?.(updated, buildingTypes)
  }
  const handleBuildingTypeChange = (type: string) => {
    const updated = buildingTypes.includes(type)
      ? buildingTypes.filter((t) => t !== type)
      : [...buildingTypes, type]
    setBuildingTypes(updated)
    onFilterChange?.(districts, updated)
  }

  return (
    <div className="space-y-6">
      {/* Panel filtrów */}
      <div className="flex flex-wrap gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ListFilter className="size-4" />
              Filtruj dzielnice
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Dzielnica</Label>
              {Object.values(District).map((district) => (
                <div key={district} className="flex items-center gap-2">
                  <Checkbox
                    id={district}
                    checked={districts.includes(district)}
                    onCheckedChange={() => handleDistrictChange(district)}
                  />
                  <Label htmlFor={district}>{district}</Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Building className="size-4" />
              Filtruj typ budynku
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Typ budynku</Label>
              {Object.values(BuildingType).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={type}
                    checked={buildingTypes.includes(type)}
                    onCheckedChange={() => handleBuildingTypeChange(type)}
                  />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* Dodatkowe filtry */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center gap-2">
          <Label htmlFor="search-locations">Szukaj:</Label>
          <Input
            id="search-locations"
            placeholder="Wyszukaj lokalizację..."
            className="w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="sort-by">Sortuj wg:</Label>
          <Select defaultValue="name">
            <SelectTrigger id="sort-by" className="w-40">
              <SelectValue placeholder="Wybierz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nazwa</SelectItem>
              <SelectItem value="address">Adres</SelectItem>
              <SelectItem value="devices">Liczba urządzeń</SelectItem>
              <SelectItem value="last-visit">Ostatnia wizyta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter">Status:</Label>
          <Select defaultValue="all">
            <SelectTrigger id="status-filter" className="w-40">
              <SelectValue placeholder="Wybierz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="active">Aktywne</SelectItem>
              <SelectItem value="service-needed">Wymaga serwisu</SelectItem>
              <SelectItem value="inactive">Nieaktywne</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lokalizacje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tutaj będą wyświetlane lokalizacje po filtrowaniu */}
        <div className="p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Apartament w Śródmieściu</h3>
            <Badge variant="outline">Apartament</Badge>
          </div>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <p className="text-sm">ul. Nowy Świat 15</p>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Urządzenia: 3</span>
            <span>Ostatnia wizyta: 15.03.2024</span>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Dom na Mokotowie</h3>
            <Badge variant="outline">Dom</Badge>
          </div>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <p className="text-sm">ul. Puławska 143</p>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Urządzenia: 5</span>
            <span>Ostatnia wizyta: 02.04.2024</span>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Penthouse na Woli</h3>
            <Badge variant="secondary">Penthouse</Badge>
          </div>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <p className="text-sm">ul. Kasprzaka 31</p>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Urządzenia: 4</span>
            <span>Ostatnia wizyta: 10.04.2024</span>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Kawalerka na Ursynowie</h3>
            <Badge>Kawalerka</Badge>
          </div>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <p className="text-sm">ul. Nugat 9</p>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Urządzenia: 1</span>
            <span>Ostatnia wizyta: 05.03.2024</span>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Willa w Wilanowie</h3>
            <Badge variant="outline">Willa</Badge>
          </div>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <p className="text-sm">ul. Klimczaka 17</p>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Urządzenia: 8</span>
            <span>Ostatnia wizyta: 20.04.2024</span>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Loft na Pradze</h3>
            <Badge variant="destructive">Wymaga serwisu</Badge>
          </div>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <p className="text-sm">ul. Ząbkowska 12</p>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Urządzenia: 2</span>
            <span>Ostatnia wizyta: 01.02.2024</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationsSection;
