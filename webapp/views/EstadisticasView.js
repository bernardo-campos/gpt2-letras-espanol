import ArtistStatsPanel from '../components/ArtistStatsPanel.js';
import WordsTable from '../components/WordsTable.js';
import GenerationsViewer from '../components/GenerationsViewer.js';

// Vue está disponible globalmente
const { ref, computed, inject } = Vue;

export default {
    components: { ArtistStatsPanel, WordsTable, GenerationsViewer },
    props: ['slug', 'id'],
    setup(props) {
        const artistData = inject('artistData');
        const artists = inject('artists');
        const getSlug = inject('getSlug');

        const wordsToShowCount = ref(10);

        const getArtistNameFromSlug = (slug) => {
            if (!slug) return artists.value[0];
            for (const name in artistData.value) {
                if (getSlug(name) === slug) return name;
            }
            return artists.value[0];
        };

        const artistName = computed(() => getArtistNameFromSlug(props.slug));
        const selectedArtistData = computed(() => artistData.value ? artistData.value[artistName.value] : null);

        return { artistName, selectedArtistData, wordsToShowCount };
    },
    template: `
        <div v-if="selectedArtistData">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <artist-stats-panel :artist-name="artistName" :stats="selectedArtistData.stats"></artist-stats-panel>
                <words-table
                    :words="selectedArtistData.words"
                    :artist-name="artistName"
                    v-model:words-to-show="wordsToShowCount"
                ></words-table>
            </div>
            <generations-viewer
                :generations="selectedArtistData.generations"
                :frequent-words="selectedArtistData.words"
                :artist-name="artistName"
                :initial-generation-id="id"
            ></generations-viewer>
        </div>
        <div v-else class="text-center text-gray-500 pt-10">
            Selecciona un artista.
        </div>
    `
};
