import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface CustomSelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder: string;
}

export function CustomSelect({ value, onChange, options, placeholder }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute available space to determine dropdown direction
  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 250px below and more space above, open upwards
      if (spaceBelow < 250 && rect.top > spaceBelow) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
  }, [open]);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full bg-[#111115] border rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-colors focus:outline-none",
          open ? "border-blue-500/60 text-white" : "border-white/[0.08] text-white hover:border-white/[0.15]",
          !selectedOption && "text-slate-400"
        )}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronRight 
          size={16} 
          className={cn(
            "text-slate-500 transition-transform duration-200", 
            open && (openUpwards ? "-rotate-90" : "rotate-90")
          )} 
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: openUpwards ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUpwards ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 w-full py-1 bg-[#1A1A24] border border-white/[0.08] rounded-xl shadow-xl max-h-60 overflow-y-auto Base-scrollbar",
              openUpwards ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors",
                  value === opt.value ? "bg-blue-600/20 text-blue-400 font-medium" : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
