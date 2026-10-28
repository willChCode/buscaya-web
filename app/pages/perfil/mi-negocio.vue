<template>
  <div class="bg-white rounded-2xl shadow-sm p-5 sm:p-10 h-full relative">
    <div class="border-b border-gray-200 pb-6 mb-6">
      <h2 class="text-[22px] sm:text-2xl font-bold text-gray-900">Mi negocio</h2>
      <p class="text-gray-500 text-sm mt-1">
        Revisa cuántas personas te visitan y mantén tu información al día.
      </p>
    </div>

    <!-- Cargando -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error -->
    <div v-else-if="errorCarga" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
      {{ errorCarga }}
      <button class="underline ml-2" @click="cargar">Reintentar</button>
    </div>

    <!-- Sin negocio -->
    <div v-else-if="!negocio" class="text-center py-10">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800">Aún no tienes un negocio vinculado</h3>
      <p class="text-gray-500 text-sm mt-2 max-w-md mx-auto">
        Si tu negocio ya aparece en Buscaya, ábrelo y presiona <b>“Reclamar”</b>.
        Lo verificamos y lo vinculamos a tu cuenta.
      </p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          to="/negocios"
          class="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Buscar mi negocio
        </NuxtLink>
        <a
          :href="urlRegistro"
          target="_blank"
          rel="noopener"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Registrar uno nuevo
        </a>
      </div>
    </div>

    <!-- Con negocio -->
    <div v-else class="space-y-8">
      <div class="flex items-center gap-4">
        <img
          :src="imagenOptimizada(negocio.portada?.url, 160) || 'https://placehold.co/160x160'"
          :alt="negocio.nombre"
          class="w-16 h-16 rounded-xl object-cover bg-gray-100"
        />
        <div class="flex-1 min-w-0">
          <p class="font-bold text-gray-900 truncate">{{ negocio.nombre }}</p>
          <p class="text-sm text-gray-500">{{ negocio.categoria }}</p>
        </div>
        <NuxtLink
          :to="urlNegocio(negocio)"
          class="text-primary-600 hover:text-primary-700 text-sm font-medium shrink-0"
        >
          Ver ficha →
        </NuxtLink>
      </div>

      <!-- Estadísticas -->
      <section>
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Estadísticas {{ anio }}
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="stat in resumen" :key="stat.label" class="bg-gray-50 rounded-xl p-4">
            <p class="text-2xl font-extrabold text-gray-900">{{ stat.valor.toLocaleString('es-MX') }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stat.label }}</p>
          </div>
        </div>

        <div class="mt-5 bg-gray-50 rounded-xl p-4">
          <p class="text-sm font-semibold text-gray-700 mb-4">Visitas por mes</p>
          <div class="flex items-end gap-1.5 h-32">
            <div
              v-for="mes in visitasPorMes"
              :key="mes.label"
              class="flex-1 flex flex-col items-center justify-end h-full gap-1"
            >
              <span class="text-[10px] text-gray-500">{{ mes.valor || '' }}</span>
              <div
                class="w-full rounded-t bg-primary-500/80"
                :style="{ height: `${maxMes ? (mes.valor / maxMes) * 100 : 0}%`, minHeight: mes.valor ? '4px' : '0' }"
              ></div>
              <span class="text-[10px] text-gray-400">{{ mes.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Edición -->
      <section>
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Información del negocio
        </h3>
        <form class="space-y-4" @submit.prevent="guardar">
          <div>
            <label for="descripcion" class="text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              v-model="form.descripcion"
              rows="4"
              maxlength="600"
              class="mt-1 w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
              placeholder="Cuenta qué ofreces, desde cuándo y qué te hace diferente."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="campo in camposContacto" :key="campo.key">
              <label :for="campo.key" class="text-sm font-medium text-gray-700">{{ campo.label }}</label>
              <input
                :id="campo.key"
                v-model="form.contacto[campo.key]"
                :type="campo.tipo"
                :inputmode="campo.tipo === 'tel' ? 'numeric' : undefined"
                :placeholder="campo.placeholder"
                class="mt-1 w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          <p v-if="mensaje" class="text-sm" :class="mensaje.ok ? 'text-green-600' : 'text-red-600'">
            {{ mensaje.texto }}
          </p>

          <button
            type="submit"
            :disabled="guardando"
            class="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth.store';
import {
  obtenerMisNegocios,
  obtenerMetricasNegocio,
  actualizarNegocio,
} from '~/services/negocio';
import { urlNegocio, imagenOptimizada } from '~/utils/helpers';

definePageMeta({
  middleware: ['auth'],
});

useSeoMeta({ title: 'Mi negocio | Buscaya', robots: 'noindex, nofollow' });

const authStore = useAuthStore();
const anio = new Date().getFullYear();
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const loading = ref(true);
const errorCarga = ref('');
const negocio = ref<any>(null);
const metricas = ref<any>(null);

const urlRegistro = `https://wa.me/528110720923?text=${encodeURIComponent(
  'Hola, quiero registrar mi negocio en Buscaya.'
)}`;

const camposContacto = [
  { key: 'telefono', label: 'Teléfono', tipo: 'tel', placeholder: '8112345678' },
  { key: 'whatsapp', label: 'WhatsApp', tipo: 'tel', placeholder: '8112345678' },
  { key: 'facebook', label: 'Facebook', tipo: 'url', placeholder: 'https://facebook.com/…' },
  { key: 'instagram', label: 'Instagram', tipo: 'url', placeholder: 'https://instagram.com/…' },
  { key: 'tiktok', label: 'TikTok', tipo: 'url', placeholder: 'https://tiktok.com/@…' },
  { key: 'web', label: 'Página web', tipo: 'url', placeholder: 'https://…' },
] as const;

const form = ref<{ descripcion: string; contacto: Record<string, any> }>({
  descripcion: '',
  contacto: {},
});

const sumaMeses = (desglose: Record<string, Record<string, number>> = {}) =>
  Object.values(desglose).reduce(
    (total, dias) => total + Object.values(dias || {}).reduce((a, b) => a + Number(b || 0), 0),
    0
  );

const resumen = computed(() => {
  const m = metricas.value || {};
  const mesActual = String(new Date().getMonth() + 1);
  const visitasMes = Object.values(m.desgloseMensual?.[mesActual] || {}).reduce(
    (a: number, b: any) => a + Number(b || 0),
    0
  );
  return [
    { label: 'Visitas este mes', valor: visitasMes },
    { label: 'Visitas en el año', valor: m.totalAnual ?? sumaMeses(m.desgloseMensual) },
    { label: 'Clics a WhatsApp', valor: m.totalAnualWhatsapp ?? sumaMeses(m.desgloseMensualWhatsapp) },
    { label: 'Clics a teléfono', valor: m.totalAnualTelefono ?? sumaMeses(m.desgloseMensualTelefono) },
  ];
});

// desgloseMensual: { "<mes 1-12>": { "<día>": visitas } }
const visitasPorMes = computed(() =>
  MESES.map((label, i) => ({
    label,
    valor: Object.values(metricas.value?.desgloseMensual?.[String(i + 1)] || {}).reduce(
      (a: number, b: any) => a + Number(b || 0),
      0
    ),
  }))
);
const maxMes = computed(() => Math.max(0, ...visitasPorMes.value.map((m) => m.valor)));

const llenarFormulario = (n: any) => {
  form.value = {
    descripcion: n.descripcion || '',
    contacto: { ...(n.contacto || {}) },
  };
};

const cargar = async () => {
  if (!authStore.user?.token) return;
  loading.value = true;
  errorCarga.value = '';
  try {
    const negocios = await obtenerMisNegocios(authStore.user.token);
    negocio.value = negocios[0] || null;
    if (negocio.value) {
      llenarFormulario(negocio.value);
      metricas.value = await obtenerMetricasNegocio(negocio.value._id, anio).catch(() => null);
    }
  } catch (e: any) {
    errorCarga.value = e.message || 'No pudimos cargar tu negocio.';
  } finally {
    loading.value = false;
  }
};

const guardando = ref(false);
const mensaje = ref<{ ok: boolean; texto: string } | null>(null);

const soloDigitos = (v: any) => {
  const d = String(v ?? '').replace(/\D/g, '');
  return d ? Number(d) : null;
};

const guardar = async () => {
  if (!negocio.value || !authStore.user?.token) return;
  guardando.value = true;
  mensaje.value = null;
  try {
    // El backend reemplaza el objeto contacto completo, así que mandamos todo
    const contacto = {
      ...form.value.contacto,
      telefono: soloDigitos(form.value.contacto.telefono),
      whatsapp: soloDigitos(form.value.contacto.whatsapp),
    };
    const actualizado = await actualizarNegocio(
      negocio.value._id,
      { descripcion: form.value.descripcion.trim() || undefined, contacto },
      authStore.user.token
    );
    negocio.value = { ...negocio.value, ...actualizado };
    llenarFormulario(negocio.value);
    mensaje.value = { ok: true, texto: 'Cambios guardados.' };
  } catch (e: any) {
    mensaje.value = { ok: false, texto: e.message || 'No se pudieron guardar los cambios.' };
  } finally {
    guardando.value = false;
  }
};

onMounted(cargar);
</script>
