import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Fragment } from 'react';

import ProductContextProvider from './contexts/product/ProductContext';
import GlobalContextProvider from './contexts/global/GlobalContext';
import AuthContextProvider from '~/contexts/auth/AuthContext';
import { publicRoutes, privateRoutes } from '~/route/routes';
import PassportGoogle from '~/route/routing/PassportGoogle';
import ProtectedRoute from '~/route/routing/ProtectedRoute';
import DefaultLayout from '~/layout/DefaultLayout';
import Account from '~/route/routing/Account';
import Logout from '~/route/routing/Logout';
import Verify from '~/route/routing/Verify';
import Auth from '~/views/Auth/index.js';

function App() {
   return (
      <GlobalContextProvider>
         <ProductContextProvider>
            <AuthContextProvider>
               <Router>
                  <Routes>
                     <Route exact path="/verify" element={<Verify />} />
                     <Route exact path="/passport/google" element={<PassportGoogle />} />
                     <Route exact path="/logout" element={<Logout />} />

                     {publicRoutes.map((route, index) => {
                        const Page = route.compnent;
                        let Layout = DefaultLayout;
                        if (route.layout) Layout = route.layout;
                        else if (route.layout === null) Layout = Fragment;
                        return (
                           <Route
                              key={index}
                              path={route.path}
                              element={
                                 <Layout>
                                    <Page />
                                 </Layout>
                              }
                           />
                        );
                     })}

                     <Route element={<Account />}>
                        <Route exact path="/register" element={<Auth authRoute="register" />} />
                        <Route path="/login" element={<Auth authRoute="login" />} />
                     </Route>

                     <Route element={<ProtectedRoute />}>
                        {privateRoutes.map((route, index) => {
                           const Page = route.compnent;
                           let Layout = DefaultLayout;
                           if (route.layout) Layout = route.layout;
                           else if (route.layout === null) Layout = Fragment;
                           return (
                              <Route
                                 key={index}
                                 path={route.path}
                                 element={
                                    <Layout>
                                       <Page />
                                    </Layout>
                                 }
                              />
                           );
                        })}
                     </Route>

                     <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
               </Router>
            </AuthContextProvider>
         </ProductContextProvider>
      </GlobalContextProvider>
   );
}

export default App;
