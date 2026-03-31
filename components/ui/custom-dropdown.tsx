"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        } flex items-center justify-between group text-left`}
      >
        <span
          className={`font-medium text-sm ${
            selectedOption ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            className={`w-4 h-4 ${error ? "text-red-500" : "text-gray-400"}`}
          />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute w-full mt-2 rounded-xl border-2 border-gray-200 overflow-hidden shadow-2xl bg-white z-50 max-h-64 overflow-y-auto"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.03 }}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left transition-colors duration-150 flex items-center justify-between group ${
                  value === option.value
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50 text-gray-700"
                } ${
                  index !== options.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </div>
                  )}
                </div>
                {value === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  >
                    <Check className="w-4 h-4 text-black" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
    