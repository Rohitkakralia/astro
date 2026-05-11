"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbars/Navbar";
import LoginNav from "@/components/Navbars/LoginNav";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const authRoutes = ["/login", "/register"];

  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <>
      {isAuthRoute ? <LoginNav /> : <Navbar />}
      {children}
    </>
  );
}