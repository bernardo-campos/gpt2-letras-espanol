import { ref, computed, watch } from 'vue';

export default {
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
};
