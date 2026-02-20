<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
      <div class="prose prose-blue max-w-none text-gray-600">
        <p>Última actualización: {{ new Date().toLocaleDateString() }}</p>
        <p>Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos y usamos tu información.</p>
        
        <h3>1. Información Recopilada</h3>
        <p>Recopilamos información que nos proporcionas directamente (nombre, email) y datos de uso de la aplicación (ubicación, búsquedas).</p>

        <h3>2. Uso de la Información</h3>
        <p>Usamos tu información para mejorar el servicio, personalizar resultados y comunicarnos contigo.</p>

        <h3>3. Compartir Información</h3>
        <p>No vendemos tu información personal a terceros. Solo compartimos datos necesarios para el funcionamiento de la app.</p>
        
        <p class="mt-8">Si tienes preguntas, contáctanos a soporte@buscaya.com</p>
      </div>
       <div class="mt-8">
        <NuxtLink to="/perfil/configuracion" class="text-primary-600 font-medium hover:text-primary-700">
          &larr; Volver a Configuración
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
