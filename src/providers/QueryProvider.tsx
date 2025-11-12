'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache pendant 5 minutes par défaut
            staleTime: 5 * 60 * 1000,
            // Garde en cache pendant 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry 3 fois en cas d'erreur
            retry: 3,
            // Retry avec délai exponentiel
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Pas de refetch automatique sur focus (pour éviter les appels excessifs)
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Retry une fois pour les mutations
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools seulement en développement */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}