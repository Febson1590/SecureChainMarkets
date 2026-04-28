"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/auth";
import {
  Eye, EyeOff, Lock, Mail, User, Phone, Globe,
  Loader2, AlertCircle, CheckCircle2, Check,
  ChevronRight, ChevronLeft, Shield, MapPin,
  ShieldCheck, TrendingUp, Zap, Headphones,
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
  { label: "At least 8 characters",     test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Contains number",           test: (p: string) => /[0-9]/.test(p) },
];

const STEPS = [
  { n: 1, label: "Personal Info", icon: User,   heading: "Personal Information", sub: "Set up your trading profile"          },
  { n: 2, label: "Location",      icon: Globe,  heading: "Location",             sub: "Set your regional trading preferences" },
  { n: 3, label: "Security",      icon: Shield, heading: "Account Security",     sub: "Secure your trading account"           },
];

const features = [
  { icon: ShieldCheck, title: "Bank-Level Security",  desc: "Your funds and data are protected with 256-bit SSL encryption." },
  { icon: TrendingUp,  title: "Advanced Trading",     desc: "Access real-time markets, advanced charts, and powerful trading tools." },
  { icon: Zap,         title: "Instant Transactions", desc: "Deposit, trade, and withdraw with fast and secure processing." },
  { icon: Headphones,  title: "24/7 Expert Support",  desc: "Our dedicated support team is here to help you anytime." },
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
    state:           "",
    city:            "",
    address:         "",
    password:        "",
    confirmPassword: "",
  });

  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [showPwd,      setShowPwd]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [verifyState,  setVerifyState]  = useState<"idle" | "checking" | "verified">("idle");
  const [termsOk,      setTermsOk]      = useState(false);
  const [privacyOk,    setPrivacyOk]    = useState(false);
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
      else if (!/[a-z]/.test(formData.password)) errs.password = "Include at least one lowercase letter";
      else if (!/[0-9]/.test(formData.password)) errs.password = "Include at least one number";
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
      if (verifyState !== "verified") errs.verify = "Please complete human verification";
      if (!termsOk)   errs.terms   = "You must accept the Terms & Conditions";
      if (!privacyOk) errs.privacy = "You must accept the Privacy Policy";
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

        {/* ════════════════════ LEFT — Welcome + features + illustration ═════════════════ */}
        <div className="order-2 lg:order-1">
          <h1 className="text-[36px] sm:text-[44px] font-bold tracking-tight leading-[1.1] text-[#0A1A3A]">
            Join the Markets.
            <br />
            <span className="text-[#2B6BFF]">Open Your Account.</span>
          </h1>
          <p className="mt-5 text-[14px] sm:text-[15px] text-slate-600 leading-[1.65] max-w-[460px]">
            Create your SecureChainMarkets account in minutes
            and start trading digital assets securely.
          </p>

          <div className="mt-8 space-y-4 max-w-[460px]">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/80">
                <div className="w-11 h-11 rounded-lg bg-[#2B6BFF]/10 inline-flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-5 w-5 text-[#2B6BFF]" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-[#0A1A3A] leading-tight">{f.title}</div>
                  <p className="text-[12.5px] text-slate-600 mt-1 leading-[1.55]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-[460px]">
            <div className="relative h-[220px] sm:h-[240px]">
              <ShieldIllustration />
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200/80 max-w-[460px] flex items-start gap-3">
            <Lock className="h-4 w-4 text-[#2B6BFF] mt-1 flex-shrink-0" />
            <p className="text-[12.5px] text-slate-600 leading-[1.6]">
              SecureChainMarkets is a regulated digital asset
              trading platform offering secure, transparent,
              and innovative trading solutions worldwide.
            </p>
          </div>
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
              {step === 1 && "Tell us a little about yourself to get started"}
              {step === 2 && "Set your region for compliant, optimal routing"}
              {step === 3 && "Secure your account with a strong password"}
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

                <Field label="Country" error={errors.country} required>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="State / Region" error={errors.state}>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input value={formData.state} onChange={set("state")}
                        placeholder="e.g. California" className={inputCls} />
                    </div>
                  </Field>

                  <Field label="City" error={errors.city}>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input value={formData.city} onChange={set("city")}
                        placeholder="e.g. San Francisco" className={inputCls} />
                    </div>
                  </Field>
                </div>

                <Field label="Address" error={errors.address}>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input value={formData.address} onChange={set("address")}
                      placeholder="Street address (optional)" className={inputCls} />
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

                {/* Terms checkbox */}
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
                      <Link href="/terms" target="_blank" className="text-[#2B6BFF] hover:underline underline-offset-2 font-semibold" onClick={e => e.stopPropagation()}>Terms &amp; Conditions</Link>
                      {" "}and confirm I am at least 18 years old.
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="flex items-center gap-1.5 text-[12px] text-rose-500 pl-8">
                      <AlertCircle size={11} /> {errors.terms}
                    </p>
                  )}
                </div>

                {/* Privacy checkbox */}
                <div className="space-y-1.5">
                  <label
                    className="flex items-start gap-3.5 cursor-pointer group"
                    onClick={() => {
                      setPrivacyOk(v => {
                        if (errors.privacy && !v) setErrors(prev => { const next = { ...prev }; delete next.privacy; return next; });
                        return !v;
                      });
                    }}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200
                      ${privacyOk
                        ? "bg-[#2B6BFF] border border-[#2B6BFF]"
                        : errors.privacy
                          ? "bg-rose-50 border border-rose-300"
                          : "bg-white border border-slate-300 group-hover:border-slate-400"}`}>
                      {privacyOk && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[12.5px] text-slate-600 leading-relaxed mt-0.5">
                      I have read and accept the{" "}
                      <Link href="/privacy" target="_blank" className="text-[#2B6BFF] hover:underline underline-offset-2 font-semibold" onClick={e => e.stopPropagation()}>Privacy Policy</Link>
                      {" "}covering how my data is collected and used.
                    </span>
                  </label>
                  {errors.privacy && (
                    <p className="flex items-center gap-1.5 text-[12px] text-rose-500 pl-8">
                      <AlertCircle size={11} /> {errors.privacy}
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

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0A1A3A]">
              <Lock size={14} className="text-[#2B6BFF]" />
              Your security is our priority
            </div>
            <p className="text-[12px] text-slate-500 mt-1.5">
              All connections are secured with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Stylized shield-on-plinth illustration with candlestick backdrop ─ */
function ShieldIllustration() {
  return (
    <svg viewBox="0 0 460 240" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="reg-shield-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#5C8BFF" />
          <stop offset="100%" stopColor="#1A4FCC" />
        </linearGradient>
        <linearGradient id="reg-plinth-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <radialGradient id="reg-floor-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"  stopColor="#2B6BFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2B6BFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g opacity="0.5">
        {[
          [60,140,30,8,true],   [95,120,45,8,true],  [130,100,30,8,false],
          [165,80, 50,8,true],  [200,60, 35,8,true], [235,75, 28,8,false],
          [355,100,40,8,true],  [385,80, 32,8,true], [415,60, 25,8,true],
        ].map(([x,y,h,w,up], i) => {
          const ox = Number(x), oy = Number(y), oh = Number(h), ow = Number(w);
          const green = Boolean(up);
          return (
            <g key={i}>
              <line x1={ox} y1={oy - 12} x2={ox} y2={oy + oh + 12} stroke={green ? "#10B981" : "#EF4444"} strokeWidth="1.4" opacity="0.5" />
              <rect x={ox - ow/2} y={oy} width={ow} height={oh} fill={green ? "#10B981" : "#EF4444"} opacity="0.7" rx="1.5" />
            </g>
          );
        })}
      </g>

      <ellipse cx="230" cy="210" rx="170" ry="14" fill="url(#reg-floor-glow)" />
      <ellipse cx="230" cy="208" rx="120" ry="16" fill="#0A1A3A" opacity="0.10" />
      <rect x="130" y="170" width="200" height="42" rx="10" fill="url(#reg-plinth-grad)" stroke="#CBD5E1" />
      <ellipse cx="230" cy="170" rx="100" ry="10" fill="#FFFFFF" stroke="#CBD5E1" />

      <g transform="translate(230 95)">
        <path d="M0,-65 L55,-45 L55,15 C55,45 30,65 0,75 C-30,65 -55,45 -55,15 L-55,-45 Z"
          fill="url(#reg-shield-grad)" stroke="#1A4FCC" strokeWidth="1.5" />
        <path d="M0,-58 L48,-40 L48,12 C48,38 26,55 0,64 C-26,55 -48,38 -48,12 L-48,-40 Z"
          fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1" />
        <rect x="-16" y="-5" width="32" height="28" rx="4" fill="#FFFFFF" />
        <path d="M-10,-5 L-10,-15 A10 10 0 0 1 10 -15 L10,-5" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="6" r="3" fill="#2B6BFF" />
        <rect x="-1.5" y="6" width="3" height="8" fill="#2B6BFF" />
      </g>
    </svg>
  );
}
