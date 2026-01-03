"use client";
import { useState, useMemo } from "react";
import { Bus, MapPin, Clock, Navigation, RefreshCw, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// @ts-ignore
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, loading: () => <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">Loading map...</div> });

interface Props { buses: any[]; }

export default function MapClient({ buses }: Props) {
  const [selected, setSelected] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const busesWithLocation = useMemo(() => buses?.filter((b: any) => (b?.gpsLocations?.length ?? 0) > 0) ?? [], [buses]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const mapData: any[] = useMemo(() => {
    const data: any[] = [];
    busesWithLocation.forEach((bus: any) => {
      const loc = bus?.gpsLocations?.[0];
      if (loc) {
        data.push({
          type: "scattermapbox",
          lat: [loc?.latitude ?? 0],
          lon: [loc?.longitude ?? 0],
          mode: "markers+text",
          marker: { size: 20, color: bus?.status === "ACTIVE" ? "#f59e0b" : "#6b7280", symbol: "bus" },
          text: [bus?.vehicleId ?? ""],
          textposition: "top center",
          textfont: { size: 12, color: "#1f2937" },
          name: bus?.vehicleId ?? "",
          hovertemplate: `<b>${bus?.vehicleId ?? ""}</b><br>Speed: ${loc?.speed?.toFixed?.(1) ?? 0} km/h<br>Last update: ${new Date(loc?.timestamp).toLocaleTimeString()}<extra></extra>`,
        });
      }
      if (bus?.route?.stops) {
        bus.route.stops.forEach((stop: any) => {
          data.push({
            type: "scattermapbox",
            lat: [stop?.latitude ?? 0],
            lon: [stop?.longitude ?? 0],
            mode: "markers",
            marker: { size: 10, color: "#3b82f6" },
            name: stop?.name ?? "",
            hovertemplate: `<b>${stop?.name ?? ""}</b><extra></extra>`,
            showlegend: false,
          });
        });
      }
    });
    return data;
  }, [busesWithLocation]);

  const centerLat = busesWithLocation?.[0]?.gpsLocations?.[0]?.latitude ?? 37.78;
  const centerLon = busesWithLocation?.[0]?.gpsLocations?.[0]?.longitude ?? -122.42;

  const layout: any = {
    mapbox: {
      style: "carto-positron",
      center: { lat: centerLat, lon: centerLon },
      zoom: 12,
    },
    margin: { t: 0, b: 0, l: 0, r: 0 },
    showlegend: false,
    hovermode: "closest",
  };

  const config: any = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["select2d", "lasso2d", "autoScale2d"],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Live Bus Map</h1>
          <p className="text-gray-500">View last known locations of all buses</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing} className="btn-primary flex items-center gap-2">
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            <div className="h-[500px]">
              {/* @ts-ignore */}
              <Plot data={mapData} layout={layout} config={config} style={{ width: "100%", height: "100%" }} useResizeHandler />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Buses</h3>
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
            {busesWithLocation?.map((bus: any) => {
              const loc = bus?.gpsLocations?.[0];
              return (
                <motion.div
                  key={bus?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelected(bus)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${selected?.id === bus?.id ? "bg-amber-100 border-2 border-amber-500" : "bg-white shadow-md hover:shadow-lg"}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bus?.status === "ACTIVE" ? "bg-amber-100" : "bg-gray-100"}`}>
                      <Bus className={bus?.status === "ACTIVE" ? "text-amber-600" : "text-gray-400"} size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{bus?.vehicleId}</p>
                      <p className="text-xs text-gray-500">{bus?.route?.name ?? "No Route"}</p>
                    </div>
                  </div>
                  {loc && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Gauge size={12} /> {loc?.speed?.toFixed?.(1) ?? 0} km/h
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Navigation size={12} /> {loc?.heading?.toFixed?.(0) ?? 0}°
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 col-span-2">
                        <Clock size={12} /> {new Date(loc?.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            }) ?? null}
            {busesWithLocation?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                <p>No buses with location data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
