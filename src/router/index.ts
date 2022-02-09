import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import store from '@/store';
import { Actions, Mutations } from '@/store/enums/StoreEnums';

const routes: Array<RouteRecordRaw> = [
    {
        path:      '/',
        redirect:  '/dashboard',
        component: () => import('@/layout/Layout.vue'),
        children:  [
            {
                path:      '/dashboard',
                name:      'dashboard',
                component: () => import('@/views/Dashboard.vue'),
            },
            {
                path:      '/file-list',
                name:      'file-list',
                component: () => import('@/views/file/FileList.vue'),
            },
            {
                path:      '/file-edit',
                name:      'file-edit',
                component: () => import('@/views/file/FileEdit.vue'),
            },
            {
                path:      '/parameters',
                name:      'parameters',
                component: () => import('@/views/Parameters.vue'),
            },
        ],
    },
    {
        // the 404 route, when none of the above matches
        path:      '/404',
        name:      '404',
        component: () => import('@/views/error/Error404.vue'),
    },
    {
        path:     '/:pathMatch(.*)*',
        redirect: '/404',
    },
];

const router = createRouter( {
                                 // history: createWebHashHistory(),
                                 history: process.env.IS_ELECTRON
                                              ? createWebHashHistory()
                                              : createWebHistory(),
                                 routes,
                             } );

router.beforeEach( () => {
    // reset config to initial state
    store.commit( Mutations.RESET_LAYOUT_CONFIG );

    store.dispatch( Actions.VERIFY_AUTH );

    // Scroll page to top on every route change
    setTimeout( () => {
        window.scrollTo( 0, 0 );
    }, 100 );
} );

export default router;
