// "use client";

// import { useState, useEffect, useRef } from "react";

// // ─── Decorative SVG Watermark ─────────────────────────────────────────────────
// function ChartWatermark() {
//   return (
//     <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
//       <rect x="3" y="3" width="294" height="194" fill="none" stroke="#8b6914" strokeWidth="2.5" />
//       <line x1="3"   y1="3"   x2="297" y2="197" stroke="#8b6914" strokeWidth="1.2" />
//       <line x1="297" y1="3"   x2="3"   y2="197" stroke="#8b6914" strokeWidth="1.2" />
//       <line x1="150" y1="3"   x2="3"   y2="100" stroke="#8b6914" strokeWidth="1.2" />
//       <line x1="3"   y1="100" x2="150" y2="197" stroke="#8b6914" strokeWidth="1.2" />
//       <line x1="150" y1="197" x2="297" y2="100" stroke="#8b6914" strokeWidth="1.2" />
//       <line x1="297" y1="100" x2="150" y2="3"   stroke="#8b6914" strokeWidth="1.2" />
//     </svg>
//   );
// }

// // ─── Rashi Dots Animator ──────────────────────────────────────────────────────
// function RashiDots() {
//   const [active, setActive] = useState(0);
//   useEffect(() => {
//     const id = setInterval(() => setActive((p) => (p + 1) % 12), 800);
//     return () => clearInterval(id);
//   }, []);
//   return (
//     <div className="flex gap-1.5 justify-center mt-6">
//       {Array.from({ length: 12 }).map((_, i) => (
//         <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
//           style={{ background: i === active ? "#8b6914" : "#e8d89a" }} />
//       ))}
//     </div>
//   );
// }

// // ─── Step Progress Bar — NEW ORDER: Plan → Payment → Account ─────────────────
// const STEPS = ["Plan", "Payment", "Account"];

// function StepBar({ current }) {
//   return (
//     <div className="flex items-start w-full max-w-sm mx-auto mb-8">
//       {STEPS.map((label, idx) => {
//         const num = idx + 1;
//         const isDone   = num < current;
//         const isActive = num === current;
//         return (
//           <div key={label} className="flex items-start flex-1">
//             <div className="flex flex-col items-center flex-1">
//               <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 border"
//                 style={{
//                   background:  isDone ? "#c9a84c" : isActive ? "#8b6914" : "#fffef9",
//                   borderColor: isDone || isActive ? "transparent" : "#d4b96a",
//                   color:       isDone || isActive ? "#fffef9" : "#c9a84c",
//                 }}>
//                 {isDone ? (
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                 ) : num}
//               </div>
//               <span className="text-xs mt-1.5 tracking-widest uppercase"
//                 style={{ color: isActive ? "#8b6914" : "#c9a84c", fontWeight: isActive ? 500 : 300, letterSpacing: "0.12em" }}>
//                 {label}
//               </span>
//             </div>
//             {idx < STEPS.length - 1 && (
//               <div className="h-px flex-1 mt-4 transition-colors duration-500"
//                 style={{ background: num < current ? "#c9a84c" : "#d4b96a" }} />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Shared Field / Input ─────────────────────────────────────────────────────
// function Field({ label, hint, error, children }) {
//   return (
//     <div className="mb-4">
//       {label && (
//         <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#8b6914", letterSpacing: "0.12em" }}>
//           {label}
//         </label>
//       )}
//       {children}
//       {hint  && !error && <p className="text-xs mt-1" style={{ color: "#a08040" }}>{hint}</p>}
//       {error && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{error}</p>}
//     </div>
//   );
// }

// function Input({ hasError, ...props }) {
//   const [focused, setFocused] = useState(false);
//   return (
//     <input {...props}
//       onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
//       onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
//       className="w-full px-3.5 py-2.5 text-sm font-light outline-none transition-colors duration-200"
//       style={{
//         background: "#fffef9",
//         border: `1px solid ${hasError ? "#b91c1c" : focused ? "#8b6914" : "#d4b96a"}`,
//         borderRadius: "2px", color: "#3d2800", fontFamily: "'Jost', sans-serif",
//         ...props.style,
//       }}
//     />
//   );
// }

// // ─── Plan Data ────────────────────────────────────────────────────────────────
// const PLANS = [
//   { key: "starter",    name: "100 Kundalis",   total: 100,  desc: "Ideal for individual astrologers", amount: 999,  per: "₹9.99 / kundali",  popular: false },
//   { key: "pro",        name: "500 Kundalis",   total: 500,  desc: "Best for active practitioners",    amount: 3499, per: "₹6.99 / kundali",  popular: true  },
//   { key: "enterprise", name: "1,000 Kundalis", total: 1000, desc: "For institutions & large bureaus", amount: 5999, per: "₹5.99 / kundali",  popular: false },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // STEP 1 — Choose Plan
// // (was Step 2 in original — logic unchanged)
// // ─────────────────────────────────────────────────────────────────────────────
// function StepPlan({ onNext }) {
//   const [selected, setSelected] = useState(null);
//   const [error, setError]       = useState("");

//   const handleNext = () => {
//     if (!selected) { setError("Please select a plan to continue."); return; }
//     setError("");
//     onNext({ plan: selected });
//   };

//   return (
//     <>
//       <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#8b6914", letterSpacing: "0.18em" }}>— Step 1 of 3 —</p>
//       <h2 className="text-3xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>Choose your plan</h2>
//       <p className="text-sm font-light mb-7" style={{ color: "#a08040" }}>Select the Kundali volume that fits your practice</p>

//       <div className="flex flex-col gap-3 mb-5">
//         {PLANS.map((plan) => {
//           const isSelected = selected?.key === plan.key;
//           return (
//             <div key={plan.key} onClick={() => { setSelected(plan); setError(""); }}
//               className="relative cursor-pointer transition-all duration-200"
//               style={{ border: `1px solid ${isSelected ? "#8b6914" : "#d4b96a"}`, borderRadius: "2px", background: isSelected ? "#fff8e8" : "#fffef9", padding: "14px 16px" }}>
//               {plan.popular && (
//                 <div className="absolute -top-2.5 right-3 text-xs px-2 py-0.5"
//                   style={{ background: "#8b6914", color: "#fffef9", borderRadius: "1px", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
//                   Popular
//                 </div>
//               )}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
//                     style={{ border: `1.5px solid ${isSelected ? "#8b6914" : "#c9a84c"}` }}>
//                     {isSelected && <div className="w-2 h-2 rounded-full" style={{ background: "#8b6914" }} />}
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium" style={{ color: "#3d2800" }}>{plan.name}</p>
//                     <p className="text-xs mt-0.5 font-light" style={{ color: "#a08040" }}>{plan.desc}</p>
//                   </div>
//                 </div>
//                 <div className="text-right ml-4">
//                   <p className="text-lg font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#8b6914" }}>
//                     ₹{plan.amount.toLocaleString("en-IN")}
//                   </p>
//                   <p className="text-xs font-light" style={{ color: "#c9a84c" }}>{plan.per}</p>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {error && <p className="text-xs mb-3" style={{ color: "#b91c1c" }}>{error}</p>}
//       <PrimaryButton onClick={handleNext}>Proceed to Payment →</PrimaryButton>
//       <p className="text-center text-xs mt-6 font-light" style={{ color: "#a08040" }}>
//         Already have an account?{" "}
//         <a href="/login" className="font-medium" style={{ color: "#8b6914" }}>Sign in →</a>
//       </p>
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // STEP 2 — Payment
// // (was Step 3 in original — ALL logic unchanged)
// // After payment verified, passes razorpayResponse forward to Step 3
// // ─────────────────────────────────────────────────────────────────────────────
// function StepPayment({ data, onSuccess, onBack }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState("");

//   const plan  = data.plan;
//   const gst   = Math.round(plan.amount * 0.18);
//   const total = plan.amount + gst;

//   // ── EXACT same handlePay logic from original code ─────────────────────────
//   const handlePay = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // 1. Create order from backend
//       console.log("get order id..........");
//       const res = await fetch("/api/payment/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: total * 100, currency: "INR", planKey: plan.key }),
//       });

//       const order = await res.json();
//       console.log("order id:", order);

//       if (!order?.id) throw new Error("Order creation failed");

//       // 2. Razorpay options
//       const options = {
//         key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount:      order.amount,
//         currency:    order.currency,
//         order_id:    order.id,
//         name:        "MD Vedic Kundali",
//         description: plan.name,

//         handler: async function (response) {
//           try {
//             setLoading(true);

//             // VERIFY PAYMENT — unchanged
//             console.log("verify ----------------");
//             const verifyRes = await fetch("/api/payment/verify", {
//               method:  "POST",
//               headers: { "Content-Type": "application/json" },
//               body:    JSON.stringify(response),
//             });
//             const verifyData = await verifyRes.json();
//             console.log("verify Res:", verifyData);

//             if (!verifyData.success) {
//               setError("Payment verification failed.");
//               return;
//             }

//             // PAYMENT SUCCESS → go to Step 3 (Account), carry payment data
//             onSuccess({ gst, total, razorpayResponse: response });

//           } catch (err) {
//             console.error(err);
//             setError(
//               `Payment successful but something went wrong.\nPlease contact support with Transaction ID:\n${response?.razorpay_payment_id || "N/A"}`
//             );
//           } finally {
//             setLoading(false);
//           }
//         },

//         modal:  { ondismiss: () => { setLoading(false); } },
//         theme:  { color: "#8b6914" },
//       };

//       // 3. Open Razorpay popup
//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (err) {
//       console.error(err);
//       setError("Payment initialization failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#8b6914", letterSpacing: "0.18em" }}>— Step 2 of 3 —</p>
//       <h2 className="text-3xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>Complete payment</h2>
//       <p className="text-sm font-light mb-6" style={{ color: "#a08040" }}>Secure checkout · 256-bit SSL encrypted</p>

//       {/* Order Summary */}
//       <div className="mb-5 p-3.5" style={{ background: "#fff8e8", border: "1px solid #d4b96a", borderRadius: "2px" }}>
//         <div className="flex justify-between text-xs mb-1.5" style={{ color: "#7a5c2e" }}>
//           <span>{plan.name}</span><span>₹{plan.amount.toLocaleString("en-IN")}</span>
//         </div>
//         <div className="flex justify-between text-xs mb-2" style={{ color: "#7a5c2e" }}>
//           <span>GST (18%)</span><span>₹{gst.toLocaleString("en-IN")}</span>
//         </div>
//         <div className="flex justify-between text-sm font-medium pt-2" style={{ color: "#3d2800", borderTop: "1px solid #d4b96a" }}>
//           <span>Total</span>
//           <span style={{ color: "#8b6914" }}>₹{total.toLocaleString("en-IN")}</span>
//         </div>
//       </div>

//       {/* Secure Note */}
//       <div className="flex items-center gap-2 mb-5">
//         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" aria-hidden="true">
//           <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
//         </svg>
//         <span className="text-xs font-light" style={{ color: "#c9a84c" }}>
//           256-bit SSL encryption · PCI DSS compliant · Powered by Razorpay
//         </span>
//       </div>

//       {error && <p className="text-xs mb-3 whitespace-pre-line" style={{ color: "#b91c1c" }}>{error}</p>}

//       <PrimaryButton onClick={handlePay} disabled={loading}>
//         {loading ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")} →`}
//       </PrimaryButton>
//       <BackLink onClick={onBack} label="← Change plan" />
//     </>
//   );
// }

// // ─── Shared EyeIcon ───────────────────────────────────────────────────────────
// function EyeIcon({ open }) {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
//       {open ? (
//         <>
//           <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
//           <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
//           <line x1="1" y1="1" x2="23" y2="23" />
//         </>
//       ) : (
//         <>
//           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//           <circle cx="12" cy="12" r="3" />
//         </>
//       )}
//     </svg>
//   );
// }

// // ─── Payment confirmed badge (reused in both account steps) ──────────────────
// function PaymentBadge({ plan, txnId }) {
//   return (
//     <div className="flex items-center gap-2 mb-6 px-3 py-2"
//       style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "2px" }}>
//       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" aria-hidden="true">
//         <polyline points="20 6 9 17 4 12" />
//       </svg>
//       <span className="text-xs font-light" style={{ color: "#15803d" }}>
//         Payment successful for <strong>{plan?.name}</strong>
//         {" · "}Txn: {txnId}
//       </span>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // STEP 3 — Account
// //
// // Two internal modes:
// //   "new"    → email is free → show email + password + confirm → call /api/auth/signup
// //   "exists" → email already registered → show password verify banner + option to
// //              update plan (calls /api/auth/updatePlan) OR use a different email
// //
// // All existing API calls and payloads are unchanged.
// // New API added: POST /api/auth/updatePlan
// // ─────────────────────────────────────────────────────────────────────────────
// function StepAccount({ data, onNext }) {
//   // "new" | "exists" | "update-confirm"
//   const [mode, setMode]         = useState("new");
//   const [form, setForm]         = useState({ email: "", password: "", confirm: "" });
//   const [errors, setErrors]     = useState({});
//   const [showPass, setShowPass] = useState({ pass: false, confirm: false, verify: false });
//   const [loading, setLoading]   = useState(false);
//   // For existing-user mode: password to verify identity before updating plan
//   const [verifyPassword, setVerifyPassword] = useState("");
//   const [verifyError, setVerifyError]       = useState("");

//   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

//   const validateNew = () => {
//     const e = {};
//     if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
//       e.email = "Please enter a valid email address.";
//     if (form.password.length < 8)
//       e.password = "Password must be at least 8 characters.";
//     if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // ── New user: check email → register ─────────────────────────────────────
//   const handleSubmitNew = async () => {
//     if (!validateNew()) return;
//     try {
//       setLoading(true);

//       // Original checkEmailExists call — unchanged
//       const checkRes  = await fetch("/api/auth/checkEmailExists", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: form.email }),
//       });
//       const checkData = await checkRes.json();

//       // Email already exists → switch to "exists" mode instead of hard error
//       if (checkData.exists) {
//         setMode("exists");
//         setErrors({});
//         return;
//       }

//       // Original signup call — unchanged
//       console.log("register user ----------------");
//       const plan     = data.plan;
//       const gst      = data.gst;
//       const total    = data.total;
//       const response = data.razorpayResponse;
//       console.log("FINAL DATA:", data);

//       const registerRes = await fetch("/api/auth/signup", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: form.email, password: form.password,
//           planKey: plan.key, planName: plan.name, planAmount: plan.amount, totalKundali: plan.total,
//           gst, total, currency: "INR", paymentStatus: "paid",
//           razorpay_order_id:   response.razorpay_order_id,
//           razorpay_payment_id: response.razorpay_payment_id,
//           razorpay_signature:  response.razorpay_signature,
//         }),
//       });
//       const registerData = await registerRes.json();
//       console.log("register user response:", registerData);

//       if (!registerRes.ok || !registerData.user) {
//         setErrors({ email: `Registration failed. Please contact support with Transaction ID: ${response.razorpay_payment_id}` });
//         return;
//       }

//       onNext({ email: form.email, password: form.password, txnId: response.razorpay_payment_id, redirectToLogin: true });
//     } catch (err) {
//       console.error(err);
//       setErrors({ email: "Something went wrong. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Existing user: verify password → update plan ──────────────────────────
//   const handleUpdatePlan = async () => {
//     if (!verifyPassword) { setVerifyError("Please enter your password to confirm."); return; }
//     setVerifyError("");
//     try {
//       setLoading(true);
//       const plan     = data.plan;
//       const gst      = data.gst;
//       const total    = data.total;
//       const response = data.razorpayResponse;

//       // NEW endpoint — verify password + credit kundalis to existing account
//       const updateRes = await fetch("/api/auth/updatePlan", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email:    form.email,
//           password: verifyPassword,       // verified server-side with bcrypt

//           planKey:      plan.key,
//           planName:     plan.name,
//           planAmount:   plan.amount,
//           totalKundali: plan.total,

//           gst,
//           total,

//           currency:      "INR",
//           paymentStatus: "paid",

//           razorpay_order_id:   response.razorpay_order_id,
//           razorpay_payment_id: response.razorpay_payment_id,
//           razorpay_signature:  response.razorpay_signature,
//         }),
//       });
//       const updateData = await updateRes.json();
//       console.log("updatePlan response:", updateData);

//       if (!updateRes.ok) {
//         // Wrong password or other server error
//         if (updateRes.status === 401) {
//           setVerifyError("Incorrect password. Please try again.");
//         } else {
//           setVerifyError(updateData.message || `Update failed. Contact support with Txn ID: ${response.razorpay_payment_id}`);
//         }
//         return;
//       }

//       onNext({ email: form.email, txnId: response.razorpay_payment_id, redirectToLogin: true, isUpdate: true });
//     } catch (err) {
//       console.error(err);
//       setVerifyError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── "Use a different email" — reset back to new mode ─────────────────────
//   const handleUseDifferentEmail = () => {
//     setMode("new");
//     setForm((f) => ({ ...f, email: "" }));
//     setVerifyPassword("");
//     setVerifyError("");
//     setErrors({});
//   };

//   const txnId = data.razorpayResponse?.razorpay_payment_id;

//   // ── Render: exists mode ───────────────────────────────────────────────────
//   if (mode === "exists") {
//     return (
//       <>
//         <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#8b6914", letterSpacing: "0.18em" }}>— Step 3 of 3 —</p>
//         <h2 className="text-3xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>Account found</h2>
//         <p className="text-sm font-light mb-4" style={{ color: "#a08040" }}>
//           This email is already registered. You can top-up your Kundali credits.
//         </p>

//         <PaymentBadge plan={data.plan} txnId={txnId} />

//         {/* Existing email display (read-only) */}
//         <div className="mb-4">
//           <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#8b6914", letterSpacing: "0.12em" }}>
//             Registered email
//           </label>
//           <div className="flex items-center justify-between px-3.5 py-2.5"
//             style={{ border: "1px solid #d4b96a", borderRadius: "2px", background: "#fff8e8" }}>
//             <span className="text-sm font-light" style={{ color: "#3d2800" }}>{form.email}</span>
//             <button type="button" onClick={handleUseDifferentEmail}
//               className="text-xs font-medium transition-colors duration-150 ml-3 flex-shrink-0"
//               style={{ color: "#8b6914", background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif" }}>
//               Change →
//             </button>
//           </div>
//         </div>

//         {/* Plan top-up info */}
//         <div className="mb-5 p-3.5" style={{ background: "#fff8e8", border: "1px solid #d4b96a", borderRadius: "2px" }}>
//           <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#8b6914", letterSpacing: "0.1em" }}>Plan top-up</p>
//           <div className="flex justify-between text-sm" style={{ color: "#3d2800" }}>
//             <span className="font-light">Adding</span>
//             <span className="font-medium" style={{ color: "#8b6914" }}>+{data.plan?.total?.toLocaleString("en-IN")} Kundalis</span>
//           </div>
//           <div className="flex justify-between text-xs mt-1" style={{ color: "#7a5c2e" }}>
//             <span>These will be added to your existing balance</span>
//           </div>
//         </div>

//         {/* Password verify */}
//         <div className="mb-4">
//           <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: "#8b6914", letterSpacing: "0.12em" }}>
//             Confirm your password
//           </label>
//           <div className="relative">
//             <Input
//               type={showPass.verify ? "text" : "password"}
//               placeholder="Enter your password to confirm"
//               value={verifyPassword}
//               onChange={(e) => { setVerifyPassword(e.target.value); setVerifyError(""); }}
//               hasError={!!verifyError}
//               autoComplete="current-password"
//               style={{ paddingRight: "2.5rem" }}
//             />
//             <button type="button" onClick={() => setShowPass((s) => ({ ...s, verify: !s.verify }))}
//               className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
//               style={{ color: "#c9a84c", background: "none", border: "none", cursor: "pointer" }}
//               aria-label={showPass.verify ? "Hide password" : "Show password"}>
//               <EyeIcon open={showPass.verify} />
//             </button>
//           </div>
//           {verifyError && <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{verifyError}</p>}
//         </div>

//         <PrimaryButton onClick={handleUpdatePlan} disabled={loading} className="mt-2">
//           {loading ? "Updating plan…" : "Confirm & Top-up Kundalis →"}
//         </PrimaryButton>

//         <button type="button" onClick={handleUseDifferentEmail}
//           className="block w-full text-center text-xs mt-3 font-light transition-colors duration-150"
//           style={{ color: "#a08040", background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif" }}>
//           ← Use a different email instead
//         </button>
//       </>
//     );
//   }

//   // ── Render: new user mode ─────────────────────────────────────────────────
//   return (
//     <>
//       <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#8b6914", letterSpacing: "0.18em" }}>— Step 3 of 3 —</p>
//       <h2 className="text-3xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>Create your account</h2>
//       <p className="text-sm font-light mb-3" style={{ color: "#a08040" }}>Payment confirmed · Set your login credentials</p>

//       <PaymentBadge plan={data.plan} txnId={txnId} />

//       <Field label="Email address" error={errors.email}>
//         <Input type="email" placeholder="your@email.com" value={form.email}
//           onChange={set("email")} hasError={!!errors.email} autoComplete="email" />
//       </Field>

//       <Field label="Password" hint="Minimum 8 characters" error={errors.password}>
//         <div className="relative">
//           <Input type={showPass.pass ? "text" : "password"} placeholder="••••••••••"
//             value={form.password} onChange={set("password")} hasError={!!errors.password}
//             autoComplete="new-password" style={{ paddingRight: "2.5rem" }} />
//           <button type="button" onClick={() => setShowPass((s) => ({ ...s, pass: !s.pass }))}
//             className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
//             style={{ color: "#c9a84c", background: "none", border: "none", cursor: "pointer" }}
//             aria-label={showPass.pass ? "Hide password" : "Show password"}>
//             <EyeIcon open={showPass.pass} />
//           </button>
//         </div>
//       </Field>

//       <Field label="Confirm password" error={errors.confirm}>
//         <div className="relative">
//           <Input type={showPass.confirm ? "text" : "password"} placeholder="••••••••••"
//             value={form.confirm} onChange={set("confirm")} hasError={!!errors.confirm}
//             autoComplete="new-password" style={{ paddingRight: "2.5rem" }} />
//           <button type="button" onClick={() => setShowPass((s) => ({ ...s, confirm: !s.confirm }))}
//             className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
//             style={{ color: "#c9a84c", background: "none", border: "none", cursor: "pointer" }}
//             aria-label={showPass.confirm ? "Hide password" : "Show password"}>
//             <EyeIcon open={showPass.confirm} />
//           </button>
//         </div>
//       </Field>

//       <PrimaryButton onClick={handleSubmitNew} disabled={loading} className="mt-2">
//         {loading ? "Creating account…" : "Create Account →"}
//       </PrimaryButton>
//     </>
//   );
// }

// // ─── Success Screen (unchanged from original) ─────────────────────────────────
// function SuccessScreen({ data }) {
//   return (
//     <div className="text-center py-6">
//       <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ border: "2px solid #c9a84c" }}>
//         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5" aria-hidden="true">
//           <circle cx="11" cy="11" r="9" /><line x1="11" y1="2" x2="11" y2="20" />
//           <line x1="2" y1="11" x2="20" y2="11" /><circle cx="11" cy="11" r="3" />
//         </svg>
//       </div>
//       <h2 className="text-3xl font-medium mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>
//         Your chart room awaits
//       </h2>
//       <p className="text-sm font-light mb-6" style={{ color: "#a08040" }}>Payment confirmed · Kundalis activated</p>

//       <div className="text-left p-4 mb-6" style={{ background: "#fff8e8", border: "1px solid #d4b96a", borderRadius: "2px" }}>
//         {[
//           ["Plan",        data.plan.name],
//           ["Amount paid", `₹${data.total.toLocaleString("en-IN")}`],
//           ["Transaction ID", data.txnId],
//         ].map(([k, v]) => (
//           <div key={k} className="flex justify-between text-sm py-1.5" style={{ borderBottom: "1px solid #e8d89a" }}>
//             <span className="font-light" style={{ color: "#7a5c2e" }}>{k}</span>
//             <span className="font-medium" style={{ color: "#8b6914" }}>{v}</span>
//           </div>
//         ))}
//       </div>

//       <p className="text-xs mb-6 font-light" style={{ color: "#a08040" }}>
//         A confirmation has been sent to your registered email.
//       </p>
//       {/* Original redirect: /login */}
//       <PrimaryButton onClick={() => (window.location.href = "/login")}>
//         Login to Your Account →
//       </PrimaryButton>
//       <p className="text-xs mt-5 font-light tracking-widest" style={{ color: "#c9a84c", fontFamily: "serif" }}>
//         ॥ ज्योतिषं वेदचक्षुः ॥
//       </p>
//     </div>
//   );
// }

// // ─── Shared Buttons ───────────────────────────────────────────────────────────
// function PrimaryButton({ onClick, disabled, children, className = "" }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <button type="button" onClick={onClick} disabled={disabled}
//       onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
//       className={`w-full py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-200 ${className}`}
//       style={{
//         background: disabled ? "#c9a84c" : hovered ? "#6b5010" : "#8b6914",
//         color: "#fffef9", border: "none", borderRadius: "2px",
//         fontFamily: "'Jost', sans-serif", letterSpacing: "0.18em",
//         cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.7 : 1,
//       }}>
//       {children}
//     </button>
//   );
// }

// function BackLink({ onClick, label = "← Back" }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <button type="button" onClick={onClick}
//       onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
//       className="block w-full text-center text-xs mt-3 font-light transition-colors duration-150"
//       style={{ color: hovered ? "#3d2800" : "#a08040", background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif" }}>
//       {label}
//     </button>
//   );
// }

// // ─── Main Signup Page ─────────────────────────────────────────────────────────
// export default function SignupPage() {
//   // NEW ORDER: 1=Plan, 2=Payment, 3=Account, 4=Success
//   const [step, setStep] = useState(1);
//   const [data, setData] = useState({});
//   const formRef = useRef(null);

//   const scrollTop = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

//   // Step 1 (Plan) → Step 2 (Payment)
//   const handleStep1 = (d) => { setData((p) => ({ ...p, ...d })); setStep(2); scrollTop(); };

//   // Step 2 (Payment) → Step 3 (Account)
//   // d = { gst, total, razorpayResponse }
//   const handleStep2 = (d) => { setData((p) => ({ ...p, ...d })); setStep(3); scrollTop(); };

//   // Step 3 (Account) → Step 4 (Success)
//   // d = { email, password, txnId, redirectToLogin }
//   const handleStep3 = (d) => { setData((p) => ({ ...p, ...d })); setStep(4); scrollTop(); };

//   return (
//     <div className="min-h-screen flex items-stretch" style={{ background: "#f7f3e8", fontFamily: "'Jost', sans-serif" }}>

//       {/* ══ LEFT PANEL ══ */}
//       <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r" style={{ borderColor: "#d4b96a" }}>
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
//           <div className="w-[90%]"><ChartWatermark /></div>
//         </div>

//         <div className="relative z-10">
//           <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4 border-2" style={{ borderColor: "#8b6914" }}>
//             <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#8b6914" strokeWidth="1.5" aria-hidden="true">
//               <circle cx="11" cy="11" r="9" /><line x1="11" y1="2" x2="11" y2="20" />
//               <line x1="2" y1="11" x2="20" y2="11" /><circle cx="11" cy="11" r="3" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-semibold tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>MD</h1>
//           <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#8b6914", letterSpacing: "0.15em" }}>Vedic Kundali System</p>
//         </div>

//         <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
//           <h2 className="text-5xl font-medium leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>
//             Begin your<br /><em className="not-italic" style={{ color: "#8b6914" }}>Jyotish journey.</em>
//           </h2>
//           <p className="text-sm leading-relaxed font-light max-w-xs" style={{ color: "#7a5c2e" }}>
//             Generate precise Vedic birth charts, transit maps, and planetary dashas — rooted in classical Jyotish tradition.
//           </p>
//           <div className="mt-8 flex flex-col gap-3">
//             {["Precise D1–D60 divisional charts","Vimshottari & Yogini dasha systems","Real-time transit overlays","PDF export for all charts"].map((feat) => (
//               <div key={feat} className="flex items-center gap-3">
//                 <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#8b6914" }} />
//                 <span className="text-sm font-light" style={{ color: "#7a5c2e" }}>{feat}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="relative z-10 text-xs tracking-widest" style={{ color: "#c9a84c" }}>॥ ज्योतिषं वेदचक्षुः ॥</div>
//       </div>

//       {/* ══ RIGHT PANEL ══ */}
//       <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-10" style={{ background: "#fffef9" }}>
//         <div className="w-full max-w-sm mx-auto" ref={formRef}>

//           {/* Mobile brand */}
//           <div className="flex items-center gap-3 mb-8 lg:hidden">
//             <div className="w-9 h-9 rounded-full flex items-center justify-center border-2" style={{ borderColor: "#8b6914" }}>
//               <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="#8b6914" strokeWidth="1.5" aria-hidden="true">
//                 <circle cx="11" cy="11" r="9" /><line x1="11" y1="2" x2="11" y2="20" />
//                 <line x1="2" y1="11" x2="20" y2="11" /><circle cx="11" cy="11" r="3" />
//               </svg>
//             </div>
//             <span className="text-xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>Jyotish</span>
//           </div>

//           {/* Step bar — hidden on success */}
//           {step < 4 && <StepBar current={step} />}

//           {/* ── NEW ORDER ── */}
//           {step === 1 && <StepPlan onNext={handleStep1} />}
//           {step === 2 && <StepPayment data={data} onSuccess={handleStep2} onBack={() => setStep(1)} />}
//           {step === 3 && <StepAccount data={data} onNext={handleStep3} />}
//           {step === 4 && <SuccessScreen data={data} />}

//           <RashiDots />
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";

// ─── Decorative SVG Watermark ─────────────────────────────────────────────────
function ChartWatermark() {
  return (
    <svg
      viewBox="0 0 300 200"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="294"
        height="194"
        fill="none"
        stroke="#8b6914"
        strokeWidth="2.5"
      />
      <line
        x1="3"
        y1="3"
        x2="297"
        y2="197"
        stroke="#8b6914"
        strokeWidth="1.2"
      />
      <line
        x1="297"
        y1="3"
        x2="3"
        y2="197"
        stroke="#8b6914"
        strokeWidth="1.2"
      />
      <line
        x1="150"
        y1="3"
        x2="3"
        y2="100"
        stroke="#8b6914"
        strokeWidth="1.2"
      />
      <line
        x1="3"
        y1="100"
        x2="150"
        y2="197"
        stroke="#8b6914"
        strokeWidth="1.2"
      />
      <line
        x1="150"
        y1="197"
        x2="297"
        y2="100"
        stroke="#8b6914"
        strokeWidth="1.2"
      />
      <line
        x1="297"
        y1="100"
        x2="150"
        y2="3"
        stroke="#8b6914"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// ─── Rashi Dots Animator ──────────────────────────────────────────────────────
function RashiDots() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % 12), 800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex gap-1.5 justify-center mt-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
          style={{ background: i === active ? "#8b6914" : "#e8d89a" }}
        />
      ))}
    </div>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
const STEPS = ["Account", "Plan", "Payment"];

function StepBar({ current }) {
  return (
    <div className="flex items-start w-full max-w-sm mx-auto mb-8">
      {STEPS.map((label, idx) => {
        const num = idx + 1;
        const isDone = num < current;
        const isActive = num === current;
        return (
          <div key={label} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 border"
                style={{
                  background: isDone
                    ? "#c9a84c"
                    : isActive
                      ? "#8b6914"
                      : "#fffef9",
                  borderColor: isDone || isActive ? "transparent" : "#d4b96a",
                  color: isDone || isActive ? "#fffef9" : "#c9a84c",
                }}
              >
                {isDone ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              {/* Label */}
              <span
                className="text-xs mt-1.5 tracking-widest uppercase"
                style={{
                  color: isActive ? "#8b6914" : isDone ? "#c9a84c" : "#c9a84c",
                  fontWeight: isActive ? 500 : 300,
                  letterSpacing: "0.12em",
                }}
              >
                {label}
              </span>
            </div>
            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className="h-px flex-1 mt-4 transition-colors duration-500"
                style={{ background: num < current ? "#c9a84c" : "#d4b96a" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared Input ─────────────────────────────────────────────────────────────
function Field({ label, hint, error, children }) {
  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-xs uppercase tracking-widest mb-1.5"
          style={{ color: "#8b6914", letterSpacing: "0.12em" }}
        >
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs mt-1" style={{ color: "#a08040" }}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Input({ hasError, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      className="w-full px-3.5 py-2.5 text-sm font-light outline-none transition-colors duration-200"
      style={{
        background: "#fffef9",
        border: `1px solid ${hasError ? "#b91c1c" : focused ? "#8b6914" : "#d4b96a"}`,
        borderRadius: "2px",
        color: "#3d2800",
        fontFamily: "'Jost', sans-serif",
        ...props.style,
      }}
    />
  );
}

function SelectInput({ children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full px-3.5 py-2.5 text-sm font-light outline-none transition-colors duration-200 appearance-none"
      style={{
        background: "#fffef9",
        border: `1px solid ${focused ? "#8b6914" : "#d4b96a"}`,
        borderRadius: "2px",
        color: "#3d2800",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      {children}
    </select>
  );
}

// ─── Plan Data ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    key: "starter",
    name: "100 Kundalis",
    desc: "Ideal for individual astrologers",
    amount: 999,
    per: "₹9.99 / kundali",
    popular: false,
  },
  {
    key: "pro",
    name: "500 Kundalis",
    desc: "Best for active practitioners",
    amount: 3499,
    per: "₹6.99 / kundali",
    popular: true,
  },
  {
    key: "enterprise",
    name: "1,000 Kundalis",
    desc: "For institutions & large bureaus",
    amount: 5999,
    per: "₹5.99 / kundali",
    popular: false,
  },
];

// ─── Step 1 — Account ─────────────────────────────────────────────────────────
function StepAccount({ onNext }) {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState({ pass: false, confirm: false });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
  if (!validate()) return;

  try {
    const res = await fetch("/api/auth/checkEmailExists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
      }),
    });

    const data = await res.json();

    // email already exists
    if (data.exists) {
      setErrors({
        email: "This email is already registered.",
      });

      return;
    }

    // proceed next step
    onNext({
      email: form.email,
      password: form.password,
    });
  } catch (error) {
    console.error(error);

    setErrors({
      email: "Something went wrong. Please try again.",
    });
  }
};

  const EyeIcon = ({ open }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
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

  return (
    <>
      <p
        className="text-xs uppercase tracking-widest mb-5"
        style={{ color: "#8b6914", letterSpacing: "0.18em" }}
      >
        — Step 1 of 3 —
      </p>
      <h2
        className="text-3xl font-medium mb-1"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}
      >
        Create your account
      </h2>
      <p className="text-sm font-light mb-7" style={{ color: "#a08040" }}>
        Begin your Jyotish journey
      </p>

      <Field label="Email address" error={errors.email}>
        <Input
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={set("email")}
          hasError={!!errors.email}
          autoComplete="email"
        />
      </Field>

      <Field
        label="Password"
        hint="Minimum 8 characters"
        error={errors.password}
      >
        <div className="relative">
          <Input
            type={showPass.pass ? "text" : "password"}
            placeholder="••••••••••"
            value={form.password}
            onChange={set("password")}
            hasError={!!errors.password}
            autoComplete="new-password"
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => ({ ...s, pass: !s.pass }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
            style={{ color: "#c9a84c" }}
            aria-label={showPass.pass ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPass.pass} />
          </button>
        </div>
      </Field>

      <Field label="Confirm password" error={errors.confirm}>
        <div className="relative">
          <Input
            type={showPass.confirm ? "text" : "password"}
            placeholder="••••••••••"
            value={form.confirm}
            onChange={set("confirm")}
            hasError={!!errors.confirm}
            autoComplete="new-password"
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => ({ ...s, confirm: !s.confirm }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
            style={{ color: "#c9a84c" }}
            aria-label={showPass.confirm ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPass.confirm} />
          </button>
        </div>
      </Field>

      <PrimaryButton onClick={handleSubmit} className="mt-2">
        Continue to Plan →
      </PrimaryButton>

      <p
        className="text-center text-xs mt-6 font-light"
        style={{ color: "#a08040" }}
      >
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium transition-colors duration-150"
          style={{ color: "#8b6914" }}
        >
          Sign in →
        </a>
      </p>
    </>
  );
}

// ─── Step 2 — Plan ────────────────────────────────────────────────────────────
function StepPlan({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selected) {
      setError("Please select a plan to continue.");
      return;
    }
    setError("");
    onNext({ plan: selected });
  };

  return (
    <>
      <p
        className="text-xs uppercase tracking-widest mb-5"
        style={{ color: "#8b6914", letterSpacing: "0.18em" }}
      >
        — Step 2 of 3 —
      </p>
      <h2
        className="text-3xl font-medium mb-1"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}
      >
        Choose your plan
      </h2>
      <p className="text-sm font-light mb-7" style={{ color: "#a08040" }}>
        Select the Kundali volume that fits your practice
      </p>

      <div className="flex flex-col gap-3 mb-5">
        {PLANS.map((plan) => {
          const isSelected = selected?.key === plan.key;
          return (
            <div
              key={plan.key}
              onClick={() => {
                setSelected(plan);
                setError("");
              }}
              className="relative cursor-pointer transition-all duration-200"
              style={{
                border: `1px solid ${isSelected ? "#8b6914" : "#d4b96a"}`,
                borderRadius: "2px",
                background: isSelected ? "#fff8e8" : "#fffef9",
                padding: "14px 16px",
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-2.5 right-3 text-xs px-2 py-0.5"
                  style={{
                    background: "#8b6914",
                    color: "#fffef9",
                    borderRadius: "1px",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Popular
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Radio */}
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                    style={{
                      border: `1.5px solid ${isSelected ? "#8b6914" : "#c9a84c"}`,
                    }}
                  >
                    {isSelected && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#8b6914" }}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#3d2800" }}
                    >
                      {plan.name}
                    </p>
                    <p
                      className="text-xs mt-0.5 font-light"
                      style={{ color: "#a08040" }}
                    >
                      {plan.desc}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p
                    className="text-lg font-medium"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "#8b6914",
                    }}
                  >
                    ₹{plan.amount.toLocaleString("en-IN")}
                  </p>
                  <p
                    className="text-xs font-light"
                    style={{ color: "#c9a84c" }}
                  >
                    {plan.per}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-xs mb-3" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      <PrimaryButton onClick={handleNext}>Proceed to Payment →</PrimaryButton>
      <BackLink onClick={onBack} />
    </>
  );
}

// ─── Step 3 — Payment ─────────────────────────────────────────────────────────
const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
];

function StepPayment({ data, onSuccess, onBack }) {
  const [tab, setTab] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [upiStatus, setUpiStatus] = useState(null); // null | 'ok' | 'err'
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const plan = data.plan;
  const gst = Math.round(plan.amount * 0.18);
  const total = plan.amount + gst;

  const formatCard = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
  };

  const verifyUpi = () => {
    if (upiId.includes("@")) setUpiStatus("ok");
    else setUpiStatus("err");
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Create order from backend
      console.log("get order id..........");
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total * 100,
          currency: "INR",
          planKey: plan.key,
        }),
      });

      const order = await res.json();
      console.log("order id:", order);

      if (!order?.id) {
        throw new Error("Order creation failed");
      }

      // 2. Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        name: "MD Vedic Kundali",
        description: plan.name,

        // IMPORTANT: payment success handler
        handler: async function (response) {
          try {
            setLoading(true);

            // ─────────────────────────────────────────
            // VERIFY PAYMENT
            // ─────────────────────────────────────────

            console.log("verify ----------------");

            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            console.log("verify Res:", verifyData);

            // payment verification failed
            if (!verifyData.success) {
              setError("Payment verification failed.");

              return;
            }

            // ─────────────────────────────────────────
            // PAYMENT SUCCESS
            // NOW REGISTER USER
            // ─────────────────────────────────────────

            console.log("register user ----------------");
            console.log("FINAL DATA:", data);

            const registerRes = await fetch("/api/auth/signup", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                email: data.email,
                password: data.password,

                planKey: plan.key,
                planName: plan.name,
                planAmount: plan.amount,

                gst,
                total,

                currency: "INR",
                paymentStatus: "paid",

                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const registerData = await registerRes.json();

            console.log("register user response:", registerData);

            // ─────────────────────────────────────────
            // REGISTRATION FAILED
            // BUT PAYMENT SUCCESS
            // ─────────────────────────────────────────

            if (!registerRes.ok || !registerData.user) {
              setError(
                `Payment successful but registration failed.
Please contact support with Transaction ID:
${response.razorpay_payment_id}`,
              );

              return;
            }

            // ─────────────────────────────────────────
            // ALL SUCCESS
            // ─────────────────────────────────────────

            onSuccess({
              total,
              plan,
              txnId: response.razorpay_payment_id,
              redirectToLogin: true,
            });
          } catch (err) {
            console.error(err);

            setError(
              `Payment successful but something went wrong.
Please contact support with Transaction ID:
${response?.razorpay_payment_id || "N/A"}`,
            );
          } finally {
            setLoading(false);
          }
        },

        // if payment fails
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        theme: {
          color: "#8b6914",
        },
      };

      // 5. OPEN POPUP
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const TabBtn = ({ id, label }) => (
    <button
      type="button"
      onClick={() => {
        setTab(id);
        setError("");
      }}
      className="flex-1 py-2 text-xs uppercase tracking-widest transition-colors duration-200"
      style={{
        background: tab === id ? "#8b6914" : "#fffef9",
        color: tab === id ? "#fffef9" : "#a08040",
        border: "none",
        fontFamily: "'Jost', sans-serif",
        letterSpacing: "0.1em",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      <p
        className="text-xs uppercase tracking-widest mb-5"
        style={{ color: "#8b6914", letterSpacing: "0.18em" }}
      >
        — Step 3 of 3 —
      </p>
      <h2
        className="text-3xl font-medium mb-1"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}
      >
        Complete payment
      </h2>
      <p className="text-sm font-light mb-6" style={{ color: "#a08040" }}>
        Secure checkout · 256-bit SSL encrypted
      </p>

      {/* Order Summary */}
      <div
        className="mb-5 p-3.5"
        style={{
          background: "#fff8e8",
          border: "1px solid #d4b96a",
          borderRadius: "2px",
        }}
      >
        <div
          className="flex justify-between text-xs mb-1.5"
          style={{ color: "#7a5c2e" }}
        >
          <span>{plan.name}</span>
          <span>₹{plan.amount.toLocaleString("en-IN")}</span>
        </div>
        <div
          className="flex justify-between text-xs mb-2"
          style={{ color: "#7a5c2e" }}
        >
          <span>GST (18%)</span>
          <span>₹{gst.toLocaleString("en-IN")}</span>
        </div>
        <div
          className="flex justify-between text-sm font-medium pt-2"
          style={{ color: "#3d2800", borderTop: "1px solid #d4b96a" }}
        >
          <span>Total</span>
          <span style={{ color: "#8b6914" }}>
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Secure Note */}
      <div className="flex items-center gap-2 mb-5 mt-1">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="text-xs font-light" style={{ color: "#c9a84c" }}>
          256-bit SSL encryption · PCI DSS compliant · Powered by Razorpay
        </span>
      </div>

      {error && (
        <p className="text-xs mb-3" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      <PrimaryButton onClick={handlePay} disabled={loading}>
        {loading ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")} →`}
      </PrimaryButton>
      <BackLink onClick={onBack} label="← Change plan" />
    </>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ data }) {
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError]     = useState("");

  const handleDownloadInvoice = async () => {
    try {
      setInvoiceLoading(true);
      setInvoiceError("");

      // ── Fetch real payment data from Razorpay via our API ───────────────
      // Note: on signup page token isn't stored yet, so we call without auth
      // OR pass txnId directly and fetch on server
      const res  = await fetch(
        `/api/payment/invoice?paymentId=${data.txnId}`
      );
      const payment = await res.json();

      if (!res.ok) {
        setInvoiceError("Could not fetch invoice. Please try again.");
        return;
      }

      // ── Format payment method line ──────────────────────────────────────
      let methodLine = payment.method?.toUpperCase() ?? "—";
      if (payment.method === "upi"        && payment.vpa)
        methodLine = `UPI · ${payment.vpa}`;
      if (payment.method === "netbanking" && payment.bank)
        methodLine = `Net Banking · ${payment.bank}`;
      if (payment.method === "card"       && payment.card)
        methodLine = `${payment.card.network} •••• ${payment.card.last4}`;
      if (payment.method === "wallet"     && payment.wallet)
        methodLine = `Wallet · ${payment.wallet}`;

      const invoiceDate = new Date(payment.createdAt * 1000).toLocaleDateString("en-IN", {
        day: "2-digit", month: "long", year: "numeric",
      });

      const baseAmt = data.plan.amount;
      const gst     = data.gst ?? Math.round(baseAmt * 0.18);
      const total   = payment.amount; // actual charged amount from Razorpay

      // ── Build invoice HTML ──────────────────────────────────────────────
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <title>Invoice · ${payment.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Georgia', serif;
              background: #faf8f0;
              color: #3d2800;
              padding: 48px;
            }
            .page {
              max-width: 600px;
              margin: 0 auto;
              background: #fffef9;
              border: 1px solid #d4b96a;
              padding: 48px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 32px;
              padding-bottom: 24px;
              border-bottom: 2px solid #e8d89a;
            }
            .brand-name {
              font-size: 22px;
              font-weight: 700;
              color: #3d2800;
            }
            .brand-sub {
              font-size: 10px;
              letter-spacing: 0.18em;
              color: #8b6914;
              text-transform: uppercase;
              margin-top: 4px;
              font-family: sans-serif;
            }
            .invoice-meta { text-align: right; }
            .invoice-meta h2 {
              font-size: 20px;
              color: #8b6914;
              font-weight: 400;
              letter-spacing: 0.08em;
            }
            .invoice-meta p {
              font-size: 11px;
              color: #a08040;
              margin-top: 4px;
              font-family: sans-serif;
            }
            .badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: #f0fdf4;
              border: 1px solid #86efac;
              color: #15803d;
              font-size: 11px;
              padding: 5px 14px;
              border-radius: 20px;
              margin-bottom: 28px;
              font-family: sans-serif;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px;
              margin-bottom: 32px;
            }
            .info-block p:first-child {
              font-size: 10px;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #8b6914;
              margin-bottom: 4px;
              font-family: sans-serif;
            }
            .info-block p:last-child {
              font-size: 13px;
              color: #3d2800;
              word-break: break-all;
            }
            .table-head {
              display: grid;
              grid-template-columns: 1fr auto;
              padding: 8px 12px;
              background: #fff8e8;
              border: 1px solid #d4b96a;
              font-size: 10px;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #8b6914;
              font-family: sans-serif;
            }
            .table-row {
              display: grid;
              grid-template-columns: 1fr auto;
              padding: 10px 12px;
              border: 1px solid #e8d89a;
              border-top: none;
              font-size: 13px;
            }
            .totals { border: 1px solid #e8d89a; border-top: none; }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 12px;
              font-size: 12px;
              color: #7a5c2e;
              border-bottom: 1px solid #f5edd9;
              font-family: sans-serif;
              font-weight: 300;
            }
            .total-row.grand {
              font-size: 15px;
              font-weight: 700;
              color: #3d2800;
              background: #fff8e8;
              border-bottom: none;
              padding: 12px;
            }
            .total-row.grand span:last-child { color: #8b6914; }
            .razorpay-note {
              margin-top: 20px;
              padding: 10px 14px;
              background: #f8faff;
              border: 1px solid #c7d7f5;
              border-radius: 3px;
              font-size: 11px;
              color: #3b5bdb;
              font-family: sans-serif;
              display: flex;
              justify-content: space-between;
            }
            .footer {
              margin-top: 36px;
              padding-top: 20px;
              border-top: 1px solid #e8d89a;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .footer-note {
              font-size: 11px;
              color: #a08040;
              font-family: sans-serif;
              font-weight: 300;
              line-height: 1.6;
            }
            .footer-mantra { font-size: 13px; color: #c9a84c; }
            @media print {
              body { background: white; padding: 0; }
              .page { border: none; padding: 32px; }
            }
          </style>
        </head>
        <body>
          <div class="page">

            <div class="header">
              <div>
                <div class="brand-name">MD Vedic Kundali</div>
                <div class="brand-sub">Vedic Kundali System</div>
              </div>
              <div class="invoice-meta">
                <h2>Tax Invoice</h2>
                <p>Date: ${invoiceDate}</p>
                <p style="margin-top:3px">Order: ${payment.orderId}</p>
              </div>
            </div>

            <div class="badge">✓ &nbsp;Payment Confirmed by Razorpay</div>

            <div class="info-grid">
              <div class="info-block">
                <p>Payment ID</p>
                <p>${payment.id}</p>
              </div>
              <div class="info-block">
                <p>Date &amp; Time</p>
                <p>${new Date(payment.createdAt * 1000).toLocaleString("en-IN")}</p>
              </div>
              <div class="info-block">
                <p>Email</p>
                <p>${payment.email || data.email || "—"}</p>
              </div>
              <div class="info-block">
                <p>Payment Method</p>
                <p>${methodLine}</p>
              </div>
              ${payment.contact ? `
              <div class="info-block">
                <p>Contact</p>
                <p>${payment.contact}</p>
              </div>` : ""}
            </div>

            <div class="table-head">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div class="table-row">
              <span>${data.plan.name} — Kundali Credits</span>
              <span>₹${baseAmt.toLocaleString("en-IN")}</span>
            </div>

            <div class="totals">
              <div class="total-row">
                <span>Subtotal</span>
                <span>₹${baseAmt.toLocaleString("en-IN")}</span>
              </div>
              <div class="total-row">
                <span>GST (18%)</span>
                <span>₹${gst.toLocaleString("en-IN")}</span>
              </div>
              <div class="total-row grand">
                <span>Total Paid</span>
                <span>₹${total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div class="razorpay-note">
              <span>Verified by Razorpay</span>
              <span>Payment ID: ${payment.id}</span>
            </div>

            <div class="footer">
              <div class="footer-note">
                This is a computer-generated invoice.<br/>
                No signature required.
              </div>
              <div class="footer-mantra">॥ ज्योतिषं वेदचक्षुः ॥</div>
            </div>

          </div>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: "text/html" });
      const url  = URL.createObjectURL(blob);
      const win  = window.open(url, "_blank");
      win?.addEventListener("load", () => {
        win.print();
        URL.revokeObjectURL(url);
      });

    } catch (err) {
      console.error(err);
      setInvoiceError("Something went wrong. Please try again.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ border: "2px solid #c9a84c" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="#8b6914" strokeWidth="1.5" aria-hidden="true">
          <circle cx="11" cy="11" r="9" />
          <line x1="11" y1="2" x2="11" y2="20" />
          <line x1="2" y1="11" x2="20" y2="11" />
          <circle cx="11" cy="11" r="3" />
        </svg>
      </div>

      <h2 className="text-3xl font-medium mb-1"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}>
        Your chart room awaits
      </h2>
      <p className="text-sm font-light mb-6" style={{ color: "#a08040" }}>
        Payment confirmed · Kundalis activated
      </p>

      {/* Receipt */}
      <div className="text-left p-4 mb-4"
        style={{ background: "#fff8e8", border: "1px solid #d4b96a", borderRadius: "2px" }}>
        {[
          ["Plan",           data.plan.name],
          ["Amount paid",    `₹${data.total.toLocaleString("en-IN")}`],
          ["Transaction ID", data.txnId],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm py-1.5"
            style={{ borderBottom: "1px solid #e8d89a" }}>
            <span className="font-light" style={{ color: "#7a5c2e" }}>{k}</span>
            <span className="font-medium" style={{ color: "#8b6914" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Invoice download */}
      {invoiceError && (
        <p className="text-xs mb-3" style={{ color: "#b91c1c" }}>{invoiceError}</p>
      )}
      <button type="button" onClick={handleDownloadInvoice} disabled={invoiceLoading}
        className="w-full py-2.5 text-xs uppercase tracking-widest font-medium mb-4 transition-colors duration-200"
        style={{
          background: "transparent",
          border: "1px solid #d4b96a",
          borderRadius: "2px",
          color: invoiceLoading ? "#c9a84c" : "#8b6914",
          fontFamily: "'Jost', sans-serif",
          letterSpacing: "0.18em",
          cursor: invoiceLoading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          opacity: invoiceLoading ? 0.7 : 1,
        }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        {invoiceLoading ? "Fetching Invoice…" : "Download Invoice (PDF)"}
      </button>

      <p className="text-xs mb-6 font-light" style={{ color: "#a08040" }}>
        A confirmation has been sent to your registered email.
      </p>

      <PrimaryButton onClick={() => (window.location.href = "/login")}>
        Login to Your Account →
      </PrimaryButton>

      <p className="text-xs mt-5 font-light tracking-widest"
        style={{ color: "#c9a84c", fontFamily: "serif" }}>
        ॥ ज्योतिषं वेदचक्षुः ॥
      </p>
    </div>
  );
}

// ─── Shared Buttons ───────────────────────────────────────────────────────────
function PrimaryButton({ onClick, disabled, children, className = "" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-200 ${className}`}
      style={{
        background: disabled ? "#c9a84c" : hovered ? "#6b5010" : "#8b6914",
        color: "#fffef9",
        border: "none",
        borderRadius: "2px",
        fontFamily: "'Jost', sans-serif",
        letterSpacing: "0.18em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </button>
  );
}

function BackLink({ onClick, label = "← Back" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block w-full text-center text-xs mt-3 font-light transition-colors duration-150"
      style={{
        color: hovered ? "#3d2800" : "#a08040",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      {label}
    </button>
  );
}

// ─── Main Signup Page ─────────────────────────────────────────────────────────
export default function SignupPage() {
  const [step, setStep] = useState(1); // 1 | 2 | 3 | 4 (success)
  const [data, setData] = useState({});
  const [password, setPassword] = useState();
  const formRef = useRef(null);

  const scrollTop = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleStep1 = (d) => {
    const updatedData = { ...data, ...d };
    setPassword(d.password);

    setData(updatedData);
    setStep(2);

    scrollTop();
  };

  const handleStep2 = (d) => {
    const updatedData = { ...data, ...d };

    setData(updatedData);
    setStep(3);

    scrollTop();
  };
  const handleStep3 = (d) => {
    setData((p) => ({ ...p, ...d }));
    setStep(4);
    scrollTop();
  };

  return (
    <>
      {/*
        ── Add to app/layout.tsx <head>:
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        ── tailwind.config.ts extensions:
        fontFamily: { serif: ['Cormorant Garamond', 'serif'], sans: ['Jost', 'sans-serif'] }
        colors: { gold: { 50:'#fffef9', 100:'#fff8e8', 200:'#e8d89a', 300:'#d4b96a',
                          400:'#c9a84c', 500:'#8b6914', 600:'#7a5c2e', 700:'#3d2800' } }

        ── Razorpay SDK (add to _document.tsx or layout.tsx):
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      */}

      <div
        className="min-h-screen flex items-stretch"
        style={{ background: "#f7f3e8", fontFamily: "'Jost', sans-serif" }}
      >
        {/* ══ LEFT PANEL ══ */}
        <div
          className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r"
          style={{ borderColor: "#d4b96a" }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
            <div className="w-[90%]">
              <ChartWatermark />
            </div>
          </div>

          {/* Brand */}
          <div className="relative z-10">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-4 border-2"
              style={{ borderColor: "#8b6914" }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="#8b6914"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="9" />
                <line x1="11" y1="2" x2="11" y2="20" />
                <line x1="2" y1="11" x2="20" y2="11" />
                <circle cx="11" cy="11" r="3" />
              </svg>
            </div>
            <h1
              className="text-3xl font-semibold tracking-wide"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#3d2800",
              }}
            >
              MD
            </h1>
            <p
              className="text-xs tracking-widest uppercase mt-1"
              style={{ color: "#8b6914", letterSpacing: "0.15em" }}
            >
              Vedic Kundali System
            </p>
          </div>

          {/* Hero */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
            <h2
              className="text-5xl font-medium leading-tight mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#3d2800",
              }}
            >
              Begin your
              <br />
              <em className="not-italic" style={{ color: "#8b6914" }}>
                Jyotish journey.
              </em>
            </h2>
            <p
              className="text-sm leading-relaxed font-light max-w-xs"
              style={{ color: "#7a5c2e" }}
            >
              Generate precise Vedic birth charts, transit maps, and planetary
              dashas — rooted in classical Jyotish tradition.
            </p>

            {/* Feature list */}
            <div className="mt-8 flex flex-col gap-3">
              {[
                "Precise D1–D60 divisional charts",
                "Vimshottari & Yogini dasha systems",
                "Real-time transit overlays",
                "PDF export for all charts",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <div
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: "#8b6914" }}
                  />
                  <span
                    className="text-sm font-light"
                    style={{ color: "#7a5c2e" }}
                  >
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="relative z-10 text-xs tracking-widest"
            style={{ color: "#c9a84c" }}
          >
            ॥ ज्योतिषं वेदचक्षुः ॥
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div
          className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-10"
          style={{ background: "#fffef9" }}
        >
          <div className="w-full max-w-sm mx-auto" ref={formRef}>
            {/* Mobile brand */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: "#8b6914" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  stroke="#8b6914"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="9" />
                  <line x1="11" y1="2" x2="11" y2="20" />
                  <line x1="2" y1="11" x2="20" y2="11" />
                  <circle cx="11" cy="11" r="3" />
                </svg>
              </div>
              <span
                className="text-xl font-semibold"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#3d2800",
                }}
              >
                Jyotish
              </span>
            </div>

            {/* Step bar — hidden on success */}
            {step < 4 && <StepBar current={step} />}

            {/* Step panels */}
            {step === 1 && <StepAccount onNext={handleStep1} />}
            {step === 2 && (
              <StepPlan onNext={handleStep2} onBack={() => setStep(1)} />
            )}
            {step === 3 && (
              <StepPayment
                data={data}
                onSuccess={handleStep3}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && <SuccessScreen data={data} />}

            <RashiDots />
          </div>
        </div>
      </div>
    </>
  );
}