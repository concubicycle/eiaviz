import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';

import Root from './components/Eia/EiaRoot';
import About from './components/About';



const routeComponents = [
  { path: '/', component: Root, exact: true },
  { path: '/counter', component: Counter },
  { path: '/fetch-data/:startDateIndex?', component: FetchData },
  { path: '/about', component: About },
]

const routes = routeComponents.map(rc => <Route key={rc.path} {...rc} />)

export default () => (
  <Layout>
    {routes}
  </Layout>
);