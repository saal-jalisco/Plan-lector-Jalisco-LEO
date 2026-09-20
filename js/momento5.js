/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento5.js — Momento 5: Evaluación y Documentación
   v1.0 — Cierre del trimestre con balance, evaluación y evidencias
   ============================================================
   Depende de:
     - ESTADO.obtenerSeccion('identificacion')
     - ESTADO.obtenerSeccion('termometro')
     - ESTADO.obtenerSeccion('momento3')
     - ESTADO.obtenerSeccion('momento4')
     - ESTADO.obtenerSeccion('momento5')   ← nueva estructura
     - DATOS.momento3.tiposEvidencia
     - #modal-confirmacion
   Patrón de la casa: defensivo + window.X = X;
   ============================================================ */

const MOMENTO5 = (function() {

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
            try { return ESTADO.obtenerSeccion('momento4') || {}; }
            catch (e) { /* silencio */ }
        }
        return { acuerdos: [] };
    }

    function getM5() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try {
                const m5 = ESTADO.obtenerSeccion('momento5') || {};

                if (!m5.evaluacion || typeof m5.evaluacion !== 'object') {
                    m5.evaluacion = { logros: '', dificultades: '', aprendizajes: '', recomendaciones: '' };
                }
                ['logros', 'dificultades', 'aprendizajes', 'recomendaciones'].forEach(k => {
                    if (typeof m5.evaluacion[k] !== 'string') m5.evaluacion[k] = '';
                });

                if (!m5.documentacion || typeof m5.documentacion !== 'object') {
                    m5.documentacion = { evidencias: [], notas: '' };
                }
                if (!Array.isArray(m5.documentacion.evidencias)) m5.documentacion.evidencias = [];
                if (typeof m5.documentacion.notas !== 'string') m5.documentacion.notas = '';

                if (!m5.meta || typeof m5.meta !== 'object') {
                    m5.meta = { fechaCierre: '', elaboradoPor: '', proximoTrimestre: '' };
                }
                ['fechaCierre', 'elaboradoPor', 'proximoTrimestre'].forEach(k => {
                    if (typeof m5.meta[k] !== 'string') m5.meta[k] = '';
                });

                return m5;
            } catch (e) { /* silencio */ }
        }
        return {
            evaluacion: { logros: '', dificultades: '', aprendizajes: '', recomendaciones: '' },
            documentacion: { evidencias: [], notas: '' },
            meta: { fechaCierre: '', elaboradoPor: '', proximoTrimestre: '' }
        };
    }

    function guardarM5(cambios) {
        if (typeof ESTADO === 'undefined') return;
        const m5 = getM5();
        const nuevo = {
            evaluacion: { ...m5.evaluacion, ...(cambios.evaluacion || {}) },
            documentacion: { ...m5.documentacion, ...(cambios.documentacion || {}) },
            meta: { ...m5.meta, ...(cambios.meta || {}) }
        };
        try {
            if (typeof ESTADO.actualizarCampo === 'function') {
                ESTADO.actualizarCampo('momento5', 'evaluacion', nuevo.evaluacion);
                ESTADO.actualizarCampo('momento5', 'documentacion', nuevo.documentacion);
                ESTADO.actualizarCampo('momento5', 'meta', nuevo.meta);
            }
        } catch (e) {
            console.warn('⚠️ MOMENTO5: no se pudo guardar:', e);
        }
    }

    /* ========================================================
       CATÁLOGOS
       ======================================================== */
    function getTiposEvidencia() {
        if (typeof DATOS !== 'undefined'
            && DATOS.momento3
            && Array.isArray(DATOS.momento3.tiposEvidencia)) {
            return DATOS.momento3.tiposEvidencia.slice();
        }
        return ['Fotografía', 'Video', 'Audio', 'Texto escrito', 'Dibujo', 'Producto final', 'Lista de asistencia', 'Otro'];
    }

    /* ========================================================
       BALANCE AUTOMÁTICO DEL TRIMESTRE
       ======================================================== */
    function calcularBalance() {
        const m3 = getM3();
        const m4 = getM4();

        const actividades = (m3.calendarizacion && m3.calendarizacion.actividades) || [];
        const registros   = (m3.bitacora && m3.bitacora.registros) || [];
        const acuerdos    = Array.isArray(m4.acuerdos) ? m4.acuerdos : [];

        const totalAct = actividades.length;
        const completadas = actividades.filter(a => a.estado === 'completada').length;
        const enProceso   = actividades.filter(a => a.estado === 'en-proceso').length;
        const noIniciadas = actividades.filter(a => a.estado === 'no-iniciada' || !a.estado).length;
        const reprogramadas = actividades.filter(a => a.estado === 'reprogramada').length;

        const pctAct = totalAct > 0 ? Math.round((completadas / totalAct) * 100) : 0;

        const totalAcuerdos = acuerdos.length;
        const cumplidos     = acuerdos.filter(a => a.estado === 'cumplido').length;
        const enProcesoAc   = acuerdos.filter(a => a.estado === 'en-proceso').length;
        const pendientes    = acuerdos.filter(a => a.estado === 'pendiente' || !a.estado).length;
        const reprogramados = acuerdos.filter(a => a.estado === 'reprogramado').length;

        const pctAc = totalAcuerdos > 0 ? Math.round((cumplidos / totalAcuerdos) * 100) : 0;

        return {
            actividades: { total: totalAct, completadas, enProceso, noIniciadas, reprogramadas, pct: pctAct },
            registros: { total: registros.length },
            acuerdos: { total: totalAcuerdos, cumplidos, enProceso: enProcesoAc, pendientes, reprogramados, pct: pctAc }
        };
    }

    /* ========================================================
       INIT / RENDER PÚBLICO
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-momento5');
        if (!contenedor) {
            console.error('❌ MOMENTO5: no existe #contenido-momento5');
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

    /* ========================================================
       RENDER PRINCIPAL
       ======================================================== */
    function renderizar() {
        if (!contenedor) {
            contenedor = document.getElementById('contenido-momento5');
            if (!contenedor) return;
        }

        const id = getIdentificacion();
        const m3 = getM3();
        const m5 = getM5();
        const balance = calcularBalance();

        const sel = m3.seleccionRutas || {};
        const ruta = (sel.rutaId && typeof DATOS !== 'undefined' && DATOS.rutasLEO)
            ? DATOS.rutasLEO[sel.rutaId]
            : null;

        const evidencias = m5.documentacion.evidencias || [];

        contenedor.innerHTML = `
            <div class="momento5-wrapper">

                <!-- ===== ENCABEZADO ===== -->
                <div class="seccion-header">
                    <span class="overline">Momento 5 · Cierre del trimestre</span>
                    <h2><i class="fas fa-clipboard-check"></i> Evaluación y Documentación</h2>
                    <p class="seccion-descripcion">
                        Cierra el ciclo del trimestre: haz un <strong>balance</strong> de lo implementado,
                        <strong>evalúa el proceso</strong> con el colectivo y <strong>documenta las evidencias</strong>
                        para el siguiente trimestre.
                    </p>
                </div>

                <!-- ===== ENCUADRE ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-info-circle"></i> ¿Para qué sirve este momento?</h3>
                    <p class="ayuda">
                        El Momento 5 cierra el ciclo: convierte la experiencia del trimestre
                        en <strong>aprendizajes documentados</strong>. Aquí no se evalúa a los estudiantes:
                        se evalúa <strong>el proceso del colectivo</strong> para mejorar la implementación
                        en el siguiente trimestre.
                    </p>
                </div>

                <!-- ===== BLOQUE 1: BALANCE AUTOMÁTICO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-chart-pie"></i> 1. Balance del trimestre</h3>
                    <p class="ayuda">Datos recuperados automáticamente de los Momentos 3 y 4.</p>

                    <div class="tarjeta-grid" style="margin-top: 0.75rem;">
                        <div class="tarjeta">
                            <h4 style="margin: 0 0 0.5rem;">Actividades</h4>
                            <p style="font-size: 1.6rem; color: var(--carmesi); margin: 0.25rem 0;">
                                ${balance.actividades.completadas} / ${balance.actividades.total}
                            </p>
                            <p class="ayuda" style="margin: 0;">completadas (${balance.actividades.pct}%)</p>
                            <div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.5rem;">
                                <span class="chip verde">${balance.actividades.completadas} completadas</span>
                                <span class="chip amarillo">${balance.actividades.enProceso} en proceso</span>
                                <span class="chip gris">${balance.actividades.noIniciadas} no iniciadas</span>
                                <span class="chip rojo">${balance.actividades.reprogramadas} reprogramadas</span>
                            </div>
                        </div>

                        <div class="tarjeta">
                            <h4 style="margin: 0 0 0.5rem;">Acuerdos</h4>
                            <p style="font-size: 1.6rem; color: var(--carmesi); margin: 0.25rem 0;">
                                ${balance.acuerdos.cumplidos} / ${balance.acuerdos.total}
                            </p>
                            <p class="ayuda" style="margin: 0;">cumplidos (${balance.acuerdos.pct}%)</p>
                            <div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.5rem;">
                                <span class="chip verde">${balance.acuerdos.cumplidos} cumplidos</span>
                                <span class="chip amarillo">${balance.acuerdos.enProceso} en proceso</span>
                                <span class="chip gris">${balance.acuerdos.pendientes} pendientes</span>
                            </div>
                        </div>

                        <div class="tarjeta">
                            <h4 style="margin: 0 0 0.5rem;">Bitácora</h4>
                            <p style="font-size: 1.6rem; color: var(--carmesi); margin: 0.25rem 0;">
                                ${balance.registros.total}
                            </p>
                            <p class="ayuda" style="margin: 0;">registro(s) documentado(s)</p>
                        </div>
                    </div>

                    ${ruta ? `
                        <div class="caja-info" style="margin-top: 1rem;">
                            <i class="fas fa-route"></i>
                            <strong>Ruta trabajada:</strong> ${escaparHTML(ruta.nombre)}
                            <br><span class="ayuda" style="font-style: italic;">"${escaparHTML(ruta.lema)}"</span>
                        </div>
                    ` : `
                        <div class="caja-alerta" style="margin-top: 1rem;">
                            <i class="fas fa-exclamation-triangle"></i>
                            No hay una ruta seleccionada en el Momento 3.
                        </div>
                    `}
                </div>

                <!-- ===== BLOQUE 2: EVALUACIÓN DEL PROCESO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comments"></i> 2. Evaluación del proceso</h3>
                    <p class="ayuda">
                        Aportaciones del colectivo sobre la experiencia del trimestre.
                        Se recuperan en la siguiente sesión de CTE.
                    </p>

                    <div class="form-grupo" style="margin-top: 0.75rem;">
                        <label for="m5-logros"><i class="fas fa-trophy" style="color: var(--verde);"></i> Logros</label>
                        <p class="ayuda" style="margin: 0.25rem 0 0.5rem;">
                            ¿Qué salió bien? ¿Qué actividades funcionaron mejor? ¿Qué participantes se involucraron?
                        </p>
                        <textarea id="m5-logros" rows="4" maxlength="800"
                                  placeholder="Ej. La lectura en voz alta diaria se consolidó como práctica permanente en todos los grupos…">${escaparHTML(m5.evaluacion.logros)}</textarea>
                        <span class="ayuda">Máximo 800 caracteres.</span>
                    </div>

                    <div class="form-grupo">
                        <label for="m5-dificultades"><i class="fas fa-triangle-exclamation" style="color: var(--naranja);"></i> Dificultades</label>
                        <p class="ayuda" style="margin: 0.25rem 0 0.5rem;">
                            ¿Qué obstáculos aparecieron? ¿Qué no funcionó como esperábamos?
                        </p>
                        <textarea id="m5-dificultades" rows="4" maxlength="800"
                                  placeholder="Ej. Falta de tiempo en la jornada para algunas actividades del banco…">${escaparHTML(m5.evaluacion.dificultades)}</textarea>
                        <span class="ayuda">Máximo 800 caracteres.</span>
                    </div>

                    <div class="form-grupo">
                        <label for="m5-aprendizajes"><i class="fas fa-lightbulb" style="color: var(--carmesi);"></i> Aprendizajes del colectivo</label>
                        <p class="ayuda" style="margin: 0.25rem 0 0.5rem;">
                            ¿Qué descubrimos como equipo docente? ¿Qué prácticas nuevas adoptamos?
                        </p>
                        <textarea id="m5-aprendizajes" rows="4" maxlength="800"
                                  placeholder="Ej. Aprendimos que las anclas funcionan mejor cuando se combinan con actividades del banco del mismo tipo…">${escaparHTML(m5.evaluacion.aprendizajes)}</textarea>
                        <span class="ayuda">Máximo 800 caracteres.</span>
                    </div>

                    <div class="form-grupo">
                        <label for="m5-recomendaciones"><i class="fas fa-arrow-right" style="color: var(--carmesi);"></i> Recomendaciones para el siguiente trimestre</label>
                        <p class="ayuda" style="margin: 0.25rem 0 0.5rem;">
                            ¿Qué ajustamos? ¿Qué mantenemos? ¿Qué dejamos de hacer?
                        </p>
                        <textarea id="m5-recomendaciones" rows="4" maxlength="800"
                                  placeholder="Ej. Reservar la primera semana de cada mes para planear las actividades del banco…">${escaparHTML(m5.evaluacion.recomendaciones)}</textarea>
                        <span class="ayuda">Máximo 800 caracteres.</span>
                    </div>
                </div>

                <!-- ===== BLOQUE 3: DOCUMENTACIÓN ===== -->
                <div class="form-bloque">
                    <div class="flex-between" style="flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h3 style="margin: 0;"><i class="fas fa-folder-open"></i> 3. Documentación · Evidencias</h3>
                            <p class="ayuda" style="margin: 0.25rem 0 0;">
                                Registra las evidencias clave del trimestre. No se suben archivos:
                                se anotan para tenerlas ubicadas.
                            </p>
                        </div>
                        <button type="button" class="btn btn-primario" id="btn-nueva-evidencia">
                            <i class="fas fa-plus"></i> Agregar evidencia
                        </button>
                    </div>

                    <div style="margin-top: 0.75rem;">
                        ${evidencias.length === 0
                            ? `<div class="caja-info">
                                   <i class="fas fa-info-circle"></i>
                                   Aún no hay evidencias registradas. Agrega la primera con el botón de arriba.
                               </div>`
                            : evidencias.map((ev, i) => renderizarEvidencia(ev, i)).join('')
                        }
                    </div>
                </div>

                <!-- ===== BLOQUE 4: METADATOS DEL CIERRE ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-clipboard-list"></i> 4. Datos del cierre</h3>

                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="m5-fecha-cierre">Fecha de cierre del trimestre</label>
                            <input type="date" id="m5-fecha-cierre"
                                   value="${escaparHTML(m5.meta.fechaCierre || '')}">
                        </div>
                        <div class="form-grupo">
                            <label for="m5-elaborado-por">Elaborado por</label>
                            <input type="text" id="m5-elaborado-por"
                                   value="${escaparHTML(m5.meta.elaboradoPor || '')}"
                                   placeholder="Ej. Colectivo docente"
                                   maxlength="180">
                        </div>
                    </div>

                    <div class="form-grupo">
                        <label for="m5-proximo-trimestre">Foco propuesto para el siguiente trimestre</label>
                        <p class="ayuda" style="margin: 0.25rem 0 0.5rem;">
                            Una frase que capture hacia dónde queremos llevar el Plan Lector en el siguiente trimestre.
                        </p>
                        <input type="text" id="m5-proximo-trimestre"
                               value="${escaparHTML(m5.meta.proximoTrimestre || '')}"
                               placeholder="Ej. Profundizar la comprensión inferencial con textos informativos"
                               maxlength="220">
                    </div>

                    <div class="form-grupo">
                        <label for="m5-notas"><i class="fas fa-comment-dots"></i> Notas generales</label>
                        <p class="ayuda" style="margin: 0.25rem 0 0.5rem;">
                            Observaciones del colectivo que no encajen en los campos anteriores.
                        </p>
                        <textarea id="m5-notas" rows="3" maxlength="600"
                                  placeholder="Ej. Registramos tres ausencias significativas por actividades institucionales…">${escaparHTML(m5.documentacion.notas)}</textarea>
                        <span class="ayuda">Máximo 600 caracteres.</span>
                    </div>
                </div>

                <!-- ===== BLOQUE 5: GENERAR INFORME ===== -->
                <div class="form-bloque" style="text-align: center;">
                    <h3><i class="fas fa-file-export"></i> 5. Generar el Informe de cierre</h3>
                    <p class="ayuda">
                        El Informe de cierre del trimestre incluye el balance, la evaluación del
                        colectivo, las evidencias y los acuerdos del Momento 4.
                    </p>

                    <button type="button" class="btn btn-primario" id="btn-generar-informe">
                        <i class="fas fa-file-lines"></i> Generar Informe de cierre
                    </button>
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-${(balance.actividades.total > 0 || balance.acuerdos.total > 0) ? 'exito' : 'info'}">
                    <i class="fas fa-${(balance.actividades.total > 0 || balance.acuerdos.total > 0) ? 'check-circle' : 'info-circle'}"></i>
                    ${(balance.actividades.total > 0 || balance.acuerdos.total > 0)
                        ? `Balance listo. Puedes generar el Informe cuando quieras.`
                        : 'Aún no hay datos de Momentos 3 y 4 para generar el balance.'
                    }
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       RENDER: TARJETA DE EVIDENCIA
       ======================================================== */
    function renderizarEvidencia(ev, index) {
        const tipo = ev.tipo || 'Otro';

        return `
            <div class="tarjeta tarjeta-evidencia"
                 style="margin-bottom: 0.6rem; padding: 0.85rem 1rem;"
                 data-evidencia="${escaparHTML(ev.id)}">
                <div class="flex-between" style="align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 220px;">
                        <div class="flex gap-1" style="flex-wrap: wrap; margin-bottom: 0.3rem;">
                            <span class="chip carmesi">Evidencia ${index + 1}</span>
                            <span class="chip">${escaparHTML(tipo)}</span>
                            ${ev.fecha ? `<span class="chip gris"><i class="fas fa-calendar-day"></i> ${formatearFecha(ev.fecha)}</span>` : ''}
                        </div>
                        <strong style="display: block; margin-bottom: 0.25rem;">
                            ${escaparHTML(ev.descripcion || '(sin descripción)')}
                        </strong>
                        ${ev.responsable ? `<p class="ayuda" style="margin: 0.2rem 0;"><strong>Responsable:</strong> ${escaparHTML(ev.responsable)}</p>` : ''}
                        ${ev.vinculo ? `<p class="ayuda" style="margin: 0.2rem 0;"><strong>Ubicación / vínculo:</strong> ${escaparHTML(ev.vinculo)}</p>` : ''}
                    </div>

                    <div class="flex gap-1">
                        <button type="button"
                                class="btn btn-icono btn-secundario btn-editar-evidencia"
                                data-evidencia="${escaparHTML(ev.id)}"
                                title="Editar">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button type="button"
                                class="btn btn-icono btn-peligro btn-eliminar-evidencia"
                                data-evidencia="${escaparHTML(ev.id)}"
                                title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
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
            console.error('❌ MOMENTO5: no existe #modal-confirmacion');
            mostrarToast('Error: modal no disponible.', 'error');
            return;
        }
        const elTitulo    = document.getElementById('modal-titulo');
        const elMensaje   = document.getElementById('modal-mensaje');
        const btnAceptar  = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');
        const btnCerrar   = document.getElementById('modal-cerrar');

        if (!elTitulo || !elMensaje || !btnAceptar || !btnCancelar || !btnCerrar) {
            console.error('❌ MOMENTO5: faltan elementos internos del modal');
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
       MODAL: NUEVA / EDITAR EVIDENCIA
       ======================================================== */
    function abrirModalEvidencia(evidenciaId) {
        const m5 = getM5();
        const ev = evidenciaId
            ? m5.documentacion.evidencias.find(e => e.id === evidenciaId)
            : null;
        const esEdicion = !!ev;

        const tipos = getTiposEvidencia();

        abrirModal({
            titulo: esEdicion ? 'Editar evidencia' : 'Nueva evidencia',
            textoAceptar: esEdicion ? 'Guardar cambios' : 'Agregar evidencia',
            contenidoHTML: `
                <div class="form-grupo">
                    <label for="ev-tipo">Tipo de evidencia <span class="obligatorio">*</span></label>
                    <select id="ev-tipo">
                        ${tipos.map(t => `
                            <option value="${escaparHTML(t)}" ${ev?.tipo === t ? 'selected' : ''}>
                                ${escaparHTML(t)}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-grupo">
                    <label for="ev-descripcion">Descripción <span class="obligatorio">*</span></label>
                    <textarea id="ev-descripcion" rows="3" maxlength="400"
                              placeholder="Ej. Fotos del círculo de lectura del 5°A en la semana 3 de octubre.">${escaparHTML(ev?.descripcion || '')}</textarea>
                </div>

                <div class="form-fila">
                    <div class="form-grupo">
                        <label for="ev-fecha">Fecha</label>
                        <input type="date" id="ev-fecha" value="${escaparHTML(ev?.fecha || fechaHoyISO())}">
                    </div>
                    <div class="form-grupo">
                        <label for="ev-responsable">Responsable</label>
                        <input type="text" id="ev-responsable"
                               value="${escaparHTML(ev?.responsable || '')}"
                               placeholder="Ej. Docente de 5°A"
                               maxlength="120">
                    </div>
                </div>

                <div class="form-grupo">
                    <label for="ev-vinculo">Ubicación / vínculo (opcional)</label>
                    <input type="text" id="ev-vinculo"
                           value="${escaparHTML(ev?.vinculo || '')}"
                           placeholder="Ej. Carpeta digital de la escuela · Drive · Carpeta física del aula"
                           maxlength="200">
                </div>
            `,
            onAceptar: () => {
                const tipo = (document.getElementById('ev-tipo')?.value || '').trim();
                const descripcion = (document.getElementById('ev-descripcion')?.value || '').trim();
                const fecha = (document.getElementById('ev-fecha')?.value || '').trim();
                const responsable = (document.getElementById('ev-responsable')?.value || '').trim();
                const vinculo = (document.getElementById('ev-vinculo')?.value || '').trim();

                if (!tipo)         { mostrarToast('Selecciona un tipo de evidencia.', 'error'); return false; }
                if (!descripcion)  { mostrarToast('La descripción es obligatoria.', 'error');    return false; }

                const m5Actual = getM5();
                let evidencias;

                if (esEdicion) {
                    evidencias = m5Actual.documentacion.evidencias.map(e => e.id === evidenciaId
                        ? { ...e, tipo, descripcion, fecha, responsable, vinculo }
                        : e
                    );
                } else {
                    evidencias = [...m5Actual.documentacion.evidencias, {
                        id: generarId('ev'),
                        tipo, descripcion, fecha, responsable, vinculo
                    }];
                }

                guardarM5({ documentacion: { evidencias } });
                mostrarToast(esEdicion ? 'Evidencia actualizada.' : 'Evidencia agregada.', 'exito');
                renderizar();
            }
        });
    }

    /* ========================================================
       CONFIRMAR ELIMINAR EVIDENCIA
       ======================================================== */
    function confirmarEliminarEvidencia(evidenciaId) {
        const m5 = getM5();
        const ev = m5.documentacion.evidencias.find(e => e.id === evidenciaId);
        if (!ev) return;

        abrirModal({
            titulo: 'Eliminar evidencia',
            textoAceptar: 'Sí, eliminar',
            contenidoHTML: `
                <p>¿Eliminar esta evidencia?</p>
                <p class="ayuda" style="font-style: italic;">"${escaparHTML(ev.descripcion)}"</p>
                <p class="ayuda">Esta acción no se puede deshacer.</p>
            `,
            onAceptar: () => {
                const m5Actual = getM5();
                const evidencias = m5Actual.documentacion.evidencias.filter(e => e.id !== evidenciaId);
                guardarM5({ documentacion: { evidencias } });
                mostrarToast('Evidencia eliminada.', 'info');
                renderizar();
            }
        });
    }

    /* ========================================================
       EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Textareas de evaluación
        const bindEval = (id, key) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', e => {
                const m5 = getM5();
                guardarM5({ evaluacion: { ...m5.evaluacion, [key]: e.target.value } });
            });
        };
        bindEval('m5-logros', 'logros');
        bindEval('m5-dificultades', 'dificultades');
        bindEval('m5-aprendizajes', 'aprendizajes');
        bindEval('m5-recomendaciones', 'recomendaciones');

        // Notas
        const notas = document.getElementById('m5-notas');
        if (notas) {
            notas.addEventListener('input', e => {
                const m5 = getM5();
                guardarM5({ documentacion: { ...m5.documentacion, notas: e.target.value } });
            });
        }

        // Metadatos
        const bindMeta = (id, key) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', e => {
                const m5 = getM5();
                guardarM5({ meta: { ...m5.meta, [key]: e.target.value } });
            });
        };
        bindMeta('m5-fecha-cierre', 'fechaCierre');
        bindMeta('m5-elaborado-por', 'elaboradoPor');
        bindMeta('m5-proximo-trimestre', 'proximoTrimestre');

        // Nueva evidencia
        const btnEv = document.getElementById('btn-nueva-evidencia');
        if (btnEv) {
            btnEv.addEventListener('click', () => abrirModalEvidencia(null));
        }

        // Editar / eliminar evidencia
        contenedor.querySelectorAll('.btn-editar-evidencia').forEach(btn => {
            btn.addEventListener('click', e => {
                abrirModalEvidencia(e.currentTarget.dataset.evidencia);
            });
        });
        contenedor.querySelectorAll('.btn-eliminar-evidencia').forEach(btn => {
            btn.addEventListener('click', e => {
                confirmarEliminarEvidencia(e.currentTarget.dataset.evidencia);
            });
        });

        // Generar informe
        const btnInforme = document.getElementById('btn-generar-informe');
        if (btnInforme) {
            btnInforme.addEventListener('click', () => {
                if (typeof PRODUCTOS !== 'undefined' && typeof PRODUCTOS.generarInformeCierre === 'function') {
                    PRODUCTOS.generarInformeCierre();
                } else {
                    mostrarToast('El generador del Informe aún no está disponible.', 'error');
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
    window.MOMENTO5 = MOMENTO5;
    window.Momento5 = MOMENTO5;
    console.log('✅ MOMENTO5 expuesto en window (v1.0)');
}
