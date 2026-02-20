<template>
  <div>
    <!-- Mobile: Shows nothing, parent layout shows menu -->
    <!-- Desktop: Redirects immediately -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Only redirect on large screens (desktop)
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    router.replace('/perfil/informacion');
  }
});
</script>
