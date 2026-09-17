/* ============================================================
   PLAN LECTOR JALISCO LEO
   estado.js — Gestión de estado + localStorage
   ============================================================ */

const ESTADO = (function() {

    /* ========================================================
       CLAVES DE ALMACENAMIENTO
       ======================================================== */
    const CLAVE_LOCALSTORAGE = 'plan_lector_jalisco_leo_estado_v4';
    const CLAVE_BORRADOR_MANUAL = 'plan_lector_jalisco_leo_borrador_v4';

    /* ========================================================
       ESTADO INICIAL
       ======================================================== */
    function estadoInicial() {
        return {
            // Metadatos
            meta: {
                version: '4.0',
                fechaCreacion: new Date().toISOString(),
                fechaUltimaModificacion: new Date().toISOString(),
                pasoActual: 1,
                momentoActual: 'momento2',
                completado: false
            },

            // Sección 1: Identificación
            identificacion: {
                region: '',
                municipio: '',
                cct: '',
                nombreEscuela: '',
                turno: '',
                nivel: '',        // Ahora es el ID del nivel (ej. 'primaria-alta')
                grados: [],
                numeroEstudiantes: '',
                director: '',
                atp: '',
                fechaCTE: '',
                modoLlenado: ''
            },

            // Sección 2: Línea Base
            lineaBase: {
                datosEscuela: [],
                observaciones: ''
            },

            // Sección 3: SAAL
            saal: {
                tieneSAAL: '',
                otrosDiagnosticos: '',
                resumenGrados: [],
                componentesDebiles: {},
                observaciones: ''
            },

            // Sección 4: Voces del Ecosistema
            voces: {
                estudiantes: {},
                familias: {},
                docentes: {},
                sintesis: {}
            },

            // Sección 5: Termómetro Visual
            termometro: {
                dimensiones: {},
                ajustes: {},
                lecturaAutomatica: {
                    fortalezas: [],
                    enProgreso: [],
                    atencionPrioritaria: [],
                    prioridades: []
                }
            },

            // Sección 6: Rutas Sugeridas
            rutas: {
                sugeridas: [],
                seleccionadas: [],
                notas: ''
            },

            // Acta de Diagnóstico
            acta: {
                acuerdos: '',
                proximosPasos: '',
                fechaCompromiso: '',
                firmas: {
                    director: '',
                    atp: '',
                    docentes: []
                },
                resumenEjecutivo: ''
            },

            // ========================================================
            // MOMENTO 3: HOJA DE RUTA TRIMESTRAL (el corazón)
            // ========================================================
            momento3: {
                // 3.1 Selección de Rutas (se sincroniza con rutas.seleccionadas)
                seleccionRutas: {
                    rutas: [],           // [{rutaId, orden}]
                    notas: '',
                    confirmada: false,
                    fechaConfirmacion: ''
                },

                // 3.2 Calendarización
                calendarizacion: {
                    trimestre: 'primer',
                    anio: new Date().getFullYear(),
                    actividades: [],     // [{id, rutaId, nombre, mes, semana, tipo, estado, notas}]
                    notas: ''
                },

                // 3.3 Responsables
                responsables: {
                    asignaciones: [],    // [{actividadId, rol, nombre, correo}]
                    notas: ''
                },

                // 3.4 Bitácora de Actividades
                bitacora: {
                    registros: [],       // [{actividadId, fecha, estado, observaciones, evidencias, participantes}]
                    notas: ''
                },

                // 3.5 Productos generados
                productos: {
                    hojaRutaGenerada: false,
                    fichasRutasGeneradas: false,
                    cartaFamiliasGenerada: false,
                    bitacoraGenerada: false
                }
            },

            // ========================================================
            // MOMENTO 4: CIERRE Y ACUERDOS
            // ========================================================
            momento4: {
                compromisos: [],
                proximosPasos: '',
                fechaCompromiso: '',
                firmas: {
                    director: '',
                    atp: '',
                    docentes: []
                }
            },

            // ========================================================
            // MOMENTO 5: EVALUACIÓN Y DOCUMENTACIÓN
            // ========================================================
            momento5: {
                evaluacion: {
                    logros: '',
                    dificultades: '',
                    aprendizajes: '',
                    recomendaciones: ''
                },
                documentacion: {
                    evidencias: [],
                    notas: ''
                }
            }
        };
    }

    /* ========================================================
       ESTADO ACTUAL (en memoria)
       ======================================================== */
    let estado = estadoInicial();

    /* ========================================================
       LISTENERS
       ======================================================== */
    const listeners = [];

    function suscribir(callback) {
        listeners.push(callback);
        return () => {
            const index = listeners.indexOf(callback);
            if (index > -1) listeners.splice(index, 1);
        };
    }

    function notificar(evento, datos) {
        listeners.forEach(cb => {
            try {
                cb(evento, datos, estado);
            } catch (e) {
                console.error('Error en listener:', e);
            }
        });
    }

    /* ========================================================
       GUARDAR EN LOCALSTORAGE
       ======================================================== */
    let timeoutGuardado = null;

    function guardarAuto() {
        clearTimeout(timeoutGuardado);
        timeoutGuardado = setTimeout(() => {
            guardar(true);
        }, 500);
    }

    function guardar(silencioso = false) {
        try {
            estado.meta.fechaUltimaModificacion = new Date().toISOString();
            localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(estado));
            if (!silencioso) {
                notificar('guardado', { exito: true });
            }
            return true;
        } catch (e) {
            console.error('Error al guardar:', e);
            if (!silencioso) {
                notificar('guardado', { exito: false, error: e.message });
            }
            return false;
        }
    }

    /* ========================================================
       CARGAR DESDE LOCALSTORAGE
       ======================================================== */
    function cargar() {
        try {
            const guardado = localStorage.getItem(CLAVE_LOCALSTORAGE);
            if (guardado) {
                const parsed = JSON.parse(guardado);
                estado = mergeProfundo(estadoInicial(), parsed);
                notificar('cargado', { exito: true });
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error al cargar:', e);
            notificar('cargado', { exito: false, error: e.message });
            return false;
        }
    }

    /* ========================================================
       MERGE PROFUNDO
       ======================================================== */
    function mergeProfundo(base, nuevo) {
        if (Array.isArray(base)) {
            return Array.isArray(nuevo) ? nuevo : base;
        }
        if (typeof base === 'object' && base !== null) {
            const resultado = { ...base };
            if (typeof nuevo === 'object' && nuevo !== null) {
                Object.keys(nuevo).forEach(key => {
                    if (key in base) {
                        resultado[key] = mergeProfundo(base[key], nuevo[key]);
                    } else {
                        resultado[key] = nuevo[key];
                    }
                });
            }
            return resultado;
        }
        return nuevo !== undefined ? nuevo : base;
    }

    /* ========================================================
       REINICIAR
       ======================================================== */
    function reiniciar() {
        estado = estadoInicial();
        localStorage.removeItem(CLAVE_LOCALSTORAGE);
        notificar('reiniciado', {});
        guardar(true);
        return true;
    }

    /* ========================================================
       BORRADOR MANUAL
       ======================================================== */
    function guardarBorradorManual() {
        try {
            const borrador = {
                ...estado,
                meta: {
                    ...estado.meta,
                    fechaBorrador: new Date().toISOString()
                }
            };
            localStorage.setItem(CLAVE_BORRADOR_MANUAL, JSON.stringify(borrador));
            notificar('borradorGuardado', { exito: true });
            return true;
        } catch (e) {
            console.error('Error al guardar borrador:', e);
            notificar('borradorGuardado', { exito: false, error: e.message });
            return false;
        }
    }

    function cargarBorradorManual() {
        try {
            const borrador = localStorage.getItem(CLAVE_BORRADOR_MANUAL);
            if (borrador) {
                const parsed = JSON.parse(borrador);
                estado = mergeProfundo(estadoInicial(), parsed);
                notificar('borradorCargado', { exito: true });
                guardar(true);
                return true;
            }
            notificar('borradorCargado', { exito: false, error: 'No hay borrador guardado.' });
            return false;
        } catch (e) {
            console.error('Error al cargar borrador:', e);
            notificar('borradorCargado', { exito: false, error: e.message });
            return false;
        }
    }

    /* ========================================================
       EXPORTAR / IMPORTAR JSON
       ======================================================== */
    function exportarJSON() {
        try {
            const json = JSON.stringify(estado, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `plan-lector-jalisco-leo-${fechaArchivo()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            notificar('exportado', { exito: true });
            return true;
        } catch (e) {
            console.error('Error al exportar:', e);
            notificar('exportado', { exito: false, error: e.message });
            return false;
        }
    }

    function importarJSON(archivo) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    estado = mergeProfundo(estadoInicial(), parsed);
                    guardar(true);
                    notificar('importado', { exito: true });
                    resolve(true);
                } catch (err) {
                    console.error('Error al importar:', err);
                    notificar('importado', { exito: false, error: err.message });
                    reject(err);
                }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsText(archivo);
        });
    }

    /* ========================================================
       HELPERS DE ACCESO
       ======================================================== */
    function obtener() {
        return estado;
    }

    function obtenerSeccion(nombre) {
        return estado[nombre] || null;
    }

    function actualizarSeccion(nombre, datos) {
        if (estado[nombre]) {
            estado[nombre] = { ...estado[nombre], ...datos };
            guardarAuto();
            notificar('seccionActualizada', { seccion: nombre, datos });
        }
    }

    function actualizarCampo(seccion, campo, valor) {
        if (estado[seccion]) {
            estado[seccion][campo] = valor;
            guardarAuto();
            notificar('campoActualizado', { seccion, campo, valor });
        }
    }

    /* ========================================================
       NAVEGACIÓN
       ======================================================== */
    function setPasoActual(paso) {
        estado.meta.pasoActual = paso;
        guardarAuto();
        notificar('pasoCambiado', { paso });
    }

    function getPasoActual() {
        return estado.meta.pasoActual;
    }

    function setMomentoActual(momentoId) {
        estado.meta.momentoActual = momentoId;
        guardarAuto();
        notificar('momentoCambiado', { momento: momentoId });
    }

    function getMomentoActual() {
        return estado.meta.momentoActual;
    }

    function marcarCompletado() {
        estado.meta.completado = true;
        guardar();
        notificar('completado', {});
    }

    /* ========================================================
       HELPERS DE FECHA
       ======================================================== */
    function fechaArchivo() {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}${mm}${dd}-${hh}${mi}`;
    }

    function fechaLegible(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return d.toLocaleDateString('es-MX', opciones);
    }

    /* ========================================================
       VALIDACIONES POR SECCIÓN
       ======================================================== */
    function seccionCompleta(numero) {
        switch (numero) {
            case 1: {
                const id = estado.identificacion;
                return !!(id.region && id.municipio && id.cct && id.nombreEscuela &&
                         id.turno && id.nivel && id.grados.length > 0 &&
                         id.numeroEstudiantes && id.director && id.fechaCTE && id.modoLlenado);
            }
            case 2:
                return estado.lineaBase.datosEscuela.length > 0;
            case 3:
                return estado.saal.tieneSAAL !== '';
            case 4:
                return Object.keys(estado.voces.estudiantes).length > 0 ||
                       Object.keys(estado.voces.familias).length > 0 ||
                       Object.keys(estado.voces.docentes).length > 0;
            case 5:
                return Object.keys(estado.termometro.dimensiones).length > 0;
            case 6:
                return estado.rutas.seleccionadas.length >= 2;
            case 7:
                return estado.acta.acuerdos !== '';
            default:
                return false;
        }
    }

    function porcentajeCompletado() {
        let completadas = 0;
        for (let i = 1; i <= 7; i++) {
            if (seccionCompleta(i)) completadas++;
        }
        return Math.round((completadas / 7) * 100);
    }

    /* ========================================================
       VALIDACIONES DEL MOMENTO 3
       ======================================================== */
    function momento3Completo() {
        const m3 = estado.momento3;
        const id = estado.identificacion;
        const reglas = DATOS.reglasFiltradoNivel[id.nivel] || { minimoRutas: 2, maximoRutas: 5 };

        const rutasSeleccionadas = m3.seleccionRutas.rutas.length;
        const cumpleMinRutas = rutasSeleccionadas >= reglas.minimoRutas;
        const cumpleMaxRutas = rutasSeleccionadas <= reglas.maximoRutas;
        const tieneActividades = m3.calendarizacion.actividades.length > 0;
        const tieneResponsables = m3.responsables.asignaciones.length > 0;
        const tieneBitacora = m3.bitacora.registros.length > 0;

        return {
            seleccionRutas: cumpleMinRutas && cumpleMaxRutas,
            calendarizacion: tieneActividades,
            responsables: tieneResponsables,
            bitacora: tieneBitacora,
            completo: cumpleMinRutas && cumpleMaxRutas && tieneActividades && tieneResponsables
        };
    }

    /* ========================================================
       HELPERS DEL MOMENTO 3
       ======================================================== */

    // 3.1 Selección de Rutas
    function sincronizarRutasSeleccionadas() {
        // Sincroniza rutas.seleccionadas con momento3.seleccionRutas.rutas
        const rutas = estado.rutas.seleccionadas || [];
        estado.momento3.seleccionRutas.rutas = rutas.map((r, i) => ({
            rutaId: r.rutaId,
            orden: i
        }));
        guardarAuto();
        notificar('momento3RutasSincronizadas', { rutas: estado.momento3.seleccionRutas.rutas });
    }

    function confirmarSeleccionRutas() {
        sincronizarRutasSeleccionadas();
        estado.momento3.seleccionRutas.confirmada = true;
        estado.momento3.seleccionRutas.fechaConfirmacion = new Date().toISOString();
        guardar();
        notificar('momento3SeleccionConfirmada', {});
    }

    // 3.2 Calendarización
    function agregarActividad(actividad) {
        const nueva = {
            id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            rutaId: actividad.rutaId || '',
            nombre: actividad.nombre || '',
            mes: actividad.mes || 'septiembre',
            semana: actividad.semana || 'Semana 1',
            tipo: actividad.tipo || 'ordinaria',
            estado: actividad.estado || 'no-iniciada',
            notas: actividad.notas || '',
            fechaCreacion: new Date().toISOString()
        };
        estado.momento3.calendarizacion.actividades.push(nueva);
        guardarAuto();
        notificar('momento3ActividadAgregada', { actividad: nueva });
        return nueva;
    }

    function actualizarActividad(actividadId, cambios) {
        const actividades = estado.momento3.calendarizacion.actividades;
        const index = actividades.findIndex(a => a.id === actividadId);
        if (index === -1) return null;

        actividades[index] = { ...actividades[index], ...cambios };
        guardarAuto();
        notificar('momento3ActividadActualizada', { actividad: actividades[index] });
        return actividades[index];
    }

    function eliminarActividad(actividadId) {
        const actividades = estado.momento3.calendarizacion.actividades;
        const filtradas = actividades.filter(a => a.id !== actividadId);
        estado.momento3.calendarizacion.actividades = filtradas;
        guardarAuto();
        notificar('momento3ActividadEliminada', { actividadId });
        return true;
    }

    // 3.3 Responsables
    function asignarResponsable(actividadId, rol, nombre, correo = '') {
        const asignaciones = estado.momento3.responsables.asignaciones;
        const existente = asignaciones.findIndex(a => a.actividadId === actividadId && a.rol === rol);

        const nueva = {
            actividadId,
            rol,
            nombre,
            correo,
            fechaAsignacion: new Date().toISOString()
        };

        if (existente !== -1) {
            asignaciones[existente] = nueva;
        } else {
            asignaciones.push(nueva);
        }

        guardarAuto();
        notificar('momento3ResponsableAsignado', { asignacion: nueva });
        return nueva;
    }

    function eliminarResponsable(actividadId, rol) {
        const asignaciones = estado.momento3.responsables.asignaciones;
        const filtradas = asignaciones.filter(a => !(a.actividadId === actividadId && a.rol === rol));
        estado.momento3.responsables.asignaciones = filtradas;
        guardarAuto();
        notificar('momento3ResponsableEliminado', { actividadId, rol });
        return true;
    }

    // 3.4 Bitácora
    function agregarRegistroBitacora(registro) {
        const nuevo = {
            id: `bit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            actividadId: registro.actividadId || '',
            fecha: registro.fecha || new Date().toISOString().split('T')[0],
            estado: registro.estado || 'completada',
            observaciones: registro.observaciones || '',
            participantes: registro.participantes || '',
            evidencias: registro.evidencias || [],
            fechaRegistro: new Date().toISOString()
        };
        estado.momento3.bitacora.registros.push(nuevo);
        guardarAuto();
        notificar('momento3RegistroAgregado', { registro: nuevo });
        return nuevo;
    }

    function actualizarRegistroBitacora(registroId, cambios) {
        const registros = estado.momento3.bitacora.registros;
        const index = registros.findIndex(r => r.id === registroId);
        if (index === -1) return null;

        registros[index] = { ...registros[index], ...cambios };
        guardarAuto();
        notificar('momento3RegistroActualizado', { registro: registros[index] });
        return registros[index];
    }

    function eliminarRegistroBitacora(registroId) {
        const registros = estado.momento3.bitacora.registros;
        const filtrados = registros.filter(r => r.id !== registroId);
        estado.momento3.bitacora.registros = filtrados;
        guardarAuto();
        notificar('momento3RegistroEliminado', { registroId });
        return true;
    }

    // 3.5 Productos
    function marcarProductoGenerado(producto) {
        if (estado.momento3.productos[producto] !== undefined) {
            estado.momento3.productos[producto] = true;
            guardarAuto();
            notificar('momento3ProductoGenerado', { producto });
        }
    }

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        cargar();
        notificar('inicializado', { estado });
        return estado;
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        // Ciclo de vida
        init,
        obtener,
        obtenerSeccion,
        actualizarSeccion,
        actualizarCampo,

        // Persistencia
        guardar,
        guardarAuto,
        cargar,
        reiniciar,
        guardarBorradorManual,
        cargarBorradorManual,
        exportarJSON,
        importarJSON,

        // Navegación
        setPasoActual,
        getPasoActual,
        setMomentoActual,
        getMomentoActual,
        marcarCompletado,

        // Validaciones
        seccionCompleta,
        porcentajeCompletado,
        momento3Completo,

        // Helpers del Momento 3
        sincronizarRutasSeleccionadas,
        confirmarSeleccionRutas,
        agregarActividad,
        actualizarActividad,
        eliminarActividad,
        asignarResponsable,
        eliminarResponsable,
        agregarRegistroBitacora,
        actualizarRegistroBitacora,
        eliminarRegistroBitacora,
        marcarProductoGenerado,

        // Eventos
        suscribir,
        notificar,

        // Helpers
        fechaLegible,
        fechaArchivo,

        // Estado inicial (para tests)
        estadoInicial
    };

})();

// ============================================================
// AUTO-INICIALIZAR AL CARGAR
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    ESTADO.init();
});
