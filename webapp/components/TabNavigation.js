export default {
    props: ['activeTab', 'artistSlug'],
    template: `
        <div class="w-full sm:w-auto flex-shrink-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-200 rounded-lg p-1">
            <router-link :to="{ name: 'home' }"
               :class="{'bg-indigo-600 text-white shadow-md': activeTab === 'home', 'bg-white text-gray-700': activeTab !== 'home'}"
               class="flex items-center justify-center flex-1 text-center px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 no-underline">
                Inicio
            </router-link>
            <router-link :to="{ name: 'estadisticas', params: { slug: artistSlug } }"
               :class="{'bg-indigo-600 text-white shadow-md': activeTab === 'estadisticas', 'bg-white text-gray-700': activeTab !== 'estadisticas'}"
               class="flex items-center justify-center flex-1 text-center px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 no-underline">
                Generaciones y estadísticas por artista
            </router-link>
            <router-link :to="{ name: 'estadisticas-globales' }"
               :class="{'bg-indigo-600 text-white shadow-md': activeTab === 'estadisticas-globales', 'bg-white text-gray-700': activeTab !== 'estadisticas-globales'}"
               class="flex items-center justify-center flex-1 text-center px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 no-underline">
                Estadísticas globales
            </router-link>
            <router-link :to="{ name: 'dataset', params: { slug: artistSlug } }"
               :class="{'bg-indigo-600 text-white shadow-md': activeTab === 'dataset', 'bg-white text-gray-700': activeTab !== 'dataset'}"
               class="flex items-center justify-center flex-1 text-center px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 no-underline">
                Explorar dataset
            </router-link>
        </div>
    `
};
