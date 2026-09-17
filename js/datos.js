/* ============================================================
   PLAN LECTOR JALISCO LEO
   datos.js — Datos precargados
   ============================================================ */

const DATOS = {

    /* ========================================================
       METADATOS
       ======================================================== */
    meta: {
        proyecto: 'Plan Lector Jalisco LEO',
        modulo: 'Plan Lector',
        fuente: 'Jalisco Avanza 2025 · Jalisco LEO',
        version: '4.0',
        fechaActualizacion: '2026-09-17'
    },

    /* ========================================================
       1. NIVELES EDUCATIVOS (6 niveles)
       ======================================================== */
    niveles: [
        {
            id: 'inicial',
            nombre: 'Inicial',
            rango: '0-2 años',
            grados: ['Maternal 1', 'Maternal 2', 'Maternal 3'],
            descripcion: 'Educación inicial, primera infancia.'
        },
        {
            id: 'preescolar',
            nombre: 'Preescolar',
            rango: '3-5 años',
            grados: ['1° Preescolar', '2° Preescolar', '3° Preescolar'],
            descripcion: 'Educación preescolar.'
        },
        {
            id: 'primaria-baja',
            nombre: 'Primaria Baja',
            rango: '6-8 años',
            grados: ['1°', '2°', '3°'],
            descripcion: 'Primaria, primeros tres grados.'
        },
        {
            id: 'primaria-alta',
            nombre: 'Primaria Alta',
            rango: '9-11 años',
            grados: ['4°', '5°', '6°'],
            descripcion: 'Primaria, últimos tres grados.'
        },
        {
            id: 'secundaria',
            nombre: 'Secundaria',
            rango: '12-14 años',
            grados: ['1°', '2°', '3°'],
            descripcion: 'Educación secundaria.'
        },
        {
            id: 'bachillerato',
            nombre: 'Bachillerato',
            rango: '15-17 años',
            grados: ['1°', '2°', '3°'],
            descripcion: 'Educación media superior.'
        }
    ],

    /* ========================================================
       2. REGLAS DE FILTRADO POR NIVEL EDUCATIVO
       ======================================================== */
    reglasFiltradoNivel: {
        'inicial': {
            rutasSugeridas: ['ruta2', 'ruta5'],
            rutasOpcionales: [],
            minimoRutas: 2,
            maximoRutas: 3,
            nota: 'Para Inicial, se priorizan las rutas de imaginación y comunidad.'
        },
        'preescolar': {
            rutasSugeridas: ['ruta1', 'ruta2', 'ruta5'],
            rutasOpcionales: ['ruta4'],
            minimoRutas: 2,
            maximoRutas: 4,
            nota: 'Para Preescolar, se priorizan las rutas de comprensión, imaginación y comunidad.'
        },
        'primaria-baja': {
            rutasSugeridas: ['ruta1', 'ruta2', 'ruta4', 'ruta5'],
            rutasOpcionales: ['ruta3'],
            minimoRutas: 2,
            maximoRutas: 5,
            nota: 'Para Primaria Baja, se priorizan las rutas de comprensión, imaginación, creación y comunidad.'
        },
        'primaria-alta': {
            rutasSugeridas: ['ruta1', 'ruta3', 'ruta4', 'ruta5'],
            rutasOpcionales: ['ruta2'],
            minimoRutas: 2,
            maximoRutas: 5,
            nota: 'Para Primaria Alta, se priorizan las rutas de comprensión, argumentación, creación y comunidad.'
        },
        'secundaria': {
            rutasSugeridas: ['ruta1', 'ruta3', 'ruta4'],
            rutasOpcionales: ['ruta2', 'ruta5'],
            minimoRutas: 2,
            maximoRutas: 5,
            nota: 'Para Secundaria, se priorizan las rutas de comprensión, argumentación y creación.'
        },
        'bachillerato': {
            rutasSugeridas: ['ruta3', 'ruta4'],
            rutasOpcionales: ['ruta1', 'ruta2', 'ruta5'],
            minimoRutas: 2,
            maximoRutas: 5,
            nota: 'Para Bachillerato, se priorizan las rutas de argumentación y creación.'
        }
    },

    /* ========================================================
       3. LÍNEA BASE · LECTURA · PRIMARIA
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
       4. UNIDADES DE ANÁLISIS (UA) DE LECTURA
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
       7. LAS 5 RUTAS LEO (con niveles para filtrado)
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
            niveles: ['preescolar', 'primaria-baja', 'primaria-alta', 'secundaria'],
            actividadesEsenciales: [
                { nombre: 'Lectura en voz alta diaria', nivel: 'Primaria baja y alta', frecuencia: 'Diaria' },
                { nombre: 'Adivina qué sigue', nivel: 'Preescolar y Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Círculo de lectura semanal', nivel: 'Primaria alta y Secundaria', frecuencia: 'Semanal' }
            ],
            actividadesOpcionales: [
                { nombre: 'Lectura de imágenes y predicción', nivel: 'Primaria alta', frecuencia: 'Semanal' },
                { nombre: 'El semáforo de la lectura', nivel: 'Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Fichero de palabras nuevas', nivel: 'Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Reseña en 100 palabras', nivel: 'Primaria alta', frecuencia: 'Quincenal' },
                { nombre: 'Lectura para debate', nivel: 'Secundaria', frecuencia: 'Semanal' }
            ],
            indicadores: {
                cuanti: 'Porcentaje de estudiantes que mejoran su nivel de comprensión lectora en Jalisco Avanza (meta: reducir 10% anual en nivel "En desarrollo").',
                cuali: 'Predicen, verifican, identifican ideas principales, infieren, relacionan, formulan preguntas.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el primer trimestre.',
            conexionVagones: 'Narrativa, texto informativo, texto argumentativo, poesía, texto multimodal.',
            conexionFamilia: 'Lectura compartida en casa, el libro viajero, carta para familias con preguntas guía.'
        },
        ruta2: {
            id: 'ruta2',
            numero: 2,
            nombre: 'LEO para imaginar',
            lema: 'LEO para abrir la puerta a mundos que aún no existen.',
            necesidad: 'Falta de motivación hacia la lectura. Muchas y muchos estudiantes asocian la lectura con obligación, evaluación y tarea, no con placer, descubrimiento ni juego.',
            etapas: ['Etapa 1 (0-2 años)', 'Etapa 2 (3-5 años)', 'Etapa 3 (6-8 años)', 'Etapa 4 (9-11 años) · principal', 'Etapa 5 (12-14 años)'],
            virtudes: ['Curiosidad', 'Creatividad', 'Atención', 'Apego seguro'],
            niveles: ['inicial', 'preescolar', 'primaria-baja', 'primaria-alta', 'secundaria'],
            actividadesEsenciales: [
                { nombre: 'Lectura en voz alta diaria', nivel: 'Primaria baja y alta', frecuencia: 'Diaria' },
                { nombre: 'Cita a ciegas con un libro', nivel: 'Primaria alta y Secundaria', frecuencia: 'Mensual' },
                { nombre: 'Cuentos con títeres', nivel: 'Preescolar y Primaria baja', frecuencia: 'Quincenal' }
            ],
            actividadesOpcionales: [
                { nombre: 'La bolsa misteriosa', nivel: 'Preescolar', frecuencia: 'Semanal' },
                { nombre: 'Palabras que vuelan', nivel: 'Preescolar', frecuencia: 'Semanal' },
                { nombre: 'Historias con tres imágenes', nivel: 'Preescolar', frecuencia: 'Semanal' },
                { nombre: 'La ruleta de los cuentos', nivel: 'Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Mapa de mi historia', nivel: 'Primaria alta', frecuencia: 'Mensual' }
            ],
            indicadores: {
                cuanti: 'Aumento en la frecuencia de lectura por placer (encuesta a estudiantes y familias).',
                cuali: 'Eligen libros por iniciativa propia, comparten lo que leen, imaginan finales alternativos, disfrutan de la lectura en voz alta, recomiendan libros.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el primer y segundo trimestre.',
            conexionVagones: 'Narrativa, poesía, texto multimodal, texto oral.',
            conexionFamilia: 'Cuentos en familia, el libro viajero, fiesta de cuentos, carta para familias con actividades lúdicas.'
        },
        ruta3: {
            id: 'ruta3',
            numero: 3,
            nombre: 'LEO para argumentar',
            lema: 'LEO para aprender a decir lo que pensamos, con razones y con respeto.',
            necesidad: 'Dificultad para expresar opiniones fundamentadas. Las y los estudiantes opinan, pero no siempre argumentan; confunden opinión con hecho; no citan evidencias.',
            etapas: ['Etapa 4 (9-11 años)', 'Etapa 5 (12-14 años) · principal', 'Etapa 6 (15-17 años)'],
            virtudes: ['Juicio', 'Veracidad', 'Civilidad', 'Pensamiento crítico'],
            niveles: ['primaria-alta', 'secundaria', 'bachillerato'],
            actividadesEsenciales: [
                { nombre: 'Noticias del mundo', nivel: 'Primaria alta', frecuencia: 'Semanal' },
                { nombre: 'Debate de posturas', nivel: 'Primaria alta y Secundaria', frecuencia: 'Quincenal' },
                { nombre: 'Lectura para debate', nivel: 'Secundaria', frecuencia: 'Semanal' }
            ],
            actividadesOpcionales: [
                { nombre: 'El debate del libro', nivel: 'Primaria alta', frecuencia: 'Quincenal' },
                { nombre: 'Tertulia literaria', nivel: 'Primaria alta y Secundaria', frecuencia: 'Mensual' },
                { nombre: 'Debate de citas', nivel: 'Secundaria', frecuencia: 'Quincenal' },
                { nombre: 'Ensayo de 500 palabras', nivel: 'Secundaria', frecuencia: 'Mensual' },
                { nombre: 'Juicio a un personaje', nivel: 'Secundaria', frecuencia: 'Trimestral' }
            ],
            indicadores: {
                cuanti: 'Porcentaje de estudiantes que mejoran su nivel de pensamiento crítico en Jalisco Avanza (meta: reducir 10% anual en nivel "En desarrollo").',
                cuali: 'Distinguen hechos de opiniones, citan evidencias, escuchan posturas distintas con respeto, formulan preguntas críticas, argumentan oralmente y por escrito.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el segundo y tercer trimestre.',
            conexionVagones: 'Texto argumentativo, texto informativo, narrativa, texto multimodal.',
            conexionFamilia: 'Debate en casa, carta para familias con preguntas para argumentar, noticias en familia.'
        },
        ruta4: {
            id: 'ruta4',
            numero: 4,
            nombre: 'LEO para crear',
            lema: 'LEO para sembrar palabras y cosechar mundos.',
            necesidad: 'Poca producción escrita creativa. Las y los estudiantes leen, pero no siempre escriben; cuando escriben, lo hacen por obligación, sin disfrute, sin voz propia.',
            etapas: ['Etapa 2 (3-5 años)', 'Etapa 3 (6-8 años)', 'Etapa 4 (9-11 años) · principal', 'Etapa 5 (12-14 años)', 'Etapa 6 (15-17 años)'],
            virtudes: ['Creatividad', 'Honestidad', 'Perseverancia', 'Claridad'],
            niveles: ['preescolar', 'primaria-baja', 'primaria-alta', 'secundaria', 'bachillerato'],
            actividadesEsenciales: [
                { nombre: 'Juegos de escritura creativa', nivel: 'Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Club de escritores', nivel: 'Primaria alta', frecuencia: 'Semanal' },
                { nombre: 'Escritura de microrrelatos', nivel: 'Primaria alta y Secundaria', frecuencia: 'Quincenal' }
            ],
            actividadesOpcionales: [
                { nombre: 'Dibujo mi cuento', nivel: 'Preescolar', frecuencia: 'Semanal' },
                { nombre: 'Cantamos y escribimos', nivel: 'Preescolar', frecuencia: 'Semanal' },
                { nombre: 'Historias con tres imágenes', nivel: 'Preescolar', frecuencia: 'Semanal' },
                { nombre: 'Poema colectivo', nivel: 'Primaria alta', frecuencia: 'Mensual' },
                { nombre: 'Contraportada', nivel: 'Secundaria', frecuencia: 'Quincenal' }
            ],
            indicadores: {
                cuanti: 'Porcentaje de estudiantes que producen textos propios de manera regular (portafolio de escritura).',
                cuali: 'Escriben por iniciativa propia, comparten sus textos, revisan y mejoran, experimentan con géneros y formatos, encuentran su propia voz.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el segundo y tercer trimestre.',
            conexionVagones: 'Narrativa, poesía, texto multimodal, texto dramático.',
            conexionFamilia: 'Escritura en familia, carta para familias con actividades, el libro viajero con página nueva.'
        },
        ruta5: {
            id: 'ruta5',
            numero: 5,
            nombre: 'LEO en comunidad',
            lema: 'LEO para tejer la red que nos sostiene.',
            necesidad: 'Poca participación de las familias y la comunidad en la formación lectora. La lectura se concibe como una actividad solitaria, escolar, individual.',
            etapas: ['Etapa 1 (0-2 años)', 'Etapa 2 (3-5 años)', 'Etapa 3 (6-8 años)', 'Etapa 4 (9-11 años) · principal', 'Etapa 5 (12-14 años)', 'Etapa 6 (15-17 años)'],
            virtudes: ['Vínculo', 'Empatía', 'Generosidad', 'Comunidad'],
            niveles: ['inicial', 'preescolar', 'primaria-baja', 'primaria-alta', 'secundaria'],
            actividadesEsenciales: [
                { nombre: 'Lector invitado', nivel: 'Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Lectura compartida en parejas', nivel: 'Preescolar', frecuencia: 'Semanal' },
                { nombre: 'Círculo de lectores docentes', nivel: 'Docentes', frecuencia: 'Trimestral' }
            ],
            actividadesOpcionales: [
                { nombre: 'El libro viajero', nivel: 'Preescolar y Primaria baja', frecuencia: 'Semanal' },
                { nombre: 'Fiesta de cuentos (Día del Niño)', nivel: 'Preescolar', frecuencia: 'Anual' },
                { nombre: 'Maratón de lectura', nivel: 'Primaria alta', frecuencia: 'Trimestral' },
                { nombre: 'Tertulia literaria', nivel: 'Primaria alta y Secundaria', frecuencia: 'Mensual' },
                { nombre: 'Semana de autores jaliscienses', nivel: 'Primaria alta', frecuencia: 'Anual' }
            ],
            indicadores: {
                cuanti: 'Porcentaje de familias que reportan leer con sus hijos al menos tres veces por semana (meta: incrementar en 20 puntos porcentuales respecto a la línea base).',
                cuali: 'Las familias participan, los estudiantes comparten lo que leen, la comunidad se involucra, los estudiantes recomiendan libros, la escuela se convierte en espacio de encuentro.'
            },
            duracion: 'Todo el ciclo escolar, con énfasis en el primer y tercer trimestre.',
            conexionVagones: 'Narrativa, poesía, texto oral, texto multimodal.',
            conexionFamilia: 'Lectura en familia, carta para familias, fiesta de la palabra, guía para acompañar la lectura en casa.'
        }
    },

    /* ========================================================
       8. MOTOR DE RECOMENDACIÓN · REGLAS DE CRUCE
       ======================================================== */
    motorRecomendacion: {
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
       11. DATOS DE IDENTIFICACIÓN
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
    },

    /* ========================================================
       13. MOMENTO 3: HOJA DE RUTA TRIMESTRAL
       ======================================================== */
    momento3: {
        // Meses del trimestre
        meses: [
            { id: 'septiembre', nombre: 'Septiembre', numero: 9 },
            { id: 'octubre', nombre: 'Octubre', numero: 10 },
            { id: 'noviembre', nombre: 'Noviembre', numero: 11 }
        ],
        // Semanas por mes (para calendarización)
        semanas: {
            septiembre: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            octubre: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            noviembre: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']
        },
        // Tipos de actividad (periodicidad según guía española)
        tiposActividad: [
            { id: 'ordinaria', nombre: 'Ordinaria', descripcion: 'Se realiza de manera cotidiana (diaria o semanal).', color: 'verde' },
            { id: 'periodica', nombre: 'Periódica', descripcion: 'Se realiza quincenal o mensualmente.', color: 'amarillo' },
            { id: 'extraordinaria', nombre: 'Extraordinaria', descripcion: 'Se realiza una vez al trimestre o al año.', color: 'rojo' }
        ],
        // Estados de implementación (para la bitácora)
        estadosImplementacion: [
            { id: 'no-iniciada', nombre: 'No iniciada', color: 'gris' },
            { id: 'en-proceso', nombre: 'En proceso', color: 'amarillo' },
            { id: 'completada', nombre: 'Completada', color: 'verde' },
            { id: 'reprogramada', nombre: 'Reprogramada', color: 'rojo' }
        ],
        // Roles para responsables
        roles: [
            'Director(a)',
            'ATP / Supervisor',
            'Docente de grupo',
            'Docente de Lengua y Literatura',
            'Bibliotecario(a)',
            'Docente de otra asignatura',
            'Estudiante',
            'Familia / Tutor',
            'Comunidad'
        ],
        // Tipos de evidencia para la bitácora
        tiposEvidencia: [
            'Fotografía',
            'Video',
            'Audio',
            'Texto escrito',
            'Dibujo',
            'Producto final',
            'Lista de asistencia',
            'Otro'
        ],
        // Preguntas guía para la bitácora (evaluación formativa)
        preguntasBitacora: [
            '¿Qué actividad se realizó?',
            '¿Quiénes participaron?',
            '¿Cómo fue la experiencia?',
            '¿Qué funcionó bien?',
            '¿Qué se puede mejorar?',
            '¿Qué evidencias tenemos?'
        ]
    },

    /* ========================================================
       14. MODO DEMO (Ejemplo "Primaria Benito Juárez")
       ======================================================== */
    demo: {
        escuela: 'Escuela Primaria Benito Juárez',
        cct: '14DPR0001A',
        region: 'Región 12 · Centro',
        municipio: 'Guadalajara',
        turno: 'Matutino',
        nivel: 'primaria-alta',
        grados: ['4°', '5°', '6°'],
        numeroEstudiantes: 180,
        director: 'María López Hernández',
        atp: 'Juan Pérez Ramírez',
        fechaCTE: '2026-09-25',
        modoLlenado: 'colectivo',
        rutasSeleccionadas: ['ruta1', 'ruta4', 'ruta5'],
        actividades: [
            {
                rutaId: 'ruta1',
                actividad: 'Lectura en voz alta diaria',
                mes: 'septiembre',
                semana: 'Semana 1',
                responsable: 'Docente de grupo',
                tipo: 'ordinaria',
                estado: 'completada'
            },
            {
                rutaId: 'ruta1',
                actividad: 'Círculo de lectura semanal',
                mes: 'septiembre',
                semana: 'Semana 2',
                responsable: 'Docente de Lengua y Literatura',
                tipo: 'ordinaria',
                estado: 'en-proceso'
            },
            {
                rutaId: 'ruta4',
                actividad: 'Club de escritores',
                mes: 'octubre',
                semana: 'Semana 1',
                responsable: 'Docente de grupo',
                tipo: 'ordinaria',
                estado: 'no-iniciada'
            },
            {
                rutaId: 'ruta5',
                actividad: 'Lector invitado',
                mes: 'octubre',
                semana: 'Semana 3',
                responsable: 'Familia / Tutor',
                tipo: 'periodica',
                estado: 'no-iniciada'
            },
            {
                rutaId: 'ruta5',
                actividad: 'Maratón de lectura',
                mes: 'noviembre',
                semana: 'Semana 2',
                responsable: 'Bibliotecario(a)',
                tipo: 'extraordinaria',
                estado: 'no-iniciada'
            }
        ]
    }
};

// ============================================================
// EXPORTAR (para uso en otros módulos)
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DATOS;
}
