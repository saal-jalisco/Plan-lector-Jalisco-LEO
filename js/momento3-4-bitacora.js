/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3-4-bitacora.js — Sub-sección 3.4: Bitácora de Actividades
   v3.0 — Reescrito para nueva estructura (anclas + banco + cierre)
   ============================================================
   Depende de:
     - ESTADO.obtenerSeccion('momento3')
         · momento3.calendarizacion.actividades   (lo llena 3.2)
         · momento3.bitacora.registros            ([{actividadId, fecha, estado, observaciones, participantes, evidencias[]}])
         · momento3.bitacora.notas
         · momento3.seleccionRutas                (para saber la ruta activa)
     - DATOS.momento3.tiposActividad
     - DATOS.momento3.estadosImplementacion
     - DATOS.momento3.tiposEvidencia
     - DATOS.momento3.preguntasBitacora
     - #modal-confirmacion (con #modal-titulo, #modal-mensaje,
                            #modal-aceptar, #modal-cancelar, #modal-cerrar)
   Patrón de la casa: defensivo + window.X = X;
   ============================================================ */

const MOMENTO3_4 = (function() {

    /* ========================================================
       ESTADO LOCAL DE LA UI
       ======================================================== */
    let contenedor = null;
    let filtroMes = 'todos';       // todos | septiembre | octubre | noviembre | todo
    let filtroTipo = 'todos';      // todos | ancla | banco | cierre | personalizada
    let filtroRegistro = 'todos';  // todos | con-registro | sin-registro

    /* ========================================================
       HELPERS DEFENSIVOS
       ======================================================== */
    function obtenerM3() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try {
                const m3 = ESTADO.obtenerSeccion('momento3') || {};

                if (!m3.bitacora || typeof m3.bitacora !== 'object') {
                    m3.bitacora = { registros: [], notas: '' };
                }
                if (!Array.isArray(m3.bitacora.registros)) {
                    m3.bitacora.registros = [];
                }
                if (typeof m3.bitacora.notas !== 'string') {
                    m3.bitacora.notas = '';
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
            bitacora: { registros: [], notas: '' },
            calendarizacion: { actividades: [], notas: '' },
            seleccionRutas: {}
        };
    }

    function guardarBitacora(registros, notas) {
        if (typeof ESTADO === 'undefined') return;
        const m3 = obtenerM3();
        const notasFinales = (notas !== undefined) ? notas : (m3.bitacora.notas || '');
        try {
            if (typeof ESTADO.actualizarCampo === 'function') {
                ESTADO.actualizarCampo('momento3', 'bitacora', {
                    registros,
                    notas: notasFinales
                });
            }
        } catch (e) {
            console.warn('⚠️ MOMENTO3_4: no se pudo guardar bitácora:', e);
        }
    }

    function guardarNotas(notas) {
        const m3 = obtenerM3();
        guardarBitacora(m3.bitacora.registros || [], notas);
    }

    function guardarActividades(actividades) {
        if (typeof ESTADO === 'undefined') return;
        const m3 = obtenerM3();
        try {
            if (typeof ESTADO.actualizarCampo === 'function') {
                ESTADO.actualizarCampo('momento3', 'calendarizacion', {
                    ...m3.calendarizacion,
                    actividades
                });
            }
        } catch (e) { /* silencio */ }
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

    function generarId() {
        return 'bit_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
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
            const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
            return d.toLocaleDateString('es-MX', opciones);
        } catch (e) {
            return iso;
        }
    }

    /* ========================================================
       CATÁLOGOS
       ======================================================== */
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

    function getEstados() {
        if (typeof DATOS !== 'undefined'
            && DATOS.momento3
            && Array.isArray(DATOS.momento3.estadosImplementacion)) {
            return DATOS.momento3.estadosImplementacion;
        }
        return [
            { id: 'no-iniciada',  nombre: 'No iniciada',  color: 'gris'    },
            { id: 'en-proceso',   nombre: 'En proceso',   color: 'amarillo'},
            { id: 'completada',   nombre: 'Completada',   color: 'verde'   },
            { id: 'reprogramada', nombre: 'Reprogramada', color: 'rojo'    }
        ];
    }

    function getTiposEvidencia() {
        if (typeof DATOS !== 'undefined'
            && DATOS.momento3
            && Array.isArray(DATOS.momento3.tiposEvidencia)) {
            return DATOS.momento3.tiposEvidencia.slice();
        }
        return ['Fotografía', 'Video', 'Audio', 'Texto escrito', 'Dibujo', 'Producto final', 'Lista de asistencia', 'Otro'];
    }

    function getPreguntasBitacora() {
        if (typeof DATOS !== 'undefined'
            && DATOS.momento3
            && Array.isArray(DATOS.momento3.preguntasBitacora)) {
            return DATOS.momento3.preguntasBitacora.slice();
        }
        return [];
    }

    function tipoDef(tipoId) {
        const tipos = getTiposActividad();
        return tipos.find(t => t.id === tipoId)
            || { id: tipoId, nombre: tipoId || '—', color: 'gris' };
    }

    function estadoDef(estadoId) {
        const estados = getEstados();
        return estados.find(e => e.id === estadoId)
            || { id: estadoId, nombre: estadoId || '—', color: 'gris' };
    }

    function mesLabel(mes) {
        if (!mes) return '—';
        if (mes === 'todo') return 'Todo el trimestre';
        return mes.charAt(0).toUpperCase() + mes.slice(1);
    }

    /* ========================================================
       CONSULTAS
       ======================================================== */
    function registrosDeActividad(registros, actividadId) {
        if (!Array.isArray(registros)) return [];
        return registros
            .filter(r => r && r.actividadId === actividadId)
            .sort((a, b) => {
                // Más recientes primero
                const fa = a.fecha || '';
                const fb = b.fecha || '';
                return fb.localeCompare(fa);
            });
    }

    function actividadTieneRegistro(registros, actividadId) {
        return registrosDeActividad(registros, actividadId).length > 0;
    }

    /* ========================================================
       SINCRONIZAR ESTADO DE ACTIVIDAD CON SU REGISTRO MÁS RECIENTE
       ======================================================== */
    function sincronizarEstadoActividad(actividadId) {
        const m3 = obtenerM3();
        const regs = registrosDeActividad(m3.bitacora.registros, actividadId);
        if (regs.length === 0) return;

        const ultimo = regs[0]; // ya viene ordenado desc
        const nuevoEstado = ultimo.estado || 'completada';

        const actividades = (m3.calendarizacion.actividades || []).map(a => {
            if (a.id !== actividadId) return a;
            return { ...a, estado: nuevoEstado };
        });

        guardarActividades(actividades);
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar(cont) {
        contenedor = cont || document.getElementById('contenido-sub-seccion');
        if (!contenedor) return;

        const m3 = obtenerM3();
        const actividades  = m3.calendarizacion.actividades || [];
        const registros    = m3.bitacora.registros || [];
        const notas        = m3.bitacora.notas || '';
        const sel          = m3.seleccionRutas || {};
        const ruta         = (sel.rutaId && typeof DATOS !== 'undefined')
                                ? DATOS.rutasLEO[sel.rutaId]
                                : null;

        /* ---- Sin ruta ---- */
        if (!ruta) {
            contenedor.innerHTML = `
                <div class="sub-seccion">
                    <div class="seccion-header">
                        <h3><i class="fas fa-book-open"></i> 3.4 Bitácora</h3>
                    </div>
                    <div class="caja-alerta">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Aún no has seleccionado una ruta.</strong>
                        Regresa al sub-paso <strong>3.1</strong> para elegirla antes de registrar la bitácora.
                    </div>
                </div>
            `;
            return;
        }

        /* ---- Sin actividades ---- */
        if (actividades.length === 0) {
            contenedor.innerHTML = `
                <div class="sub-seccion">
                    <div class="seccion-header">
                        <h3><i class="fas fa-book-open"></i> 3.4 Bitácora</h3>
                    </div>
                    <div class="caja-alerta">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>No hay actividades calendarizadas todavía.</strong>
                        Regresa al sub-paso <strong>3.2</strong> para calendarizarlas primero.
                    </div>
                </div>
            `;
            return;
        }

        /* ---- Cálculos ---- */
        const totalActividades = actividades.length;
        const conRegistro = actividades.filter(a =>
            actividadTieneRegistro(registros, a.id)
        ).length;
        const sinRegistro = totalActividades - conRegistro;
        const totalRegistros = registros.length;
        const pct = totalActividades > 0
            ? Math.round((conRegistro / totalActividades) * 100)
            : 0;

        // Conteo por estado (de las actividades del calendario)
        const porEstado = {
            'no-iniciada':  0,
            'en-proceso':   0,
            'completada':   0,
            'reprogramada': 0
        };
        actividades.forEach(a => {
            const e = a.estado || 'no-iniciada';
            if (porEstado[e] !== undefined) porEstado[e]++;
        });

        /* ---- Filtros + agrupación ---- */
        const filtradas = aplicarFiltros(actividades, registros);
        const grupos = agruparPorTipo(filtradas);

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <div class="seccion-header">
                    <h3><i class="fas fa-book-open"></i> 3.4 Bitácora de Actividades</h3>
                    <p class="seccion-descripcion">
                        Registra lo que va ocurriendo con cada actividad del trimestre:
                        <strong>fecha</strong>, <strong>estado</strong>, <strong>participantes</strong>,
                        <strong>observaciones</strong> y <strong>evidencias</strong>.
                    </p>
                </div>

                <!-- ===== CAJA INFO ===== -->
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Ruta:</strong> ${escaparHTML(ruta.nombre)} ·
                    <strong>Actividades:</strong> ${totalActividades} ·
                    <strong>Con registro:</strong> ${conRegistro} ·
                    <strong>Sin registro:</strong> ${sinRegistro} ·
                    <strong>Registros totales:</strong> ${totalRegistros}
                </div>

                <!-- ===== PROGRESO ===== -->
                <div class="form-bloque">
                    <div class="flex-between mb-2">
                        <strong>Progreso de la bitácora</strong>
                        <span class="chip ${sinRegistro === 0 ? 'verde' : 'naranja'}">
                            ${conRegistro} / ${totalActividades}
                        </span>
                    </div>
                    <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.08); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${pct}%; height: 100%; background: ${sinRegistro === 0 ? '#2e7d32' : '#f59e0b'}; transition: width 0.3s ease;"></div>
                    </div>
                    <p class="ayuda" style="margin-top: 0.4rem;">
                        ${pct}% de las actividades ya tienen al menos un registro de bitácora.
                    </p>
                </div>

                <!-- ===== ESTADÍSTICAS POR ESTADO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-chart-pie"></i> Estado de implementación</h3>
                    <div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.5rem;">
                        <span class="chip verde"><i class="fas fa-check-circle"></i> Completadas: ${porEstado['completada']}</span>
                        <span class="chip amarillo"><i class="fas fa-clock"></i> En proceso: ${porEstado['en-proceso']}</span>
                        <span class="chip gris"><i class="fas fa-circle"></i> No iniciadas: ${porEstado['no-iniciada']}</span>
                        <span class="chip rojo"><i class="fas fa-rotate-left"></i> Reprogramadas: ${porEstado['reprogramada']}</span>
                    </div>
                </div>

                <!-- ===== FILTROS ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-filter"></i> Filtros</h3>
                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="filtro-mes">Mes</label>
                            <select id="filtro-mes">
                                <option value="todos"      ${filtroMes === 'todos'      ? 'selected' : ''}>Todos</option>
                                <option value="todo"       ${filtroMes === 'todo'       ? 'selected' : ''}>Todo el trimestre</option>
                                <option value="septiembre" ${filtroMes === 'septiembre' ? 'selected' : ''}>Septiembre</option>
                                <option value="octubre"    ${filtroMes === 'octubre'    ? 'selected' : ''}>Octubre</option>
                                <option value="noviembre"  ${filtroMes === 'noviembre'  ? 'selected' : ''}>Noviembre</option>
                            </select>
                        </div>
                        <div class="form-grupo">
                            <label for="filtro-tipo">Tipo</label>
                            <select id="filtro-tipo">
                                <option value="todos"          ${filtroTipo === 'todos'          ? 'selected' : ''}>Todas</option>
                                <option value="ancla"          ${filtroTipo === 'ancla'          ? 'selected' : ''}>Anclas</option>
                                <option value="banco"          ${filtroTipo === 'banco'          ? 'selected' : ''}>Banco</option>
                                <option value="cierre"         ${filtroTipo === 'cierre'         ? 'selected' : ''}>Cierre</option>
                                <option value="personalizada"  ${filtroTipo === 'personalizada'  ? 'selected' : ''}>Personalizadas</option>
                            </select>
                        </div>
                        <div class="form-grupo">
                            <label for="filtro-registro">Registro</label>
                            <select id="filtro-registro">
                                <option value="todos"        ${filtroRegistro === 'todos'        ? 'selected' : ''}>Todas</option>
                                <option value="sin-registro" ${filtroRegistro === 'sin-registro' ? 'selected' : ''}>Sin registro</option>
                                <option value="con-registro" ${filtroRegistro === 'con-registro' ? 'selected' : ''}>Con registro</option>
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
                        .map(tipoId => renderizarGrupo(tipoId, grupos[tipoId], registros))
                        .join('')
                }

                <!-- ===== NOTAS ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Notas generales de la bitácora</h3>
                    <p class="ayuda">Opcional. Observaciones del colectivo sobre el proceso.</p>
                    <div class="form-grupo">
                        <textarea id="notas-bitacora" maxlength="600" rows="3"
                                  placeholder="Ej. Las anclas se están trabajando con buena participación…">${escaparHTML(notas)}</textarea>
                        <span class="ayuda">Máximo 600 caracteres.</span>
                    </div>
                </div>

                <!-- ===== RESUMEN FINAL ===== -->
                <div class="caja-${sinRegistro === 0 ? 'exito' : 'info'}">
                    <i class="fas fa-${sinRegistro === 0 ? 'check-circle' : 'info-circle'}"></i>
                    ${sinRegistro === 0
                        ? `¡Todas las actividades tienen al menos un registro! ${totalRegistros} registro(s) en total.`
                        : `Aún faltan <strong>${sinRegistro}</strong> actividad(es) por registrar.`
                    }
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       FILTROS Y AGRUPACIÓN
       ======================================================== */
    function aplicarFiltros(actividades, registros) {
        return actividades.filter(a => {
            if (filtroMes !== 'todos' && a.mes !== filtroMes) return false;
            if (filtroTipo !== 'todos' && a.tipo !== filtroTipo) return false;

            const tiene = actividadTieneRegistro(registros, a.id);
            if (filtroRegistro === 'sin-registro' && tiene) return false;
            if (filtroRegistro === 'con-registro' && !tiene) return false;

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

        Object.keys(grupos).forEach(t => {
            if (grupos[t].length === 0) delete grupos[t];
        });

        return grupos;
    }

    function renderizarGrupo(tipoId, actividades, registros) {
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
                    ${actividades.map(a => renderizarTarjetaActividad(a, registros)).join('')}
                </div>
            </div>
        `;
    }

    function renderizarTarjetaActividad(actividad, registros) {
        const regs = registrosDeActividad(registros, actividad.id);
        const tipo = tipoDef(actividad.tipo);
        const estado = estadoDef(actividad.estado || 'no-iniciada');
        const tiene = regs.length > 0;

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
                            <span class="chip ${estado.color}">${escaparHTML(estado.nombre)}</span>
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
                                ? `<span class="chip verde"><i class="fas fa-book"></i> ${regs.length} registro(s)</span>`
                                : `<span class="chip gris"><i class="fas fa-circle"></i> Sin registro</span>`
                            }
                        </div>
                    </div>

                    <button type="button"
                            class="btn btn-sm btn-primario btn-nuevo-registro"
                            data-actividad="${escaparHTML(actividad.id)}">
                        <i class="fas fa-plus"></i> Registrar
                    </button>
                </div>

                ${tiene ? `
                    <div style="margin-top: 0.75rem; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 0.75rem;">
                        ${regs.map(r => renderizarRegistro(r, actividad)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    function renderizarRegistro(registro, actividad) {
        const estado = estadoDef(registro.estado || 'completada');
        const evidencias = Array.isArray(registro.evidencias) ? registro.evidencias : [];

        return `
            <div class="tarjeta tarjeta-registro"
                 style="margin-bottom: 0.5rem; padding: 0.75rem; background: rgba(0,0,0,0.02);"
                 data-registro="${escaparHTML(registro.id)}">
                <div class="flex-between"
                     style="align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px;">
                        <div class="flex gap-1" style="flex-wrap: wrap; align-items: center;">
                            <span class="chip ${estado.color}">${escaparHTML(estado.nombre)}</span>
                            <span class="chip"><i class="fas fa-calendar-day"></i> ${formatearFecha(registro.fecha)}</span>
                        </div>
                        ${registro.participantes
                            ? `<p class="ayuda" style="margin: 0.5rem 0 0;">
                                   <strong>Participantes:</strong> ${escaparHTML(registro.participantes)}
                               </p>`
                            : ''
                        }
                        ${registro.observaciones
                            ? `<p class="ayuda" style="margin: 0.4rem 0 0;">${escaparHTML(registro.observaciones)}</p>`
                            : ''
                        }
                        ${evidencias.length > 0
                            ? `<div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.5rem;">
                                   ${evidencias.map(ev => `
                                       <span class="chip"><i class="fas fa-paperclip"></i> ${escaparHTML(ev)}</span>
                                   `).join('')}
                               </div>`
                            : ''
                        }
                    </div>

                    <div class="flex gap-1">
                        <button type="button"
                                class="btn btn-icono btn-secundario btn-editar-registro"
                                data-registro="${escaparHTML(registro.id)}"
                                title="Editar registro">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button type="button"
                                class="btn btn-icono btn-peligro btn-eliminar-registro"
                                data-registro="${escaparHTML(registro.id)}"
                                title="Eliminar registro">
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
            console.error('❌ MOMENTO3_4: no existe #modal-confirmacion en el HTML');
            mostrarToast('Error: modal no disponible.', 'error');
            return;
        }

        const elTitulo    = document.getElementById('modal-titulo');
        const elMensaje   = document.getElementById('modal-mensaje');
        const btnAceptar  = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');
        const btnCerrar   = document.getElementById('modal-cerrar');

        if (!elTitulo || !elMensaje || !btnAceptar || !btnCancelar || !btnCerrar) {
            console.error('❌ MOMENTO3_4: faltan elementos internos del modal');
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

        // Post-render: enganchar los chips de evidencia
        setTimeout(() => engancharChipsEvidencia(), 0);
    }

    /* ========================================================
       CHIPS DE EVIDENCIA (toggle visual)
       ======================================================== */
    function engancharChipsEvidencia() {
        document.querySelectorAll('.evidencia-chip').forEach(label => {
            const input = label.querySelector('input[type="checkbox"]');
            if (!input) return;

            const actualizar = () => {
                if (input.checked) {
                    label.style.background = 'rgba(46, 125, 50, 0.12)';
                    label.style.borderColor = 'rgba(46, 125, 50, 0.6)';
                } else {
                    label.style.background = 'transparent';
                    label.style.borderColor = 'rgba(0,0,0,0.15)';
                }
            };

            input.addEventListener('change', actualizar);
            actualizar();
        });
    }

    function renderizarChipsEvidencia(evidenciasSeleccionadas) {
        const tipos = getTiposEvidencia();
        const sel = Array.isArray(evidenciasSeleccionadas) ? evidenciasSeleccionadas : [];

        return `
            <div class="form-grupo">
                <label>Evidencias</label>
                <p class="ayuda" style="margin: 0.25rem 0 0.5rem;">
                    Marca los tipos de evidencia que se generaron con esta actividad.
                </p>
                <div class="flex gap-1" style="flex-wrap: wrap;">
                    ${tipos.map(t => {
                        const checked = sel.includes(t);
                        return `
                            <label class="evidencia-chip"
                                   style="display: inline-flex; align-items: center; gap: 0.35rem;
                                          padding: 0.35rem 0.7rem; border: 1px solid rgba(0,0,0,0.15);
                                          border-radius: 999px; cursor: pointer;
                                          transition: background 0.15s, border-color 0.15s;">
                                <input type="checkbox"
                                       class="check-evidencia"
                                       value="${escaparHTML(t)}"
                                       ${checked ? 'checked' : ''}>
                                <span>${escaparHTML(t)}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function leerChipsEvidenciaSeleccionados() {
        const checks = document.querySelectorAll('.check-evidencia');
        const out = [];
        checks.forEach(c => { if (c.checked) out.push(c.value); });
        return out;
    }

    /* ========================================================
       MODAL: NUEVO REGISTRO
       ======================================================== */
    function abrirModalNuevoRegistro(actividadId) {
        const m3 = obtenerM3();
        const act = (m3.calendarizacion.actividades || [])
                        .find(a => a.id === actividadId);
        if (!act) {
            mostrarToast('Actividad no encontrada.', 'error');
            return;
        }

        const preguntas = getPreguntasBitacora();
        const pistas = preguntas.slice(1, 5).join(' · '); // sin la primera ("¿Qué actividad se realizó?")

        abrirModal({
            titulo: 'Nuevo registro de bitácora',
            textoAceptar: 'Guardar registro',
            contenidoHTML: `
                <p class="ayuda" style="margin-bottom: 0.75rem;">
                    Actividad: <strong>${escaparHTML(act.nombre)}</strong>
                </p>

                <div class="form-fila">
                    <div class="form-grupo">
                        <label for="new-fecha">Fecha <span class="obligatorio">*</span></label>
                        <input type="date" id="new-fecha" value="${fechaHoyISO()}">
                    </div>
                    <div class="form-grupo">
                        <label for="new-estado">Estado de implementación <span class="obligatorio">*</span></label>
                        <select id="new-estado">
                            ${getEstados().map(e => `
                                <option value="${escaparHTML(e.id)}" ${e.id === 'completada' ? 'selected' : ''}>
                                    ${escaparHTML(e.nombre)}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="form-grupo">
                    <label for="new-participantes">Participantes</label>
                    <input type="text" id="new-participantes"
                           placeholder="Ej. Grupo 5°A, familias, docente de biblioteca…"
                           maxlength="180">
                </div>

                <div class="form-grupo">
                    <label for="new-observaciones">Observaciones</label>
                    <textarea id="new-observaciones" rows="4" maxlength="800"
                              placeholder="¿Cómo fue la experiencia? ¿Qué funcionó bien? ¿Qué se puede mejorar?">${escaparHTML(pistas)}</textarea>
                    <span class="ayuda">Máximo 800 caracteres.</span>
                </div>

                ${renderizarChipsEvidencia([])}
            `,
            onAceptar: () => {
                const fecha = (document.getElementById('new-fecha')?.value || '').trim();
                const estado = (document.getElementById('new-estado')?.value || '').trim();
                const participantes = (document.getElementById('new-participantes')?.value || '').trim();
                let observaciones = (document.getElementById('new-observaciones')?.value || '').trim();
                const evidencias = leerChipsEvidenciaSeleccionados();

                if (!fecha) { mostrarToast('La fecha es obligatoria.', 'error'); return false; }
                if (!estado) { mostrarToast('El estado es obligatorio.', 'error'); return false; }

                // Quitar la pista si el usuario no la cambió
                if (observaciones === pistas) observaciones = '';

                const m3Actual = obtenerM3();
                const registros = [...(m3Actual.bitacora.registros || [])];

                registros.push({
                    id: generarId(),
                    actividadId,
                    fecha,
                    estado,
                    participantes,
                    observaciones,
                    evidencias,
                    fechaRegistro: new Date().toISOString()
                });

                guardarBitacora(registros);
                sincronizarEstadoActividad(actividadId);
                mostrarToast('Registro agregado.', 'exito');
                renderizar();
            }
        });
    }

    /* ========================================================
       MODAL: EDITAR REGISTRO
       ======================================================== */
    function abrirModalEditarRegistro(registroId) {
        const m3 = obtenerM3();
        const reg = (m3.bitacora.registros || [])
                        .find(r => r.id === registroId);
        if (!reg) {
            mostrarToast('Registro no encontrado.', 'error');
            return;
        }

        const act = (m3.calendarizacion.actividades || [])
                        .find(a => a.id === reg.actividadId);

        abrirModal({
            titulo: 'Editar registro',
            textoAceptar: 'Guardar cambios',
            contenidoHTML: `
                ${act ? `<p class="ayuda" style="margin-bottom: 0.75rem;">
                    Actividad: <strong>${escaparHTML(act.nombre)}</strong>
                </p>` : ''}

                <div class="form-fila">
                    <div class="form-grupo">
                        <label for="edit-fecha">Fecha <span class="obligatorio">*</span></label>
                        <input type="date" id="edit-fecha" value="${escaparHTML(reg.fecha || '')}">
                    </div>
                    <div class="form-grupo">
                        <label for="edit-estado">Estado de implementación <span class="obligatorio">*</span></label>
                        <select id="edit-estado">
                            ${getEstados().map(e => `
                                <option value="${escaparHTML(e.id)}" ${reg.estado === e.id ? 'selected' : ''}>
                                    ${escaparHTML(e.nombre)}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="form-grupo">
                    <label for="edit-participantes">Participantes</label>
                    <input type="text" id="edit-participantes"
                           value="${escaparHTML(reg.participantes || '')}"
                           maxlength="180">
                </div>

                <div class="form-grupo">
                    <label for="edit-observaciones">Observaciones</label>
                    <textarea id="edit-observaciones" rows="4" maxlength="800">${escaparHTML(reg.observaciones || '')}</textarea>
                    <span class="ayuda">Máximo 800 caracteres.</span>
                </div>

                ${renderizarChipsEvidencia(reg.evidencias || [])}
            `,
            onAceptar: () => {
                const fecha = (document.getElementById('edit-fecha')?.value || '').trim();
                const estado = (document.getElementById('edit-estado')?.value || '').trim();
                const participantes = (document.getElementById('edit-participantes')?.value || '').trim();
                const observaciones = (document.getElementById('edit-observaciones')?.value || '').trim();
                const evidencias = leerChipsEvidenciaSeleccionados();

                if (!fecha) { mostrarToast('La fecha es obligatoria.', 'error'); return false; }
                if (!estado) { mostrarToast('El estado es obligatorio.', 'error'); return false; }

                const m3Actual = obtenerM3();
                const registros = (m3Actual.bitacora.registros || []).map(r => {
                    if (r.id !== registroId) return r;
                    return {
                        ...r,
                        fecha,
                        estado,
                        participantes,
                        observaciones,
                        evidencias
                    };
                });

                guardarBitacora(registros);
                sincronizarEstadoActividad(reg.actividadId);
                mostrarToast('Registro actualizado.', 'exito');
                renderizar();
            }
        });
    }

    /* ========================================================
       CONFIRMAR ELIMINAR REGISTRO
       ======================================================== */
    function confirmarEliminarRegistro(registroId) {
        const m3 = obtenerM3();
        const reg = (m3.bitacora.registros || [])
                        .find(r => r.id === registroId);
        if (!reg) return;

        const act = (m3.calendarizacion.actividades || [])
                        .find(a => a.id === reg.actividadId);

        abrirModal({
            titulo: 'Eliminar registro',
            textoAceptar: 'Sí, eliminar',
            contenidoHTML: `
                <p>¿Eliminar el registro del <strong>${formatearFecha(reg.fecha)}</strong>
                ${act ? `de la actividad <strong>"${escaparHTML(act.nombre)}"</strong>` : ''}?</p>
                <p class="ayuda">Esta acción no se puede deshacer.</p>
            `,
            onAceptar: () => {
                const m3Actual = obtenerM3();
                const registros = (m3Actual.bitacora.registros || [])
                    .filter(r => r.id !== registroId);

                guardarBitacora(registros);
                sincronizarEstadoActividad(reg.actividadId);
                mostrarToast('Registro eliminado.', 'info');
                renderizar();
            }
        });
    }

    /* ========================================================
       EVENTOS
       ======================================================== */
    function suscribirEventos() {
        const fMes = document.getElementById('filtro-mes');
        if (fMes) {
            fMes.addEventListener('change', e => {
                filtroMes = e.target.value;
                renderizar();
            });
        }

        const fTipo = document.getElementById('filtro-tipo');
        if (fTipo) {
            fTipo.addEventListener('change', e => {
                filtroTipo = e.target.value;
                renderizar();
            });
        }

        const fReg = document.getElementById('filtro-registro');
        if (fReg) {
            fReg.addEventListener('change', e => {
                filtroRegistro = e.target.value;
                renderizar();
            });
        }

        contenedor.querySelectorAll('.btn-nuevo-registro').forEach(btn => {
            btn.addEventListener('click', e => {
                abrirModalNuevoRegistro(e.currentTarget.dataset.actividad);
            });
        });

        contenedor.querySelectorAll('.btn-editar-registro').forEach(btn => {
            btn.addEventListener('click', e => {
                abrirModalEditarRegistro(e.currentTarget.dataset.registro);
            });
        });

        contenedor.querySelectorAll('.btn-eliminar-registro').forEach(btn => {
            btn.addEventListener('click', e => {
                confirmarEliminarRegistro(e.currentTarget.dataset.registro);
            });
        });

        const notas = document.getElementById('notas-bitacora');
        if (notas) {
            notas.addEventListener('input', e => guardarNotas(e.target.value));
        }
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        renderizar,
        // Debug rápido desde consola:
        _filtros: () => ({ filtroMes, filtroTipo, filtroRegistro })
    };

})();

/* ============================================================
   EXPOSICIÓN A WINDOW — FIX CRÍTICO (bug recurrente del proyecto)
   ============================================================ */
if (typeof window !== 'undefined') {
    window.MOMENTO3_4 = MOMENTO3_4;
    console.log('✅ MOMENTO3_4 expuesto en window (v3.0)');
}
