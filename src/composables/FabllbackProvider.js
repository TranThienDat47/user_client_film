import { useState, useCallback, useEffect, useMemo, Suspense, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import { startLoading } from '~/utils/nprogress';

export const FallbackContext = createContext();

export const FabllbackProvider = ({ children }) => {
   const [fallback, setFallback] = useState(null);

   const location = useLocation();

   useEffect(() => {
      return () => {
         startLoading();
      };
   }, [location.pathname]);

   const updateFallback = useCallback((fallback) => {
      setFallback(() => fallback);
   }, []);

   const renderChildren = useMemo(() => {
      return children;
   }, [children]);

   return (
      <FallbackContext.Provider value={{ updateFallback }}>
         <Suspense fallback={fallback}>{renderChildren}</Suspense>
      </FallbackContext.Provider>
   );
};
