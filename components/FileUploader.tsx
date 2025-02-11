"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
  maxFiles: number;
  files: File[];
  onRemoveFile: (index: number) => void;
}

export default function FileUploader({
  onFileUpload,
  maxFiles,
  files,
  onRemoveFile, // Tambahkan props
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );
      onFileUpload(pdfFiles.slice(0, maxFiles));
    },
    [onFileUpload, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles,
  });

  return (
    <div>
      <motion.div
        {...(getRootProps() as any)}
        animate={{ scale: isDragActive ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-300 ease-in-out ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        <div>
          <motion.div
            animate={{ y: isDragActive ? -10 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <FiUploadCloud className="mx-auto text-5xl text-blue-500 mb-4" />
            {isDragActive ? (
              <p className="text-blue-500 font-semibold">
                Drop the PDF files here ...
              </p>
            ) : (
              <p className="text-gray-600">
                Drag & drop up to {maxFiles} PDF files here, or click to select
                files
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Selected Files:
          </h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between text-sm text-gray-600 bg-gray-100 rounded-md p-2"
              >
                <div className="flex items-center">
                  <FiFile className="mr-2 text-blue-500" />
                  {file.name}
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FiX />
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
