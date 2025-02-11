import { motion } from "framer-motion"

interface CompressionProgressProps {
  files: File[]
  progress: number[]
}

export default function CompressionProgress({ files, progress }: CompressionProgressProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Compression Progress</h2>
      {files.map((file, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="mb-4"
        >
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">{file.name}</span>
            <span className="text-sm font-medium text-gray-600">{progress[index]}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress[index]}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

