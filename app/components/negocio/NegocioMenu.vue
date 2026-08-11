<template>
  <div
    class="flex flex-col bg-gray-50 rounded-2xl border border-gray-100 relative"
  >
    <div
      class="p-4 px-6 md:px-4 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-2xl"
    >
      <h3 class="font-bold text-lg text-gray-800">Menú y Productos</h3>
      <p class="text-xs text-gray-400">Selecciona para ver detalles</p>
    </div>

    <div class="flex-1 p-4 px-6 md:px-4 pb-[100px]">
      <div
        v-if="!negocio.productos || negocio.productos.length === 0"
        class="text-center py-10 text-gray-400"
      >
        Sin productos registrados.
      </div>

      <div v-else class="grid grid-cols-3 gap-x-3 gap-y-5">
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

    <!-- Modal del Producto -->
    <Dialog v-model="showProductModal" widthClass="w-11/12 max-w-sm mx-auto">
      <div v-if="selectedProduct" class="p-6 flex flex-col gap-5">
        <div
          class="w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden shrink-0 shadow-inner"
        >
          <img
            :src="
              (typeof selectedProduct.imagen === 'string'
                ? selectedProduct.imagen
                : selectedProduct.imagen?.url) || 'https://placehold.co/150'
            "
            class="w-full h-full object-cover"
            alt="producto"
          />
        </div>
        <div>
          <h4 class="font-bold text-gray-900 text-xl">
            {{ selectedProduct.nombre }}
          </h4>
          <div
            class="mt-1 text-primary-500 font-bold text-2xl flex items-center gap-3"
          >
            <template v-if="selectedProduct.precioOferta">
              <span class="line-through text-gray-400 text-lg"
                >${{ selectedProduct.precio }}</span
              >
              <span>${{ selectedProduct.precioOferta }}</span>
              <span
                class="bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded-lg border border-red-200"
              >
                -{{
                  Math.round(
                    (1 -
                      selectedProduct.precioOferta / selectedProduct.precio) *
                      100
                  )
                }}%
              </span>
            </template>
            <template v-else>
              {{
                Number(selectedProduct.precio) === 0
                  ? 'Gratis'
                  : `$${selectedProduct.precio}`
              }}
            </template>
          </div>
          <p
            class="text-sm text-gray-600 mt-4 whitespace-pre-wrap leading-relaxed"
          >
            {{ selectedProduct.descripcion }}
          </p>
        </div>
        <button
          @click="showProductModal = false"
          class="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors mt-2"
        >
          Cerrar
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  negocio: any;
}>();

const showProductModal = ref(false);
const selectedProduct = ref<any>(null);

const seleccionarProducto = (prod: any) => {
  selectedProduct.value = prod;
  showProductModal.value = true;
};
</script>
