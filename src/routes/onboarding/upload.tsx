import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, FileUp, Loader2, FileCheck } from "lucide-react";
import { useRef, useState } from "react";
import { OnboardingShell } from "@/components/OnboardingShell";
import { extractPdfText } from "@/lib/pdf";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/onboarding/upload")({
  component: UploadPage,
});

function UploadPage() {
  const nav = useNavigate();
  const setStore = useApp((s) => s.set);
  const pdfName = useApp((s) => s.pdfName);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setBusy(true);
    try {
      const { text, pages } = await extractPdfText(file);
      setStore({ pdfText: text, pdfName: `${file.name} · ${pages} pages` });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <OnboardingShell step={4} back="/onboarding/books">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Upload your PDF</h1>
      <p className="text-muted-foreground mt-2">
        Your file stays in your browser — nothing is uploaded.
      </p>
      <motion.label
        htmlFor="pdf"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        whileHover={{ y: -2 }}
        className={`mt-8 block cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-colors ${
          drag ? "border-primary bg-accent" : "border-border bg-card"
        }`}
      >
        <input
          ref={inputRef}
          id="pdf"
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {busy ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="font-medium">Reading your PDF…</p>
          </div>
        ) : pdfName ? (
          <div className="flex flex-col items-center gap-2">
            <FileCheck className="h-7 w-7 text-success" />
            <p className="font-bold">{pdfName}</p>
            <p className="text-xs text-muted-foreground">Tap to choose another</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <FileUp className="h-7 w-7 text-primary" />
            <p className="font-bold">Drop a PDF here or tap to choose</p>
            <p className="text-xs text-muted-foreground">Up to 50 MB / 500 pages</p>
          </div>
        )}
      </motion.label>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => nav({ to: "/onboarding/duration" })}
          disabled={!pdfName && !busy ? false : busy}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground btn-press disabled:opacity-50"
        >
          {pdfName ? "Continue" : "Skip — use AI topics"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </OnboardingShell>
  );
}
