"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface FloatCardProps {
  children: React.ReactNode;
  className?: string;
  /** How high it lifts on hover, px. Default 6. */
  liftPx?: number;
  /** Max tilt in degrees. Default 5. Desktop only. */
  tiltDeg?: number;
  /** Entrance animation delay in seconds */
  delay?: number;
  /** Whether to animate on mount */
  animate?: boolean;
}

export function FloatCard({
  children,
  className = "",
  liftPx = 6,
  tiltDeg = 5,
  delay = 0,
  animate = true,
}: FloatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Mouse position motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config — soft, not bouncy
  const springConfig = { stiffness: 180, damping: 22, mass: 0.8 };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltDeg, -tiltDeg]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltDeg, tiltDeg]), springConfig);
  const liftY = useSpring(0, springConfig);
  const shadowSpread = useSpring(0, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || prefersReduced) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(cx);
      mouseY.set(cy);
    },
    [isMobile, prefersReduced, mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    if (prefersReduced) return;
    liftY.set(-liftPx);
    shadowSpread.set(1);
  }, [prefersReduced, liftY, shadowSpread, liftPx]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    liftY.set(0);
    shadowSpread.set(0);
  }, [mouseX, mouseY, liftY, shadowSpread]);

  const shouldAnimate = animate && !prefersReduced;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: isMobile || prefersReduced ? 0 : rotateX,
        rotateY: isMobile || prefersReduced ? 0 : rotateY,
        y: prefersReduced ? 0 : liftY,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
      }}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={
        prefersReduced
          ? {}
          : {
              boxShadow:
                "0 20px 60px rgba(15,23,42,0.13), 0 8px 24px rgba(15,23,42,0.09), 0 2px 6px rgba(15,23,42,0.06)",
            }
      }
    >
      {children}
    </motion.div>
  );
}
