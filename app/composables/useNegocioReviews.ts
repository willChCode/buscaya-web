import { ref, computed } from 'vue';
import { agregarResena } from '~/services/negocio';
import { useAuthStore } from '~/stores/auth.store';

export const useNegocioReviews = (negocio: any) => {
  const authStore = useAuthStore();
  const showReviewModal = ref(false);
  const enviando = ref(false);
  const nuevaResena = ref({
    calificacion: 0,
    comentario: '',
  });

  const feedbackOptions: Record<
    number,
    { emoji: string; texto: string; color: string }
  > = {
    1: { emoji: '😡', texto: 'Terrible', color: 'text-red-600' },
    2: { emoji: '😕', texto: 'Malo', color: 'text-orange-500' },
    3: { emoji: '😐', texto: 'Regular', color: 'text-yellow-500' },
    4: { emoji: '🙂', texto: 'Bueno', color: 'text-lime-600' },
    5: { emoji: '🤩', texto: 'Excelente', color: 'text-green-600' },
  };

  const feedbackActual = computed(
    () => feedbackOptions[nuevaResena.value.calificacion]
  );

  const esFormularioValido = computed(() => {
    return (
      nuevaResena.value.calificacion > 0 &&
      nuevaResena.value.comentario.trim().length > 3
    );
  });

  const closeReviewModal = () => {
    showReviewModal.value = false;
    nuevaResena.value = { calificacion: 0, comentario: '' };
  };

  const enviarResena = async (bizOverride?: any) => {
    const biz = bizOverride || negocio;
    const bizId = biz?._id || biz?.id;

    if (!esFormularioValido.value || !biz) {
      return;
    }
    
    if (!authStore.user?.token) {
      return;
    }

    enviando.value = true;
    try {
      const resenaPayload = {
        calificacion: nuevaResena.value.calificacion,
        comentario: nuevaResena.value.comentario,
      };

      await agregarResena(bizId, resenaPayload, authStore.user.token);

      // Optimistic update for UI
      const optimisticResena = {
        ...resenaPayload,
        usuario: {
            nombre: authStore.user.displayName,
            image: authStore.user.image
        },
        fecha: new Date(),
      };

      // Optimistic update
      if (!biz.reseñas) biz.reseñas = [];
      biz.reseñas.unshift(optimisticResena);

      const total = biz.reseñas.length;
      const suma = biz.reseñas.reduce(
        (acc: number, r: any) => acc + Number(r.calificacion),
        0
      );
      biz.promedio = Number(suma / total).toFixed(1);
      biz.totalReseñas = total;

      closeReviewModal();
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      throw error;
    } finally {
      enviando.value = false;
    }
  };

  return {
    showReviewModal,
    nuevaResena,
    enviando,
    feedbackActual,
    esFormularioValido,
    closeReviewModal,
    enviarResena,
  };
};
