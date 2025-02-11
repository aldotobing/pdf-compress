import { PDFDocument } from "pdf-lib"
import type { CompressionLevel } from "../types"

export async function compressPDF(
  file: File,
  compressionLevel: CompressionLevel,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)

  const totalPages = pdfDoc.getPageCount()

  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i)
    const { width, height } = page.getSize()

    // Apply compression based on the selected level
    let scale: number
    switch (compressionLevel) {
      case "low":
        scale = 0.9
        break
      case "medium":
        scale = 0.7
        break
      case "high":
        scale = 0.5
        break
    }

    page.scale(scale, scale)

    // Update progress
    onProgress(Math.round(((i + 1) / totalPages) * 100))
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: "application/pdf" })
}

