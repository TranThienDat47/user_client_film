import { useContext, useCallback } from 'react';
import { FallbackContext } from '~/composables/FabllbackProvider';
import { GlobalContext } from '~/composables/GlobalProvider';

export default () => {
   const { updateFallback } = useContext(FallbackContext);
   const { setLoadFull, isLoadFull, prevPage, loadPrevPage, loadReadyPage } =
      useContext(GlobalContext);

   const onLoad = useCallback(
      (component) => {
         if (component === undefined) component = null;

         if (!!prevPage) {
            if (isLoadFull) {
               loadPrevPage(component);
               setLoadFull(false);
            } else {
               updateFallback(prevPage);
            }
         } else {
            loadPrevPage(component);
            updateFallback(component);
            loadReadyPage(true);
            setLoadFull(false);
         }
      },
      [updateFallback, isLoadFull, setLoadFull, loadPrevPage],
   );

   return { onLoad, prevPage: prevPage };
};
