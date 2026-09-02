import { LazyLeafletMap } from "@/components/ui/LazyLeafletMap";

export default function RegionalMapSection() {
  return (
    <section id="mapa-regional" className="relative py-24 overflow-hidden bg-slate-50 dark:bg-navy-950 border-t border-navy-900/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="font-mono text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-3">
            Energia em Operação
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 dark:text-white mb-6 text-balance">
            Energia solar ativa em <span className="text-emerald-500">várias cidades do Rio de Janeiro.</span>
          </h2>
          <p className="text-navy-600 dark:text-text-secondary text-lg">
            Cambuci, Itaocara, São Fidélis, Aperibé, Pádua, Rio de Janeiro e Saquarema. Os pontos ficam no centro aproximado de cada município para preservar o endereço exato dos clientes.
          </p>
        </div>

        {/* Container do Mapa Real */}
        <div className="relative w-full max-w-5xl mx-auto aspect-square sm:aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden glass border border-emerald-500/20 bg-slate-100 dark:bg-[#0a0f1c] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 z-0 map-filter-dark">
            <LazyLeafletMap />
          </div>


          {/* Sombreamento interno Edge - Frame de vidro */}
          <div className="absolute inset-0 z-[500] pointer-events-none rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] border border-white/5" />
        </div>

      </div>
      {/* Classe auxiliar global temporária para aplicar filtro dark em tiles claros se a url cair, reforçando a imersão */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-container { background: transparent !important; font-family: inherit; }
        .dark .leaflet-container { background: #0a0f1c !important;}
      `}} />
    </section>
  );
}
