/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento2.js — Contenedor del Termómetro Lector
   v1.1 — Fix de IDs (contenido-seccion-N con guion)
   ============================================================ */

const MOMENTO2 = (function() {

    /* ========================================================
       CONFIGURACIÓN DE SECCIONES
       ✏️ Los IDs de la izquierda se usan internamente.
       El módulo busca el contenedor #contenido-seccion-{N} en el DOM.
       ======================================================== */
    const SECCIONES = [
        { id: 'seccion1', numero: 1, nombre: 'Identificación',       icono: 'fa-id-card',           modulo: 'SECCION1' },
        { id: 'seccion2', numero: 2, nombre: 'Línea Base',           icono: 'fa-chart-line',        modulo: 'SECCION2' },
        { id: 'seccion3', numero: 3, nombre: 'Diagnóstico SAAL',     icono: 'fa-microscope',        modulo: 'SECCION3' },
        { id: 'seccion4', numero: 4, nombre: 'Voces del Ecosistema', icono: 'fa-comments',          modulo: 'SECCION4' },
        { id: 'seccion5', numero: 5, nombre: 'Termómetro Visual',    icono: 'fa-temperature-half',  modulo: 'SECCION5' },
        { id: 'seccion6', numero: 6, nombre: 'Rutas Sugeridas',      icono: 'fa-route',             modulo: 'SECCION6' }
    ];

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;
    let seccionActual = SECCIONES[0].id;
    let inicializado = false;

    /* ========================================================
       INIT
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-momento2');
        if (!contenedor) {
            console.error('❌ MOMENTO2: No se encontró #contenido-momento2');
            return;
        }

        console.log('🌡️ MOMENTO2.init() — Iniciando Termómetro Lector');

        renderizar();
        inicializado = true;
    }

    /* ========================================================
       RENDER PÚBLICO
       ======================================================== */
    function render() {
        if (!inicializado || !contenedor || !document.body.contains(contenedor)) {
            init();
        } else {
            renderizar();
        }
    }

    /* ========================================================
       RENDERIZAR CONTENEDOR PRINCIPAL
       ======================================================== */
    function renderizar() {
        if (!contenedor) return;

        contenedor.innerHTML = `
            <div class="momento2-wrapper">

                <div class="momento2-header">
                    <div class="momento2-titulo">
                        <span class="overline">Momento 2 · Diagnóstico del ecosistema lector</span>
                        <h2><i class="fas fa-temperature-half"></i> Termómetro Lector</h2>
                        <p class="subtitulo">
                            Recoge las voces del ecosistema (estudiantes, familias, docentes),
                            la línea base de Jalisco Avanza y sintetiza los resultados del diagnóstico.
                        </p>
                    </div>
                </div>

                <div class="momento2-progreso">
                    ${SECCIONES.map((sec, i) => {
                        const activa = seccionActual === sec.id;
                        return `
                            <div class="sub-paso ${activa ? 'activo' : ''}" data-sub="${sec.id}">
                                <span class="sub-numero">${i + 1}</span>
                                <span class="sub-nombre">
                                    <i class="fas ${sec.icono}"></i> ${sec.nombre}
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div id="contenido-seccion-actual" class="momento2-contenido"></div>

                <div class="momento2-navegacion">
                    <button id="btn-sec-anterior" class="btn btn-secundario"
                            ${seccionActual === SECCIONES[0].id ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Anterior
                    </button>

                    <div class="indicador-sub-paso">
                        Sección <span id="sec-actual">${obtenerIndiceSeccion() + 1}</span> de ${SECCIONES.length}
                    </div>

                    <button id="btn-sec-siguiente" class="btn btn-primario">
                        ${seccionActual === SECCIONES[SECCIONES.length - 1].id
                            ? '<i class="fas fa-check"></i> Ver síntesis'
                            : 'Siguiente <i class="fas fa-arrow-right"></i>'}
                    </button>
                </div>

            </div>
        `;

        cargarSeccion(seccionActual);
        configurarNavegacion();
    }

    /* ========================================================
       CARGAR SECCIÓN — FIX: id con guion (contenido-seccion-N)
       ======================================================== */
    function cargarSeccion(secId) {
        const contenedorSec = document.getElementById('contenido-seccion-actual');
        if (!contenedorSec) return;

        const secDef = SECCIONES.find(s => s.id === secId);
        if (!secDef) return;

        // ⬇️ FIX: creamos el div con el ID que las secciones esperan
        //    Ejemplo: contenido-seccion-1 (con guion antes del número)
        contenedorSec.innerHTML = `<div id="contenido-seccion-${secDef.numero}" class="seccion-wrapper"></div>`;

        const modulo = (typeof window !== 'undefined' ? window[secDef.modulo] : null);

        if (!modulo || typeof modulo.init !== 'function') {
            contenedorSec.innerHTML = `
                <div class="caja-alerta">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Sección no disponible:</strong>
                    No se encontró <code>window.${secDef.modulo}</code>.
                    Verifica que el archivo <code>${secId}.js</code> esté cargado
                    y que termine con <code>window.${secDef.modulo} = ${secDef.modulo};</code>.
                </div>
            `;
            console.warn(`⚠️ MOMENTO2: No se encontró window.${secDef.modulo}`);
            return;
        }

        try {
            modulo.init();
        } catch (e) {
            console.error(`❌ Error al inicializar ${secDef.modulo}:`, e);
            contenedorSec.innerHTML = `
                <div class="caja-alerta">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Error:</strong> ${e.message}
                </div>
            `;
        }
    }

    /* ========================================================
       NAVEGACIÓN
       ======================================================== */
    function configurarNavegacion() {
        if (!contenedor) return;

        contenedor.querySelectorAll('.sub-paso').forEach(el => {
            el.addEventListener('click', () => irASeccion(el.dataset.sub));
        });

        const btnAnterior = document.getElementById('btn-sec-anterior');
        if (btnAnterior) {
            btnAnterior.addEventListener('click', () => {
                const index = obtenerIndiceSeccion();
                if (index > 0) irASeccion(SECCIONES[index - 1].id);
            });
        }

        const btnSiguiente = document.getElementById('btn-sec-siguiente');
        if (btnSiguiente) {
            btnSiguiente.addEventListener('click', () => {
                const index = obtenerIndiceSeccion();
                if (index < SECCIONES.length - 1) {
                    irASeccion(SECCIONES[index + 1].id);
                } else {
                    mostrarToast('Termómetro completo. Continúa al Momento 3.', 'exito');
                }
            });
        }
    }

    function irASeccion(secId) {
        seccionActual = secId;
        renderizar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function obtenerIndiceSeccion() {
        return SECCIONES.findIndex(s => s.id === seccionActual);
    }

    /* ========================================================
       TOAST (defensivo)
       ======================================================== */
    function mostrarToast(mensaje, tipo) {
        if (typeof APP !== 'undefined' && typeof APP.mostrarToast === 'function') {
            APP.mostrarToast(mensaje, tipo);
        } else {
            console.log(`[Toast ${tipo}] ${mensaje}`);
        }
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        init,
        render,
        renderizar,
        irASeccion,
        getSeccionActual: () => seccionActual
    };

})();

/* ============================================================
   EXPOSICIÓN A WINDOW
   ============================================================ */
if (typeof window !== 'undefined') {
    window.MOMENTO2 = MOMENTO2;
    window.Momento2 = MOMENTO2;
    console.log('✅ MOMENTO2 expuesto en window');
}
