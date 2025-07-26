import { useEffect, useState } from 'react';

export const useScript = (url: string, suppressCache: boolean = false) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = suppressCache ? `${url}?t=${+new Date()}` : url;
    script.onload = () => {
      setIsInitialized(true);
    };
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, suppressCache]);

  return isInitialized;
};
