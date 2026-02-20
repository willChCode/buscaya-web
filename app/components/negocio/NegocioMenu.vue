<template>
  <div
    class="lg:col-span-4 flex flex-col h-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden"
  >
    <div class="p-4 px-6 md:px-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <h3 class="font-bold text-lg text-gray-800">Menú y Productos</h3>
      <p class="text-xs text-gray-400">Selecciona para ver detalles</p>
    </div>

    <div class="overflow-y-auto flex-1 p-4 px-6 md:px-4 space-y-4">
      <div
        v-if="!negocio.productos || negocio.productos.length === 0"
        class="text-center py-10 text-gray-400"
      >
        Sin productos registrados.
      </div>

      <div
        v-for="(prod, idx) in negocio.productos"
        :key="idx"
        class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-gray-800 text-sm">{{ prod.nombre }}</h4>
            <p class="text-xs text-gray-500 line-clamp-2 mt-1">
              {{ prod.descripcion }}
            </p>
          </div>
          <div class="mt-2 font-bold text-primary-500">${{ prod.precio }}</div>
        </div>
        <div class="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
          <img
            :src="(typeof prod.foto === 'string' ? prod.foto : prod.foto?.url) || 'https://placehold.co/150'"
            class="w-full h-full object-cover"
            alt="producto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  negocio: any;
}>();
</script>
