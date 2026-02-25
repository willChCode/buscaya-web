<template>
  <div class="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1
          class="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4"
        >
          Soporte y Ayuda
        </h1>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          ¿Problemas con BuscaYa o necesitas ayuda con tu negocio en nuestro
          directorio? Estamos aquí para asistirte.
        </p>

        <!-- Información de contacto directo -->
        <div
          class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-gray-700 bg-white shadow-sm rounded-2xl p-4 max-w-2xl mx-auto border border-gray-100"
        >
          <div class="flex items-center gap-2 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            contacto@buscaya.io
          </div>
          <div class="flex items-center gap-2 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              />
            </svg>
            +52 81 1072 0923
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 items-start"
      >
        <!-- Izquierda: Formulario -->
        <div
          class="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-10 lg:sticky lg:top-24"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Envíanos un mensaje
          </h2>
          <form @submit.prevent="enviarWhatsApp" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nombre</label
              >
              <input
                v-model="formulario.nombre"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Motivo</label
              >
              <select
                v-model="formulario.motivo"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              >
                <option value="Soporte Técnico App">
                  Soporte Técnico y Reporte de Errores
                </option>
                <option value="Registro de Negocio">
                  Registro o Ayuda de Negocio
                </option>
                <option value="Contenido Inapropiado">
                  Reportar Contenido / Usuarios
                </option>
                <option value="Eliminacion de Cuenta">
                  Ayuda para Eliminar Cuenta o Datos
                </option>
                <option value="Otro">Otro Motivo</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Mensaje</label
              >
              <textarea
                v-model="formulario.mensaje"
                required
                rows="4"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none resize-none"
                placeholder="Describe brevemente en qué podemos ayudarte..."
              ></textarea>
            </div>
            <button
              type="submit"
              class="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3.5 px-8 rounded-xl transition-colors shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2 mt-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
              Enviar por WhatsApp
            </button>
          </form>
        </div>

        <!-- Derecha: FAQ -->
        <div class="flex flex-col justify-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 px-2">
            Preguntas Frecuentes
          </h2>
          <div class="space-y-5">
            <div
              class="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 class="font-bold text-gray-900 mb-2">
                Eliminación de Cuenta y Datos Personales
              </h4>
              <p class="text-gray-600 text-sm">
                Tienes derecho a eliminar tus datos de nuestra plataforma en
                todo momento conforme a los lineamientos de privacidad de Apple.
                En la aplicación móvil, ve a
                <strong>Perfil > Eliminar Cuenta</strong>. Esta acción borrará
                permanentemente toda tu información personal y no se puede
                deshacer.
              </p>
            </div>

            <div
              class="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 class="font-bold text-gray-900 mb-2">
                ¿Cómo reportar contenido inapropiado? (Safety)
              </h4>
              <p class="text-gray-600 text-sm">
                En BuscaYa mantenemos un ambiente seguro. Si encuentras reseñas
                ofensivas, contenido que viola nuestras políticas o negocios
                falsos, utiliza la opción "Reportar" dentro de la publicación en
                la aplicación, o contáctanos directamente a nuestro correo de
                soporte <strong>contacto@buscaya.io</strong>.
              </p>
            </div>

            <div
              class="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 class="font-bold text-gray-900 mb-2">
                ¿Por qué BuscaYa me pide acceder a mi ubicación?
              </h4>
              <p class="text-gray-600 text-sm">
                BuscaYa es un directorio de negocios locales. Necesitamos tu
                ubicación para poder mostrarte los servicios, tiendas y
                promociones que están más cerca de ti en tiempo real.
              </p>
            </div>

            <div
              class="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 class="font-bold text-gray-900 mb-2">
                Quiero agregar mi negocio a BuscaYa
              </h4>
              <p class="text-gray-600 text-sm">
                ¡Es muy fácil! Llena el formulario de la izquierda seleccionando
                "Registro de Negocio" como motivo, indicando el nombre de tu
                comercio y tu área. Nuestro equipo te contactará de inmediato
                para ayudarte a darle de alta en nuestro directorio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

useHead({
  title: 'Soporte y Ayuda | BuscaYa',
  meta: [
    {
      name: 'description',
      content:
        'Centro de soporte técnico y atención al cliente de BuscaYa. Nuestro directorio local te ayuda a conectar con negocios. Contáctanos por WhatsApp.',
    },
  ],
});

const formulario = reactive({
  nombre: '',
  motivo: 'Soporte Técnico App',
  mensaje: '',
});

const enviarWhatsApp = () => {
  const numero = '528110720923';
  const texto = `Hola equipo de BuscaYa, mi nombre es *${formulario.nombre}*.\n\n*Motivo de contacto:* ${formulario.motivo}\n\n*Mensaje:* ${formulario.mensaje}`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

  window.open(url, '_blank');
};
</script>
