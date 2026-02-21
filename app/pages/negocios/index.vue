<template>
  <div class="pt-5 px-3 md:px-6">
    <!-- BODY -->
    <!-- GRUPOSS & CATEGORIAS -->
    <div class="mt-2 md:mt-5">
      <CarouselSection title="Hola. Que vas a buscar hoy?" gapClass="gap-2">
        <CardGrupo v-for="grupo in grupos" :key="grupo.id" :grupo="grupo" />
      </CarouselSection>
    </div>

    <!-- NEGOCIOS CERCA -->
    <div class="mt-6 md:mt-4">
      <CarouselSection
        title="Negocios cerca de ti"
        :count="store.totalNegociosHome"
        linkTo="/resultados"
        linkText="Ver todos"
      >
        <template v-if="store.cargando && store.negociosHome.length === 0">
          <BusinessSkeleton
            v-for="n in 5"
            :key="n"
            class="w-[285px] flex-shrink-0"
          />
        </template>
        <div
          v-else-if="store.negociosHome.length === 0"
          class="w-full text-center py-8"
        >
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <p class="text-gray-500 font-medium text-sm">
            No hay negocios en esta zona.
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Intenta cambiar tu ubicación.
          </p>
        </div>
        <template v-else>
          <component
            :is="getCardComponent(negocio)"
            v-for="negocio in store.negociosHome"
            :key="negocio.id"
            :negocio="negocio"
            @click="openBusiness(negocio)"
          />
        </template>
      </CarouselSection>
    </div>

    <!-- PROMOCIONES -->
    <div class="mt-6 mb-12">
      <CarouselSection
        title="Nuestras promociones"
        linkTo="/revista"
        linkText="Ver revista"
      >
        <CardPromo v-for="promo in promos" :key="promo.id" :promocion="promo" />
      </CarouselSection>
    </div>
  </div>

  <!-- FOOTER NEGOCIOS (Full Width) -->
  <div class="w-full bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
    <div class="container mx-auto px-4 md:px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-center">
        <!-- Columna 1: Logo / Info -->
        <div
          class="col-span-1 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <div
            class="flex items-center justify-center md:justify-start gap-3 mb-5"
          >
            <img
              src="~/assets/images/logo/buscaya-logo-blanco.png"
              alt="Buscaya"
              class="h-8 w-auto opacity-100"
            />
            <!-- <span class="text-2xl font-bold text-white tracking-tight">Buscaya Negocios</span> -->
          </div>
          <p
            class="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm font-light mx-auto md:mx-0"
          >
            La plataforma líder para conectar negocios locales con clientes en
            tiempo real. Descubre, conecta y crece con nosotros.
          </p>
          <div class="flex space-x-4 justify-center md:justify-start">
            <!-- Facebook -->
            <a
              href="https://www.facebook.com/buscaya.nl/"
              target="_blank"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                class="h-6 w-6 -mt-[2px]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                />
              </svg>
            </a>
            <!-- Instagram -->
            <a
              href="https://www.instagram.com/buscaya.mx"
              target="_blank"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </a>
            <!-- WhatsApp -->
            <a
              href="https://wa.me/528110720923"
              target="_blank"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Columna 2: CTA Negocios (Premium UI) -->
        <div
          class="col-span-1 flex flex-col items-center md:items-end text-center md:text-right"
        >
          <h4
            class="text-xl md:text-[25px] font-extrabold leading-tight text-white mb-4"
          >
            Lleva tu negocio al
            <span class="text-[#FFD100]">siguiente nivel</span>
          </h4>
          <p
            class="text-gray-400 text-sm mb-8 max-w-lg leading-relaxed font-light mx-auto md:mr-0"
          >
            Únete a la plataforma de mayor crecimiento. Destaca con un perfil
            profesional y llega directo a los clientes que buscan lo que
            ofreces.
          </p>
          <a
            href="https://wa.me/528110720923?text=hola%2C%20vengo%20de%20su%20pagina%20web%20me%20gustaria%20registrar%20mi%20engocio%20en%20buscaYa"
            target="_blank"
            class="bg-[#FFD100] hover:bg-[#ffdb4d] text-gray-900 font-bold py-3 px-10 rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(255,209,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,209,0,0.4)] hover:-translate-y-1 active:scale-95 flex items-center gap-3 group"
          >
            <span class="text-base font-bold">Contáctanos</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>

      <div
        class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500"
      >
        <p>
          &copy; {{ new Date().getFullYear() }} Buscaya Inc. Todos los derechos
          reservados.
        </p>
        <div class="flex space-x-4 mt-4 md:mt-0">
          <a href="#" class="hover:text-white">Política de Privacidad</a>
          <a href="#" class="hover:text-white">Términos de Servicio</a>
        </div>
      </div>
    </div>
  </div>

  <!-- DATOS BASE NEGOCIOS Y GEOLOCALIZACION -->
  <!-- <div>
    <p>{{ store.ubicacion?.direccion }}</p>
  </div> -->

  <DrawerNegocio v-model:isOpen="isOpen" :negocio="selectedNegocio" />
</template>

<script setup>
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import Card from '~/components/Card.vue';
import CardPremium from '~/components/CardPremium.vue';
import CardGrupo from '~/components/CardGrupo.vue';
import CardPromo from '~/components/CardPromo.vue';
import CarouselSection from '~/components/CarouselSection.vue';
import DrawerNegocio from '~/components/DrawerNegocio.vue';
import BusinessSkeleton from '~/components/BusinessSkeleton.vue';

// Remove default layout padding to allow full-width footer
definePageMeta({
  paddingClass: 'p-0',
});

const getCardComponent = (negocio) => {
  const plan = negocio.membresia?.plan?.toLowerCase();
  if (plan === 'premium' || plan === 'gold') {
    return CardPremium;
  }
  return Card;
};

const selectedNegocio = ref(null);
const isOpen = ref(false);
const router = useRouter();
const store = useUbicacionNegocios();

const openBusiness = (negocio) => {
  selectedNegocio.value = negocio;
  isOpen.value = true;
};

onMounted(() => {
  if (!store.ubicacion || !store.ubicacion.direccion) {
    router.push('/');
  } else {
    store.fetchHomeNegocios(); // usa home específico
  }
});

const grupos = [
  {
    id: 1,
    nombre: 'Servicios Profesionales',
    imagen: '/categorias/profesionistas.png',
  },
  {
    id: 2,
    nombre: 'Comida y Bebida',
    imagen: '/categorias/Comida.png',
  },
  {
    id: 3,
    nombre: 'Hogar y Construcción',
    imagen: '/categorias/Hogar.png',
  },
  {
    id: 4,
    nombre: 'Tiendas Locales',
    imagen: '/categorias/Tiendas.png',
  },
  {
    id: 5,
    nombre: 'Salud y Médicos',
    imagen: '/categorias/Salud.png',
  },
  {
    id: 6,
    nombre: 'Belleza y Estética',
    imagen: '/categorias/Belleza.png',
  },
  {
    id: 7,
    nombre: 'Fiestas y Eventos',
    imagen: '/categorias/Eventos.png',
  },
  {
    id: 8,
    nombre: 'Automotriz',
    imagen: '/categorias/Mecanico.png',
  },
  {
    id: 9,
    nombre: 'Mascotas',
    imagen: '/categorias/Mascotas.png',
  },
  {
    id: 10,
    nombre: 'Ropa y Accesorios',
    imagen: '/categorias/ropa.png',
  },
  {
    id: 11,
    nombre: 'Papelerías y Oficinas',
    imagen: '/categorias/papelerias.png',
  },
  {
    id: 12,
    nombre: 'Alojamiento y Transporte',
    imagen: '/categorias/Hospedajes.png',
  },
  {
    id: 13,
    nombre: 'Bancos y Finanzas',
    imagen: '/categorias/bancos.png',
  },
  {
    id: 14,
    nombre: 'Deporte y Gimnasios',
    imagen: '/categorias/deportes.png',
  },
  {
    id: 15,
    nombre: 'Muebles y Decoración',
    imagen: '/categorias/muebles.png',
  },
];
const promos = [
  {
    id: 1,
    imagen: '/banner/revista-3.webp',
  },
  {
    id: 2,
    imagen: '/banner/revista-2.webp',
  },
  {
    id: 3,
    imagen: '/banner/revista-1.webp',
  },
  // {
  //   id: 4,
  //   imagen: 'https://picsum.photos/400/300?random=1',
  // },
  // {
  //   id: 5,
  //   imagen: 'https://picsum.photos/400/300?random=1',
  // },
  // {
  //   id: 6,
  //   imagen: 'https://picsum.photos/400/300?random=1',
  // },
];
</script>
