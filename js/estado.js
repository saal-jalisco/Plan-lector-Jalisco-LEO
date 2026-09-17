/* ============================================================
   TERMÓMETRO LECTOR · JALISCO LEO
   estado.js — Gestión de estado + localStorage
   ============================================================ */

const ESTADO = (function() {

    /* ========================================================
       CLAVE DE ALMACENAMIENTO
       ======================================================== */
    const CLAVE_LOCALSTORAGE = 'termometro_lector_estado_v1';
    const CLAVE_BORRADOR_MANUAL = 'termometro_lector_borrador_v1';

    /* ========================================================
       ESTADO INICIAL
       ======================================================== */
    function estadoInicial() {
        return {
            // Metadatos
            meta: {
                version: '1.0',
                fechaCreacion: new Date().toISOString(),
                fechaUltimaModificacion: new Date().toISOString(),
                pasoActual: 1,
                completado: false
            },

            // Sección 1: Identificación
            identificacion: {
                region: '',
                municipio: '',
                cct: '',
                nombreEscuela: '',
                turno: '',
                nivel: '',
                grados: [],
                numeroEstudiantes: '',
                director: '',
                atp: '',
                fechaCTE: '',
                modoLlenado: ''
            },

            // Sección 2: Línea Base
            lineaBase: {
                datosEscuela: [], // [{grado, grupo, media, deseable, enProgreso, atencionPrioritaria}]
                observaciones: ''
            },

            // Sección 3: SAAL
            saal: {
                tieneSAAL: '', // 'si' | 'no' | 'otros'
                otrosDiagnosticos: '',
                resumenGrados: [], // [{grado, grupo, evaluados, deseable, enProgreso, atencionPrioritaria}]
                componentesDebiles: {}, // {fluidez: 30, comprension: 45, ...}
                observaciones: ''
            },

            // Sección 4: Voces del Ecosistema
            voces: {
                estudiantes: {}, // {p1: 'Mucho', p2: 'Semanal', ...}
                familias: {},
                docentes: {},
                sintesis: {} // {dimension: 'verde'|'amarillo'|'rojo'}
            },

            // Sección 5: Termómetro Visual
            termometro: {
                dimensiones: {}, // {comprension: 'verde', fluidez: 'amarillo', ...}
                ajustes: {}, // {comprension: {valor: 'amarillo', justificacion: '...'}}
                lecturaAutomatica: {
                    fortalezas: [],
                    enProgreso: [],
                    atencionPrioritaria: [],
                    prioridades: []
                }
            },

            // Sección 6: Rutas Sugeridas
            rutas: {
                sugeridas: [], // [{rutaId, prioridad, dimensionesGatillo}]
                seleccionadas: [], // [{rutaId, orden}]
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
            }
        };
    }

    /* ========================================================
       ESTADO ACTUAL (en memoria)
       ======================================================== */
    let estado = estadoInicial();

    /* ========================================================
       LISTENERS (para notificar cambios)
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
       GUARDAR EN LOCALSTORAGE (automático)
       ======================================================== */
    let timeoutGuardado = null;

    function guardarAuto() {
        clearTimeout(timeoutGuardado);
        timeoutGuardado = setTimeout(() => {
            guardar();
        }, 500); // debounce de 500ms
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
                // Merge con estado inicial para asegurar estructura completa
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
       MERGE PROFUNDO (para compatibilidad de versiones)
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
       REINICIAR TODO
       ======================================================== */
    function reiniciar() {
        estado = estadoInicial();
        localStorage.removeItem(CLAVE_LOCALSTORAGE);
        notificar('reiniciado', {});
        guardar(true);
        return true;
    }

    /* ========================================================
       GUARDAR BORRADOR MANUAL (copia de seguridad)
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

    /* ========================================================
       CARGAR BORRADOR MANUAL
       ======================================================== */
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
       EXPORTAR ESTADO COMO JSON
       ======================================================== */
    function exportarJSON() {
        try {
            const json = JSON.stringify(estado, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `termometro-lector-${fechaArchivo()}.json`;
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

    /* ========================================================
       IMPORTAR ESTADO DESDE JSON
       ======================================================== */
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
            reader.onerror = (err) => {
                reject(err);
            };
            reader.readAsText(archivo);
        });
    }

    /* ========================================================
       HELPERS DE ACCESO
       ======================================================== */

    // Obtener todo el estado
    function obtener() {
        return estado;
    }

    // Obtener una sección
    function obtenerSeccion(nombre) {
        return estado[nombre] || null;
    }

    // Actualizar una sección completa
    function actualizarSeccion(nombre, datos) {
        if (estado[nombre]) {
            estado[nombre] = { ...estado[nombre], ...datos };
            guardarAuto();
            notificar('seccionActualizada', { seccion: nombre, datos });
        }
    }

    // Actualizar un campo específico
    function actualizarCampo(seccion, campo, valor) {
        if (estado[seccion]) {
            estado[seccion][campo] = valor;
            guardarAuto();
            notificar('campoActualizado', { seccion, campo, valor });
        }
    }

    // Navegación
    function setPasoActual(paso) {
        estado.meta.pasoActual = paso;
        guardarAuto();
        notificar('pasoCambiado', { paso });
    }

    function getPasoActual() {
        return estado.meta.pasoActual;
    }

    // Marcar como completado
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
       VALIDACIONES
       ======================================================== */

    // Verifica si una sección está completa
    function seccionCompleta(numero) {
        switch (numero) {
            case 1:
                const id = estado.identificacion;
                return !!(id.region && id.municipio && id.cct && id.nombreEscuela &&
                         id.turno && id.nivel && id.grados.length > 0 &&
                         id.numeroEstudiantes && id.director && id.fechaCTE && id.modoLlenado);
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
                return estado.rutas.seleccionadas.length > 0;
            case 7:
                return estado.acta.acuerdos !== '';
            default:
                return false;
        }
    }

    // Devuelve el porcentaje de completado
    function porcentajeCompletado() {
        let completadas = 0;
        for (let i = 1; i <= 7; i++) {
            if (seccionCompleta(i)) completadas++;
        }
        return Math.round((completadas / 7) * 100);
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
        marcarCompletado,

        // Validaciones
        seccionCompleta,
        porcentajeCompletado,

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