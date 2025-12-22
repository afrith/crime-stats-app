import { useState, useEffect } from "react";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return isClient;
}

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly({
  children,
  fallback = null,
}: ClientOnlyProps) {
  const isClient = useIsClient();
  if (!isClient) return <>{fallback}</>;
  return <>{children}</>;
}
