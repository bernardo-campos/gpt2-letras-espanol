import EstadisticasView from './views/EstadisticasView.js';
import GlobalesView from './views/GlobalesView.js';
import DatasetView from './views/DatasetView.js';

// VueRouter está disponible globalmente
const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
    {
        path: '/',
        redirect: '/estadisticas'
    },
    {
        path: '/estadisticas/:slug?/:index?',
        name: 'estadisticas',
        component: EstadisticasView,
        props: true
    },
    {
        path: '/estadisticas-globales',
        name: 'estadisticas-globales',
        component: GlobalesView
    },
    {
        path: '/dataset/:slug?/:index?',
        name: 'dataset',
        component: DatasetView,
        props: true
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
