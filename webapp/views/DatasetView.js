import DatasetExplorer from '../components/DatasetExplorer.js';

// Vue está disponible globalmente
const { ref, computed, inject, watch } = Vue;

export default {
    components: { DatasetExplorer },
    props: ['slug', 'index'],
    setup(props) {
        const artistData = inject('artistData');
        const artists = inject('artists');
        const getSlug = inject('getSlug');

        const artistSongs = ref([]);
        const datasetLoading = ref(false);
        const datasetError = ref(null);

        const getArtistNameFromSlug = (slug) => {
            if (!slug) return artists.value[0];
            for (const name in artistData.value) {
                if (getSlug(name) === slug) return name;
            }
            return artists.value[0];
        };

        const artistName = computed(() => getArtistNameFromSlug(props.slug));
        const selectedArtistData = computed(() => artistData.value ? artistData.value[artistName.value] : null);

        const loadArtistDataset = async (url) => {
            if (!url) {
                artistSongs.value = [];
                datasetError.value = "No se proporcionó una URL para el dataset.";
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
            } finally {
                datasetLoading.value = false;
            }
        };

        watch(selectedArtistData, (newData) => {
            if (newData && newData.url_dataset) {
                loadArtistDataset(newData.url_dataset);
            }
        }, { immediate: true });

        return {
            artistSongs,
            datasetLoading,
            datasetError,
            initialSongIndex: computed(() => props.index ? parseInt(props.index, 10) : null)
        };
    },
    template: `
        <dataset-explorer
            :songs="artistSongs"
            :loading="datasetLoading"
            :error="datasetError"
            :initial-song-index="initialSongIndex"
        ></dataset-explorer>
    `
};
