"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FloatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /** Glow color, e.g. "rgba(22,163,74,0.35)" */
  glowColor?: string;
  asChild?: boolean;
}

export function FloatButton({
  children,
  className = "",
  glowColor = "rgba(22,163,74,0.25)",
  disabled,
  ...rest
}: FloatButtonProps) {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <motion.button
      className={className}
      disabled={disabled}
      whileHover={
        disabled || prefersReduced
          ? {}
          : {
              y: -3,
              boxShadow: `0 8px 25px ${glowColor}, 0 3px 8px rgba(15,23,42,0.1)`,
            }
      }
      whileTap={disabled || prefersReduced ? {} : { scale: 0.96, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}
