"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, RefreshCw, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface HeatmapData {
  lat: number;
  lng: number;
  intensity: number;
}

interface HeatmapMapProps {
  sites: { lat: number; lng: number; district?: string }[];
  heatmapData?: HeatmapData[];
}

export function HeatmapMap({ sites, heatmapData = [] }: HeatmapMapProps) {
  // Prosta symulacja heatmapy na mapie Warszawy
  // Wersja demo: gradientowe kółka na "mapie"
  const mapRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Skala mapy (symulacja)
  const minLat = 52.1;
  const maxLat = 52.35;
  const minLng = 20.85;
  const maxLng = 21.2;

  const getPosition = (lat: number, lng: number) => {
    const left = ((lng - minLng) / (maxLng - minLng)) * 100;
    const top = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { left: `${left}%`, top: `${top}%` };
  };

  return (
    <div className="w-full h-[500px] rounded-md border bg-muted relative overflow-hidden">
      {/* Tło mapy Warszawy (symulacja) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-200" />
      {/* Heatmapa */}
      {heatmapData.map((point, idx) => {
        const pos = getPosition(point.lat, point.lng);
        const color = `rgba(255,0,0,${0.1 + point.intensity * 0.5})`;
        const size = 70 + point.intensity * 100;
        return (
          <div
            key={idx}
            className="absolute rounded-full pointer-events-none"
            style={{
              ...pos,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              transform: "translate(-50%,-50%)",
              zIndex: 2,
            }}
          />
        );
      })}
      {/* Pinezki lokalizacji */}
      {sites.map((site, idx) => {
        const pos = getPosition(site.lat, site.lng);
        return (
          <MapPin
            key={idx}
            className="absolute text-primary drop-shadow-md"
            style={{ ...pos, zIndex: 3, transform: "translate(-50%,-100%)" }}
            size={28}
          />
        );
      })}
    </div>
  );
}
