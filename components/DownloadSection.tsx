import { motion } from "framer-motion"
import type { CompressedFile } from "../types"
import { FiDownload, FiCheckCircle } from "react-icons/fi"

interface DownloadSectionProps {
  compressedFiles: CompressedFile[]
}

export default function DownloadSection({ compressedFiles }: DownloadSectionProps) {
  const handleDownloadAll = () => {
    compressedFiles.forEach((file) => {
      const link = document.createElement("a")
      link.href = file.downloadUrl
      link.download = `compressed_${file.originalFile.name}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Compressed Files</h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                File Name
              </th>
              <th scope="col" className="px-6 py-3">
                Original Size
              </th>
              <th scope="col" className="px-6 py-3">
                Compressed Size
              </th>
              <th scope="col" className="px-6 py-3">
                Reduction
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {compressedFiles.map((file, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap">{file.originalFile.name}</td>
                <td className="px-6 py-4">{formatFileSize(file.originalFile.size)}</td>
                <td className="px-6 py-4">{formatFileSize(file.compressedSize)}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center text-green-600">
                    <FiCheckCircle className="mr-1" />
                    {calculateReduction(file.originalFile.size, file.compressedSize)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <motion.a
                    href={file.downloadUrl}
                    download={`compressed_${file.originalFile.name}`}
                    className="text-blue-600 hover:text-blue-800 transition duration-300"
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
      <motion.button
        onClick={handleDownloadAll}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center"
      >
        <FiDownload className="mr-2" />
        Download All
      </motion.button>
    </motion.div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function calculateReduction(originalSize: number, compressedSize: number): string {
  const reduction = ((originalSize - compressedSize) / originalSize) * 100
  return reduction.toFixed(2) + "%"
}

