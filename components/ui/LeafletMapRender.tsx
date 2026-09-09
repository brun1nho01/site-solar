"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ArrowClockwise, MapTrifold } from "@phosphor-icons/react";
import L from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACTIVE_ENERGY_CITIES } from "@/lib/active-energy-cities";

// O custom marker usando HTML puro via DivIcon (estética W.Lima: sem as imgs tradicionais pesadas do Leaflet azulzinho)
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="width: 30px; height: 30px; position: relative; display: flex; align-items: center; justify-content: center; margin-left: -15px; margin-top: -15px;">
        <div style="position: absolute; width: 30px; height: 30px; background-color: rgba(16, 185, 129, 0.2); border-radius: 50%; border: 1px solid rgba(16, 185, 129, 0.3); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 12px; height: 12px; background-color: #10b981; border: 2px solid #060b14; border-radius: 50%; box-shadow: 0 0 15px rgba(16,185,129,0.8); z-index: 10;"></div>
      </div>
    `,
    iconSize: [0, 0], // Trick: 0,0 forces the wrapper constraint to null, letting negative margins handle the explicit center.
    iconAnchor: [0, 0],
    popupAnchor: [0, -15],
  });
};

export default function LeafletMapRender() {
  const [tileLayerKey, setTileLayerKey] = useState(0);
  const [tileStatus, setTileStatus] = useState<"loading" | "ready" | "error">("loading");
  const tileErrorCountRef = useRef(0);

  useEffect(() => {
    // Solução para bug crônico de icones do Leaflet com Webpack/Next
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  }, []);

  const handleTileLoad = useCallback(() => {
    setTileStatus((currentStatus) => currentStatus === "loading" ? "ready" : currentStatus);
  }, []);

  const handleTileError = useCallback(() => {
    tileErrorCountRef.current += 1;
    if (tileErrorCountRef.current >= 3) setTileStatus("error");
  }, []);

  const handleTileRetry = useCallback(() => {
    tileErrorCountRef.current = 0;
    setTileStatus("loading");
    setTileLayerKey((currentKey) => currentKey + 1);
  }, []);

  const markerIcon = createCustomIcon();
  const mapBounds = L.latLngBounds(
    ACTIVE_ENERGY_CITIES.map(({ lat, lng }) => [lat, lng] as [number, number])
  );

  return (
    <div className="relative h-full w-full">
      <MapContainer
        bounds={mapBounds}
        boundsOptions={{ padding: [32, 32] }}
        zoomControl={true}
        scrollWheelZoom={false}
        className="h-full w-full bg-slate-50 dark:bg-[#0a0f1c]"
      >
        <TileLayer
          key={tileLayerKey}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          eventHandlers={{
            tileload: handleTileLoad,
            tileerror: handleTileError,
          }}
        />

        {ACTIVE_ENERGY_CITIES.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={markerIcon}
            alt={`Projeto de energia solar em ${location.city}, ${location.state}`}
            title={`Projeto de energia solar em ${location.city}, ${location.state}`}
          >
            <Popup
              className="custom-popup"
              closeButton={false}
            >
              <div className="min-w-[140px] rounded-lg border border-emerald-500/30 bg-[var(--theme-popup-bg)] p-3 font-mono text-[var(--theme-text)] shadow-xl">
                <h3 className="mb-1 text-sm font-bold text-[var(--theme-text)]">{location.city} — {location.state}</h3>
                <p className="border-t border-white/10 pt-1.5 text-[10px] font-bold uppercase leading-relaxed tracking-widest text-emerald-400">
                  Energia solar ativa
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-[var(--theme-text)] opacity-70">
                  Ponto aproximado no centro do município.
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      
        <style dangerouslySetInnerHTML={{__html: `
          .leaflet-popup-content-wrapper { background: transparent; padding: 0; box-shadow: none; border-radius: 0.5rem; }
          .leaflet-popup-content { margin: 0; }
          .leaflet-popup-tip-container { display: none; }
          html.dark .leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(85%) sepia(20%) hue-rotate(190deg); }
          html:not(.dark) .leaflet-tile-pane { filter: grayscale(100%) brightness(105%) contrast(85%); }
          html:not(.dark) { --theme-popup-bg: #ffffff; --theme-text: #060b14; }
          html.dark { --theme-popup-bg: #0a0f1c; --theme-text: #ffffff; }
          .leaflet-bar { box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 0.5rem !important; overflow: hidden; }
          .leaflet-bar a { background-color: #0a0f1c !important; color: #10b981 !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; width: 44px !important; height: 44px !important; line-height: 44px !important; transition: all 0.2s; }
          .leaflet-bar a:hover { background-color: #121b2b !important; color: #fff !important; }
          .leaflet-bar a.leaflet-disabled { background-color: #0a0f1c !important; color: rgba(255,255,255,0.2) !important; }
        `}} />
      </MapContainer>

      {tileStatus === "error" && (
        <div className="pointer-events-none absolute inset-4 z-[700] flex items-center justify-center">
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-auto w-full max-w-sm rounded-2xl bg-white/95 p-5 text-center shadow-[0_16px_40px_rgba(6,11,20,0.2)] ring-1 ring-navy-900/10 backdrop-blur-md dark:bg-navy-950/95 dark:ring-white/10"
          >
            <MapTrifold aria-hidden="true" weight="duotone" className="mx-auto mb-3 h-8 w-8 text-success-copy" />
            <p className="font-display text-lg font-bold text-navy-950 dark:text-white">Mapa base indisponível</p>
            <p className="mx-auto mt-2 max-w-[34ch] text-sm leading-relaxed text-navy-600 dark:text-text-secondary">
              Os pontos continuam indicando o centro aproximado das cidades atendidas.
            </p>
            <button
              type="button"
              onClick={handleTileRetry}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-800 focus-visible:ring-offset-2 dark:bg-white dark:text-navy-950 dark:hover:bg-slate-100 dark:focus-visible:ring-offset-navy-950"
            >
              <ArrowClockwise aria-hidden="true" weight="bold" className="h-4 w-4" />
              Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
