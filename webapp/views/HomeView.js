export default {
    template: `
        <div>
            <header class="text-center mb-8">
                <h1 class="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-2">Análisis de Letras de Canciones</h1>
                <p class="text-xl sm:text-2xl text-gray-600">Web interactiva para explorar el dataset, las estadísticas y las generaciones obtenidas con un modelo ajustado de DeepESP/gpt2-spanish</p>
            </header>
            <div class="text-center">
                 <router-link to="/estadisticas" class="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300">
                    Comenzar a Explorar
                </router-link>
            </div>
        </div>
    `
};
