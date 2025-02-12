"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "../components/FileUploader";
import CompressionOptions from "../components/CompressionOptions";
import CompressionProgress from "../components/CompressionProgress";
import { compressPDF } from "../utils/pdfCompressor";
import { mergePDFs } from "../utils/pdfMerger";
import type { CompressedFile, CompressionLevel } from "../types";
import DownloadSection from "../components/DownloadSection";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<CompressedFile[]>([]);
  const [mergedFile, setMergedFile] = useState<Blob | null>(null);
  const [mergeFileName, setMergeFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [currentMode, setCurrentMode] = useState<"compress" | "merge">(
    "compress"
  );

  const compressionPresets = {
    low: 20,
    medium: 50,
    high: 70,
  };

  const [compressionLevel, setCompressionLevel] = useState<number>(
    compressionPresets.medium
  );

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...uploadedFiles].slice(0, 5);
      setProgress(new Array(newFiles.length).fill(0));
      return newFiles;
    });
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleCompress = async () => {
    setIsProcessing(true);
    const compressed: CompressedFile[] = [];
    const levelKey =
      (Object.entries(compressionPresets).find(
        ([, value]) => value === compressionLevel
      )?.[0] as CompressionLevel) || "medium";

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
    setIsProcessing(false);
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const result = await mergePDFs(files);
      setMergedFile(result);
      // Generate a unique filename based on the current time
      const uniqueName =
        "merged_" + new Date().toISOString().replace(/[:.-]/g, "") + ".pdf";
      setMergeFileName(uniqueName);
    } catch (error) {
      console.error("Error merging PDFs:", error);
    }
    setIsProcessing(false);
  };

  // Shared action button classes
  const actionButtonClasses =
    "mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8">
          PDF Utility Tool
        </h1>
        <p className="text-lg text-center text-gray-700 mb-10">
          Choose between compressing or merging your PDF files for efficient
          management.
          <br />
          <span className="text-gray-600 font-medium">
            Compress to reduce file sizes for easier storage and sharing, or
            merge multiple PDFs into one for seamless organization.
          </span>
        </p>

        {/* Redesigned Toggle Switch */}
        <div className="relative w-64 h-12 mx-auto bg-gray-100 rounded-full flex items-center overflow-hidden shadow-md mb-8">
          <motion.div
            className="absolute top-1 left-1 h-10 w-[48%] bg-blue-600 rounded-full"
            animate={{ x: currentMode === "compress" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <button
            onClick={() => setCurrentMode("compress")}
            className={`relative z-10 flex-1 text-center font-bold ${
              currentMode === "compress" ? "text-white" : "text-gray-700"
            }`}
          >
            Compress
          </button>
          <button
            onClick={() => setCurrentMode("merge")}
            className={`relative z-10 flex-1 text-center font-bold ${
              currentMode === "merge" ? "text-white" : "text-gray-700"
            }`}
          >
            Merge
          </button>
        </div>

        {/* Animate the FileUploader with mode changes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode + "-uploader"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <FileUploader
              onFileUpload={handleFileUpload}
              maxFiles={5}
              files={files}
              onRemoveFile={handleRemoveFile}
            />
          </motion.div>
        </AnimatePresence>

        {/* Animate mode-specific content */}
        <AnimatePresence mode="wait">
          {currentMode === "compress" && (
            <motion.div
              key="compress-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6 p-8 sm:p-10"
            >
              <CompressionOptions
                compressionLevel={compressionLevel}
                setCompressionLevel={setCompressionLevel}
              />
              <motion.button
                onClick={handleCompress}
                disabled={files.length === 0 || isProcessing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={actionButtonClasses}
              >
                {isProcessing ? "Compressing..." : "Compress PDFs"}
              </motion.button>
              {isProcessing && (
                <CompressionProgress files={files} progress={progress} />
              )}
              {compressedFiles.length > 0 && (
                <DownloadSection compressedFiles={compressedFiles} />
              )}
            </motion.div>
          )}

          {currentMode === "merge" && (
            <motion.div
              key="merge-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6 p-8 sm:p-10"
            >
              <motion.button
                onClick={handleMerge}
                disabled={files.length === 0 || isProcessing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={actionButtonClasses}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-75"></span>
                    <span>Merging...</span>
                  </div>
                ) : (
                  "Merge PDFs"
                )}
              </motion.button>

              {mergedFile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-xl shadow-md text-center"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    🎉 Your merged PDF is ready!
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={URL.createObjectURL(mergedFile)}
                      download={mergeFileName}
                      className="bg-green-600 text-white py-2 px-6 rounded-lg font-bold shadow-lg hover:bg-green-700 transition-all"
                    >
                      Download PDF
                    </a>
                    <button
                      onClick={() =>
                        window.open(URL.createObjectURL(mergedFile), "_blank")
                      }
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all"
                    >
                      Preview PDF
                    </button>
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="bg-purple-600 text-white py-2 px-6 rounded-lg font-bold shadow-lg hover:bg-purple-700 transition-all"
                    >
                      + New
                    </button>
                  </div>
                  {/* Celebratory GIF below the result */}
                  <motion.img
                    src="/assets/img/tuzki.gif"
                    alt="Tuzki Celebration"
                    className="mx-auto mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-8 flex flex-col items-center space-y-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center text-sm text-gray-600 font-medium"
          >
            🔒 Your files are processed locally and never leave your device,
            ensuring maximum privacy and security.
          </motion.p>

          <p className="text-center text-sm text-gray-600 font-medium">
            Built with ❤️ by{" "}
            <span className="font-semibold text-blue-500">Aldo Tobing</span>
          </p>

          <div className="flex space-x-4">
            <a
              href="https://github.com/aldotobing"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-300"
            >
              <img
                src="/assets/img/github-mark.png"
                alt="GitHub"
                className="h-5 w-5"
              />
            </a>
            <a
              href="https://twitter.com/aldo_tobing"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-300"
            >
              <img src="/assets/img/x.png" alt="Twitter" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
