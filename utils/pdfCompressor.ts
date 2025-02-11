import { PDFDocument } from "pdf-lib";
import type { CompressionLevel } from "../types";

export async function compressPDF(
  file: File,
  compressionLevel: CompressionLevel,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  // Enhanced compression settings
  const compressionSettings = {
    low: {
      useObjectStreams: true,
      objectsPerTick: 100,
      updateMetadata: false,
      preserveObjects: true,
    },
    medium: {
      useObjectStreams: true,
      objectsPerTick: 50,
      updateMetadata: false,
      preserveObjects: false,
    },
    high: {
      useObjectStreams: true,
      objectsPerTick: 20,
      updateMetadata: false,
      preserveObjects: false,
      // Additional aggressive settings
      removeUnusedObjects: true,
      compressStreams: true,
    },
  };

  // Process each page
  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPages()[i];
    onProgress(Math.round(((i + 1) / totalPages) * 100));
  }

  // Apply compression
  const settings = compressionSettings[compressionLevel];
  const pdfBytes = await pdfDoc.save({
    ...settings,
    addDefaultPage: false,
    updateFieldAppearances: false,
  });

  return new Blob([pdfBytes], { type: "application/pdf" });
}
