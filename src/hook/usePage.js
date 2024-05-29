import { useContext, useCallback } from 'react';
import { FallbackContext } from '~/composables/FabllbackProvider';
import { GlobalContext } from '~/composables/GlobalProvider';

export default () => {
   const { updateFallback } = useContext(FallbackContext);
   const { setLoadFull, isLoadFull, prevPage, loadPrevPage } = useContext(GlobalContext);

   const onLoad = useCallback(
      (component) => {
         if (component === undefined) component = null;

         if (isLoadFull) {
            loadPrevPage(component);
            setLoadFull(false);
         } else {
            updateFallback(prevPage);
         }
      },
      [updateFallback, isLoadFull, setLoadFull, loadPrevPage],
   );

   return { onLoad, prevPage };
};
