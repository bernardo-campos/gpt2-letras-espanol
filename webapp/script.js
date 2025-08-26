const { createApp, ref, computed, onMounted, watch } = Vue;

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

// --- Reusable Components ---

// Component: TabNavigation
app.component('tab-navigation', {
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
        </div>
    `
});

// Component: ArtistStatsPanel
app.component('artist-stats-panel', {
    props: ['artistName', 'stats'],
    template: `
        <div class="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 class="text-2xl font-bold text-indigo-600 mb-4">Estadísticas de {{ artistName }}</h2>
            <ul v-if="stats" class="space-y-2 text-lg text-gray-700">
                <li><span class="font-semibold">Palabras Totales:</span> {{ stats.totalWords.toLocaleString() }}</li>
                <li><span class="font-semibold">Palabras Únicas:</span> {{ stats.uniqueWords.toLocaleString() }}</li>
                <li><span class="font-semibold">Canciones:</span> {{ stats.songs.toLocaleString() }}</li>
                <li><span class="font-semibold">Promedio de Palabras por Canción:</span> {{ stats.avgWordsPerSong.toFixed(2) }}</li>
            </ul>
        </div>
    `
});

// Component: WordsTable
app.component('words-table', {
    props: ['words', 'artistName', 'wordsToShow'],
    emits: ['update:wordsToShow'],
    setup(props, { emit }) {
        const wordsToShowCount = computed({
            get: () => props.wordsToShow,
            set: (value) => emit('update:wordsToShow', Number(value))
        });

        const filteredWords = computed(() => {
            if (!props.words) return [];
            return [...props.words]
                .sort((a, b) => b.count - a.count)
                .slice(0, wordsToShowCount.value);
        });

        const maxWordCount = computed(() => {
            if (!filteredWords.value.length) return 1;
            return filteredWords.value[0].count;
        });

        const maxWordsSlider = computed(() => props.words ? props.words.length : 100);

        return { wordsToShowCount, filteredWords, maxWordCount, maxWordsSlider };
    },
    template: `
        <div class="lg:col-span-2 bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 class="text-2xl font-bold text-indigo-600 mb-4">Palabras Más Frecuentes en el dataset de {{ artistName }}</h2>
            <div class="mb-6">
                <label :for="'words-slider-' + artistName" class="block text-lg font-semibold text-gray-700 mb-2">
                    Mostrar {{ wordsToShowCount }} palabras
                </label>
                <input type="range" :id="'words-slider-' + artistName" v-model="wordsToShowCount" min="5" :max="maxWordsSlider" step="5"
                       class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer">
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Palabra</th>
                            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Conteo</th>
                            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Indicador</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="(word, index) in filteredWords" :key="index" class="hover:bg-gray-50 transition-colors duration-150">
                            <td class="py-0 px-4 text-base text-gray-900">{{ word.word }}</td>
                            <td class="py-0 px-4 text-base text-gray-700">{{ word.count.toLocaleString() }}</td>
                            <td class="py-0 px-4">
                                <div class="word-bar" :style="{ width: (word.count / maxWordCount) * 100 + '%' }"></div>
                            </td>
                        </tr>
                        <tr v-if="filteredWords.length === 0">
                            <td colspan="3" class="py-4 px-4 text-center text-gray-500 text-lg">No hay palabras para mostrar.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
});

// Component: GenerationsViewer
app.component('generations-viewer', {
    props: ['generations', 'frequentWords', 'artistName'],
    setup(props) {
        const currentGenerationIndex = ref(0);
        const selectedFrequentWords = ref([]);

        const currentGeneration = computed(() => {
            if (!props.generations || props.generations.length === 0) {
                return { title: 'N/A', text: 'No hay generaciones disponibles.' };
            }
            return props.generations[currentGenerationIndex.value];
        });

        const mostFrequentWordsForHighlight = computed(() => {
             if (!props.frequentWords) return [];
            return [...props.frequentWords]
                .sort((a, b) => b.count - a.count)
                .slice(0, 20);
        });

        const highlightText = (text) => {
            if (!text) return '';
            let highlighted = text;
            selectedFrequentWords.value.forEach(word => {
                const regex = new RegExp(`\\b(${word})\\b`, 'gi');
                highlighted = highlighted.replace(regex, `<span class="highlight">$&</span>`);
            });
            return highlighted.replace(/<eos>/g, "&lt;eos&gt;");
        };

        const toggleWordSelection = (word) => {
            const index = selectedFrequentWords.value.indexOf(word);
            if (index > -1) selectedFrequentWords.value.splice(index, 1);
            else selectedFrequentWords.value.push(word);
        };

        const prevGeneration = () => { if (currentGenerationIndex.value > 0) currentGenerationIndex.value--; };
        const nextGeneration = () => { if (props.generations && currentGenerationIndex.value < props.generations.length - 1) currentGenerationIndex.value++; };

        watch(() => props.artistName, () => {
            currentGenerationIndex.value = 0;
            selectedFrequentWords.value = [];
        });

        return { currentGenerationIndex, selectedFrequentWords, currentGeneration, mostFrequentWordsForHighlight, highlightText, toggleWordSelection, prevGeneration, nextGeneration };
    },
    template: `
        <div class="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 class="text-2xl font-bold text-indigo-600 mb-4">Generaciones con IA para {{ artistName }}</h2>
            <div v-if="generations && generations.length > 0">
                <div class="mb-4 flex flex-wrap gap-2 items-center">
                    <span class="text-lg font-semibold text-gray-700 mr-2">Palabras para resaltar:</span>
                    <span v-for="wordObj in mostFrequentWordsForHighlight" :key="wordObj.word"
                          :class="{'selected-word-tag': selectedFrequentWords.includes(wordObj.word), 'unselected-word-tag': !selectedFrequentWords.includes(wordObj.word)}"
                          @click="toggleWordSelection(wordObj.word)">
                        {{ wordObj.word }}
                    </span>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm mb-6 max-h-96 overflow-y-auto" style="min-height: min-content;">
                    <p class="generation-text text-lg text-gray-800" v-html="highlightText(currentGeneration.text)"></p>
                </div>
                <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                    <button @click="prevGeneration" :disabled="currentGenerationIndex === 0" class="w-full sm:w-auto px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
                    <div class="flex-grow text-center">
                        <label :for="'gen-slider-' + artistName" class="block text-lg font-semibold text-gray-700 mb-2">
                            Generación {{ Number(currentGenerationIndex) + 1 }} de {{ generations.length }}
                        </label>
                        <input type="range" :id="'gen-slider-' + artistName" v-model="currentGenerationIndex" min="0" :max="generations.length - 1" step="1" class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer">
                    </div>
                    <button @click="nextGeneration" :disabled="currentGenerationIndex === generations.length - 1" class="w-full sm:w-auto px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente</button>
                </div>
            </div>
            <div v-else class="text-center text-gray-500 text-lg py-8">
                No hay generaciones de texto disponibles para este artista.
            </div>
        </div>
    `
});

// Component: GlobalStatsTable
app.component('global-stats-table', {
    props: ['stats'],
    template: `
        <div class="mb-8 overflow-x-auto">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Resumen de Estadísticas</h3>
            <table class="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Artista</th>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Palabras Totales</th>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Palabras Únicas</th>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Canciones</th>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Palabras/Canción (Promedio)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="(artistStats, artistName) in stats" :key="artistName" class="hover:bg-gray-50 transition-colors duration-150">
                        <td class="py-3 px-4 text-base text-gray-900 font-medium">{{ artistName }}</td>
                        <td class="py-3 px-4 text-base text-gray-700">{{ artistStats.totalWords.toLocaleString() }}</td>
                        <td class="py-3 px-4 text-base text-gray-700">{{ artistStats.uniqueWords.toLocaleString() }}</td>
                        <td class="py-3 px-4 text-base text-gray-700">{{ artistStats.songs.toLocaleString() }}</td>
                        <td class="py-3 px-4 text-base text-gray-700">{{ artistStats.avgWordsPerSong.toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
});

// Component: GlobalFrequentWordsTable
app.component('global-frequent-words-table', {
    props: ['wordsByArtist'],
    template: `
        <div class="overflow-x-auto">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Palabras Más Frecuentes por Artista (Top 5)</h3>
            <table class="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Artista</th>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Palabras Frecuentes (Palabra: Conteo)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="(words, artistName) in wordsByArtist" :key="artistName" class="hover:bg-gray-50 transition-colors duration-150">
                        <td class="py-3 px-4 text-base text-gray-900 font-medium">{{ artistName }}</td>
                        <td class="py-3 px-4 text-base text-gray-700">
                            <span v-if="words.length > 0">{{ words.map(w => \`\${w.word}: \${w.count}\`).join(', ') }}</span>
                            <span v-else class="text-gray-500">N/A</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
});


app.mount('#app');
