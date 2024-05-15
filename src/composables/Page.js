import * as React from 'react';
import { usePage } from '~/hook';

const Page = ({ children }) => {
   const { onLoad } = usePage();

   const render = React.useMemo(() => {
      return <>{children}</>;
   }, [children]);

   React.useEffect(() => {
      onLoad(render);
   }, [onLoad, render]);

   return render;
};

export default Page;
