import { Home, Users, Boxes, ShoppingCart, BarChart2 } from "lucide-react";

export const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/employees", label: "Empleados", icon: Users },
  { href: "/inventory/categories", label: "Inventario", icon: Boxes },
  { href: "/sales", label: "Ventas", icon: ShoppingCart },
  { href: "/sales/report", label: "Reporte de ventas", icon: BarChart2 },
] as const;
