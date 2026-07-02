"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiBriefcase, FiCheckCircle, FiPhone, FiArrowLeft } from "react-icons/fi";
import { normalizeNigerianPhone } from "@/lib/phone";

// --- 6-Digit OTP Input Component ---
function OtpInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return; // Only allow numbers

    const newPin = value.split("");
    newPin[index] = val;
    const finalPin = newPin.join("").slice(0, 6);
    onChange(finalPin);

    // Auto-focus next input
    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // If backspace is pressed on an empty box, jump to the previous box
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      onChange(pastedData);
      // Focus the next empty input, or the last one if full
      const focusIndex = Math.min(pastedData.length, 5);
      inputs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          title="otp code"
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 flex-1 text-center text-xl tracking-widest font-bold text-gray-900 bg-transparent border-[1.5px] border-slate-200 rounded-xl outline-none focus:border-[#00863F] focus:ring-1 focus:ring-[#00863F] transition-all"
        />
      ))}
    </div>
  );
}

// --- Main Page Component ---
type Step = "request" | "verify";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const normalizedPreview = normalizeNigerianPhone(phone);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const normalized = normalizeNigerianPhone(phone);
    if (!/^234\d{10}$/.test(normalized)) {
      setError("Enter a valid Nigerian phone number, e.g. 08012345678.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not send reset code.");
        return;
      }
      setStep("verify");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const normalized = normalizeNigerianPhone(phone);
    
    if (!/^\d{6}$/.test(pin)) {
      setError("Enter the 6-digit code from SMS.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: normalized, pin: pin }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Invalid code. Try again.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Success State UI
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
        <div className="bg-white rounded-[20px] border-[1.5px] border-gray-200 p-12 max-w-100 w-full text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">PIN reset!</h2>
          <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-110">
        {/* Header Logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
            <div className="w-10 h-10 bg-[#00863F] rounded-lg flex items-center justify-center">
              <FiBriefcase className="text-white text-xl" />
            </div>
            <span className="text-[22px] font-extrabold text-gray-900">JustJobNG</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[20px] border-[1.5px] border-gray-200 p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">
            {step === "request" ? "Forgot your PIN?" : "Enter reset code"}
          </h2>
          <p className="text-[13px] text-gray-400 mb-6">
            {step === "request"
              ? "We'll text a reset code to your phone number."
              : `Code sent to ${normalizedPreview}`}
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 px-3.5 py-2.5 rounded-lg text-[13px] mb-4">
              {error}
            </div>
          )}

          {/* Forms */}
          {step === "request" ? (
            <form onSubmit={handleRequest} className="flex flex-col gap-4.5 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone number</label>
                <div className="flex items-center border-[1.5px] border-slate-200 rounded-xl overflow-hidden focus-within:border-[#00863F] focus-within:ring-1 focus-within:ring-[#00863F] transition-all">
                  <FiPhone className="text-gray-400 ml-3 shrink-0" size={15} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="08012345678"
                    required
                    className="flex-1 border-none outline-none px-3.5 py-3 text-sm text-gray-700 bg-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white rounded-xl py-3.5 text-[15px] font-bold transition-colors ${
                  loading ? "bg-[#6CC04A] cursor-not-allowed" : "bg-[#00863F] hover:bg-[#007034] cursor-pointer"
                }`}
              >
                {loading ? "Sending…" : "Send reset code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-4.5 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">6-digit reset code</label>
                <OtpInput value={pin} onChange={setPin} />
              </div>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || pin.length < 6}
                  className={`w-full text-white rounded-xl py-3.5 text-[15px] font-bold transition-colors ${
                    loading || pin.length < 6 ? "bg-[#6CC04A] opacity-70 cursor-not-allowed" : "bg-[#00863F] hover:bg-[#007034] cursor-pointer"
                  }`}
                >
                  {loading ? "Resetting…" : "Reset PIN"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("request");
                    setPin("");
                    setError("");
                  }}
                  className="w-full bg-transparent border-none text-[#00863F] text-[13px] font-semibold cursor-pointer hover:underline"
                >
                  Use a different number
                </button>
              </div>
            </form>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 no-underline hover:text-gray-800 transition-colors"
            >
              <FiArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}