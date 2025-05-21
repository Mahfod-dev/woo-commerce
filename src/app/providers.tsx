'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CartProvider } from "@/components/CartProvider";
import { NotificationProvider } from "@/context/notificationContext";
import { AnimationProvider } from "@/components/AnimationProvider";
import { AuthProvider } from "@/context/authContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <AnimationProvider>
              {children}
            </AnimationProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </SessionProvider>
  );
}