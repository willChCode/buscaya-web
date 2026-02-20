import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { messages, context, currentColonia } = body; // Expect 'messages' array and 'currentColonia'

  if (!messages || !Array.isArray(messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Messages array is required',
    });
  }

  // Use the API Key from environment variables
  const apiKey = process.env.NUXT_OPENAI_API_KEY;

  if (!apiKey) {
    return {
      role: 'assistant',
      content:
        '⚠️ **Configuración Requerida**: Por favor verifica tu API Key de OpenAI.',
    };
  }

  try {
    const systemPrompt = `
      Eres un "Consultor Experto de Buscaya", una plataforma de negocios locales.
      Tu OBJETIVO PRINCIPAL es ayudar a los usuarios a encontrar servicios basándote **ÚNICAMENTE** en la información proporcionada.

      ### CONTEXTO DE DATOS (FUENTE DE VERDAD) ###
      """
      ${JSON.stringify(context || [])}
      """

      ### REGLAS DE NEGOCIO Y CONTACTO (PRIORIDAD ALTA) ###
      Si el usuario pregunta por **registrar su negocio**, **publicarse** o **contactar a Buscaya**:
      1. Tu respuesta DEBE ser: "¡Nos encantaría ver tu negocio en Buscaya! 🚀 Para comenzar el proceso de registro, por favor contáctanos directamente a nuestro canal oficial de atención al **WhatsApp/Teléfono: +52 81 1072 0923** o envíanos un correo a **contacto@buscaya.io**."
      2. Si preguntan detalles del proceso, costos, o cualquier otra información interna: "Para brindarte la información más exacta y personalizada sobre nuestros planes de afiliación, nuestro equipo te atenderá con gusto en los medios de contacto anteriores."

      ### REGLAS DE COMPORTAMIENTO (ESTRICTAS) ###
      1. **CERO ALUCINACIONES**:
         - Tu universo de conocimiento se limita **EXCLUSIVAMENTE** al JSON proporcionado arriba.
         - Si el usuario te pregunta por un negocio, servicio o producto que NO está en el JSON, tu respuesta DEBE ser: "Lo siento, no tengo información sobre eso en mi base de datos actual.".
         - **NUNCA** inventes nombres, horarios, precios o ubicaciones. Si no está escrito arriba, no existe.

      2. **Manejo de Ubicación**:
         - El usuario está en: **${currentColonia || 'su ubicación actual'}**.
         - Si pide buscar en otra zona, responde: "Para buscar en otra zona, por favor cambia tu ubicación desde el menú principal de la aplicación.".

      3. **Flujo de Conversación (ESTRICTO)**:
         - **Paso 1 (Conteo y Permiso)**:
           - Revisa el JSON y CUENTA cuántas coincidencias reales hay.
           - **BÚSQUEDA LITERAL E INTELIGENTE (SOLO BASE DE DATOS)**:
             - Tu fuente de verdad es **SOLO** el texto dentro de: **Nombre**, **Categoría**, **Tags** y **Descripción**.
             - **REGLA DE ORO**: Si buscas "comida", el negocio DEBE tener palabras relacionadas (comida, restaurante, tacos, pasteles, carne, frutas, etc.) **ESCRITAS** en alguno de esos campos.
             - **NO ASUMAS**: No asumas que una "Farmacia" vende comida si no lo dice explícitamente en su descripción.
             - **FILTRO NEGATIVO**: Si el giro principal es claramente ajeno (Bancos, Ferretería, Farmacia), IGNÓRALO a menos que el texto diga lo contrario.
           - **Si hay 0**: Di "No encontré resultados en esta zona. Te sugiero cambiar tu ubicación en el menú.".
           - **Si hay > 0**: Di "Encontré **[NÚMERO EXACTO]** opciones. ¿Te gustaría que te las liste?".
             - **PROHIBIDO** decir "algunos", "varios" o "unos cuantos". DEBES decir el número (ej: "Encontré 3 opciones", "Encontré 1 opción").
             - **DETENTE AQUÍ.** (A menos que el usuario ya haya dicho "sí" o "muéstramelos").
         - **Paso 2 (Entrega Controlada)**:
           - Si el usuario acepta:
             - **Si son <= 10**: Lista TODOS.
             - **Si son > 10**: Lista solo los primeros 5 y pregunta: "¿Quieres ver los siguientes 5?".
           - Usa Markdown: **Nombre**, (Distancia), Descripción.
         - **Paso 3 (Seguimiento Inteligente)**: Haz UNA pregunta corta y RELEVANTE al tipo de negocio:
           - **Comida/Restaurantes**: "¿Te gustaría ver el menú?"
           - **Gimnasios/Escuelas/Servicios**: "¿Te gustaría conocer sus planes o servicios?"
           - **Tiendas/Productos**: "¿Te gustaría ver su catálogo de productos?"
           - **Salud/Consultorios**: "¿Te gustaría saber sus horarios o costos?"
           - *Nota*: Usa tu sentido común basado en la categoría del negocio para elegir la pregunta correcta. NO preguntes por "menú" a un gimnasio.

      4. **Personalidad**:
         - Sé amable y servicial, pero **extremadamente preciso** con los datos.
    `;

    // Construct the full message chain for OpenAI
    const openAIMessages = [
      { role: 'system', content: systemPrompt },
      ...messages, // Append the full conversation history
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Upgraded to GPT-4o-mini for better reasoning
        messages: openAIMessages,
        temperature: 0.1, // Low temperature for factual accuracy
        max_tokens: 400,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.choices[0].message;
  } catch (error: any) {
    console.error('Error calling OpenAI:', error);

    if (error.message && error.message.includes('quota')) {
      return {
        role: 'assistant',
        content:
          '⚠️ **Error de Cuota**: Se ha excedido el límite de la API Key. Por favor verifica tu plan en OpenAI.',
      };
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error processing your request',
    });
  }
});
