import { Fragment, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ListLayout from '~/config/layouts';
import DefaultLayout from './DefaultLayout';
import { publicRoutes, privateRoutes } from '~/route/routes';

function GlobalLayout({ children, tempLayout = null }) {
   const location = useLocation();
   const [layout, setLayout] = useState('DefaultLayout');

   const render = useMemo(() => {
      return <>{children}</>;
   }, [children]);

   useEffect(() => {
      if (location.pathname.includes('/login') || location.pathname.includes('/register')) {
         setLayout('NoLayout');
      } else {
         const matchedRoute = publicRoutes
            .concat(privateRoutes)
            .find((element) => location.pathname === element.path);
         setLayout(matchedRoute?.layout || 'DefaultLayout');
      }
   }, [publicRoutes, privateRoutes, location.pathname]);

   const LayoutTemp = useMemo(() => {
      return ListLayout.find((element) => element.key === layout).layout || DefaultLayout;
   }, [layout]);

   return <LayoutTemp>{render}</LayoutTemp>;
}

export default GlobalLayout;
