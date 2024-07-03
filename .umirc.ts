import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/', component: '@/pages/index' },
        // { exact: true, path: '/users', component: '@/pages/users' },
      ],
    },
  ],
  extraBabelIncludes: ['@react-leaflet/core', 'react-leaflet'],
  extraBabelPlugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
  fastRefresh: {},
});
