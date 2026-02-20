<template>
  <div
    class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mt-auto mb-4 mx-4 md:mx-0"
  >
    <h3
      class="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2 uppercase tracking-wide"
    >
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Horarios de atención
    </h3>

    <ul class="space-y-3 text-sm text-gray-600">
      <li
        v-for="(horas, dia) in negocio.horarios"
        :key="dia"
        class="flex justify-between items-center py-1 border-b border-gray-50 last:border-0"
      >
        <span class="capitalize font-medium w-24">{{ dia }}</span>
        <div class="flex-1 text-right">
          <span
            v-if="horas && horas.length > 0"
            class="bg-gray-100 px-2 py-1 rounded-md text-gray-700 text-xs font-medium"
          >
            {{ horas[0].abre }} - {{ horas[0].cierra }}
          </span>
          <span
            v-else
            class="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-md"
          >
            Cerrado
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  negocio: any;
}>();
</script>
