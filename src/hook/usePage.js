import * as React from 'react';
import { FallbackContext } from '~/composables/FabllbackProvider';

export default () => {
   const { updateFallback } = React.useContext(FallbackContext);

   const onLoad = React.useCallback(
      (component) => {
         if (component === undefined) component = null;

         updateFallback(component);
      },
      [updateFallback],
   );

   return { onLoad };
};
