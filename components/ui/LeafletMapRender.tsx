import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const ACTIVE_ENERGY_CITIES = [
  { id: 1, city: "Cambuci", state: "RJ", lat: -21.5762274, lng: -41.9122930 },
  { id: 2, city: "Itaocara", state: "RJ", lat: -21.672064, lng: -42.077047 },
  { id: 3, city: "São Fidélis", state: "RJ", lat: -21.646697, lng: -41.748905 },
  { id: 4, city: "Aperibé", state: "RJ", lat: -21.6211928, lng: -42.1028167 },
  { id: 5, city: "Pádua", state: "RJ", lat: -21.5390000, lng: -42.1816000 },
  { id: 6, city: "Rio de Janeiro", state: "RJ", lat: -22.9110137, lng: -43.2093727 },
  { id: 7, city: "Saquarema", state: "RJ", lat: -22.9257974, lng: -42.5076330 }
];

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
  
  useEffect(() => {
    // Solução para bug crônico de icones do Leaflet com Webpack/Next
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  }, []);

  const markerIcon = createCustomIcon();
  const mapBounds = L.latLngBounds(
    ACTIVE_ENERGY_CITIES.map(({ lat, lng }) => [lat, lng] as [number, number])
  );

  return (
    <MapContainer 
      bounds={mapBounds}
      boundsOptions={{ padding: [32, 32] }}
      zoomControl={true}
      scrollWheelZoom={false} // Evita zoar o scroll da página do infeliz
      className="w-full h-full bg-slate-50 dark:bg-[#0a0f1c]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {ACTIVE_ENERGY_CITIES.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lng]} icon={markerIcon}>
          <Popup 
             className="custom-popup" 
             closeButton={false}
          >
            <div className="bg-[var(--theme-popup-bg)] border border-emerald-500/30 p-3 rounded-lg shadow-xl font-mono min-w-[140px] text-[var(--theme-text)]">
               <h3 className="font-bold text-sm mb-1 text-[var(--theme-text)]">{location.city} — {location.state}</h3>
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
      
      {/* Correção CSS pro Popup feio nativo do Leaflet */}
      <style dangerouslySetInnerHTML={{__html: `
                .leaflet-popup-content-wrapper { background: transparent; padding: 0; box-shadow: none; border-radius: 0.5rem; }
        .leaflet-popup-content { margin: 0; }
        .leaflet-popup-tip-container { display: none; }
        
        /* Auto Light Mode Map Conversion (CSS Invert if NOT dark mode) */
        html.dark .leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(85%) sepia(20%) hue-rotate(190deg); }
        html:not(.dark) .leaflet-tile-pane { filter: grayscale(100%) brightness(105%) contrast(85%); }
        html:not(.dark) { --theme-popup-bg: #ffffff; --theme-text: #060b14; }
        html.dark { --theme-popup-bg: #0a0f1c; --theme-text: #ffffff; }
      
        /* Estilização Customizada dos Botões de Zoom do Leaflet (+/-) para não parecerem feios/genéricos */
        .leaflet-bar { box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 0.5rem !important; overflow: hidden; }
        .leaflet-bar a { background-color: #0a0f1c !important; color: #10b981 !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; width: 34px !important; height: 34px !important; line-height: 34px !important; transition: all 0.2s; }
        .leaflet-bar a:hover { background-color: #121b2b !important; color: #fff !important; }
        .leaflet-bar a.leaflet-disabled { background-color: #0a0f1c !important; color: rgba(255,255,255,0.2) !important; }
      `}} />

    </MapContainer>
  );
}
