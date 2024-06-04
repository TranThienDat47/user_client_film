import {
   useEffect,
   useCallback,
   useMemo,
   createContext,
   useState,
   useContext,
   Suspense,
} from 'react';
import { useLocation } from 'react-router-dom';
import { startLoading } from '~/utils/nprogress';
import { GlobalContext } from './GlobalProvider';

export const FallbackContext = createContext();

export const FabllbackProvider = ({ children }) => {
   const [fallback, setFallback] = useState(null);

   const { loadReadyPage } = useContext(GlobalContext);

   const location = useLocation();

   useEffect(() => {
      loadReadyPage(false);

      return () => {
         startLoading();
         loadReadyPage(false);
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
