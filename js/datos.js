/* ============================================================
   PLAN LECTOR JALISCO LEO
   datos.js — Datos precargados (v5.1)
   Estructura: 5 Rutas LEO con anclas + banco + cierre por nivel.
   Niveles sin actividades propias se marcan disponible:false.
   ============================================================ */

const DATOS = {

    /* ========================================================
       METADATOS
       ======================================================== */
    meta: {
        proyecto: 'Plan Lector Jalisco LEO',
        modulo: 'Plan Lector',
        fuente: 'Jalisco Avanza 2025 · Jalisco LEO',
        version: '5.1',
        fechaActualizacion: '2026-09-19'
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
            rango: '12-15 años',
            grados: ['1°', '2°', '3°'],
            descripcion: 'Educación secundaria.'
        },
        {
            id: 'docentes',
            nombre: 'LEO entre docentes',
            rango: 'CTE',
            grados: ['Colectivo docente'],
            descripcion: 'Formación lectora del colectivo docente.'
        }
    ],

    /* ========================================================
       2. REGLAS DE FILTRADO POR NIVEL EDUCATIVO
       Decisión de Edith: UNA ruta por trimestre.
       Solo se listan rutas DISPONIBLES para cada nivel.
       ======================================================== */
    reglasFiltradoNivel: {
        'inicial': {
            rutasSugeridas: ['ruta2', 'ruta5'],
            rutasOpcionales: ['ruta1'],
            rutaUnica: true,
            nota: 'Para Inicial se sugieren las rutas de imaginación y comunidad. La Ruta 1 (comprender) es opcional. Las rutas 3 (argumentar) y 4 (crear) no tienen actividades propias para esta edad.'
        },
        'preescolar': {
            rutasSugeridas: ['ruta1', 'ruta2', 'ruta5'],
            rutasOpcionales: ['ruta4'],
            rutaUnica: true,
            nota: 'Para Preescolar se sugieren las rutas de comprensión, imaginación y comunidad. La Ruta 3 (argumentar) no tiene actividades propias para esta edad.'
        },
        'primaria-baja': {
            rutasSugeridas: ['ruta1', 'ruta2', 'ruta4', 'ruta5'],
            rutasOpcionales: [],
            rutaUnica: true,
            nota: 'Para Primaria Baja se sugieren comprensión, imaginación, creación y comunidad. La Ruta 3 (argumentar) se trabaja a partir de primaria alta.'
        },
        'primaria-alta': {
            rutasSugeridas: ['ruta1', 'ruta3', 'ruta4', 'ruta5'],
            rutasOpcionales: ['ruta2'],
            rutaUnica: true,
            nota: 'Para Primaria Alta se sugieren comprensión, argumentación, creación y comunidad.'
        },
        'secundaria': {
            rutasSugeridas: ['ruta1', 'ruta3', 'ruta4'],
            rutasOpcionales: ['ruta2', 'ruta5'],
            rutaUnica: true,
            nota: 'Para Secundaria se sugieren comprensión, argumentación y creación.'
        },
        'docentes': {
            rutasSugeridas: ['ruta1', 'ruta2', 'ruta3', 'ruta4', 'ruta5'],
            rutasOpcionales: [],
            rutaUnica: true,
            nota: 'Para el colectivo docente, cualquiera de las 5 rutas es pertinente. Elijan la que mejor responda a su necesidad formativa.'
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
       7. LAS 5 RUTAS LEO (v5.1 — anclas + banco + cierre)
       Estructura por nivel:
         - Si el nivel tiene actividades propias:
             { anclas: [2], banco: [5-7], cierre: {1} }
         - Si NO tiene actividades propias:
             { disponible: false, razonNoDisponible: '...' }
       Cada actividad: { nombre, descripcion, frecuencia, virtud }
       ======================================================== */
    rutasLEO: {

        /* ======================================================
           RUTA 1: LEO PARA COMPRENDER
           ====================================================== */
        ruta1: {
            id: 'ruta1',
            numero: 1,
            nombre: 'LEO para comprender',
            lema: 'LEO para tender puentes entre lo que dice el texto y lo que ya sabemos.',
            proposito: 'Pasar de la decodificación a la comprensión profunda. Que las y los estudiantes no solo lean las palabras, sino que construyan significado, infieran, relacionen el texto con su experiencia, identifiquen ideas principales y secundarias, distingan hechos de opiniones.',
            criterios: [
                'Que trabajen predicción, inferencia, ideas principales, relación texto-experiencia.',
                'Que permitan detenerse, releer, preguntar, conversar.',
                'Que cultiven pensamiento reflexivo, paciencia, laboriosidad, claridad.'
            ],
            virtudes: ['Pensamiento reflexivo', 'Paciencia', 'Laboriosidad', 'Claridad'],
            preguntaOrientadora: '¿Necesitamos que nuestros estudiantes comprendan mejor lo que leen?',
            subtituloPregunta: 'Atiende: comprensión profunda, inferencia, relación texto-experiencia.',
            duracion: 'Todo el ciclo escolar, con énfasis en el primer trimestre.',
            datosJustificacion: {
                primaria: {
                    ua: 'UA 2 · Integrar información y realizar inferencias',
                    porcentaje: 44.9,
                    grado: '6°',
                    texto: 'En 6° de primaria, solo el 44.9% de las y los estudiantes logra integrar información y realizar inferencias. La comprensión profunda es el área con mayor oportunidad de mejora en el último tramo de primaria.'
                },
                secundaria: {
                    ua: 'UA 2 · Integrar información y realizar inferencias',
                    porcentaje: 49.8,
                    grado: '3°',
                    texto: 'En 3° de secundaria, solo el 49.8% logra integrar información y realizar inferencias. La comprensión inferencial sigue siendo un reto al cierre de la educación básica.'
                }
            },
            niveles: {
                'inicial': {
                    anclas: [
                        {
                            nombre: 'Lectura de imágenes con señalamiento',
                            descripcion: 'La educadora muestra libros con imágenes grandes, señala y nombra cada elemento.',
                            frecuencia: 'Diaria',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'Cantos y arrullos',
                            descripcion: 'La educadora canta nanas y canciones de cuna mientras mece al bebé. La voz transmite calma y crea el primer vínculo con el lenguaje.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Juego de espejo sonoro',
                            descripcion: 'La educadora emite sonidos y espera a que el bebé los imite. Luego invierten roles.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Baño de palabras',
                            descripcion: 'La educadora describe en voz alta todo lo que hace durante el cuidado del bebé.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Ritmo y movimiento con palabras',
                            descripcion: 'La educadora recita rimas marcando el ritmo con palmadas o moviendo al bebé suavemente.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Narración con títeres de dedo',
                            descripcion: 'La educadora narra pequeñas historias usando títeres de dedo.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'Sonidos que cuentan',
                            descripcion: 'La educadora asocia sonidos cotidianos con pequeñas historias.',
                            frecuencia: 'Diaria',
                            virtud: 'Atención'
                        }
                    ],
                    cierre: {
                        nombre: 'Caja de tesoros para tocar y nombrar',
                        descripcion: 'Una caja con objetos seguros de diferentes texturas. La educadora los muestra y los nombra.',
                        frecuencia: 'Semanal',
                        virtud: 'Curiosidad'
                    }
                },
                'preescolar': {
                    anclas: [
                        {
                            nombre: 'Lectura de imágenes',
                            descripcion: 'Los niños "leen" las ilustraciones de libros sin texto, construyendo hipótesis narrativas.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'Adivina qué sigue',
                            descripcion: 'La educadora lee un cuento y se detiene antes del final. Los niños predicen qué pasará.',
                            frecuencia: 'Semanal',
                            virtud: 'Claridad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Dibujo mi cuento',
                            descripcion: 'Después de escuchar un cuento, los niños dibujan lo que más les gustó. La educadora escribe lo que dictan.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'El tendedero de cuentos',
                            descripcion: 'Después de leer un cuento, los niños dibujan escenas y las cuelgan en orden en un tendedero.',
                            frecuencia: 'Quincenal',
                            virtud: 'Claridad'
                        },
                        {
                            nombre: 'Veo, veo de colores y formas',
                            descripcion: 'La educadora dice: "Veo, veo algo de color..." y los niños buscan objetos que coincidan.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'La bolsa misteriosa',
                            descripcion: 'Un niño saca un objeto de una bolsa, lo nombra e inventa una frase.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Juegos de adivinanzas',
                            descripcion: 'La educadora dice adivinanzas sencillas. Los niños las resuelven y luego inventan las suyas.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Memoria de sonidos',
                            descripcion: 'La educadora graba sonidos del entorno y los niños adivinan de qué se trata.',
                            frecuencia: 'Quincenal',
                            virtud: 'Atención'
                        }
                    ],
                    cierre: {
                        nombre: 'El mural de las emociones',
                        descripcion: 'Después de leer un cuento, los niños dibujan su cara expresando una emoción del personaje.',
                        frecuencia: 'Quincenal',
                        virtud: 'Empatía'
                    }
                },
                'primaria-baja': {
                    anclas: [
                        {
                            nombre: 'Lectura en voz alta diaria',
                            descripcion: 'El docente lee en voz alta un texto literario al inicio de la jornada, modelando fluidez, entonación y prosodia. Se detiene a preguntar, a predecir, a conectar.',
                            frecuencia: 'Diaria',
                            virtud: 'Perseverancia'
                        },
                        {
                            nombre: 'El semáforo de la lectura',
                            descripcion: 'Con tarjetas verde, amarilla y roja, indican si entienden, tienen dudas o no entienden.',
                            frecuencia: 'Semanal',
                            virtud: 'Honestidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Lectura en eco',
                            descripcion: 'El docente lee una frase y los estudiantes la repiten como un eco.',
                            frecuencia: 'Diaria',
                            virtud: 'Perseverancia'
                        },
                        {
                            nombre: 'Fichero de palabras nuevas',
                            descripcion: 'Cada estudiante anota palabras nuevas que encuentra al leer, con definición.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Palabras que crecen',
                            descripcion: 'A partir de una palabra base, agregan letras para formar nuevas palabras.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Diario de lecturas',
                            descripcion: 'Cada estudiante registra los libros leídos, escribe una frase y hace un dibujo.',
                            frecuencia: 'Semanal',
                            virtud: 'Claridad'
                        },
                        {
                            nombre: 'Lectura en parejas con cambio de voz',
                            descripcion: 'En parejas, leen un diálogo con diferentes emociones.',
                            frecuencia: 'Semanal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Dibujo dictado',
                            descripcion: 'El docente lee un texto descriptivo. Los estudiantes dibujan lo que escuchan y comparan.',
                            frecuencia: 'Quincenal',
                            virtud: 'Claridad'
                        },
                        {
                            nombre: 'Teléfono descompuesto de cuentos',
                            descripcion: 'Un estudiante lee un cuento y se lo cuenta al oído a otro. Comparan al final.',
                            frecuencia: 'Quincenal',
                            virtud: 'Atención'
                        }
                    ],
                    cierre: {
                        nombre: 'Círculo de lectores',
                        descripcion: 'Conversación mensual sobre un libro leído en común con preguntas abiertas.',
                        frecuencia: 'Mensual',
                        virtud: 'Respeto'
                    }
                },
                'primaria-alta': {
                    anclas: [
                        {
                            nombre: 'Círculo de lectura semanal',
                            descripcion: 'Lectura y discusión de un texto común, alternando roles (moderador, cronometrista, tomador de notas). El docente guía con preguntas abiertas.',
                            frecuencia: 'Semanal',
                            virtud: 'Respeto'
                        },
                        {
                            nombre: 'Lectura de imágenes y predicción',
                            descripcion: 'Antes de leer, observan ilustraciones y predicen de qué tratará la historia.',
                            frecuencia: 'Semanal',
                            virtud: 'Claridad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Reseña en 100 palabras',
                            descripcion: 'Escriben una reseña de exactamente 100 palabras después de leer un libro.',
                            frecuencia: 'Quincenal',
                            virtud: 'Claridad'
                        },
                        {
                            nombre: 'Noticias del mundo',
                            descripcion: 'Cada semana, un estudiante trae una noticia, la lee y la comenta con el grupo.',
                            frecuencia: 'Semanal',
                            virtud: 'Pensamiento crítico'
                        },
                        {
                            nombre: 'El árbol de los libros',
                            descripcion: 'Un árbol dibujado en el mural. Cada estudiante coloca una hoja con el título que leyó.',
                            frecuencia: 'Quincenal',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Construir un personaje',
                            descripcion: 'Crean un personaje a partir de preguntas guía y escriben una historia con él.',
                            frecuencia: 'Quincenal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Cartas a personajes',
                            descripcion: 'Después de leer un libro, escriben una carta a uno de los personajes.',
                            frecuencia: 'Mensual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Entrevista a un personaje',
                            descripcion: 'Por parejas, un estudiante asume el rol de un personaje y el otro lo entrevista.',
                            frecuencia: 'Quincenal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Mapa de mi historia',
                            descripcion: 'Dibujan un mapa del lugar donde transcurre el libro que están leyendo.',
                            frecuencia: 'Mensual',
                            virtud: 'Creatividad'
                        }
                    ],
                    cierre: {
                        nombre: 'Tertulia literaria',
                        descripcion: 'Conversación mensual sobre un libro leído por todos, compartiendo impresiones.',
                        frecuencia: 'Mensual',
                        virtud: 'Respeto'
                    }
                },
                'secundaria': {
                    anclas: [
                        {
                            nombre: 'Círculo de silencio lector',
                            descripcion: 'Veinte minutos de lectura individual en absoluto silencio. Al final, escriben una frase.',
                            frecuencia: 'Semanal',
                            virtud: 'Autodisciplina'
                        },
                        {
                            nombre: 'Bitácora de lector',
                            descripcion: 'Registro personal de lecturas con fecha, título, autor y una reflexión breve.',
                            frecuencia: 'Semanal',
                            virtud: 'Claridad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Lectura para debate',
                            descripcion: 'Leen un texto breve sobre un tema polémico, toman postura y debaten.',
                            frecuencia: 'Semanal',
                            virtud: 'Pensamiento crítico'
                        },
                        {
                            nombre: 'Cineminuto literario',
                            descripcion: 'En un minuto, un estudiante cuenta de qué trata un libro y por qué lo recomienda.',
                            frecuencia: 'Semanal',
                            virtud: 'Claridad'
                        },
                        {
                            nombre: 'Escritura de reseñas literarias',
                            descripcion: 'Después de leer un libro, escriben una reseña y la comparten.',
                            frecuencia: 'Quincenal',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Mapa del tesoro literario',
                            descripcion: 'Diseñan un mapa del tesoro donde las pistas son fragmentos de libros leídos.',
                            frecuencia: 'Mensual',
                            virtud: 'Generosidad'
                        },
                        {
                            nombre: 'Debate de citas',
                            descripcion: 'Defienden o refutan una cita de un autor que les tocó al azar.',
                            frecuencia: 'Quincenal',
                            virtud: 'Pensamiento crítico'
                        },
                        {
                            nombre: 'Ensayo de 500 palabras',
                            descripcion: 'A partir de una pregunta disparadora, escriben un ensayo breve con estructura.',
                            frecuencia: 'Mensual',
                            virtud: 'Claridad'
                        },
                        {
                            nombre: 'Manifiesto lector',
                            descripcion: 'Escriben su manifiesto personal como lectores: qué leen, por qué, qué nunca leerían.',
                            frecuencia: 'Trimestral',
                            virtud: 'Honestidad'
                        }
                    ],
                    cierre: {
                        nombre: 'Juicio a un personaje',
                        descripcion: 'Organizan un juicio a un personaje de una novela con fiscales, defensores y jurado.',
                        frecuencia: 'Trimestral',
                        virtud: 'Juicio'
                    }
                },
                'docentes': {
                    anclas: [
                        {
                            nombre: 'Lectura en voz alta entre colegas',
                            descripcion: 'Un docente lee en voz alta un texto breve al inicio del CTE. Los demás escuchan y comparten impresiones.',
                            frecuencia: 'CTE',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Cartelera de docentes lectores',
                            descripcion: 'Un espacio en la sala de maestros donde cada docente recomienda un libro con una breve reseña.',
                            frecuencia: 'Mensual',
                            virtud: 'Generosidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'El libro que me transformó',
                            descripcion: 'Cada mes, un docente comparte en cinco minutos el libro que marcó su vida como lector.',
                            frecuencia: 'Mensual',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Tertulia pedagógica',
                            descripcion: 'Lectura y discusión de un artículo o capítulo sobre didáctica de la lectura.',
                            frecuencia: 'Mensual',
                            virtud: 'Perseverancia'
                        },
                        {
                            nombre: 'Escritura de la práctica',
                            descripcion: 'Cada docente escribe un breve registro de una experiencia lectora exitosa en su aula.',
                            frecuencia: 'Mensual',
                            virtud: 'Responsabilidad'
                        },
                        {
                            nombre: 'Círculo de lectores docentes',
                            descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                            frecuencia: 'Trimestral',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Club de traducción pedagógica',
                            descripcion: 'Los docentes eligen un texto breve en otro idioma sobre educación, lo traducen y lo comentan.',
                            frecuencia: 'Mensual',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Maratón de lectura docente',
                            descripcion: 'Jornada donde cada docente lee un fragmento de su libro favorito frente a la comunidad escolar.',
                            frecuencia: 'Anual',
                            virtud: 'Comunidad'
                        }
                    ],
                    cierre: {
                        nombre: 'Círculo de lectores docentes',
                        descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                        frecuencia: 'Trimestral',
                        virtud: 'Comunidad'
                    }
                }
            }
        },

        /* ======================================================
           RUTA 2: LEO PARA IMAGINAR
           ====================================================== */
        ruta2: {
            id: 'ruta2',
            numero: 2,
            nombre: 'LEO para imaginar',
            lema: 'LEO para abrir la puerta a mundos que aún no existen.',
            proposito: 'Recuperar el gozo de leer. Que las y los estudiantes asocien la lectura con placer, descubrimiento y juego, no con obligación. Sin gusto, no hay comprensión sostenida.',
            criterios: [
                'Que despierte la imaginación y la curiosidad.',
                'Que invite a explorar, jugar, sorprenderse.',
                'Que cultive curiosidad, creatividad, atención, apego seguro.'
            ],
            virtudes: ['Curiosidad', 'Creatividad', 'Atención', 'Apego seguro'],
            preguntaOrientadora: '¿Necesitamos recuperar el gusto por leer?',
            subtituloPregunta: 'Atiende: motivación, gozo, descubrimiento, juego.',
            duracion: 'Todo el ciclo escolar, con énfasis en el primer y segundo trimestre.',
            datosJustificacion: {
                primaria: {
                    ua: 'UA 1 · Analizar la estructura de los textos',
                    porcentaje: 45.1,
                    grado: '6°',
                    texto: 'En 6° de primaria, solo el 45.1% analiza la estructura de los textos. Recuperar el gozo por leer es condición para sostener la comprensión en el tiempo.'
                },
                secundaria: {
                    ua: 'UA 1 · Analizar la estructura de los textos',
                    porcentaje: 47.9,
                    grado: '3°',
                    texto: 'En 3° de secundaria, solo el 47.9% analiza la estructura de los textos. La motivación lectora es un predictor clave del logro académico.'
                }
            },
            niveles: {
                'inicial': {
                    anclas: [
                        {
                            nombre: 'Cantos y arrullos',
                            descripcion: 'La educadora canta nanas y canciones de cuna mientras mece al bebé.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Exploración de libros sensoriales',
                            descripcion: 'Se ofrecen libros de tela, plástico o cartón para que los bebés los manipulen.',
                            frecuencia: 'Diaria',
                            virtud: 'Curiosidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Juego de espejo sonoro',
                            descripcion: 'La educadora emite sonidos y espera a que el bebé los imite.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Sombras que hablan',
                            descripcion: 'Con una lámpara y las manos, la educadora crea sombras de animales y narra historias.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Caja de tesoros para tocar y nombrar',
                            descripcion: 'Una caja con objetos seguros de diferentes texturas. La educadora los muestra y los nombra.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Narración con títeres de dedo',
                            descripcion: 'La educadora narra pequeñas historias usando títeres de dedo.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'Sonidos que cuentan',
                            descripcion: 'La educadora asocia sonidos cotidianos con pequeñas historias.',
                            frecuencia: 'Diaria',
                            virtud: 'Atención'
                        }
                    ],
                    cierre: {
                        nombre: 'Fiesta de nanas y arrullos (Día de las Madres)',
                        descripcion: 'Invitación a familias para compartir nanas y cantos tradicionales con sus bebés.',
                        frecuencia: 'Anual',
                        virtud: 'Comunidad'
                    }
                },
                'preescolar': {
                    anclas: [
                        {
                            nombre: 'Cuentos con objetos cotidianos',
                            descripcion: 'La educadora narra una historia usando objetos cotidianos. Los niños crean las suyas.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'La bolsa misteriosa',
                            descripcion: 'Un niño saca un objeto de una bolsa, lo nombra e inventa una frase.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Palabras que vuelan',
                            descripcion: 'La educadora dice una palabra y los niños responden con otra que se les ocurra.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Historias con tres imágenes',
                            descripcion: 'La educadora muestra tres imágenes sin relación. Los niños inventan una historia que las conecte.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Cuentos con títeres de palito',
                            descripcion: 'Después de leer un cuento, los niños lo representan con títeres de palito.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Veo, veo de colores y formas',
                            descripcion: 'La educadora dice: "Veo, veo algo de color..." y los niños buscan objetos que coincidan.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'Juegos de rimas y palmas',
                            descripcion: 'La educadora dice una palabra y los niños dan palmas por cada sílaba. Luego crean rimas.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Memoria de sonidos',
                            descripcion: 'La educadora graba sonidos del entorno y los niños adivinan de qué se trata.',
                            frecuencia: 'Quincenal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'El libro viajero',
                            descripcion: 'Un libro álbum viaja cada fin de semana a una familia. El lunes, el niño cuenta lo que leyó.',
                            frecuencia: 'Semanal',
                            virtud: 'Vínculo'
                        }
                    ],
                    cierre: {
                        nombre: 'Fiesta de cuentos (Día del Niño)',
                        descripcion: 'Jornada de narración oral con participación de familias. Cada familia comparte un cuento.',
                        frecuencia: 'Anual',
                        virtud: 'Comunidad'
                    }
                },
                'primaria-baja': {
                    anclas: [
                        {
                            nombre: 'Lectura en voz alta diaria',
                            descripcion: 'El docente lee en voz alta un texto literario al inicio de la jornada. Elige textos que sorprendan, que hagan reír, que conmuevan.',
                            frecuencia: 'Diaria',
                            virtud: 'Perseverancia'
                        },
                        {
                            nombre: 'Juegos de escritura creativa',
                            descripcion: 'A partir de consignas breves, escriben finales alternativos, cartas a personajes, nuevas aventuras.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'La ruleta de los cuentos',
                            descripcion: 'Una ruleta con personajes, lugares y objetos. Crean un cuento con los tres elementos.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Cuentos con títeres',
                            descripcion: 'Después de leer un cuento, los estudiantes lo representan con títeres.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Recomendación estelar',
                            descripcion: 'Cada viernes, un estudiante recomienda un libro al grupo explicando por qué.',
                            frecuencia: 'Semanal',
                            virtud: 'Generosidad'
                        },
                        {
                            nombre: 'Lectura en parejas con cambio de voz',
                            descripcion: 'En parejas, leen un diálogo con diferentes emociones.',
                            frecuencia: 'Semanal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Palabras en el aire',
                            descripcion: 'El docente dice una categoría. Los estudiantes dicen palabras en cadena sin repetir.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'Dictado creativo',
                            descripcion: 'El docente dicta el inicio de una historia. Los estudiantes la completan.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'El museo de los personajes',
                            descripcion: 'Dibujan un personaje de un libro leído y escriben tres datos sobre él. Se exhiben.',
                            frecuencia: 'Mensual',
                            virtud: 'Comunidad'
                        }
                    ],
                    cierre: {
                        nombre: 'Círculo de lectores',
                        descripcion: 'Conversación mensual sobre un libro leído en común con preguntas abiertas.',
                        frecuencia: 'Mensual',
                        virtud: 'Respeto'
                    }
                },
                'primaria-alta': {
                    anclas: [
                        {
                            nombre: 'Cita a ciegas con un libro',
                            descripcion: 'Los libros se envuelven con solo tres pistas. Eligen uno sin saber el título.',
                            frecuencia: 'Mensual',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Club de escritores',
                            descripcion: 'Espacio semanal para escribir y compartir textos propios. El docente escribe junto con ellos.',
                            frecuencia: 'Semanal',
                            virtud: 'Honestidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Escritura de microrrelatos',
                            descripcion: 'A partir de una imagen, frase o palabra, escriben un microrrelato de máximo 150 palabras.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Mapa de mi historia',
                            descripcion: 'Dibujan un mapa del lugar donde transcurre el libro que están leyendo.',
                            frecuencia: 'Mensual',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Construir un personaje',
                            descripcion: 'Crean un personaje a partir de preguntas guía y escriben una historia con él.',
                            frecuencia: 'Quincenal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Poema colectivo',
                            descripcion: 'Cada estudiante escribe un verso. Se juntan todos y se arma un poema colectivo.',
                            frecuencia: 'Mensual',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'El debate del libro',
                            descripcion: 'Dos estudiantes defienden por qué su libro favorito es mejor, con argumentos y sin descalificar.',
                            frecuencia: 'Quincenal',
                            virtud: 'Respeto'
                        },
                        {
                            nombre: 'Cartas a personajes',
                            descripcion: 'Después de leer un libro, escriben una carta a uno de los personajes.',
                            frecuencia: 'Mensual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Diccionario de autor',
                            descripcion: 'Cada estudiante elige cinco palabras que definan su estilo como escritor.',
                            frecuencia: 'Mensual',
                            virtud: 'Honestidad'
                        }
                    ],
                    cierre: {
                        nombre: 'Maratón de lectura',
                        descripcion: 'Jornada completa dedicada a la lectura en todos los espacios de la escuela.',
                        frecuencia: 'Trimestral',
                        virtud: 'Comunidad'
                    }
                },
                'secundaria': {
                    anclas: [
                        {
                            nombre: 'Club de lectura juvenil',
                            descripcion: 'Se reúnen voluntariamente para leer y conversar sobre libros.',
                            frecuencia: 'Semanal',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Cita a ciegas con un libro',
                            descripcion: 'Los libros se envuelven con solo tres pistas. Eligen uno sin saber el título.',
                            frecuencia: 'Mensual',
                            virtud: 'Curiosidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Escritura de microrrelatos',
                            descripcion: 'A partir de una imagen, frase o palabra, escriben un microrrelato de máximo 150 palabras.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Podcast literario',
                            descripcion: 'Graban un breve podcast recomendando un libro, con música y efectos de sonido.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Cadáver exquisito',
                            descripcion: 'En grupo, cada estudiante escribe una línea sin ver lo que escribió el anterior.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Contraportada',
                            descripcion: 'Escriben la contraportada de un libro que aún no existe, con título, sinopsis y frase gancho.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Club de traducción de canciones',
                            descripcion: 'Eligen una canción en otro idioma, la traducen y analizan la letra.',
                            frecuencia: 'Quincenal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Mapa del tesoro literario',
                            descripcion: 'Diseñan un mapa del tesoro donde las pistas son fragmentos de libros leídos.',
                            frecuencia: 'Mensual',
                            virtud: 'Generosidad'
                        },
                        {
                            nombre: 'Taller de spoken word',
                            descripcion: 'Crean e interpretan textos poéticos para ser dichos en voz alta.',
                            frecuencia: 'Mensual',
                            virtud: 'Valentía'
                        }
                    ],
                    cierre: {
                        nombre: 'Slam de poesía (Día Mundial de la Poesía)',
                        descripcion: 'Los estudiantes escriben poemas y los interpretan frente al grupo. El público vota.',
                        frecuencia: 'Anual',
                        virtud: 'Valentía'
                    }
                },
                'docentes': {
                    anclas: [
                        {
                            nombre: 'Lectura en voz alta entre colegas',
                            descripcion: 'Un docente lee en voz alta un texto breve al inicio del CTE. Los demás escuchan y comparten impresiones.',
                            frecuencia: 'CTE',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Cartelera de docentes lectores',
                            descripcion: 'Un espacio en la sala de maestros donde cada docente recomienda un libro con una breve reseña.',
                            frecuencia: 'Mensual',
                            virtud: 'Generosidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'El libro que me transformó',
                            descripcion: 'Cada mes, un docente comparte en cinco minutos el libro que marcó su vida como lector.',
                            frecuencia: 'Mensual',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Tertulia pedagógica',
                            descripcion: 'Lectura y discusión de un artículo o capítulo sobre didáctica de la lectura.',
                            frecuencia: 'Mensual',
                            virtud: 'Perseverancia'
                        },
                        {
                            nombre: 'Escritura de la práctica',
                            descripcion: 'Cada docente escribe un breve registro de una experiencia lectora exitosa en su aula.',
                            frecuencia: 'Mensual',
                            virtud: 'Responsabilidad'
                        },
                        {
                            nombre: 'Círculo de lectores docentes',
                            descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                            frecuencia: 'Trimestral',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Club de traducción pedagógica',
                            descripcion: 'Los docentes eligen un texto breve en otro idioma sobre educación, lo traducen y lo comentan.',
                            frecuencia: 'Mensual',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Maratón de lectura docente',
                            descripcion: 'Jornada donde cada docente lee un fragmento de su libro favorito frente a la comunidad escolar.',
                            frecuencia: 'Anual',
                            virtud: 'Comunidad'
                        }
                    ],
                    cierre: {
                        nombre: 'Círculo de lectores docentes',
                        descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                        frecuencia: 'Trimestral',
                        virtud: 'Comunidad'
                    }
                }
            }
        },

        /* ======================================================
           RUTA 3: LEO PARA ARGUMENTAR
           Niveles no disponibles: inicial, preescolar, primaria-baja
           (no tiene actividades propias para estas edades)
           ====================================================== */
        ruta3: {
            id: 'ruta3',
            numero: 3,
            nombre: 'LEO para argumentar',
            lema: 'LEO para aprender a decir lo que pensamos, con razones y con respeto.',
            proposito: 'Pensar críticamente, argumentar con evidencia y dialogar con respeto. Que las y los estudiantes distingan hechos de opiniones, citen evidencias, escuchen posturas distintas y formen opinión propia.',
            criterios: [
                'Que planteen temas controversiales o dilemas éticos.',
                'Que permitan identificar argumentos y contraargumentos.',
                'Que inviten a citar evidencias del texto.',
                'Que cultiven juicio, veracidad, civilidad, pensamiento crítico.'
            ],
            virtudes: ['Juicio', 'Veracidad', 'Civilidad', 'Pensamiento crítico'],
            preguntaOrientadora: '¿Necesitamos que argumenten con evidencia?',
            subtituloPregunta: 'Atiende: pensamiento crítico, evidencia, diálogo respetuoso.',
            duracion: 'Todo el ciclo escolar, con énfasis en el segundo y tercer trimestre.',
            datosJustificacion: {
                primaria: {
                    ua: 'UA 1 · Analizar la estructura de los textos',
                    porcentaje: 45.1,
                    grado: '6°',
                    texto: 'En 6° de primaria, solo el 45.1% analiza la estructura de los textos. La argumentación con evidencia es una de las habilidades más deficitarias al cierre de primaria.'
                },
                secundaria: {
                    ua: 'UA 1 · Analizar la estructura de los textos',
                    porcentaje: 47.9,
                    grado: '3°',
                    texto: 'En 3° de secundaria, solo el 47.9% analiza la estructura de los textos. Formar el juicio crítico es una prioridad de la educación básica.'
                }
            },
            niveles: {
                'inicial': {
                    disponible: false,
                    razonNoDisponible: 'La argumentación con evidencia no es pertinente para bebés de 0 a 2 años. Las actividades que aparecen en el documento consolidado son las mismas que la Ruta 1 (comprender). Te sugerimos elegir Ruta 1 (comprender) o Ruta 2 (imaginar) para este nivel.'
                },
                'preescolar': {
                    disponible: false,
                    razonNoDisponible: 'La argumentación formal no es pertinente para preescolar. Las actividades del documento consolidado son una mezcla de Ruta 1 y Ruta 2. Te sugerimos elegir Ruta 1 (comprender) o Ruta 2 (imaginar) para este nivel.'
                },
                'primaria-baja': {
                    disponible: false,
                    razonNoDisponible: 'La argumentación con evidencia se trabaja a partir de primaria alta. Las actividades del documento consolidado son las mismas que la Ruta 1. Te sugerimos elegir Ruta 1 (comprender) o Ruta 2 (imaginar) para este nivel.'
                },
                'primaria-alta': {
                    anclas: [
                        {
                            nombre: 'Noticias del mundo',
                            descripcion: 'Cada semana, un estudiante trae una noticia, la lee y la comenta con el grupo.',
                            frecuencia: 'Semanal',
                            virtud: 'Pensamiento crítico'
                        },
                        {
                            nombre: 'Debate de posturas',
                            descripcion: 'A partir de un texto, defienden posturas opuestas con argumentos.',
                            frecuencia: 'Quincenal',
                            virtud: 'Pensamiento crítico / Civilidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'El debate del libro',
                            descripcion: 'Dos estudiantes defienden por qué su libro favorito es mejor, con argumentos y sin descalificar.',
                            frecuencia: 'Quincenal',
                            virtud: 'Respeto'
                        },
                        {
                            nombre: 'Tertulia literaria',
                            descripcion: 'Conversación mensual sobre un libro leído por todos, compartiendo impresiones y reflexiones.',
                            frecuencia: 'Mensual',
                            virtud: 'Respeto'
                        },
                        {
                            nombre: 'Reseña en 100 palabras',
                            descripcion: 'Escriben una reseña de exactamente 100 palabras después de leer un libro.',
                            frecuencia: 'Quincenal',
                            virtud: 'Claridad'
                        },
                        {
                            nombre: 'Cartas a personajes',
                            descripcion: 'Después de leer un libro, escriben una carta a uno de los personajes.',
                            frecuencia: 'Mensual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Entrevista a un personaje',
                            descripcion: 'Por parejas, un estudiante asume el rol de un personaje y el otro lo entrevista.',
                            frecuencia: 'Quincenal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Construir un personaje',
                            descripcion: 'Crean un personaje a partir de preguntas guía y escriben una historia con él.',
                            frecuencia: 'Quincenal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Noticias de mi comunidad',
                            descripcion: 'Escriben crónicas breves sobre eventos de su comunidad para un periódico escolar.',
                            frecuencia: 'Quincenal',
                            virtud: 'Responsabilidad'
                        }
                    ],
                    cierre: {
                        nombre: 'Debate de posturas',
                        descripcion: 'A partir de un texto, defienden posturas opuestas con argumentos.',
                        frecuencia: 'Quincenal',
                        virtud: 'Pensamiento crítico / Civilidad'
                    }
                },
                'secundaria': {
                    anclas: [
                        {
                            nombre: 'Lectura para debate',
                            descripcion: 'Leen un texto breve sobre un tema polémico, toman postura y debaten.',
                            frecuencia: 'Semanal',
                            virtud: 'Pensamiento crítico'
                        },
                        {
                            nombre: 'Debate de citas',
                            descripcion: 'Defienden o refutan una cita de un autor que les tocó al azar.',
                            frecuencia: 'Quincenal',
                            virtud: 'Pensamiento crítico'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Ensayo de 500 palabras',
                            descripcion: 'A partir de una pregunta disparadora, escriben un ensayo breve con estructura.',
                            frecuencia: 'Mensual',
                            virtud: 'Claridad'
                        },
                        {
                            nombre: 'Juicio a un personaje',
                            descripcion: 'Organizan un juicio a un personaje de una novela con fiscales, defensores y jurado.',
                            frecuencia: 'Trimestral',
                            virtud: 'Juicio'
                        },
                        {
                            nombre: 'Escritura de reseñas literarias',
                            descripcion: 'Después de leer un libro, escriben una reseña y la comparten.',
                            frecuencia: 'Quincenal',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Manifiesto lector',
                            descripcion: 'Escriben su manifiesto personal como lectores: qué leen, por qué, qué nunca leerían.',
                            frecuencia: 'Trimestral',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Carta a mi yo lector del pasado',
                            descripcion: 'Escriben una carta a sí mismos cuando eran niños sobre lo que la lectura les ha dado.',
                            frecuencia: 'Anual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Club de traducción de canciones',
                            descripcion: 'Eligen una canción en otro idioma, la traducen y analizan la letra.',
                            frecuencia: 'Quincenal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Cineminuto literario',
                            descripcion: 'En un minuto, un estudiante cuenta de qué trata un libro y por qué lo recomienda.',
                            frecuencia: 'Semanal',
                            virtud: 'Claridad'
                        }
                    ],
                    cierre: {
                        nombre: 'Juicio a un personaje',
                        descripcion: 'Organizan un juicio a un personaje de una novela con fiscales, defensores y jurado.',
                        frecuencia: 'Trimestral',
                        virtud: 'Juicio'
                    }
                },
                'docentes': {
                    anclas: [
                        {
                            nombre: 'Lectura en voz alta entre colegas',
                            descripcion: 'Un docente lee en voz alta un texto breve al inicio del CTE. Los demás escuchan y comparten impresiones.',
                            frecuencia: 'CTE',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Tertulia pedagógica',
                            descripcion: 'Lectura y discusión de un artículo o capítulo sobre didáctica de la lectura.',
                            frecuencia: 'Mensual',
                            virtud: 'Perseverancia'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'El libro que me transformó',
                            descripcion: 'Cada mes, un docente comparte en cinco minutos el libro que marcó su vida como lector.',
                            frecuencia: 'Mensual',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Escritura de la práctica',
                            descripcion: 'Cada docente escribe un breve registro de una experiencia lectora exitosa en su aula.',
                            frecuencia: 'Mensual',
                            virtud: 'Responsabilidad'
                        },
                        {
                            nombre: 'Círculo de lectores docentes',
                            descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                            frecuencia: 'Trimestral',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Club de traducción pedagógica',
                            descripcion: 'Los docentes eligen un texto breve en otro idioma sobre educación, lo traducen y lo comentan.',
                            frecuencia: 'Mensual',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Maratón de lectura docente',
                            descripcion: 'Jornada donde cada docente lee un fragmento de su libro favorito frente a la comunidad escolar.',
                            frecuencia: 'Anual',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Cartelera de docentes lectores',
                            descripcion: 'Un espacio en la sala de maestros donde cada docente recomienda un libro con una breve reseña.',
                            frecuencia: 'Mensual',
                            virtud: 'Generosidad'
                        }
                    ],
                    cierre: {
                        nombre: 'Círculo de lectores docentes',
                        descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                        frecuencia: 'Trimestral',
                        virtud: 'Comunidad'
                    }
                }
            }
        },

        /* ======================================================
           RUTA 4: LEO PARA CREAR
           Nivel no disponible: inicial
           (no tiene actividades propias para 0-2 años)
           ====================================================== */
        ruta4: {
            id: 'ruta4',
            numero: 4,
            nombre: 'LEO para crear',
            lema: 'LEO para sembrar palabras y cosechar mundos.',
            proposito: 'Producir textos propios, expresarse, crear, encontrar la propia voz. Que las y los estudiantes no solo lean, sino que escriban con disfrute, con intención estética, con voz propia.',
            criterios: [
                'Que inviten a producir textos propios.',
                'Que conecten lectura y escritura.',
                'Que cultiven creatividad, honestidad, perseverancia, claridad.'
            ],
            virtudes: ['Creatividad', 'Honestidad', 'Perseverancia', 'Claridad'],
            preguntaOrientadora: '¿Necesitamos que produzcan textos propios?',
            subtituloPregunta: 'Atiende: escritura creativa, voz propia, producción de textos.',
            duracion: 'Todo el ciclo escolar, con énfasis en el segundo y tercer trimestre.',
            datosJustificacion: {
                primaria: {
                    ua: 'UA 3 · Localizar y extraer información',
                    porcentaje: 47.9,
                    grado: '6°',
                    texto: 'En 6° de primaria, solo el 47.9% localiza y extrae información. La producción escrita propia es la cara complementaria de la comprensión lectora.'
                },
                secundaria: {
                    ua: 'UA 1 · Analizar la estructura de los textos',
                    porcentaje: 47.9,
                    grado: '3°',
                    texto: 'En 3° de secundaria, solo el 47.9% analiza la estructura de los textos. Producir textos propios consolida la comprensión de la estructura textual.'
                }
            },
            niveles: {
                'inicial': {
                    disponible: false,
                    razonNoDisponible: 'La producción de textos propios no aplica para bebés de 0 a 2 años. Las actividades del documento consolidado son las mismas que la Ruta 1 (comprender). Te sugerimos elegir Ruta 1 (comprender) o Ruta 2 (imaginar) para este nivel.'
                },
                'preescolar': {
                    anclas: [
                        {
                            nombre: 'Dibujo mi cuento',
                            descripcion: 'Después de escuchar un cuento, los niños dibujan lo que más les gustó. La educadora escribe lo que dictan.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'Cantamos y escribimos',
                            descripcion: 'Los niños cantan una canción breve y dictan la letra para que la educadora la escriba.',
                            frecuencia: 'Semanal',
                            virtud: 'Vínculo'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Historias con tres imágenes',
                            descripcion: 'La educadora muestra tres imágenes sin relación. Los niños inventan una historia que las conecte.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Cuentos con títeres de palito',
                            descripcion: 'Después de leer un cuento, los niños lo representan con títeres de palito.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Palabras que vuelan',
                            descripcion: 'La educadora dice una palabra y los niños responden con otra que se les ocurra.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Dictado de palabras cariñosas',
                            descripcion: 'Los niños dicen palabras bonitas. La educadora las escribe y ellos las copian o dibujan.',
                            frecuencia: 'Semanal',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'El tren de los nombres',
                            descripcion: 'Cada niño escribe su nombre en un vagón de papel. Se forma un tren y se leen en voz alta.',
                            frecuencia: 'Quincenal',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Cuentos con objetos cotidianos',
                            descripcion: 'La educadora narra una historia usando objetos cotidianos. Los niños crean las suyas.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'El tendedero de cuentos',
                            descripcion: 'Después de leer un cuento, los niños dibujan escenas y las cuelgan en orden en un tendedero.',
                            frecuencia: 'Quincenal',
                            virtud: 'Claridad'
                        }
                    ],
                    cierre: {
                        nombre: 'Fiesta de cuentos (Día del Niño)',
                        descripcion: 'Jornada de narración oral con participación de familias. Cada familia comparte un cuento.',
                        frecuencia: 'Anual',
                        virtud: 'Comunidad'
                    }
                },
                'primaria-baja': {
                    anclas: [
                        {
                            nombre: 'Juegos de escritura creativa',
                            descripcion: 'A partir de consignas breves, escriben finales alternativos, cartas a personajes, nuevas aventuras.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Diario de lecturas',
                            descripcion: 'Cada estudiante registra los libros leídos, escribe una frase y hace un dibujo.',
                            frecuencia: 'Semanal',
                            virtud: 'Claridad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'La ruleta de los cuentos',
                            descripcion: 'Una ruleta con personajes, lugares y objetos. Crean un cuento con los tres elementos.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Dictado creativo',
                            descripcion: 'El docente dicta el inicio de una historia. Los estudiantes la completan.',
                            frecuencia: 'Semanal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'El museo de los personajes',
                            descripcion: 'Dibujan un personaje de un libro leído y escriben tres datos sobre él. Se exhiben.',
                            frecuencia: 'Mensual',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Recomendación estelar',
                            descripcion: 'Cada viernes, un estudiante recomienda un libro al grupo explicando por qué.',
                            frecuencia: 'Semanal',
                            virtud: 'Generosidad'
                        },
                        {
                            nombre: 'Palabras que crecen',
                            descripcion: 'A partir de una palabra base, agregan letras para formar nuevas palabras.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Fichero de palabras nuevas',
                            descripcion: 'Cada estudiante anota palabras nuevas que encuentra al leer, con definición.',
                            frecuencia: 'Semanal',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Lectura en parejas con cambio de voz',
                            descripcion: 'En parejas, leen un diálogo con diferentes emociones.',
                            frecuencia: 'Semanal',
                            virtud: 'Empatía'
                        }
                    ],
                    cierre: {
                        nombre: 'Círculo de lectores',
                        descripcion: 'Conversación mensual sobre un libro leído en común con preguntas abiertas.',
                        frecuencia: 'Mensual',
                        virtud: 'Respeto'
                    }
                },
                'primaria-alta': {
                    anclas: [
                        {
                            nombre: 'Club de escritores',
                            descripcion: 'Espacio semanal para escribir y compartir textos propios. El docente escribe junto con ellos.',
                            frecuencia: 'Semanal',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Escritura de microrrelatos',
                            descripcion: 'A partir de una imagen, frase o palabra, escriben un microrrelato de máximo 150 palabras.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Poema colectivo',
                            descripcion: 'Cada estudiante escribe un verso. Se juntan todos y se arma un poema colectivo.',
                            frecuencia: 'Mensual',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Construir un personaje',
                            descripcion: 'Crean un personaje a partir de preguntas guía y escriben una historia con él.',
                            frecuencia: 'Quincenal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Cartas a personajes',
                            descripcion: 'Después de leer un libro, escriben una carta a uno de los personajes.',
                            frecuencia: 'Mensual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Diccionario de autor',
                            descripcion: 'Cada estudiante elige cinco palabras que definan su estilo como escritor.',
                            frecuencia: 'Mensual',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Carta al autor',
                            descripcion: 'Escriben una carta al autor de un libro contándole qué les pareció.',
                            frecuencia: 'Mensual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Mapa de mi historia',
                            descripcion: 'Dibujan un mapa del lugar donde transcurre el libro que están leyendo.',
                            frecuencia: 'Mensual',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Reseña en 100 palabras',
                            descripcion: 'Escriben una reseña de exactamente 100 palabras después de leer un libro.',
                            frecuencia: 'Quincenal',
                            virtud: 'Claridad'
                        }
                    ],
                    cierre: {
                        nombre: 'Maratón de lectura',
                        descripcion: 'Jornada completa dedicada a la lectura en todos los espacios de la escuela.',
                        frecuencia: 'Trimestral',
                        virtud: 'Comunidad'
                    }
                },
                'secundaria': {
                    anclas: [
                        {
                            nombre: 'Club de escritores',
                            descripcion: 'Espacio semanal para escribir y compartir textos propios. El docente escribe junto con ellos.',
                            frecuencia: 'Semanal',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Escritura de microrrelatos',
                            descripcion: 'A partir de una imagen, frase o palabra, escriben un microrrelato de máximo 150 palabras.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Podcast literario',
                            descripcion: 'Graban un breve podcast recomendando un libro, con música y efectos de sonido.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Cadáver exquisito',
                            descripcion: 'En grupo, cada estudiante escribe una línea sin ver lo que escribió el anterior.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Contraportada',
                            descripcion: 'Escriben la contraportada de un libro que aún no existe, con título, sinopsis y frase gancho.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Taller de spoken word',
                            descripcion: 'Crean e interpretan textos poéticos para ser dichos en voz alta.',
                            frecuencia: 'Mensual',
                            virtud: 'Valentía'
                        },
                        {
                            nombre: 'Manifiesto lector',
                            descripcion: 'Escriben su manifiesto personal como lectores: qué leen, por qué, qué nunca leerían.',
                            frecuencia: 'Trimestral',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Carta a mi yo lector del pasado',
                            descripcion: 'Escriben una carta a sí mismos cuando eran niños sobre lo que la lectura les ha dado.',
                            frecuencia: 'Anual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Club de traducción de canciones',
                            descripcion: 'Eligen una canción en otro idioma, la traducen y analizan la letra.',
                            frecuencia: 'Quincenal',
                            virtud: 'Curiosidad'
                        }
                    ],
                    cierre: {
                        nombre: 'Slam de poesía (Día Mundial de la Poesía)',
                        descripcion: 'Los estudiantes escriben poemas y los interpretan frente al grupo. El público vota.',
                        frecuencia: 'Anual',
                        virtud: 'Valentía'
                    }
                },
                'docentes': {
                    anclas: [
                        {
                            nombre: 'Escritura de la práctica',
                            descripcion: 'Cada docente escribe un breve registro de una experiencia lectora exitosa en su aula.',
                            frecuencia: 'Mensual',
                            virtud: 'Responsabilidad'
                        },
                        {
                            nombre: 'Cartelera de docentes lectores',
                            descripcion: 'Un espacio en la sala de maestros donde cada docente recomienda un libro con una breve reseña.',
                            frecuencia: 'Mensual',
                            virtud: 'Generosidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'El libro que me transformó',
                            descripcion: 'Cada mes, un docente comparte en cinco minutos el libro que marcó su vida como lector.',
                            frecuencia: 'Mensual',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Tertulia pedagógica',
                            descripcion: 'Lectura y discusión de un artículo o capítulo sobre didáctica de la lectura.',
                            frecuencia: 'Mensual',
                            virtud: 'Perseverancia'
                        },
                        {
                            nombre: 'Círculo de lectores docentes',
                            descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                            frecuencia: 'Trimestral',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Club de traducción pedagógica',
                            descripcion: 'Los docentes eligen un texto breve en otro idioma sobre educación, lo traducen y lo comentan.',
                            frecuencia: 'Mensual',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Maratón de lectura docente',
                            descripcion: 'Jornada donde cada docente lee un fragmento de su libro favorito frente a la comunidad escolar.',
                            frecuencia: 'Anual',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Lectura en voz alta entre colegas',
                            descripcion: 'Un docente lee en voz alta un texto breve al inicio del CTE. Los demás escuchan y comparten impresiones.',
                            frecuencia: 'CTE',
                            virtud: 'Vínculo'
                        }
                    ],
                    cierre: {
                        nombre: 'Círculo de lectores docentes',
                        descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                        frecuencia: 'Trimestral',
                        virtud: 'Comunidad'
                    }
                }
            }
        },

        /* ======================================================
           RUTA 5: LEO EN COMUNIDAD
           ====================================================== */
        ruta5: {
            id: 'ruta5',
            numero: 5,
            nombre: 'LEO en comunidad',
            lema: 'LEO para tejer la red que nos sostiene.',
            proposito: 'Construir un ecosistema lector donde la escuela, la familia, la comunidad y el entorno digital se articulen para que la lectura ocurra, se profundice y se celebre en todos los espacios de vida.',
            criterios: [
                'Que conecten con la comunidad y las familias.',
                'Que inviten a leer en voz alta, a compartir, a conversar.',
                'Que cultiven vínculo, empatía, generosidad, comunidad.'
            ],
            virtudes: ['Vínculo', 'Empatía', 'Generosidad', 'Comunidad'],
            preguntaOrientadora: '¿Necesitamos fortalecer el vínculo con familias y comunidad?',
            subtituloPregunta: 'Atiende: ecosistema lector, participación familiar, lectura compartida.',
            duracion: 'Todo el ciclo escolar, con énfasis en el primer y tercer trimestre.',
            datosJustificacion: {
                primaria: {
                    ua: 'UA 2 · Integrar información y realizar inferencias',
                    porcentaje: 44.9,
                    grado: '6°',
                    texto: 'En 6° de primaria, solo el 44.9% integra información y realiza inferencias. La lectura compartida en familia es uno de los predictores más fuertes de la comprensión lectora.'
                },
                secundaria: {
                    ua: 'UA 3 · Localizar y extraer información',
                    porcentaje: 51.9,
                    grado: '3°',
                    texto: 'En 3° de secundaria, solo el 51.9% localiza y extrae información. Fortalecer el vínculo escuela-familia-comunidad amplía las oportunidades de lectura significativa.'
                }
            },
            niveles: {
                'inicial': {
                    anclas: [
                        {
                            nombre: 'Cantos y arrullos',
                            descripcion: 'La educadora canta nanas y canciones de cuna mientras mece al bebé.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Lectura de imágenes con señalamiento',
                            descripcion: 'La educadora muestra libros con imágenes grandes, señala y nombra cada elemento.',
                            frecuencia: 'Diaria',
                            virtud: 'Atención'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Juego de espejo sonoro',
                            descripcion: 'La educadora emite sonidos y espera a que el bebé los imite.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Baño de palabras',
                            descripcion: 'La educadora describe en voz alta todo lo que hace durante el cuidado del bebé.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Ritmo y movimiento con palabras',
                            descripcion: 'La educadora recita rimas marcando el ritmo con palmadas o moviendo al bebé suavemente.',
                            frecuencia: 'Diaria',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Narración con títeres de dedo',
                            descripcion: 'La educadora narra pequeñas historias usando títeres de dedo.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'Sonidos que cuentan',
                            descripcion: 'La educadora asocia sonidos cotidianos con pequeñas historias.',
                            frecuencia: 'Diaria',
                            virtud: 'Atención'
                        }
                    ],
                    cierre: {
                        nombre: 'Fiesta de nanas y arrullos (Día de las Madres)',
                        descripcion: 'Invitación a familias para compartir nanas y cantos tradicionales con sus bebés.',
                        frecuencia: 'Anual',
                        virtud: 'Comunidad'
                    }
                },
                'preescolar': {
                    anclas: [
                        {
                            nombre: 'Lectura compartida en parejas',
                            descripcion: 'Un niño mayor lee a uno menor. La educadora supervisa y apoya.',
                            frecuencia: 'Semanal',
                            virtud: 'Generosidad'
                        },
                        {
                            nombre: 'El libro viajero',
                            descripcion: 'Un libro álbum viaja cada fin de semana a una familia. El lunes, el niño cuenta lo que leyó.',
                            frecuencia: 'Semanal',
                            virtud: 'Vínculo'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'El tren de los nombres',
                            descripcion: 'Cada niño escribe su nombre en un vagón de papel. Se forma un tren y se leen en voz alta.',
                            frecuencia: 'Quincenal',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Lectura de imágenes',
                            descripcion: 'Los niños "leen" las ilustraciones de libros sin texto, construyendo hipótesis narrativas.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'El mural de las emociones',
                            descripcion: 'Después de leer un cuento, los niños dibujan su cara expresando una emoción del personaje.',
                            frecuencia: 'Quincenal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Ofrenda de palabras (Día de Muertos)',
                            descripcion: 'Los niños dibujan y dictan recuerdos de familiares. Se colocan en una ofrenda del aula.',
                            frecuencia: 'Anual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Cuentos con títeres de palito',
                            descripcion: 'Después de leer un cuento, los niños lo representan con títeres de palito.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Cantamos y escribimos',
                            descripcion: 'Los niños cantan una canción breve y dictan la letra para que la educadora la escriba.',
                            frecuencia: 'Semanal',
                            virtud: 'Vínculo'
                        }
                    ],
                    cierre: {
                        nombre: 'Fiesta de cuentos (Día del Niño)',
                        descripcion: 'Jornada de narración oral con participación de familias. Cada familia comparte un cuento.',
                        frecuencia: 'Anual',
                        virtud: 'Comunidad'
                    }
                },
                'primaria-baja': {
                    anclas: [
                        {
                            nombre: 'Lector invitado',
                            descripcion: 'Cada semana, un familiar o miembro de la comunidad lee en voz alta al grupo.',
                            frecuencia: 'Semanal',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Lectura en voz alta diaria',
                            descripcion: 'El docente lee en voz alta un texto literario al inicio de la jornada.',
                            frecuencia: 'Diaria',
                            virtud: 'Perseverancia'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'El libro viajero',
                            descripcion: 'Un libro álbum viaja cada fin de semana a una familia. El lunes, el niño cuenta lo que leyó.',
                            frecuencia: 'Semanal',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Recomendación estelar',
                            descripcion: 'Cada viernes, un estudiante recomienda un libro al grupo explicando por qué.',
                            frecuencia: 'Semanal',
                            virtud: 'Generosidad'
                        },
                        {
                            nombre: 'El museo de los personajes',
                            descripcion: 'Dibujan un personaje de un libro leído y escriben tres datos sobre él. Se exhiben.',
                            frecuencia: 'Mensual',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Lectura en parejas con cambio de voz',
                            descripcion: 'En parejas, leen un diálogo con diferentes emociones.',
                            frecuencia: 'Semanal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Círculo de lectores',
                            descripcion: 'Conversación mensual sobre un libro leído en común con preguntas abiertas.',
                            frecuencia: 'Mensual',
                            virtud: 'Respeto'
                        },
                        {
                            nombre: 'Palabras en el aire',
                            descripcion: 'El docente dice una categoría. Los estudiantes dicen palabras en cadena sin repetir.',
                            frecuencia: 'Semanal',
                            virtud: 'Atención'
                        },
                        {
                            nombre: 'Dibujo dictado',
                            descripcion: 'El docente lee un texto descriptivo. Los estudiantes dibujan lo que escuchan y comparan.',
                            frecuencia: 'Quincenal',
                            virtud: 'Claridad'
                        }
                    ],
                    cierre: {
                        nombre: 'Periódico mural del Día del Libro',
                        descripcion: 'Elaboración colectiva de un periódico mural con recomendaciones de libros y textos creativos.',
                        frecuencia: 'Anual',
                        virtud: 'Comunidad'
                    }
                },
                'primaria-alta': {
                    anclas: [
                        {
                            nombre: 'Tertulia literaria',
                            descripcion: 'Conversación mensual sobre un libro leído por todos, compartiendo impresiones.',
                            frecuencia: 'Mensual',
                            virtud: 'Respeto'
                        },
                        {
                            nombre: 'Maratón de lectura',
                            descripcion: 'Jornada completa dedicada a la lectura en todos los espacios de la escuela.',
                            frecuencia: 'Trimestral',
                            virtud: 'Comunidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'El árbol de los libros',
                            descripcion: 'Un árbol dibujado en el mural. Cada estudiante coloca una hoja con el título que leyó.',
                            frecuencia: 'Quincenal',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Noticias de mi comunidad',
                            descripcion: 'Escriben crónicas breves sobre eventos de su comunidad para un periódico escolar.',
                            frecuencia: 'Quincenal',
                            virtud: 'Responsabilidad'
                        },
                        {
                            nombre: 'Poema colectivo',
                            descripcion: 'Cada estudiante escribe un verso. Se juntan todos y se arma un poema colectivo.',
                            frecuencia: 'Mensual',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Semana de autores jaliscienses',
                            descripcion: 'Cada día se lee y comenta un texto de un autor jalisciense. El cierre incluye cartas a los autores.',
                            frecuencia: 'Anual',
                            virtud: 'Comunidad'
                        },
                        {
                            nombre: 'Entrevista a un personaje',
                            descripcion: 'Por parejas, un estudiante asume el rol de un personaje y el otro lo entrevista.',
                            frecuencia: 'Quincenal',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Cartas a personajes',
                            descripcion: 'Después de leer un libro, escriben una carta a uno de los personajes.',
                            frecuencia: 'Mensual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'El debate del libro',
                            descripcion: 'Dos estudiantes defienden por qué su libro favorito es mejor, con argumentos y sin descalificar.',
                            frecuencia: 'Quincenal',
                            virtud: 'Respeto'
                        }
                    ],
                    cierre: {
                        nombre: 'Maratón de lectura',
                        descripcion: 'Jornada completa dedicada a la lectura en todos los espacios de la escuela.',
                        frecuencia: 'Trimestral',
                        virtud: 'Comunidad'
                    }
                },
                'secundaria': {
                    anclas: [
                        {
                            nombre: 'Club de lectura juvenil',
                            descripcion: 'Se reúnen voluntariamente para leer y conversar sobre libros.',
                            frecuencia: 'Semanal',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Círculo de silencio lector',
                            descripcion: 'Veinte minutos de lectura individual en absoluto silencio. Al final, escriben una frase.',
                            frecuencia: 'Semanal',
                            virtud: 'Autodisciplina'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'Tertulia literaria',
                            descripcion: 'Conversación mensual sobre un libro leído por todos, compartiendo impresiones.',
                            frecuencia: 'Mensual',
                            virtud: 'Respeto'
                        },
                        {
                            nombre: 'Mapa del tesoro literario',
                            descripcion: 'Diseñan un mapa del tesoro donde las pistas son fragmentos de libros leídos.',
                            frecuencia: 'Mensual',
                            virtud: 'Generosidad'
                        },
                        {
                            nombre: 'Podcast literario',
                            descripcion: 'Graban un breve podcast recomendando un libro, con música y efectos de sonido.',
                            frecuencia: 'Quincenal',
                            virtud: 'Creatividad'
                        },
                        {
                            nombre: 'Carta a mi yo lector del pasado',
                            descripcion: 'Escriben una carta a sí mismos cuando eran niños sobre lo que la lectura les ha dado.',
                            frecuencia: 'Anual',
                            virtud: 'Empatía'
                        },
                        {
                            nombre: 'Manifiesto lector',
                            descripcion: 'Escriben su manifiesto personal como lectores: qué leen, por qué, qué nunca leerían.',
                            frecuencia: 'Trimestral',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Cineminuto literario',
                            descripcion: 'En un minuto, un estudiante cuenta de qué trata un libro y por qué lo recomienda.',
                            frecuencia: 'Semanal',
                            virtud: 'Claridad'
                        },
                        {
                            nombre: 'Taller de spoken word',
                            descripcion: 'Crean e interpretan textos poéticos para ser dichos en voz alta.',
                            frecuencia: 'Mensual',
                            virtud: 'Valentía'
                        }
                    ],
                    cierre: {
                        nombre: 'Slam de poesía (Día Mundial de la Poesía)',
                        descripcion: 'Los estudiantes escriben poemas y los interpretan frente al grupo. El público vota.',
                        frecuencia: 'Anual',
                        virtud: 'Valentía'
                    }
                },
                'docentes': {
                    anclas: [
                        {
                            nombre: 'Lectura en voz alta entre colegas',
                            descripcion: 'Un docente lee en voz alta un texto breve al inicio del CTE. Los demás escuchan y comparten impresiones.',
                            frecuencia: 'CTE',
                            virtud: 'Vínculo'
                        },
                        {
                            nombre: 'Círculo de lectores docentes',
                            descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                            frecuencia: 'Trimestral',
                            virtud: 'Comunidad'
                        }
                    ],
                    banco: [
                        {
                            nombre: 'El libro que me transformó',
                            descripcion: 'Cada mes, un docente comparte en cinco minutos el libro que marcó su vida como lector.',
                            frecuencia: 'Mensual',
                            virtud: 'Honestidad'
                        },
                        {
                            nombre: 'Tertulia pedagógica',
                            descripcion: 'Lectura y discusión de un artículo o capítulo sobre didáctica de la lectura.',
                            frecuencia: 'Mensual',
                            virtud: 'Perseverancia'
                        },
                        {
                            nombre: 'Escritura de la práctica',
                            descripcion: 'Cada docente escribe un breve registro de una experiencia lectora exitosa en su aula.',
                            frecuencia: 'Mensual',
                            virtud: 'Responsabilidad'
                        },
                        {
                            nombre: 'Cartelera de docentes lectores',
                            descripcion: 'Un espacio en la sala de maestros donde cada docente recomienda un libro con una breve reseña.',
                            frecuencia: 'Mensual',
                            virtud: 'Generosidad'
                        },
                        {
                            nombre: 'Club de traducción pedagógica',
                            descripcion: 'Los docentes eligen un texto breve en otro idioma sobre educación, lo traducen y lo comentan.',
                            frecuencia: 'Mensual',
                            virtud: 'Curiosidad'
                        },
                        {
                            nombre: 'Maratón de lectura docente',
                            descripcion: 'Jornada donde cada docente lee un fragmento de su libro favorito frente a la comunidad escolar.',
                            frecuencia: 'Anual',
                            virtud: 'Comunidad'
                        }
                    ],
                    cierre: {
                        nombre: 'Círculo de lectores docentes',
                        descripcion: 'El colectivo elige un libro literario para leer durante el trimestre. Se comenta en una sesión final.',
                        frecuencia: 'Trimestral',
                        virtud: 'Comunidad'
                    }
                }
            }
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
            { id: 'p1', pregunta: '¿A la mayoría de los estudiantes les gusta leer?', opciones: ['Mucho', 'Algo', 'Poco', 'Nada'], dimension: 'gusto' },
            { id: 'p2', pregunta: '¿Con qué frecuencia leen por gusto?', opciones: ['Diario', 'Semanal', 'Mensual', 'Casi nunca'], dimension: 'frecuencia' },
            { id: 'p3', pregunta: '¿Qué tipos de texto prefieren?', opciones: ['Cuentos', 'Cómics', 'Poemas', 'Noticias', 'Libros informativos', 'Revistas', 'Otros'], dimension: 'diversidad', multiple: true },
            { id: 'p4', pregunta: '¿Dónde leen con más frecuencia?', opciones: ['Aula', 'Casa', 'Biblioteca', 'Patio', 'Espacios comunitarios', 'Otros'], dimension: 'espacios', multiple: true },
            { id: 'p5', pregunta: '¿Con quién comparten lo que leen?', opciones: ['Solos', 'Compañeros', 'Docentes', 'Familia', 'Amigos', 'Otros'], dimension: 'lecturaCompartida', multiple: true }
        ],
        familias: [
            { id: 'p6', pregunta: '¿Con qué frecuencia leen las familias con sus hijos?', opciones: ['Diario', 'Semanal', 'Mensual', 'Casi nunca'], dimension: 'lecturaFamilia' },
            { id: 'p7', pregunta: '¿Cuántos libros hay en casa, en promedio?', opciones: ['0-5', '6-15', '16-30', 'Más de 30'], dimension: 'librosCasa' },
            { id: 'p8', pregunta: '¿Las familias participan en actividades de lectura?', opciones: ['Mucho', 'Algo', 'Poco', 'Nada'], dimension: 'participacionFamiliar' },
            { id: 'p9', pregunta: '¿Qué tipos de texto leen las familias?', opciones: ['Cuentos', 'Noticias', 'Revistas', 'Libros', 'Textos escolares', 'Redes sociales', 'Otros'], dimension: 'diversidad', multiple: true }
        ],
        docentes: [
            { id: 'p10', pregunta: '¿Los docentes usan la biblioteca escolar?', opciones: ['Mucho', 'Algo', 'Poco', 'Nada'], dimension: 'biblioteca' },
            { id: 'p11', pregunta: '¿Cuánto tiempo semanal dedican a lectura en el aula?', opciones: ['Menos de 30 min', '30-60 min', '1-2 horas', 'Más de 2 horas'], dimension: 'tiempoAula' },
            { id: 'p12', pregunta: '¿Qué materiales de lectura tienen disponibles?', opciones: ['Libros de texto', 'Libros de biblioteca', 'Cuentos', 'Revistas', 'Periódicos', 'Material digital', 'Materiales propios', 'Otros'], dimension: 'materiales', multiple: true },
            { id: 'p13', pregunta: '¿Qué obstáculos enfrentan para fomentar la lectura?', opciones: ['Falta de materiales', 'Falta de tiempo', 'Falta de espacio', 'Poco interés de estudiantes', 'Poca participación de familias', 'Otros'], dimension: 'obstaculos', multiple: true }
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
        alertaRutaUnica: 'Han seleccionado una ruta para el trimestre. Si quieren trabajar más de una, consideren distribuirla en otro trimestre.'
    },

    /* ========================================================
       13. MOMENTO 3: HOJA DE RUTA TRIMESTRAL
       ======================================================== */
    momento3: {
        meses: [
            { id: 'septiembre', nombre: 'Septiembre', numero: 9 },
            { id: 'octubre', nombre: 'Octubre', numero: 10 },
            { id: 'noviembre', nombre: 'Noviembre', numero: 11 }
        ],
        semanas: {
            septiembre: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            octubre: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            noviembre: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']
        },
        tiposActividad: [
            { id: 'ancla', nombre: 'Ancla', descripcion: 'Actividad obligatoria, permanente todo el trimestre.', color: 'carmesi' },
            { id: 'banco', nombre: 'Banco', descripcion: 'Actividad seleccionada del banco de la ruta.', color: 'naranja' },
            { id: 'cierre', nombre: 'Cierre', descripcion: 'Actividad especial que integra lo trabajado en el trimestre.', color: 'verde' },
            { id: 'personalizada', nombre: 'Personalizada', descripcion: 'Actividad agregada por el colectivo.', color: 'gris' }
        ],
        estadosImplementacion: [
            { id: 'no-iniciada', nombre: 'No iniciada', color: 'gris' },
            { id: 'en-proceso', nombre: 'En proceso', color: 'amarillo' },
            { id: 'completada', nombre: 'Completada', color: 'verde' },
            { id: 'reprogramada', nombre: 'Reprogramada', color: 'rojo' }
        ],
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
       14. MODO DEMO
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
        rutaSeleccionada: 'ruta1',
        bancoSeleccionado: ['Círculo de lectura semanal', 'Reseña en 100 palabras'],
        cierreMes: 'noviembre'
    }
};

// ============================================================
// EXPORTAR (para uso en otros módulos)
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DATOS;
}
