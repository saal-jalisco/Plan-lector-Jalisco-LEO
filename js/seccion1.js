/* ============================================================
   PLAN LECTOR JALISCO LEO
   seccion1.js — Sección 1: Identificación
   ============================================================ */

const SECCION1 = (function() {

    /* ========================================================
       REFERENCIAS AL DOM
       ======================================================== */
    let contenedor = null;

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-seccion-1');
        if (!contenedor) return;

        renderizar();
        suscribirCambios();
    }

    /* ========================================================
       RENDERIZAR FORMULARIO
       ======================================================== */
    function renderizar() {
        const id = ESTADO.obtenerSeccion('identificacion');

        contenedor.innerHTML = `
            <div class="form-seccion">

                <!-- ===== DATOS DE LA ESCUELA ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-school"></i> Datos de la escuela</h3>

                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="region">Región <span class="obligatorio">*</span></label>
                            <select id="region" data-campo="region">
                                <option value="">— Selecciona una región —</option>
                                ${DATOS.identificacion.regiones.map(r => `
                                    <option value="${r}" ${id.region === r ? 'selected' : ''}>${r}</option>
                                `).join('')}
                            </select>
                            <span class="error" id="error-region"></span>
                        </div>

                        <div class="form-grupo">
                            <label for="municipio">Municipio <span class="obligatorio">*</span></label>
                            <input type="text" id="municipio" data-campo="municipio"
                                   value="${id.municipio || ''}"
                                   placeholder="Ej. Guadalajara">
                            <span class="error" id="error-municipio"></span>
                        </div>
                    </div>

                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="cct">CCT <span class="obligatorio">*</span></label>
                            <input type="text" id="cct" data-campo="cct"
                                   value="${id.cct || ''}"
                                   placeholder="Ej. 14DPR0001A"
                                   maxlength="10"
                                   style="text-transform: uppercase;">
                            <span class="ayuda">Clave del Centro de Trabajo (10 caracteres).</span>
                            <span class="error" id="error-cct"></span>
                        </div>

                        <div class="form-grupo">
                            <label for="nombreEscuela">Nombre de la escuela <span class="obligatorio">*</span></label>
                            <input type="text" id="nombreEscuela" data-campo="nombreEscuela"
                                   value="${id.nombreEscuela || ''}"
                                   placeholder="Ej. Escuela Primaria Benito Juárez">
                            <span class="error" id="error-nombreEscuela"></span>
                        </div>
                    </div>

                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="turno">Turno <span class="obligatorio">*</span></label>
                            <select id="turno" data-campo="turno">
                                <option value="">— Selecciona —</option>
                                ${DATOS.identificacion.turnos.map(t => `
                                    <option value="${t}" ${id.turno === t ? 'selected' : ''}>${t}</option>
                                `).join('')}
                            </select>
                            <span class="error" id="error-turno"></span>
                        </div>

                        <div class="form-grupo">
                            <label for="nivel">Nivel educativo <span class="obligatorio">*</span></label>
                            <select id="nivel" data-campo="nivel">
                                <option value="">— Selecciona —</option>
                                ${DATOS.niveles.map(n => `
                                    <option value="${n.id}" ${id.nivel === n.id ? 'selected' : ''}>
                                        ${n.nombre} (${n.rango})
                                    </option>
                                `).join('')}
                            </select>
                            <span class="error" id="error-nivel"></span>
                        </div>
                    </div>

                    <div class="form-grupo" id="grupo-grados">
                        <label>Grados que atiende <span class="obligatorio">*</span></label>
                        <div class="opciones-grupo" id="grados-container">
                            <!-- Se llena dinámicamente según el nivel -->
                        </div>
                        <span class="error" id="error-grados"></span>
                    </div>

                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="numeroEstudiantes">Número de estudiantes <span class="obligatorio">*</span></label>
                            <input type="number" id="numeroEstudiantes" data-campo="numeroEstudiantes"
                                   value="${id.numeroEstudiantes || ''}"
                                   placeholder="Ej. 250" min="1">
                            <span class="error" id="error-numeroEstudiantes"></span>
                        </div>
                    </div>
                </div>

                <!-- ===== DATOS DEL PERSONAL ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-users"></i> Datos del personal</h3>

                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="director">Nombre del director(a) <span class="obligatorio">*</span></label>
                            <input type="text" id="director" data-campo="director"
                                   value="${id.director || ''}"
                                   placeholder="Nombre completo">
                            <span class="error" id="error-director"></span>
                        </div>

                        <div class="form-grupo">
                            <label for="atp">Nombre del ATP/supervisor</label>
                            <input type="text" id="atp" data-campo="atp"
                                   value="${id.atp || ''}"
                                   placeholder="Nombre completo (opcional)">
                        </div>
                    </div>

                    <div class="form-fila">
                        <div class="form-grupo">
                            <label for="fechaCTE">Fecha del CTE <span class="obligatorio">*</span></label>
                            <input type="date" id="fechaCTE" data-campo="fechaCTE"
                                   value="${id.fechaCTE || ''}">
                            <span class="error" id="error-fechaCTE"></span>
                        </div>
                    </div>
                </div>

                <!-- ===== MODO DE LLENADO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-pen-to-square"></i> Modo de llenado <span class="obligatorio">*</span></h3>
                    <p class="ayuda" style="margin-bottom: 0.75rem;">
                        Indica cómo se llenará este diagnóstico.
                    </p>

                    <div class="opciones-grupo" id="modo-llenado-container">
                        ${DATOS.identificacion.modosLlenado.map(m => `
                            <label class="opcion ${id.modoLlenado === m.id ? 'seleccionada' : ''}"
                                   data-modo="${m.id}">
                                <input type="radio" name="modoLlenado" value="${m.id}"
                                       ${id.modoLlenado === m.id ? 'checked' : ''}>
                                <div>
                                    <strong>${m.nombre}</strong>
                                    <span class="ayuda" style="display:block;">${m.descripcion}</span>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                    <span class="error" id="error-modoLlenado"></span>
                </div>

                <!-- ===== RESUMEN DE COMPLETADO ===== -->
                <div class="caja-info" id="resumen-seccion1">
                    <i class="fas fa-info-circle"></i>
                    Completa todos los campos obligatorios para continuar.
                </div>

            </div>
        `;

        // Renderizar grados según el nivel actual
        renderizarGrados(id.nivel, id.grados);

        // Suscribir eventos
        suscribirEventos();
    }

    /* ========================================================
       RENDERIZAR GRADOS SEGÚN NIVEL
       ======================================================== */
    function renderizarGrados(nivelId, gradosSeleccionados = []) {
        const container = document.getElementById('grados-container');
        if (!container) return;

        // Buscar el nivel en DATOS.niveles
        const nivel = DATOS.niveles.find(n => n.id === nivelId);

        if (!nivel) {
            container.innerHTML = `<p class="ayuda">Selecciona primero el nivel educativo.</p>`;
            return;
        }

        container.innerHTML = nivel.grados.map(g => `
            <label class="opcion ${gradosSeleccionados.includes(g) ? 'seleccionada' : ''}">
                <input type="checkbox" name="grados" value="${g}"
                       ${gradosSeleccionados.includes(g) ? 'checked' : ''}>
                ${g}
            </label>
        `).join('');
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Inputs y selects
        contenedor.querySelectorAll('[data-campo]').forEach(el => {
            el.addEventListener('input', manejarCambio);
            el.addEventListener('change', manejarCambio);
        });

        // Nivel → re-renderizar grados
        const nivelSelect = document.getElementById('nivel');
        if (nivelSelect) {
            nivelSelect.addEventListener('change', (e) => {
                const nivel = e.target.value;
                ESTADO.actualizarCampo('identificacion', 'nivel', nivel);
                ESTADO.actualizarCampo('identificacion', 'grados', []);
                renderizarGrados(nivel, []);
                validar();
            });
        }

        // Grados (checkboxes)
        contenedor.addEventListener('change', (e) => {
            if (e.target.name === 'grados') {
                const seleccionados = Array.from(
                    contenedor.querySelectorAll('input[name="grados"]:checked')
                ).map(cb => cb.value);
                ESTADO.actualizarCampo('identificacion', 'grados', seleccionados);
                // Actualizar clases visuales
                contenedor.querySelectorAll('input[name="grados"]').forEach(cb => {
                    cb.closest('.opcion').classList.toggle('seleccionada', cb.checked);
                });
                validar();
            }
        });

        // Modo de llenado (radios)
        contenedor.querySelectorAll('input[name="modoLlenado"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                ESTADO.actualizarCampo('identificacion', 'modoLlenado', e.target.value);
                contenedor.querySelectorAll('.opcion[data-modo]').forEach(op => {
                    op.classList.toggle('seleccionada', op.dataset.modo === e.target.value);
                });
                validar();
            });
        });
    }

    /* ========================================================
       MANEJAR CAMBIO DE CAMPO
       ======================================================== */
    function manejarCambio(e) {
        const campo = e.target.dataset.campo;
        if (!campo) return;

        let valor = e.target.value;
        if (campo === 'cct') valor = valor.toUpperCase();
        if (campo === 'numeroEstudiantes') valor = valor ? parseInt(valor, 10) : '';

        ESTADO.actualizarCampo('identificacion', campo, valor);
        validar();
    }

    /* ========================================================
       VALIDACIÓN
       ======================================================== */
    function validar() {
        const id = ESTADO.obtenerSeccion('identificacion');
        const errores = {};

        // Campos obligatorios
        if (!id.region) errores.region = 'Selecciona una región.';
        if (!id.municipio) errores.municipio = 'Ingresa el municipio.';
        if (!id.cct) errores.cct = 'Ingresa la CCT.';
        else if (id.cct.length !== 10) errores.cct = 'La CCT debe tener 10 caracteres.';
        if (!id.nombreEscuela) errores.nombreEscuela = 'Ingresa el nombre de la escuela.';
        if (!id.turno) errores.turno = 'Selecciona el turno.';
        if (!id.nivel) errores.nivel = 'Selecciona el nivel educativo.';
        if (!id.grados || id.grados.length === 0) errores.grados = 'Selecciona al menos un grado.';
        if (!id.numeroEstudiantes) errores.numeroEstudiantes = 'Ingresa el número de estudiantes.';
        else if (id.numeroEstudiantes < 1) errores.numeroEstudiantes = 'Debe ser mayor a 0.';
        if (!id.director) errores.director = 'Ingresa el nombre del director(a).';
        if (!id.fechaCTE) errores.fechaCTE = 'Selecciona la fecha del CTE.';
        if (!id.modoLlenado) errores.modoLlenado = 'Selecciona el modo de llenado.';

        // Mostrar errores
        Object.keys(errores).forEach(campo => {
            const errorEl = document.getElementById(`error-${campo}`);
            if (errorEl) errorEl.textContent = errores[campo];
        });

        // Limpiar errores que ya no aplican
        Object.keys(id).forEach(campo => {
            if (!errores[campo]) {
                const errorEl = document.getElementById(`error-${campo}`);
                if (errorEl) errorEl.textContent = '';
            }
        });

        // Actualizar resumen
        const resumen = document.getElementById('resumen-seccion1');
        if (resumen) {
            const completo = Object.keys(errores).length === 0;
            if (completo) {
                resumen.className = 'caja-exito';
                resumen.innerHTML = '<i class="fas fa-check-circle"></i> Sección completa. Puedes continuar.';
            } else {
                resumen.className = 'caja-info';
                resumen.innerHTML = `<i class="fas fa-info-circle"></i> Faltan ${Object.keys(errores).length} campo(s) por completar.`;
            }
        }

        // Notificar a la app
        ESTADO.notificar('seccion1Validada', {
            completa: Object.keys(errores).length === 0,
            errores
        });

        return Object.keys(errores).length === 0;
    }

    /* ========================================================
       SUSCRIBIR CAMBIOS EXTERNOS
       ======================================================== */
    function suscribirCambios() {
        ESTADO.suscribir((evento, datos) => {
            if (evento === 'reiniciado' || evento === 'borradorCargado' || evento === 'importado') {
                renderizar();
            }
        });
    }

    /* ========================================================
       INICIALIZACIÓN AUTOMÁTICA
       ======================================================== */
    document.addEventListener('DOMContentLoaded', init);

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        init,
        renderizar,
        validar
    };

})();
