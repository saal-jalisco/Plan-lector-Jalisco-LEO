/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3-2-calendarizacion.js — Sub-sección 3.2: Calendarización
   ============================================================ */

const MOMENTO3_2 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;
    let filtroRuta = 'todas';
    let filtroMes = 'todos';
    let filtroTipo = 'todos';
    let filtroEstado = 'todos';
    let vistaActual = 'meses'; // 'meses' | 'lista'

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar(cont) {
        contenedor = cont || document.getElementById('contenido-sub-seccion');
        if (!contenedor) return;

        const m3 = ESTADO.obtenerSeccion('momento3');
        const actividades = m3.calendarizacion.actividades || [];

        // Aplicar filtros
        const actividadesFiltradas = aplicarFiltros(actividades);

        // Contadores
        const contadores = calcularContadores(actividades);

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <!-- ===== ENCABEZADO ===== -->
                <div class="seccion-header">
                    <h3><i class="fas fa-calendar-days"></i> 3.2 Calendarización</h3>
                    <p class="seccion-descripcion">
                        Distribuye las actividades de las rutas seleccionadas en el trimestre
                        (septiembre, octubre, noviembre).
                    </p>
                </div>

                <!-- ===== INFO ===== -->
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Actividades calendarizadas:</strong> ${actividades.length} ·
                    <strong>Septiembre:</strong> ${contadores.septiembre} ·
                    <strong>Octubre:</strong> ${contadores.octubre} ·
                    <strong>Noviembre:</strong> ${contadores.noviembre}
                </div>

                <!-- ===== BOTÓN AGREGAR ===== -->
                <div class="form-bloque">
                    <div class="flex-between">
                        <h3><i class="fas fa-plus-circle"></i> Agregar actividad</h3>
                        <button type="button" class="btn btn-primario" id="btn-agregar-actividad">
                            <i class="fas fa-plus"></i> Nueva actividad
                        </button>
                    </div>
                    <p class="ayuda" style="margin-top: 0.5rem;">
                        Agrega actividades de las rutas seleccionadas o actividades personalizadas.
                    </p>
                </div>

                <!-- ===== FILTROS ===== -->
                ${actividades.length > 0 ? `
                    <div class="form-bloque">
                        <h3><i class="fas fa-filter"></i> Filtros</h3>
                        <div class="form-fila">
                            <div class="form-grupo">
                                <label>Ruta</label>
                                <select id="filtro-ruta">
                                    <option value="todas">Todas las rutas</option>
                                    ${obtenerRutasSeleccionadas().map(r => {
                                        const ruta = DATOS.rutasLEO[r.rutaId];
                                        return `<option value="${r.rutaId}" ${filtroRuta === r.rutaId ? 'selected' : ''}>${ruta?.nombre || r.rutaId}</option>`;
                                    }).join('')}
                                </select>
                            </div>
                            <div class="form-grupo">
                                <label>Mes</label>
                                <select id="filtro-mes">
                                    <option value="todos">Todos los meses</option>
                                    <option value="septiembre" ${filtroMes === 'septiembre' ? 'selected' : ''}>Septiembre</option>
                                    <option value="octubre" ${filtroMes === 'octubre' ? 'selected' : ''}>Octubre</option>
                                    <option value="noviembre" ${filtroMes === 'noviembre' ? 'selected' : ''}>Noviembre</option>
                                </select>
                            </div>
                            <div class="form-grupo">
                                <label>Tipo</label>
                                <select id="filtro-tipo">
                                    <option value="todos">Todos los tipos</option>
                                    ${DATOS.momento3.tiposActividad.map(t => `
                                        <option value="${t.id}" ${filtroTipo === t.id ? 'selected' : ''}>${t.nombre}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="form-grupo">
                                <label>Estado</label>
                                <select id="filtro-estado">
                                    <option value="todos">Todos los estados</option>
                                    ${DATOS.momento3.estadosImplementacion.map(e => `
                                        <option value="${e.id}" ${filtroEstado === e.id ? 'selected' : ''}>${e.nombre}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- ===== VISTA POR MESES ===== -->
                ${actividades.length > 0 ? `
                    <div class="form-bloque">
                        <div class="flex-between mb-2">
                            <h3><i class="fas fa-table-cells-large"></i> Calendario del trimestre</h3>
                            <div class="flex gap-1">
                                <button type="button" class="btn btn-sm ${vistaActual === 'meses' ? 'btn-primario' : 'btn-secundario'}"
                                        id="btn-vista-meses">
                                    <i class="fas fa-calendar"></i> Meses
                                </button>
                                <button type="button" class="btn btn-sm ${vistaActual === 'lista' ? 'btn-primario' : 'btn-secundario'}"
                                        id="btn-vista-lista">
                                    <i class="fas fa-list"></i> Lista
                                </button>
                            </div>
                        </div>

                        ${vistaActual === 'meses' ? renderizarVistaMeses(actividadesFiltradas) : renderizarVistaLista(actividadesFiltradas)}
                    </div>
                ` : `
                    <div class="caja-info">
                        <i class="fas fa-info-circle"></i>
                        Aún no hay actividades calendarizadas.
                        Usa el botón "Nueva actividad" para empezar.
                    </div>
                `}

                <!-- ===== NOTAS DEL COLECTIVO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Notas del colectivo</h3>
                    <p class="ayuda">
                        Opcional. Observaciones sobre la calendarización, ajustes, etc.
                    </p>
                    <div class="form-grupo">
                        <textarea id="notas-calendarizacion"
                                  placeholder="Ej. Se ajustó la actividad X porque..."
                                  maxlength="600"
                                  rows="4">${m3.calendarizacion.notas || ''}</textarea>
                        <span class="ayuda">Máximo 600 caracteres.</span>
                    </div>
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-${actividades.length > 0 ? 'exito' : 'info'}" id="resumen-sub-seccion">
                    <i class="fas fa-${actividades.length > 0 ? 'check-circle' : 'info-circle'}"></i>
                    ${actividades.length > 0
                        ? `${actividades.length} actividad(es) calendarizada(s). Puedes continuar.`
                        : 'Agrega al menos una actividad para continuar.'}
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       VISTA POR MESES
       ======================================================== */
    function renderizarVistaMeses(actividades) {
        return `
            <div class="calendario-trimestre">
                ${DATOS.momento3.meses.map(mes => {
                    const actividadesMes = actividades.filter(a => a.mes === mes.id);
                    return `
                        <div class="calendario-mes">
                            <div class="calendario-mes-header">
                                <h4>${mes.nombre}</h4>
                                <span class="chip">${actividadesMes.length} actividad(es)</span>
                            </div>
                            <div class="calendario-mes-body">
                                ${actividadesMes.length > 0
                                    ? actividadesMes.map(a => renderizarTarjetaActividad(a)).join('')
                                    : '<p class="ayuda" style="text-align: center; padding: 1rem;">Sin actividades</p>'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /* ========================================================
       VISTA POR LISTA
       ======================================================== */
    function renderizarVistaLista(actividades) {
        if (actividades.length === 0) {
            return `<p class="ayuda">No hay actividades que coincidan con los filtros.</p>`;
        }

        return `
            <div class="lista-actividades">
                ${actividades.map(a => renderizarTarjetaActividad(a)).join('')}
            </div>
        `;
    }

    /* ========================================================
       TARJETA DE ACTIVIDAD
       ======================================================== */
    function renderizarTarjetaActividad(a) {
        const ruta = DATOS.rutasLEO[a.rutaId];
        const tipo = DATOS.momento3.tiposActividad.find(t => t.id === a.tipo);
        const estado = DATOS.momento3.estadosImplementacion.find(e => e.id === a.estado);

        return `
            <div class="tarjeta-actividad" data-actividad="${a.id}">
                <div class="flex-between">
                    <div>
                        <strong>${a.nombre}</strong>
                        ${ruta ? `<span class="chip">${ruta.nombre}</span>` : ''}
                    </div>
                    <div class="flex gap-1">
                        <button type="button" class="btn btn-icono btn-secundario btn-editar-actividad"
                                data-actividad="${a.id}" title="Editar">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button type="button" class="btn btn-icono btn-peligro btn-eliminar-actividad"
                                data-actividad="${a.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="flex gap-1" style="margin-top: 0.5rem; flex-wrap: wrap;">
                    <span class="chip ${tipo?.color || 'gris'}">${tipo?.nombre || a.tipo}</span>
                    <span class="chip ${estado?.color || 'gris'}">${estado?.nombre || a.estado}</span>
                    <span class="chip"><i class="fas fa-calendar"></i> ${a.mes} · ${a.semana}</span>
                </div>
                ${a.notas ? `<p class="ayuda" style="margin-top: 0.5rem;">${a.notas}</p>` : ''}
            </div>
        `;
    }

    /* ========================================================
       APLICAR FILTROS
       ======================================================== */
    function aplicarFiltros(actividades) {
        return actividades.filter(a => {
            if (filtroRuta !== 'todas' && a.rutaId !== filtroRuta) return false;
            if (filtroMes !== 'todos' && a.mes !== filtroMes) return false;
            if (filtroTipo !== 'todos' && a.tipo !== filtroTipo) return false;
            if (filtroEstado !== 'todos' && a.estado !== filtroEstado) return false;
            return true;
        });
    }

    /* ========================================================
       CALCULAR CONTADORES
       ======================================================== */
    function calcularContadores(actividades) {
        return {
            septiembre: actividades.filter(a => a.mes === 'septiembre').length,
            octubre: actividades.filter(a => a.mes === 'octubre').length,
            noviembre: actividades.filter(a => a.mes === 'noviembre').length
        };
    }

    /* ========================================================
       OBTENER RUTAS SELECCIONADAS
       ======================================================== */
    function obtenerRutasSeleccionadas() {
        const m3 = ESTADO.obtenerSeccion('momento3');
        return m3.seleccionRutas.rutas || [];
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Filtros
        const filtroRutaEl = document.getElementById('filtro-ruta');
        if (filtroRutaEl) {
            filtroRutaEl.addEventListener('change', (e) => {
                filtroRuta = e.target.value;
                renderizar();
            });
        }
        const filtroMesEl = document.getElementById('filtro-mes');
        if (filtroMesEl) {
            filtroMesEl.addEventListener('change', (e) => {
                filtroMes = e.target.value;
                renderizar();
            });
        }
        const filtroTipoEl = document.getElementById('filtro-tipo');
        if (filtroTipoEl) {
            filtroTipoEl.addEventListener('change', (e) => {
                filtroTipo = e.target.value;
                renderizar();
            });
        }
        const filtroEstadoEl = document.getElementById('filtro-estado');
        if (filtroEstadoEl) {
            filtroEstadoEl.addEventListener('change', (e) => {
                filtroEstado = e.target.value;
                renderizar();
            });
        }

        // Vistas
        const btnVistaMeses = document.getElementById('btn-vista-meses');
        if (btnVistaMeses) {
            btnVistaMeses.addEventListener('click', () => {
                vistaActual = 'meses';
                renderizar();
            });
        }
        const btnVistaLista = document.getElementById('btn-vista-lista');
        if (btnVistaLista) {
            btnVistaLista.addEventListener('click', () => {
                vistaActual = 'lista';
                renderizar();
            });
        }

        // Agregar actividad
        const btnAgregar = document.getElementById('btn-agregar-actividad');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', abrirModalAgregarActividad);
        }

        // Editar actividad
        contenedor.querySelectorAll('.btn-editar-actividad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.actividad;
                abrirModalEditarActividad(id);
            });
        });

        // Eliminar actividad
        contenedor.querySelectorAll('.btn-eliminar-actividad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.actividad;
                confirmarEliminarActividad(id);
            });
        });

        // Notas
        const notas = document.getElementById('notas-calendarizacion');
        if (notas) {
            notas.addEventListener('input', (e) => {
                const m3 = ESTADO.obtenerSeccion('momento3');
                ESTADO.actualizarCampo('momento3', 'calendarizacion', {
                    ...m3.calendarizacion,
                    notas: e.target.value
                });
            });
        }
    }

    /* ========================================================
       MODAL: AGREGAR ACTIVIDAD
       ======================================================== */
    function abrirModalAgregarActividad() {
        const rutasSeleccionadas = obtenerRutasSeleccionadas();

        if (rutasSeleccionadas.length === 0) {
            APP.mostrarToast('Primero selecciona rutas en el sub-paso 3.1.', 'error');
            return;
        }

        // Recopilar todas las actividades disponibles (esenciales + opcionales)
        const actividadesDisponibles = [];
        rutasSeleccionadas.forEach(r => {
            const ruta = DATOS.rutasLEO[r.rutaId];
            if (!ruta) return;
            ruta.actividadesEsenciales.forEach(a => {
                actividadesDisponibles.push({
                    rutaId: r.rutaId,
                    rutaNombre: ruta.nombre,
                    nombre: a.nombre,
                    nivel: a.nivel,
                    frecuencia: a.frecuencia,
                    esEsencial: true
                });
            });
            if (ruta.actividadesOpcionales) {
                ruta.actividadesOpcionales.forEach(a => {
                    actividadesDisponibles.push({
                        rutaId: r.rutaId,
                        rutaNombre: ruta.nombre,
                        nombre: a.nombre,
                        nivel: a.nivel,
                        frecuencia: a.frecuencia,
                        esEsencial: false
                    });
                });
            }
        });

        const modal = document.getElementById('modal-confirmacion');
        const titulo = document.getElementById('modal-titulo');
        const mensaje = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        titulo.textContent = 'Agregar actividad';
        mensaje.innerHTML = `
            <div class="form-grupo">
                <label>Ruta <span class="obligatorio">*</span></label>
                <select id="nueva-actividad-ruta">
                    ${rutasSeleccionadas.map(r => {
                        const ruta = DATOS.rutasLEO[r.rutaId];
                        return `<option value="${r.rutaId}">${ruta?.nombre || r.rutaId}</option>`;
                    }).join('')}
                </select>
            </div>

            <div class="form-grupo">
                <label>Actividad <span class="obligatorio">*</span></label>
                <select id="nueva-actividad-nombre">
                    <option value="">— Selecciona una actividad —</option>
                    ${actividadesDisponibles.map((a, i) => `
                        <option value="${a.nombre}" data-ruta="${a.rutaId}" data-nivel="${a.nivel}" data-frecuencia="${a.frecuencia}">
                            ${a.nombre} ${a.esEsencial ? '★' : ''}
                        </option>
                    `).join('')}
                </select>
                <span class="ayuda">Las actividades con ★ son esenciales de la ruta.</span>
            </div>

            <div class="form-grupo">
                <label>O escribe una actividad personalizada</label>
                <input type="text" id="nueva-actividad-personalizada" placeholder="Ej. Lectura en el patio">
            </div>

            <div class="form-fila">
                <div class="form-grupo">
                    <label>Mes <span class="obligatorio">*</span></label>
                    <select id="nueva-actividad-mes">
                        ${DATOS.momento3.meses.map(m => `
                            <option value="${m.id}">${m.nombre}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-grupo">
                    <label>Semana <span class="obligatorio">*</span></label>
                    <select id="nueva-actividad-semana">
                        ${DATOS.momento3.semanas.septiembre.map(s => `
                            <option value="${s}">${s}</option>
                        `).join('')}
                    </select>
                </div>
            </div>

            <div class="form-fila">
                <div class="form-grupo">
                    <label>Tipo <span class="obligatorio">*</span></label>
                    <select id="nueva-actividad-tipo">
                        ${DATOS.momento3.tiposActividad.map(t => `
                            <option value="${t.id}">${t.nombre}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-grupo">
                    <label>Estado inicial</label>
                    <select id="nueva-actividad-estado">
                        ${DATOS.momento3.estadosImplementacion.map(e => `
                            <option value="${e.id}" ${e.id === 'no-iniciada' ? 'selected' : ''}>${e.nombre}</option>
                        `).join('')}
                    </select>
                </div>
            </div>

            <div class="form-grupo">
                <label>Notas (opcional)</label>
                <textarea id="nueva-actividad-notas" rows="2" placeholder="Observaciones..."></textarea>
            </div>
        `;

        btnAceptar.textContent = 'Agregar';
        btnCancelar.textContent = 'Cancelar';

        const nuevoAceptar = btnAceptar.cloneNode(true);
        const nuevoCancelar = btnCancelar.cloneNode(true);
        btnAceptar.replaceWith(nuevoAceptar);
        btnCancelar.replaceWith(nuevoCancelar);

        modal.style.display = 'flex';

        nuevoCancelar.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        nuevoAceptar.addEventListener('click', () => {
            const rutaId = document.getElementById('nueva-actividad-ruta').value;
            const nombreSelect = document.getElementById('nueva-actividad-nombre').value;
            const nombrePersonalizado = document.getElementById('nueva-actividad-personalizada').value.trim();
            const nombre = nombrePersonalizado || nombreSelect;

            if (!nombre) {
                alert('Selecciona o escribe una actividad.');
                return;
            }

            const mes = document.getElementById('nueva-actividad-mes').value;
            const semana = document.getElementById('nueva-actividad-semana').value;
            const tipo = document.getElementById('nueva-actividad-tipo').value;
            const estado = document.getElementById('nueva-actividad-estado').value;
            const notas = document.getElementById('nueva-actividad-notas').value.trim();

            ESTADO.agregarActividad({
                rutaId,
                nombre,
                mes,
                semana,
                tipo,
                estado,
                notas
            });

            modal.style.display = 'none';
            APP.mostrarToast('Actividad agregada.', 'exito');
            renderizar();
        });
    }

    /* ========================================================
       MODAL: EDITAR ACTIVIDAD
       ======================================================== */
    function abrirModalEditarActividad(actividadId) {
        const m3 = ESTADO.obtenerSeccion('momento3');
        const actividad = m3.calendarizacion.actividades.find(a => a.id === actividadId);
        if (!actividad) return;

        const modal = document.getElementById('modal-confirmacion');
        const titulo = document.getElementById('modal-titulo');
        const mensaje = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        titulo.textContent = 'Editar actividad';
        mensaje.innerHTML = `
            <div class="form-grupo">
                <label>Nombre <span class="obligatorio">*</span></label>
                <input type="text" id="edit-actividad-nombre" value="${actividad.nombre}">
            </div>

            <div class="form-fila">
                <div class="form-grupo">
                    <label>Mes <span class="obligatorio">*</span></label>
                    <select id="edit-actividad-mes">
                        ${DATOS.momento3.meses.map(m => `
                            <option value="${m.id}" ${actividad.mes === m.id ? 'selected' : ''}>${m.nombre}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-grupo">
                    <label>Semana <span class="obligatorio">*</span></label>
                    <select id="edit-actividad-semana">
                        ${DATOS.momento3.semanas.septiembre.map(s => `
                            <option value="${s}" ${actividad.semana === s ? 'selected' : ''}>${s}</option>
                        `).join('')}
                    </select>
                </div>
            </div>

            <div class="form-fila">
                <div class="form-grupo">
                    <label>Tipo <span class="obligatorio">*</span></label>
                    <select id="edit-actividad-tipo">
                        ${DATOS.momento3.tiposActividad.map(t => `
                            <option value="${t.id}" ${actividad.tipo === t.id ? 'selected' : ''}>${t.nombre}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-grupo">
                    <label>Estado <span class="obligatorio">*</span></label>
                    <select id="edit-actividad-estado">
                        ${DATOS.momento3.estadosImplementacion.map(e => `
                            <option value="${e.id}" ${actividad.estado === e.id ? 'selected' : ''}>${e.nombre}</option>
                        `).join('')}
                    </select>
                </div>
            </div>

            <div class="form-grupo">
                <label>Notas</label>
                <textarea id="edit-actividad-notas" rows="2">${actividad.notas || ''}</textarea>
            </div>
        `;

        btnAceptar.textContent = 'Guardar';
        btnCancelar.textContent = 'Cancelar';

        const nuevoAceptar = btnAceptar.cloneNode(true);
        const nuevoCancelar = btnCancelar.cloneNode(true);
        btnAceptar.replaceWith(nuevoAceptar);
        btnCancelar.replaceWith(nuevoCancelar);

        modal.style.display = 'flex';

        nuevoCancelar.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        nuevoAceptar.addEventListener('click', () => {
            const cambios = {
                nombre: document.getElementById('edit-actividad-nombre').value.trim(),
                mes: document.getElementById('edit-actividad-mes').value,
                semana: document.getElementById('edit-actividad-semana').value,
                tipo: document.getElementById('edit-actividad-tipo').value,
                estado: document.getElementById('edit-actividad-estado').value,
                notas: document.getElementById('edit-actividad-notas').value.trim()
            };

            if (!cambios.nombre) {
                alert('El nombre es obligatorio.');
                return;
            }

            ESTADO.actualizarActividad(actividadId, cambios);
            modal.style.display = 'none';
            APP.mostrarToast('Actividad actualizada.', 'exito');
            renderizar();
        });
    }

    /* ========================================================
       CONFIRMAR ELIMINAR ACTIVIDAD
       ======================================================== */
    function confirmarEliminarActividad(actividadId) {
        APP.mostrarModalConfirmacion(
            'Eliminar actividad',
            '¿Estás segura de eliminar esta actividad? Esta acción no se puede deshacer.',
            () => {
                ESTADO.eliminarActividad(actividadId);
                APP.mostrarToast('Actividad eliminada.', 'info');
                renderizar();
            }
        );
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        renderizar
    };

})();
