import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Fragment, useState } from 'react';

import { publicRoutes, privateRoutes } from '~/route/routes';
import PassportGoogle from '~/route/routing/PassportGoogle';
import ProtectedRoute from '~/route/routing/ProtectedRoute';
import DefaultLayout from '~/layout/DefaultLayout';
import Account from '~/route/routing/Account';
import Logout from '~/route/routing/Logout';
import Verify from '~/route/routing/Verify';
import Auth from '~/views/Auth/index.js';
import { useEffect } from 'react';
import { handleChangeModeTheme } from '~/utils/handleChangeModeTheme';
import { FabllbackProvider } from '~/composables/FabllbackProvider';
import GlobalLayout from '~/layout';

function App() {
   useEffect(() => {
      const tempTheme = localStorage.getItem('theme');
      if (tempTheme) handleChangeModeTheme(tempTheme);
   }, []);

   return (
      <Router>
         <GlobalLayout>
            <FabllbackProvider>
               <Routes>
                  <Route exact path="/verify" element={<Verify />} />
                  <Route exact path="/passport/google" element={<PassportGoogle />} />
                  <Route exact path="/logout" element={<Logout />} />

                  <Route element={<Account />}>
                     <Route exact path="/register" element={<Auth authRoute="register" />} />
                     <Route path="/login" element={<Auth authRoute="login" />} />
                  </Route>

                  {publicRoutes.map((route, index) => {
                     const Page = route.component;

                     return <Route key={index} path={route.path} element={<Page />} />;
                  })}

                  <Route element={<ProtectedRoute />}>
                     {privateRoutes.map((route, index) => {
                        const Page = route.component;

                        return <Route key={index} path={route.path} element={<Page />} />;
                     })}
                  </Route>

                  <Route path={'*'} element={<Navigate to="/" />} />
               </Routes>
            </FabllbackProvider>
         </GlobalLayout>
      </Router>
   );
}

export default App;
