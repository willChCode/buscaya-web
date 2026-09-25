<template>
  <div
    class="flex flex-col bg-gray-50 rounded-2xl border border-gray-100 relative"
  >
    <div
      class="p-4 px-3.5 md:px-5 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-2xl"
    >
      <h3 class="font-bold text-lg text-gray-800">{{ tituloSeccion }}</h3>
      <p class="text-xs text-gray-400">Selecciona para ver detalles</p>
    </div>

    <div class="flex-1 p-4 px-3.5 md:px-5 lg:pb-[100px]">
      <div
        v-if="!negocio.productos || negocio.productos.length === 0"
        class="text-center py-10 text-gray-400"
      >
        {{ textoVacio }}
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-5">
        <div
          v-for="(prod, idx) in negocio.productos"
          :key="idx"
          @click="seleccionarProducto(prod)"
          class="flex flex-col gap-1.5 cursor-pointer group"
        >
          <!-- Imagen arriba -->
          <div
            class="w-full aspect-square bg-gray-100 rounded-lg shrink-0 overflow-hidden relative"
          >
            <img
              :src="
                (typeof prod.imagen === 'string'
                  ? prod.imagen
                  : prod.imagen?.url) || 'https://placehold.co/150'
              "
              class="w-full h-full object-cover"
              alt="producto"
            />
            <div
              class="absolute bottom-0 left-0 bg-white/95 backdrop-blur-sm text-gray-900 font-extrabold text-[11px] md:text-xs px-2.5 py-1 rounded-tr-xl shadow-sm flex items-center gap-1"
            >
              <template v-if="prod.precioOferta">
                <span
                  class="line-through text-gray-400 font-medium text-[9px] md:text-[10px]"
                  >${{ prod.precio }}</span
                >
                <span class="text-primary-600">${{ prod.precioOferta }}</span>
              </template>
              <template v-else>
                {{ Number(prod.precio) === 0 ? 'Gratis' : `$${prod.precio}` }}
              </template>
            </div>

            <div
              v-if="prod.precioOferta && prod.precio > 0"
              class="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-red-100 text-red-600 font-extrabold text-[10px] md:text-[11px] px-1.5 py-0.5 rounded-md shadow-sm border border-red-200"
            >
              -{{ Math.round((1 - prod.precioOferta / prod.precio) * 100) }}%
            </div>
          </div>

          <!-- Texto debajo -->
          <div class="flex-1 flex flex-col justify-start">
            <h4
              class="font-bold text-gray-800 text-[13px] md:text-sm line-clamp-2 leading-snug"
            >
              {{ prod.nombre }}
            </h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Minimalista del Producto / Servicio -->
    <Dialog
      v-model="showProductModal"
      :hideCloseButton="true"
      widthClass="w-11/12 max-w-sm mx-auto !rounded-2xl overflow-hidden border border-gray-100 shadow-2xl"
    >
      <div v-if="selectedProduct" class="flex flex-col bg-white">
        <!-- Imagen y Botón Cerrar integrado -->
        <div class="w-full h-52 sm:h-56 bg-gray-100 relative overflow-hidden">
          <img
            :src="
              (typeof selectedProduct.imagen === 'string'
                ? selectedProduct.imagen
                : selectedProduct.imagen?.url) || 'https://placehold.co/400x300?text=Sin+Imagen'
            "
            class="w-full h-full object-cover"
            :alt="selectedProduct.nombre"
          />

          <!-- Gradiente sutil para visibilidad de los controles -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/35 pointer-events-none"
          />

          <!-- Botón Cerrar Minimalista Integrado -->
          <button
            @click="showProductModal = false"
            class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Píldora de descuento sobre la imagen (si aplica) -->
          <div
            v-if="selectedProduct.precioOferta && selectedProduct.precio > 0 && selectedProduct.precioOferta < selectedProduct.precio"
            class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-red-600 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-red-100 tracking-tight"
          >
            -{{ Math.round((1 - selectedProduct.precioOferta / selectedProduct.precio) * 100) }}% de descuento
          </div>
        </div>

        <!-- Información -->
        <div class="p-5 flex flex-col gap-3">
          <!-- Título y Precio -->
          <div>
            <h4 class="font-bold text-gray-900 text-lg leading-snug">
              {{ selectedProduct.nombre }}
            </h4>

            <div class="mt-1.5 flex items-baseline gap-2">
              <template v-if="selectedProduct.precioOferta">
                <span class="text-xs text-gray-400 line-through font-normal">
                  ${{ selectedProduct.precio }}
                </span>
                <span class="text-2xl font-black text-gray-900 tracking-tight">
                  ${{ selectedProduct.precioOferta }}
                </span>
              </template>
              <template v-else>
                <span class="text-2xl font-black text-gray-900 tracking-tight">
                  {{
                    Number(selectedProduct.precio) === 0
                      ? 'Gratis'
                      : `$${selectedProduct.precio}`
                  }}
                </span>
              </template>
            </div>
          </div>

          <!-- Descripción -->
          <p
            v-if="selectedProduct.descripcion"
            class="text-xs sm:text-sm text-gray-500 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto"
          >
            {{ selectedProduct.descripcion }}
          </p>

          <!-- Acciones -->
          <div v-if="whatsappLink" class="mt-2">
            <a
              :href="whatsappLink"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full h-11 px-4 bg-[#00d072] hover:bg-[#00b563] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path
                  d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
                />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  negocio: any;
}>();

const seccionInfo = computed(() => {
  const g = (props.negocio?.grupo || '').toLowerCase();
  const c = (props.negocio?.categoria || '').toLowerCase();

  // 1. Comida y Bebida -> Menú
  if (
    g.includes('comida') ||
    g.includes('bebida') ||
    g.includes('restauran') ||
    c.includes('restauran') ||
    c.includes('tacos') ||
    c.includes('pizza') ||
    c.includes('café') ||
    c.includes('cafe') ||
    c.includes('cafetería') ||
    c.includes('cafeteria') ||
    c.includes('hamburguesa') ||
    c.includes('antojitos') ||
    c.includes('postres') ||
    c.includes('sushi')
  ) {
    return {
      titulo: 'Menú',
      vacio: 'Sin platillos o menú registrado.',
    };
  }

  // 2. Servicios (profesionales, técnicos, salud, belleza, automotriz, finanzas, viajes, deportes)
  if (
    g.includes('servicio') ||
    g.includes('profesional') ||
    g.includes('técnico') ||
    g.includes('tecnico') ||
    g.includes('salud') ||
    g.includes('medicina') ||
    g.includes('belleza') ||
    g.includes('estética') ||
    g.includes('estetica') ||
    g.includes('automotriz') ||
    g.includes('finanza') ||
    g.includes('seguro') ||
    g.includes('banco') ||
    g.includes('deporte') ||
    g.includes('fitness') ||
    g.includes('viaje') ||
    g.includes('hospedaje') ||
    c.includes('abogado') ||
    c.includes('contador') ||
    c.includes('arquitecto') ||
    c.includes('ingeniero') ||
    c.includes('psicólogo') ||
    c.includes('psicologo') ||
    c.includes('consultor') ||
    c.includes('plomero') ||
    c.includes('electricista') ||
    c.includes('carpintero') ||
    c.includes('mecánico') ||
    c.includes('mecanico') ||
    c.includes('dentista') ||
    c.includes('médico') ||
    c.includes('medico') ||
    c.includes('barbería') ||
    c.includes('barberia') ||
    c.includes('estética') ||
    c.includes('estetica') ||
    c.includes('spa') ||
    c.includes('gimnasio')
  ) {
    return {
      titulo: 'Servicios',
      vacio: 'Sin servicios registrados.',
    };
  }

  // 3. Comercio / Tiendas puras -> Productos
  if (
    g.includes('tienda') ||
    g.includes('comercio') ||
    g.includes('ropa') ||
    g.includes('moda') ||
    g.includes('mueble') ||
    c.includes('abarrotes') ||
    c.includes('farmacia') ||
    c.includes('papelería') ||
    c.includes('papeleria') ||
    c.includes('zapatería') ||
    c.includes('zapateria') ||
    c.includes('ferretería') ||
    c.includes('ferreteria')
  ) {
    return {
      titulo: 'Productos',
      vacio: 'Sin productos registrados.',
    };
  }

  // 4. Mixto o General -> Productos / Servicios
  return {
    titulo: 'Productos / Servicios',
    vacio: 'Sin productos o servicios registrados.',
  };
});

const tituloSeccion = computed(() => seccionInfo.value.titulo);
const textoVacio = computed(() => seccionInfo.value.vacio);

const showProductModal = ref(false);
const selectedProduct = ref<any>(null);

const whatsappLink = computed(() => {
  const phone = props.negocio?.contacto?.whatsapp;
  if (!phone || !selectedProduct.value) return null;
  const cleanPhone = String(phone).replace(/\D/g, '');
  if (!cleanPhone) return null;
  const fullPhone = cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone;
  const msg = encodeURIComponent(
    `Hola, me interesa información sobre "${selectedProduct.value.nombre}" que vi en BuscaYa.`
  );
  return `https://wa.me/${fullPhone}?text=${msg}`;
});

const seleccionarProducto = (prod: any) => {
  selectedProduct.value = prod;
  showProductModal.value = true;
};
</script>
