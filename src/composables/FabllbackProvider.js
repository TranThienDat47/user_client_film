import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { startLoading } from '~/utils/nprogress';

export const FallbackContext = React.createContext({
   updateFallback: () => {},
});

export const FabllbackProvider = ({ children }) => {
   const [fallback, setFallback] = React.useState(null);

   const location = useLocation();

   // React.useEffect(() => {
   //    startLoading();
   // }, [location.pathname]);

   const updateFallback = React.useCallback((fallback) => {
      setFallback(() => fallback);
   }, []);

   const renderChildren = React.useMemo(() => {
      return children;
   }, [children]);

   return (
      <FallbackContext.Provider value={{ updateFallback }}>
         <React.Suspense fallback={fallback}>{renderChildren}</React.Suspense>
      </FallbackContext.Provider>
   );
};
