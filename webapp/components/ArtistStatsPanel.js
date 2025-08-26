export default {
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
};
