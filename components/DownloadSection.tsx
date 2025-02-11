import { motion } from "framer-motion";
import type { CompressedFile } from "../types";
import { FiDownload, FiPlus, FiCheckCircle } from "react-icons/fi";

interface DownloadSectionProps {
  compressedFiles: CompressedFile[];
}

export default function DownloadSection({
  compressedFiles,
}: DownloadSectionProps) {
  const handleDownloadAll = () => {
    compressedFiles.forEach((file) => {
      const link = document.createElement("a");
      link.href = file.downloadUrl;
      link.download = `compressed_${file.originalFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleNewSession = () => {
    window.location.href = "/";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Compressed Files
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-medium uppercase bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900">
            <tr>
              <th scope="col" className="px-6 py-4">
                File Name
              </th>
              <th scope="col" className="px-6 py-4">
                Original Size
              </th>
              <th scope="col" className="px-6 py-4">
                Compressed Size
              </th>
              <th scope="col" className="px-6 py-4">
                Reduction
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {compressedFiles.map((file, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-800">
                  {file.originalFile.name}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatFileSize(file.originalFile.size)}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatFileSize(file.compressedSize)}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center text-green-500 font-semibold">
                    <FiCheckCircle className="mr-2 text-green-600" />
                    {calculateReduction(
                      file.originalFile.size,
                      file.compressedSize
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <motion.a
                    href={file.downloadUrl}
                    download={`compressed_${file.originalFile.name}`}
                    className="text-blue-500 font-medium hover:text-blue-700 transition duration-300 underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download
                  </motion.a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6">
        {/* Download All Button */}
        <motion.button
          onClick={handleDownloadAll}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        >
          <FiDownload className="text-lg sm:mr-2" />
          <span className="hidden sm:inline">Download All</span>
        </motion.button>

        {/* +New Button */}
        <motion.button
          onClick={handleNewSession}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
        >
          <FiPlus className="text-lg sm:mr-2" />
          <span className="hidden sm:inline">New</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

function calculateReduction(
  originalSize: number,
  compressedSize: number
): string {
  const reduction = ((originalSize - compressedSize) / originalSize) * 100;
  return reduction.toFixed(2) + "%";
}
