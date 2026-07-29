"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  House as Home,
  Buildings as Building2,
  Tractor,
  Sun,
  MapPin,
  Bank as Landmark,
  Money as Banknote,
  CheckCircle as CheckCircle2,
  CaretRight as ChevronRight,
  ChatCircle as MessageCircle
} from "@phosphor-icons/react";

interface LeadFormProps {
  billValue: number;
}

type PropertyType = "" | "residencial" | "empresa" | "agronegocio";
type InstallLocation = "" | "solo" | "telhado";
type RoofType = "" | "metalico" | "ceramico" | "fibrocimento" | "laje";

interface FormData {
  cep: string;
  uf: string;
  propertyType: PropertyType;
  installLocation: InstallLocation;
  roofType: RoofType;
  wantsFinancing: string;
  name: string;
  email: string;
  lgpdConsent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface ExtendedWindow extends Window {
  gtag?: (event: string, action: string, data: object) => void;
}

const step1Schema = z.object({
  cep: z.string().refine((val) => val.replace(/\D/g, "").length === 8, "Informe um CEP válido."),
  propertyType: z.enum(["residencial", "empresa", "agronegocio"], { message: "Selecione o tipo." }),
  installLocation: z.enum(["solo", "telhado"], { message: "Selecione o local." }),
  roofType: z.string().optional(),
  wantsFinancing: z.enum(["sim", "nao"], { message: "Informe se deseja financiar." }),
}).superRefine((data, ctx) => {
  if (data.installLocation === "telhado" && !data.roofType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione o telhado.",
      path: ["roofType"],
    });
  }
});

const step2Schema = z.object({
  name: z.string().min(3, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido.").or(z.literal("")),
  lgpdConsent: z.literal(true, { message: "Aceite os termos para continuar." }),
});

/* ── Gráfico SVG artesanal — 0KB de dependência extra ── */
function CashFlowChart({ data, paybackYear }: { data: { year: number; saldo: number }[]; paybackYear: number }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  
  const W = 560;
  const H = 240;
  const pad = { top: 30, right: 30, bottom: 40, left: 60 };

  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const minY = Math.min(...data.map((d) => d.saldo));
  const maxY = Math.max(...data.map((d) => d.saldo));
  const rangeY = maxY - minY || 1;

  const x = (year: number) => pad.left + (year / 25) * innerW;
  const y = (val: number) => pad.top + innerH - ((val - minY) / rangeY) * innerH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(d.year)} ${y(d.saldo)}`).join(" ");
  const areaPath = `${linePath} L ${x(25)} ${y(Math.max(minY, 0))} L ${x(0)} ${y(Math.max(minY, 0))} Z`;
  
  // Custom Y Ticks based on max value to show clean steps (0, meio, max)
  const yTicks = [
    { val: minY < 0 ? minY : 0, label: minY < 0 ? `-${Math.abs(Math.round(minY/1000))}k` : "0", cy: y(minY < 0 ? minY : 0) },
    { val: maxY/2, label: `${Math.round((maxY/2)/1000)}k`, cy: y(maxY/2) },
    { val: maxY, label: `${Math.round(maxY/1000)}k`, cy: y(maxY) }
  ];
  
  // Custom X Ticks (Ano 0, 5, 10, 15, 20, 25)
  const xTicks = [0, 5, 10, 15, 20, 25];

  const zeroY = y(0);
  
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const ratioX = (pointerX - pad.left) / innerW;
    const hoverYear = Math.max(0, Math.min(25, Math.round(ratioX * 25)));
    
    let closestIndex = data.findIndex(d => d.year === hoverYear);
    if(closestIndex === -1 && data.length > 0) closestIndex = data.length - 1;
    
    setActiveIdx(closestIndex);
  };
  
  const handlePointerLeave = () => setActiveIdx(null);
  const activeData = activeIdx !== null && activeIdx >= 0 ? data[activeIdx] : null;

  return (
    <div className="relative w-full h-full">
      <svg 
        viewBox={`0 0 ${W} ${H}`} 
        className="w-full h-full cursor-crosshair touch-none" 
        preserveAspectRatio="xMidYMid meet"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerMove}
      >
        <defs>
          <linearGradient id="cashGradInteractive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" stopOpacity={0.25} />
            <stop offset="70%" stopColor="#facc15" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
          </linearGradient>
          <filter id="glowLine">
             <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>

        {/* Eixo Y - Labels Laterais e Grades Verticais */}
        {yTicks.map((tick, i) => (
          <g key={`y-${i}`}>
            <text x={pad.left - 10} y={tick.cy + 4} textAnchor="end" className="fill-navy-500 dark:fill-text-muted text-[10px] font-mono opacity-70 cursor-default select-none pointer-events-none">
              R$ {tick.label}
            </text>
            <line x1={pad.left} y1={tick.cy} x2={W - pad.right} y2={tick.cy} stroke="currentColor" strokeOpacity={0.06} strokeDasharray="3 4" />
          </g>
        ))}

        {/* Eixo X - Anos (Labels) */}
        {xTicks.map((tick, i) => (
          <text key={`x-${i}`} x={x(tick)} y={H - 10} textAnchor="middle" className="fill-navy-500 dark:fill-text-muted text-[10px] font-mono opacity-70 cursor-default select-none pointer-events-none">
            {tick}a
          </text>
        ))}
        {/* Baseline do gráfico */}
        <line x1={pad.left} y1={H - pad.bottom} x2={W - pad.right} y2={H - pad.bottom} stroke="currentColor" strokeOpacity={0.15} />

        {/* Linha Zero (Breakeven - Onde empatou) */}
        {minY < 0 && maxY > 0 && (
          <line x1={pad.left} y1={zeroY} x2={W - pad.right} y2={zeroY} stroke="#10b981" strokeOpacity={0.3} strokeDasharray="4 2" />
        )}

        <path d={areaPath} fill="url(#cashGradInteractive)" className="transition-opacity duration-300" opacity={activeIdx !== null ? 0.8 : 0.6} />

        <path 
           d={linePath} 
           fill="none" 
           stroke={activeIdx !== null ? "#fef08a" : "#facc15"} 
           strokeWidth={3} 
           strokeLinecap="round" 
           strokeLinejoin="round" 
           filter="url(#glowLine)"
           className="transition-colors duration-300 pointer-events-none"
        />

        {activeData && (
          <g className="pointer-events-none transition-all duration-100 ease-out">
            <line 
              x1={x(activeData.year)} 
              y1={pad.top - 10} 
              x2={x(activeData.year)} 
              y2={H - pad.bottom} 
              stroke="#facc15" 
              strokeWidth={1} 
              strokeOpacity={0.5} 
              strokeDasharray="3 2" 
            />
            <circle 
              cx={x(activeData.year)} 
              cy={y(activeData.saldo)} 
              r={5} 
              fill="#facc15" 
              stroke="#0f172a" 
              strokeWidth={2}
              className="drop-shadow-md"
            />
          </g>
        )}
      </svg>
      
      <AnimatePresence>
        {activeData && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 pointer-events-none"
            style={{
               left: `max(60px, min(calc(100% - 70px), ${(x(activeData.year) / W) * 100}%))`,
               top: "10px",
               transform: "translate(-50%, -100%)"
            }}
          >
             <div className="bg-navy-950/90 dark:bg-black/90 backdrop-blur-md border border-gold-400/30 shadow-[0_4px_15px_rgba(0,0,0,0.5)] rounded-lg px-3 py-1.5 flex flex-col items-center">
              <span className="text-[10px] uppercase text-navy-400 dark:text-text-muted font-mono tracking-widest leading-none mb-1">Ano {activeData.year}</span>
              <span className={`font-mono font-bold text-sm leading-none whitespace-nowrap ${activeData.saldo >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                R$ {activeData.saldo.toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-gold-400/30 mx-auto mt-[1px]"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LeadForm({ billValue }: LeadFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 3 = Sucesso
  const [formData, setFormData] = useState<FormData>({
    cep: "",
    uf: "",
    propertyType: "",
    installLocation: "",
    roofType: "",
    wantsFinancing: "",
    name: "",
    email: "",
    lgpdConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // ── Máscara e Busca de CEP ──
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    
    let formatted = value;
    if (value.length > 5) formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    
    setFormData(prev => ({ ...prev, cep: formatted }));

    if (value.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData((prev) => ({ ...prev, uf: data.uf }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  // ── Geração de Dados pro Gráfico (25 anos) ──
  const yearlySavings = billValue * 12 * 0.95;
  
  // Escala de preço baseada no tamanho do sistema (Lei da Oferta - economia de escala)
  // Valores corrigidos para a realidade de mercado e considerando que grandes contas (comerciais)
  // possuem taxa de demanda contratada, logo o sistema cresce de forma muito não-linear.
  let multiplier = 25;
  if (billValue <= 300) multiplier = 35; // Até ~10.5k
  else if (billValue <= 600) multiplier = 30; // Até ~18k
  else if (billValue <= 1000) multiplier = 27; // Até ~27k
  else if (billValue <= 2000) multiplier = 30; // Até ~60k
  else if (billValue <= 3500) multiplier = 19; // Até ~66k
  else multiplier = 14; // Até ~70k (para conta de 5.000)

  const baseSystemCost = billValue * multiplier;
  
  // Estimativa: Financiamento adiciona ~35% de juros no Custo Total Efetivo (CET)
  const isFinanced = formData.wantsFinancing === "sim";
  const systemCost = isFinanced ? baseSystemCost * 1.35 : baseSystemCost;

  const total25Years = Array.from({ length: 25 }).reduce((acc: number, _, i) => acc + (yearlySavings * Math.pow(1.05, i)), 0) as number;
  
  let paybackYear = 0;

  const chartData = Array.from({ length: 26 }).map((_, year) => {
    if (year === 0) return { year, saldo: -systemCost };
    const savingsToDate = Array.from({ length: year }).reduce((acc: number, _, i) => {
      // Inflação da energia: ~5% ao ano | Degradação do painel: perda de ~0.5% ao ano na geração
      const energyInflation = Math.pow(1.05, i);
      const panelDegradation = Math.pow(0.995, i);
      return acc + (yearlySavings * energyInflation * panelDegradation);
    }, 0);
    const saldo = Math.round(savingsToDate - systemCost);
    
    // Identificar quando o saldo cruza a linha do zero (Payback)
    if (paybackYear === 0 && saldo >= 0) {
      paybackYear = year;
    }

    return { year, saldo };
  });

  const paybackText = paybackYear > 0 
    ? `O sistema se paga em aproximadamente ${paybackYear} anos${isFinanced ? ' (inclusos juros do financiamento)' : ''}.`
    : "Retorno financeiro a longo prazo.";

  // ── Navegação do Wizard ──
  const handleNextStep = () => {
    const result = step1Schema.safeParse(formData);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((i) => { if (i.path[0]) newErrors[i.path[0].toString()] = i.message; });
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = step2Schema.safeParse(formData);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((i) => { if (i.path[0]) newErrors[i.path[0].toString()] = i.message; });
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const economyFormatted = (yearlySavings).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const message = `Olá! Vim pelo site e quero meu estudo de viabilidade.
*Dados do Projeto:*
- Nome: ${formData.name}${formData.email ? `\n- E-mail: ${formData.email}` : ""}
- CEP: ${formData.cep} (${formData.uf})
- Imóvel: ${formData.propertyType}
- Instalação: ${formData.installLocation} ${formData.roofType ? `(${formData.roofType})` : ''}
- Financiamento: ${formData.wantsFinancing}
- Conta atual: R$ ${billValue},00/mês
- *Economia 1º Ano:* ${economyFormatted}`;

    const whatsappUrl = `https://wa.me/5522999618883?text=${encodeURIComponent(message)}`;
    
    // Tracking GA4
    const win = window as unknown as ExtendedWindow;
    if (typeof win !== "undefined" && typeof win.gtag === "function") {
      win.gtag("event", "lead_gerado_wizard", {
        value: yearlySavings,
        currency: "BRL",
        property_type: formData.propertyType,
      });
    }

    // Abre o WhatsApp SINCRONAMENTE (antes do await) para não ser bloqueado
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    await new Promise(r => setTimeout(r, 800)); // UI Loading
    setIsSubmitting(false);
    setStep(3);

    // Fallback: se o popup foi bloqueado, redireciona na mesma aba
    if (!whatsappWindow || whatsappWindow.closed) {
      window.location.href = whatsappUrl;
    }
  };

  // ── Renderização dos Passos ──
  return (
    <div className="w-full relative min-h-[400px]">
      <AnimatePresence mode="wait">
        
        {/* ================= STEP 1: QUALIFICAÇÃO ================= */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* CEP */}
            <div className="relative">
              <label className="text-sm text-text-secondary mb-1.5 block">CEP da Instalação</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleCepChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 text-navy-950 dark:text-white placeholder:text-navy-400 dark:placeholder:text-text-muted focus:border-gold-400 transition-colors"
                />
                {isLoadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {formData.uf && <p className="text-xs text-gold-400 mt-1">Estado: {formData.uf}</p>}
              {errors.cep && <p className="text-red-400 text-xs mt-1">{errors.cep}</p>}
            </div>

            {/* Tipo de Imóvel (Cards) */}
            <div>
              <label className="text-sm text-text-secondary mb-1.5 block">Tipo de Imóvel</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "residencial", icon: Home, label: "Residencial" },
                  { id: "empresa", icon: Building2, label: "Empresa" },
                  { id: "agronegocio", icon: Tractor, label: "Agro" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, propertyType: item.id as PropertyType })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      formData.propertyType === item.id
                        ? "border-gold-400 bg-gold-500/10 text-gold-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]"
                        : "border-white/10 bg-white/5 text-text-secondary hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
              {errors.propertyType && <p className="text-red-400 text-xs mt-1">{errors.propertyType}</p>}
            </div>

            {/* Local de Instalação (Cards) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-secondary mb-1.5 block">Onde instalar?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, installLocation: "telhado" })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      formData.installLocation === "telhado"
                        ? "border-gold-400 bg-gold-500/10 text-gold-400"
                        : "border-white/10 bg-white/5 text-text-secondary hover:bg-white/10"
                    }`}
                  >
                    <Home className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Telhado</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, installLocation: "solo", roofType: "" })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      formData.installLocation === "solo"
                        ? "border-gold-400 bg-gold-500/10 text-gold-400"
                        : "border-white/10 bg-white/5 text-text-secondary hover:bg-white/10"
                    }`}
                  >
                    <Sun className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Solo</span>
                  </button>
                </div>
                {errors.installLocation && <p className="text-red-400 text-xs mt-1">{errors.installLocation}</p>}
              </div>

              {/* Financiamento */}
              <div>
                <label className="text-sm text-text-secondary mb-1.5 block">Precisa financiar?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, wantsFinancing: "sim" })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      formData.wantsFinancing === "sim"
                        ? "border-gold-400 bg-gold-500/10 text-gold-400"
                        : "border-white/10 bg-white/5 text-text-secondary hover:bg-white/10"
                    }`}
                  >
                    <Landmark className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Sim</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, wantsFinancing: "nao" })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      formData.wantsFinancing === "nao"
                        ? "border-gold-400 bg-gold-500/10 text-gold-400"
                        : "border-white/10 bg-white/5 text-text-secondary hover:bg-white/10"
                    }`}
                  >
                    <Banknote className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Não</span>
                  </button>
                </div>
                {errors.wantsFinancing && <p className="text-red-400 text-xs mt-1">{errors.wantsFinancing}</p>}
              </div>
            </div>

            {/* Condicional Telhado */}
            {formData.installLocation === "telhado" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <label className="text-sm text-text-secondary mb-1.5 block">Qual o tipo de telhado?</label>
                <select
                  value={formData.roofType}
                  onChange={(e) => setFormData({ ...formData, roofType: e.target.value as RoofType })}
                  className="w-full px-4 py-3 rounded-xl bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 text-navy-950 dark:text-white focus:border-gold-400 outline-none"
                >
                  <option value="" disabled className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Selecione o telhado</option>
                  <option value="metalico" className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Metálico</option>
                  <option value="ceramico" className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Cerâmico / Barro</option>
                  <option value="fibrocimento" className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Fibrocimento (Eternit)</option>
                  <option value="laje" className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Laje Plana</option>
                </select>
                {errors.roofType && <p className="text-red-400 text-xs mt-1">{errors.roofType}</p>}
              </motion.div>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full py-4 mt-4 rounded-xl font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]"
            >
              Gerar Estudo de Viabilidade
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {/* ================= STEP 2: O ESTUDO (BLURRED) ================= */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold text-navy-950 dark:text-white flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Estudo Gerado com Sucesso!
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Veja a projeção do seu retorno financeiro.
              </p>
            </div>

            {/* Texto de Payback */}
            <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-3 text-center mb-2">
              <p className="text-sm font-semibold text-gold-400 flex items-center justify-center gap-1.5">
                <Sun className="w-4 h-4" />
                {paybackText}
              </p>
            </div>

            {/* O Gráfico — SVG custom (zero dependência) */}
            <div className="h-64 sm:h-72 w-full bg-navy-100/50 dark:bg-navy-950/30 rounded-xl p-4 pt-8 border border-navy-900/10 dark:border-white/5 relative overflow-hidden group mb-4">
              <div className="absolute top-2 left-4 z-10">
                <p className="text-xs text-navy-500 dark:text-text-muted font-mono uppercase tracking-wider font-semibold">Retorno Cumulativo do Caixa no Tempo (Deslize)</p>
              </div>
              <CashFlowChart data={chartData} paybackYear={paybackYear} />

              {/* O Blur Overlay na parte de baixo do gráfico */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50 dark:from-navy-900 to-transparent pointer-events-none" />
            </div>

            {/* Formulário de Contato */}
            <div className="pt-2 border-t border-navy-900/10 dark:border-white/10">
              <p className="text-sm text-navy-950 dark:text-white font-medium mb-3">Gostou da projeção? Receba um orçamento exato pelo WhatsApp:</p>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Seu Nome Completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 text-navy-950 dark:text-white placeholder:text-navy-400 dark:placeholder:text-text-muted text-sm focus:border-gold-400 transition-colors"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="E-mail (opcional)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 text-navy-950 dark:text-white placeholder:text-navy-400 dark:placeholder:text-text-muted text-sm focus:border-gold-400 transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <label className="flex items-start gap-3 cursor-pointer group mt-2">
                  <input
                    type="checkbox"
                    checked={formData.lgpdConsent}
                    onChange={(e) => setFormData({ ...formData, lgpdConsent: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-400 cursor-pointer"
                  />
                  <span className="text-xs text-text-muted leading-tight group-hover:text-text-secondary transition-colors">
                    Concordo em receber meu estudo de viabilidade e propostas comerciais da equipe via WhatsApp/Email.
                  </span>
                </label>
                {errors.lgpdConsent && <p className="text-red-400 text-xs mt-1">{errors.lgpdConsent}</p>}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 mt-2 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-wait"
                  style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-button)" }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Iniciando conversa...
                    </span>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Receber Proposta no WhatsApp
                    </>
                  )}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full text-center text-xs text-navy-400 dark:text-text-muted hover:text-navy-950 dark:hover:text-white mt-4 transition-colors"
                >
                  Voltar e alterar dados
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 3: SUCESSO ================= */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-navy-950 dark:text-white">
              Estudo Desbloqueado!
            </h3>
            <p className="text-navy-600 dark:text-text-secondary text-sm px-4">
              Nossa equipe acabou de receber seus dados. Uma nova aba do WhatsApp foi aberta para você falar diretamente conosco.
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
