<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Términos y Condiciones</h1>
      <div class="prose prose-blue max-w-none text-gray-600">
        <p>Última actualización: {{ new Date().toLocaleDateString() }}</p>
        <p>Bienvenido a BuscaYa. Al utilizar nuestra aplicación, aceptas estos términos y condiciones.</p>
        
        <h3>1. Uso de la Aplicación</h3>
        <p>BuscaYa es una plataforma para conectar usuarios con negocios locales. El uso indebido de la plataforma puede resultar en la suspensión de la cuenta.</p>

        <h3>2. Contenido del Usuario</h3>
        <p>Al publicar comentarios o reseñas, garantizas que tienes derecho a hacerlo y que no violas derechos de terceros.</p>

        <h3>3. Responsabilidad</h3>
        <p>BuscaYa no se hace responsable por la calidad de los servicios ofrecidos por los negocios listados.</p>
        
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
