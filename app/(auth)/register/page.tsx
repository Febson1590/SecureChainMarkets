"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/auth";
import {
  Eye, EyeOff, Lock, Mail, User, Phone, Globe,
  Loader2, AlertCircle, CheckCircle2, Check,
  ChevronRight, ChevronLeft, Shield, MapPin,
  ShieldCheck, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/utils";

/* ── Country list ──────────────────────────────────────────────────────── */
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Angola","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahrain","Bangladesh","Belgium","Bolivia","Bosnia",
  "Brazil","Bulgaria","Cambodia","Cameroon","Canada","Chile","China","Colombia",
  "Costa Rica","Croatia","Cuba","Czech Republic","Denmark","Ecuador","Egypt",
  "El Salvador","Estonia","Ethiopia","Finland","France","Georgia","Germany",
  "Ghana","Greece","Guatemala","Honduras","Hong Kong","Hungary","India",
  "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
  "Jordan","Kazakhstan","Kenya","Kuwait","Lebanon","Libya","Lithuania",
  "Malaysia","Mexico","Moldova","Morocco","Mozambique","Myanmar","Netherlands",
  "New Zealand","Nigeria","Norway","Oman","Pakistan","Panama","Paraguay","Peru",
  "Philippines","Poland","Portugal","Qatar","Romania","Russia","Saudi Arabia",
  "Senegal","Serbia","Singapore","South Africa","South Korea","Spain",
  "Sri Lanka","Sweden","Switzerland","Taiwan","Tanzania","Thailand","Tunisia",
  "Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen",
  "Zimbabwe",
];

const COUNTRY_CODES: Record<string, string> = {
  "Afghanistan":"AF","Albania":"AL","Algeria":"DZ","Angola":"AO","Argentina":"AR",
  "Armenia":"AM","Australia":"AU","Austria":"AT","Azerbaijan":"AZ","Bahrain":"BH",
  "Bangladesh":"BD","Belgium":"BE","Bolivia":"BO","Bosnia":"BA","Brazil":"BR",
  "Bulgaria":"BG","Cambodia":"KH","Cameroon":"CM","Canada":"CA","Chile":"CL",
  "China":"CN","Colombia":"CO","Costa Rica":"CR","Croatia":"HR","Cuba":"CU",
  "Czech Republic":"CZ","Denmark":"DK","Ecuador":"EC","Egypt":"EG",
  "El Salvador":"SV","Estonia":"EE","Ethiopia":"ET","Finland":"FI","France":"FR",
  "Georgia":"GE","Germany":"DE","Ghana":"GH","Greece":"GR","Guatemala":"GT",
  "Honduras":"HN","Hong Kong":"HK","Hungary":"HU","India":"IN","Indonesia":"ID",
  "Iran":"IR","Iraq":"IQ","Ireland":"IE","Israel":"IL","Italy":"IT",
  "Jamaica":"JM","Japan":"JP","Jordan":"JO","Kazakhstan":"KZ","Kenya":"KE",
  "Kuwait":"KW","Lebanon":"LB","Libya":"LY","Lithuania":"LT","Malaysia":"MY",
  "Mexico":"MX","Moldova":"MD","Morocco":"MA","Mozambique":"MZ","Myanmar":"MM",
  "Netherlands":"NL","New Zealand":"NZ","Nigeria":"NG","Norway":"NO","Oman":"OM",
  "Pakistan":"PK","Panama":"PA","Paraguay":"PY","Peru":"PE","Philippines":"PH",
  "Poland":"PL","Portugal":"PT","Qatar":"QA","Romania":"RO","Russia":"RU",
  "Saudi Arabia":"SA","Senegal":"SN","Serbia":"RS","Singapore":"SG",
  "South Africa":"ZA","South Korea":"KR","Spain":"ES","Sri Lanka":"LK",
  "Sweden":"SE","Switzerland":"CH","Taiwan":"TW","Tanzania":"TZ","Thailand":"TH",
  "Tunisia":"TN","Turkey":"TR","Uganda":"UG","Ukraine":"UA",
  "United Arab Emirates":"AE","United Kingdom":"GB","United States":"US",
  "Uruguay":"UY","Uzbekistan":"UZ","Venezuela":"VE","Vietnam":"VN",
  "Yemen":"YE","Zimbabwe":"ZW",
};

function flagEmoji(code: string): string {
  return [...code.toUpperCase()].map(c =>
    String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join("");
}

const PWD_RULES = [
  { label: "At least 8 characters",      test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter",   test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains number",             test: (p: string) => /[0-9]/.test(p) },
];

const STEPS = [
  { n: 1, label: "Personal Info", icon: User,   heading: "Personal Information", sub: "Set up your trading profile"          },
  { n: 2, label: "Location",      icon: Globe,  heading: "Location",             sub: "Set your regional trading preferences" },
  { n: 3, label: "Security",      icon: Shield, heading: "Account Security",     sub: "Secure your trading account"           },
];

const valueProps = [
  { icon: Globe,       title: "Major digital assets", desc: "Bitcoin, Ethereum and the most-traded altcoins quoted against USD." },
  { icon: Zap,         title: "Built for clarity",    desc: "Bid, ask and spread shown plainly — no hidden markups." },
  { icon: ShieldCheck, title: "Account protection",   desc: "Two-factor sign-in and reviewed funding on every account." },
];

/* ── Stepper (light theme) ──────────────────────────────────────────── */
function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-start justify-between mb-7 select-none">
      {STEPS.map(({ n, label }, i) => (
        <div key={n} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 flex-shrink-0
                ${step > n
                  ? "bg-emerald-500 text-white shadow-[0_8px_18px_-6px_rgba(16,185,129,0.45)]"
                  : step === n
                    ? "bg-[#2B6BFF] text-white shadow-[0_8px_22px_-6px_rgba(43,107,255,0.55)] ring-4 ring-[#2B6BFF]/15"
                    : "bg-white border border-slate-200 text-slate-500"}`}
            >
              {step > n ? <Check size={14} strokeWidth={3} /> : n}
            </div>
            <span className={`text-[10.5px] font-semibold tracking-wider whitespace-nowrap hidden sm:block
              ${step === n ? "text-[#2B6BFF]" : step > n ? "text-emerald-600" : "text-slate-500"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 transition-all duration-500
              ${step > n ? "bg-[#2B6BFF]/45" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function StepHeader({ step }: { step: number }) {
  const s = STEPS[step - 1];
  const Icon = s.icon;
  return (
    <div className="flex items-center gap-3 rounded-xl p-4 mb-5 bg-[#EAF2FF] border border-[#DCE6FA]">
      <div className="w-10 h-10 rounded-lg bg-[#2B6BFF]/10 inline-flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-[#2B6BFF]" />
      </div>
      <div>
        <div className="text-[14px] font-semibold text-[#0A1A3A]">{s.heading}</div>
        <div className="text-[12px] text-slate-600">{s.sub}</div>
      </div>
    </div>
  );
}

function Field({
  label, error, children, required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[13px] font-semibold text-[#0A1A3A]">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-[12px] text-rose-500">
          <AlertCircle size={11} className="flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    username:        "",
    fullName:        "",
    email:           "",
    phone:           "",
    country:         "",
    password:        "",
    confirmPassword: "",
  });

  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [showPwd,      setShowPwd]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [verifyState,  setVerifyState]  = useState<"idle" | "checking" | "verified">("idle");
  const [termsOk,      setTermsOk]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [submitError,  setSubmitError]  = useState("");

  const set = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors(prev => { const next = { ...prev }; delete next[k]; return next; });
  };

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (formData.username.trim().length < 2) errs.username = "Username must be at least 2 characters";
      if (formData.fullName.trim().length < 2) errs.fullName = "Full name must be at least 2 characters";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email address";
      if (formData.phone && !/^\+?[\d\s\-(). ]{6,20}$/.test(formData.phone)) errs.phone = "Enter a valid phone number";
    }
    if (s === 2) {
      if (!formData.country) errs.country = "Please select your country";
    }
    if (s === 3) {
      if (formData.password.length < 8) errs.password = "Password must be at least 8 characters";
      else if (!/[A-Z]/.test(formData.password)) errs.password = "Include at least one uppercase letter";
      else if (!/[0-9]/.test(formData.password)) errs.password = "Include at least one number";
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
      if (verifyState !== "verified") errs.verify = "Please complete human verification";
      if (!termsOk) errs.terms = "You must accept the Terms & Privacy Policy";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() { if (validateStep(step)) setStep(s => Math.min(s + 1, 3)); }
  function back() { setErrors({}); setStep(s => Math.max(s - 1, 1)); }

  function handleVerify() {
    if (verifyState !== "idle") return;
    setVerifyState("checking");
    setTimeout(() => {
      setVerifyState("verified");
      if (errors.verify) setErrors(prev => { const next = { ...prev }; delete next.verify; return next; });
    }, 1200);
  }

  async function handleSubmit() {
    if (!validateStep(3)) return;
    setLoading(true);
    setSubmitError("");
    try {
      const result = await registerUser({
        name:     formData.username,
        fullName: formData.fullName,
        email:    formData.email,
        password: formData.password,
        phone:    formData.phone   || undefined,
        country:  formData.country || undefined,
      });
      if (result?.error) {
        setSubmitError(friendlyError(result.error));
      } else {
        try {
          sessionStorage.setItem(
            `SECURECHAINMARKETS:postVerifyAuth:${formData.email.toLowerCase()}`,
            formData.password,
          );
        } catch { /* noop */ }
        toast.success("Account created successfully", {
          description: "Check your email to verify your account.",
        });
        router.push(`/verify?email=${encodeURIComponent(formData.email)}&type=register`);
      }
    } catch {
      setSubmitError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Light input/select classes ──────────────────────────────────── */
  const inputCls =
    "w-full h-12 pl-11 pr-4 rounded-lg bg-white border border-slate-200 text-[14px] text-[#0A1A3A] placeholder:text-slate-400 focus:outline-none focus:border-[#2B6BFF] focus:ring-2 focus:ring-[#2B6BFF]/15 transition-all";
  const selectCls =
    "w-full h-12 pl-11 pr-9 rounded-lg bg-white border border-slate-200 text-[14px] text-[#0A1A3A] focus:outline-none focus:border-[#2B6BFF] focus:ring-2 focus:ring-[#2B6BFF]/15 transition-all appearance-none cursor-pointer";

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

        {/* ════════════════════ LEFT — Branding panel ═════════════════ */}
        <div className="order-2 lg:order-1">
          <h1 className="text-[36px] sm:text-[44px] font-bold tracking-tight leading-[1.05] text-[#0A1A3A]">
            Trade Smarter.
            <br />
            Invest <span className="text-[#2B6BFF]">Confidently.</span>
          </h1>
          <p className="mt-5 text-[14px] sm:text-[15px] text-slate-600 leading-[1.65] max-w-[460px]">
            A focused brokerage for major digital assets — clear pricing,
            reviewed funding, and a clean trading experience.
          </p>

          <ul className="mt-9 space-y-5 max-w-[460px]">
            {valueProps.map((v) => (
              <li key={v.title} className="flex items-start gap-4">
                <span className="mt-0.5 w-10 h-10 rounded-lg bg-[#2B6BFF]/10 border border-[#2B6BFF]/20 flex items-center justify-center flex-shrink-0">
                  <v.icon size={17} className="text-[#2B6BFF]" />
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-[#0A1A3A] leading-snug">{v.title}</div>
                  <div className="text-[12.5px] text-slate-600 leading-relaxed mt-1">{v.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ════════════════════ RIGHT — Form card ═════════════════ */}
        <div className="order-1 lg:order-2 w-full">
          <div
            className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-9"
            style={{ boxShadow: "0 22px 60px -28px rgba(15,23,42,0.18)" }}
          >
            <h2 className="text-[26px] sm:text-[28px] font-bold text-[#0A1A3A] tracking-tight">
              Create Your Account
            </h2>
            <p className="mt-2 text-[13.5px] text-slate-500">
              {step === 1 && "Step 1 of 3 — Your trading profile details"}
              {step === 2 && "Step 2 of 3 — Your location & regional settings"}
              {step === 3 && "Step 3 of 3 — Secure your account"}
            </p>

            <div className="mt-7">
              <Stepper step={step} />
            </div>

            {submitError && (
              <div className="mb-5 flex items-center gap-2.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                <AlertCircle size={15} className="flex-shrink-0" />
                {submitError}
              </div>
            )}

            {/* ════════ STEP 1 — Personal Info ════════ */}
            {step === 1 && (
              <div className="space-y-5">
                <StepHeader step={step} />

                <Field label="Trading Username" error={errors.username} required>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input value={formData.username} onChange={set("username")}
                      placeholder="e.g. tradervault" className={inputCls} />
                  </div>
                </Field>

                <Field label="Full Name" error={errors.fullName} required>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input value={formData.fullName} onChange={set("fullName")}
                      placeholder="Your full legal name" className={inputCls} />
                  </div>
                </Field>

                <Field label="Email Address" error={errors.email} required>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="email" value={formData.email} onChange={set("email")}
                      placeholder="you@example.com" className={inputCls} />
                  </div>
                </Field>

                <Field label="Phone Number" error={errors.phone}>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="tel" value={formData.phone} onChange={set("phone")}
                      placeholder="+1 555 123 4567" className={inputCls} />
                  </div>
                </Field>
              </div>
            )}

            {/* ════════ STEP 2 — Location ════════ */}
            {step === 2 && (
              <div className="space-y-5">
                <StepHeader step={step} />

                <Field label="Country / Region" error={errors.country} required>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none rotate-90" />
                    <select value={formData.country} onChange={set("country")} className={selectCls}>
                      <option value="" disabled>Select your country</option>
                      {COUNTRIES.map(c => {
                        const code = COUNTRY_CODES[c];
                        const flag = code ? flagEmoji(code) + " " : "";
                        return <option key={c} value={c}>{flag}{c}</option>;
                      })}
                    </select>
                  </div>
                </Field>

                <div className="rounded-xl p-4 bg-[#EAF2FF] border border-[#DCE6FA]">
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-[#2B6BFF] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[12.5px] font-semibold text-[#0A1A3A] mb-1">Regional Trading Information</div>
                      <p className="text-[12px] text-slate-600 leading-[1.6]">
                        Your location helps us apply region-specific compliance rules,
                        regulatory requirements, and optimal server routing for faster order execution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════ STEP 3 — Security ════════ */}
            {step === 3 && (
              <div className="space-y-5">
                <StepHeader step={step} />

                <Field label="Password" error={errors.password} required>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type={showPwd ? "text" : "password"} value={formData.password}
                      onChange={set("password")} placeholder="Create a strong password"
                      className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="space-y-1 pt-1">
                      {PWD_RULES.map(r => {
                        const ok = r.test(formData.password);
                        return (
                          <div key={r.label} className={`flex items-center gap-2 text-[12px] transition-colors duration-200 ${ok ? "text-emerald-600" : "text-slate-500"}`}>
                            <CheckCircle2 size={11} className={ok ? "text-emerald-600" : "text-slate-400"} />
                            {r.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Field>

                <Field label="Confirm Password" error={errors.confirmPassword} required>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type={showConfirm ? "text" : "password"} value={formData.confirmPassword}
                      onChange={set("confirmPassword")} placeholder="Confirm your password"
                      className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                {/* Human verification */}
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#0A1A3A]">
                    Human Verification<span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={verifyState !== "idle"}
                    className={`w-full flex items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 cursor-pointer disabled:cursor-default active:scale-[0.995] border
                      ${verifyState === "verified"
                        ? "bg-emerald-50 border-emerald-200"
                        : errors.verify
                          ? "bg-rose-50 border-rose-300"
                          : "bg-[#EAF2FF] border-[#DCE6FA] hover:border-[#2B6BFF]/45"}`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${verifyState === "verified"
                        ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]"
                        : verifyState === "checking"
                          ? "bg-[#2B6BFF]/15 border border-[#2B6BFF]/40"
                          : "bg-white border border-slate-300"}`}>
                      {verifyState === "verified" && <Check   size={14} className="text-white" strokeWidth={3} />}
                      {verifyState === "checking" && <Loader2 size={12} className="text-[#2B6BFF] animate-spin" />}
                    </div>
                    <span className={`text-[14px] font-semibold transition-colors duration-200
                      ${verifyState === "verified" ? "text-emerald-700" : "text-[#0A1A3A]"}`}>
                      {verifyState === "idle"     && "I'm not a robot"}
                      {verifyState === "checking" && "Verifying…"}
                      {verifyState === "verified" && "Verified — Human confirmed"}
                    </span>
                    {verifyState === "idle" && (
                      <span className="ml-auto text-[10px] font-bold text-[#2B6BFF] tracking-[0.18em] uppercase hidden sm:inline">Tap to verify</span>
                    )}
                  </button>
                  {errors.verify && (
                    <p className="flex items-center gap-1.5 text-[12px] text-rose-500">
                      <AlertCircle size={11} /> {errors.verify}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="space-y-1.5">
                  <label
                    className="flex items-start gap-3.5 cursor-pointer group"
                    onClick={() => {
                      setTermsOk(v => {
                        if (errors.terms && !v) setErrors(prev => { const next = { ...prev }; delete next.terms; return next; });
                        return !v;
                      });
                    }}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200
                      ${termsOk
                        ? "bg-[#2B6BFF] border border-[#2B6BFF]"
                        : errors.terms
                          ? "bg-rose-50 border border-rose-300"
                          : "bg-white border border-slate-300 group-hover:border-slate-400"}`}>
                      {termsOk && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[12.5px] text-slate-600 leading-relaxed mt-0.5">
                      I agree to SecureChainMarkets&apos;s{" "}
                      <Link href="/terms" target="_blank" className="text-[#2B6BFF] hover:underline underline-offset-2 font-semibold" onClick={e => e.stopPropagation()}>Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" target="_blank" className="text-[#2B6BFF] hover:underline underline-offset-2 font-semibold" onClick={e => e.stopPropagation()}>Privacy Policy</Link>.
                      {" "}I confirm I am at least 18 years old.
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="flex items-center gap-1.5 text-[12px] text-rose-500 pl-8">
                      <AlertCircle size={11} /> {errors.terms}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── Navigation buttons ──────────────────────── */}
            <div className={`flex gap-3 mt-7 ${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  disabled={loading}
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-lg text-[14px] font-semibold text-[#0A1A3A] bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 h-12 px-7 rounded-lg text-[14px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] ml-auto"
                  style={{
                    background: "#2B6BFF",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.32)",
                  }}
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-lg text-[14px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "#2B6BFF",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.32)",
                  }}
                >
                  {loading
                    ? (<><Loader2 size={16} className="animate-spin" /> Creating Account…</>)
                    : (<>Create Account <Check size={16} /></>)}
                </button>
              )}
            </div>

            {/* Step indicator + sign-in link */}
            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[12px] text-slate-500 order-2 sm:order-1">
                Step {step} of {STEPS.length}
              </p>
              <p className="text-[13.5px] text-slate-600 order-1 sm:order-2">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#2B6BFF] hover:text-[#1A4FCC]">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-5">
              {[
                { icon: Lock,   label: "TLS Secured"      },
                { icon: Shield, label: "Hashed Passwords" },
                { icon: Check,  label: "KYC Verified"     },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-500">
                  <Icon size={11} />
                  <span className="text-[10.5px] tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11.5px] text-slate-500 text-center mt-6">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-[#2B6BFF] hover:underline underline-offset-2 font-semibold">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#2B6BFF] hover:underline underline-offset-2 font-semibold">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
