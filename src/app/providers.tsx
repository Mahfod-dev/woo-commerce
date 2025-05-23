'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CartProvider } from "@/components/CartProvider";
import { NotificationProvider } from "@/context/notificationContext";
import { AnimationProvider } from "@/components/AnimationProvider";
import { AuthProvider } from "@/context/authContext";
import { QueryProvider } from "@/providers/QueryProvider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
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
    </QueryProvider>
  );
}