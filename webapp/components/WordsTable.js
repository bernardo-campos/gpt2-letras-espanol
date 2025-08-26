import { computed } from 'vue';

export default {
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
};
