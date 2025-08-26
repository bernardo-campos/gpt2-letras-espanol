import TabNavigation from './components/TabNavigation.js';

// Vue y VueRouter ya están disponibles globalmente
const { ref, computed, onMounted, watch, provide } = Vue;
const { useRoute, useRouter } = VueRouter;

export default {
    components: {
        TabNavigation
    },
    setup() {
        // --- State Management ---
        const artistData = ref(null);
        const loading = ref(true);
        const error = ref(null);
        const selectedArtist = ref('');

        const route = useRoute();
        const router = useRouter();

        // --- Helper ---
        const getSlug = (name) => name ? name.toLowerCase().replace(/\s+/g, '-') : '';

        // --- Data Loading ---
        const loadArtistData = async () => {
            try {
                const response = await fetch('artist_analysis_data.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                artistData.value = await response.json();
                if (artists.value.length > 0 && !selectedArtist.value) {
                    selectedArtist.value = artists.value[0];
                }
            } catch (e) {
                error.value = e.message;
            } finally {
                loading.value = false;
            }
        };

        // --- Computed Properties ---
        const artists = computed(() => artistData.value ? Object.keys(artistData.value) : []);
        const activeTab = computed(() => route.name);
        const selectedArtistSlug = computed(() => getSlug(selectedArtist.value));

        // --- Provide data to child routes ---
        provide('artistData', artistData);
        provide('loading', loading);
        provide('error', error);
        provide('artists', artists);
        provide('getSlug', getSlug);

        // --- Watchers ---
        watch(selectedArtist, (newArtist) => {
            if (!newArtist || !route.params.slug) return;
            const newSlug = getSlug(newArtist);
            if (newSlug !== route.params.slug) {
                router.push({ name: route.name, params: { ...route.params, slug: newSlug } });
            }
        });

        // --- Lifecycle Hooks ---
        onMounted(loadArtistData);

        return {
            loading,
            error,
            artists,
            selectedArtist,
            activeTab,
            selectedArtistSlug,
            // Exponer 'route' a la plantilla para que :key="route.fullPath" funcione
            route
        };
    },
    template: `
        <div class="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-8 md:p-10">
            <header class="text-center mb-8">
                <h1 class="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-2">Análisis de Letras de Canciones</h1>
                <p class="text-xl sm:text-2xl text-gray-600">Exploración de patrones léxicos y generaciones con IA</p>
            </header>

            <section v-if="!loading" class="mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div class="w-full sm:w-auto flex-grow">
                    <label for="artist-select" class="block text-lg font-semibold text-gray-700 mb-2">Selecciona un Artista:</label>
                    <select id="artist-select" v-model="selectedArtist"
                            class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white">
                        <option v-for="artistName in artists" :key="artistName" :value="artistName">
                            {{ artistName }}
                        </option>
                    </select>
                </div>
                <tab-navigation :active-tab="activeTab" :artist-slug="selectedArtistSlug"></tab-navigation>
            </section>

            <router-view :key="route.fullPath"></router-view>

            <div v-if="loading" class="text-center text-indigo-600 text-xl font-semibold mt-8">Cargando datos...</div>
            <div v-if="error" class="text-center text-red-600 text-xl font-semibold mt-8">Error al cargar los datos: {{ error }}</div>
        </div>
    `
};
