export type CompressionLevel = "low" | "medium" | "high"

export interface CompressedFile {
  originalFile: File
  compressedSize: number
  downloadUrl: string
}

