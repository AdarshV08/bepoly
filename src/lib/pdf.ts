// Client-only PDF text extraction using pdfjs-dist
export async function extractPdfText(file: File): Promise<{ text: string; pages: number }> {
  if (typeof window === "undefined") throw new Error("PDF parsing must run in the browser");
  const pdfjs = await import("pdfjs-dist");
  // Use CDN worker matching installed version to avoid bundling pitfalls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const version = (pdfjs as any).version as string;
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let text = "";
  const maxPages = Math.min(doc.numPages, 60); // cap for sanity
  for (let i = 1; i <= maxPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageText = content.items.map((it: any) => ("str" in it ? it.str : "")).join(" ");
    text += pageText + "\n\n";
  }
  return { text, pages: doc.numPages };
}
