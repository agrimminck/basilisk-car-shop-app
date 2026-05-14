"use client";

import { motion } from "framer-motion";
import { PosProduct } from "./types";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Droplets, Filter, CircleDot, Battery, Circle, Wrench, FlaskConical, Settings } from "lucide-react";

const categoryIcon: Record<string, React.ElementType> = {
  aceites: Droplets,
  filtros: Filter,
  frenos: CircleDot,
  baterias: Battery,
  neumaticos: Circle,
  servicios: Wrench,
};

const categoryGradient: Record<string, string> = {
  aceites: "from-amber-800/50 to-yellow-900/30",
  filtros: "from-slate-700 to-slate-800",
  frenos: "from-red-800/40 to-orange-900/30",
  baterias: "from-green-800/40 to-emerald-900/30",
  neumaticos: "from-gray-700 to-gray-800",
  servicios: "from-cyan-800/40 to-blue-900/30",
};

interface ProductCardProps {
  product: PosProduct;
  onAdd: (product: PosProduct) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const stockLabel = product.stock > 20 ? "alto" : product.stock > 5 ? "medio" : "bajo";
  const stockVariant: BadgeProps["variant"] =
    stockLabel === "alto" ? "success" : stockLabel === "medio" ? "warning" : "destructive";

  const Icon = categoryIcon[product.categoryId] ?? FlaskConical;
  const gradient = categoryGradient[product.categoryId] ?? "from-muted to-background";

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onAdd(product)}
      className="group flex flex-col rounded-xl border border-white/10 bg-surface/70 text-left shadow-lg backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-surface/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
            <Icon className="h-20 w-20 text-white/40 transition-all duration-300 group-hover:text-white/60 group-hover:scale-110" strokeWidth={1.2} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute right-2 top-2">
          <Badge variant={stockVariant} className="backdrop-blur-md">
            {product.stock > 20 ? "Stock" : product.stock > 5 ? `${product.stock}` : `Bajo: ${product.stock}`}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-3">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {product.name}
        </p>
        <p className="mt-2 text-base font-bold text-primary text-glow">
          ${product.price.toLocaleString("es-CL")}
        </p>
      </div>
    </motion.button>
  );
}
