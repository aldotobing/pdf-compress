import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"

interface CompressionOptionsProps {
  compressionLevel: number
  setCompressionLevel: (level: number) => void
}

export default function CompressionOptions({ compressionLevel, setCompressionLevel }: CompressionOptionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Compression Level</h2>
      <div className="flex flex-col items-center">
        <Slider
          value={[compressionLevel]}
          onValueChange={(value) => setCompressionLevel(value[0])}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="w-full flex justify-between mt-2 text-gray-600 text-sm">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
        <p className="text-gray-700 mt-4">
          Current level: <span className="font-semibold">{compressionLevel}%</span>
        </p>
      </div>
    </motion.div>
  )
}

