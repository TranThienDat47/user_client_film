import { Fragment, lazy } from 'react';

import config from '~/config';
import Watch from '~/views/Watch';
import NoSidebarLayout from '~/layout/NoSidebarLayout';

const Home = lazy(() => import('~/views/Home'));
const Search = lazy(() => import('~/views/Search'));
const Follow = lazy(() => import('~/views/Follow'));
const Product = lazy(() => import('~/views/Product'));
const SeenMovie = lazy(() => import('~/views/SeenMovie'));
const Categories = lazy(() => import('~/views/Categories'));
const SeeLaterMovie = lazy(() => import('~/views/SeeLaterMovie'));

const publicRoutes = [
   { path: config.routes.home, component: Home },
   { path: config.routes.search, component: Search },
   { path: config.routes.follow, component: Follow },
   { path: config.routes.product, component: Product },
   { path: config.routes.seenMovie, component: SeenMovie },
   { path: config.routes.category.route, component: Categories },
   { path: config.routes.seeLaterMovie, component: SeeLaterMovie },
   { path: config.routes.watch, component: Watch, layout: NoSidebarLayout },
];

const privateRoutes = [{ path: null, component: Fragment, layout: null }];

export { publicRoutes, privateRoutes };
