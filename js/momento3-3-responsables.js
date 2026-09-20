/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3-3-responsables.js — Sub-sección 3.3: Responsables
   v3.0 — Reescrito para nueva estructura (anclas + banco + cierre)
   ============================================================
   Depende de:
     - ESTADO.obtenerSeccion('momento3')
         · momento3.calendarizacion.actividades  (lo llena 3.2)
         · momento3.responsables.asignaciones    ([{actividadId, rol, nombre, correo}])
     - DATOS.momento3.tiposActividad
     - DATOS.momento3.roles
     - #modal-confirmacion (con #modal-titulo, #modal-mensaje,
                            #modal-aceptar, #modal-cancelar, #modal-cerrar)
   Patrón de la casa: defensivo + window.X = X;
   ============================================================ */

const MOMENTO3_3 = (function() {

    /* ========================================================
       ESTADO LOCAL DE LA UI
       ======================================================== */
    let contenedor = null;
    let filtroTipo = 'todos';        // todos | ancla | banco | cierre | personalizada
    let filtroAsignacion = 'todos';  // todos | sin-asignar | con-asignar

    /* ========================================================
       HELPERS DEFENSIVOS
       ======================================================== */
    function obtenerM3() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try {
                const m3 = ESTADO.obtenerSeccion('momento3') || {};

                if (!m3.responsables || typeof m3.responsables !== 'object') {
                    m3.responsables = { asignaciones: [], notas: '' };
                }
                if (!Array.isArray(m3.responsables.asignaciones)) {
                    m3.responsables.asignaciones = [];
                }
                if (typeof m3.responsables.notas !== 'string') {
                    m3.responsables.notas = '';
                }

                if (!m3.calendarizacion || typeof m3.calendarizacion !== 'object') {
                    m3.calendarizacion = { actividades: [], notas: '' };
                }
                if (!Array.isArray(m3.calendarizacion.actividades)) {
                    m3.calendarizacion.actividades = [];
                }

                if (!m3.seleccionRutas || typeof m3.seleccionRutas !== 'object') {
                    m3.seleccionRutas = {};
                }

                return m3;
            } catch (e) { /* silencio */ }
        }
        return {
            responsables: { asignaciones: [], notas: '' },
            calendarizacion: { actividades: [], notas: '' },
            seleccionRutas: {}
        };
    }

    function guardarResponsables(asignaciones, notas) {
        if (typeof ESTADO === 'undefined') return;
        const m3 = obtenerM3();
        const notasFinales = (notas !== undefined) ? notas : (m3.responsables.notas || '');
        try {
            if (typeof ESTADO.actualizarCampo === 'function') {
                ESTADO.actualizarCampo('momento3', 'responsables', {
                    asignaciones,
                    notas: notasFinales
                });
            }
        } catch (e) {
            console.warn('⚠️ MOMENTO3_3: no se pudo guardar responsables:', e);
        }
    }

    function guardarNotas(notas) {
        const m3 = obtenerM3();
        guardarResponsables(m3.responsables.asignaciones || [], notas);
    }

    function mostrarToast(mensaje, tipo) {
        if (typeof APP !== 'undefined' && typeof APP.mostrarToast === 'function') {
            try { APP.mostrarToast(mensaje, tipo); return; } catch (e) { /* silencio */ }
        }
        console.log(`[Toast ${tipo}] ${mensaje}`);
    }

    function escaparHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getRoles() {
        if (typeof DATOS !== 'undefined'
            && DATOS.momento3
            && Array.isArray(DATOS.momento3.roles)) {
            return DATOS.momento3.roles.slice();
        }
        return [
            'Director(a)',
            'ATP / Supervisor',
            'Docente de grupo',
            'Docente de Lengua y Literatura',
            'Bibliotecario(a)',
            'Docente de otra asignatura',
            'Estudiante',
            'Familia / Tutor',
            'Comunidad'
        ];
    }

    function getTiposActividad() {
        if (typeof DATOS !== 'undefined'
            && DATOS.momento3
            && Array.isArray(DATOS.momento3.tiposActividad)) {
            return DATOS.momento3.tiposActividad;
        }
        return [
            { id: 'ancla',         nombre: 'Ancla',         color: 'carmesi' },
            { id: 'banco',         nombre: 'Banco',         color: 'naranja' },
            { id: 'cierre',        nombre: 'Cierre',        color: 'verde'   },
            { id: 'personalizada', nombre: 'Personalizada', color: 'gris'    }
        ];
    }

    function tipoDef(tipoId) {
        const tipos = getTiposActividad();
        return tipos.find(t => t.id === tipoId)
            || { id: tipoId, nombre: tipoId || '—', color: 'gris' };
    }

    function mesLabel(mes) {
        if (!mes) return '—';
        if (mes === 'todo') return 'Todo el trimestre';
        return mes.charAt(0).toUpperCase() + mes.slice(1);
    }

    /* ========================================================
       CONSULTAS
       ======================================================== */
    function responsablesDeActividad(asignaciones, actividadId) {
        if (!Array.isArray(asignaciones)) return [];
        return asignaciones.filter(a => a && a.actividadId === actividadId);
    }

    function actividadTieneResponsable(asignaciones, actividadId) {
        return responsablesDeActividad(asignaciones, actividadId).length > 0;
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar(cont) {
        contenedor = cont || document.getElementById('contenido-sub-seccion');
        if (!contenedor) return;

        const m3 = obtenerM3();
        const actividades   = m3.calendarizacion.actividades || [];
        const asignaciones  = m3.responsables.asignaciones || [];
        const notas         = m3.responsables.notas || '';
        const sel           = m3.seleccionRutas || {};
        const ruta          = (sel.rutaId && typeof DATOS !== 'undefined')
                                ? DATOS.rutasLEO[sel.rutaId]
                                : null;

        /* ---- Sin ruta ---- */
        if (!ruta) {
            contenedor.innerHTML = `
                <div class="sub-seccion">
                    <div class="seccion-header">
                        <h3><i class="fas fa-users"></i> 3.3 Responsables</h3>
                    </div>
                    <div class="caja-alerta">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Aún no has seleccionado una ruta.</strong>
                        Regresa al sub-paso <strong>3.1</strong> para elegirla antes de asignar responsables.
                    </div>
                </div>
            `;
            return;
        }

        /* ---- Sin actividades calendarizadas ---- */
        if (actividades.length === 0) {
            contenedor.innerHTML = `
                <div class="sub-seccion">
                    <div class="seccion-header">
                        <h3><i class="fas fa-users"></i> 3.3 Responsables</h3>
                    </div>
                    <div class="caja-alerta">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>No hay actividades calendarizadas todavía.</strong>
                        Regresa al sub-paso <strong>3.2</strong> para calendarizarlas primero.
                        Las actividades se sincronizan automáticamente desde 3.1.
                    </div>
                </div>
            `;
            return;
        }

        /* ---- Cálculos ---- */
        const totalActividades  = actividades.length;
        const conResponsable    = actividades.filter(a =>
                                    actividadTieneResponsable(asignaciones, a.id)
                                  ).length;
        const sinResponsable    = totalActividades - conResponsable;
        const totalAsignaciones = asignaciones.length;
        const pct               = totalActividades > 0
                                    ? Math.round((conResponsable / totalActividades) * 100)
                                    : 0;

        /* ---- Filtros + agrupación ---- */
        const filtradas = aplicarFiltros(actividades, asignaciones);
        const grupos    = agruparPorTipo(filtradas);

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <div class="seccion-header">
                    <h3><i class="fas fa-users"></i> 3.3 Responsables</h3>
                    <p class="seccion-descripcion">
                        Asigna a las personas responsables de cada actividad del trimestre.
                        Cada actividad debe tener <strong>al menos un responsable</strong>.
                    </p>
                </div>

                <!-- ===== CAJA INFO ===== -->
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Ruta:</strong> ${escaparHTML(ruta.nombre)} ·
                    <strong>Actividades:</strong> ${totalActividades} ·
                    <strong>Con responsable:</strong> ${conResponsable} ·
                    <strong>Sin responsable:</strong> ${sinResponsable} ·
                    <strong>Asignaciones:</strong> ${totalAsignaciones}
                </div>

                <!-- ===== PROGRESO ===== -->
                <div class="form-bloque">
                    <div class="flex-between mb-2">
                        <strong>Progreso de asignación</strong>
                        <span class="chip ${sinResponsable === 0 ? 'verde' : 'naranja'}">
                            ${conResponsable} / ${totalActividades}
                        </span>
                    </div>
                    <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.08); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${pct}%; height: 100%; background: ${sinResponsable === 0 ? '#2e7d32' : '#f59e0b'}; transition: width 0.3s ease;"></div>
                    </div>
                    <p class="ayuda" style="margin-top: 0.4rem;">
                        ${pct}% de las actividades ya tienen al menos un responsable asignado.
                    </p>
                </div>

                <!-- ===== FILTROS ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-filter"></i> Filtros</h3>
                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="filtro-tipo">Tipo de actividad</label>
                            <select id="filtro-tipo">
                                <option value="todos"          ${filtroTipo === 'todos'          ? 'selected' : ''}>Todas</option>
                                <option value="ancla"          ${filtroTipo === 'ancla'          ? 'selected' : ''}>Anclas</option>
                                <option value="banco"          ${filtroTipo === 'banco'          ? 'selected' : ''}>Banco</option>
                                <option value="cierre"         ${filtroTipo === 'cierre'         ? 'selected' : ''}>Cierre</option>
                                <option value="personalizada"  ${filtroTipo === 'personalizada'  ? 'selected' : ''}>Personalizadas</option>
                            </select>
                        </div>
                        <div class="form-grupo">
                            <label for="filtro-asignacion">Asignación</label>
                            <select id="filtro-asignacion">
                                <option value="todos"        ${filtroAsignacion === 'todos'        ? 'selected' : ''}>Todas</option>
                                <option value="sin-asignar"  ${filtroAsignacion === 'sin-asignar'  ? 'selected' : ''}>Sin responsable</option>
                                <option value="con-asignar"  ${filtroAsignacion === 'con-asignar'  ? 'selected' : ''}>Con responsable</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- ===== LISTA AGRUPADA ===== -->
                ${filtradas.length === 0
                    ? `<div class="caja-info">
                           <i class="fas fa-info-circle"></i>
                           No hay actividades que coincidan con los filtros seleccionados.
                       </div>`
                    : Object.keys(grupos)
                        .map(tipoId => renderizarGrupo(tipoId, grupos[tipoId], asignaciones))
                        .join('')
                }

                <!-- ===== NOTAS ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Notas del colectivo</h3>
                    <p class="ayuda">Opcional. Acuerdos sobre la asignación de responsables.</p>
                    <div class="form-grupo">
                        <textarea id="notas-responsables" maxlength="600" rows="3"
                                  placeholder="Ej. Se acordó que la comisión de biblioteca apoye la actividad…">${escaparHTML(notas)}</textarea>
                        <span class="ayuda">Máximo 600 caracteres.</span>
                    </div>
                </div>

                <!-- ===== RESUMEN FINAL ===== -->
                <div class="caja-${sinResponsable === 0 ? 'exito' : 'info'}">
                    <i class="fas fa-${sinResponsable === 0 ? 'check-circle' : 'info-circle'}"></i>
                    ${sinResponsable === 0
                        ? `¡Todas las actividades tienen responsable! ${totalAsignaciones} asignación(es) en total.`
                        : `Aún faltan <strong>${sinResponsable}</strong> actividad(es) por asignar responsable.`
                    }
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       FILTROS Y AGRUPACIÓN
       ======================================================== */
    function aplicarFiltros(actividades, asignaciones) {
        return actividades.filter(a => {
            if (filtroTipo !== 'todos' && a.tipo !== filtroTipo) return false;

            const tiene = actividadTieneResponsable(asignaciones, a.id);
            if (filtroAsignacion === 'sin-asignar' && tiene) return false;
            if (filtroAsignacion === 'con-asignar' && !tiene) return false;

            return true;
        });
    }

    function agruparPorTipo(actividades) {
        const orden = ['ancla', 'banco', 'cierre', 'personalizada'];
        const grupos = {};
        orden.forEach(t => { grupos[t] = []; });

        actividades.forEach(a => {
            const t = a.tipo || 'personalizada';
            if (!grupos[t]) grupos[t] = [];
            grupos[t].push(a);
        });

        // Quitar grupos vacíos
        Object.keys(grupos).forEach(t => {
            if (grupos[t].length === 0) delete grupos[t];
        });

        return grupos;
    }

    function renderizarGrupo(tipoId, actividades, asignaciones) {
        const tipo = tipoDef(tipoId);
        return `
            <div class="form-bloque">
                <div class="flex-between mb-2" style="flex-wrap: wrap; gap: 0.5rem;">
                    <h3 style="margin: 0;">
                        <span class="chip ${tipo.color}">${escaparHTML(tipo.nombre)}</span>
                        <span class="ayuda">${actividades.length} actividad(es)</span>
                    </h3>
                </div>
                <div class="lista-actividades">
                    ${actividades.map(a => renderizarTarjetaActividad(a, asignaciones)).join('')}
                </div>
            </div>
        `;
    }

    function renderizarTarjetaActividad(actividad, asignaciones) {
        const responsables = responsablesDeActividad(asignaciones, actividad.id);
        const tipo         = tipoDef(actividad.tipo);
        const tiene        = responsables.length > 0;

        const chipsResponsables = responsables.map(r => `
            <span class="chip" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.6rem; margin: 0.15rem;">
                <span>
                    <strong>${escaparHTML(r.nombre)}</strong>
                    <span class="ayuda"> · ${escaparHTML(r.rol)}</span>
                    ${r.correo
                        ? `<span class="ayuda"> · ${escaparHTML(r.correo)}</span>`
                        : ''}
                </span>
                <button type="button"
                        class="btn btn-icono btn-peligro btn-quitar-responsable"
                        data-actividad="${escaparHTML(actividad.id)}"
                        data-rol="${escaparHTML(r.rol)}"
                        title="Quitar responsable"
                        style="padding: 0.1rem 0.35rem; line-height: 1;">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `).join('');

        return `
            <div class="tarjeta tarjeta-actividad" data-actividad="${escaparHTML(actividad.id)}">
                <div class="flex-between"
                     style="align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 220px;">
                        <strong style="display: block;">${escaparHTML(actividad.nombre)}</strong>
                        ${actividad.descripcion
                            ? `<p class="ayuda" style="margin: 0.25rem 0 0;">${escaparHTML(actividad.descripcion)}</p>`
                            : ''
                        }
                        <div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.5rem;">
                            <span class="chip ${tipo.color}">${escaparHTML(tipo.nombre)}</span>
                            <span class="chip"><i class="fas fa-calendar"></i> ${mesLabel(actividad.mes)}</span>
                            ${actividad.semana
                                ? `<span class="chip">${escaparHTML(actividad.semana)}</span>`
                                : ''
                            }
                            ${actividad.frecuencia
                                ? `<span class="chip naranja">${escaparHTML(actividad.frecuencia)}</span>`
                                : ''
                            }
                            ${tiene
                                ? `<span class="chip verde"><i class="fas fa-check"></i> ${responsables.length} responsable(s)</span>`
                                : `<span class="chip carmesi"><i class="fas fa-exclamation"></i> Sin responsable</span>`
                            }
                        </div>
                    </div>

                    <button type="button"
                            class="btn btn-sm btn-primario btn-asignar-responsable"
                            data-actividad="${escaparHTML(actividad.id)}">
                        <i class="fas fa-user-plus"></i> Asignar
                    </button>
                </div>

                ${tiene ? `
                    <div style="margin-top: 0.75rem; display: flex; flex-wrap: wrap;">
                        ${chipsResponsables}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /* ========================================================
       MODAL GENÉRICO (mismo patrón que 3.2)
       ======================================================== */
    function abrirModal({ titulo, contenidoHTML, textoAceptar, onAceptar }) {
        const modal = document.getElementById('modal-confirmacion');
        if (!modal) {
            console.error('❌ MOMENTO3_3: no existe #modal-confirmacion en el HTML');
            mostrarToast('Error: modal no disponible.', 'error');
            return;
        }

        const elTitulo   = document.getElementById('modal-titulo');
        const elMensaje  = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar= document.getElementById('modal-cancelar');
        const btnCerrar  = document.getElementById('modal-cerrar');

        if (!elTitulo || !elMensaje || !btnAceptar || !btnCancelar || !btnCerrar) {
            console.error('❌ MOMENTO3_3: faltan elementos internos del modal');
            mostrarToast('Error: modal incompleto.', 'error');
            return;
        }

        elTitulo.textContent  = titulo;
        elMensaje.innerHTML   = contenidoHTML;
        btnAceptar.textContent = textoAceptar || 'Aceptar';

        const cerrar = () => { modal.style.display = 'none'; };

        // Clonar para limpiar listeners previos
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
       MODAL: ASIGNAR RESPONSABLE
       ======================================================== */
    function abrirModalAsignar(actividadId) {
        const m3  = obtenerM3();
        const act = (m3.calendarizacion.actividades || [])
                        .find(a => a.id === actividadId);
        if (!act) {
            mostrarToast('Actividad no encontrada.', 'error');
            return;
        }

        const roles          = getRoles();
        const yaAsignados    = responsablesDeActividad(m3.responsables.asignaciones, actividadId);
        const rolesUsados    = yaAsignados.map(a => a.rol);
        const rolesDisponibles = roles.filter(r => !rolesUsados.includes(r));

        if (rolesDisponibles.length === 0) {
            mostrarToast('Ya asignaste todos los roles disponibles a esta actividad.', 'info');
            return;
        }

        abrirModal({
            titulo: 'Asignar responsable',
            textoAceptar: 'Asignar',
            contenidoHTML: `
                <p class="ayuda" style="margin-bottom: 0.75rem;">
                    Actividad: <strong>${escaparHTML(act.nombre)}</strong>
                </p>
                <div class="form-grupo">
                    <label for="new-rol">Rol <span class="obligatorio">*</span></label>
                    <select id="new-rol">
                        <option value="">— Selecciona un rol —</option>
                        ${rolesDisponibles.map(r =>
                            `<option value="${escaparHTML(r)}">${escaparHTML(r)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-grupo">
                    <label for="new-nombre">Nombre <span class="obligatorio">*</span></label>
                    <input type="text" id="new-nombre"
                           placeholder="Nombre completo"
                           maxlength="120">
                </div>
                <div class="form-grupo">
                    <label for="new-correo">Correo (opcional)</label>
                    <input type="email" id="new-correo"
                           placeholder="correo@ejemplo.com"
                           maxlength="120">
                </div>
            `,
            onAceptar: () => {
                const rol    = (document.getElementById('new-rol')?.value    || '').trim();
                const nombre = (document.getElementById('new-nombre')?.value || '').trim();
                const correo = (document.getElementById('new-correo')?.value || '').trim();

                if (!rol)    { mostrarToast('Selecciona un rol.', 'error');           return false; }
                if (!nombre) { mostrarToast('El nombre es obligatorio.', 'error');    return false; }

                const m3Actual     = obtenerM3();
                const asignaciones = [...(m3Actual.responsables.asignaciones || [])];

                const idx = asignaciones.findIndex(a =>
                    a.actividadId === actividadId && a.rol === rol
                );

                const nueva = {
                    actividadId,
                    rol,
                    nombre,
                    correo,
                    fechaAsignacion: new Date().toISOString()
                };

                if (idx !== -1) {
                    asignaciones[idx] = nueva;
                } else {
                    asignaciones.push(nueva);
                }

                guardarResponsables(asignaciones);
                mostrarToast('Responsable asignado.', 'exito');
                renderizar();
            }
        });
    }

    /* ========================================================
       CONFIRMAR QUITAR RESPONSABLE
       ======================================================== */
    function confirmarEliminarResponsable(actividadId, rol) {
        const m3   = obtenerM3();
        const act  = (m3.calendarizacion.actividades || [])
                        .find(a => a.id === actividadId);
        const asig = (m3.responsables.asignaciones || [])
                        .find(a => a.actividadId === actividadId && a.rol === rol);

        if (!act || !asig) {
            mostrarToast('No se encontró la asignación.', 'error');
            return;
        }

        abrirModal({
            titulo: 'Quitar responsable',
            textoAceptar: 'Sí, quitar',
            contenidoHTML: `
                <p>¿Quitar a <strong>${escaparHTML(asig.nombre)}</strong>
                (<em>${escaparHTML(asig.rol)}</em>) de la actividad
                <strong>"${escaparHTML(act.nombre)}"</strong>?</p>
                <p class="ayuda">Esta acción se puede deshacer volviendo a asignar el rol.</p>
            `,
            onAceptar: () => {
                const m3Actual     = obtenerM3();
                const asignaciones = (m3Actual.responsables.asignaciones || [])
                    .filter(a => !(a.actividadId === actividadId && a.rol === rol));

                guardarResponsables(asignaciones);
                mostrarToast('Responsable quitado.', 'info');
                renderizar();
            }
        });
    }

    /* ========================================================
       EVENTOS
       ======================================================== */
    function suscribirEventos() {
        const fTipo = document.getElementById('filtro-tipo');
        if (fTipo) {
            fTipo.addEventListener('change', e => {
                filtroTipo = e.target.value;
                renderizar();
            });
        }

        const fAsig = document.getElementById('filtro-asignacion');
        if (fAsig) {
            fAsig.addEventListener('change', e => {
                filtroAsignacion = e.target.value;
                renderizar();
            });
        }

        contenedor.querySelectorAll('.btn-asignar-responsable').forEach(btn => {
            btn.addEventListener('click', e => {
                abrirModalAsignar(e.currentTarget.dataset.actividad);
            });
        });

        contenedor.querySelectorAll('.btn-quitar-responsable').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                const actividadId = e.currentTarget.dataset.actividad;
                const rol         = e.currentTarget.dataset.rol;
                confirmarEliminarResponsable(actividadId, rol);
            });
        });

        const notas = document.getElementById('notas-responsables');
        if (notas) {
            notas.addEventListener('input', e => guardarNotas(e.target.value));
        }
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        renderizar,
        // Para debug rápido en consola:
        _filtros: () => ({ filtroTipo, filtroAsignacion })
    };

})();

/* ============================================================
   EXPOSICIÓN A WINDOW — FIX CRÍTICO (bug recurrente del proyecto)
   ============================================================ */
if (typeof window !== 'undefined') {
    window.MOMENTO3_3 = MOMENTO3_3;
    console.log('✅ MOMENTO3_3 expuesto en window (v3.0)');
}
