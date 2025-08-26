# Generación de Letras de Canciones en Español con Fine-Tuning de GPT-2

Este repositorio contiene los recursos desarrollados en el marco de mi **Trabajo Final de Carrera en Ingeniería en Informática** en la **Universidad Católica de Santiago del Estero (UCSE)**.  

El proyecto consiste en aplicar **fine-tuning sobre el modelo `DeepEsp/GPT2-spanish`** con un dataset propio de letras de canciones de 20 artistas reconocidos, para generar nuevas letras que emulen su estilo.  

---

## 📂 Estructura del Repositorio

### `dataset/`
Contiene los archivos en formato **JSON**, uno por artista, con las letras utilizadas para el entrenamiento.  
Ejemplo de artistas incluidos:
- Mercedes Sosa
- Juan Gabriel
- Los Palmeras
- Sandro
- Fito Páez  
*(y otros, hasta un total de 20 artistas).*

---

### `notebooks/`
Incluye los notebooks de Google Colab utilizados para las distintas etapas del proyecto:

- **[`01_entrenamiento_modelo.ipynb`](notebooks/01_entrenamiento_modelo.ipynb)** → Carga del modelo base desde Hugging Face, preparación de datos, ejecución del fine-tuning y prueba manual de inferencias.  
- **[`02_inferencia_gradio.ipynb`](notebooks/02_inferencia_gradio.ipynb)** → Carga del modelo entrenado desde Google Drive, interfaz interactiva de inferencia con Gradio e inferencia masiva por artista.  
- **[`03_visualizacion_estadisticas.ipynb`](notebooks/03_visualizacion_estadisticas.ipynb)** → Visualización de estadísticas del dataset (histogramas, tablas) y comparación con las generaciones del modelo.  

---

### `webapp/`
Aplicación web estática que permite:
- Navegar por el dataset original de letras.  
- Visualizar estadísticas generales y por artista.  
- Consultar las generaciones obtenidas a partir del modelo ajustado.  

🔗 **Enlace a la aplicación web:** [Explorar la WebApp](https://bernardo-campos.github.io/gpt2-letras-espanol/)

---

## 🧩 Modelo Utilizado
- **Base:** [`DeepEsp/GPT2-spanish`](https://huggingface.co/DeepEsp/gpt2-spanish)  
- **Técnica:** Full Fine-tuning
- **Plataforma:** Google Colab + Google Drive  

---

## 🚀 Objetivo del Proyecto
- Implementar un modelo de lenguaje basado en Inteligencia Artificial capaz de generar letras de canciones en español, emulando el estilo lírico de artistas específicos, y evaluar su desempeño en términos de coherencia, creatividad y consistencia estilística.

---

## 📜 Autor
**Bernardo Campos**  
Trabajo Final de Carrera – Ingeniería en Informática  
Universidad Católica de Santiago del Estero (UCSE)  

---
