import { createApp, ref, computed, onMounted, watch } from 'vue';

// Importar todos los componentes desde sus archivos
import TabNavigation from './components/TabNavigation.js';
import ArtistStatsPanel from './components/ArtistStatsPanel.js';
import WordsTable from './components/WordsTable.js';
import GenerationsViewer from './components/GenerationsViewer.js';
import GlobalStatsTable from './components/GlobalStatsTable.js';
import GlobalFrequentWordsTable from './components/GlobalFrequentWordsTable.js';

const app = createApp({
    setup() {
        // State Management (Datos reactivos)
        const artistData = ref(null);
        const selectedArtist = ref('');
        const wordsToShowCount = ref(10);
        const activeTab = ref('artist'); // 'artist' o 'global'
        const loading = ref(true);
        const error = ref(null);

        // --- Data Loading ---
        const loadArtistData = async () => {
            try {
                const response = await fetch('artist_analysis_data.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                artistData.value = await response.json();
                if (Object.keys(artistData.value).length > 0) {
                    selectedArtist.value = Object.keys(artistData.value)[0];
                }
            } catch (e) {
                error.value = e.message;
                console.error("Error loading artist data:", e);
            } finally {
                loading.value = false;
            }
        };

        // --- Computed Properties ---
        const artists = computed(() => artistData.value ? Object.keys(artistData.value) : []);
        const selectedArtistData = computed(() => artistData.value && selectedArtist.value ? artistData.value[selectedArtist.value] : null);

        const globalArtistStats = computed(() => {
            if (!artistData.value) return {};
            const stats = {};
            for (const artistName in artistData.value) {
                stats[artistName] = artistData.value[artistName].stats;
            }
            return stats;
        });

        const globalFrequentWords = computed(() => {
            if (!artistData.value) return {};
            const freqWords = {};
            for (const artistName in artistData.value) {
                freqWords[artistName] = [...artistData.value[artistName].words]
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);
            }
            return freqWords;
        });

        // --- Methods ---
        const resetGenerationsAndWords = () => {
            if (selectedArtistData.value && wordsToShowCount.value > selectedArtistData.value.words.length) {
                wordsToShowCount.value = selectedArtistData.value.words.length;
            }
        };

        // --- Lifecycle Hooks ---
        onMounted(loadArtistData);
        watch(selectedArtist, resetGenerationsAndWords);

        // --- Expose to Template ---
        return {
            selectedArtist,
            wordsToShowCount,
            activeTab,
            loading,
            error,
            artists,
            selectedArtistData,
            globalArtistStats,
            globalFrequentWords,
            resetGenerationsAndWords
        };
    }
});

// Registrar todos los componentes importados
app.component('tab-navigation', TabNavigation);
app.component('artist-stats-panel', ArtistStatsPanel);
app.component('words-table', WordsTable);
app.component('generations-viewer', GenerationsViewer);
app.component('global-stats-table', GlobalStatsTable);
app.component('global-frequent-words-table', GlobalFrequentWordsTable);

// Montar la aplicación
app.mount('#app');
