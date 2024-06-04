import { useMemo, useEffect } from 'react';
import { usePage } from '~/hook';

export const Page = ({ children }) => {
   const { onLoad, prevPage } = usePage();

   const render = useMemo(() => {
      return <>{children}</>;
   }, [children]);

   useEffect(() => {
      onLoad(render);
   }, [onLoad, render]);

   return prevPage;
};
