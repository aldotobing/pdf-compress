"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploader from "../components/FileUploader";
import CompressionOptions from "../components/CompressionOptions";
import CompressionProgress from "../components/CompressionProgress";
import DownloadSection from "../components/DownloadSection";
import { compressPDF } from "../utils/pdfCompressor";
import type { CompressedFile, CompressionLevel } from "../types";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<CompressedFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);

  // Compression presets
  const compressionPresets = {
    low: 20,
    medium: 50,
    high: 70,
  };

  // Default compression level
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
    setIsCompressing(true);
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
    setIsCompressing(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8">
          PDF Compressor
        </h1>
        <p className="text-lg text-center text-gray-700 mb-10">
          Upload your PDFs and compress them seamlessly with modern simplicity.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <FileUploader
              onFileUpload={handleFileUpload}
              maxFiles={5}
              files={files}
              onRemoveFile={handleRemoveFile}
            />

            <CompressionOptions
              compressionLevel={compressionLevel}
              setCompressionLevel={setCompressionLevel}
            />

            <motion.button
              onClick={handleCompress}
              disabled={files.length === 0 || isCompressing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`mt-8 w-full bg-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                isCompressing ? "cursor-wait" : ""
              }`}
            >
              {isCompressing ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-75"></span>
                  <span>Compressing...</span>
                </div>
              ) : (
                "Compress PDFs"
              )}
            </motion.button>

            <AnimatePresence>
              {isCompressing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
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
                  className="mt-8"
                >
                  <DownloadSection compressedFiles={compressedFiles} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
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
