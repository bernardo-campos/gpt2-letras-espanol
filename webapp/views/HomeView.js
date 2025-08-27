export default {
    template: `
        <div class="flex flex-col min-h-[75vh] justify-between">
            <header class="text-center pt-8 max-w-4xl mx-auto">
                <h1 class="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-2">Análisis de Letras de Canciones</h1>
                <p class="text-xl sm:text-2xl text-gray-600">
                    Web interactiva para explorar el dataset, las estadísticas y las generaciones obtenidas con un modelo ajustado de
                    <a href="https://huggingface.co/DeepESP/gpt2-spanish" target="_blank" class="text-indigo-500 hover:underline">DeepESP/gpt2-spanish</a>
                </p>
            </header>

            <div class="text-center">
                 <router-link to="/estadisticas" class="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300">
                    Comenzar a Explorar
                </router-link>
            </div>

            <footer class="text-center text-gray-500 text-sm max-w-4xl mx-auto pb-8">
                <p>
                    Los recursos mostrados en esta web, forman parte del proyecto de final de carrera titulado "LA INTELIGENCIA ARTIFICIAL APLICADA A LA GENERACIÓN AUTOMÁTICA DE LETRAS DE CANCIONES" de la Universidad Católica de Santiago del Estero (UCSE).
                    El repositorio completo, junto a otros recursos se encuentran en:
                    <a href="https://github.com/bernardo-campos/gpt2-letras-espanol" target="_blank" class="text-indigo-500 hover:underline">https://github.com/bernardo-campos/gpt2-letras-espanol</a>
                </p>
            </footer>
        </div>
    `
};
