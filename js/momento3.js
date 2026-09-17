/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3.js — Contenedor principal del Momento 3
   Hoja de Ruta Trimestral (el corazón del artefacto)
   ============================================================ */

const MOMENTO3 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;
    let subSeccionActual = 'seleccion';

    const SUB_SECCIONES = [
        { id: 'seleccion',      nombre: 'Selección de Rutas',   icono: 'fa-list-check',       modulo: 'MOMENTO3_1' },
        { id: 'calendarizacion', nombre: 'Calendarización',      icono: 'fa-calendar-days',    modulo: 'MOMENTO3_2' },
        { id: 'responsables',   nombre: 'Responsables',         icono: 'fa-users-gear',       modulo: 'MOMENTO3_3' },
        { id: 'bitacora',       nombre: 'Bitácora',             icono: 'fa-book-open',        modulo: 'MOMENTO3_4' }
    ];

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-momento3');
        if (!contenedor) return;

        // Sincronizar rutas seleccionadas del Termómetro
        ESTADO.sincronizarRutasSeleccionadas();

        renderizar();
        suscribirCambios();
    }

    /* ========================================================
       RENDERIZAR CONTENEDOR PRINCIPAL
       ======================================================== */
    function renderizar() {
        const m3 = ESTADO.obtenerSeccion('momento3');
        const validaciones = ESTADO.momento3Completo();

        contenedor.innerHTML = `
            <div class="momento3-wrapper">

                <!-- ===== ENCABEZADO DEL MOMENTO 3 ===== -->
                <div class="momento3-header">
                    <div class="momento3-titulo">
                        <span class="overline">Momento 3 · El corazón del Plan Lector</span>
                        <h2><i class="fas fa-route"></i> Hoja de Ruta Trimestral</h2>
                        <p class="subtitulo">
                            Diseña el plan trimestral: selecciona rutas, calendariza actividades,
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

                <!-- ===== CONTENIDO DE LA SUB-SECCIÓN ACTUAL ===== -->
                <div id="contenido-sub-seccion" class="momento3-contenido">
                    <!-- Se carga dinámicamente -->
                </div>

                <!-- ===== NAVEGACIÓN ENTRE SUB-SECCIONES ===== -->
                <div class="momento3-navegacion">
                    <button id="btn-sub-anterior" class="btn btn-secundario" ${subSeccionActual === SUB_SECCIONES[0].id ? 'disabled' : ''}>
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

        // Cargar la sub-sección actual
        cargarSubSeccion(subSeccionActual);

        // Configurar eventos de navegación
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

        // Buscar el módulo correspondiente en el scope global
        const modulo = window[subDef.modulo];

        if (!modulo || typeof modulo.renderizar !== 'function') {
            contenedorSub.innerHTML = `
                <div class="caja-alerta">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Error:</strong> No se encontró el módulo <code>${subDef.modulo}</code>.
                    Asegúrate de haber cargado el archivo <code>${subDef.modulo.toLowerCase()}.js</code>.
                </div>
            `;
            return;
        }

        // Renderizar la sub-sección
        contenedorSub.innerHTML = '';
        try {
            modulo.renderizar(contenedorSub);
        } catch (e) {
            console.error(`Error al renderizar ${subDef.modulo}:`, e);
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
        // Click en sub-pasos
        contenedor.querySelectorAll('.sub-paso').forEach(el => {
            el.addEventListener('click', () => {
                const subId = el.dataset.sub;
                irASubSeccion(subId);
            });
        });

        // Botón anterior
        const btnAnterior = document.getElementById('btn-sub-anterior');
        if (btnAnterior) {
            btnAnterior.addEventListener('click', () => {
                const index = obtenerIndiceSubSeccion();
                if (index > 0) {
                    irASubSeccion(SUB_SECCIONES[index - 1].id);
                }
            });
        }

        // Botón siguiente
        const btnSiguiente = document.getElementById('btn-sub-siguiente');
        if (btnSiguiente) {
            btnSiguiente.addEventListener('click', () => {
                const index = obtenerIndiceSubSeccion();
                if (index < SUB_SECCIONES.length - 1) {
                    irASubSeccion(SUB_SECCIONES[index + 1].id);
                } else {
                    // Mostrar resumen final
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

    /* ========================================================
       OBTENER ÍNDICE DE SUB-SECCIÓN ACTUAL
       ======================================================== */
    function obtenerIndiceSubSeccion() {
        return SUB_SECCIONES.findIndex(s => s.id === subSeccionActual);
    }

    /* ========================================================
       MOSTRAR RESUMEN FINAL
       ======================================================== */
    function mostrarResumenFinal() {
        const m3 = ESTADO.obtenerSeccion('momento3');
        const id = ESTADO.obtenerSeccion('identificacion');
        const validaciones = ESTADO.momento3Completo();

        const contenedorSub = document.getElementById('contenido-sub-seccion');
        if (!contenedorSub) return;

        // Contar actividades por mes
        const actividades = m3.calendarizacion.actividades || [];
        const porMes = {
            septiembre: actividades.filter(a => a.mes === 'septiembre').length,
            octubre: actividades.filter(a => a.mes === 'octubre').length,
            noviembre: actividades.filter(a => a.mes === 'noviembre').length
        };

        // Contar actividades por estado
        const porEstado = {
            'no-iniciada': actividades.filter(a => a.estado === 'no-iniciada').length,
            'en-proceso': actividades.filter(a => a.estado === 'en-proceso').length,
            'completada': actividades.filter(a => a.estado === 'completada').length,
            'reprogramada': actividades.filter(a => a.estado === 'reprogramada').length
        };

        // Rutas seleccionadas
        const rutasSeleccionadas = m3.seleccionRutas.rutas || [];
        const rutasInfo = rutasSeleccionadas.map(r => {
            const ruta = DATOS.rutasLEO[r.rutaId];
            return ruta ? ruta.nombre : r.rutaId;
        });

        contenedorSub.innerHTML = `
            <div class="resumen-momento3">

                <!-- ===== ENCABEZADO ===== -->
                <div class="seccion-header">
                    <h3><i class="fas fa-clipboard-check"></i> Resumen del Momento 3</h3>
                    <p class="seccion-descripcion">
                        Revisa tu Hoja de Ruta Trimestral antes de generar los productos.
                    </p>
                </div>

                <!-- ===== ESTADO GENERAL ===== -->
                <div class="tarjeta-grid">
                    <div class="tarjeta ${validaciones.seleccionRutas ? 'completada' : 'pendiente'}">
                        <h4><i class="fas fa-list-check"></i> 3.1 Selección de Rutas</h4>
                        <p><strong>${rutasSeleccionadas.length}</strong> ruta(s) seleccionada(s)</p>
                        ${validaciones.seleccionRutas
                            ? '<span class="chip verde"><i class="fas fa-check"></i> Completa</span>'
                            : '<span class="chip rojo"><i class="fas fa-times"></i> Pendiente</span>'}
                        <ul style="margin-top: 0.5rem;">
                            ${rutasInfo.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="tarjeta ${validaciones.calendarizacion ? 'completada' : 'pendiente'}">
                        <h4><i class="fas fa-calendar-days"></i> 3.2 Calendarización</h4>
                        <p><strong>${actividades.length}</strong> actividad(es) calendarizada(s)</p>
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
                        <p><strong>${m3.responsables.asignaciones.length}</strong> asignación(es)</p>
                        ${validaciones.responsables
                            ? '<span class="chip verde"><i class="fas fa-check"></i> Completa</span>'
                            : '<span class="chip rojo"><i class="fas fa-times"></i> Pendiente</span>'}
                    </div>

                    <div class="tarjeta ${validaciones.bitacora ? 'completada' : 'pendiente'}">
                        <h4><i class="fas fa-book-open"></i> 3.4 Bitácora</h4>
                        <p><strong>${m3.bitacora.registros.length}</strong> registro(s)</p>
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

                <!-- ===== ESTADO GENERAL ===== -->
                <div class="caja-${validaciones.completo ? 'exito' : 'info'}" style="margin-top: 1.5rem;">
                    <i class="fas ${validaciones.completo ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                    <strong>${validaciones.completo ? '¡Momento 3 completo!' : 'Momento 3 en proceso'}</strong>
                    <p style="margin-top: 0.5rem;">
                        ${validaciones.completo
                            ? 'Puedes generar los productos: Hoja de Ruta Trimestral, Fichas de Rutas, Carta para Familias y Bitácora de Actividades.'
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
                        <button type="button" class="btn btn-naranja" id="btn-generar-fichas-rutas"
                                ${!validaciones.seleccionRutas ? 'disabled' : ''}>
                            <i class="fas fa-route"></i> Fichas de Rutas
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

        // Configurar botones de exportación
        configurarBotonesExportacion();
    }

    /* ========================================================
       CONFIGURAR BOTONES DE EXPORTACIÓN
       ======================================================== */
    function configurarBotonesExportacion() {
        // Generar Hoja de Ruta
        const btnHoja = document.getElementById('btn-generar-hoja-ruta');
        if (btnHoja) {
            btnHoja.addEventListener('click', () => {
                ESTADO.marcarProductoGenerado('hojaRutaGenerada');
                if (typeof PRODUCTOS !== 'undefined' && PRODUCTOS.generarHojaRuta) {
                    PRODUCTOS.generarHojaRuta();
                } else {
                    APP.mostrarToast('Producto "Hoja de Ruta" en desarrollo. Estará disponible pronto.', 'info');
                }
            });
        }

        // Generar Fichas de Rutas
        const btnFichas = document.getElementById('btn-generar-fichas-rutas');
        if (btnFichas) {
            btnFichas.addEventListener('click', () => {
                ESTADO.marcarProductoGenerado('fichasRutasGeneradas');
                if (typeof PRODUCTOS !== 'undefined' && PRODUCTOS.generarFichasRutas) {
                    PRODUCTOS.generarFichasRutas();
                } else {
                    APP.mostrarToast('Producto "Fichas de Rutas" en desarrollo. Estará disponible pronto.', 'info');
                }
            });
        }

        // Generar Carta para Familias
        const btnCarta = document.getElementById('btn-generar-carta-familias');
        if (btnCarta) {
            btnCarta.addEventListener('click', () => {
                ESTADO.marcarProductoGenerado('cartaFamiliasGenerada');
                if (typeof PRODUCTOS !== 'undefined' && PRODUCTOS.generarCartaFamilias) {
                    PRODUCTOS.generarCartaFamilias();
                } else {
                    APP.mostrarToast('Producto "Carta para Familias" en desarrollo. Estará disponible pronto.', 'info');
                }
            });
        }

        // Generar Bitácora
        const btnBitacora = document.getElementById('btn-generar-bitacora');
        if (btnBitacora) {
            btnBitacora.addEventListener('click', () => {
                ESTADO.marcarProductoGenerado('bitacoraGenerada');
                if (typeof PRODUCTOS !== 'undefined' && PRODUCTOS.generarBitacora) {
                    PRODUCTOS.generarBitacora();
                } else {
                    APP.mostrarToast('Producto "Bitácora" en desarrollo. Estará disponible pronto.', 'info');
                }
            });
        }

        // Volver a sub-secciones
        const btnVolver = document.getElementById('btn-volver-sub-secciones');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                irASubSeccion('seleccion');
            });
        }
    }

    /* ========================================================
       SUSCRIBIR CAMBIOS
       ======================================================== */
    function suscribirCambios() {
        ESTADO.suscribir((evento) => {
            if (evento === 'reiniciado' || evento === 'borradorCargado' || evento === 'importado') {
                subSeccionActual = 'seleccion';
                renderizar();
            }
            // Cuando se actualizan las rutas seleccionadas, sincronizar
            if (evento === 'campoActualizado') {
                // No re-renderizar automáticamente para no perder foco
            }
        });
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        init,
        renderizar,
        irASubSeccion,
        getSubSeccionActual: () => subSeccionActual
    };

})();

// ============================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Se inicializa cuando el usuario entra al Momento 3
    // APP.init() se encarga de llamar a MOMENTO3.init() cuando corresponde
});
