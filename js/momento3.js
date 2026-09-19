/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3.js — Contenedor principal del Momento 3
   Hoja de Ruta Trimestral (el corazón del artefacto)
   v2.0 — Fix window + 1 ruta por trimestre
   ============================================================ */

const MOMENTO3 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;
    let subSeccionActual = 'seleccion';
    let inicializado = false;

    const SUB_SECCIONES = [
        { id: 'seleccion',       nombre: 'Selección de Ruta',  icono: 'fa-list-check',    modulo: 'MOMENTO3_1' },
        { id: 'calendarizacion', nombre: 'Calendarización',     icono: 'fa-calendar-days', modulo: 'MOMENTO3_2' },
        { id: 'responsables',    nombre: 'Responsables',        icono: 'fa-users-gear',    modulo: 'MOMENTO3_3' },
        { id: 'bitacora',        nombre: 'Bitácora',            icono: 'fa-book-open',     modulo: 'MOMENTO3_4' }
    ];

    /* ========================================================
       INIT
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-momento3');
        if (!contenedor) {
            console.error('❌ MOMENTO3: No se encontró #contenido-momento3');
            return;
        }

        console.log('🚂 MOMENTO3.init() — Iniciando contenedor del Momento 3');

        // Sincronizar (si existe el método en ESTADO)
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.sincronizarRutasSeleccionadas === 'function') {
            try { ESTADO.sincronizarRutasSeleccionadas(); }
            catch (e) { console.warn('⚠️ sincronizarRutasSeleccionadas falló:', e); }
        }

        renderizar();
        suscribirCambios();
        inicializado = true;
    }

    /* ========================================================
       RENDER PÚBLICO (para app.js)
       ======================================================== */
    function render() {
        if (!inicializado || !contenedor || !document.body.contains(contenedor)) {
            init();
        } else {
            renderizar();
        }
    }

    /* ========================================================
       OBTENER VALIDACIONES (defensivo)
       ======================================================== */
    function obtenerValidaciones() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.momento3Completo === 'function') {
            try { return ESTADO.momento3Completo(); }
            catch (e) { console.warn('⚠️ momento3Completo falló:', e); }
        }
        return {
            seleccionRutas: false,
            calendarizacion: false,
            responsables: false,
            bitacora: false,
            completo: false
        };
    }

    /* ========================================================
       OBTENER M3 (defensivo)
       ======================================================== */
    function obtenerM3() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try { return ESTADO.obtenerSeccion('momento3') || {}; }
            catch (e) { console.warn('⚠️ obtenerSeccion(momento3) falló:', e); }
        }
        return {
            seleccionRutas: { rutaId: null, bancoSeleccionado: [], cierreMes: null },
            calendarizacion: { actividades: [] },
            responsables: { asignaciones: [] },
            bitacora: { registros: [], notas: '' }
        };
    }

    /* ========================================================
       RENDERIZAR CONTENEDOR PRINCIPAL
       ======================================================== */
    function renderizar() {
        if (!contenedor) return;

        const m3 = obtenerM3();
        const validaciones = obtenerValidaciones();

        contenedor.innerHTML = `
            <div class="momento3-wrapper">

                <!-- ===== ENCABEZADO ===== -->
                <div class="momento3-header">
                    <div class="momento3-titulo">
                        <span class="overline">Momento 3 · El corazón del Plan Lector</span>
                        <h2><i class="fas fa-route"></i> Hoja de Ruta Trimestral</h2>
                        <p class="subtitulo">
                            Una ruta por trimestre. Elige la ruta LEO, calendariza sus anclas, banco y cierre,
                            asigna responsables y registra la implementación.
                        </p>
                    </div>
                </div>

                <!-- ===== BARRA DE PROGRESO INTERNA ===== -->
                <div class="momento3-progreso">
                    ${SUB_SECCIONES.map((sub, i) => {
                        const completa = validaciones[sub.id === 'seleccion' ? 'seleccionRutas' :
                                                       sub.id === 'calendarizacion' ? 'calendarizacion' :
                                                       sub.id === 'responsables' ? 'responsables' :
                                                       'bitacora'];
                        const activa = subSeccionActual === sub.id;
                        return `
                            <div class="sub-paso ${activa ? 'activo' : ''} ${completa ? 'completado' : ''}"
                                 data-sub="${sub.id}">
                                <span class="sub-numero">
                                    ${completa ? '<i class="fas fa-check"></i>' : (i + 1)}
                                </span>
                                <span class="sub-nombre">
                                    <i class="fas ${sub.icono}"></i> ${sub.nombre}
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- ===== CONTENIDO ===== -->
                <div id="contenido-sub-seccion" class="momento3-contenido"></div>

                <!-- ===== NAVEGACIÓN ===== -->
                <div class="momento3-navegacion">
                    <button id="btn-sub-anterior" class="btn btn-secundario"
                            ${subSeccionActual === SUB_SECCIONES[0].id ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Anterior
                    </button>

                    <div class="indicador-sub-paso">
                        Sub-paso <span id="sub-paso-actual">${obtenerIndiceSubSeccion() + 1}</span> de ${SUB_SECCIONES.length}
                    </div>

                    <button id="btn-sub-siguiente" class="btn btn-primario">
                        ${subSeccionActual === SUB_SECCIONES[SUB_SECCIONES.length - 1].id
                            ? '<i class="fas fa-check"></i> Ver resumen'
                            : 'Siguiente <i class="fas fa-arrow-right"></i>'}
                    </button>
                </div>

            </div>
        `;

        cargarSubSeccion(subSeccionActual);
        configurarNavegacion();
    }

    /* ========================================================
       CARGAR SUB-SECCIÓN
       ======================================================== */
    function cargarSubSeccion(subId) {
        const contenedorSub = document.getElementById('contenido-sub-seccion');
        if (!contenedorSub) return;

        const subDef = SUB_SECCIONES.find(s => s.id === subId);
        if (!subDef) return;

        // Buscar el módulo (probamos en window y en globalThis por si acaso)
        const modulo = (typeof window !== 'undefined' ? window[subDef.modulo] : null)
                    || (typeof globalThis !== 'undefined' ? globalThis[subDef.modulo] : null);

        if (!modulo || typeof modulo.renderizar !== 'function') {
            contenedorSub.innerHTML = `
                <div class="caja-alerta">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Sub-sección no disponible:</strong>
                    No se encontró <code>window.${subDef.modulo}</code>.
                    Asegúrate de que el archivo <code>${subDef.modulo.toLowerCase().replace('_', '-')}-*.js</code>
                    esté cargado y exponga el módulo en <code>window</code>.
                </div>
            `;
            console.warn(`⚠️ MOMENTO3: No se encontró window.${subDef.modulo}`);
            return;
        }

        contenedorSub.innerHTML = '';
        try {
            modulo.renderizar(contenedorSub);
        } catch (e) {
            console.error(`❌ Error al renderizar ${subDef.modulo}:`, e);
            contenedorSub.innerHTML = `
                <div class="caja-alerta">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Error:</strong> ${e.message}
                </div>
            `;
        }
    }

    /* ========================================================
       CONFIGURAR NAVEGACIÓN
       ======================================================== */
    function configurarNavegacion() {
        if (!contenedor) return;

        contenedor.querySelectorAll('.sub-paso').forEach(el => {
            el.addEventListener('click', () => {
                irASubSeccion(el.dataset.sub);
            });
        });

        const btnAnterior = document.getElementById('btn-sub-anterior');
        if (btnAnterior) {
            btnAnterior.addEventListener('click', () => {
                const index = obtenerIndiceSubSeccion();
                if (index > 0) irASubSeccion(SUB_SECCIONES[index - 1].id);
            });
        }

        const btnSiguiente = document.getElementById('btn-sub-siguiente');
        if (btnSiguiente) {
            btnSiguiente.addEventListener('click', () => {
                const index = obtenerIndiceSubSeccion();
                if (index < SUB_SECCIONES.length - 1) {
                    irASubSeccion(SUB_SECCIONES[index + 1].id);
                } else {
                    mostrarResumenFinal();
                }
            });
        }
    }

    /* ========================================================
       IR A SUB-SECCIÓN
       ======================================================== */
    function irASubSeccion(subId) {
        subSeccionActual = subId;
        renderizar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function obtenerIndiceSubSeccion() {
        return SUB_SECCIONES.findIndex(s => s.id === subSeccionActual);
    }

    /* ========================================================
       RESUMEN FINAL
       ======================================================== */
    function mostrarResumenFinal() {
        const m3 = obtenerM3();
        const validaciones = obtenerValidaciones();

        const contenedorSub = document.getElementById('contenido-sub-seccion');
        if (!contenedorSub) return;

        // === NUEVA ESTRUCTURA: 1 ruta ===
        const rutaId = m3.seleccionRutas?.rutaId || null;
        const ruta = rutaId && typeof DATOS !== 'undefined'
            ? DATOS.rutasLEO[rutaId]
            : null;
        const bancoSel = m3.seleccionRutas?.bancoSeleccionado || [];
        const cierreMes = m3.seleccionRutas?.cierreMes || null;

        // Actividades
        const actividades = m3.calendarizacion?.actividades || [];
        const porMes = {
            septiembre: actividades.filter(a => a.mes === 'septiembre').length,
            octubre: actividades.filter(a => a.mes === 'octubre').length,
            noviembre: actividades.filter(a => a.mes === 'noviembre').length
        };

        const porEstado = {
            'no-iniciada': actividades.filter(a => a.estado === 'no-iniciada').length,
            'en-proceso': actividades.filter(a => a.estado === 'en-proceso').length,
            'completada': actividades.filter(a => a.estado === 'completada').length,
            'reprogramada': actividades.filter(a => a.estado === 'reprogramada').length
        };

        // Datos Jalisco Avanza para la ruta elegida
        const just = ruta?.datosJustificacion;
        const justPrimaria = just?.primaria;
        const justSecundaria = just?.secundaria;

        contenedorSub.innerHTML = `
            <div class="resumen-momento3">

                <div class="seccion-header">
                    <h3><i class="fas fa-clipboard-check"></i> Resumen del Momento 3</h3>
                    <p class="seccion-descripcion">
                        Revisa tu Hoja de Ruta Trimestral antes de generar los productos.
                    </p>
                </div>

                <!-- ===== BLOQUE DE RUTA ELEGIDA ===== -->
                ${ruta ? `
                    <div class="caja-info" style="margin-bottom: 1rem;">
                        <i class="fas fa-route"></i>
                        <strong>Ruta elegida:</strong> ${ruta.nombre}
                        <p style="font-style: italic; margin: 0.5rem 0;">"${ruta.lema}"</p>
                        <p><strong>Banco seleccionado:</strong> ${bancoSel.length > 0 ? bancoSel.join(' · ') : '(sin seleccionar)'}</p>
                        <p><strong>Mes del cierre:</strong> ${cierreMes || '(sin definir)'}</p>
                    </div>
                ` : `
                    <div class="caja-alerta" style="margin-bottom: 1rem;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Aún no has seleccionado una ruta.</strong>
                        Regresa al sub-paso 3.1 para elegirla.
                    </div>
                `}

                <!-- ===== TARJETAS DE ESTADO ===== -->
                <div class="tarjeta-grid">
                    <div class="tarjeta ${validaciones.seleccionRutas ? 'completada' : 'pendiente'}">
                        <h4><i class="fas fa-list-check"></i> 3.1 Selección de Ruta</h4>
                        <p>${ruta ? `<strong>${ruta.nombre}</strong>` : 'Sin ruta seleccionada'}</p>
                        ${validaciones.seleccionRutas
                            ? '<span class="chip verde"><i class="fas fa-check"></i> Completa</span>'
                            : '<span class="chip rojo"><i class="fas fa-times"></i> Pendiente</span>'}
                    </div>

                    <div class="tarjeta ${validaciones.calendarizacion ? 'completada' : 'pendiente'}">
                        <h4><i class="fas fa-calendar-days"></i> 3.2 Calendarización</h4>
                        <p><strong>${actividades.length}</strong> actividad(es)</p>
                        ${validaciones.calendarizacion
                            ? '<span class="chip verde"><i class="fas fa-check"></i> Completa</span>'
                            : '<span class="chip rojo"><i class="fas fa-times"></i> Pendiente</span>'}
                        <div style="margin-top: 0.5rem;">
                            <span class="chip">Sept: ${porMes.septiembre}</span>
                            <span class="chip">Oct: ${porMes.octubre}</span>
                            <span class="chip">Nov: ${porMes.noviembre}</span>
                        </div>
                    </div>

                    <div class="tarjeta ${validaciones.responsables ? 'completada' : 'pendiente'}">
                        <h4><i class="fas fa-users-gear"></i> 3.3 Responsables</h4>
                        <p><strong>${(m3.responsables?.asignaciones || []).length}</strong> asignación(es)</p>
                        ${validaciones.responsables
                            ? '<span class="chip verde"><i class="fas fa-check"></i> Completa</span>'
                            : '<span class="chip rojo"><i class="fas fa-times"></i> Pendiente</span>'}
                    </div>

                    <div class="tarjeta ${validaciones.bitacora ? 'completada' : 'pendiente'}">
                        <h4><i class="fas fa-book-open"></i> 3.4 Bitácora</h4>
                        <p><strong>${(m3.bitacora?.registros || []).length}</strong> registro(s)</p>
                        ${validaciones.bitacora
                            ? '<span class="chip verde"><i class="fas fa-check"></i> Completa</span>'
                            : '<span class="chip amarillo"><i class="fas fa-clock"></i> En proceso</span>'}
                        <div style="margin-top: 0.5rem;">
                            <span class="chip verde">Completadas: ${porEstado.completada}</span>
                            <span class="chip amarillo">En proceso: ${porEstado['en-proceso']}</span>
                            <span class="chip rojo">No iniciadas: ${porEstado['no-iniciada']}</span>
                        </div>
                    </div>
                </div>

                <!-- ===== DATOS JALISCO AVANZA (solo si hay ruta) ===== -->
                ${ruta ? `
                    <div class="form-bloque" style="margin-top: 1.5rem;">
                        <h3><i class="fas fa-chart-bar"></i> Datos que justifican esta ruta</h3>
                        <p class="ayuda">Fuente: Jalisco Avanza 2025 · Lectura</p>

                        <div class="tarjeta-grid" style="margin-top: 0.75rem;">
                            ${justPrimaria ? `
                                <div class="tarjeta">
                                    <h4>Primaria · ${justPrimaria.grado}</h4>
                                    <p><strong>${justPrimaria.ua}</strong></p>
                                    <p style="font-size: 1.5rem; color: var(--carmesi); margin: 0.5rem 0;">
                                        ${justPrimaria.porcentaje}%
                                    </p>
                                    <p class="ayuda">${justPrimaria.texto}</p>
                                </div>
                            ` : ''}
                            ${justSecundaria ? `
                                <div class="tarjeta">
                                    <h4>Secundaria · ${justSecundaria.grado}</h4>
                                    <p><strong>${justSecundaria.ua}</strong></p>
                                    <p style="font-size: 1.5rem; color: var(--carmesi); margin: 0.5rem 0;">
                                        ${justSecundaria.porcentaje}%
                                    </p>
                                    <p class="ayuda">${justSecundaria.texto}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}

                <!-- ===== ESTADO GENERAL ===== -->
                <div class="caja-${validaciones.completo ? 'exito' : 'info'}" style="margin-top: 1.5rem;">
                    <i class="fas ${validaciones.completo ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                    <strong>${validaciones.completo ? '¡Momento 3 completo!' : 'Momento 3 en proceso'}</strong>
                    <p style="margin-top: 0.5rem;">
                        ${validaciones.completo
                            ? 'Puedes generar los productos: Hoja de Ruta Trimestral, Ficha de Ruta, Carta para Familias y Bitácora de Actividades.'
                            : 'Completa las sub-secciones pendientes para generar los productos finales.'}
                    </p>
                </div>

                <!-- ===== BOTONES DE EXPORTACIÓN ===== -->
                <div class="form-bloque" style="margin-top: 1.5rem;">
                    <h3><i class="fas fa-download"></i> Generar productos</h3>
                    <p class="ayuda">Estos productos se pueden exportar a PDF o HTML.</p>

                    <div class="tarjeta-grid">
                        <button type="button" class="btn btn-primario" id="btn-generar-hoja-ruta"
                                ${!validaciones.completo ? 'disabled' : ''}>
                            <i class="fas fa-file-lines"></i> Hoja de Ruta Trimestral
                        </button>
                        <button type="button" class="btn btn-naranja" id="btn-generar-ficha-ruta"
                                ${!validaciones.seleccionRutas ? 'disabled' : ''}>
                            <i class="fas fa-route"></i> Ficha de la Ruta
                        </button>
                        <button type="button" class="btn btn-secundario" id="btn-generar-carta-familias"
                                ${!validaciones.seleccionRutas ? 'disabled' : ''}>
                            <i class="fas fa-envelope"></i> Carta para Familias
                        </button>
                        <button type="button" class="btn btn-secundario" id="btn-generar-bitacora"
                                ${!validaciones.calendarizacion ? 'disabled' : ''}>
                            <i class="fas fa-book-open"></i> Bitácora de Actividades
                        </button>
                    </div>
                </div>

                <!-- ===== BOTÓN VOLVER ===== -->
                <div style="margin-top: 1.5rem; text-align: center;">
                    <button type="button" class="btn btn-secundario" id="btn-volver-sub-secciones">
                        <i class="fas fa-arrow-left"></i> Volver a las sub-secciones
                    </button>
                </div>

            </div>
        `;

        configurarBotonesExportacion();
    }

    /* ========================================================
       BOTONES DE EXPORTACIÓN
       ======================================================== */
    function configurarBotonesExportacion() {
        const bind = (id, tipo, producto) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('click', () => {
                if (typeof ESTADO !== 'undefined' && typeof ESTADO.marcarProductoGenerado === 'function') {
                    try { ESTADO.marcarProductoGenerado(producto); } catch (e) { /* silencioso */ }
                }
                if (typeof PRODUCTOS !== 'undefined' && typeof PRODUCTOS[tipo] === 'function') {
                    PRODUCTOS[tipo]();
                } else {
                    mostrarToast(`Producto "${tipo}" en desarrollo.`, 'info');
                }
            });
        };

        bind('btn-generar-hoja-ruta', 'generarHojaRuta', 'hojaRutaGenerada');
        bind('btn-generar-ficha-ruta', 'generarFichaRuta', 'fichaRutaGenerada');
        bind('btn-generar-carta-familias', 'generarCartaFamilias', 'cartaFamiliasGenerada');
        bind('btn-generar-bitacora', 'generarBitacora', 'bitacoraGenerada');

        const btnVolver = document.getElementById('btn-volver-sub-secciones');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => irASubSeccion('seleccion'));
        }
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
       SUSCRIBIR CAMBIOS
       ======================================================== */
    function suscribirCambios() {
        if (typeof ESTADO === 'undefined' || typeof ESTADO.suscribir !== 'function') return;
        try {
            ESTADO.suscribir((evento) => {
                if (evento === 'reiniciado' || evento === 'borradorCargado' || evento === 'importado') {
                    subSeccionActual = 'seleccion';
                    renderizar();
                }
            });
        } catch (e) {
            console.warn('⚠️ No se pudo suscribir a ESTADO:', e);
        }
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        init,
        render,
        renderizar,
        irASubSeccion,
        getSubSeccionActual: () => subSeccionActual
    };

})();

/* ============================================================
   EXPOSICIÓN A WINDOW — FIX CRÍTICO
   Sin esto, app.js no encuentra el módulo (mismo bug que
   Momento0 y Momento1 ya corrigieron).
   ============================================================ */
if (typeof window !== 'undefined') {
    window.MOMENTO3 = MOMENTO3;
    window.Momento3 = MOMENTO3;  // alias para compatibilidad con app.js
    console.log('✅ MOMENTO3 expuesto en window');
}
