export const diasSemana = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

export const obtenerEstadoNegocio = (horarios: any) => {
  if (!horarios)
    return {
      abierto: false,
      texto: 'Sin horario',
      clase: 'bg-gray-400',
      textoColor: 'text-gray-700',
    };

  const ahora = new Date();
  const diaHoy = diasSemana[ahora.getDay()];
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

  //@ts-ignore
  const rangosHoy = horarios[diaHoy] || [];

  //@ts-ignore
  const estaAbierto = rangosHoy.some((rango) => {
    const [hAbre, mAbre] = rango.abre.split(':').map(Number);
    const [hCierra, mCierra] = rango.cierra.split(':').map(Number);

    const minutosAbre = hAbre * 60 + mAbre;
    const minutosCierra = hCierra * 60 + mCierra;

    return horaActual >= minutosAbre && horaActual <= minutosCierra;
  });

  return {
    abierto: estaAbierto,
    texto: estaAbierto ? 'Abierto' : 'Cerrado',
    clase: estaAbierto ? 'bg-green-600' : 'bg-red-600',
    textoColor: estaAbierto ? 'text-green-700' : 'text-red-700',
  };
};
