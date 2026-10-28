export const diasSemana = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

// Hora local de México: el SSR corre en UTC y el navegador en hora local,
// así que fijamos la zona para que servidor y cliente coincidan.
const ZONA_HORARIA = 'America/Monterrey';

const ahoraEnMexico = () => {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA_HORARIA,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value || '';
  const dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return {
    dia: dias.indexOf(valor('weekday')),
    minutos: Number(valor('hour')) * 60 + Number(valor('minute')),
  };
};

export const obtenerEstadoNegocio = (horarios: any) => {
  if (!horarios)
    return {
      abierto: false,
      texto: 'Sin horario',
      clase: 'bg-gray-400',
      textoColor: 'text-gray-700',
    };

  const ahora = ahoraEnMexico();
  const diaHoy = diasSemana[ahora.dia];
  const horaActual = ahora.minutos;

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
