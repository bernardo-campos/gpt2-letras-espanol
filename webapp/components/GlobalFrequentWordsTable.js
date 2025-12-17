export default {
    props: ['wordsByArtist', 'stats'],
    template: `
        <div class="overflow-x-auto">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Top 5 Palabras Más Frecuentes por Artista</h3>
            <table class="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Artista</th>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Canciones</th>
                        <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">5 Palabras Frecuentes (Palabra: Conteo)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="(words, artistName) in wordsByArtist" :key="artistName" class="hover:bg-gray-50 transition-colors duration-150">
                        <td class="py-3 px-4 text-base text-gray-900 font-medium">{{ artistName }}</td>
                        <td class="py-3 px-4 text-base text-gray-700">{{ stats[artistName] ? stats[artistName].songs.toLocaleString() : 0 }}</td>
                        <td class="py-3 px-4 text-base text-gray-700">
                            <span v-if="words.length > 0">{{ words.map(w => \`\${w.word}: \${w.count}\`).join(', ') }}</span>
                            <span v-else class="text-gray-500">N/A</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};
