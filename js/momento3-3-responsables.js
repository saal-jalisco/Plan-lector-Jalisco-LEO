/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3-3-responsables.js — Sub-sección 3.3: Responsables
   ============================================================ */

const MOMENTO3_3 = (function() {

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
        const asignaciones = m3.responsables.asignaciones || [];

        // Calcular actividades sin responsable
        const actividadesSinResponsable = actividades.filter(a => {
            return !asignaciones.some(asig => asig.actividadId === a.id);
        });

        // Contadores
        const totalActividades = actividades.length;
        const totalAsignaciones = asignaciones.length;
        const actividadesConResponsable = totalActividades - actividadesSinResponsable.length;

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <!-- ===== ENCABEZADO ===== -->
                <div class="seccion-header">
                    <h3><i class="fas fa-users-gear"></i> 3.3 Asignación de Responsables</h3>
                    <p class="seccion-descripcion">
                        Define quién es responsable de cada actividad de la Hoja de Ruta Trimestral.
                    </p>
                </div>

                <!-- ===== INFO ===== -->
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Actividades:</strong> ${totalActividades} ·
                    <strong>Con responsable:</strong> ${actividadesConResponsable} ·
                    <strong>Sin responsable:</strong> ${actividadesSinResponsable.length} ·
                    <strong>Asignaciones:</strong> ${totalAsignaciones}
                </div>

                <!-- ===== ALERTA SI HAY ACTIVIDADES SIN RESPONSABLE ===== -->
                ${actividadesSinResponsable.length > 0 ? `
                    <div class="caja-alerta">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Atención:</strong> Hay ${actividadesSinResponsable.length} actividad(es) sin responsable asignado.
                        Te recomendamos asignar al menos un responsable a cada actividad.
                    </div>
                ` : actividades.length > 0 ? `
                    <div class="caja-exito">
                        <i class="fas fa-check-circle"></i>
                        <strong>¡Bien!</strong> Todas las actividades tienen al menos un responsable asignado.
                    </div>
                ` : ''}

                <!-- ===== ACTIVIDADES ===== -->
                ${actividades.length > 0 ? `
                    <div class="form-bloque">
                        <h3><i class="fas fa-list"></i> Actividades y responsables</h3>
                        <p class="ayuda">
                            Haz clic en "Asignar responsable" para agregar un responsable a cada actividad.
                            Puedes asignar más de un responsable por actividad.
                        </p>

                        <div class="lista-responsables">
                            ${actividades.map(a => renderizarActividadConResponsables(a, asignaciones)).join('')}
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
                        Opcional. Observaciones sobre la asignación de responsables.
                    </p>
                    <div class="form-grupo">
                        <textarea id="notas-responsables"
                                  placeholder="Ej. Se acordó que el director lidere la reunión inicial..."
                                  maxlength="600"
                                  rows="4">${m3.responsables.notas || ''}</textarea>
                        <span class="ayuda">Máximo 600 caracteres.</span>
                    </div>
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-${actividadesSinResponsable.length === 0 && actividades.length > 0 ? 'exito' : 'info'}"
                     id="resumen-sub-seccion">
                    <i class="fas fa-${actividadesSinResponsable.length === 0 && actividades.length > 0 ? 'check-circle' : 'info-circle'}"></i>
                    ${actividades.length === 0
                        ? 'Agrega actividades en el sub-paso 3.2 para asignar responsables.'
                        : actividadesSinResponsable.length === 0
                            ? 'Todas las actividades tienen responsable. Puedes continuar.'
                            : `Faltan ${actividadesSinResponsable.length} actividad(es) por asignar responsable.`}
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       RENDERIZAR ACTIVIDAD CON RESPONSABLES
       ======================================================== */
    function renderizarActividadConResponsables(actividad, asignaciones) {
        const ruta = DATOS.rutasLEO[actividad.rutaId];
        const tipo = DATOS.momento3.tiposActividad.find(t => t.id === actividad.tipo);
        const responsablesActividad = asignaciones.filter(a => a.actividadId === actividad.id);

        return `
            <div class="tarjeta-actividad-responsables" data-actividad="${actividad.id}">
                <div class="flex-between mb-2">
                    <div>
                        <strong>${actividad.nombre}</strong>
                        ${ruta ? `<span class="chip">${ruta.nombre}</span>` : ''}
                    </div>
                    <button type="button" class="btn btn-sm btn-primario btn-asignar-responsable"
                            data-actividad="${actividad.id}">
                        <i class="fas fa-plus"></i> Asignar responsable
                    </button>
                </div>

                <div class="flex gap-1 mb-2" style="flex-wrap: wrap;">
                    <span class="chip ${tipo?.color || 'gris'}">${tipo?.nombre || actividad.tipo}</span>
                    <span class="chip"><i class="fas fa-calendar"></i> ${actividad.mes} · ${actividad.semana}</span>
                </div>

                ${responsablesActividad.length > 0 ? `
                    <div class="responsables-lista">
                        <strong>Responsables:</strong>
                        <ul>
                            ${responsablesActividad.map(r => `
                                <li>
                                    <div class="flex-between">
                                        <div>
                                            <strong>${r.rol}:</strong> ${r.nombre}
                                            ${r.correo ? `<br><span class="ayuda">${r.correo}</span>` : ''}
                                        </div>
                                        <div class="flex gap-1">
                                            <button type="button" class="btn btn-icono btn-secundario btn-editar-responsable"
                                                    data-actividad="${r.actividadId}" data-rol="${r.rol}" title="Editar">
                                                <i class="fas fa-pen"></i>
                                            </button>
                                            <button type="button" class="btn btn-icono btn-peligro btn-eliminar-responsable"
                                                    data-actividad="${r.actividadId}" data-rol="${r.rol}" title="Eliminar">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : `
                    <p class="ayuda" style="font-style: italic; margin-top: 0.5rem;">
                        Sin responsable asignado.
                    </p>
                `}
            </div>
        `;
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Asignar responsable
        contenedor.querySelectorAll('.btn-asignar-responsable').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actividadId = e.currentTarget.dataset.actividad;
                abrirModalAsignarResponsable(actividadId);
            });
        });

        // Editar responsable
        contenedor.querySelectorAll('.btn-editar-responsable').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actividadId = e.currentTarget.dataset.actividad;
                const rol = e.currentTarget.dataset.rol;
                abrirModalEditarResponsable(actividadId, rol);
            });
        });

        // Eliminar responsable
        contenedor.querySelectorAll('.btn-eliminar-responsable').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actividadId = e.currentTarget.dataset.actividad;
                const rol = e.currentTarget.dataset.rol;
                confirmarEliminarResponsable(actividadId, rol);
            });
        });

        // Notas
        const notas = document.getElementById('notas-responsables');
        if (notas) {
            notas.addEventListener('input', (e) => {
                const m3 = ESTADO.obtenerSeccion('momento3');
                ESTADO.actualizarCampo('momento3', 'responsables', {
                    ...m3.responsables,
                    notas: e.target.value
                });
            });
        }
    }

    /* ========================================================
       MODAL: ASIGNAR RESPONSABLE
       ======================================================== */
    function abrirModalAsignarResponsable(actividadId) {
        const m3 = ESTADO.obtenerSeccion('momento3');
        const actividad = m3.calendarizacion.actividades.find(a => a.id === actividadId);
        if (!actividad) return;

        const modal = document.getElementById('modal-confirmacion');
        const titulo = document.getElementById('modal-titulo');
        const mensaje = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        titulo.textContent = `Asignar responsable: ${actividad.nombre}`;
        mensaje.innerHTML = `
            <div class="form-grupo">
                <label>Rol <span class="obligatorio">*</span></label>
                <select id="responsable-rol">
                    ${DATOS.momento3.roles.map(r => `
                        <option value="${r}">${r}</option>
                    `).join('')}
                </select>
            </div>

            <div class="form-grupo">
                <label>Nombre <span class="obligatorio">*</span></label>
                <input type="text" id="responsable-nombre" placeholder="Nombre completo">
            </div>

            <div class="form-grupo">
                <label>Correo (opcional)</label>
                <input type="email" id="responsable-correo" placeholder="correo@ejemplo.com">
            </div>
        `;

        btnAceptar.textContent = 'Asignar';
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
            const rol = document.getElementById('responsable-rol').value;
            const nombre = document.getElementById('responsable-nombre').value.trim();
            const correo = document.getElementById('responsable-correo').value.trim();

            if (!nombre) {
                alert('El nombre es obligatorio.');
                return;
            }

            ESTADO.asignarResponsable(actividadId, rol, nombre, correo);
            modal.style.display = 'none';
            APP.mostrarToast('Responsable asignado.', 'exito');
            renderizar();
        });
    }

    /* ========================================================
       MODAL: EDITAR RESPONSABLE
       ======================================================== */
    function abrirModalEditarResponsable(actividadId, rol) {
        const m3 = ESTADO.obtenerSeccion('momento3');
        const asignacion = m3.responsables.asignaciones.find(
            a => a.actividadId === actividadId && a.rol === rol
        );
        if (!asignacion) return;

        const modal = document.getElementById('modal-confirmacion');
        const titulo = document.getElementById('modal-titulo');
        const mensaje = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        titulo.textContent = 'Editar responsable';
        mensaje.innerHTML = `
            <div class="form-grupo">
                <label>Rol <span class="obligatorio">*</span></label>
                <select id="edit-responsable-rol">
                    ${DATOS.momento3.roles.map(r => `
                        <option value="${r}" ${asignacion.rol === r ? 'selected' : ''}>${r}</option>
                    `).join('')}
                </select>
            </div>

            <div class="form-grupo">
                <label>Nombre <span class="obligatorio">*</span></label>
                <input type="text" id="edit-responsable-nombre" value="${asignacion.nombre}">
            </div>

            <div class="form-grupo">
                <label>Correo (opcional)</label>
                <input type="email" id="edit-responsable-correo" value="${asignacion.correo || ''}">
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
            const nuevoRol = document.getElementById('edit-responsable-rol').value;
            const nombre = document.getElementById('edit-responsable-nombre').value.trim();
            const correo = document.getElementById('edit-responsable-correo').value.trim();

            if (!nombre) {
                alert('El nombre es obligatorio.');
                return;
            }

            // Si cambia el rol, eliminar el anterior y agregar el nuevo
            if (nuevoRol !== rol) {
                ESTADO.eliminarResponsable(actividadId, rol);
            }
            ESTADO.asignarResponsable(actividadId, nuevoRol, nombre, correo);
            modal.style.display = 'none';
            APP.mostrarToast('Responsable actualizado.', 'exito');
            renderizar();
        });
    }

    /* ========================================================
       CONFIRMAR ELIMINAR RESPONSABLE
       ======================================================== */
    function confirmarEliminarResponsable(actividadId, rol) {
        APP.mostrarModalConfirmacion(
            'Eliminar responsable',
            `¿Eliminar al responsable con rol "${rol}"?`,
            () => {
                ESTADO.eliminarResponsable(actividadId, rol);
                APP.mostrarToast('Responsable eliminado.', 'info');
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
