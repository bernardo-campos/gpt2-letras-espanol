const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
    setup() {
        // Datos reactivos
        const artistData = ref(null);
        const selectedArtist = ref('');
        const wordsToShowCount = ref(10); // Valor inicial del slider
        const currentGenerationIndex = ref(0);
        const selectedFrequentWords = ref([]);
        const activeTab = ref('artist'); // 'artist' o 'global'
        const loading = ref(true);
        const error = ref(null);

        // Función para cargar los datos del JSON
        const loadArtistData = async () => {
            try {
                // IMPORTANT: Make sure the 'artist_analysis_data.json' file is in the same directory
                // or provide the correct path to the file.
                const response = await fetch('artist_analysis_data.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                artistData.value = await response.json();
                // Seleccionar el primer artista por defecto
                if (Object.keys(artistData.value).length > 0) {
                    selectedArtist.value = Object.keys(artistData.value)[0];
                }
            } catch (e) {
                error.value = e.message;
                console.error("Error al cargar los datos del artista:", e);
            } finally {
                loading.value = false;
            }
        };

        // Propiedad computada para obtener los nombres de los artistas
        const artists = computed(() => {
            return artistData.value ? Object.keys(artistData.value) : [];
        });

        // Propiedad computada para obtener los datos del artista seleccionado
        const selectedArtistData = computed(() => {
            return artistData.value && selectedArtist.value ? artistData.value[selectedArtist.value] : null;
        });

        // Propiedad computada para obtener las palabras filtradas y ordenadas del artista seleccionado
        const filteredWords = computed(() => {
            if (!selectedArtistData.value || !selectedArtistData.value.words) {
                return [];
            }
            // Ordenar por conteo de mayor a menor y limitar por wordsToShowCount
            return [...selectedArtistData.value.words]
                .sort((a, b) => b.count - a.count)
                .slice(0, wordsToShowCount.value);
        });

        // Propiedad computada para el valor máximo del indicador gráfico de palabras
        const maxWordCount = computed(() => {
            if (!filteredWords.value.length) {
                return 1; // Evitar división por cero
            }
            return filteredWords.value[0].count; // La palabra con el conteo más alto
        });

        // Propiedad computada para el valor máximo del slider de palabras a mostrar
        const maxWordsSlider = computed(() => {
            return selectedArtistData.value && selectedArtistData.value.words ? selectedArtistData.value.words.length : 100;
        });

        // Propiedad computada para obtener la generación actual
        const currentGeneration = computed(() => {
            if (!selectedArtistData.value || !selectedArtistData.value.generations || selectedArtistData.value.generations.length === 0) {
                return { title: 'N/A', text: 'No hay generaciones disponibles.' };
            }
            return selectedArtistData.value.generations[currentGenerationIndex.value];
        });

        // Propiedad computada para las palabras más frecuentes para resaltar (las 10 primeras de la lista filtrada)
        const mostFrequentWordsForHighlight = computed(() => {
            return filteredWords.value.slice(0, 20); // Tomar las 20 primeras palabras de la lista filtrada
        });

        // Método para navegar a la generación anterior
        const prevGeneration = () => {
            if (currentGenerationIndex.value > 0) {
                currentGenerationIndex.value--;
            }
        };

        // Método para navegar a la siguiente generación
        const nextGeneration = () => {
            if (selectedArtistData.value && currentGenerationIndex.value < selectedArtistData.value.generations.length - 1) {
                currentGenerationIndex.value++;
            }
        };

        // Método para alternar la selección de una palabra para resaltar
        const toggleWordSelection = (word) => {
            const index = selectedFrequentWords.value.indexOf(word);
            if (index > -1) {
                selectedFrequentWords.value.splice(index, 1); // Deseleccionar
            } else {
                selectedFrequentWords.value.push(word); // Seleccionar
            }
        };

        // Método para resaltar palabras en el texto de la generación
        const highlightText = (text) => {
            if (!text) return '';
            let highlighted = text;
            selectedFrequentWords.value.forEach(word => {
                // Usar una expresión regular global e insensible a mayúsculas/minúsculas
                const regex = new RegExp(`\\b(${word})\\b`, 'gi');
                highlighted = highlighted.replace(regex, `<span class="highlight">$&</span>`);
            });
            // Reemplazar <eos> si existe
            highlighted = highlighted.replace(/<eos>/g, "&lt;eos&gt;");

            return highlighted;
        };

        // Propiedad computada para las estadísticas globales de artistas
        const globalArtistStats = computed(() => {
            if (!artistData.value) return {};
            const stats = {};
            for (const artistName in artistData.value) {
                stats[artistName] = artistData.value[artistName].stats;
            }
            return stats;
        });

        // Propiedad computada para las palabras más frecuentes por artista (global)
        const globalFrequentWords = computed(() => {
            if (!artistData.value) return {};
            const freqWords = {};
            for (const artistName in artistData.value) {
                // Tomar las 5 palabras más frecuentes de cada artista para el resumen global
                freqWords[artistName] = [...artistData.value[artistName].words]
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);
            }
            return freqWords;
        });

        // Resetear el índice de generaciones y las palabras seleccionadas al cambiar de artista
        const resetGenerationsAndWords = () => {
            currentGenerationIndex.value = 0;
            selectedFrequentWords.value = [];
            // Asegurarse de que wordsToShowCount no exceda el número de palabras del nuevo artista
            if (selectedArtistData.value && wordsToShowCount.value > selectedArtistData.value.words.length) {
                wordsToShowCount.value = selectedArtistData.value.words.length;
            }
        };

        // Cargar los datos cuando el componente se monta
        onMounted(() => {
            loadArtistData();
        });

        // Observar cambios en selectedArtist para resetear el índice de generaciones
        watch(selectedArtist, () => {
            resetGenerationsAndWords();
        });

        return {
            artistData,
            selectedArtist,
            wordsToShowCount,
            currentGenerationIndex,
            selectedFrequentWords,
            activeTab,
            loading,
            error,
            artists,
            selectedArtistData,
            filteredWords,
            maxWordCount,
            maxWordsSlider,
            currentGeneration,
            mostFrequentWordsForHighlight,
            prevGeneration,
            nextGeneration,
            toggleWordSelection,
            highlightText,
            globalArtistStats,
            globalFrequentWords,
            resetGenerationsAndWords
        };
    }
}).mount('#app');
