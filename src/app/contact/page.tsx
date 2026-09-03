"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiLoader,
  FiSend,
  FiRefreshCw,
  FiPaperclip,
  FiX,
} from "react-icons/fi";

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize description textare
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [description]);

  // File Handling & Client-Side Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPG/PNG only)
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setFileError("Only JPG and PNG images are allowed.");
      return;
    }

    // Validate size (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError("File size must not exceed 5MB.");
      return;
    }

    setAttachment(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeAttachment = () => {
    setAttachment(null);
    setPreviewUrl(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isFormValid = title.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus("loading");
    setErrorMsg("");

    // Automatically capture required metadata context
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());

    // Auto-collected context fields
    formData.append("customerId", "CUST-987654321"); // Mocked: Get from auth session in production
    formData.append("platform", "VAS_Portal_Web");
    formData.append("timestamp", new Date().toISOString());
    formData.append("device", navigator.userAgent);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(
          result.error || "An unexpected error occurred. Please try again.",
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setTitle("");
    setDescription("");
    removeAttachment();
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 select-none">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#8DC63F] via-[#00A651] to-[#00863F] text-white pt-28 sm:pt-36 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] max-w-3xl mx-auto text-white">
            Report an Issue
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-100 max-w-xl mx-auto font-normal leading-relaxed">
            Experiencing difficulties with our services? Send us the details and
            our product support team will look into it.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Info Sidebar (1 Column) */}
          {/* <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-6 rounded-3xl shadow-lg flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#00A651]/10 border border-[#00A651]/20 flex items-center justify-center text-[#00A651] shrink-0 text-xl font-bold">
                <FiPhone />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                  Urgent Support
                </h4>
                <p className="text-slate-900 font-bold text-base leading-snug">
                  <span className="text-[#00A651] font-mono font-extrabold text-lg block mb-0.5">
                    *7098#
                  </span>
                  +234 801 234 5678
                </p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-6 rounded-3xl shadow-lg flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0 text-xl font-bold">
                <FiMail />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                  Direct Email
                </h4>
                <p className="text-slate-900 font-bold text-base">
                  support@vasplatform.com
                </p>
              </div>
            </div>
          </div> */}

          {/* Form Area (2 Columns) */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Complaint Form
            </h2>
            <p className="text-slate-500 text-sm mb-8 font-normal">
              Please provide as much detail as possible to help us resolve your
              issue quickly.
            </p>

            {status === "success" ? (
              <div className="text-center py-12 px-4 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#00A651]/10 border border-[#00A651]/20 flex items-center justify-center text-[#00A651] mb-6">
                  <FiCheckCircle className="text-5xl" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  Complaint Logged Successfully
                </h3>
                <p className="text-slate-600 max-w-md mx-auto text-base leading-relaxed">
                  Thank you for letting us know. Our product support team has
                  received your report.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm transition-all duration-200"
                >
                  <FiRefreshCw />
                  <span>Submit Another Issue</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Message Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex justify-between">
                    <span>
                      Message Title <span className="text-red-500">*</span>
                    </span>
                    <span className="text-slate-400 font-normal">
                      {title.length}/100
                    </span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Failed transaction on lottery top-up"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/15"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    ref={textareaRef}
                    name="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Provide full details of the complaint. (No length limit)"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#00A651] focus:ring-4 focus:ring-[#00A651]/15 resize-none overflow-hidden"
                  />
                </div>

                {/* Optional Attachment */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Attachment (Optional)
                  </label>

                  {!previewUrl ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-slate-100 hover:border-[#00A651]/50 transition-colors cursor-pointer"
                    >
                      <FiPaperclip className="text-2xl text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">
                        Click to attach a screenshot (JPG/PNG)
                      </span>
                      <span className="text-xs text-slate-400">
                        Max size: 5MB
                      </span>
                    </div>
                  ) : (
                    <div className="relative inline-flex items-center gap-4 p-3 rounded-2xl border border-slate-200 bg-white shadow-sm w-max pr-12">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 truncate max-w-40">
                          {attachment?.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {(attachment!.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                        title="Remove attachment"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png"
                    className="hidden"
                  />

                  {fileError && (
                    <p className="text-sm text-red-600 font-medium mt-1">
                      {fileError}
                    </p>
                  )}
                </div>

                {/* Error Banner */}
                {status === "error" && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading" || !isFormValid}
                  className="w-full sm:w-auto self-start inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gold hover:bg-[#00863F] disabled:opacity-50 disabled:bg-slate-400 text-white font-extrabold text-base transition-all duration-200 shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:cursor-not-allowed mt-4"
                >
                  {status === "loading" ? (
                    <>
                      <FiLoader className="animate-spin text-xl" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="text-lg" />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
