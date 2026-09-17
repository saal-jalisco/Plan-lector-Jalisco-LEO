/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3-4-bitacora.js — Sub-sección 3.4: Bitácora de Actividades
   ============================================================ */

const MOMENTO3_4 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar(cont) {
        contenedor = cont || document.getElementById('contenido-sub-seccion');
        if (!contenedor) return;

        const m3 = ESTADO.obtenerSeccion('momento3');
        const actividades = m3.calendarizacion.actividades || [];
        const registros = m3.bitacora.registros || [];

        // Contadores por estado (según el último registro de cada actividad)
        const contadores = calcularContadores(actividades, registros);

        // Actividades sin registro
        const actividadesSinRegistro = actividades.filter(a => {
            return !registros.some(r => r.actividadId === a.id);
        });

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <!-- ===== ENCABEZADO ===== -->
                <div class="seccion-header">
                    <h3><i class="fas fa-book-open"></i> 3.4 Bitácora de Actividades</h3>
                    <p class="seccion-descripcion">
                        Registra cómo fue la implementación de cada actividad: fecha, estado,
                        observaciones, participantes y evidencias.
                    </p>
                </div>

                <!-- ===== INFO ===== -->
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Actividades:</strong> ${actividades.length} ·
                    <strong>Registros:</strong> ${registros.length} ·
                    <strong>Completadas:</strong> ${contadores.completada} ·
                    <strong>En proceso:</strong> ${contadores['en-proceso']} ·
                    <strong>No iniciadas:</strong> ${contadores['no-iniciada']}
                </div>

                <!-- ===== ALERTA SI HAY ACTIVIDADES SIN REGISTRO ===== -->
                ${actividadesSinRegistro.length > 0 && actividades.length > 0 ? `
                    <div class="caja-info">
                        <i class="fas fa-lightbulb"></i>
                        <strong>Sugerencia:</strong> Hay ${actividadesSinRegistro.length} actividad(es) sin registro.
                        La bitácora se puede llenar durante o después de cada actividad.
                    </div>
                ` : actividades.length > 0 && registros.length > 0 ? `
                    <div class="caja-exito">
                        <i class="fas fa-check-circle"></i>
                        <strong>¡Bien!</strong> Todas las actividades tienen al menos un registro en la bitácora.
                    </div>
                ` : ''}

                <!-- ===== ACTIVIDADES Y REGISTROS ===== -->
                ${actividades.length > 0 ? `
                    <div class="form-bloque">
                        <h3><i class="fas fa-list"></i> Actividades y registros</h3>
                        <p class="ayuda">
                            Cada actividad puede tener uno o varios registros (por ejemplo, si se implementó en varias sesiones).
                        </p>

                        <div class="lista-bitacora">
                            ${actividades.map(a => renderizarActividadConRegistros(a, registros)).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="caja-info">
                        <i class="fas fa-info-circle"></i>
                        No hay actividades calendarizadas.
                        Regresa al sub-paso 3.2 para agregar actividades.
                    </div>
                `}

                <!-- ===== NOTAS DEL COLECTIVO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Notas del colectivo</h3>
                    <p class="ayuda">
                        Opcional. Reflexiones generales sobre la implementación.
                    </p>
                    <div class="form-grupo">
                        <textarea id="notas-bitacora"
                                  placeholder="Ej. La actividad X funcionó muy bien porque..."
                                  maxlength="600"
                                  rows="4">${m3.bitacora.notas || ''}</textarea>
                        <span class="ayuda">Máximo 600 caracteres.</span>
                    </div>
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-${registros.length > 0 ? 'exito' : 'info'}"
                     id="resumen-sub-seccion">
                    <i class="fas fa-${registros.length > 0 ? 'check-circle' : 'info-circle'}"></i>
                    ${actividades.length === 0
                        ? 'Agrega actividades en el sub-paso 3.2 para registrar la implementación.'
                        : registros.length === 0
                            ? 'Aún no hay registros. Puedes llenar la bitácora durante o después de cada actividad.'
                            : `${registros.length} registro(s) en la bitácora.`}
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       RENDERIZAR ACTIVIDAD CON REGISTROS
       ======================================================== */
    function renderizarActividadConRegistros(actividad, registros) {
        const ruta = DATOS.rutasLEO[actividad.rutaId];
        const registrosActividad = registros.filter(r => r.actividadId === actividad.id);
        const ultimoRegistro = registrosActividad.length > 0
            ? registrosActividad[registrosActividad.length - 1]
            : null;
        const estadoActual = ultimoRegistro?.estado || actividad.estado || 'no-iniciada';
        const estadoDef = DATOS.momento3.estadosImplementacion.find(e => e.id === estadoActual);

        return `
            <div class="tarjeta-bitacora" data-actividad="${actividad.id}">
                <div class="flex-between mb-2">
                    <div>
                        <strong>${actividad.nombre}</strong>
                        ${ruta ? `<span class="chip">${ruta.nombre}</span>` : ''}
                    </div>
                    <button type="button" class="btn btn-sm btn-primario btn-agregar-registro"
                            data-actividad="${actividad.id}">
                        <i class="fas fa-plus"></i> Registrar
                    </button>
                </div>

                <div class="flex gap-1 mb-2" style="flex-wrap: wrap;">
                    <span class="chip ${estadoDef?.color || 'gris'}">
                        <i class="fas fa-circle"></i> ${estadoDef?.nombre || estadoActual}
                    </span>
                    <span class="chip"><i class="fas fa-calendar"></i> ${actividad.mes} · ${actividad.semana}</span>
                    ${registrosActividad.length > 0 ? `
                        <span class="chip naranja">${registrosActividad.length} registro(s)</span>
                    ` : ''}
                </div>

                ${registrosActividad.length > 0 ? `
                    <div class="registros-lista">
                        <strong>Registros:</strong>
                        <ul>
                            ${registrosActividad.map(r => {
                                const est = DATOS.momento3.estadosImplementacion.find(e => e.id === r.estado);
                                return `
                                    <li>
                                        <div class="flex-between">
                                            <div>
                                                <strong>${r.fecha}</strong>
                                                <span class="chip ${est?.color || 'gris'}">${est?.nombre || r.estado}</span>
                                                ${r.participantes ? `<br><span class="ayuda">Participantes: ${r.participantes}</span>` : ''}
                                                ${r.observaciones ? `<br><span class="ayuda">${r.observaciones}</span>` : ''}
                                                ${r.evidencias && r.evidencias.length > 0 ? `
                                                    <br><span class="ayuda">
                                                        Evidencias: ${r.evidencias.map(e => `<span class="chip">${e}</span>`).join('')}
                                                    </span>
                                                ` : ''}
                                            </div>
                                            <div class="flex gap-1">
                                                <button type="button" class="btn btn-icono btn-secundario btn-editar-registro"
                                                        data-registro="${r.id}" title="Editar">
                                                    <i class="fas fa-pen"></i>
                                                </button>
                                                <button type="button" class="btn btn-icono btn-peligro btn-eliminar-registro"
                                                        data-registro="${r.id}" title="Eliminar">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                    </div>
                ` : `
                    <p class="ayuda" style="font-style: italic; margin-top: 0.5rem;">
                        Sin registros aún.
                    </p>
                `}
            </div>
        `;
    }

    /* ========================================================
       CALCULAR CONTADORES
       ======================================================== */
    function calcularContadores(actividades, registros) {
        const contadores = {
            'no-iniciada': 0,
            'en-proceso': 0,
            'completada': 0,
            'reprogramada': 0
        };

        actividades.forEach(a => {
            const registrosActividad = registros.filter(r => r.actividadId === a.id);
            const ultimoRegistro = registrosActividad.length > 0
                ? registrosActividad[registrosActividad.length - 1]
                : null;
            const estado = ultimoRegistro?.estado || a.estado || 'no-iniciada';
            if (contadores[estado] !== undefined) {
                contadores[estado]++;
            }
        });

        return contadores;
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Agregar registro
        contenedor.querySelectorAll('.btn-agregar-registro').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actividadId = e.currentTarget.dataset.actividad;
                abrirModalAgregarRegistro(actividadId);
            });
        });

        // Editar registro
        contenedor.querySelectorAll('.btn-editar-registro').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const registroId = e.currentTarget.dataset.registro;
                abrirModalEditarRegistro(registroId);
            });
        });

        // Eliminar registro
        contenedor.querySelectorAll('.btn-eliminar-registro').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const registroId = e.currentTarget.dataset.registro;
                confirmarEliminarRegistro(registroId);
            });
        });

        // Notas
        const notas = document.getElementById('notas-bitacora');
        if (notas) {
            notas.addEventListener('input', (e) => {
                const m3 = ESTADO.obtenerSeccion('momento3');
                ESTADO.actualizarCampo('momento3', 'bitacora', {
                    ...m3.bitacora,
                    notas: e.target.value
                });
            });
        }
    }

    /* ========================================================
       MODAL: AGREGAR REGISTRO
       ======================================================== */
    function abrirModalAgregarRegistro(actividadId) {
        const m3 = ESTADO.obtenerSeccion('momento3');
        const actividad = m3.calendarizacion.actividades.find(a => a.id === actividadId);
        if (!actividad) return;

        const modal = document.getElementById('modal-confirmacion');
        const titulo = document.getElementById('modal-titulo');
        const mensaje = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        const hoy = new Date().toISOString().split('T')[0];

        titulo.textContent = `Registrar: ${actividad.nombre}`;
        mensaje.innerHTML = `
            <div class="form-fila">
                <div class="form-grupo">
                    <label>Fecha <span class="obligatorio">*</span></label>
                    <input type="date" id="registro-fecha" value="${hoy}">
                </div>
                <div class="form-grupo">
                    <label>Estado <span class="obligatorio">*</span></label>
                    <select id="registro-estado">
                        ${DATOS.momento3.estadosImplementacion.map(e => `
                            <option value="${e.id}" ${e.id === 'completada' ? 'selected' : ''}>${e.nombre}</option>
                        `).join('')}
                    </select>
                </div>
            </div>

            <div class="form-grupo">
                <label>Participantes</label>
                <input type="text" id="registro-participantes" placeholder="Ej. Estudiantes de 5°A, docentes, familias...">
            </div>

            <div class="form-grupo">
                <label>Observaciones</label>
                <textarea id="registro-observaciones" rows="3" placeholder="¿Cómo fue la experiencia? ¿Qué funcionó bien? ¿Qué se puede mejorar?"></textarea>
            </div>

            <div class="form-grupo">
                <label>Evidencias</label>
                <div class="opciones-grupo" id="registro-evidencias">
                    ${DATOS.momento3.tiposEvidencia.map(e => `
                        <label class="opcion">
                            <input type="checkbox" name="evidencia" value="${e}">
                            ${e}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        btnAceptar.textContent = 'Guardar registro';
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
            const fecha = document.getElementById('registro-fecha').value;
            const estado = document.getElementById('registro-estado').value;
            const participantes = document.getElementById('registro-participantes').value.trim();
            const observaciones = document.getElementById('registro-observaciones').value.trim();
            const evidencias = Array.from(
                document.querySelectorAll('#registro-evidencias input[name="evidencia"]:checked')
            ).map(cb => cb.value);

            if (!fecha) {
                alert('La fecha es obligatoria.');
                return;
            }

            ESTADO.agregarRegistroBitacora({
                actividadId,
                fecha,
                estado,
                participantes,
                observaciones,
                evidencias
            });

            // Actualizar el estado de la actividad
            ESTADO.actualizarActividad(actividadId, { estado });

            modal.style.display = 'none';
            APP.mostrarToast('Registro guardado.', 'exito');
            renderizar();
        });
    }

    /* ========================================================
       MODAL: EDITAR REGISTRO
       ======================================================== */
    function abrirModalEditarRegistro(registroId) {
        const m3 = ESTADO.obtenerSeccion('momento3');
        const registro = m3.bitacora.registros.find(r => r.id === registroId);
        if (!registro) return;

        const modal = document.getElementById('modal-confirmacion');
        const titulo = document.getElementById('modal-titulo');
        const mensaje = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        titulo.textContent = 'Editar registro';
        mensaje.innerHTML = `
            <div class="form-fila">
                <div class="form-grupo">
                    <label>Fecha <span class="obligatorio">*</span></label>
                    <input type="date" id="edit-registro-fecha" value="${registro.fecha}">
                </div>
                <div class="form-grupo">
                    <label>Estado <span class="obligatorio">*</span></label>
                    <select id="edit-registro-estado">
                        ${DATOS.momento3.estadosImplementacion.map(e => `
                            <option value="${e.id}" ${registro.estado === e.id ? 'selected' : ''}>${e.nombre}</option>
                        `).join('')}
                    </select>
                </div>
            </div>

            <div class="form-grupo">
                <label>Participantes</label>
                <input type="text" id="edit-registro-participantes" value="${registro.participantes || ''}">
            </div>

            <div class="form-grupo">
                <label>Observaciones</label>
                <textarea id="edit-registro-observaciones" rows="3">${registro.observaciones || ''}</textarea>
            </div>

            <div class="form-grupo">
                <label>Evidencias</label>
                <div class="opciones-grupo" id="edit-registro-evidencias">
                    ${DATOS.momento3.tiposEvidencia.map(e => {
                        const checked = registro.evidencias && registro.evidencias.includes(e);
                        return `
                            <label class="opcion ${checked ? 'seleccionada' : ''}">
                                <input type="checkbox" name="edit-evidencia" value="${e}" ${checked ? 'checked' : ''}>
                                ${e}
                            </label>
                        `;
                    }).join('')}
                </div>
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
                fecha: document.getElementById('edit-registro-fecha').value,
                estado: document.getElementById('edit-registro-estado').value,
                participantes: document.getElementById('edit-registro-participantes').value.trim(),
                observaciones: document.getElementById('edit-registro-observaciones').value.trim(),
                evidencias: Array.from(
                    document.querySelectorAll('#edit-registro-evidencias input[name="edit-evidencia"]:checked')
                ).map(cb => cb.value)
            };

            if (!cambios.fecha) {
                alert('La fecha es obligatoria.');
                return;
            }

            ESTADO.actualizarRegistroBitacora(registroId, cambios);
            modal.style.display = 'none';
            APP.mostrarToast('Registro actualizado.', 'exito');
            renderizar();
        });
    }

    /* ========================================================
       CONFIRMAR ELIMINAR REGISTRO
       ======================================================== */
    function confirmarEliminarRegistro(registroId) {
        APP.mostrarModalConfirmacion(
            'Eliminar registro',
            '¿Estás segura de eliminar este registro de la bitácora? Esta acción no se puede deshacer.',
            () => {
                ESTADO.eliminarRegistroBitacora(registroId);
                APP.mostrarToast('Registro eliminado.', 'info');
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
