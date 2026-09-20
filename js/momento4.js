/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento4.js — Momento 4: Cierre y Acuerdos (Acta de Acuerdos)
   v1.0 — Acta con acuerdos editables, seguimiento y firmas
   ============================================================
   Depende de:
     - ESTADO.obtenerSeccion('identificacion')
     - ESTADO.obtenerSeccion('lineaBase')
     - ESTADO.obtenerSeccion('termometro')
     - ESTADO.obtenerSeccion('voces')
     - ESTADO.obtenerSeccion('momento3')
     - ESTADO.obtenerSeccion('momento4')  ← nueva estructura
     - DATOS.momento3.meses, DATOS.momento3.roles
     - #modal-confirmacion (con #modal-titulo, #modal-mensaje,
                            #modal-aceptar, #modal-cancelar, #modal-cerrar)
   Patrón de la casa: defensivo + window.X = X;
   ============================================================ */

const MOMENTO4 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;
    let inicializado = false;

    /* ========================================================
       HELPERS DEFENSIVOS
       ======================================================== */
    function escaparHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function generarId(prefijo) {
        return (prefijo || 'item') + '_' + Date.now().toString(36) + '_' +
               Math.random().toString(36).substring(2, 7);
    }

    function mostrarToast(mensaje, tipo) {
        if (typeof APP !== 'undefined' && typeof APP.mostrarToast === 'function') {
            try { APP.mostrarToast(mensaje, tipo); return; } catch (e) { /* silencio */ }
        }
        console.log(`[Toast ${tipo}] ${mensaje}`);
    }

    function fechaHoyISO() {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    function formatearFecha(iso) {
        if (!iso) return '—';
        try {
            const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
            return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) { return iso; }
    }

    /* ========================================================
       ACCESO AL ESTADO
       ======================================================== */
    function getIdentificacion() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try { return ESTADO.obtenerSeccion('identificacion') || {}; }
            catch (e) { /* silencio */ }
        }
        return {};
    }

    function getM3() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try { return ESTADO.obtenerSeccion('momento3') || {}; }
            catch (e) { /* silencio */ }
        }
        return {};
    }

    function getM4() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try {
                const m4 = ESTADO.obtenerSeccion('momento4') || {};
                if (!Array.isArray(m4.acuerdos)) m4.acuerdos = [];
                if (typeof m4.proximosPasos !== 'string') m4.proximosPasos = '';
                if (typeof m4.fechaCompromiso !== 'string') m4.fechaCompromiso = '';
                if (typeof m4.fechaProximoSeguimiento !== 'string') m4.fechaProximoSeguimiento = '';
                if (typeof m4.convocaProximo !== 'string') m4.convocaProximo = '';
                if (!m4.firmas || typeof m4.firmas !== 'object') {
                    m4.firmas = { director: '', atp: '', docentes: [] };
                }
                if (!Array.isArray(m4.firmas.docentes)) m4.firmas.docentes = [];
                return m4;
            } catch (e) { /* silencio */ }
        }
        return {
            acuerdos: [],
            proximosPasos: '',
            fechaCompromiso: '',
            fechaProximoSeguimiento: '',
            convocaProximo: '',
            firmas: { director: '', atp: '', docentes: [] }
        };
    }

    function guardarM4(cambios) {
        if (typeof ESTADO === 'undefined') return;
        const m4 = getM4();
        const nuevo = { ...m4, ...cambios };
        try {
            if (typeof ESTADO.actualizarCampo === 'function') {
                ESTADO.actualizarCampo('momento4', 'acuerdos', nuevo.acuerdos);
                ESTADO.actualizarCampo('momento4', 'proximosPasos', nuevo.proximosPasos);
                ESTADO.actualizarCampo('momento4', 'fechaCompromiso', nuevo.fechaCompromiso);
                ESTADO.actualizarCampo('momento4', 'fechaProximoSeguimiento', nuevo.fechaProximoSeguimiento);
                ESTADO.actualizarCampo('momento4', 'convocaProximo', nuevo.convocaProximo);
                ESTADO.actualizarCampo('momento4', 'firmas', nuevo.firmas);
            }
        } catch (e) {
            console.warn('⚠️ MOMENTO4: no se pudo guardar:', e);
        }
    }

    /* ========================================================
       RECOLECTAR RESUMEN DEL DIAGNÓSTICO
       ======================================================== */
    function resumenDiagnostico() {
        const termometro = (typeof ESTADO !== 'undefined')
            ? (ESTADO.obtenerSeccion('termometro') || {})
            : {};
        const dims = termometro.dimensiones || {};

        let rojos = 0, amarillos = 0, verdes = 0, grises = 0;
        Object.keys(dims).forEach(k => {
            const v = dims[k];
            const nivel = (v && v.nivel) ? v.nivel : v;
            if (nivel === 'rojo' || nivel === 'atencion-prioritaria') rojos++;
            else if (nivel === 'amarillo' || nivel === 'en-progreso') amarillos++;
            else if (nivel === 'verde' || nivel === 'fortaleza') verdes++;
            else grises++;
        });

        const lectura = termometro.lecturaAutomatica || {};
        const prioridades = Array.isArray(lectura.prioridades) ? lectura.prioridades : [];

        const lineaBase = (typeof ESTADO !== 'undefined')
            ? (ESTADO.obtenerSeccion('lineaBase') || {})
            : {};
        const datosEscuela = Array.isArray(lineaBase.datosEscuela) ? lineaBase.datosEscuela : [];

        const voces = (typeof ESTADO !== 'undefined')
            ? (ESTADO.obtenerSeccion('voces') || {})
            : {};
        const nVoces = Object.keys(voces.estudiantes || {}).length
                     + Object.keys(voces.familias    || {}).length
                     + Object.keys(voces.docentes    || {}).length;

        return {
            rojos, amarillos, verdes, grises,
            totalDimensiones: rojos + amarillos + verdes + grises,
            prioridades,
            datosEscuela: datosEscuela.length,
            nVoces
        };
    }

    /* ========================================================
       RENDER PRINCIPAL
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-momento4');
        if (!contenedor) {
            console.error('❌ MOMENTO4: no existe #contenido-momento4');
            return;
        }
        renderizar();
        inicializado = true;
    }

    function render() {
        if (!inicializado || !contenedor || !document.body.contains(contenedor)) {
            init();
        } else {
            renderizar();
        }
    }

    function renderizar() {
        if (!contenedor) {
            contenedor = document.getElementById('contenido-momento4');
            if (!contenedor) return;
        }

        const id = getIdentificacion();
        const m3 = getM3();
        const m4 = getM4();
        const resumen = resumenDiagnostico();

        const sel = m3.seleccionRutas || {};
        const ruta = (sel.rutaId && typeof DATOS !== 'undefined' && DATOS.rutasLEO)
            ? DATOS.rutasLEO[sel.rutaId]
            : null;

        const acuerdos = Array.isArray(m4.acuerdos) ? m4.acuerdos : [];

        contenedor.innerHTML = `
            <div class="momento4-wrapper">

                <!-- ===== ENCABEZADO ===== -->
                <div class="seccion-header">
                    <span class="overline">Momento 4 · Cierre del CTE</span>
                    <h2><i class="fas fa-file-signature"></i> Acta de Acuerdos</h2>
                    <p class="seccion-descripcion">
                        Cierra la sesión del Consejo Técnico Escolar dejando por escrito
                        <strong>qué acordamos</strong>, <strong>quién lo hará</strong>,
                        <strong>para cuándo</strong> y <strong>cómo lo vamos a dar seguimiento</strong>.
                    </p>
                </div>

                <!-- ===== ENCUADRE ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-info-circle"></i> ¿Para qué sirve esta Acta?</h3>
                    <p class="ayuda">
                        El Acta de Acuerdos es el documento que convierte el diagnóstico
                        (Momentos 0–2) y la Hoja de Ruta Trimestral (Momento 3)
                        en <strong>compromisos concretos con responsables y fechas</strong>.
                        Se firma al cierre del CTE y se retoma en la siguiente sesión
                        para evaluar avances.
                    </p>
                </div>

                <!-- ===== BLOQUE 1: RESUMEN DEL DIAGNÓSTICO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-clipboard-list"></i> 1. Resumen del diagnóstico</h3>
                    <p class="ayuda">Datos recuperados automáticamente del Termómetro Lector.</p>

                    <div class="tarjeta-grid" style="margin-top: 0.75rem;">
                        <div class="tarjeta">
                            <h4 style="margin: 0 0 0.5rem;">Termómetro Lector</h4>
                            <p class="ayuda">${resumen.totalDimensiones} dimensión(es) evaluada(s)</p>
                            <div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.5rem;">
                                <span class="chip verde"><i class="fas fa-circle"></i> ${resumen.verdes} fortaleza(s)</span>
                                <span class="chip amarillo"><i class="fas fa-circle"></i> ${resumen.amarillos} en progreso</span>
                                <span class="chip rojo"><i class="fas fa-circle"></i> ${resumen.rojos} atención prioritaria</span>
                            </div>
                        </div>

                        <div class="tarjeta">
                            <h4 style="margin: 0 0 0.5rem;">Línea base · Lectura</h4>
                            <p class="ayuda">
                                ${resumen.datosEscuela > 0
                                    ? `${resumen.datosEscuela} grado(s) registrado(s)`
                                    : 'Sin datos de línea base capturados aún.'}
                            </p>
                        </div>

                        <div class="tarjeta">
                            <h4 style="margin: 0 0 0.5rem;">Voces del ecosistema</h4>
                            <p class="ayuda">
                                ${resumen.nVoces > 0
                                    ? `${resumen.nVoces} respuesta(s) registrada(s)`
                                    : 'Sin respuestas capturadas aún.'}
                            </p>
                        </div>
                    </div>

                    ${resumen.prioridades && resumen.prioridades.length > 0 ? `
                        <div class="caja-info" style="margin-top: 1rem;">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>Prioridades identificadas por el Termómetro:</strong>
                            <div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.5rem;">
                                ${resumen.prioridades.slice(0, 8).map(p => {
                                    const nombre = (typeof p === 'string') ? p : (p.nombre || p.id || '');
                                    return `<span class="chip carmesi">${escaparHTML(nombre)}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- ===== BLOQUE 2: RUTA DEL TRIMESTRE ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-route"></i> 2. Ruta LEO del trimestre</h3>
                    ${ruta ? `
                        <div class="caja-info" style="margin-top: 0.5rem;">
                            <strong>${escaparHTML(ruta.nombre)}</strong>
                            <p style="font-style: italic; margin: 0.4rem 0;">
                                "${escaparHTML(ruta.lema)}"
                            </p>
                            <p class="ayuda">
                                <strong>Pregunta orientadora:</strong>
                                ${escaparHTML(ruta.preguntaOrientadora)}
                            </p>
                            <p class="ayuda">
                                <strong>Actividades calendarizadas:</strong>
                                ${(m3.calendarizacion?.actividades || []).length} ·
                                <strong>Responsables asignados:</strong>
                                ${(m3.responsables?.asignaciones || []).length}
                            </p>
                        </div>
                    ` : `
                        <div class="caja-alerta">
                            <i class="fas fa-exclamation-triangle"></i>
                            Aún no se ha seleccionado una ruta en el Momento 3.
                            Puedes continuar con el Acta, pero el documento final reflejará este vacío.
                        </div>
                    `}
                </div>

                <!-- ===== BLOQUE 3: ACUERDOS ===== -->
                <div class="form-bloque">
                    <div class="flex-between" style="flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h3 style="margin: 0;"><i class="fas fa-handshake"></i> 3. Acuerdos del colectivo</h3>
                            <p class="ayuda" style="margin: 0.25rem 0 0;">
                                Cada acuerdo debe tener responsable(s) y fecha compromiso.
                            </p>
                        </div>
                        <button type="button" class="btn btn-primario" id="btn-nuevo-acuerdo">
                            <i class="fas fa-plus"></i> Agregar acuerdo
                        </button>
                    </div>

                    <div style="margin-top: 0.75rem;">
                        ${acuerdos.length === 0
                            ? `<div class="caja-info">
                                   <i class="fas fa-info-circle"></i>
                                   Aún no hay acuerdos. Agrega el primero con el botón de arriba.
                               </div>`
                            : acuerdos.map((a, i) => renderizarAcuerdo(a, i)).join('')
                        }
                    </div>
                </div>

                <!-- ===== BLOQUE 4: PRÓXIMOS PASOS ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-forward"></i> 4. Próximos pasos y seguimiento</h3>

                    <div class="form-grupo">
                        <label for="m4-proximos">Próximos pasos</label>
                        <p class="ayuda" style="margin: 0.25rem 0 0.5rem;">
                            Acciones específicas que se realizarán antes del siguiente CTE.
                        </p>
                        <textarea id="m4-proximos" rows="4" maxlength="800"
                                  placeholder="Ej. Socializar la Hoja de Ruta con el colectivo docente en la primera semana de octubre…">${escaparHTML(m4.proximosPasos)}</textarea>
                        <span class="ayuda">Máximo 800 caracteres.</span>
                    </div>

                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="m4-fecha-seguimiento">Fecha del próximo seguimiento</label>
                            <input type="date" id="m4-fecha-seguimiento"
                                   value="${escaparHTML(m4.fechaProximoSeguimiento || '')}">
                        </div>
                        <div class="form-grupo">
                            <label for="m4-convoca">¿Quién convoca?</label>
                            <input type="text" id="m4-convoca"
                                   value="${escaparHTML(m4.convocaProximo || '')}"
                                   placeholder="Ej. Dirección escolar"
                                   maxlength="120">
                        </div>
                    </div>
                </div>

                <!-- ===== BLOQUE 5: FIRMAS ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-signature"></i> 5. Firmas</h3>
                    <p class="ayuda">Personas que dan fe de los acuerdos tomados en esta sesión.</p>

                    <div class="form-fila" style="margin-top: 0.75rem;">
                        <div class="form-grupo">
                            <label for="m4-firma-director">Director(a)</label>
                            <input type="text" id="m4-firma-director"
                                   value="${escaparHTML(m4.firmas.director || id.director || '')}"
                                   placeholder="Nombre completo"
                                   maxlength="120">
                        </div>
                        <div class="form-grupo">
                            <label for="m4-firma-atp">ATP / Supervisor(a)</label>
                            <input type="text" id="m4-firma-atp"
                                   value="${escaparHTML(m4.firmas.atp || id.atp || '')}"
                                   placeholder="Nombre completo"
                                   maxlength="120">
                        </div>
                    </div>

                    <div style="margin-top: 1rem;">
                        <div class="flex-between" style="flex-wrap: wrap; gap: 0.5rem;">
                            <strong>Docentes firmantes</strong>
                            <button type="button" class="btn btn-sm btn-secundario" id="btn-nuevo-firmante">
                                <i class="fas fa-user-plus"></i> Agregar docente
                            </button>
                        </div>

                        <div style="margin-top: 0.5rem;">
                            ${m4.firmas.docentes.length === 0
                                ? `<p class="ayuda">Aún no hay docentes firmantes registrados.</p>`
                                : m4.firmas.docentes.map((d, i) => renderizarFirmante(d, i)).join('')
                            }
                        </div>
                    </div>
                </div>

                <!-- ===== BLOQUE 6: GENERAR ACTA ===== -->
                <div class="form-bloque" style="text-align: center;">
                    <h3><i class="fas fa-file-export"></i> 6. Generar el Acta</h3>
                    <p class="ayuda">El Acta se exporta como PDF o HTML con el mismo formato del Plan Lector.</p>

                    <button type="button" class="btn btn-primario" id="btn-generar-acta"
                            ${acuerdos.length === 0 ? 'disabled' : ''}>
                        <i class="fas fa-file-signature"></i> Generar Acta de Acuerdos
                    </button>

                    ${acuerdos.length === 0
                        ? '<p class="ayuda" style="margin-top: 0.5rem;">Agrega al menos un acuerdo para habilitar la exportación.</p>'
                        : ''}
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-${acuerdos.length > 0 ? 'exito' : 'info'}">
                    <i class="fas fa-${acuerdos.length > 0 ? 'check-circle' : 'info-circle'}"></i>
                    ${acuerdos.length > 0
                        ? `<strong>${acuerdos.length}</strong> acuerdo(s) registrado(s). Puedes generar el Acta cuando quieras.`
                        : 'Comienza agregando los acuerdos del colectivo.'
                    }
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       RENDER: TARJETA DE ACUERDO
       ======================================================== */
    function renderizarAcuerdo(acuerdo, index) {
        const estado = acuerdo.estado || 'pendiente';
        const estadoInfo = {
            'pendiente':   { label: 'Pendiente',   color: 'gris',     icono: 'fa-clock' },
            'en-proceso':  { label: 'En proceso',  color: 'amarillo', icono: 'fa-spinner' },
            'cumplido':    { label: 'Cumplido',    color: 'verde',    icono: 'fa-check-circle' },
            'reprogramado':{ label: 'Reprogramado',color: 'rojo',     icono: 'fa-rotate-left' }
        }[estado] || { label: estado, color: 'gris', icono: 'fa-circle' };

        return `
            <div class="tarjeta tarjeta-acuerdo"
                 style="margin-bottom: 0.75rem; padding: 1rem;"
                 data-acuerdo="${escaparHTML(acuerdo.id)}">
                <div class="flex-between" style="align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 220px;">
                        <div class="flex gap-1" style="flex-wrap: wrap; margin-bottom: 0.4rem;">
                            <span class="chip carmesi">Acuerdo ${index + 1}</span>
                            <span class="chip ${estadoInfo.color}">
                                <i class="fas ${estadoInfo.icono}"></i> ${escaparHTML(estadoInfo.label)}
                            </span>
                        </div>
                        <strong style="display: block; margin-bottom: 0.4rem;">
                            ${escaparHTML(acuerdo.texto || '(sin texto)')}
                        </strong>
                        <p class="ayuda" style="margin: 0.25rem 0;">
                            <strong>Responsables:</strong>
                            ${escaparHTML(acuerdo.responsables || '—')}
                        </p>
                        <p class="ayuda" style="margin: 0.25rem 0;">
                            <strong>Fecha compromiso:</strong>
                            ${formatearFecha(acuerdo.fechaCompromiso)}
                        </p>
                    </div>

                    <div class="flex gap-1">
                        <button type="button"
                                class="btn btn-icono btn-secundario btn-editar-acuerdo"
                                data-acuerdo="${escaparHTML(acuerdo.id)}"
                                title="Editar">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button type="button"
                                class="btn btn-icono btn-peligro btn-eliminar-acuerdo"
                                data-acuerdo="${escaparHTML(acuerdo.id)}"
                                title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /* ========================================================
       RENDER: TARJETA DE FIRMANTE (DOCENTE)
       ======================================================== */
    function renderizarFirmante(docente, index) {
        return `
            <div class="tarjeta" style="padding: 0.6rem 0.85rem; margin-bottom: 0.5rem;"
                 data-firmante="${index}">
                <div class="flex-between" style="align-items: center; gap: 0.5rem;">
                    <div style="flex: 1;">
                        <strong>${escaparHTML(docente.nombre || '(sin nombre)')}</strong>
                        <span class="ayuda"> · ${escaparHTML(docente.rol || 'Docente')}</span>
                    </div>
                    <button type="button"
                            class="btn btn-icono btn-peligro btn-eliminar-firmante"
                            data-index="${index}"
                            title="Quitar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /* ========================================================
       MODAL GENÉRICO
       ======================================================== */
    function abrirModal({ titulo, contenidoHTML, textoAceptar, onAceptar }) {
        const modal = document.getElementById('modal-confirmacion');
        if (!modal) {
            console.error('❌ MOMENTO4: no existe #modal-confirmacion');
            mostrarToast('Error: modal no disponible.', 'error');
            return;
        }
        const elTitulo    = document.getElementById('modal-titulo');
        const elMensaje   = document.getElementById('modal-mensaje');
        const btnAceptar  = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');
        const btnCerrar   = document.getElementById('modal-cerrar');

        if (!elTitulo || !elMensaje || !btnAceptar || !btnCancelar || !btnCerrar) {
            console.error('❌ MOMENTO4: faltan elementos internos del modal');
            mostrarToast('Error: modal incompleto.', 'error');
            return;
        }

        elTitulo.textContent = titulo;
        elMensaje.innerHTML = contenidoHTML;
        btnAceptar.textContent = textoAceptar || 'Aceptar';

        const cerrar = () => { modal.style.display = 'none'; };

        const nuevoAceptar  = btnAceptar.cloneNode(true);
        const nuevoCancelar = btnCancelar.cloneNode(true);
        const nuevoCerrar   = btnCerrar.cloneNode(true);
        btnAceptar.replaceWith(nuevoAceptar);
        btnCancelar.replaceWith(nuevoCancelar);
        btnCerrar.replaceWith(nuevoCerrar);

        nuevoCancelar.addEventListener('click', cerrar);
        nuevoCerrar.addEventListener('click', cerrar);
        nuevoAceptar.addEventListener('click', () => {
            const resultado = onAceptar();
            if (resultado !== false) cerrar();
        });

        modal.style.display = 'flex';
    }

    /* ========================================================
       MODAL: NUEVO / EDITAR ACUERDO
       ======================================================== */
    function abrirModalAcuerdo(acuerdoId) {
        const m4 = getM4();
        const acuerdo = acuerdoId
            ? m4.acuerdos.find(a => a.id === acuerdoId)
            : null;

        const esEdicion = !!acuerdo;

        abrirModal({
            titulo: esEdicion ? 'Editar acuerdo' : 'Nuevo acuerdo',
            textoAceptar: esEdicion ? 'Guardar cambios' : 'Agregar acuerdo',
            contenidoHTML: `
                <div class="form-grupo">
                    <label for="ac-texto">Texto del acuerdo <span class="obligatorio">*</span></label>
                    <textarea id="ac-texto" rows="3" maxlength="500"
                              placeholder="Ej. Trabajar la Ruta 1 (LEO para comprender) durante todo el primer trimestre en todos los grupos.">${escaparHTML(acuerdo?.texto || '')}</textarea>
                </div>

                <div class="form-grupo">
                    <label for="ac-responsables">Responsable(s) <span class="obligatorio">*</span></label>
                    <input type="text" id="ac-responsables"
                           value="${escaparHTML(acuerdo?.responsables || '')}"
                           placeholder="Ej. Colectivo docente, Dirección, ATP…"
                           maxlength="180">
                </div>

                <div class="form-fila">
                    <div class="form-grupo">
                        <label for="ac-fecha">Fecha compromiso</label>
                        <input type="date" id="ac-fecha"
                               value="${escaparHTML(acuerdo?.fechaCompromiso || '')}">
                    </div>
                    <div class="form-grupo">
                        <label for="ac-estado">Estado</label>
                        <select id="ac-estado">
                            <option value="pendiente"    ${(!acuerdo || acuerdo.estado === 'pendiente')    ? 'selected' : ''}>Pendiente</option>
                            <option value="en-proceso"   ${(acuerdo && acuerdo.estado === 'en-proceso')    ? 'selected' : ''}>En proceso</option>
                            <option value="cumplido"     ${(acuerdo && acuerdo.estado === 'cumplido')      ? 'selected' : ''}>Cumplido</option>
                            <option value="reprogramado" ${(acuerdo && acuerdo.estado === 'reprogramado')  ? 'selected' : ''}>Reprogramado</option>
                        </select>
                    </div>
                </div>
            `,
            onAceptar: () => {
                const texto = (document.getElementById('ac-texto')?.value || '').trim();
                const responsables = (document.getElementById('ac-responsables')?.value || '').trim();
                const fechaCompromiso = (document.getElementById('ac-fecha')?.value || '').trim();
                const estado = (document.getElementById('ac-estado')?.value || 'pendiente').trim();

                if (!texto)        { mostrarToast('El texto del acuerdo es obligatorio.', 'error'); return false; }
                if (!responsables) { mostrarToast('Indica al menos un responsable.', 'error');       return false; }

                const m4Actual = getM4();
                let acuerdos;

                if (esEdicion) {
                    acuerdos = m4Actual.acuerdos.map(a => a.id === acuerdoId
                        ? { ...a, texto, responsables, fechaCompromiso, estado }
                        : a
                    );
                } else {
                    acuerdos = [...m4Actual.acuerdos, {
                        id: generarId('ac'),
                        texto,
                        responsables,
                        fechaCompromiso,
                        estado
                    }];
                }

                guardarM4({ acuerdos });
                mostrarToast(esEdicion ? 'Acuerdo actualizado.' : 'Acuerdo agregado.', 'exito');
                renderizar();
            }
        });
    }

    /* ========================================================
       CONFIRMAR ELIMINAR ACUERDO
       ======================================================== */
    function confirmarEliminarAcuerdo(acuerdoId) {
        const m4 = getM4();
        const acuerdo = m4.acuerdos.find(a => a.id === acuerdoId);
        if (!acuerdo) return;

        abrirModal({
            titulo: 'Eliminar acuerdo',
            textoAceptar: 'Sí, eliminar',
            contenidoHTML: `
                <p>¿Eliminar este acuerdo?</p>
                <p class="ayuda" style="font-style: italic;">"${escaparHTML(acuerdo.texto)}"</p>
                <p class="ayuda">Esta acción no se puede deshacer.</p>
            `,
            onAceptar: () => {
                const m4Actual = getM4();
                const acuerdos = m4Actual.acuerdos.filter(a => a.id !== acuerdoId);
                guardarM4({ acuerdos });
                mostrarToast('Acuerdo eliminado.', 'info');
                renderizar();
            }
        });
    }

    /* ========================================================
       MODAL: NUEVO FIRMANTE (DOCENTE)
       ======================================================== */
    function abrirModalFirmante() {
        abrirModal({
            titulo: 'Agregar docente firmante',
            textoAceptar: 'Agregar',
            contenidoHTML: `
                <div class="form-grupo">
                    <label for="fr-nombre">Nombre <span class="obligatorio">*</span></label>
                    <input type="text" id="fr-nombre" placeholder="Nombre completo" maxlength="120">
                </div>
                <div class="form-grupo">
                    <label for="fr-rol">Rol</label>
                    <input type="text" id="fr-rol"
                           placeholder="Ej. Docente de 4°A"
                           maxlength="120">
                </div>
            `,
            onAceptar: () => {
                const nombre = (document.getElementById('fr-nombre')?.value || '').trim();
                const rol = (document.getElementById('fr-rol')?.value || 'Docente').trim();
                if (!nombre) { mostrarToast('El nombre es obligatorio.', 'error'); return false; }

                const m4Actual = getM4();
                const docentes = [...m4Actual.firmas.docentes, { nombre, rol }];
                guardarM4({ firmas: { ...m4Actual.firmas, docentes } });
                mostrarToast('Docente agregado.', 'exito');
                renderizar();
            }
        });
    }

    /* ========================================================
       CONFIRMAR ELIMINAR FIRMANTE
       ======================================================== */
    function eliminarFirmante(index) {
        const m4 = getM4();
        const docentes = m4.firmas.docentes.filter((_, i) => i !== index);
        guardarM4({ firmas: { ...m4.firmas, docentes } });
        mostrarToast('Docente quitado.', 'info');
        renderizar();
    }

    /* ========================================================
       EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Nuevo acuerdo
        const btnNuevo = document.getElementById('btn-nuevo-acuerdo');
        if (btnNuevo) {
            btnNuevo.addEventListener('click', () => abrirModalAcuerdo(null));
        }

        // Editar / eliminar acuerdo
        contenedor.querySelectorAll('.btn-editar-acuerdo').forEach(btn => {
            btn.addEventListener('click', e => {
                abrirModalAcuerdo(e.currentTarget.dataset.acuerdo);
            });
        });
        contenedor.querySelectorAll('.btn-eliminar-acuerdo').forEach(btn => {
            btn.addEventListener('click', e => {
                confirmarEliminarAcuerdo(e.currentTarget.dataset.acuerdo);
            });
        });

        // Próximos pasos
        const proximos = document.getElementById('m4-proximos');
        if (proximos) {
            proximos.addEventListener('input', e => {
                guardarM4({ proximosPasos: e.target.value });
            });
        }

        // Fecha seguimiento
        const fechaSeg = document.getElementById('m4-fecha-seguimiento');
        if (fechaSeg) {
            fechaSeg.addEventListener('change', e => {
                guardarM4({ fechaProximoSeguimiento: e.target.value });
            });
        }

        // Convoca
        const convoca = document.getElementById('m4-convoca');
        if (convoca) {
            convoca.addEventListener('input', e => {
                guardarM4({ convocaProximo: e.target.value });
            });
        }

        // Firmas director / atp
        const firmaDirector = document.getElementById('m4-firma-director');
        if (firmaDirector) {
            firmaDirector.addEventListener('input', e => {
                const m4 = getM4();
                guardarM4({ firmas: { ...m4.firmas, director: e.target.value } });
            });
        }
        const firmaAtp = document.getElementById('m4-firma-atp');
        if (firmaAtp) {
            firmaAtp.addEventListener('input', e => {
                const m4 = getM4();
                guardarM4({ firmas: { ...m4.firmas, atp: e.target.value } });
            });
        }

        // Nuevo firmante
        const btnFirmante = document.getElementById('btn-nuevo-firmante');
        if (btnFirmante) {
            btnFirmante.addEventListener('click', abrirModalFirmante);
        }

        // Eliminar firmante
        contenedor.querySelectorAll('.btn-eliminar-firmante').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = parseInt(e.currentTarget.dataset.index, 10);
                if (!isNaN(idx)) eliminarFirmante(idx);
            });
        });

        // Generar Acta
        const btnActa = document.getElementById('btn-generar-acta');
        if (btnActa) {
            btnActa.addEventListener('click', () => {
                if (typeof PRODUCTOS !== 'undefined' && typeof PRODUCTOS.generarActaAcuerdos === 'function') {
                    PRODUCTOS.generarActaAcuerdos();
                } else {
                    mostrarToast('El generador del Acta aún no está disponible.', 'error');
                }
            });
        }
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        init,
        render,
        renderizar
    };

})();

/* ============================================================
   EXPOSICIÓN A WINDOW — FIX CRÍTICO
   ============================================================ */
if (typeof window !== 'undefined') {
    window.MOMENTO4 = MOMENTO4;
    window.Momento4 = MOMENTO4;   // alias para compatibilidad con app.js
    console.log('✅ MOMENTO4 expuesto en window (v1.0)');
}
