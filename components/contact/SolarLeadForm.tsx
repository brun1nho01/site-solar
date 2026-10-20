"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import {
  Buildings,
  ChatCircleDots,
  CheckCircle,
  House,
  MapPin,
  ShieldCheck,
  Tractor,
} from "@phosphor-icons/react";
import { z } from "zod";
import { createWhatsAppUrl } from "@/lib/site-config";

type PropertyType = "" | "residencial" | "empresa" | "agronegocio";
type InstallLocation = "" | "telhado" | "solo";
type RoofType = "" | "ceramico" | "metalico" | "fibrocimento" | "laje" | "outro";
type FinancingInterest = "" | "sim" | "nao";

interface FormData {
  name: string;
  monthlyBill: string;
  monthlyConsumption: string;
  cep: string;
  propertyType: PropertyType;
  installLocation: InstallLocation;
  roofType: RoofType;
  financingInterest: FinancingInterest;
  lgpdConsent: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  name: "",
  monthlyBill: "",
  monthlyConsumption: "",
  cep: "",
  propertyType: "",
  installLocation: "",
  roofType: "",
  financingInterest: "",
  lgpdConsent: false,
};

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Informe seu nome completo.")
      .max(100, "Use no máximo 100 caracteres no nome."),
    monthlyBill: z.string().refine((value) => {
      const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
      return Number(normalized) > 0;
    }, "Informe o valor médio da conta."),
    monthlyConsumption: z.string().max(6, "Use no máximo 6 dígitos no consumo."),
    cep: z.string().refine((value) => value.replace(/\D/g, "").length === 8, "Informe um CEP válido."),
    propertyType: z.enum(["residencial", "empresa", "agronegocio"], {
      message: "Selecione o tipo de imóvel.",
    }),
    installLocation: z.enum(["telhado", "solo"], {
      message: "Selecione o local da instalação.",
    }),
    roofType: z.string(),
    financingInterest: z.enum(["sim", "nao"], {
      message: "Informe se deseja avaliar financiamento.",
    }),
    lgpdConsent: z.literal(true, {
      message: "Confirme o envio dos dados para continuar.",
    }),
  })
  .superRefine((data, context) => {
    if (data.installLocation === "telhado" && !data.roofType) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione o tipo de telhado.",
        path: ["roofType"],
      });
    }
  });

const focusIds: Record<keyof FormData, string> = {
  name: "lead-name",
  monthlyBill: "lead-monthly-bill",
  monthlyConsumption: "lead-monthly-consumption",
  cep: "lead-cep",
  propertyType: "lead-property-residencial",
  installLocation: "lead-install-location",
  roofType: "lead-roof-type",
  financingInterest: "lead-financing-sim",
  lgpdConsent: "lead-consent",
};

const propertyOptions = [
  { value: "residencial", label: "Residencial", Icon: House },
  { value: "empresa", label: "Empresa", Icon: Buildings },
  { value: "agronegocio", label: "Agronegócio", Icon: Tractor },
] as const;

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

function propertyLabel(value: PropertyType) {
  return propertyOptions.find((option) => option.value === value)?.label ?? value;
}

export default function SolarLeadForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [announcement, setAnnouncement] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [conversationOpened, setConversationOpened] = useState(false);
  const submittingRef = useRef(false);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFallbackUrl("");
    setConversationOpened(false);
  };

  const reportErrors = (issues: z.ZodIssue[]) => {
    const nextErrors: FormErrors = {};

    issues.forEach((issue) => {
      const field = issue.path[0] as keyof FormData | undefined;
      if (field && !nextErrors[field]) nextErrors[field] = issue.message;
    });

    const firstField = Object.keys(nextErrors)[0] as keyof FormData | undefined;
    const firstMessage = firstField ? nextErrors[firstField] : undefined;
    setErrors(nextErrors);
    setAnnouncement(
      Object.keys(nextErrors).length === 1
        ? `Há um campo para corrigir. ${firstMessage}`
        : `Há ${Object.keys(nextErrors).length} campos para corrigir. ${firstMessage}`,
    );

    if (firstField) {
      window.requestAnimationFrame(() => {
        const field = document.getElementById(focusIds[firstField]);
        field?.focus({ preventScroll: true });
        field?.scrollIntoView({ behavior: "instant", block: "center" });
      });
    }
  };

  const trackLead = () => {
    try {
      window.gtag?.("event", "lead_whatsapp_solicitado", {
        property_type: formData.propertyType,
        financing_interest: formData.financingInterest,
      });
    } catch (error) {
      console.error("Não foi possível registrar o evento do formulário.", error);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      reportErrors(result.error.issues);
      return;
    }

    setErrors({});
    submittingRef.current = true;

    const roofLine =
      formData.installLocation === "telhado" && formData.roofType
        ? `\n- Tipo de telhado: ${formData.roofType}`
        : "";
    const consumptionLine = formData.monthlyConsumption
      ? `\n- Consumo médio informado: ${formData.monthlyConsumption} kWh/mês`
      : "";
    const message = `Olá! Vim pelo site da W. Lima Soluções e gostaria de uma análise personalizada para energia solar.

*Dados para o atendimento:*
- Nome: ${formData.name.trim()}
- Conta média de energia: R$ ${formData.monthlyBill.trim()}${consumptionLine}
- CEP da instalação: ${formData.cep}
- Tipo de imóvel: ${propertyLabel(formData.propertyType)}
- Local pretendido: ${formData.installLocation}${roofLine}
- Interesse em financiamento: ${formData.financingInterest === "sim" ? "sim" : "não"}

Se necessário, posso enviar uma foto da fatura e mais informações por aqui.`;
    const whatsappUrl = createWhatsAppUrl(message);

    let popup: Window | null = null;
    try {
      popup = window.open(whatsappUrl, "_blank");
    } catch {
      popup = null;
    }

    if (!popup) {
      setFallbackUrl(whatsappUrl);
      setAnnouncement("O navegador bloqueou a nova aba. Use o link exibido para abrir o WhatsApp.");
      submittingRef.current = false;
      return;
    }

    try {
      popup.opener = null;
    } catch {
      // Alguns navegadores já removem a referência ao abrir com noopener.
    }

    trackLead();
    setFallbackUrl("");
    setConversationOpened(true);
    setAnnouncement("Conversa preparada. Revise a mensagem no WhatsApp antes de enviar.");
    submittingRef.current = false;
  };

  const inputClass =
    "min-h-12 w-full rounded-xl border border-navy-900/15 bg-white px-4 text-navy-950 outline-none transition-colors placeholder:text-subtle-copy focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25 dark:border-white/15 dark:bg-navy-950/60 dark:text-white";
  const labelClass = "mb-2 block text-sm font-semibold text-navy-800 dark:text-navy-200";
  const errorClass = "mt-1.5 text-sm text-red-600 dark:text-red-400";

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(4,9,17,0.13)] dark:bg-navy-900 dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
      <div className="grid grid-cols-1 lg:grid-cols-[0.78fr_1.22fr]">
        <div
          data-testid="analysis-intro-panel"
          className="relative hidden min-w-0 overflow-hidden bg-navy-50 px-6 py-9 text-navy-950 dark:bg-navy-950 dark:text-white sm:px-9 sm:py-11 lg:block lg:px-10 lg:py-12"
        >
          <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-300/20 blur-3xl dark:bg-gold-400/10" />
          <div className="relative">
            <h2 className="max-w-md text-balance font-display text-3xl font-bold leading-tight sm:text-4xl">
              Receba uma análise feita para o seu imóvel
            </h2>
            <p className="mt-5 max-w-md leading-7 text-navy-700 dark:text-navy-200">
              Informe o essencial. A equipe avalia seu caso e continua o atendimento pelo WhatsApp com uma orientação adequada ao seu projeto.
            </p>

            <ul className="mt-9 space-y-5 text-sm text-navy-800 dark:text-navy-100">
              <li className="flex gap-3">
                <CheckCircle aria-hidden="true" weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 dark:text-gold-400" />
                <span>Análise baseada no consumo e nas condições reais do local.</span>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden="true" weight="duotone" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 dark:text-gold-400" />
                <span>Atendimento para residências, empresas e propriedades rurais.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck aria-hidden="true" weight="duotone" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 dark:text-gold-400" />
                <span>O site não armazena este formulário em banco de dados próprio.</span>
              </li>
            </ul>
          </div>
        </div>

        <form className="min-w-0 px-6 py-7 sm:px-9 sm:py-8 lg:px-10 lg:py-12" onSubmit={handleSubmit} noValidate>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>

          <div className="mb-7 lg:hidden">
            <h2 className="text-balance break-words font-display text-3xl font-bold leading-tight text-navy-950 dark:text-white">
              Solicite sua análise solar
            </h2>
            <p className="mt-3 text-base leading-7 text-navy-700 dark:text-text-secondary">
              Preencha os dados do imóvel e revise a mensagem no WhatsApp antes de enviar.
            </p>
          </div>

          <div className="mb-7 hidden lg:block">
            <h3 className="font-display text-2xl font-bold text-navy-950 dark:text-white">
              Conte um pouco sobre o projeto
            </h3>
            <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-text-secondary">
              Leva cerca de um minuto. Você revisa a mensagem antes de enviar.
            </p>
          </div>

          <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="lead-name" className={labelClass}>Nome completo</label>
              <input
                id="lead-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "lead-name-error" : undefined}
                className={inputClass}
                placeholder="Como podemos chamar você?"
              />
              {errors.name && <p id="lead-name-error" className={errorClass}>{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="lead-monthly-bill" className={labelClass}>Conta média de energia</label>
              <div className="relative">
                <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-subtle-copy">R$</span>
                <input
                  id="lead-monthly-bill"
                  name="monthlyBill"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  maxLength={12}
                  value={formData.monthlyBill}
                  onChange={(event) => updateField("monthlyBill", event.target.value.replace(/[^\d.,]/g, ""))}
                  aria-invalid={Boolean(errors.monthlyBill)}
                  aria-describedby={errors.monthlyBill ? "lead-monthly-bill-error" : undefined}
                  className={`${inputClass} pl-12`}
                  placeholder="500,00"
                />
              </div>
              {errors.monthlyBill && <p id="lead-monthly-bill-error" className={errorClass}>{errors.monthlyBill}</p>}
            </div>

            <div>
              <label htmlFor="lead-monthly-consumption" className={labelClass}>
                Consumo em kWh <span className="font-normal text-subtle-copy">(opcional)</span>
              </label>
              <input
                id="lead-monthly-consumption"
                name="monthlyConsumption"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={6}
                value={formData.monthlyConsumption}
                onChange={(event) => updateField("monthlyConsumption", event.target.value.replace(/\D/g, ""))}
                className={inputClass}
                placeholder="Ex.: 420"
              />
            </div>

            <div>
              <label htmlFor="lead-cep" className={labelClass}>CEP da instalação</label>
              <input
                id="lead-cep"
                name="cep"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={9}
                value={formData.cep}
                onChange={(event) => updateField("cep", formatCep(event.target.value))}
                aria-invalid={Boolean(errors.cep)}
                aria-describedby={errors.cep ? "lead-cep-error" : undefined}
                className={inputClass}
                placeholder="00000-000"
              />
              {errors.cep && <p id="lead-cep-error" className={errorClass}>{errors.cep}</p>}
            </div>

            <div>
              <label htmlFor="lead-install-location" className={labelClass}>Local dos painéis</label>
              <select
                id="lead-install-location"
                name="installLocation"
                value={formData.installLocation}
                onChange={(event) => {
                  const value = event.target.value as InstallLocation;
                  updateField("installLocation", value);
                  if (value === "solo") updateField("roofType", "");
                }}
                aria-invalid={Boolean(errors.installLocation)}
                aria-describedby={errors.installLocation ? "lead-install-error" : undefined}
                className={inputClass}
              >
                <option value="">Selecione</option>
                <option value="telhado">Telhado</option>
                <option value="solo">Solo</option>
              </select>
              {errors.installLocation && <p id="lead-install-error" className={errorClass}>{errors.installLocation}</p>}
            </div>

            {formData.installLocation === "telhado" && (
              <div className="sm:col-span-2">
                <label htmlFor="lead-roof-type" className={labelClass}>Tipo de telhado</label>
                <select
                  id="lead-roof-type"
                  name="roofType"
                  value={formData.roofType}
                  onChange={(event) => updateField("roofType", event.target.value as RoofType)}
                  aria-invalid={Boolean(errors.roofType)}
                  aria-describedby={errors.roofType ? "lead-roof-error" : undefined}
                  className={inputClass}
                >
                  <option value="">Selecione</option>
                  <option value="ceramico">Cerâmico</option>
                  <option value="metalico">Metálico</option>
                  <option value="fibrocimento">Fibrocimento</option>
                  <option value="laje">Laje</option>
                  <option value="outro">Outro ou não sei informar</option>
                </select>
                {errors.roofType && <p id="lead-roof-error" className={errorClass}>{errors.roofType}</p>}
              </div>
            )}

            <fieldset className="min-w-0 sm:col-span-2" aria-describedby={errors.propertyType ? "lead-property-error" : undefined}>
              <legend className={labelClass}>Tipo de imóvel</legend>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,5.625rem),1fr))] gap-2">
                {propertyOptions.map(({ value, label, Icon }) => (
                  <label
                    key={value}
                    htmlFor={`lead-property-${value}`}
                    className={`flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-offset-navy-900 ${
                      formData.propertyType === value
                        ? "border-gold-500 bg-gold-500/10 text-navy-950 dark:text-white"
                        : "border-navy-900/15 text-navy-600 hover:border-gold-500/60 dark:border-white/15 dark:text-navy-300"
                    }`}
                  >
                    <input
                      id={`lead-property-${value}`}
                      name="propertyType"
                      type="radio"
                      value={value}
                      checked={formData.propertyType === value}
                      onChange={() => updateField("propertyType", value)}
                      className="sr-only"
                    />
                    <Icon aria-hidden="true" weight="duotone" className="mb-1.5 h-5 w-5" />
                    <span className="max-w-full break-words text-xs font-semibold sm:text-sm">{label}</span>
                  </label>
                ))}
              </div>
              {errors.propertyType && <p id="lead-property-error" className={errorClass}>{errors.propertyType}</p>}
            </fieldset>

            <fieldset className="min-w-0 sm:col-span-2" aria-describedby={errors.financingInterest ? "lead-financing-error" : undefined}>
              <legend className={labelClass}>Deseja avaliar financiamento?</legend>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,5rem),1fr))] gap-3">
                {(["sim", "nao"] as const).map((value) => (
                  <label
                    key={value}
                    htmlFor={`lead-financing-${value}`}
                    className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-4 font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-offset-navy-900 ${
                      formData.financingInterest === value
                        ? "border-gold-500 bg-gold-500/10 text-navy-950 dark:text-white"
                        : "border-navy-900/15 text-navy-600 hover:border-gold-500/60 dark:border-white/15 dark:text-navy-300"
                    }`}
                  >
                    <input
                      id={`lead-financing-${value}`}
                      name="financingInterest"
                      type="radio"
                      value={value}
                      checked={formData.financingInterest === value}
                      onChange={() => updateField("financingInterest", value)}
                      className="sr-only"
                    />
                    {value === "sim" ? "Sim" : "Não"}
                  </label>
                ))}
              </div>
              {errors.financingInterest && <p id="lead-financing-error" className={errorClass}>{errors.financingInterest}</p>}
            </fieldset>
          </div>

          <p className="mt-7 text-sm leading-6 text-navy-600 dark:text-text-secondary lg:hidden">
            O site não armazena este formulário em banco de dados próprio.
          </p>

          <label htmlFor="lead-consent" className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-6 text-navy-600 dark:text-text-secondary lg:mt-7">
            <input
              id="lead-consent"
              name="lgpdConsent"
              type="checkbox"
              checked={formData.lgpdConsent}
              onChange={(event) => updateField("lgpdConsent", event.target.checked)}
              aria-invalid={Boolean(errors.lgpdConsent)}
              aria-describedby={errors.lgpdConsent ? "lead-consent-error" : undefined}
              className="mt-1 h-5 w-5 shrink-0 rounded border-navy-900/30 accent-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500"
            />
            <span>
              Concordo em abrir o WhatsApp com estes dados para solicitar atendimento. Li a{" "}
              <Link href="/privacidade" className="font-semibold text-accent-copy underline underline-offset-4">
                Política de Privacidade
              </Link>.
            </span>
          </label>
          {errors.lgpdConsent && <p id="lead-consent-error" className={errorClass}>{errors.lgpdConsent}</p>}

          <button
            type="submit"
            className="solar-cta mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-navy-950 shadow-[0_12px_30px_rgba(242,205,66,0.24)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-4 dark:focus-visible:ring-offset-navy-900"
          >
            <ChatCircleDots aria-hidden="true" weight="fill" className="h-5 w-5" />
            Solicitar análise pelo WhatsApp
          </button>

          {fallbackUrl && (
            <div role="alert" className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:bg-amber-400/10 dark:text-amber-100">
              <p>O navegador bloqueou a nova aba. Nenhuma mensagem foi enviada.</p>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackLead}
                className="mt-2 inline-flex min-h-11 items-center font-bold underline underline-offset-4"
              >
                Abrir o WhatsApp agora
              </a>
            </div>
          )}

          {conversationOpened && (
            <p role="status" className="mt-4 text-center text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Conversa preparada. Revise a mensagem no WhatsApp antes de enviar.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
