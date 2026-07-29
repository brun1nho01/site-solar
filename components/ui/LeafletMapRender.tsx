import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Lista Real das Cidades que você mapeou
const ACTIVE_PLANTS = [
  { id: 1, city: "Cambuci", state: "RJ", type: "Residencial", power: "8.4 kWp", lat: -21.5761, lng: -41.9114 },
  { id: 2, city: "Itaperuna", state: "RJ", type: "Comercial", power: "24.6 kWp", lat: -21.2064, lng: -41.8872 },
  { id: 3, city: "Campos dos Goytacazes", state: "RJ", type: "Agronegócio", power: "45.0 kWp", lat: -21.7538, lng: -41.3236 },
  { id: 4, city: "Palma", state: "MG", type: "Residencial", power: "12.2 kWp", lat: -21.3789, lng: -42.3117 },
  { id: 5, city: "Macaé", state: "RJ", type: "Comercial", power: "18.5 kWp", lat: -22.3787, lng: -41.7770 },
  { id: 6, city: "Pádua", state: "RJ", type: "Residencial", power: "7.2 kWp", lat: -21.5367, lng: -42.1814 }
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
    delete (L.Icon.Default.prototype as any)._getIconUrl;
  }, []);

  const markerIcon = createCustomIcon();

  // Centro do Triângulo Rio/Leste MG
  const centerLat = -21.65;
  const centerLng = -41.80;

  return (
    <MapContainer 
      center={[centerLat, centerLng]} 
      zoom={8} 
      zoomControl={true}
      scrollWheelZoom={false} // Evita zoar o scroll da página do infeliz
      className="w-full h-full bg-slate-50 dark:bg-[#0a0f1c]"
    >
      {/* 
        TileLayer estético "CartoDB Dark Matter" gratuito. 
        Muda tudo! Fica escuro, minimalista, estilo radar de guerra ou aviação, sem nomes sujos e poluição colorida.
      */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {ACTIVE_PLANTS.map((plant) => (
        <Marker key={plant.id} position={[plant.lat, plant.lng]} icon={markerIcon}>
          <Popup 
             className="custom-popup" 
             closeButton={false}
          >
            <div className="bg-[var(--theme-popup-bg)] border border-emerald-500/30 p-3 rounded-lg shadow-xl font-mono min-w-[140px] text-[var(--theme-text)]">
               <h3 className="font-bold text-sm mb-1 text-[var(--theme-text)]">{plant.city}-{plant.state}</h3>
               <div className="flex flex-col gap-1 text-[10px]">
                 <span className="text-emerald-400 uppercase tracking-widest leading-none mt-1 border-t border-white/10 pt-1.5 flex justify-between pr-2">
                   Tipo <strong className="text-[var(--theme-text)]">{plant.type}</strong>
                 </span>
                 <span className="text-gold-400 uppercase tracking-widest leading-none flex justify-between pr-2">
                   Potência <strong className="text-[var(--theme-text)] bg-gold-400/20 px-1 py-0.5 rounded">{plant.power}</strong>
                 </span>
               </div>
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
