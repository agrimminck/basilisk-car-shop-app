"use client";

import { motion } from "framer-motion";
import { PosCategory } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  categories: PosCategory[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-2">
        {categories.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(cat.id)}
              className="relative flex-shrink-0"
            >
              <span
                className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.name}
              </span>
              {active && (
                <motion.div
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
