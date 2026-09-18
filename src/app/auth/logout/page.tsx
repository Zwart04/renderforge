"use client";

import { useApp } from "@/lib/app-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const { setUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("hf_user");
    localStorage.removeItem("hf_users");
    setUser(null);
    router.push("/");
  }, []);

  return null;
}
