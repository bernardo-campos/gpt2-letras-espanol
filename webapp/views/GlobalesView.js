import GlobalStatsTable from '../components/GlobalStatsTable.js';
import GlobalFrequentWordsTable from '../components/GlobalFrequentWordsTable.js';

// Vue está disponible globalmente
const { computed, inject } = Vue;

export default {
    components: { GlobalStatsTable, GlobalFrequentWordsTable },
    setup() {
        const artistData = inject('artistData');

        const globalArtistStats = computed(() => artistData.value ? Object.fromEntries(Object.entries(artistData.value).map(([name, data]) => [name, data.stats])) : {});
        const globalFrequentWords = computed(() => artistData.value ? Object.fromEntries(Object.entries(artistData.value).map(([name, data]) => [name, [...data.words].sort((a, b) => b.count - a.count).slice(0, 5)])) : {});

        return { globalArtistStats, globalFrequentWords };
    },
    template: `
        <div class="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 class="text-2xl font-bold text-indigo-600 mb-6">Estadísticas Globales por Artista</h2>
            <global-stats-table :stats="globalArtistStats"></global-stats-table>
            <global-frequent-words-table :words-by-artist="globalFrequentWords"></global-frequent-words-table>
        </div>
    `
};
