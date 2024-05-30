import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Fragment, Suspense } from 'react';

import { publicRoutes, privateRoutes } from '~/route/routes';
import PassportGoogle from '~/route/routing/PassportGoogle';
import ProtectedRoute from '~/route/routing/ProtectedRoute';
import DefaultLayout from '~/layout/DefaultLayout';
import Account from '~/route/routing/Account';
import Logout from '~/route/routing/Logout';
import Verify from '~/route/routing/Verify';
import Auth from '~/views/Auth/index.js';
import { useState, useEffect } from 'react';
import Categories from '~/views/Categories';
import CategoriesService from './services/CategoriesService';
import { handleChangeModeTheme } from './utils/handleChangeModeTheme';
import { FabllbackProvider, FallbackContext } from './composables/FabllbackProvider';

function App() {
   const [dynamicRoutePublicState, setDynamicRoutePublicState] = useState([]);
   const [ableRouteState, setAbleRouteState] = useState(false);

   let Layout = DefaultLayout;

   useEffect(() => {
      const tempTheme = localStorage.getItem('theme');
      if (tempTheme) handleChangeModeTheme(tempTheme);

      CategoriesService.getAll().then((res) => {
         setDynamicRoutePublicState(
            res.categories.map((element, index) => {
               return { path: `/category/${element._id}`, component: Categories };
            }),
         );

         setAbleRouteState(true);
      });
   }, []);

   return (
      <>
         <Router>
            <Routes>
               <Route exact path="/verify" element={<Verify />} />
               <Route exact path="/passport/google" element={<PassportGoogle />} />
               <Route exact path="/logout" element={<Logout />} />

               {dynamicRoutePublicState.map((route, index) => {
                  const Page = route.component;
                  if (route.layout) Layout = route.layout;
                  else if (route.layout === null) Layout = Fragment;

                  return (
                     <Route
                        key={'dynamic' + index}
                        path={route.path}
                        element={
                           <FabllbackProvider>
                              <Page />
                           </FabllbackProvider>
                        }
                     />
                  );
               })}

               <Route element={<Account />}>
                  <Route exact path="/register" element={<Auth authRoute="register" />} />
                  <Route path="/login" element={<Auth authRoute="login" />} />
               </Route>

               {publicRoutes.map((route, index) => {
                  const Page = route.component;
                  if (route.layout) Layout = route.layout;
                  else if (route.layout === null) Layout = Fragment;

                  return (
                     <Route
                        key={index}
                        path={route.path}
                        element={
                           <FabllbackProvider>
                              <Page />
                           </FabllbackProvider>
                        }
                     />
                  );
               })}

               <Route element={<ProtectedRoute />}>
                  {privateRoutes.map((route, index) => {
                     const Page = route.component;
                     if (route.layout) Layout = route.layout;
                     else if (route.layout === null) Layout = Fragment;
                     return (
                        <Route
                           key={index}
                           path={route.path}
                           element={
                              <FabllbackProvider>
                                 <Page />
                              </FabllbackProvider>
                           }
                        />
                     );
                  })}
               </Route>

               <Route path={ableRouteState ? '*' : ''} element={<Navigate to="/" />} />
            </Routes>
         </Router>
      </>
   );
}

export default App;
