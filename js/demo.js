/* ============================================================
   PLAN LECTOR JALISCO LEO
   demo.js — Modo Demo: carga datos de ejemplo en toda la app
   v1.0 — Rellena Identificación, Línea Base, SAAL, Voces,
          Termómetro, Momento 3, 4 y 5 con datos coherentes
   ============================================================
   Expone: window.DEMO = { cargar, limpiar, estaActivo }
   Patrón de la casa: defensivo + window.X = X;
   ============================================================ */

const DEMO = (function() {

    const CLAVE_FLAG = 'plan_lector_jalisco_leo_demo_mode';

    function mostrarToast(mensaje, tipo) {
        if (typeof App !== 'undefined' && typeof App.mostrarToast === 'function') {
            try { App.mostrarToast(mensaje, tipo); return; } catch (e) { /* silencio */ }
        }
        console.log(`[Toast ${tipo || 'info'}] ${mensaje}`);
    }

    /* ========================================================
       DATOS DE EJEMPLO
       ======================================================== */

    // --- IDENTIFICACIÓN ---
    const DEMO_IDENTIFICACION = {
        region: 'Región 12 · Centro',
        municipio: 'Guadalajara',
        cct: '14DPR0001A',
        nombreEscuela: 'Escuela Primaria Benito Juárez',
        turno: 'Matutino',
        nivel: 'primaria-alta',
        grados: ['4°', '5°', '6°'],
        numeroEstudiantes: '180',
        director: 'María López Hernández',
        atp: 'Juan Pérez Ramírez',
        fechaCTE: '2026-09-25',
        modoLlenado: 'colectivo'
    };

    // --- LÍNEA BASE ---
    const DEMO_LINEA_BASE = {
        datosEscuela: [
            { grado: '4°', media: 44.5, deseable: 5.2,  enProgreso: 76.9, atencionPrioritaria: 17.9 },
            { grado: '5°', media: 47.8, deseable: 8.9,  enProgreso: 79.5, atencionPrioritaria: 11.6 },
            { grado: '6°', media: 45.4, deseable: 11.2, enProgreso: 69.6, atencionPrioritaria: 19.2 }
        ],
        observaciones: 'Grupo con buena disposición. Se requiere reforzar comprensión inferencial y fluidez.'
    };

    // --- SAAL ---
    const DEMO_SAAL = {
        tieneSAAL: 'si',
        otrosDiagnosticos: 'Se aplicó SAAL en 4° y 5° durante septiembre.',
        resumenGrados: [],
        componentesDebiles: {
            comprension: true,
            precision: true,
            palabrasComplejas: true
        },
        observaciones: 'Los componentes con mayor oportunidad son comprensión inferencial y precisión.'
    };

    // --- VOCES ---
    const DEMO_VOCES = {
        estudiantes: {
            p1: 'Algo',
            p2: 'Semanal',
            p3: ['Cuentos', 'Cómics'],
            p4: ['Aula', 'Casa'],
            p5: ['Compañeros', 'Familia']
        },
        familias: {
            p6: 'Semanal',
            p7: '6-15',
            p8: 'Algo',
            p9: ['Cuentos', 'Noticias']
        },
        docentes: {
            p10: 'Algo',
            p11: '30-60 min',
            p12: ['Libros de biblioteca', 'Cuentos', 'Material digital'],
            p13: ['Falta de tiempo', 'Poca participación de familias']
        },
        sintesis: {}
    };

    // --- TERMÓMETRO ---
    // 18 dimensiones con niveles coherentes (rojo = atención, amarillo = en progreso, verde = fortaleza)
    const DEMO_TERMOMETRO = {
        dimensiones: {
            comprension:         'rojo',
            fluidez:             'amarillo',
            precision:           'rojo',
            usoVoz:              'amarillo',
            seguridad:           'verde',
            palabrasComplejas:   'amarillo',
            gusto:               'amarillo',
            frecuencia:          'rojo',
            diversidad:          'amarillo',
            espacios:            'verde',
            lecturaCompartida:   'verde',
            lecturaFamilia:      'rojo',
            librosCasa:          'rojo',
            participacionFamiliar: 'amarillo',
            biblioteca:          'amarillo',
            tiempoAula:          'amarillo',
            materiales:          'verde',
            obstaculos:          'rojo'
        },
        ajustes: {},
        lecturaAutomatica: {
            fortalezas: [
                { id: 'seguridad',         nombre: 'Seguridad y disposición' },
                { id: 'espacios',          nombre: 'Espacios de lectura' },
                { id: 'lecturaCompartida', nombre: 'Lectura compartida' },
                { id: 'materiales',        nombre: 'Materiales disponibles' }
            ],
            enProgreso: [
                { id: 'fluidez',            nombre: 'Fluidez lectora' },
                { id: 'usoVoz',             nombre: 'Uso de la voz' },
                { id: 'palabrasComplejas',  nombre: 'Atención a palabras complejas' },
                { id: 'gusto',              nombre: 'Gusto por la lectura' },
                { id: 'diversidad',         nombre: 'Diversidad de textos' },
                { id: 'participacionFamiliar', nombre: 'Participación familiar' },
                { id: 'biblioteca',         nombre: 'Uso de biblioteca' },
                { id: 'tiempoAula',         nombre: 'Tiempo en aula' }
            ],
            atencionPrioritaria: [
                { id: 'comprension',    nombre: 'Comprensión lectora' },
                { id: 'precision',      nombre: 'Precisión' },
                { id: 'frecuencia',     nombre: 'Frecuencia de lectura' },
                { id: 'lecturaFamilia', nombre: 'Lectura en familia' },
                { id: 'librosCasa',     nombre: 'Libros en casa' },
                { id: 'obstaculos',     nombre: 'Obstáculos' }
            ],
            prioridades: [
                { id: 'comprension',    nombre: 'Comprensión lectora' },
                { id: 'precision',      nombre: 'Precisión' },
                { id: 'frecuencia',     nombre: 'Frecuencia de lectura' },
                { id: 'lecturaFamilia', nombre: 'Lectura en familia' },
                { id: 'librosCasa',     nombre: 'Libros en casa' },
                { id: 'obstaculos',     nombre: 'Obstáculos' }
            ]
        }
    };

    // --- MOMENTO 3 (Ruta 1, primaria-alta) ---
    // IDs estables para que responsables y bitácora apunten a ellos
    const IDS = {
        ancla1: 'act_demo_ancla_1',
        ancla2: 'act_demo_ancla_2',
        banco1: 'act_demo_banco_1',
        banco2: 'act_demo_banco_2',
        cierre: 'act_demo_cierre_1'
    };

    const DEMO_M3 = {
        seleccionRutas: {
            rutas: [],
            nivel: 'primaria-alta',
            rutaId: 'ruta1',
            bancoSeleccionado: ['Reseña en 100 palabras', 'Noticias del mundo'],
            cierreMes: 'noviembre',
            notas: 'Se eligió esta ruta porque el Termómetro mostró comprensión lectora en rojo y es la prioridad del colectivo.',
            confirmada: true,
            fechaConfirmacion: new Date().toISOString()
        },
        calendarizacion: {
            trimestre: 'primer',
            anio: new Date().getFullYear(),
            notas: 'Se acordó concentrar las actividades del banco en octubre para dar tiempo al arranque.',
            actividades: [
                {
                    id: IDS.ancla1,
                    rutaId: 'ruta1',
                    nombre: 'Círculo de lectura semanal',
                    descripcion: 'Lectura y discusión de un texto común, alternando roles (moderador, cronometrista, tomador de notas). El docente guía con preguntas abiertas.',
                    tipo: 'ancla',
                    frecuencia: 'Semanal',
                    virtud: 'Respeto',
                    mes: 'todo',
                    semana: '',
                    estado: 'en-proceso',
                    notas: ''
                },
                {
                    id: IDS.ancla2,
                    rutaId: 'ruta1',
                    nombre: 'Lectura de imágenes y predicción',
                    descripcion: 'Antes de leer, observan ilustraciones y predicen de qué tratará la historia.',
                    tipo: 'ancla',
                    frecuencia: 'Semanal',
                    virtud: 'Claridad',
                    mes: 'todo',
                    semana: '',
                    estado: 'en-proceso',
                    notas: ''
                },
                {
                    id: IDS.banco1,
                    rutaId: 'ruta1',
                    nombre: 'Reseña en 100 palabras',
                    descripcion: 'Escriben una reseña de exactamente 100 palabras después de leer un libro.',
                    tipo: 'banco',
                    frecuencia: 'Quincenal',
                    virtud: 'Claridad',
                    mes: 'octubre',
                    semana: 'Semana 2',
                    estado: 'no-iniciada',
                    notas: ''
                },
                {
                    id: IDS.banco2,
                    rutaId: 'ruta1',
                    nombre: 'Noticias del mundo',
                    descripcion: 'Cada semana, un estudiante trae una noticia, la lee y la comenta con el grupo.',
                    tipo: 'banco',
                    frecuencia: 'Semanal',
                    virtud: 'Pensamiento crítico',
                    mes: 'octubre',
                    semana: 'Semana 3',
                    estado: 'no-iniciada',
                    notas: ''
                },
                {
                    id: IDS.cierre,
                    rutaId: 'ruta1',
                    nombre: 'Tertulia literaria',
                    descripcion: 'Conversación mensual sobre un libro leído por todos, compartiendo impresiones.',
                    tipo: 'cierre',
                    frecuencia: 'Mensual',
                    virtud: 'Respeto',
                    mes: 'noviembre',
                    semana: 'Semana 3',
                    estado: 'no-iniciada',
                    notas: ''
                }
            ]
        },
        responsables: {
            asignaciones: [
                { actividadId: IDS.ancla1, rol: 'Docente de grupo',                 nombre: 'María López Hernández', correo: '', fechaAsignacion: new Date().toISOString() },
                { actividadId: IDS.ancla2, rol: 'Docente de Lengua y Literatura',   nombre: 'Juan Pérez Ramírez',   correo: '', fechaAsignacion: new Date().toISOString() },
                { actividadId: IDS.banco1, rol: 'Docente de grupo',                 nombre: 'María López Hernández', correo: '', fechaAsignacion: new Date().toISOString() },
                { actividadId: IDS.banco2, rol: 'Docente de otra asignatura',       nombre: 'Ana Ruiz Cortés',      correo: '', fechaAsignacion: new Date().toISOString() },
                { actividadId: IDS.cierre, rol: 'Bibliotecario(a)',                 nombre: 'Carlos Mendoza',       correo: '', fechaAsignacion: new Date().toISOString() }
            ],
            notas: 'Las anclas quedan a cargo de los docentes titulares de cada grupo.'
        },
        bitacora: {
            registros: [
                {
                    id: 'bit_demo_1',
                    actividadId: IDS.ancla1,
                    fecha: '2026-09-20',
                    estado: 'en-proceso',
                    participantes: 'Grupos 4°A, 5°A, 6°A',
                    observaciones: 'El círculo de lectura arrancó con buena participación. Los estudiantes piden más tiempo de discusión.',
                    evidencias: ['Fotografía', 'Lista de asistencia'],
                    fechaRegistro: new Date().toISOString()
                },
                {
                    id: 'bit_demo_2',
                    actividadId: IDS.ancla1,
                    fecha: '2026-10-18',
                    estado: 'en-proceso',
                    participantes: 'Grupos 4°A, 5°A, 6°A',
                    observaciones: 'Se consolidó la rotación de roles. Aún cuesta que respeten el turno del moderador.',
                    evidencias: ['Fotografía'],
                    fechaRegistro: new Date().toISOString()
                },
                {
                    id: 'bit_demo_3',
                    actividadId: IDS.ancla2,
                    fecha: '2026-09-27',
                    estado: 'en-proceso',
                    participantes: 'Grupos 4°A y 5°A',
                    observaciones: 'Las predicciones de los estudiantes sorprendieron: ya usan pistas del texto y de las imágenes.',
                    evidencias: ['Fotografía', 'Dibujo'],
                    fechaRegistro: new Date().toISOString()
                }
            ],
            notas: 'La bitácora se actualiza cada quince días con el colectivo.'
        },
        productos: {
            hojaRutaGenerada: false,
            fichasRutasGeneradas: false,
            cartaFamiliasGenerada: false,
            bitacoraGenerada: false
        }
    };

    // --- MOMENTO 4 ---
    const DEMO_M4 = {
        acuerdos: [
            {
                id: 'ac_demo_1',
                texto: 'Trabajar la Ruta 1 (LEO para comprender) durante todo el primer trimestre en los grados 4°, 5° y 6°.',
                responsables: 'Colectivo docente',
                fechaCompromiso: '2026-11-30',
                estado: 'en-proceso'
            },
            {
                id: 'ac_demo_2',
                texto: 'Socializar la Hoja de Ruta Trimestral con las familias en la primera reunión del trimestre.',
                responsables: 'Dirección y tutores de grupo',
                fechaCompromiso: '2026-10-15',
                estado: 'cumplido'
            },
            {
                id: 'ac_demo_3',
                texto: 'Aplicar el SAAL a un grupo muestra en el mes de octubre para tener datos de seguimiento.',
                responsables: 'ATP y docente de 5°A',
                fechaCompromiso: '2026-10-31',
                estado: 'pendiente'
            }
        ],
        proximosPasos: 'Revisar el avance de las anclas en la próxima sesión de CTE. Ajustar la calendarización de las actividades del banco según los tiempos reales del aula.',
        fechaCompromiso: '',
        fechaProximoSeguimiento: '2026-11-15',
        convocaProximo: 'Dirección escolar',
        firmas: {
            director: 'María López Hernández',
            atp: 'Juan Pérez Ramírez',
            docentes: [
                { nombre: 'Ana Ruiz Cortés',      rol: 'Docente de 4°A' },
                { nombre: 'Roberto Sánchez Gil',  rol: 'Docente de 5°B' },
                { nombre: 'Carlos Mendoza',       rol: 'Bibliotecario(a)' }
            ]
        },
        compromisos: []
    };

    // --- MOMENTO 5 ---
    const DEMO_M5 = {
        evaluacion: {
            logros: 'La lectura en voz alta diaria se consolidó como práctica permanente en todos los grupos. Los estudiantes participan con más confianza en los círculos de lectura.',
            dificultades: 'Algunas actividades del banco requirieron más tiempo del previsto. Faltó material informativo actualizado para "Noticias del mundo".',
            aprendizajes: 'Aprendimos que las anclas funcionan mejor cuando son cortas y diarias. También que las familias responden mejor cuando se les invita a actividades concretas y no a "leer más".',
            recomendaciones: 'Reservar la primera semana de cada mes para planear las actividades del banco. Mantener la lectura en voz alta diaria. Buscar alianzas con la biblioteca municipal para material actualizado.'
        },
        documentacion: {
            evidencias: [
                {
                    id: 'ev_demo_1',
                    tipo: 'Fotografía',
                    descripcion: 'Fotos de los círculos de lectura de 5°A y 6°A durante octubre.',
                    fecha: '2026-10-20',
                    responsable: 'María López Hernández',
                    vinculo: 'Carpeta digital de la escuela · Drive'
                },
                {
                    id: 'ev_demo_2',
                    tipo: 'Texto escrito',
                    descripcion: 'Antología de reseñas de 100 palabras elaboradas por los estudiantes de 6°A.',
                    fecha: '2026-11-08',
                    responsable: 'Juan Pérez Ramírez',
                    vinculo: 'Carpeta física del aula de 6°A'
                },
                {
                    id: 'ev_demo_3',
                    tipo: 'Lista de asistencia',
                    descripcion: 'Registros de participación de las familias en la reunión de socialización de la Hoja de Ruta.',
                    fecha: '2026-10-15',
                    responsable: 'Dirección escolar',
                    vinculo: 'Archivo escolar'
                }
            ],
            notas: 'Se documentaron las actividades más significativas del trimestre. La bitácora tiene el detalle completo.'
        },
        meta: {
            fechaCierre: '2026-11-30',
            elaboradoPor: 'Colectivo docente de la Escuela Primaria Benito Juárez',
            proximoTrimestre: 'Profundizar la comprensión inferencial con textos informativos y ampliar la participación de las familias.'
        }
    };

    /* ========================================================
       CARGAR
       ======================================================== */
    function cargar() {
        if (typeof ESTADO === 'undefined') {
            console.error('❌ DEMO: ESTADO no disponible');
            return false;
        }

        try {
            console.log('🎬 DEMO: cargando datos de ejemplo…');

            // 1. Identificación
            if (typeof ESTADO.actualizarSeccion === 'function') {
                ESTADO.actualizarSeccion('identificacion', DEMO_IDENTIFICACION);
                ESTADO.actualizarSeccion('lineaBase',      DEMO_LINEA_BASE);
                ESTADO.actualizarSeccion('saal',           DEMO_SAAL);
                ESTADO.actualizarSeccion('voces',          DEMO_VOCES);
                ESTADO.actualizarSeccion('termometro',     DEMO_TERMOMETRO);
                ESTADO.actualizarSeccion('momento3',       DEMO_M3);
                ESTADO.actualizarSeccion('momento4',       DEMO_M4);
                ESTADO.actualizarSeccion('momento5',       DEMO_M5);
            } else {
                console.warn('⚠️ DEMO: ESTADO.actualizarSeccion no disponible');
                return false;
            }

            // 2. Guardar todo de una vez
            if (typeof ESTADO.guardar === 'function') {
                ESTADO.guardar(true);
            }

            // 3. Activar flag
            try {
                localStorage.setItem(CLAVE_FLAG, 'true');
            } catch (e) { /* silencio */ }

            console.log('✅ DEMO: datos cargados correctamente');
            return true;

        } catch (e) {
            console.error('❌ DEMO: error al cargar:', e);
            return false;
        }
    }

    /* ========================================================
       LIMPIAR
       ======================================================== */
    function limpiar() {
        if (typeof ESTADO === 'undefined') return false;

        try {
            console.log('🎬 DEMO: limpiando datos…');

            if (typeof ESTADO.reiniciar === 'function') {
                ESTADO.reiniciar();
            }

            try {
                localStorage.removeItem(CLAVE_FLAG);
            } catch (e) { /* silencio */ }

            console.log('✅ DEMO: datos limpiados');
            return true;

        } catch (e) {
            console.error('❌ DEMO: error al limpiar:', e);
            return false;
        }
    }

    /* ========================================================
       ESTADO
       ======================================================== */
    function estaActivo() {
        try {
            return localStorage.getItem(CLAVE_FLAG) === 'true';
        } catch (e) {
            return false;
        }
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        cargar,
        limpiar,
        estaActivo
    };

})();

/* ============================================================
   EXPOSICIÓN A WINDOW
   ============================================================ */
if (typeof window !== 'undefined') {
    window.DEMO = DEMO;
    console.log('✅ DEMO expuesto en window (v1.0)');
}
