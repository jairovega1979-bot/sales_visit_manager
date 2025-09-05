
'use client';

import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Show children immediately on server, then after hydration on client
  return (
    <div>
      {children}
    </div>
  );
}
