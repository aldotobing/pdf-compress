"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "../components/FileUploader";
import CompressionOptions from "../components/CompressionOptions";
import CompressionProgress from "../components/CompressionProgress";
import DownloadSection from "../components/DownloadSection";
import { compressPDF } from "../utils/pdfCompressor";
import type { CompressedFile, CompressionLevel } from "../types";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<CompressedFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);

  // Compression presets as a single object
  const compressionPresets = {
    low: 20,
    medium: 50,
    high: 70,
  };

  // Default compression level using a direct number
  const [compressionLevel, setCompressionLevel] = useState<number>(
    compressionPresets.medium
  );

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...uploadedFiles].slice(0, 5);
      setProgress(new Array(newFiles.length).fill(0)); // Update progress array
      return newFiles;
    });
  };

  const handleCompress = async () => {
    setIsCompressing(true);
    const compressed: CompressedFile[] = [];

    // Map number to "low" | "medium" | "high"
    const levelKey =
      (Object.entries(compressionPresets).find(
        ([, value]) => value === compressionLevel
      )?.[0] as CompressionLevel) || "medium"; // Default to "medium" if not found

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await compressPDF(file, levelKey, (p) => {
          setProgress((prev) => {
            const newProgress = [...prev];
            newProgress[i] = p;
            return newProgress;
          });
        });
        compressed.push({
          originalFile: file,
          compressedSize: result.size,
          downloadUrl: URL.createObjectURL(result),
        });
      } catch (error) {
        console.error(`Error compressing ${file.name}:`, error);
      }
    }

    setCompressedFiles(compressed);
    setIsCompressing(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          PDF Compressor
        </h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <FileUploader
              onFileUpload={handleFileUpload}
              maxFiles={5}
              files={files}
            />
            <CompressionOptions
              compressionLevel={compressionLevel}
              setCompressionLevel={setCompressionLevel}
            />
            <motion.button
              onClick={handleCompress}
              disabled={files.length === 0 || isCompressing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompressing ? "Compressing..." : "Compress PDFs"}
            </motion.button>
            <AnimatePresence>
              {isCompressing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CompressionProgress files={files} progress={progress} />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {compressedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DownloadSection compressedFiles={compressedFiles} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
