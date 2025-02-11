import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface CompressionOptionsProps {
  compressionLevel: number;
  setCompressionLevel: (level: number) => void;
}

export default function CompressionOptions({
  compressionLevel,
  setCompressionLevel,
}: CompressionOptionsProps) {
  const [displayLevel, setDisplayLevel] = useState(compressionLevel);

  // Preset markers for better UX
  const presets = [
    { value: 20, label: "Low" },
    { value: 50, label: "Medium" },
    { value: 80, label: "High" },
  ];

  // Get quality description based on compression level
  const getQualityDescription = (level: number) => {
    if (level <= 30) return "Minimal compression, best quality";
    if (level <= 60) return "Balanced compression and quality";
    return "Maximum compression, reduced quality";
  };

  // Snap to the nearest preset when the slider stops moving
  useEffect(() => {
    const timer = setTimeout(() => {
      const nearestPreset = presets.reduce((prev, curr) =>
        Math.abs(curr.value - displayLevel) <
        Math.abs(prev.value - displayLevel)
          ? curr
          : prev
      );
      setCompressionLevel(nearestPreset.value);
    }, 200);

    return () => clearTimeout(timer);
  }, [displayLevel, setCompressionLevel]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-xl font-semibold text-gray-900 text-center">
        Compression Level
      </h2>
      <p className="text-gray-600 text-sm text-center mt-2">
        {getQualityDescription(compressionLevel)}
      </p>

      <div className="px-4 py-6 bg-white rounded-lg shadow-md mt-6 md:px-6">
        <Slider
          value={[compressionLevel]}
          onValueChange={(values) => {
            setDisplayLevel(values[0]);
            setCompressionLevel(values[0]);
          }}
          max={100}
          step={1}
          className="relative w-full h-2 rounded-full cursor-pointer mb-6"
        />

        {/* Preset markers */}
        <div className="relative w-full h-6">
          {presets.map(({ value, label }) => (
            <div
              key={label}
              className="absolute transform -translate-x-1/2 text-center"
              style={{ left: `${value}%` }}
            >
              <div
                className={`h-2 w-0.5 bg-gray-400 mb-1 mx-auto ${
                  Math.abs(compressionLevel - value) < 5 ? "bg-blue-600" : ""
                }`}
              />
              <span
                className={`text-xs md:text-sm font-medium ${
                  Math.abs(compressionLevel - value) < 5
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Animated value display */}
        <motion.div
          key={compressionLevel}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-center"
        >
          <span className="text-xl md:text-2xl font-bold text-blue-600">
            {compressionLevel}%
          </span>
          <span className="text-gray-600 text-sm ml-1 md:ml-2">
            compression
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
