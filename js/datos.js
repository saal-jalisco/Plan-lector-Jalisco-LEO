/* ============================================================
   TERMÓMETRO LECTOR · JALISCO LEO
   datos.js — Datos precargados de Jalisco Avanza 2025
   ============================================================ */

const DATOS = {

    /* ========================================================
       METADATOS
       ======================================================== */
    meta: {
        proyecto: 'Plan Lector Jalisco LEO',
        modulo: 'Termómetro Lector',
        fuente: 'Jalisco Avanza 2025',
        version: '3.0',
        fechaActualizacion: '2026-09-17'
    },

    /* ========================================================
       1. LÍNEA BASE · LECTURA · PRIMARIA
       Media global, niveles de logro por grado
       ======================================================== */
    lineaBase: {
        primaria: {
            '2': {
                grado: '2°',
                media: 67.8,
                deseable: 40.8,
                enProgreso: 52.3,
                atencionPrioritaria: 6.9,
                alumnosEvaluados: 129268,
                escuelasParticipantes: 4994
            },
            '3': {
                grado: '3°',
                media: 59.3,
                deseable: 26.3,
                enProgreso: 67.5,
                atencionPrioritaria: 6.2,
                alumnosEvaluados: 131413,
                escuelasParticipantes: 4967
            },
            '4': {
                grado: '4°',
                media: 44.5,
                deseable: 5.2,
                enProgreso: 76.9,
                atencionPrioritaria: 17.9,
                alumnosEvaluados: 134147,
                escuelasParticipantes: 4994
            },
            '5': {
                grado: '5°',
                media: 47.8,
                deseable: 8.9,
                enProgreso: 79.5,
                atencionPrioritaria: 11.6,
                alumnosEvaluados: 134924,
                escuelasParticipantes: 4994
            },
            '6': {
                grado: '6°',
                media: 45.4,
                deseable: 11.2,
                enProgreso: 69.6,
                atencionPrioritaria: 19.2,
                alumnosEvaluados: 137607,
                escuelasParticipantes: 5014
            }
        },
        secundaria: {
            '1': {
                grado: '1°',
                media: 49.3,
                deseable: 10.2,
                enProgreso: 77.4,
                atencionPrioritaria: 12.4,
                alumnosEvaluados: 130720,
                escuelasParticipantes: 1845
            },
            '2': {
                grado: '2°',
                media: 51.1,
                deseable: 9.2,
                enProgreso: 81.3,
                atencionPrioritaria: 9.5,
                alumnosEvaluados: 126225,
                escuelasParticipantes: 1836
            },
            '3': {
                grado: '3°',
                media: 49.5,
                deseable: 8.7,
                enProgreso: 79.9,
                atencionPrioritaria: 11.4,
                alumnosEvaluados: 116517,
                escuelasParticipantes: 1836
            }
        }
    },

    /* ========================================================
       2. UNIDADES DE ANÁLISIS (UA) DE LECTURA
       Porcentaje de aciertos Jalisco por grado
       ======================================================== */
    unidadesAnalisis: {
        primaria: {
            '2': {
                'UA1': { nombre: 'Analizar la estructura de los textos', porcentaje: 70.4 },
                'UA2': { nombre: 'Integrar información y realizar inferencias', porcentaje: 68.4 },
                'UA3': { nombre: 'Localizar y extraer información', porcentaje: 64.7 },
                'UA4': { nombre: 'Fluidez Lectora', porcentaje: 65.4 }
            },
            '3': {
                'UA1': { nombre: 'Analizar la estructura de los textos', porcentaje: 59.5 },
                'UA2': { nombre: 'Integrar información y realizar inferencias', porcentaje: 61.4 },
                'UA3': { nombre: 'Localizar y extraer información', porcentaje: 57.1 },
                'UA4': { nombre: 'Fluidez Lectora', porcentaje: null }
            },
            '4': {
                'UA1': { nombre: 'Analizar la estructura de los textos', porcentaje: 35.6 },
                'UA2': { nombre: 'Integrar información y realizar inferencias', porcentaje: 48.4 },
                'UA3': { nombre: 'Localizar y extraer información', porcentaje: 49.9 },
                'UA4': { nombre: 'Fluidez Lectora', porcentaje: null }
            },
            '5': {
                'UA1': { nombre: 'Analizar la estructura de los textos', porcentaje: 50.2 },
                'UA2': { nombre: 'Integrar información y realizar inferencias', porcentaje: 43.9 },
                'UA3': { nombre: 'Localizar y extraer información', porcentaje: 49.6 },
                'UA4': { nombre: 'Fluidez Lectora', porcentaje: null }
            },
            '6': {
                'UA1': { nombre: 'Analizar la estructura de los textos', porcentaje: 45.1 },
                'UA2': { nombre: 'Integrar información y realizar inferencias', porcentaje: 44.9 },
                'UA3': { nombre: 'Localizar y extraer información', porcentaje: 47.9 },
                'UA4': { nombre: 'Fluidez Lectora', porcentaje: null }
            }
        },
        secundaria: {
            '1': {
                'UA1': { nombre: 'Analizar la estructura de los textos', porcentaje: 44.8 },
                'UA2': { nombre: 'Integrar información y realizar inferencias', porcentaje: 49.7 },
                'UA3': { nombre: 'Localizar y extraer información', porcentaje: 56.0 }
            },
            '2': {
                'UA1': { nombre: 'Analizar la estructura de los textos', porcentaje: 50.3 },
                'UA2': { nombre: 'Integrar información y realizar inferencias', porcentaje: 51.7 },
                'UA3': { nombre: 'Localizar y extraer información', porcentaje: 51.7 }
            },
            '3': {
                'UA1': { nombre: 'Analizar la estructura de los textos', porcentaje: 47.9 },
                'UA2': { nombre: 'Integrar información y realizar inferencias', porcentaje: 49.8 },
                'UA3': { nombre: 'Localizar y extraer información', porcentaje: 51.9 }
            }
        }
    },

    /* ========================================================
       3. MATEMÁTICAS · REFERENCIA ESTATAL (por si se necesita)
       ======================================================== */
    matematicas: {
        primaria: {
            '2': { media: 59.5, deseable: 26.0, enProgreso: 63.3, atencionPrioritaria: 10.7 },
            '3': { media: 59.4, deseable: 24.8, enProgreso: 69.6, atencionPrioritaria: 5.6 },
            '4': { media: 47.8, deseable: 11.8, enProgreso: 73.4, atencionPrioritaria: 14.8 },
            '5': { media: 39.3, deseable: 4.7, enProgreso: 72.8, atencionPrioritaria: 22.5 },
            '6': { media: 44.7, deseable: 9.8, enProgreso: 72.0, atencionPrioritaria: 18.2 }
        },
        secundaria: {
            '1': { media: 44.1, deseable: 8.8, enProgreso: 73.3, atencionPrioritaria: 17.9 },
            '2': { media: 42.7, deseable: 7.0, enProgreso: 77.4, atencionPrioritaria: 15.6 },
            '3': { media: 43.8, deseable: 5.7, enProgreso: 81.9, atencionPrioritaria: 12.4 }
        }
    },

    /* ========================================================
       4. FORMACIÓN CÍVICA Y ÉTICA · REFERENCIA ESTATAL
       ======================================================== */
    formacionCivica: {
        primaria: {
            '2': { media: 33.0, deseable: 33.0, enProgreso: 53.4, atencionPrioritaria: 13.7 },
            '3': { media: 32.3, deseable: 32.3, enProgreso: 57.2, atencionPrioritaria: 10.5 },
            '4': { media: 30.8, deseable: 30.8, enProgreso: 53.5, atencionPrioritaria: 15.7 },
            '5': { media: 22.3, deseable: 22.3, enProgreso: 64.5, atencionPrioritaria: 13.2 },
            '6': { media: 17.7, deseable: 17.7, enProgreso: 56.6, atencionPrioritaria: 25.7 }
        },
        secundaria: {
            '1': { media: 23.4, deseable: 23.4, enProgreso: 67.8, atencionPrioritaria: 8.7 },
            '2': { media: 8.9, deseable: 8.9, enProgreso: 76.4, atencionPrioritaria: 14.7 },
            '3': { media: 14.3, deseable: 14.3, enProgreso: 73.2, atencionPrioritaria: 12.5 }
        }
    },

    /* ========================================================
       5. COMPONENTES SAAL
       ======================================================== */
    componentesSAAL: {
        todos: [
            { id: 'fluidez', nombre: 'Fluidez', descripcion: 'Ritmo, velocidad y respeto a los signos de puntuación.' },
            { id: 'precision', nombre: 'Precisión', descripcion: 'Correcta lectura de las palabras. Porcentaje de errores.' },
            { id: 'palabrasComplejas', nombre: 'Atención a palabras complejas', descripcion: 'Estrategias ante palabras desconocidas o difíciles.' },
            { id: 'usoVoz', nombre: 'Uso de la voz', descripcion: 'Entonación, volumen y dicción.' },
            { id: 'seguridad', nombre: 'Seguridad y disposición', descripcion: 'Confianza, actitud y disfrute de la lectura.' },
            { id: 'comprension', nombre: 'Comprensión lectora', descripcion: 'Identificación de ideas, detalles e inferencias.' }
        ],
        // 1° y 2° primaria solo evalúan Fluidez y Comprensión
        primeroSegundoPrimaria: ['fluidez', 'comprension']
    },

    /* ========================================================
       6. ALINEACIÓN SAAL ↔ JALISCO AVANZA ↔ RUTAS LEO
       ======================================================== */
    alineacion: [
        {
            componenteSAAL: 'Fluidez',
            componenteId: 'fluidez',
            uaJaliscoAvanza: 'UA 4 · Fluidez Lectora',
            rutaLEO: 'Ruta 1 · LEO para comprender',
            rutaId: 'ruta1'
        },
        {
            componenteSAAL: 'Comprensión',
            componenteId: 'comprension',
            uaJaliscoAvanza: 'UA 2 · Integrar info. e inferencias',
            rutaLEO: 'Ruta 1 · LEO para comprender',
            rutaId: 'ruta1'
        },
        {
            componenteSAAL: 'Precisión',
            componenteId: 'precision',
            uaJaliscoAvanza: 'UA 3 · Localizar y extraer info.',
            rutaLEO: 'Ruta 1 · LEO para comprender',
            rutaId: 'ruta1'
        },
        {
            componenteSAAL: 'Atención a palabras complejas',
            componenteId: 'palabrasComplejas',
            uaJaliscoAvanza: 'UA 3 · Localizar y extraer info.',
            rutaLEO: 'Ruta 1 · LEO para comprender',
            rutaId: 'ruta1'
        },
        {
            componenteSAAL: 'Uso de la voz',
            componenteId: 'usoVoz',
            uaJaliscoAvanza: '(Sin equivalente directo)',
            rutaLEO: 'Ruta 2 · LEO para imaginar',
            rutaId: 'ruta2'
        },
        {
            componenteSAAL: 'Seguridad y disposición',
            componenteId: 'seguridad',
            uaJaliscoAvanza: '(Sin equivalente directo)',
            rutaLEO: 'Ruta 2 · LEO para imaginar',
            rutaId: 'ruta2'
        }
    ],

    /* ========================================================
       7. LAS 5 RUTAS LEO
       ======================================================== */
    rutasLEO: {
        ruta1: {
            id: 'ruta1',
            numero: 1,
            nombre: 'LEO para comprender',
            lema: 'LEO para tender puentes entre lo que dice el texto y lo que ya sabemos.',
            necesidad: 'Bajos resultados en comprensión lectora. Las y los estudiantes pueden decodificar, pero no siempre construyen significado, no infieren, no relacionan el texto con su experiencia.',
            etapas: ['Etapa 3 (6-8 años)', 'Etapa 4 (9-11 años) · principal', 'Etapa 5 (12-14 años)'],
            virtudes: ['Pensamiento reflexivo', 'Paciencia', 'Laboriosidad', 'Claridad'],
            actividadesEsenciales: [
                { nombre: 'Lectura en voz alta diaria', nivel: 'Primaria baja y alta', frecuencia: 'Diaria' },
                { nombre: 'Adivina qué sigue', nivel: 'Preescolar y Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Círculo de lectura semanal', nivel: 'Primaria alta y Secundaria', frecuencia: 'Semanal' }
            ],
            indicadores: {
                cuanti: 'Porcentaje de estudiantes que mejoran su nivel de comprensión lectora en Jalisco Avanza (meta: reducir 10% anual en nivel "En desarrollo").',
                cuali: 'Predicen, verifican, identifican ideas principales, infieren, relacionan, formulan preguntas.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el primer trimestre.'
        },
        ruta2: {
            id: 'ruta2',
            numero: 2,
            nombre: 'LEO para imaginar',
            lema: 'LEO para abrir la puerta a mundos que aún no existen.',
            necesidad: 'Falta de motivación hacia la lectura. Muchas y muchos estudiantes asocian la lectura con obligación, evaluación y tarea, no con placer, descubrimiento ni juego.',
            etapas: ['Etapa 1 (0-2 años)', 'Etapa 2 (3-5 años)', 'Etapa 3 (6-8 años)', 'Etapa 4 (9-11 años) · principal', 'Etapa 5 (12-14 años)'],
            virtudes: ['Curiosidad', 'Creatividad', 'Atención', 'Apego seguro'],
            actividadesEsenciales: [
                { nombre: 'Lectura en voz alta diaria', nivel: 'Primaria baja y alta', frecuencia: 'Diaria' },
                { nombre: 'Cita a ciegas con un libro', nivel: 'Primaria alta y Secundaria', frecuencia: 'Mensual' },
                { nombre: 'Cuentos con títeres', nivel: 'Preescolar y Primaria baja', frecuencia: 'Quincenal' }
            ],
            indicadores: {
                cuanti: 'Aumento en la frecuencia de lectura por placer (encuesta a estudiantes y familias).',
                cuali: 'Eligen libros por iniciativa propia, comparten lo que leen, imaginan finales alternativos, disfrutan de la lectura en voz alta, recomiendan libros.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el primer y segundo trimestre.'
        },
        ruta3: {
            id: 'ruta3',
            numero: 3,
            nombre: 'LEO para argumentar',
            lema: 'LEO para aprender a decir lo que pensamos, con razones y con respeto.',
            necesidad: 'Dificultad para expresar opiniones fundamentadas. Las y los estudiantes opinan, pero no siempre argumentan; confunden opinión con hecho; no citan evidencias.',
            etapas: ['Etapa 4 (9-11 años)', 'Etapa 5 (12-14 años) · principal', 'Etapa 6 (15-17 años)'],
            virtudes: ['Juicio', 'Veracidad', 'Civilidad', 'Pensamiento crítico'],
            actividadesEsenciales: [
                { nombre: 'Noticias del mundo', nivel: 'Primaria alta', frecuencia: 'Semanal' },
                { nombre: 'Debate de posturas', nivel: 'Primaria alta y Secundaria', frecuencia: 'Quincenal' },
                { nombre: 'Lectura para debate', nivel: 'Secundaria', frecuencia: 'Semanal' }
            ],
            indicadores: {
                cuanti: 'Porcentaje de estudiantes que mejoran su nivel de pensamiento crítico en Jalisco Avanza (meta: reducir 10% anual en nivel "En desarrollo").',
                cuali: 'Distinguen hechos de opiniones, citan evidencias, escuchan posturas distintas con respeto, formulan preguntas críticas, argumentan oralmente y por escrito.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el segundo y tercer trimestre.'
        },
        ruta4: {
            id: 'ruta4',
            numero: 4,
            nombre: 'LEO para crear',
            lema: 'LEO para sembrar palabras y cosechar mundos.',
            necesidad: 'Poca producción escrita creativa. Las y los estudiantes leen, pero no siempre escriben; cuando escriben, lo hacen por obligación, sin disfrute, sin voz propia.',
            etapas: ['Etapa 2 (3-5 años)', 'Etapa 3 (6-8 años)', 'Etapa 4 (9-11 años) · principal', 'Etapa 5 (12-14 años)', 'Etapa 6 (15-17 años)'],
            virtudes: ['Creatividad', 'Honestidad', 'Perseverancia', 'Claridad'],
            actividadesEsenciales: [
                { nombre: 'Juegos de escritura creativa', nivel: 'Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Club de escritores', nivel: 'Primaria alta', frecuencia: 'Semanal' },
                { nombre: 'Escritura de microrrelatos', nivel: 'Primaria alta y Secundaria', frecuencia: 'Quincenal' }
            ],
            indicadores: {
                cuanti: 'Porcentaje de estudiantes que producen textos propios de manera regular (portafolio de escritura).',
                cuali: 'Escriben por iniciativa propia, comparten sus textos, revisan y mejoran, experimentan con géneros y formatos, encuentran su propia voz.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el segundo y tercer trimestre.'
        },
        ruta5: {
            id: 'ruta5',
            numero: 5,
            nombre: 'LEO en comunidad',
            lema: 'LEO para tejer la red que nos sostiene.',
            necesidad: 'Poca participación de las familias y la comunidad en la formación lectora. La lectura se concibe como una actividad solitaria, escolar, individual.',
            etapas: ['Etapa 1 (0-2 años)', 'Etapa 2 (3-5 años)', 'Etapa 3 (6-8 años)', 'Etapa 4 (9-11 años) · principal', 'Etapa 5 (12-14 años)', 'Etapa 6 (15-17 años)'],
            virtudes: ['Vínculo', 'Empatía', 'Generosidad', 'Comunidad'],
            actividadesEsenciales: [
                { nombre: 'Lector invitado', nivel: 'Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Lectura compartida en parejas', nivel: 'Preescolar', frecuencia: 'Semanal' },
                { nombre: 'Círculo de lectores docentes', nivel: 'Docentes', frecuencia: 'Trimestral' }
            ],
            indicadores: {
                cuanti: 'Porcentaje de familias que reportan leer con sus hijos al menos tres veces por semana (meta: incrementar en 20 puntos porcentuales respecto a la línea base).',
                cuali: 'Las familias participan, los estudiantes comparten lo que leen, la comunidad se involucra, los estudiantes recomiendan libros, la escuela se convierte en espacio de encuentro.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el primer y tercer trimestre.'
        }
    },

    /* ========================================================
       8. MOTOR DE RECOMENDACIÓN · REGLAS DE CRUCE
       ======================================================== */
    motorRecomendacion: {
        // Dimensiones gatillo por ruta (🔴 o 🟡)
        reglas: [
            {
                rutaId: 'ruta1',
                dimensionesGatillo: ['comprension', 'fluidez', 'precision', 'palabrasComplejas'],
                peso: 'alto'
            },
            {
                rutaId: 'ruta2',
                dimensionesGatillo: ['gusto', 'frecuencia', 'diversidad', 'usoVoz'],
                peso: 'medio'
            },
            {
                rutaId: 'ruta3',
                dimensionesGatillo: ['obstaculos', 'tiempoAula', 'participacionFamiliar'],
                peso: 'medio'
            },
            {
                rutaId: 'ruta4',
                dimensionesGatillo: ['materiales', 'biblioteca', 'librosCasa'],
                peso: 'medio'
            },
            {
                rutaId: 'ruta5',
                dimensionesGatillo: ['lecturaCompartida', 'lecturaFamilia', 'participacionFamiliar', 'espacios'],
                peso: 'alto'
            }
        ],
        // Regla de prioridad
        prioridad: {
            alta: { minRojos: 3, etiqueta: 'ALTA' },
            media: { minRojos: 2, etiqueta: 'MEDIA' },
            baja: { minRojos: 0, etiqueta: 'BAJA' }
        }
    },

    /* ========================================================
       9. LAS 18 DIMENSIONES DEL TERMÓMETRO
       ======================================================== */
    dimensiones: [
        { id: 'comprension', numero: 1, nombre: 'Comprensión lectora', fuente: 'SAAL / Jalisco Avanza', grupo: 'SAAL' },
        { id: 'fluidez', numero: 2, nombre: 'Fluidez lectora', fuente: 'SAAL / Jalisco Avanza', grupo: 'SAAL' },
        { id: 'precision', numero: 3, nombre: 'Precisión', fuente: 'SAAL', grupo: 'SAAL' },
        { id: 'usoVoz', numero: 4, nombre: 'Uso de la voz', fuente: 'SAAL', grupo: 'SAAL' },
        { id: 'seguridad', numero: 5, nombre: 'Seguridad y disposición', fuente: 'SAAL', grupo: 'SAAL' },
        { id: 'palabrasComplejas', numero: 6, nombre: 'Atención a palabras complejas', fuente: 'SAAL', grupo: 'SAAL' },
        { id: 'gusto', numero: 7, nombre: 'Gusto por la lectura', fuente: 'Voces estudiantes', grupo: 'Voces' },
        { id: 'frecuencia', numero: 8, nombre: 'Frecuencia de lectura', fuente: 'Voces estudiantes', grupo: 'Voces' },
        { id: 'diversidad', numero: 9, nombre: 'Diversidad de textos', fuente: 'Voces estudiantes', grupo: 'Voces' },
        { id: 'espacios', numero: 10, nombre: 'Espacios de lectura', fuente: 'Voces estudiantes', grupo: 'Voces' },
        { id: 'lecturaCompartida', numero: 11, nombre: 'Lectura compartida', fuente: 'Voces estudiantes', grupo: 'Voces' },
        { id: 'lecturaFamilia', numero: 12, nombre: 'Lectura en familia', fuente: 'Voces familias', grupo: 'Voces' },
        { id: 'librosCasa', numero: 13, nombre: 'Libros en casa', fuente: 'Voces familias', grupo: 'Voces' },
        { id: 'participacionFamiliar', numero: 14, nombre: 'Participación familiar', fuente: 'Voces familias', grupo: 'Voces' },
        { id: 'biblioteca', numero: 15, nombre: 'Uso de biblioteca', fuente: 'Voces docentes', grupo: 'Voces' },
        { id: 'tiempoAula', numero: 16, nombre: 'Tiempo en aula', fuente: 'Voces docentes', grupo: 'Voces' },
        { id: 'materiales', numero: 17, nombre: 'Materiales disponibles', fuente: 'Voces docentes', grupo: 'Voces' },
        { id: 'obstaculos', numero: 18, nombre: 'Obstáculos', fuente: 'Voces docentes', grupo: 'Voces' }
    ],

    /* ========================================================
       10. PREGUNTAS DE VOCES DEL ECOSISTEMA
       ======================================================== */
    voces: {
        estudiantes: [
            {
                id: 'p1',
                pregunta: '¿A la mayoría de los estudiantes les gusta leer?',
                opciones: ['Mucho', 'Algo', 'Poco', 'Nada'],
                dimension: 'gusto'
            },
            {
                id: 'p2',
                pregunta: '¿Con qué frecuencia leen por gusto?',
                opciones: ['Diario', 'Semanal', 'Mensual', 'Casi nunca'],
                dimension: 'frecuencia'
            },
            {
                id: 'p3',
                pregunta: '¿Qué tipos de texto prefieren?',
                opciones: ['Cuentos', 'Cómics', 'Poemas', 'Noticias', 'Libros informativos', 'Revistas', 'Otros'],
                dimension: 'diversidad',
                multiple: true
            },
            {
                id: 'p4',
                pregunta: '¿Dónde leen con más frecuencia?',
                opciones: ['Aula', 'Casa', 'Biblioteca', 'Patio', 'Espacios comunitarios', 'Otros'],
                dimension: 'espacios',
                multiple: true
            },
            {
                id: 'p5',
                pregunta: '¿Con quién comparten lo que leen?',
                opciones: ['Solos', 'Compañeros', 'Docentes', 'Familia', 'Amigos', 'Otros'],
                dimension: 'lecturaCompartida',
                multiple: true
            }
        ],
        familias: [
            {
                id: 'p6',
                pregunta: '¿Con qué frecuencia leen las familias con sus hijos?',
                opciones: ['Diario', 'Semanal', 'Mensual', 'Casi nunca'],
                dimension: 'lecturaFamilia'
            },
            {
                id: 'p7',
                pregunta: '¿Cuántos libros hay en casa, en promedio?',
                opciones: ['0-5', '6-15', '16-30', 'Más de 30'],
                dimension: 'librosCasa'
            },
            {
                id: 'p8',
                pregunta: '¿Las familias participan en actividades de lectura?',
                opciones: ['Mucho', 'Algo', 'Poco', 'Nada'],
                dimension: 'participacionFamiliar'
            },
            {
                id: 'p9',
                pregunta: '¿Qué tipos de texto leen las familias?',
                opciones: ['Cuentos', 'Noticias', 'Revistas', 'Libros', 'Textos escolares', 'Redes sociales', 'Otros'],
                dimension: 'diversidad',
                multiple: true
            }
        ],
        docentes: [
            {
                id: 'p10',
                pregunta: '¿Los docentes usan la biblioteca escolar?',
                opciones: ['Mucho', 'Algo', 'Poco', 'Nada'],
                dimension: 'biblioteca'
            },
            {
                id: 'p11',
                pregunta: '¿Cuánto tiempo semanal dedican a lectura en el aula?',
                opciones: ['Menos de 30 min', '30-60 min', '1-2 horas', 'Más de 2 horas'],
                dimension: 'tiempoAula'
            },
            {
                id: 'p12',
                pregunta: '¿Qué materiales de lectura tienen disponibles?',
                opciones: ['Libros de texto', 'Libros de biblioteca', 'Cuentos', 'Revistas', 'Periódicos', 'Material digital', 'Materiales propios', 'Otros'],
                dimension: 'materiales',
                multiple: true
            },
            {
                id: 'p13',
                pregunta: '¿Qué obstáculos enfrentan para fomentar la lectura?',
                opciones: ['Falta de materiales', 'Falta de tiempo', 'Falta de espacio', 'Poco interés de estudiantes', 'Poca participación de familias', 'Otros'],
                dimension: 'obstaculos',
                multiple: true
            }
        ]
    },

    /* ========================================================
       11. OPCIONES DE IDENTIFICACIÓN
       ======================================================== */
    identificacion: {
        regiones: [
            'Región 01 · Norte',
            'Región 02 · Altos Norte',
            'Región 03 · Altos Sur',
            'Región 04 · Ciénega',
            'Región 05 · Sureste',
            'Región 06 · Sur',
            'Región 07 · Sierra de Amula',
            'Región 08 · Costa Sur',
            'Región 09 · Costa Norte',
            'Región 10 · Sierra Occidental',
            'Región 11 · Valles',
            'Región 12 · Centro'
        ],
        turnos: ['Matutino', 'Vespertino', 'Nocturno', 'Mixto', 'Discontinuo'],
        niveles: ['Primaria', 'Secundaria'],
        gradosPrimaria: ['1°', '2°', '3°', '4°', '5°', '6°'],
        gradosSecundaria: ['1°', '2°', '3°'],
        modosLlenado: [
            { id: 'individual', nombre: 'Individual', descripcion: 'Director(a) / ATP llena antes o durante CTE.' },
            { id: 'colectivo', nombre: 'Colectivo', descripcion: 'Se llena colaborativamente durante CTE.' }
        ]
    },

    /* ========================================================
       12. TEXTOS DE APOYO
       ======================================================== */
    textosApoyo: {
        observacionesLineaBase: [
            'Contexto socioeconómico',
            'Acceso a materiales',
            'Condiciones de la escuela',
            'Características del grupo',
            'Prácticas docentes previas',
            'Participación de las familias',
            'Situaciones extraordinarias'
        ],
        mensajeVocesOmitidas: 'Esta sección es omitible, pero te recomendamos llenarla ahora o en la siguiente ocasión para tener un diagnóstico más completo del ecosistema lector.',
        alertaMasDe5Rojos: 'Hay más de 5 dimensiones en 🔴 Atención prioritaria. Te recomendamos enfocar los esfuerzos en las más críticas.',
        alertaMasDe3Rutas: 'Han seleccionado más de 3 rutas para un trimestre. Consideren priorizar para no dispersar los esfuerzos.'
    }
};

// ============================================================
// EXPORTAR (para uso en otros módulos)
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DATOS;
}