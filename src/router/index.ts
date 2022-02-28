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
                path:      '/file-comble-edit',
                name:      'file-comble-edit',
                component: () => import('@/views/file/comble/FileEdit.vue'),
            },
            {
                path:      '/file-sol-edit',
                name:      'file-sol-edit',
                component: () => import('@/views/file/sol/FileEdit.vue'),
            },
            {
                path:      '/file-cet-edit',
                name:      'file-cet-edit',
                component: () => import('@/views/file/cet/FileEdit.vue'),
            },
            {
                path:      '/file-pg-edit',
                name:      'file-pg-edit',
                component: () => import('@/views/file/pg/FileEdit.vue'),
            },
            {
                path:      '/file-pac_ro-edit',
                name:      'file-pac_ro-edit',
                component: () => import('@/views/file/pac_ro/FileEdit.vue'),
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
