export default {
    props: ['activeTab'],
    emits: ['update:activeTab'],
    template: `
        <div class="w-full sm:w-auto flex-shrink-0 flex space-x-2 bg-gray-200 rounded-lg p-1">
            <button @click="$emit('update:activeTab', 'artist')"
                    :class="{'bg-indigo-600 text-white shadow-md': activeTab === 'artist', 'bg-white text-gray-700': activeTab !== 'artist'}"
                    class="flex-1 px-4 py-2 rounded-md text-base font-medium transition-colors duration-200">
                Estadísticas del Artista
            </button>
            <button @click="$emit('update:activeTab', 'global')"
                    :class="{'bg-indigo-600 text-white shadow-md': activeTab === 'global', 'bg-white text-gray-700': activeTab !== 'global'}"
                    class="flex-1 px-4 py-2 rounded-md text-base font-medium transition-colors duration-200">
                Estadísticas Globales
            </button>
            <button @click="$emit('update:activeTab', 'dataset')"
                    :class="{'bg-indigo-600 text-white shadow-md': activeTab === 'dataset', 'bg-white text-gray-700': activeTab !== 'dataset'}"
                    class="flex-1 px-4 py-2 rounded-md text-base font-medium transition-colors duration-200">
                Explorar Dataset
            </button>
        </div>
    `
};
