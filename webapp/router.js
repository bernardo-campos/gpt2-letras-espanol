import HomeView from './views/HomeView.js';
import EstadisticasView from './views/EstadisticasView.js';
import GlobalesView from './views/GlobalesView.js';
import DatasetView from './views/DatasetView.js';
import GenerarLetraView from './views/GenerarLetraView.js';

// VueRouter está disponible globalmente
const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
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
    },
    {
        path: '/generar-letra',
        name: 'generar-letra',
        component: GenerarLetraView
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
