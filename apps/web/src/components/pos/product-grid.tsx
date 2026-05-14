"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-card";
import { CategoryFilter } from "./category-filter";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ScanBarcode } from "lucide-react";
import { mockProducts, mockCategories } from "./mock-data";
import { usePosStore } from "@/hooks/use-pos-store";

export function ProductGrid() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const addToCart = usePosStore((s) => s.addToCart);

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.categoryId === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar producto o escanear código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pl-10 pr-10 text-base"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Escanear código de barras"
        >
          <ScanBarcode className="h-5 w-5" />
        </button>
      </div>

      <CategoryFilter
        categories={mockCategories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="grid grid-cols-2 gap-3 pb-4 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} onAdd={addToCart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="mb-2 h-8 w-8" />
            <p className="text-sm">No se encontraron productos</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
