"use client";

import { useState, useEffect, useRef } from "react";

// ─── Plan Data ────────────────────────────────────────────────────────────────
const PLANS = [
  { key: "starter",    name: "100 Kundalis",   total: 100,  desc: "Ideal for individual astrologers", amount: 999,  per: "₹9.99 / kundali",  popular: false },
  { key: "pro",        name: "500 Kundalis",   total: 500,  desc: "Best for active practitioners",    amount: 3499, per: "₹6.99 / kundali",  popular: true  },
  { key: "enterprise", name: "1,000 Kundalis", total: 1000, desc: "For institutions & large bureaus", amount: 5999, per: "₹5.99 / kundali",  popular: false },
];

const STEPS = ["Login", "Plan", "Payment"];

// ─── Step Bar ─────────────────────────────────────────────────────────────────
function StepBar({ current }) {
  return (
    <div className="flex items-start w-full max-w-sm mx-auto mb-8">
      {STEPS.map((label, idx) => {
        const num      = idx + 1;
        const isDone   = num < current;
        const isActive = num === current;
        return (
          <div key={label} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-all duration-300"
                style={{
                  background:  isDone ? "#c9a84c" : isActive ? "#8b6914" : "#fffef9",
                  borderColor: isDone || isActive ? "transparent" : "#d4b96a",
                  color:       isDone || isActive ? "#fffef9" : "#c9a84c",
                }}>
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : num}
              </div>
              <span className="text-xs mt-1.5 uppercase"
                style={{ color: isActive ? "#8b6914" : "#c9a84c", fontWeight: isActive ? 500 : 300, letterSpacing: "0.12em" }}>
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="h-px flex-1 mt-4 transition-colors duration-500"
                style={{ background: num < current ? "#c9a84c" : "#d4b96a" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────
function Field({ label, hint, error, children }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#8b6914", letterSpacing: "0.12em" }}>
          {label}
        </label>
      )}
      {children}
      {hint  && !error && <p className="text-xs mt-1" style={{ color: "#a08040" }}>{hint}</p>}
      {error && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{error}</p>}
    </div>
  );
}

function Input({ hasError, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input {...props}
      onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
      onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
      className="w-full px-3.5 py-2.5 text-sm font-light outline-none transition-colors duration-200"
      style={{
        background:   "#fffef9",
        border:       `1px solid ${hasError ? "#b91c1c" : focused ? "#8b6914" : "#d4b96a"}`,
        borderRadius: "2px",
        color:        "#3d2800",
        fontFamily:   "'Jost', sans-serif",
        ...props.style,
      }}
    />
  );
}

function PrimaryButton({ onClick, disabled, children, className = "" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className={`w-full py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-200 ${className}`}
      style={{
        background:   disabled ? "#c9a84c" : hovered ? "#6b5010" : "#8b6914",
        color:        "#fffef9",
        border:       "none",
        borderRadius: "2px",
        fontFamily:   "'Jost', sans-serif",
        letterSpacing:"0.18em",
        cursor:       disabled ? "not-allowed" : "pointer",
        opacity:      disabled ? 0.7 : 1,
      }}>
      {children}
    </button>
  );
}

function BackLink({ onClick, label = "← Back" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="block w-full text-center text-xs mt-3 font-light"
      style={{ color: hovered ? "#3d2800" : "#a08040", background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif" }}>
      {label}
    </button>
  );
}

function EyeIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {open ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

// ─── Step 1 — Login ───────────────────────────────────────────────────────────
function StepLogin({ onNext }) {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (!form.password)
      e.password = "Please enter your password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Verify credentials and get a temporary token
      // We reuse the existing login endpoint just to verify the account exists
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ password: data.message || "Invalid email or password." });
        return;
      }

      // Credentials verified — carry email + password forward (needed for updatePlan)
      onNext({ email: form.email, password: form.password });

    } catch (err) {
      console.error(err);
      setErrors({ password: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#8b6914", letterSpacing: "0.18em" }}>— Step 1 of 3 —</p>
      <h2 className="text-3xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>
        Verify your account
      </h2>
      <p className="text-sm font-light mb-7" style={{ color: "#a08040" }}>
        Log account that you want update
      </p>

      <Field label="Email address" error={errors.email}>
        <Input type="email" placeholder="your@email.com"
          value={form.email} onChange={set("email")}
          hasError={!!errors.email} autoComplete="email" suppressHydrationWarning  />
      </Field>

      <Field label="Password" error={errors.password}>
        <div className="relative">
          <Input type={showPass ? "text" : "password"} placeholder="••••••••••"
            value={form.password} onChange={set("password")}
            hasError={!!errors.password} autoComplete="current-password" suppressHydrationWarning 
            style={{ paddingRight: "2.5rem" }} />
          <button type="button" onClick={() => setShowPass((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "#c9a84c", background: "none", border: "none", cursor: "pointer" }}>
            <EyeIcon open={showPass} />
          </button>
        </div>
      </Field>

      <PrimaryButton onClick={handleLogin} disabled={loading} className="mt-2">
        {loading ? "Verifying…" : "Continue to Plan →"}
      </PrimaryButton>

      <p className="text-center text-xs mt-6 font-light" style={{ color: "#a08040" }}>
        Want a new account instead?{" "}
        <a href="/signup" className="font-medium" style={{ color: "#8b6914" }}>Register →</a>
      </p>
    </>
  );
}

// ─── Step 2 — Plan ────────────────────────────────────────────────────────────
function StepPlan({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  const [error, setError]       = useState("");

  const handleNext = () => {
    if (!selected) { setError("Please select a plan to continue."); return; }
    setError("");
    onNext({ plan: selected });
  };

  return (
    <>
      <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#8b6914", letterSpacing: "0.18em" }}>— Step 2 of 3 —</p>
      <h2 className="text-3xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>
        Choose your plan
      </h2>
      <p className="text-sm font-light mb-7" style={{ color: "#a08040" }}>
        Kundalis will be added to your existing balance
      </p>

      <div className="flex flex-col gap-3 mb-5">
        {PLANS.map((plan) => {
          const isSelected = selected?.key === plan.key;
          return (
            <div key={plan.key}
              onClick={() => { setSelected(plan); setError(""); }}
              className="relative cursor-pointer transition-all duration-200"
              style={{
                border:     `1px solid ${isSelected ? "#8b6914" : "#d4b96a"}`,
                borderRadius: "2px",
                background: isSelected ? "#fff8e8" : "#fffef9",
                padding:    "14px 16px",
              }}>
              {plan.popular && (
                <div className="absolute -top-2.5 right-3 text-xs px-2 py-0.5"
                  style={{ background: "#8b6914", color: "#fffef9", borderRadius: "1px", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Popular
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ border: `1.5px solid ${isSelected ? "#8b6914" : "#c9a84c"}` }}>
                    {isSelected && <div className="w-2 h-2 rounded-full" style={{ background: "#8b6914" }} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#3d2800" }}>{plan.name}</p>
                    <p className="text-xs mt-0.5 font-light" style={{ color: "#a08040" }}>{plan.desc}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#8b6914" }}>
                    ₹{plan.amount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs font-light" style={{ color: "#c9a84c" }}>{plan.per}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="text-xs mb-3" style={{ color: "#b91c1c" }}>{error}</p>}
      <PrimaryButton onClick={handleNext}>Proceed to Payment →</PrimaryButton>
      <BackLink onClick={onBack} />
    </>
  );
}

// ─── Step 3 — Payment ─────────────────────────────────────────────────────────
function StepPayment({ data, onSuccess, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const plan  = data.plan;
  const gst   = Math.round(plan.amount * 0.18);
  const total = plan.amount + gst;

  const handlePay = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Create Razorpay order
      const res   = await fetch("/api/payment/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ amount: total * 100, currency: "INR", planKey: plan.key }),
      });
      const order = await res.json();

      if (!order?.id) throw new Error("Order creation failed");

      // 2. Open Razorpay
      const options = {
        key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:   order.amount,
        currency: order.currency,
        order_id: order.id,
        name:     "MD Vedic Kundali",
        description: `Top-up · ${plan.name}`,

        handler: async function (response) {
          try {
            setLoading(true);

            // 3. Verify payment
            const verifyRes  = await fetch("/api/payment/verify", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              setError("Payment verification failed.");
              return;
            }

            // 4. Update plan — verify login + insert subscription + credit wallet
            const updateRes  = await fetch("/api/auth/updatePlan", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({
                email:    data.email,
                password: data.password,

                planKey:   plan.key,
                planName:  plan.name,
                planAmount: plan.amount,

                gst,
                total,

                currency:      "INR",
                paymentStatus: "paid",

                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            });
            const updateData = await updateRes.json();

            if (!updateRes.ok) {
              if (updateRes.status === 401) {
                setError("Password verification failed. Contact support with Txn ID: " + response.razorpay_payment_id);
              } else {
                setError(updateData.message || "Update failed. Contact support with Txn ID: " + response.razorpay_payment_id);
              }
              return;
            }

            // 5. Save new JWT and proceed to success
            if (updateData.token) {
              localStorage.setItem("token", updateData.token);
            }

            onSuccess({
              plan,
              gst,
              total,
              txnId:          response.razorpay_payment_id,
              addedKundalis:  updateData.added_kundalis,
            });

          } catch (err) {
            console.error(err);
            setError(`Payment successful but something went wrong. Contact support with Txn ID: ${response?.razorpay_payment_id || "N/A"}`);
          } finally {
            setLoading(false);
          }
        },

        modal: { ondismiss: () => setLoading(false) },
        theme: { color: "#8b6914" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setError("Payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#8b6914", letterSpacing: "0.18em" }}>— Step 3 of 3 —</p>
      <h2 className="text-3xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>
        Complete payment
      </h2>
      <p className="text-sm font-light mb-6" style={{ color: "#a08040" }}>
        Secure checkout · 256-bit SSL encrypted
      </p>

      {/* Order summary */}
      <div className="mb-5 p-3.5" style={{ background: "#fff8e8", border: "1px solid #d4b96a", borderRadius: "2px" }}>
        <div className="flex justify-between text-xs mb-1.5" style={{ color: "#7a5c2e" }}>
          <span>{plan.name}</span><span>₹{plan.amount.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-xs mb-2" style={{ color: "#7a5c2e" }}>
          <span>GST (18%)</span><span>₹{gst.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm font-medium pt-2" style={{ color: "#3d2800", borderTop: "1px solid #d4b96a" }}>
          <span>Total</span>
          <span style={{ color: "#8b6914" }}>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Top-up info */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2"
        style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "2px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-xs font-light" style={{ color: "#15803d" }}>
          +{plan.total.toLocaleString("en-IN")} Kundalis will be added to your balance
        </span>
      </div>

      {/* SSL note */}
      <div className="flex items-center gap-2 mb-5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="text-xs font-light" style={{ color: "#c9a84c" }}>
          256-bit SSL encryption · PCI DSS compliant · Powered by Razorpay
        </span>
      </div>

      {error && <p className="text-xs mb-3 whitespace-pre-line" style={{ color: "#b91c1c" }}>{error}</p>}

      <PrimaryButton onClick={handlePay} disabled={loading}>
        {loading ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")} →`}
      </PrimaryButton>
      <BackLink onClick={onBack} label="← Change plan" />
    </>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ data }) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ border: "2px solid #c9a84c" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="text-3xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>
        Kundalis topped up!
      </h2>
      <p className="text-sm font-light mb-6" style={{ color: "#a08040" }}>
        Your balance has been updated
      </p>

      <div className="text-left p-4 mb-6" style={{ background: "#fff8e8", border: "1px solid #d4b96a", borderRadius: "2px" }}>
        {[
          ["Plan",           data.plan.name],
          ["Kundalis added", `+${data.addedKundalis?.toLocaleString("en-IN")}`],
          ["Amount paid",    `₹${data.total.toLocaleString("en-IN")}`],
          ["Transaction ID", data.txnId],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm py-1.5" style={{ borderBottom: "1px solid #e8d89a" }}>
            <span className="font-light" style={{ color: "#7a5c2e" }}>{k}</span>
            <span className="font-medium" style={{ color: "#8b6914" }}>{v}</span>
          </div>
        ))}
      </div>

      <p className="text-xs mb-6 font-light" style={{ color: "#a08040" }}>
        A confirmation has been sent to your registered email.
      </p>

      <PrimaryButton onClick={() => (window.location.href = "/dashboard")}>
        Go to Dashboard →
      </PrimaryButton>

      <p className="text-xs mt-5 font-light tracking-widest" style={{ color: "#c9a84c", fontFamily: "serif" }}>
        ॥ ज्योतिषं वेदचक्षुः ॥
      </p>
    </div>
  );
}

// ─── Main Update Plan Page ────────────────────────────────────────────────────
export default function UpdatePlanPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const formRef = useRef(null);

  const scrollTop = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // ── Sign out any existing session on page load ────────────────────────────
  useEffect(() => {
  const token = localStorage.getItem("token");
  const cookieHasToken = document.cookie.includes("token=");

  if (token || cookieHasToken) {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    window.location.reload();
  }
}, []);
  const handleStep1 = (d) => { setData((p) => ({ ...p, ...d })); setStep(2); scrollTop(); };
  const handleStep2 = (d) => { setData((p) => ({ ...p, ...d })); setStep(3); scrollTop(); };
  const handleStep3 = (d) => { setData((p) => ({ ...p, ...d })); setStep(4); scrollTop(); };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4"
      style={{ background: "#f7f3e8", fontFamily: "'Jost', sans-serif" }}>
      <div className="w-full max-w-sm" ref={formRef}>

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>
            MD Vedic Kundali
          </h1>
          <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "#8b6914", letterSpacing: "0.15em" }}>
            Update Your Plan
          </p>
        </div>

        <div className="p-8" style={{ background: "#fffef9", border: "1px solid #d4b96a", borderRadius: "2px" }}>
          {step < 4 && <StepBar current={step} />}

          {step === 1 && <StepLogin  onNext={handleStep1} />}
          {step === 2 && <StepPlan   onNext={handleStep2} onBack={() => setStep(1)} />}
          {step === 3 && <StepPayment data={data} onSuccess={handleStep3} onBack={() => setStep(2)} />}
          {step === 4 && <SuccessScreen data={data} />}
        </div>

        <p className="text-xs text-center mt-6 tracking-widest" style={{ color: "#c9a84c", fontFamily: "serif" }}>
          ॥ ज्योतिषं वेदचक्षुः ॥
        </p>
      </div>
    </div>
  );
}