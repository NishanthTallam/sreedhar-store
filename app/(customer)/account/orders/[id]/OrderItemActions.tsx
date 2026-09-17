"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItemActionsProps {
  variantId: string;
  productId: string;
}

/* Tiny floating heart particle */
function HeartParticle({ id, onDone }: { id: number; onDone: (id: number) => void }) {
  const x = (Math.random() - 0.5) * 36;
  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
      initial={{ opacity: 1, y: 0, x, scale: 0.7 }}
      animate={{ opacity: 0, y: -36, x, scale: 1.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={() => onDone(id)}
    >
      <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
    </motion.span>
  );
}

export default function OrderItemActions({ variantId, productId }: OrderItemActionsProps) {
  const router = useRouter();
  const [wishlistState, setWishlistState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [buyState, setBuyState] = useState<"idle" | "loading" | "error">("idle");
  const [heartParticles, setHeartParticles] = useState<number[]>([]);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const handleAddToWishlist = async () => {
    if (wishlistState === "done") return;
    setWishlistState("loading");
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Failed");
      setWishlistState("done");
      if (!prefersReduced) {
        // Fire multiple heart particles
        const ids = [Date.now(), Date.now() + 1, Date.now() + 2];
        setHeartParticles((p) => [...p, ...ids]);
      }
    } catch {
      setWishlistState("error");
      setTimeout(() => setWishlistState("idle"), 2000);
    }
  };

  const handleProceedToBuy = async () => {
    setBuyState("loading");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/checkout");
    } catch {
      setBuyState("error");
      setTimeout(() => setBuyState("idle"), 2000);
    }
  };

  const isWishlistDone = wishlistState === "done";

  return (
    <div className="relative flex flex-wrap items-center gap-2 mt-3">
      {/* ── Wishlist button ─────────────────────────────────── */}
      <div className="relative">
        {/* Floating hearts */}
        <AnimatePresence>
          {heartParticles.map((id) => (
            <HeartParticle
              key={id}
              id={id}
              onDone={(doneId) => setHeartParticles((p) => p.filter((x) => x !== doneId))}
            />
          ))}
        </AnimatePresence>

        <motion.button
          onClick={handleAddToWishlist}
          disabled={wishlistState === "loading" || isWishlistDone}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors ${isWishlistDone
              ? "bg-pink-50 text-pink-600 ring-pink-200 cursor-default"
              : wishlistState === "error"
                ? "bg-red-50 text-red-600 ring-red-200"
                : "bg-white text-gray-600 ring-gray-200 hover:bg-pink-50 hover:text-pink-600 hover:ring-pink-200"
            }`}
          whileHover={
            prefersReduced || isWishlistDone || wishlistState === "loading"
              ? {}
              : { y: -2, boxShadow: "0 6px 18px rgba(236,72,153,0.22)" }
          }
          whileTap={prefersReduced || isWishlistDone ? {} : { scale: 0.95 }}
          animate={
            isWishlistDone && !prefersReduced
              ? { scale: [1, 1.18, 1] }
              : { scale: 1 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          {wishlistState === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <motion.span
              animate={
                isWishlistDone && !prefersReduced
                  ? { scale: [1, 1.5, 1.15] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Heart
                className={`h-3.5 w-3.5 ${isWishlistDone ? "fill-pink-500 text-pink-500" : ""}`}
              />
            </motion.span>
          )}
          {isWishlistDone
            ? "Wishlisted!"
            : wishlistState === "error"
              ? "Try Again"
              : "Add to Wishlist"}
        </motion.button>
      </div>

      {/* ── Proceed to Buy button ────────────────────────────── */}
      <motion.button
        onClick={handleProceedToBuy}
        disabled={buyState === "loading"}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${buyState === "error"
            ? "bg-red-600 text-white"
            : "bg-blue-600 text-white shadow-sm"
          }`}
        whileHover={
          prefersReduced || buyState === "loading"
            ? {}
            : {
              y: -3,
              boxShadow: "0 8px 22px rgba(37,99,235,0.38), 0 3px 8px rgba(15,23,42,0.1)",
            }
        }
        whileTap={prefersReduced ? {} : { scale: 0.95, y: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 20 }}
      >
        {buyState === "loading" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ShoppingCart className="h-3.5 w-3.5" />
        )}
        {buyState === "error" ? "Failed – Retry" : "Proceed to Buy"}
      </motion.button>
    </div>
  );
}