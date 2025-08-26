// Vue está disponible globalmente
const { ref, computed, watch, onMounted } = Vue;

export default {
    props: {
        songs: { type: Array, default: () => [] },
        loading: Boolean,
        error: String,
        initialSongIndex: { type: Number, default: null }
    },
    setup(props) {
        const searchTerm = ref('');
        const currentSongIndex = ref(null);

        const setSongByIndex = (index) => {
            const targetIndex = index - 1;
            if (targetIndex >= 0 && targetIndex < props.songs.length) {
                currentSongIndex.value = targetIndex;
            }
        };

        const filteredSongs = computed(() => {
            if (!searchTerm.value) {
                return props.songs.map((song, index) => ({ ...song, originalIndex: index }));
            }
            const lowerCaseSearch = searchTerm.value.toLowerCase();
            return props.songs
                .map((song, index) => ({ ...song, originalIndex: index }))
                .filter(song => song.lyric.toLowerCase().includes(lowerCaseSearch));
        });

        const currentSong = computed(() => {
            return currentSongIndex.value !== null && props.songs[currentSongIndex.value]
                ? props.songs[currentSongIndex.value]
                : null;
        });

        const formattedLyric = computed(() => {
            if (!currentSong.value) return '';
            let lyric = currentSong.value.lyric.replace(/\n/g, '<br>');
            if (searchTerm.value) {
                 const regex = new RegExp(`(${searchTerm.value})`, 'gi');
                 lyric = lyric.replace(regex, '<span class="highlight">$1</span>');
            }
            return lyric;
        });

        const selectSong = (originalIndex) => {
            currentSongIndex.value = originalIndex;
        };

        const prevSong = () => {
            if (currentSongIndex.value > 0) currentSongIndex.value--;
        };

        const nextSong = () => {
            if (currentSongIndex.value < props.songs.length - 1) currentSongIndex.value++;
        };

        const getSnippet = (lyric) => {
            if (!searchTerm.value) return '';
            const lowerCaseLyric = lyric.toLowerCase();
            const lowerCaseSearch = searchTerm.value.toLowerCase();
            const index = lowerCaseLyric.indexOf(lowerCaseSearch);
            if (index === -1) return '';
            const start = Math.max(0, index - 30);
            const end = Math.min(lyric.length, index + searchTerm.value.length + 30);
            let snippet = lyric.substring(start, end);
            const regex = new RegExp(`(${searchTerm.value})`, 'gi');
            snippet = snippet.replace(regex, '<span class="highlight">$1</span>');
            return `...${snippet}...`;
        };

        watch(() => props.songs, (newSongs) => {
             searchTerm.value = '';
             if (props.initialSongIndex) {
                 setSongByIndex(props.initialSongIndex);
             } else {
                 currentSongIndex.value = newSongs.length > 0 ? 0 : null;
             }
        });

        watch(() => props.initialSongIndex, (newIndex) => {
            if (newIndex) setSongByIndex(newIndex);
        });

        onMounted(() => {
            if (props.initialSongIndex) {
                 setSongByIndex(props.initialSongIndex);
            } else if (props.songs.length > 0) {
                 currentSongIndex.value = 0;
            }
        });

        return { searchTerm, filteredSongs, currentSongIndex, currentSong, formattedLyric, selectSong, prevSong, nextSong, getSnippet };
    },
    template: `
        <div class="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
            <h2 class="text-2xl font-bold text-indigo-600 mb-4">Explorador del Dataset</h2>

            <div v-if="loading" class="text-center text-indigo-600 text-lg font-semibold">Cargando canciones...</div>
            <div v-if="error" class="text-center text-red-600 text-lg font-semibold">Error: {{ error }}</div>

            <div v-if="!loading && !error && songs.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Columna de Búsqueda y Lista de Canciones -->
                <div class="md:col-span-1">
                    <input type="text" v-model="searchTerm" placeholder="Buscar en las letras..."
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm mb-4 focus:ring-indigo-500 focus:border-indigo-500">

                    <div class="max-h-[60vh] overflow-y-auto border rounded-lg bg-white">
                        <ul v-if="filteredSongs.length > 0">
                            <li v-for="song in filteredSongs" :key="song.originalIndex"
                                @click="selectSong(song.originalIndex)"
                                :class="{'bg-indigo-100': currentSongIndex === song.originalIndex}"
                                class="p-3 cursor-pointer hover:bg-gray-100 border-b last:border-b-0">
                                <p class="font-semibold text-gray-800 truncate">{{ song.name }}</p>
                                <p v-if="searchTerm" class="text-sm text-gray-600 mt-1" v-html="getSnippet(song.lyric)"></p>
                            </li>
                        </ul>
                        <div v-else class="p-4 text-center text-gray-500">
                            No se encontraron canciones.
                        </div>
                    </div>
                </div>

                <!-- Columna del Visor de Letras -->
                <div class="md:col-span-2">
                    <div v-if="currentSong" class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-6">
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ currentSong.name }}</h3>
                        <div class="max-h-[55vh] overflow-y-auto pr-4 mb-4">
                            <p class="text-gray-700 text-lg leading-relaxed" v-html="formattedLyric"></p>
                        </div>
                        <div class="flex justify-between items-center border-t pt-4">
                            <button @click="prevSong" :disabled="currentSongIndex === 0"
                                    class="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                Anterior
                            </button>
                            <span class="text-gray-600 font-medium">
                                Canción {{ currentSongIndex + 1 }} de {{ songs.length }}
                            </span>
                            <button @click="nextSong" :disabled="currentSongIndex === songs.length - 1"
                                    class="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                Siguiente
                            </button>
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-500 pt-10">
                        Selecciona una canción para ver la letra.
                    </div>
                </div>
            </div>
             <div v-if="!loading && !error && songs.length === 0" class="text-center text-gray-500 text-lg py-8">
                No hay canciones en el dataset de este artista.
            </div>
        </div>
    `
};
