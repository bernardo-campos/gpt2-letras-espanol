export default {
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
};
