import GlobalFrequentWordsTable from '../components/GlobalFrequentWordsTable.js';

// Vue está disponible globalmente
const { computed, inject } = Vue;

export default {
    components: { GlobalFrequentWordsTable },
    setup() {
        const artistData = inject('artistData');

        const globalArtistStats = computed(() => {
            if (!artistData.value) return {};
            // Ordenar las entradas del objeto por la clave (nombre del artista)
            const sortedEntries = Object.entries(artistData.value).sort((a, b) => a[0].localeCompare(b[0]));
            // Crear un nuevo objeto a partir de las entradas ordenadas
            return Object.fromEntries(sortedEntries.map(([name, data]) => [name, data.stats]));
        });

        const globalFrequentWords = computed(() => {
             if (!artistData.value) return {};
             const sortedEntries = Object.entries(artistData.value).sort((a, b) => a[0].localeCompare(b[0]));
             return Object.fromEntries(sortedEntries.map(([name, data]) => [name, [...data.words].sort((a, b) => b.count - a.count).slice(0, 5)]));
        });

        return { globalArtistStats, globalFrequentWords };
    },
    template: `
        <div class="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 class="text-2xl font-bold text-indigo-600 mb-6">Estadísticas por Artista</h2>
            <global-frequent-words-table :words-by-artist="globalFrequentWords" :stats="globalArtistStats"></global-frequent-words-table>
        </div>
    `
};
