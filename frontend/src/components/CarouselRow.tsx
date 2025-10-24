import { ReactNode, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  children: ReactNode;
}

export function CarouselRow({ title, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const node = containerRef.current;
    if (!node) {
      return;
    }
    const amount = direction === "right" ? node.clientWidth : -node.clientWidth;
    node.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center justify-between px-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="space-x-2">
          <button
            type="button"
            className="rounded-full border border-white/20 p-2 text-sm hover:border-accent hover:text-accent"
            onClick={() => scroll("left")}
          >
            ←
          </button>
          <button
            type="button"
            className="rounded-full border border-white/20 p-2 text-sm hover:border-accent hover:text-accent"
            onClick={() => scroll("right")}
          >
            →
          </button>
        </div>
      </div>
      <motion.div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        whileTap={{ cursor: "grabbing" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
