/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3-2-calendarizacion.js — Sub-sección 3.2: Calendarización
   v2.1 — Quita re-sincronizar (automático) + modal funcional
   ============================================================ */

const MOMENTO3_2 = (function() {

    let contenedor = null;
    let filtroMes = 'todos';
    let filtroTipo = 'todos';
    let filtroEstado = 'todos';
    let vistaActual = 'meses';

    const MESES_VALIDOS = ['septiembre', 'octubre', 'noviembre'];

    /* ========================================================
       HELPERS
       ======================================================== */
    function obtenerM3() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try {
                const m3 = ESTADO.obtenerSeccion('momento3') || {};
                if (!m3.calendarizacion) m3.calendarizacion = { actividades: [], notas: '' };
                if (!m3.calendarizacion.actividades) m3.calendarizacion.actividades = [];
                return m3;
            } catch (e) { /* silencio */ }
        }
        return { calendarizacion: { actividades: [], notas: '' } };
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
        } catch (e) { console.warn('⚠️ No se pudo guardar:', e); }
    }

    function guardarNotas(notas) {
        if (typeof ESTADO === 'undefined') return;
        const m3 = obtenerM3();
        try {
            if (typeof ESTADO.actualizarCampo === 'function') {
                ESTADO.actualizarCampo('momento3', 'calendarizacion', {
                    ...m3.calendarizacion,
                    notas
                });
            }
        } catch (e) { /* silencio */ }
    }

    function generarId() {
        return 'act_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    }

    function mostrarToast(mensaje, tipo) {
        if (typeof APP !== 'undefined' && typeof APP.mostrarToast === 'function') {
            APP.mostrarToast(mensaje, tipo);
        } else {
            console.log(`[Toast ${tipo}] ${mensaje}`);
        }
    }

    /* ========================================================
       SINCRONIZAR ACTIVIDADES DESDE 3.1 (AUTOMÁTICO)
       ======================================================== */
    function sincronizarActividades() {
        const m3 = obtenerM3();
        const sel = m3.seleccionRutas || {};
        const rutaId = sel.rutaId;
        if (!rutaId) return;

        const ruta = (typeof DATOS !== 'undefined') ? DATOS.rutasLEO[rutaId] : null;
        if (!ruta) return;

        const nivel = sel.nivel;
        const nivelData = ruta.niveles?.[nivel];
        if (!nivelData || nivelData.disponible === false) return;

        const existentes = m3.calendarizacion.actividades || [];
        const nuevas = [];

        // ANCLAS
        (nivelData.anclas || []).forEach(a => {
            if (!existentes.some(e => e.tipo === 'ancla' && e.nombre === a.nombre)) {
                nuevas.push({
                    id: generarId(),
                    rutaId,
                    nombre: a.nombre,
                    descripcion: a.descripcion,
                    tipo: 'ancla',
                    frecuencia: a.frecuencia,
                    virtud: a.virtud,
                    mes: 'todo',
                    semana: '',
                    estado: 'no-iniciada',
                    notas: ''
                });
            }
        });

        // BANCO
        const bancoSel = sel.bancoSeleccionado || [];
        bancoSel.forEach(nombre => {
            const act = (nivelData.banco || []).find(b => b.nombre === nombre);
            if (!act) return;
            if (!existentes.some(e => e.tipo === 'banco' && e.nombre === act.nombre)) {
                nuevas.push({
                    id: generarId(),
                    rutaId,
                    nombre: act.nombre,
                    descripcion: act.descripcion,
                    tipo: 'banco',
                    frecuencia: act.frecuencia,
                    virtud: act.virtud,
                    mes: 'septiembre',
                    semana: '',
                    estado: 'no-iniciada',
                    notas: ''
                });
            }
        });

        // CIERRE
        const cierre = nivelData.cierre;
        if (cierre && !existentes.some(e => e.tipo === 'cierre' && e.nombre === cierre.nombre)) {
            nuevas.push({
                id: generarId(),
                rutaId,
                nombre: cierre.nombre,
                descripcion: cierre.descripcion,
                tipo: 'cierre',
                frecuencia: cierre.frecuencia,
                virtud: cierre.virtud,
                mes: sel.cierreMes || 'noviembre',
                semana: '',
                estado: 'no-iniciada',
                notas: ''
            });
        }

        if (nuevas.length > 0) {
            guardarActividades([...existentes, ...nuevas]);
            console.log(`✅ MOMENTO3_2: ${nuevas.length} actividad(es) sincronizada(s)`);
        }
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar(cont) {
        contenedor = cont || document.getElementById('contenido-sub-seccion');
        if (!contenedor) return;

        sincronizarActividades();

        const m3 = obtenerM3();
        const sel = m3.seleccionRutas || {};
        const ruta = sel.rutaId && typeof DATOS !== 'undefined' ? DATOS.rutasLEO[sel.rutaId] : null;
        const actividades = m3.calendarizacion.actividades || [];

        if (!ruta) {
            contenedor.innerHTML = `
                <div class="sub-seccion">
                    <div class="seccion-header">
                        <h3><i class="fas fa-calendar-days"></i> 3.2 Calendarización</h3>
                    </div>
                    <div class="caja-alerta">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Aún no has seleccionado una ruta.</strong>
                        Regresa al sub-paso <strong>3.1</strong> para elegirla antes de calendarizar.
                    </div>
                </div>
            `;
            return;
        }

        const filtradas = aplicarFiltros(actividades);
        const contadores = calcularContadores(actividades);

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <div class="seccion-header">
                    <h3><i class="fas fa-calendar-days"></i> 3.2 Calendarización</h3>
                    <p class="seccion-descripcion">
                        Distribuye las actividades del trimestre. Las <strong>anclas</strong> son permanentes,
                        el <strong>banco</strong> lo distribuyes libremente y el <strong>cierre</strong>
                        va al final del trimestre.
                    </p>
                </div>

                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Ruta:</strong> ${ruta.nombre} ·
                    <strong>Actividades:</strong> ${actividades.length} ·
                    <strong>Sept:</strong> ${contadores.septiembre} ·
                    <strong>Oct:</strong> ${contadores.octubre} ·
                    <strong>Nov:</strong> ${contadores.noviembre}
                    ${contadores.todo > 0 ? ` · <strong>Todo el trimestre:</strong> ${contadores.todo}` : ''}
                </div>

                <!-- ===== ACCIONES ===== -->
                <div class="form-bloque">
                    <div class="acciones-momento3-2">
                        <div>
                            <h3 style="margin: 0 0 0.25rem;"><i class="fas fa-circle-info"></i> Cómo funciona</h3>
                            <p class="ayuda" style="margin: 0;">
                                Las actividades se sincronizan automáticamente desde el paso <strong>3.1</strong>.
                                Usa el lápiz <i class="fas fa-pen"></i> para cambiar el mes, semana o estado.
                                Usa el bote de basura <i class="fas fa-trash"></i> para quitar actividades (excepto anclas).
                            </p>
                        </div>
                        <button type="button" class="btn btn-sm btn-primario" id="btn-agregar-actividad">
                            <i class="fas fa-plus"></i> Nueva actividad personalizada
                        </button>
                    </div>
                </div>

                <!-- ===== FILTROS ===== -->
                ${actividades.length > 0 ? `
                    <div class="form-bloque">
                        <h3><i class="fas fa-filter"></i> Filtros</h3>
                        <div class="form-fila">
                            <div class="form-grupo">
                                <label>Mes</label>
                                <select id="filtro-mes">
                                    <option value="todos" ${filtroMes === 'todos' ? 'selected' : ''}>Todos</option>
                                    <option value="todo" ${filtroMes === 'todo' ? 'selected' : ''}>Todo el trimestre</option>
                                    <option value="septiembre" ${filtroMes === 'septiembre' ? 'selected' : ''}>Septiembre</option>
                                    <option value="octubre" ${filtroMes === 'octubre' ? 'selected' : ''}>Octubre</option>
                                    <option value="noviembre" ${filtroMes === 'noviembre' ? 'selected' : ''}>Noviembre</option>
                                </select>
                            </div>
                            <div class="form-grupo">
                                <label>Tipo</label>
                                <select id="filtro-tipo">
                                    <option value="todos" ${filtroTipo === 'todos' ? 'selected' : ''}>Todos</option>
                                    <option value="ancla" ${filtroTipo === 'ancla' ? 'selected' : ''}>Anclas</option>
                                    <option value="banco" ${filtroTipo === 'banco' ? 'selected' : ''}>Banco</option>
                                    <option value="cierre" ${filtroTipo === 'cierre' ? 'selected' : ''}>Cierre</option>
                                    <option value="personalizada" ${filtroTipo === 'personalizada' ? 'selected' : ''}>Personalizadas</option>
                                </select>
                            </div>
                            <div class="form-grupo">
                                <label>Estado</label>
                                <select id="filtro-estado">
                                    <option value="todos" ${filtroEstado === 'todos' ? 'selected' : ''}>Todos</option>
                                    <option value="no-iniciada" ${filtroEstado === 'no-iniciada' ? 'selected' : ''}>No iniciada</option>
                                    <option value="en-proceso" ${filtroEstado === 'en-proceso' ? 'selected' : ''}>En proceso</option>
                                    <option value="completada" ${filtroEstado === 'completada' ? 'selected' : ''}>Completada</option>
                                    <option value="reprogramada" ${filtroEstado === 'reprogramada' ? 'selected' : ''}>Reprogramada</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-bloque">
                        <div class="flex-between mb-2">
                            <h3 style="margin: 0;"><i class="fas fa-table-cells-large"></i> Calendario del trimestre</h3>
                            <div class="flex gap-1">
                                <button type="button" class="btn btn-sm ${vistaActual === 'meses' ? 'btn-primario' : 'btn-secundario'}" id="btn-vista-meses">
                                    <i class="fas fa-calendar"></i> Meses
                                </button>
                                <button type="button" class="btn btn-sm ${vistaActual === 'lista' ? 'btn-primario' : 'btn-secundario'}" id="btn-vista-lista">
                                    <i class="fas fa-list"></i> Lista
                                </button>
                            </div>
                        </div>

                        ${vistaActual === 'meses' ? renderizarVistaMeses(filtradas) : renderizarVistaLista(filtradas)}
                    </div>
                ` : `
                    <div class="caja-info">
                        <i class="fas fa-info-circle"></i>
                        No hay actividades. Selecciona una ruta en el paso 3.1 o agrega una personalizada.
                    </div>
                `}

                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Notas del colectivo</h3>
                    <p class="ayuda">Opcional. Acuerdos sobre la distribución, ajustes, etc.</p>
                    <div class="form-grupo">
                        <textarea id="notas-calendarizacion" maxlength="600" rows="3"
                                  placeholder="Ej. Se acordó mover la actividad X a octubre por…">${m3.calendarizacion.notas || ''}</textarea>
                        <span class="ayuda">Máximo 600 caracteres.</span>
                    </div>
                </div>

                <div class="caja-${actividades.length > 0 ? 'exito' : 'info'}">
                    <i class="fas fa-${actividades.length > 0 ? 'check-circle' : 'info-circle'}"></i>
                    ${actividades.length > 0
                        ? `${actividades.length} actividad(es) calendarizada(s). Puedes continuar.`
                        : 'No hay actividades. Agrega manualmente o revisa la selección en 3.1.'}
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       VISTAS
       ======================================================== */
    function renderizarVistaMeses(actividades) {
        const todo = actividades.filter(a => a.mes === 'todo');
        const porMes = {
            septiembre: actividades.filter(a => a.mes === 'septiembre'),
            octubre: actividades.filter(a => a.mes === 'octubre'),
            noviembre: actividades.filter(a => a.mes === 'noviembre')
        };

        return `
            <div class="calendario-trimestre">
                ${todo.length > 0 ? `
                    <div class="calendario-mes calendario-mes-todo">
                        <div class="calendario-mes-header">
                            <h4><i class="fas fa-infinity"></i> Todo el trimestre</h4>
                            <span class="chip carmesi">${todo.length} ancla(s)</span>
                        </div>
                        <div class="calendario-mes-body">
                            ${todo.map(a => renderizarTarjetaActividad(a)).join('')}
                        </div>
                    </div>
                ` : ''}

                ${MESES_VALIDOS.map(mes => {
                    const items = porMes[mes] || [];
                    const nombreMes = mes.charAt(0).toUpperCase() + mes.slice(1);
                    return `
                        <div class="calendario-mes">
                            <div class="calendario-mes-header">
                                <h4>${nombreMes}</h4>
                                <span class="chip">${items.length} actividad(es)</span>
                            </div>
                            <div class="calendario-mes-body">
                                ${items.length > 0
                                    ? items.map(a => renderizarTarjetaActividad(a)).join('')
                                    : '<p class="ayuda" style="text-align: center; padding: 1rem;">Sin actividades</p>'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderizarVistaLista(actividades) {
        if (actividades.length === 0) {
            return '<p class="ayuda" style="text-align: center; padding: 1rem;">No hay actividades que coincidan con los filtros.</p>';
        }
        return `<div class="lista-actividades">${actividades.map(a => renderizarTarjetaActividad(a)).join('')}</div>`;
    }

    function renderizarTarjetaActividad(a) {
        const tipoDef = (typeof DATOS !== 'undefined')
            ? DATOS.momento3.tiposActividad.find(t => t.id === a.tipo)
            : null;
        const estadoDef = (typeof DATOS !== 'undefined')
            ? DATOS.momento3.estadosImplementacion.find(e => e.id === a.estado)
            : null;

        const mesLabel = a.mes === 'todo'
            ? 'Todo el trimestre'
            : (a.mes || '').charAt(0).toUpperCase() + (a.mes || '').slice(1);

        const puedeEliminar = a.tipo !== 'ancla';

        return `
            <div class="tarjeta tarjeta-actividad" data-actividad="${a.id}">
                <div class="flex-between" style="align-items: flex-start; gap: 0.5rem;">
                    <div style="flex: 1;">
                        <strong style="display: block;">${a.nombre}</strong>
                        ${a.descripcion ? `<p class="ayuda" style="margin: 0.25rem 0 0;">${a.descripcion}</p>` : ''}
                    </div>
                    <div class="flex gap-1">
                        <button type="button" class="btn btn-icono btn-secundario btn-editar-actividad"
                                data-actividad="${a.id}" title="Editar">
                            <i class="fas fa-pen"></i>
                        </button>
                        ${puedeEliminar ? `
                            <button type="button" class="btn btn-icono btn-peligro btn-eliminar-actividad"
                                    data-actividad="${a.id}" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.5rem;">
                    <span class="chip ${tipoDef?.color || 'gris'}">${tipoDef?.nombre || a.tipo}</span>
                    <span class="chip ${estadoDef?.color || 'gris'}">${estadoDef?.nombre || a.estado}</span>
                    <span class="chip"><i class="fas fa-calendar"></i> ${mesLabel}</span>
                    ${a.semana ? `<span class="chip">${a.semana}</span>` : ''}
                    ${a.frecuencia ? `<span class="chip naranja">${a.frecuencia}</span>` : ''}
                </div>

                ${a.notas ? `<p class="ayuda" style="margin-top: 0.5rem; font-style: italic;">${a.notas}</p>` : ''}
            </div>
        `;
    }

    /* ========================================================
       FILTROS Y CONTADORES
       ======================================================== */
    function aplicarFiltros(actividades) {
        return actividades.filter(a => {
            if (filtroMes !== 'todos' && a.mes !== filtroMes) return false;
            if (filtroTipo !== 'todos' && a.tipo !== filtroTipo) return false;
            if (filtroEstado !== 'todos' && a.estado !== filtroEstado) return false;
            return true;
        });
    }

    function calcularContadores(actividades) {
        return {
            septiembre: actividades.filter(a => a.mes === 'septiembre').length,
            octubre: actividades.filter(a => a.mes === 'octubre').length,
            noviembre: actividades.filter(a => a.mes === 'noviembre').length,
            todo: actividades.filter(a => a.mes === 'todo').length
        };
    }

    /* ========================================================
       MODAL — Helper genérico
       ======================================================== */
    function abrirModal({ titulo, contenidoHTML, textoAceptar, onAceptar }) {
        const modal = document.getElementById('modal-confirmacion');
        if (!modal) {
            console.error('❌ No existe #modal-confirmacion en el HTML');
            mostrarToast('Error: modal no disponible.', 'error');
            return;
        }

        document.getElementById('modal-titulo').textContent = titulo;
        document.getElementById('modal-mensaje').innerHTML = contenidoHTML;

        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');
        const btnCerrar = document.getElementById('modal-cerrar');

        btnAceptar.textContent = textoAceptar || 'Aceptar';

        const cerrar = () => { modal.style.display = 'none'; };

        // Clonar para limpiar listeners
        const nuevoAceptar = btnAceptar.cloneNode(true);
        const nuevoCancelar = btnCancelar.cloneNode(true);
        const nuevoCerrar = btnCerrar.cloneNode(true);
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
       MODAL: NUEVA ACTIVIDAD PERSONALIZADA
       ======================================================== */
    function abrirModalNuevaActividad() {
        const m3 = obtenerM3();
        const rutaId = m3.seleccionRutas?.rutaId;

        abrirModal({
            titulo: 'Nueva actividad personalizada',
            textoAceptar: 'Agregar',
            contenidoHTML: `
                <div class="form-grupo">
                    <label>Nombre <span class="obligatorio">*</span></label>
                    <input type="text" id="new-nombre" placeholder="Ej. Lectura en el patio">
                </div>
                <div class="form-grupo">
                    <label>Descripción</label>
                    <textarea id="new-descripcion" rows="2" placeholder="Breve descripción…"></textarea>
                </div>
                <div class="form-fila">
                    <div class="form-grupo">
                        <label>Mes</label>
                        <select id="new-mes">
                            <option value="septiembre">Septiembre</option>
                            <option value="octubre">Octubre</option>
                            <option value="noviembre">Noviembre</option>
                        </select>
                    </div>
                    <div class="form-grupo">
                        <label>Semana</label>
                        <select id="new-semana">
                            <option value="">— Sin especificar —</option>
                            <option value="Semana 1">Semana 1</option>
                            <option value="Semana 2">Semana 2</option>
                            <option value="Semana 3">Semana 3</option>
                            <option value="Semana 4">Semana 4</option>
                        </select>
                    </div>
                </div>
                <div class="form-grupo">
                    <label>Frecuencia</label>
                    <input type="text" id="new-frecuencia" placeholder="Ej. Semanal, Quincenal…">
                </div>
                <div class="form-grupo">
                    <label>Notas</label>
                    <textarea id="new-notas" rows="2"></textarea>
                </div>
            `,
            onAceptar: () => {
                const nombre = document.getElementById('new-nombre').value.trim();
                if (!nombre) { mostrarToast('El nombre es obligatorio.', 'error'); return false; }

                const m3Actual = obtenerM3();
                const actividades = [...(m3Actual.calendarizacion.actividades || [])];
                actividades.push({
                    id: generarId(),
                    rutaId: rutaId || null,
                    nombre,
                    descripcion: document.getElementById('new-descripcion').value.trim(),
                    tipo: 'personalizada',
                    frecuencia: document.getElementById('new-frecuencia').value.trim(),
                    virtud: '',
                    mes: document.getElementById('new-mes').value,
                    semana: document.getElementById('new-semana').value,
                    estado: 'no-iniciada',
                    notas: document.getElementById('new-notas').value.trim()
                });
                guardarActividades(actividades);
                mostrarToast('Actividad agregada.', 'exito');
                renderizar();
            }
        });
    }

    /* ========================================================
       MODAL: EDITAR ACTIVIDAD
       ======================================================== */
    function abrirModalEditarActividad(actividadId) {
        const m3 = obtenerM3();
        const act = (m3.calendarizacion.actividades || []).find(a => a.id === actividadId);
        if (!act) return;

        const esAncla = act.tipo === 'ancla';

        abrirModal({
            titulo: esAncla ? 'Editar ancla (solo estado y notas)' : 'Editar actividad',
            textoAceptar: 'Guardar',
            contenidoHTML: `
                <div class="form-grupo">
                    <label>Nombre</label>
                    <input type="text" id="edit-nombre" value="${act.nombre}" ${esAncla ? 'disabled' : ''}>
                    ${esAncla ? '<span class="ayuda">Las anclas no se pueden renombrar.</span>' : ''}
                </div>
                <div class="form-fila">
                    <div class="form-grupo">
                        <label>Mes ${esAncla ? '' : '<span class="obligatorio">*</span>'}</label>
                        <select id="edit-mes" ${esAncla ? 'disabled' : ''}>
                            ${esAncla ? `<option value="todo" selected>Todo el trimestre</option>` : `
                                <option value="septiembre" ${act.mes === 'septiembre' ? 'selected' : ''}>Septiembre</option>
                                <option value="octubre" ${act.mes === 'octubre' ? 'selected' : ''}>Octubre</option>
                                <option value="noviembre" ${act.mes === 'noviembre' ? 'selected' : ''}>Noviembre</option>
                            `}
                        </select>
                    </div>
                    <div class="form-grupo">
                        <label>Semana</label>
                        <select id="edit-semana" ${esAncla ? 'disabled' : ''}>
                            <option value="">— Sin especificar —</option>
                            <option value="Semana 1" ${act.semana === 'Semana 1' ? 'selected' : ''}>Semana 1</option>
                            <option value="Semana 2" ${act.semana === 'Semana 2' ? 'selected' : ''}>Semana 2</option>
                            <option value="Semana 3" ${act.semana === 'Semana 3' ? 'selected' : ''}>Semana 3</option>
                            <option value="Semana 4" ${act.semana === 'Semana 4' ? 'selected' : ''}>Semana 4</option>
                        </select>
                    </div>
                </div>
                <div class="form-grupo">
                    <label>Estado</label>
                    <select id="edit-estado">
                        <option value="no-iniciada" ${act.estado === 'no-iniciada' ? 'selected' : ''}>No iniciada</option>
                        <option value="en-proceso" ${act.estado === 'en-proceso' ? 'selected' : ''}>En proceso</option>
                        <option value="completada" ${act.estado === 'completada' ? 'selected' : ''}>Completada</option>
                        <option value="reprogramada" ${act.estado === 'reprogramada' ? 'selected' : ''}>Reprogramada</option>
                    </select>
                </div>
                <div class="form-grupo">
                    <label>Notas</label>
                    <textarea id="edit-notas" rows="2">${act.notas || ''}</textarea>
                </div>
            `,
            onAceptar: () => {
                const m3Actual = obtenerM3();
                const actividades = (m3Actual.calendarizacion.actividades || []).map(a => {
                    if (a.id !== actividadId) return a;
                    return {
                        ...a,
                        nombre: esAncla ? a.nombre : document.getElementById('edit-nombre').value.trim(),
                        mes: esAncla ? 'todo' : document.getElementById('edit-mes').value,
                        semana: esAncla ? '' : document.getElementById('edit-semana').value,
                        estado: document.getElementById('edit-estado').value,
                        notas: document.getElementById('edit-notas').value.trim()
                    };
                });
                guardarActividades(actividades);
                mostrarToast('Actividad actualizada.', 'exito');
                renderizar();
            }
        });
    }

    /* ========================================================
       MODAL: CONFIRMAR ELIMINAR
       ======================================================== */
    function confirmarEliminar(actividadId) {
        const m3 = obtenerM3();
        const act = (m3.calendarizacion.actividades || []).find(a => a.id === actividadId);
        if (!act) return;
        if (act.tipo === 'ancla') {
            mostrarToast('Las anclas no se pueden eliminar.', 'error');
            return;
        }

        abrirModal({
            titulo: 'Eliminar actividad',
            textoAceptar: 'Sí, eliminar',
            contenidoHTML: `<p>¿Eliminar <strong>"${act.nombre}"</strong>? Esta acción no se puede deshacer.</p>`,
            onAceptar: () => {
                const m3Actual = obtenerM3();
                const actividades = (m3Actual.calendarizacion.actividades || []).filter(a => a.id !== actividadId);
                guardarActividades(actividades);
                mostrarToast('Actividad eliminada.', 'info');
                renderizar();
            }
        });
    }

    /* ========================================================
       EVENTOS
       ======================================================== */
    function suscribirEventos() {
        const fMes = document.getElementById('filtro-mes');
        if (fMes) fMes.addEventListener('change', e => { filtroMes = e.target.value; renderizar(); });

        const fTipo = document.getElementById('filtro-tipo');
        if (fTipo) fTipo.addEventListener('change', e => { filtroTipo = e.target.value; renderizar(); });

        const fEstado = document.getElementById('filtro-estado');
        if (fEstado) fEstado.addEventListener('change', e => { filtroEstado = e.target.value; renderizar(); });

        const bMeses = document.getElementById('btn-vista-meses');
        if (bMeses) bMeses.addEventListener('click', () => { vistaActual = 'meses'; renderizar(); });

        const bLista = document.getElementById('btn-vista-lista');
        if (bLista) bLista.addEventListener('click', () => { vistaActual = 'lista'; renderizar(); });

        const bAgregar = document.getElementById('btn-agregar-actividad');
        if (bAgregar) bAgregar.addEventListener('click', abrirModalNuevaActividad);

        contenedor.querySelectorAll('.btn-editar-actividad').forEach(btn => {
            btn.addEventListener('click', e => abrirModalEditarActividad(e.currentTarget.dataset.actividad));
        });

        contenedor.querySelectorAll('.btn-eliminar-actividad').forEach(btn => {
            btn.addEventListener('click', e => confirmarEliminar(e.currentTarget.dataset.actividad));
        });

        const notas = document.getElementById('notas-calendarizacion');
        if (notas) notas.addEventListener('input', e => guardarNotas(e.target.value));
    }

    return { renderizar, sincronizarActividades };

})();

if (typeof window !== 'undefined') {
    window.MOMENTO3_2 = MOMENTO3_2;
    console.log('✅ MOMENTO3_2 expuesto en window (v2.1)');
}
