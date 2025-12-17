const { ref, inject, computed, onMounted } = Vue;

export default {
    setup() {
        const artists = inject('artists');
        const model_choice = ref('GPT2 Fine-Tuned (bernardoc90/gpt2-spanish-lyrics)');
        const selected_artist = ref('');
        const initial_prompt = ref('');
        const generated_result = ref(null);
        const loading = ref(false);
        const error = ref(null);
        
        const isAvailable = ref(false);
        const checkingAvailability = ref(true);
        const spaceId = "bernardoc90/gpt-spanish-lyrics";

        const isSpaceAvailable = async (spaceId) => {
            try {
                const { Client } = await import("https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js");
                const client = await Client.connect(spaceId);
                return true;
            } catch (err) {
                return false;
            }
        };

        onMounted(async () => {
            isAvailable.value = await isSpaceAvailable(spaceId);
            checkingAvailability.value = false;
        });

        const formattedResult = computed(() => {
            if (generated_result.value && Array.isArray(generated_result.value) && generated_result.value.length === 1) {
                return generated_result.value[0];
            }
            return generated_result.value;
        });

        const generateLyrics = async () => {
            loading.value = true;
            error.value = null;
            generated_result.value = null;
            
            try {
                const { Client } = await import("https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js");
                const client = await Client.connect("bernardoc90/gpt-spanish-lyrics");
                
                const result = await client.predict("/predict", {
                    model_choice: model_choice.value,
                    artist: selected_artist.value,
                    initial_prompt: initial_prompt.value,
                });
                
                generated_result.value = result.data;
            } catch (e) {
                error.value = "Error al generar la letra: " + e.message;
                console.error(e);
            } finally {
                loading.value = false;
            }
        };

        return {
            artists,
            model_choice,
            selected_artist,
            initial_prompt,
            generated_result,
            formattedResult,
            loading,
            error,
            generateLyrics,
            isAvailable,
            checkingAvailability,
            spaceId
        };
    },
    template: `
        <div class="container mx-auto px-4 py-8 relative min-h-[500px]">
            <!-- Availability Overlay -->
            <div v-if="!checkingAvailability && !isAvailable" class="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-lg">
                <div class="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-md">
                    <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">Servicio No Disponible</h3>
                    <p class="text-gray-600 mb-6">El Space de Hugging Face se encuentra apagado o no responde en este momento.</p>
                    <a :href="'https://huggingface.co/spaces/' + spaceId" target="_blank" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
                        Ver estado del Space
                        <svg class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                    </a>
                </div>
            </div>
            
            <!-- Checking Availability Overlay -->
             <div v-if="checkingAvailability" class="absolute inset-0 z-50 bg-white flex items-center justify-center rounded-lg">
                <div class="flex flex-col items-center">
                    <svg class="animate-spin h-10 w-10 text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-gray-600 font-medium">Verificando disponibilidad...</span>
                </div>
            </div>

            <h2 class="text-2xl font-bold mb-6 text-gray-800">Generar Letra</h2>
            
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1">
                    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="model_choice">
                                Modelo
                            </label>
                            <select v-model="model_choice" id="model_choice" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="GPT2 Fine-Tuned (bernardoc90/gpt2-spanish-lyrics)">GPT2 Fine-Tuned (bernardoc90/gpt2-spanish-lyrics)</option>
                                <option value="GPT2 Original (DeepESP/gpt2-spanish)">GPT2 Original (DeepESP/gpt2-spanish)</option>
                            </select>
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="artist">
                                Artista
                            </label>
                            <select v-model="selected_artist" id="artist" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option disabled value="">Selecciona un artista</option>
                                <option v-for="artist in artists" :key="artist" :value="artist">
                                    {{ artist }}
                                </option>
                            </select>
                        </div>
                        
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="initial_prompt">
                                Comienza con
                            </label>
                            <textarea v-model="initial_prompt" id="initial_prompt" placeholder="(Opcional)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"></textarea>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <button @click="generateLyrics" :disabled="loading || !selected_artist" :class="{'opacity-50 cursor-not-allowed': loading || !selected_artist}" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                Generar
                            </button>
                        </div>
                    </div>

                    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span class="block sm:inline">{{ error }}</span>
                    </div>
                </div>

                <div class="w-full md:w-1/2">
                    <div class="bg-gray-100 p-6 rounded-lg shadow-inner h-full whitespace-pre-wrap">
                        <h3 v-if="generated_result" class="text-xl font-semibold mb-4">Resultado:</h3>
                        <div class="text-gray-800">{{ formattedResult }}</div>
                    </div>
                </div>
            </div>

            <!-- Overlay Loader -->
            <div v-if="loading" class="absolute inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 rounded-lg" style="min-height: 300px;">
                <div class="bg-white p-5 rounded-lg flex items-center space-x-3 shadow-lg">
                    <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-indigo-600 font-semibold">Generando...</span>
                </div>
            </div>
        </div>
    `
};
