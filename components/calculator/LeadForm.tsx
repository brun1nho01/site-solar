"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { z } from "zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import { createWhatsAppUrl, siteConfig } from "@/lib/site-config";
import {
  calculateSolarEstimate,
  formatCurrencyBRL,
  formatDecimalPTBR,
  type SolarEstimateResult,
} from "@/lib/solar-calculator";

interface LeadFormProps {
  estimate: SolarEstimateResult;
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

type CepStatus =
  | { type: "idle"; message: "" }
  | { type: "loading" | "success" | "error"; message: string };

interface WhatsAppFallback {
  url: string;
  estimateKey: string;
}

const fieldFocusIds: Record<keyof FormData, string> = {
  cep: "lead-cep",
  uf: "lead-cep",
  propertyType: "lead-property-residencial",
  installLocation: "lead-install-telhado",
  roofType: "lead-roof-type",
  wantsFinancing: "lead-financing-sim",
  name: "lead-name",
  email: "lead-email",
  lgpdConsent: "lead-consent",
};

function mapIssuesToErrors(issues: z.ZodIssue[]): FormErrors {
  const nextErrors: FormErrors = {};

  issues.forEach((issue) => {
    const field = issue.path[0];
    if (field) nextErrors[field.toString()] = issue.message;
  });

  return nextErrors;
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
  name: z.string().trim().min(3, "Informe seu nome completo.").max(100, "Use no máximo 100 caracteres no nome."),
  email: z.string().trim().max(254, "Use no máximo 254 caracteres no e-mail.").email("Informe um e-mail válido.").or(z.literal("")),
  lgpdConsent: z.literal(true, { message: "Aceite os termos para continuar." }),
});

/* ── Gráfico SVG artesanal — 0KB de dependência extra ── */
function CashFlowChart({ data }: { data: { year: number; saldo: number }[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  
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
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
            className="absolute z-20 pointer-events-none"
            style={{
               left: `max(60px, min(calc(100% - 70px), ${(x(activeData.year) / W) * 100}%))`,
               top: "10px",
               transform: "translate(-50%, -100%)"
            }}
          >
             <div className="bg-navy-950/90 dark:bg-black/90 backdrop-blur-md border border-gold-400/30 shadow-[0_4px_15px_rgba(0,0,0,0.5)] rounded-lg px-3 py-1.5 flex flex-col items-center">
              <span className="text-[10px] uppercase text-white/75 font-mono tracking-widest leading-none mb-1">Ano {activeData.year}</span>
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

export default function LeadForm({ estimate }: LeadFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 3 = Sucesso
  const shouldReduceMotion = useReducedMotion();
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
  const [announcement, setAnnouncement] = useState("Etapa 1 de 2: dados da instalação.");
  const [cepStatus, setCepStatus] = useState<CepStatus>({ type: "idle", message: "" });
  const [whatsappFallback, setWhatsappFallback] = useState<WhatsAppFallback | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const cepRequestRef = useRef<AbortController | null>(null);
  const whatsappOpenAttemptRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => stepTitleRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      cepRequestRef.current?.abort();
    };
  }, []);

  const clearFieldError = (field: keyof FormData) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) return currentErrors;

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
    clearFieldError(field);
    setWhatsappFallback(null);
    setCopyStatus("");
  };

  const reportValidationErrors = (nextErrors: FormErrors) => {
    const entries = Object.entries(nextErrors);
    const firstEntry = entries[0];

    setErrors(nextErrors);
    setAnnouncement(
      entries.length === 1
        ? `Há um campo para corrigir. ${firstEntry[1]}`
        : `Há ${entries.length} campos para corrigir. ${firstEntry[1]}`,
    );

    const firstField = firstEntry[0] as keyof FormData;
    window.requestAnimationFrame(() => {
      document.getElementById(fieldFocusIds[firstField])?.focus();
    });
  };

  const focusCurrentStepTitle = () => {
    stepTitleRef.current?.focus();
  };

  // ── Máscara e Busca de CEP ──
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    
    let formatted = value;
    if (value.length > 5) formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    
    cepRequestRef.current?.abort();
    cepRequestRef.current = null;
    setFormData((currentData) => ({ ...currentData, cep: formatted, uf: "" }));
    clearFieldError("cep");
    setCepStatus({ type: "idle", message: "" });
    setWhatsappFallback(null);
    setCopyStatus("");

    if (value.length === 8) {
      const controller = new AbortController();
      cepRequestRef.current = controller;
      setCepStatus({ type: "loading", message: "Consultando CEP..." });
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);

      try {
        const res = await fetch(`https://viacep.com.br/ws/${value}/json/`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`ViaCEP respondeu com status ${res.status}.`);

        const data: { erro?: boolean; uf?: string } = await res.json();
        if (controller.signal.aborted) return;

        if (data.erro || !data.uf) {
          setCepStatus({
            type: "error",
            message: "CEP não encontrado. Você pode continuar e confirmar a localização no atendimento.",
          });
          return;
        }

        setFormData((currentData) => ({ ...currentData, uf: data.uf ?? "" }));
        setCepStatus({ type: "success", message: `Estado encontrado: ${data.uf}.` });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          if (cepRequestRef.current !== controller) return;

          setCepStatus({
            type: "error",
            message: "A consulta do CEP demorou para responder. Você pode continuar e confirmar a localização no atendimento.",
          });
          return;
        }

        console.error("Erro ao buscar CEP", err);
        setCepStatus({
          type: "error",
          message: "Não foi possível consultar este CEP agora. Você pode continuar e confirmar a localização no atendimento.",
        });
      } finally {
        window.clearTimeout(timeoutId);
        if (cepRequestRef.current === controller) cepRequestRef.current = null;
      }
    }
  };

  const isFinanced = formData.wantsFinancing === "sim";
  const selectedEstimate = useMemo(
    () =>
      calculateSolarEstimate({
        monthlyBill: estimate.monthlyBill,
        monthlyConsumptionKwh:
          estimate.consumption.source === "informed"
            ? estimate.consumption.maximumKwh
            : null,
        paymentMethod: isFinanced ? "financing" : "cash",
        assumptions: estimate.assumptions,
      }),
    [estimate, isFinanced],
  );
  const estimateKey = `${selectedEstimate.monthlyBill}:${selectedEstimate.consumption.source}:${selectedEstimate.consumption.maximumKwh}:${selectedEstimate.paymentMethod}`;
  const chartData = selectedEstimate.projection.flatMap((point) =>
    point.balanceMidpoint === null
      ? []
      : [{ year: point.year, saldo: Math.round(point.balanceMidpoint) }],
  );
  const economyRange = `${formatCurrencyBRL(selectedEstimate.monthlySavings.minimum)} a ${formatCurrencyBRL(selectedEstimate.monthlySavings.maximum)}`;
  const annualEconomyRange = `${formatCurrencyBRL(selectedEstimate.annualSavingsFirstYear.minimum)} a ${formatCurrencyBRL(selectedEstimate.annualSavingsFirstYear.maximum)}`;
  const investmentRange =
    selectedEstimate.investment.status === "available"
      ? selectedEstimate.investment.minimum === selectedEstimate.investment.maximum
        ? `cerca de ${formatCurrencyBRL(selectedEstimate.investment.minimum)}`
        : `${formatCurrencyBRL(selectedEstimate.investment.minimum)} a ${formatCurrencyBRL(selectedEstimate.investment.maximum)}`
      : "sob consulta";
  const paybackText =
    selectedEstimate.payback.status === "available"
      ? `Retorno simples estimado entre ${formatDecimalPTBR(selectedEstimate.payback.minimumYears)} e ${formatDecimalPTBR(selectedEstimate.payback.maximumYears)} anos no cenário à vista.`
      : selectedEstimate.payback.status === "partial"
        ? `O retorno simples começa em cerca de ${formatDecimalPTBR(selectedEstimate.payback.minimumYears)} anos; o limite conservador supera 25 anos.`
        : selectedEstimate.payback.status === "outside-horizon"
          ? "O retorno não ocorre dentro do horizonte de 25 anos desta simulação."
          : "A equipe precisa confirmar o preço deste porte antes de calcular o retorno.";

  // ── Navegação do Wizard ──
  const handleNextStep = () => {
    const result = step1Schema.safeParse(formData);
    if (!result.success) {
      reportValidationErrors(mapIssuesToErrors(result.error.issues));
      return;
    }
    setErrors({});
    setAnnouncement("Etapa 2 de 2: projeção e contato.");
    setStep(2);
  };

  const handleWhatsApp = () => {
    if (whatsappOpenAttemptRef.current) return;

    const result = step2Schema.safeParse(formData);
    if (!result.success) {
      reportValidationErrors(mapIssuesToErrors(result.error.issues));
      return;
    }
    setErrors({});
    whatsappOpenAttemptRef.current = true;

    const consumptionText =
      selectedEstimate.consumption.source === "informed"
        ? `${selectedEstimate.consumption.maximumKwh.toLocaleString("pt-BR")} kWh/mês (informado)`
        : `${selectedEstimate.consumption.minimumKwh.toLocaleString("pt-BR")} a ${selectedEstimate.consumption.maximumKwh.toLocaleString("pt-BR")} kWh/mês (estimado)`;
    const returnText =
      !isFinanced && selectedEstimate.payback.status === "available"
        ? `\n- Retorno simples à vista: ${formatDecimalPTBR(selectedEstimate.payback.minimumYears)} a ${formatDecimalPTBR(selectedEstimate.payback.maximumYears)} anos`
        : "";
    const message = `Olá! Vim pelo site e quero conversar sobre minha simulação inicial.
*Dados informados:*
- Nome: ${formData.name}${formData.email ? `\n- E-mail: ${formData.email}` : ""}
- CEP: ${formData.cep}${formData.uf ? ` (${formData.uf})` : ""}
- Imóvel: ${formData.propertyType}
- Instalação: ${formData.installLocation}${formData.roofType ? ` (${formData.roofType})` : ""}
- Forma de pagamento: ${isFinanced ? "quero avaliar financiamento" : "à vista"}
- ${selectedEstimate.consumption.source === "informed" ? "Conta equivalente usada" : "Conta informada"}: ${formatCurrencyBRL(selectedEstimate.monthlyBill)}/mês
- Consumo: ${consumptionText}
- Geração de referência: ${selectedEstimate.targetGenerationKwh.toLocaleString("pt-BR")} kWh/mês
- Investimento à vista: ${investmentRange}
- Economia mensal estimada: ${economyRange}
- Economia estimada no 1º ano: ${annualEconomyRange}${returnText}

Entendo que consumo, geração, investimento, economia e retorno são estimativas e precisam de análise técnica e proposta formal.${isFinanced ? " As condições financeiras dependem de entrada, prazo, taxa e CET." : ""}`;

    const whatsappUrl = createWhatsAppUrl(message);

    let whatsappWindow: Window | null = null;
    try {
      whatsappWindow = window.open(whatsappUrl, "_blank");
    } catch {
      whatsappWindow = null;
    }

    if (whatsappWindow) {
      try {
        whatsappWindow.opener = null;
      } catch {
        // Alguns navegadores não permitem alterar a referência da nova aba.
      }
    }

    if (!whatsappWindow) {
      whatsappOpenAttemptRef.current = false;
      setWhatsappFallback({ url: whatsappUrl, estimateKey });
      setAnnouncement("O navegador bloqueou a nova aba. Nenhuma mensagem foi enviada.");
      return;
    }

    trackLeadGenerated();
    setWhatsappFallback(null);
    setAnnouncement("Conversa preparada. Revise a mensagem no WhatsApp antes de enviar.");
    setStep(3);
  };

  const trackLeadGenerated = () => {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", "lead_gerado_wizard", {
          value:
            (selectedEstimate.annualSavingsFirstYear.minimum +
              selectedEstimate.annualSavingsFirstYear.maximum) /
            2,
          currency: "BRL",
          property_type: formData.propertyType,
        });
      }
    } catch (error) {
      console.error("Não foi possível registrar o evento do formulário.", error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      handleNextStep();
      return;
    }

    if (step === 2) handleWhatsApp();
  };

  const handleFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter" || !(e.target instanceof HTMLInputElement)) return;
    if (!['text', 'email'].includes(e.target.type)) return;

    e.preventDefault();
    e.currentTarget.requestSubmit();
  };

  const handleBackToStepOne = () => {
    setErrors({});
    setWhatsappFallback(null);
    setCopyStatus("");
    whatsappOpenAttemptRef.current = false;
    setAnnouncement("Etapa 1 de 2: dados da instalação.");
    setStep(1);
  };

  const handleCopyPhone = async () => {
    const phone = siteConfig.company.phone.international;

    try {
      if (!navigator.clipboard) throw new Error("Clipboard indisponível.");
      await navigator.clipboard.writeText(phone);
      setCopyStatus("Telefone copiado.");
      setAnnouncement("Telefone copiado.");
    } catch {
      const message = "Não foi possível copiar. Selecione o telefone abaixo e use a opção de copiar do seu aparelho.";
      setCopyStatus(message);
      setAnnouncement(message);
    }
  };

  const activeWhatsappFallback =
    whatsappFallback?.estimateKey === estimateKey ? whatsappFallback : null;

  // ── Renderização dos Passos ──
  return (
    <form
      className="w-full relative min-h-[400px]"
      onSubmit={handleSubmit}
      onKeyDown={handleFormKeyDown}
      noValidate
      aria-labelledby={`lead-step-${step}-title`}
    >
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
      <AnimatePresence mode="wait">
        
        {/* ================= STEP 1: QUALIFICAÇÃO ================= */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onAnimationComplete={focusCurrentStepTitle}
            className="space-y-6"
          >
            <div className="text-center mb-2">
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent-copy">
                Etapa 1 de 2
              </p>
              <h3
                id="lead-step-1-title"
                ref={stepTitleRef}
                tabIndex={-1}
                className="mt-1 text-lg font-bold text-navy-950 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-900 rounded-md"
              >
                Dados da instalação
              </h3>
            </div>

            {/* CEP */}
            <div className="relative">
              <label htmlFor="lead-cep" className="text-sm text-text-secondary mb-1.5 block">
                CEP da instalação
              </label>
              <div className="relative">
                <MapPin aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle-copy" />
                <input
                  id="lead-cep"
                  name="cep"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  maxLength={9}
                  required
                  value={formData.cep}
                  onChange={handleCepChange}
                  aria-invalid={Boolean(errors.cep)}
                  aria-describedby={[
                    cepStatus.message ? "lead-cep-status" : "",
                    errors.cep ? "lead-cep-error" : "",
                  ].filter(Boolean).join(" ") || undefined}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 text-navy-950 dark:text-white placeholder:text-subtle-copy focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/40 transition-colors"
                />
                {cepStatus.type === "loading" && (
                  <div aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {cepStatus.message && (
                <p
                  id="lead-cep-status"
                  aria-live="polite"
                  className={`text-xs mt-1 ${cepStatus.type === "error" ? "text-amber-600 dark:text-amber-300" : "text-accent-copy"}`}
                >
                  {cepStatus.message}
                </p>
              )}
              {errors.cep && (
                <p id="lead-cep-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.cep}
                </p>
              )}
            </div>

            {/* Tipo de Imóvel (Cards) */}
            <fieldset aria-describedby={errors.propertyType ? "lead-property-error" : undefined}>
              <legend className="text-sm text-text-secondary mb-1.5">Tipo de imóvel</legend>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "residencial", icon: Home, label: "Residencial" },
                  { id: "empresa", icon: Building2, label: "Empresa" },
                  { id: "agronegocio", icon: Tractor, label: "Agro" }
                ].map((item) => (
                  <label
                    key={item.id}
                    htmlFor={`lead-property-${item.id}`}
                    className={`flex min-h-16 cursor-pointer flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white dark:has-[:focus-visible]:ring-offset-navy-900 ${
                      formData.propertyType === item.id
                        ? "border-gold-400 bg-gold-500/10 text-gold-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]"
                        : "border-navy-900/10 dark:border-white/10 bg-navy-900/5 dark:bg-white/5 text-text-secondary hover:border-navy-900/20 dark:hover:border-white/20 hover:bg-navy-900/10 dark:hover:bg-white/10"
                    }`}
                  >
                    <input
                      id={`lead-property-${item.id}`}
                      name="propertyType"
                      type="radio"
                      value={item.id}
                      checked={formData.propertyType === item.id}
                      onChange={() => updateField("propertyType", item.id as PropertyType)}
                      aria-describedby={errors.propertyType ? "lead-property-error" : undefined}
                      required
                      className="sr-only"
                    />
                    <item.icon aria-hidden="true" className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </label>
                ))}
              </div>
              {errors.propertyType && (
                <p id="lead-property-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.propertyType}
                </p>
              )}
            </fieldset>

            {/* Local de Instalação (Cards) */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
              <fieldset aria-describedby={errors.installLocation ? "lead-install-error" : undefined}>
                <legend className="text-sm text-text-secondary mb-1.5">Onde instalar?</legend>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    htmlFor="lead-install-telhado"
                    className={`flex min-h-16 cursor-pointer flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white dark:has-[:focus-visible]:ring-offset-navy-900 ${
                      formData.installLocation === "telhado"
                        ? "border-gold-400 bg-gold-500/10 text-gold-400"
                        : "border-navy-900/10 dark:border-white/10 bg-navy-900/5 dark:bg-white/5 text-text-secondary hover:bg-navy-900/10 dark:hover:bg-white/10"
                    }`}
                  >
                    <input
                      id="lead-install-telhado"
                      name="installLocation"
                      type="radio"
                      value="telhado"
                      checked={formData.installLocation === "telhado"}
                      onChange={() => updateField("installLocation", "telhado")}
                      aria-describedby={errors.installLocation ? "lead-install-error" : undefined}
                      required
                      className="sr-only"
                    />
                    <Home aria-hidden="true" className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold">Telhado</span>
                  </label>
                  <label
                    htmlFor="lead-install-solo"
                    className={`flex min-h-16 cursor-pointer flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white dark:has-[:focus-visible]:ring-offset-navy-900 ${
                      formData.installLocation === "solo"
                        ? "border-gold-400 bg-gold-500/10 text-gold-400"
                        : "border-navy-900/10 dark:border-white/10 bg-navy-900/5 dark:bg-white/5 text-text-secondary hover:bg-navy-900/10 dark:hover:bg-white/10"
                    }`}
                  >
                    <input
                      id="lead-install-solo"
                      name="installLocation"
                      type="radio"
                      value="solo"
                      checked={formData.installLocation === "solo"}
                      onChange={() => {
                        updateField("installLocation", "solo");
                        updateField("roofType", "");
                      }}
                      aria-describedby={errors.installLocation ? "lead-install-error" : undefined}
                      required
                      className="sr-only"
                    />
                    <Sun aria-hidden="true" className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold">Solo</span>
                  </label>
                </div>
                {errors.installLocation && (
                  <p id="lead-install-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.installLocation}
                  </p>
                )}
              </fieldset>

              {/* Financiamento */}
              <fieldset aria-describedby={errors.wantsFinancing ? "lead-financing-error" : undefined}>
                <legend className="text-sm text-text-secondary mb-1.5">Precisa financiar?</legend>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    htmlFor="lead-financing-sim"
                    className={`flex min-h-16 cursor-pointer flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white dark:has-[:focus-visible]:ring-offset-navy-900 ${
                      formData.wantsFinancing === "sim"
                        ? "border-gold-400 bg-gold-500/10 text-gold-400"
                        : "border-navy-900/10 dark:border-white/10 bg-navy-900/5 dark:bg-white/5 text-text-secondary hover:bg-navy-900/10 dark:hover:bg-white/10"
                    }`}
                  >
                    <input
                      id="lead-financing-sim"
                      name="wantsFinancing"
                      type="radio"
                      value="sim"
                      checked={formData.wantsFinancing === "sim"}
                      onChange={() => updateField("wantsFinancing", "sim")}
                      aria-describedby={errors.wantsFinancing ? "lead-financing-error" : undefined}
                      required
                      className="sr-only"
                    />
                    <Landmark aria-hidden="true" className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold">Sim</span>
                  </label>
                  <label
                    htmlFor="lead-financing-nao"
                    className={`flex min-h-16 cursor-pointer flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white dark:has-[:focus-visible]:ring-offset-navy-900 ${
                      formData.wantsFinancing === "nao"
                        ? "border-gold-400 bg-gold-500/10 text-gold-400"
                        : "border-navy-900/10 dark:border-white/10 bg-navy-900/5 dark:bg-white/5 text-text-secondary hover:bg-navy-900/10 dark:hover:bg-white/10"
                    }`}
                  >
                    <input
                      id="lead-financing-nao"
                      name="wantsFinancing"
                      type="radio"
                      value="nao"
                      checked={formData.wantsFinancing === "nao"}
                      onChange={() => updateField("wantsFinancing", "nao")}
                      aria-describedby={errors.wantsFinancing ? "lead-financing-error" : undefined}
                      required
                      className="sr-only"
                    />
                    <Banknote aria-hidden="true" className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold">Não</span>
                  </label>
                </div>
                {errors.wantsFinancing && (
                  <p id="lead-financing-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.wantsFinancing}
                  </p>
                )}
              </fieldset>
            </div>

            {/* Condicional Telhado */}
            {formData.installLocation === "telhado" && (
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="overflow-hidden"
              >
                <label htmlFor="lead-roof-type" className="text-sm text-text-secondary mb-1.5 block">
                  Qual o tipo de telhado?
                </label>
                <select
                  id="lead-roof-type"
                  name="roofType"
                  required
                  value={formData.roofType}
                  onChange={(e) => updateField("roofType", e.target.value as RoofType)}
                  aria-invalid={Boolean(errors.roofType)}
                  aria-describedby={errors.roofType ? "lead-roof-error" : undefined}
                  className="w-full px-4 py-3 rounded-xl bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 text-navy-950 dark:text-white focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/40"
                >
                  <option value="" disabled className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Selecione o telhado</option>
                  <option value="metalico" className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Metálico</option>
                  <option value="ceramico" className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Cerâmico / Barro</option>
                  <option value="fibrocimento" className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Fibrocimento (Eternit)</option>
                  <option value="laje" className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Laje Plana</option>
                </select>
                {errors.roofType && (
                  <p id="lead-roof-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.roofType}
                  </p>
                )}
              </motion.div>
            )}

            <button
              type="submit"
              className="group mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 py-4 font-bold text-navy-950 shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all duration-300 hover:bg-gold-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-900"
            >
              Gerar Simulação Inicial
              <ChevronRight aria-hidden="true" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {/* ================= STEP 2: O ESTUDO (BLURRED) ================= */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onAnimationComplete={focusCurrentStepTitle}
            className="space-y-5"
          >
            <div className="text-center mb-2">
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent-copy">
                Etapa 2 de 2
              </p>
              <h3
                id="lead-step-2-title"
                ref={stepTitleRef}
                tabIndex={-1}
                className="mt-1 text-lg font-bold text-navy-950 dark:text-white flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-900 rounded-md"
              >
                <CheckCircle2 aria-hidden="true" className="w-5 h-5 text-green-400" />
                Projeção Estimada
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Confira o cenário calculado com os dados informados.
              </p>
            </div>

            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle-copy">Geração</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-navy-950 dark:text-white">
                  {selectedEstimate.targetGenerationKwh.toLocaleString("pt-BR")} kWh/mês
                </dd>
              </div>
              <div className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle-copy">Investimento à vista</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-navy-950 dark:text-white">{investmentRange}</dd>
              </div>
              <div className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle-copy">Economia mensal</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{economyRange}</dd>
              </div>
            </dl>

            {chartData.length > 0 ? (
              <>
                <div className="rounded-xl border border-gold-500/20 bg-gold-500/10 p-3 text-center">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gold-700 dark:text-gold-300">
                    <Sun aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {paybackText}
                  </p>
                </div>

                <div className="group relative mb-4 h-64 w-full overflow-hidden rounded-xl border border-navy-900/10 bg-navy-100/50 p-4 pt-8 dark:border-white/5 dark:bg-navy-950/30 sm:h-72">
                  <div className="absolute left-4 top-2 z-10">
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-subtle-copy">Saldo acumulado no cenário central (deslize)</p>
                  </div>
                  <CashFlowChart data={chartData} />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50 to-transparent dark:from-navy-900" />
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm leading-6 text-navy-700 dark:text-blue-100">
                <p className="font-semibold text-navy-950 dark:text-white">
                  {isFinanced ? "Condições do financiamento" : "Investimento sob consulta"}
                </p>
                <p className="mt-1">
                  {isFinanced
                    ? "Entrada, prazo, taxa, parcelas e CET serão definidos após a análise de crédito e apresentados na proposta. Por isso, o gráfico de retorno não é exibido nesta etapa."
                    : "O preço desta faixa de geração depende de orçamento. A equipe confirmará o investimento e o retorno depois da análise."}
                </p>
              </div>
            )}

            <details className="group rounded-xl border border-navy-900/10 px-4 py-3 text-sm dark:border-white/10">
              <summary className="min-h-11 cursor-pointer content-center font-semibold text-navy-700 marker:text-gold-500 hover:text-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring dark:text-text-secondary dark:hover:text-white">
                Premissas e limites da estimativa
              </summary>
              <p className="pb-1 pt-2 text-xs leading-5 text-subtle-copy">
                Esta é uma referência inicial, não uma proposta comercial. A faixa usa conta residual de {formatCurrencyBRL(selectedEstimate.residualBill.minimum)} a {formatCurrencyBRL(selectedEstimate.residualBill.maximum)}, degradação de 0,5% ao ano e reajuste tarifário de 0%. Quando há gráfico, o cenário central usa a média do investimento e da economia. A proposta final depende do imóvel, da tarifa e dos equipamentos.
              </p>
            </details>

            {/* Formulário de Contato */}
            <div className="pt-2 border-t border-navy-900/10 dark:border-white/10">
              <p className="text-sm text-navy-950 dark:text-white font-semibold mb-3">Quer confirmar este cenário? Abra uma conversa com a equipe pelo WhatsApp:</p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="lead-name" className="text-sm text-text-secondary mb-1.5 block">
                    Nome completo
                  </label>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Seu nome completo"
                    maxLength={100}
                    required
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "lead-name-error" : undefined}
                    className="w-full px-4 py-3 rounded-xl bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 text-navy-950 dark:text-white placeholder:text-subtle-copy text-sm focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/40 transition-colors"
                  />
                  {errors.name && (
                    <p id="lead-name-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lead-email" className="text-sm text-text-secondary mb-1.5 block">
                    E-mail <span className="text-subtle-copy">(opcional)</span>
                  </label>
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    maxLength={254}
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "lead-email-error" : undefined}
                    className="w-full px-4 py-3 rounded-xl bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 text-navy-950 dark:text-white placeholder:text-subtle-copy text-sm focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/40 transition-colors"
                  />
                  {errors.email && (
                    <p id="lead-email-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="mt-2 flex min-h-11 items-start gap-3">
                  <input
                    id="lead-consent"
                    name="lgpdConsent"
                    type="checkbox"
                    required
                    checked={formData.lgpdConsent}
                    onChange={(e) => updateField("lgpdConsent", e.target.checked)}
                    aria-invalid={Boolean(errors.lgpdConsent)}
                    aria-describedby={errors.lgpdConsent ? "lead-consent-error" : undefined}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-white/20 bg-white/5 text-gold-500 focus:ring-focus-ring"
                  />
                  <p className="text-xs text-subtle-copy leading-tight">
                    <label htmlFor="lead-consent" className="hover:text-text-secondary transition-colors cursor-pointer">
                      Autorizo o uso dos dados informados para preparar este atendimento e eventual contato comercial por WhatsApp ou e-mail. Li a{" "}
                    </label>
                    <Link
                      href="/privacidade"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent-copy hover:underline"
                    >
                      Política de Privacidade
                    </Link>
                    .
                  </p>
                </div>
                {errors.lgpdConsent && (
                  <p id="lead-consent-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.lgpdConsent}
                  </p>
                )}

                <button
                  type="submit"
                  className="group mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-900"
                  style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-button)" }}
                >
                  <MessageCircle aria-hidden="true" className="w-5 h-5" />
                  Abrir Conversa no WhatsApp
                </button>

                {activeWhatsappFallback && (
                  <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-navy-800 dark:text-amber-50">
                    <p className="font-semibold">O navegador bloqueou a nova aba.</p>
                    <p className="mt-1 text-xs leading-5 text-navy-600 dark:text-amber-100/80">
                      Nenhuma mensagem foi enviada. Abra o WhatsApp nesta aba ou use o telefone abaixo.
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <a
                        href={activeWhatsappFallback.url}
                        onClick={trackLeadGenerated}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gold-400 px-3 py-2 text-center text-xs font-bold text-navy-950 hover:bg-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-900"
                      >
                        Abrir WhatsApp nesta aba
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="min-h-11 rounded-lg border border-navy-900/15 dark:border-white/15 px-3 py-2 text-xs font-semibold hover:border-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                      >
                        Copiar telefone
                      </button>
                    </div>
                    <a
                      href={`tel:${siteConfig.company.phone.e164}`}
                      className="mt-3 block select-all text-center font-mono font-semibold text-accent-copy underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    >
                      {siteConfig.company.phone.international}
                    </a>
                    {copyStatus && (
                      <p role="status" className="mt-2 text-center text-xs text-navy-600 dark:text-amber-100/80">
                        {copyStatus}
                      </p>
                    )}
                  </div>
                )}
                
                <button 
                  type="button" 
                  onClick={handleBackToStepOne}
                  className="mt-4 min-h-11 w-full rounded-lg text-center text-xs text-subtle-copy transition-colors hover:text-navy-950 focus-visible:ring-2 focus-visible:ring-focus-ring dark:hover:text-white"
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
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onAnimationComplete={focusCurrentStepTitle}
            className="text-center py-8 space-y-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <CheckCircle2 aria-hidden="true" className="w-10 h-10 text-green-400" />
            </div>
            <h3
              id="lead-step-3-title"
              ref={stepTitleRef}
              tabIndex={-1}
              className="text-2xl font-display font-bold text-navy-950 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-900 rounded-md"
            >
              Conversa Preparada
            </h3>
            <p className="text-navy-600 dark:text-text-secondary text-sm px-4">
              O WhatsApp foi aberto com os dados da simulação. Revise a mensagem e toque em enviar; a equipe só receberá as informações depois desse envio.
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </form>
  );
}
