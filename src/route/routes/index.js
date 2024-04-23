import config from '~/config';

import Search from '~/views/Search';
import Home from '~/views/Home';
import Watch from '~/views/Watch';
import Product from '~/views/Product';
import { Fragment } from 'react';
import NoSidebarLayout from '~/layout/NoSidebarLayout';

const publicRoutes = [
   { path: config.routes.home, compnent: Home },
   { path: config.routes.product, compnent: Product },
   { path: config.routes.search, compnent: Search },
   { path: config.routes.watch, compnent: Watch, layout: NoSidebarLayout },
];

const privateRoutes = [{ path: null, compnent: Fragment, layout: null }];

export { publicRoutes, privateRoutes };
