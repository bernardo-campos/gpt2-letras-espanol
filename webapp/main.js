import App from './App.js';
import router from './router.js';

// Vue y VueRouter ya están disponibles globalmente gracias a los scripts en index.html
const { createApp } = Vue;

// Crear la instancia de la aplicación
const app = createApp(App);

// Usar el enrutador
app.use(router);

// Montar la aplicación
app.mount('#app');
