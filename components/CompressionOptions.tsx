import { motion, AnimatePresence } from "framer-motion";
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

  const presets = [
    { value: 20, label: "Low" },
    { value: 50, label: "Medium" },
    { value: 80, label: "High" },
  ];

  const getColorTheme = (level: number) => {
    if (level <= 30) return { primary: "#22c55e", secondary: "#86efac" };
    if (level <= 60) return { primary: "#3b82f6", secondary: "#93c5fd" };
    return { primary: "#ef4444", secondary: "#fca5a5" };
  };

  const getQualityDescription = (level: number) => {
    if (level <= 30)
      return {
        emoji: "🎨",
        text: [
          "Minimal",
          "compression:",
          "top-tier",
          "vibes,",
          "crystal-clear",
          "quality!",
        ],
        highlights: ["Minimal", "top-tier", "crystal-clear"],
      };
    if (level <= 60)
      return {
        emoji: "⚖️",
        text: [
          "Balanced",
          "mode:",
          "sweet",
          "spot",
          "between",
          "quality",
          "and",
          "size!",
        ],
        highlights: ["Balanced", "sweet spot", "quality"],
      };
    return {
      emoji: "📉",
      text: [
        "Maximum",
        "compression:",
        "compact",
        "size,",
        "reduced",
        "quality.",
      ],
      highlights: ["Maximum", "compact", "reduced"],
    };
  };

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

  const colorTheme = getColorTheme(compressionLevel);
  const description = getQualityDescription(compressionLevel);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mt-8 antialiased"
    >
      <h2 className="text-xl font-medium text-gray-900 text-center tracking-tight">
        Compression Level
      </h2>

      <div className="h-12 mt-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={description.emoji}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-gray-600 text-sm text-center leading-relaxed tracking-wide"
          >
            <span className="mr-1">{description.emoji}</span>
            {description.text.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`${
                  description.highlights.includes(word)
                    ? `font-medium`
                    : "font-normal"
                }`}
                style={{
                  color: description.highlights.includes(word)
                    ? colorTheme.primary
                    : "",
                }}
              >
                {word + " "}
              </motion.span>
            ))}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="px-4 py-6 bg-white rounded-lg shadow-sm mt-6">
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

        <div className="relative w-full h-6">
          {presets.map(({ value, label }) => (
            <motion.div
              key={label}
              className="absolute transform -translate-x-1/2 text-center"
              style={{ left: `${value}%` }}
            >
              <motion.div
                animate={{
                  backgroundColor:
                    Math.abs(compressionLevel - value) < 5
                      ? colorTheme.primary
                      : "#94a3b8",
                  height: Math.abs(compressionLevel - value) < 5 ? 12 : 8,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="w-0.5 mb-1 mx-auto origin-bottom"
              />
              <motion.span
                animate={{
                  color:
                    Math.abs(compressionLevel - value) < 5
                      ? colorTheme.primary
                      : "#4b5563",
                  scale: Math.abs(compressionLevel - value) < 5 ? 1.1 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="text-xs font-medium tracking-wide"
              >
                {label}
              </motion.span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center h-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={compressionLevel}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [1, 1.2, 1],
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                scale: {
                  duration: 0.3,
                  times: [0, 0.5, 1],
                },
              }}
              className="absolute w-full"
            >
              <motion.span
                className="text-xl font-medium tracking-tight"
                animate={{ color: colorTheme.primary }}
                transition={{ duration: 0.3 }}
              >
                {compressionLevel}%
              </motion.span>
              <span className="text-gray-600 text-sm ml-1 tracking-wide">
                compression
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
