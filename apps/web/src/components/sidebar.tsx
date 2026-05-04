"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Receipt,
  Settings,
  Wrench,
} from "lucide-react";

const navItems = [
  { href: "/pos", label: "Venta", icon: ShoppingCart },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventario", icon: Package },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/sales", label: "Ventas", icon: Receipt },
  { href: "/services", label: "Servicios", icon: Wrench },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-20 flex-col border-r border-white/10 bg-surface/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-center border-b border-white/10">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white font-bold text-xl shadow-lg shadow-primary/30">
          B
        </div>
      </div>
      <nav className="flex flex-1 flex-col items-center gap-2 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200",
                active
                  ? "bg-primary/20 text-primary shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              <span className="absolute left-14 hidden rounded-lg bg-surface px-3 py-1.5 text-xs font-medium text-foreground shadow-xl group-hover:block border border-white/10 whitespace-nowrap backdrop-blur-xl">
                {item.label}
              </span>
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
