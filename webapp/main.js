import { createApp, ref, computed, onMounted, watch } from 'vue';

// Importar todos los componentes desde sus archivos
import TabNavigation from './components/TabNavigation.js';
import ArtistStatsPanel from './components/ArtistStatsPanel.js';
import WordsTable from './components/WordsTable.js';
import GenerationsViewer from './components/GenerationsViewer.js';
import GlobalStatsTable from './components/GlobalStatsTable.js';
import GlobalFrequentWordsTable from './components/GlobalFrequentWordsTable.js';
import DatasetExplorer from './components/DatasetExplorer.js';

const app = createApp({
    setup() {
        // State Management (Datos reactivos)
        const artistData = ref(null);
        const selectedArtist = ref('');
        const wordsToShowCount = ref(10);
        const activeTab = ref('artist'); // 'artist', 'global' o 'dataset'
        const loading = ref(true);
        const error = ref(null);

        // State for the new Dataset Explorer tab
        const artistSongs = ref([]);
        const datasetLoading = ref(false);
        const datasetError = ref(null);


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

        const loadArtistDataset = async (url) => {
            if (!url) {
                artistSongs.value = [];
                datasetError.value = "No se proporcionó una URL para el dataset de este artista.";
                return;
            }
            datasetLoading.value = true;
            datasetError.value = null;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                artistSongs.value = data.songs || [];
            } catch (e) {
                datasetError.value = e.message;
                artistSongs.value = [];
                console.error("Error loading artist dataset:", e);
            } finally {
                datasetLoading.value = false;
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

        // --- Watchers ---
        watch([selectedArtist, activeTab], ([newArtist, newTab]) => {
            if (newTab === 'dataset' && selectedArtistData.value) {
                loadArtistDataset(selectedArtistData.value.url_dataset);
            }
        });

         onMounted(loadArtistData);


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
            artistSongs,
            datasetLoading,
            datasetError
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
app.component('dataset-explorer', DatasetExplorer);


// Montar la aplicación
app.mount('#app');
