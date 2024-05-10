import { Fragment } from 'react';

import config from '~/config';

import Home from '~/views/Home';
import Watch from '~/views/Watch';
import Search from '~/views/Search';
import Follow from '~/views/Follow';
import Categories from '~/views/Categories';
import Product from '~/views/Product';

import NoSidebarLayout from '~/layout/NoSidebarLayout';

const publicRoutes = [
   { path: config.routes.home, component: Home },
   { path: config.routes.product, component: Product },
   { path: config.routes.follow, component: Follow },
   { path: config.routes.category.route, component: Categories },
   { path: config.routes.search, component: Search },
   { path: config.routes.watch, component: Watch, layout: NoSidebarLayout },
];

const privateRoutes = [{ path: null, component: Fragment, layout: null }];

export { publicRoutes, privateRoutes };
