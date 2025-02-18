export default [
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/home/index.vue'),
    children: [
      {
        path: '/not-authority',
        component: () => import('@/views/system/not-authority/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/system/login/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/system/404/index.vue'),
  },
];