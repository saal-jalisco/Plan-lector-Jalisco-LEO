/* ============================================================
   TERMÓMETRO LECTOR · JALISCO LEO
   seccion3.js — Sección 3: Diagnóstico SAAL
   ============================================================ */

const SECCION3 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;

    const UMBRAL_CRITICO = 30;
    const UMBRAL_ALERTA = 50;

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-seccion-3');
        if (!contenedor) return;

        renderizar();
        suscribirCambios();
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar() {
        const saal = ESTADO.obtenerSeccion('saal');
        const id = ESTADO.obtenerSeccion('identificacion');
        const nivel = id.nivel || '';
        const grados = id.grados || [];

        contenedor.innerHTML = `
            <div class="form-seccion">

                <!-- ===== ¿TIENES SAAL? ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-circle-question"></i> ¿Tienes SAAL?</h3>

                    <div class="opciones-grupo" id="tiene-saal-container">
                        <label class="opcion ${saal.tieneSAAL === 'si' ? 'seleccionada' : ''}">
                            <input type="radio" name="tieneSAAL" value="si" ${saal.tieneSAAL === 'si' ? 'checked' : ''}>
                            Sí, tengo fichas diagnósticas
                        </label>
                        <label class="opcion ${saal.tieneSAAL === 'no' ? 'seleccionada' : ''}">
                            <input type="radio" name="tieneSAAL" value="no" ${saal.tieneSAAL === 'no' ? 'checked' : ''}>
                            No, pero tengo otros diagnósticos
                        </label>
                        <label class="opcion ${saal.tieneSAAL === 'otros' ? 'seleccionada' : ''}">
                            <input type="radio" name="tieneSAAL" value="otros" ${saal.tieneSAAL === 'otros' ? 'checked' : ''}>
                            No tengo diagnósticos aún
                        </label>
                    </div>

                    <div id="otros-diagnosticos-container" class="mt-2 ${saal.tieneSAAL === 'no' ? '' : 'oculto'}">
                        <div class="form-grupo">
                            <label>¿Qué otros diagnósticos tienes?</label>
                            <textarea id="otrosDiagnosticos" placeholder="Describe brevemente...">${saal.otrosDiagnosticos || ''}</textarea>
                        </div>
                    </div>

                    <div id="mensaje-sin-saal" class="caja-info mt-2 ${saal.tieneSAAL === 'otros' ? '' : 'oculto'}">
                        <i class="fas fa-lightbulb"></i>
                        <strong>No hay problema.</strong> Puedes continuar con el Termómetro sin SAAL.
                        El semáforo tendrá 12 dimensiones (en lugar de 18) basadas en Voces del Ecosistema.
                    </div>
                </div>

                <!-- ===== RESTO DE SECCIÓN (solo si tiene SAAL) ===== -->
                <div id="contenido-saal" class="${saal.tieneSAAL === 'si' ? '' : 'oculto'}">

                    <!-- ===== RESUMEN POR GRADO ===== -->
                    <div class="form-bloque">
                        <h3><i class="fas fa-list-check"></i> Resumen por grado</h3>
                        <p class="ayuda">Agrega un bloque por grado/grupo evaluado con SAAL.</p>

                        <div id="lista-saal-grados">
                            ${renderizarResumenGrados(grados, saal.resumenGrados)}
                        </div>

                        <button type="button" class="btn btn-naranja" id="btn-agregar-saal-grado">
                            <i class="fas fa-plus"></i> Agregar grupo SAAL
                        </button>
                    </div>

                    <!-- ===== COMPONENTES DÉBILES ===== -->
                    <div class="form-bloque">
                        <h3><i class="fas fa-triangle-exclamation"></i> Componentes débiles</h3>
                        <p class="ayuda">
                            Ingresa el % de estudiantes en 🔴 Atención prioritaria por componente.
                            <br><strong>Umbral crítico: 30%</strong> · <strong>Alerta: &gt;50%</strong>
                        </p>

                        <div id="lista-componentes">
                            ${renderizarComponentes(nivel, saal.componentesDebiles)}
                        </div>
                    </div>

                    <!-- ===== ALINEACIÓN ===== -->
                    <div class="form-bloque">
                        <h3><i class="fas fa-diagram-project"></i> Alineación SAAL ↔ Jalisco Avanza ↔ Rutas LEO</h3>
                        <div class="tabla-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Componente SAAL</th>
                                        <th>UA Jalisco Avanza</th>
                                        <th>Ruta LEO sugerida</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${DATOS.alineacion.map(a => `
                                        <tr>
                                            <td><strong>${a.componenteSAAL}</strong></td>
                                            <td>${a.uaJaliscoAvanza}</td>
                                            <td>${a.rutaLEO}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- ===== OBSERVACIONES ===== -->
                    <div class="form-bloque">
                        <h3><i class="fas fa-comment-dots"></i> Observaciones SAAL</h3>
                        <div class="form-grupo">
                            <textarea id="observaciones-saal" placeholder="Escribe 3 o 4 enunciados máximo..." maxlength="600">${saal.observaciones || ''}</textarea>
                        </div>
                    </div>

                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-info" id="resumen-seccion3">
                    <i class="fas fa-info-circle"></i>
                    Sección opcional. Puedes continuar sin llenarla.
                </div>

            </div>
        `;

        suscribirEventos();
        validar();
    }

    /* ========================================================
       RENDERIZAR RESUMEN POR GRADO
       ======================================================== */
    function renderizarResumenGrados(grados, resumenGrados) {
        if (!resumenGrados || resumenGrados.length === 0) {
            return `<p class="ayuda">Aún no has agregado grupos SAAL.</p>`;
        }

        return resumenGrados.map((d, i) => `
            <div class="tarjeta" data-index="${i}">
                <div class="flex-between mb-2">
                    <h4 style="margin:0;">
                        <i class="fas fa-users"></i> ${d.grado}${d.grupo ? ' · ' + d.grupo : ''}
                    </h4>
                    <button type="button" class="btn btn-peligro btn-sm btn-eliminar-saal" data-index="${i}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>

                <div class="form-fila">
                    <div class="form-grupo">
                        <label>Grado</label>
                        <select class="select-saal-grado" data-index="${i}" data-campo="grado">
                            ${grados.map(g => `<option value="${g}" ${d.grado === g ? 'selected' : ''}>${g}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-grupo">
                        <label>Grupo</label>
                        <input type="text" class="input-saal-grupo" data-index="${i}" data-campo="grupo"
                               value="${d.grupo || ''}" placeholder="Ej. A" maxlength="2"
                               style="text-transform: uppercase;">
                    </div>
                    <div class="form-grupo">
                        <label>Núm. evaluados</label>
                        <input type="number" class="input-saal-evaluados" data-index="${i}" data-campo="evaluados"
                               value="${d.evaluados || ''}" min="0">
                    </div>
                </div>

                <div class="form-fila">
                    <div class="form-grupo">
                        <label>🟢 Deseable</label>
                        <input type="number" class="input-saal-deseable" data-index="${i}" data-campo="deseable"
                               value="${d.deseable || ''}" min="0">
                    </div>
                    <div class="form-grupo">
                        <label>🟡 En progreso</label>
                        <input type="number" class="input-saal-progreso" data-index="${i}" data-campo="enProgreso"
                               value="${d.enProgreso || ''}" min="0">
                    </div>
                    <div class="form-grupo">
                        <label>🔴 Atención prioritaria</label>
                        <input type="number" class="input-saal-atencion" data-index="${i}" data-campo="atencionPrioritaria"
                               value="${d.atencionPrioritaria || ''}" min="0">
                    </div>
                </div>

                <div class="validacion-saal" id="validacion-saal-${i}"></div>
            </div>
        `).join('');
    }

    /* ========================================================
       RENDERIZAR COMPONENTES
       ======================================================== */
    function renderizarComponentes(nivel, componentesDebiles) {
        // Determinar qué componentes aplican
        let componentes = DATOS.componentesSAAL.todos;
        // Si es 1° o 2° primaria, solo fluidez y comprensión
        // (esto se puede afinar si se tiene el grado específico)

        return `
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Componente</th>
                            <th>% Atención prioritaria</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${componentes.map(c => {
                            const valor = componentesDebiles[c.id] || '';
                            const estado = calcularEstadoComponente(valor);
                            return `
                                <tr>
                                    <td>
                                        <strong>${c.nombre}</strong>
                                        <br><span class="ayuda">${c.descripcion}</span>
                                    </td>
                                    <td>
                                        <input type="number" class="input-componente"
                                               data-componente="${c.id}"
                                               value="${valor}"
                                               min="0" max="100" step="0.1"
                                               style="width:100px;">
                                    </td>
                                    <td>${estado}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function calcularEstadoComponente(valor) {
        if (valor === '' || valor === null || valor === undefined) {
            return `<span class="chip">Sin dato</span>`;
        }
        const v = parseFloat(valor);
        if (v > UMBRAL_ALERTA) {
            return `<span class="chip rojo"><i class="fas fa-exclamation-triangle"></i> ALERTA &gt;50%</span>`;
        }
        if (v >= UMBRAL_CRITICO) {
            return `<span class="chip rojo"><i class="fas fa-circle-exclamation"></i> CRÍTICO</span>`;
        }
        return `<span class="chip verde"><i class="fas fa-check"></i> OK</span>`;
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Radio: ¿Tienes SAAL?
        contenedor.querySelectorAll('input[name="tieneSAAL"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const valor = e.target.value;
                ESTADO.actualizarCampo('saal', 'tieneSAAL', valor);
                renderizar();
            });
        });

        // Otros diagnósticos
        const otros = document.getElementById('otrosDiagnosticos');
        if (otros) {
            otros.addEventListener('input', (e) => {
                ESTADO.actualizarCampo('saal', 'otrosDiagnosticos', e.target.value);
            });
        }

        // Agregar grupo SAAL
        const btnAgregar = document.getElementById('btn-agregar-saal-grado');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', agregarGrupoSAAL);
        }

        // Eliminar grupo SAAL
        contenedor.querySelectorAll('.btn-eliminar-saal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index, 10);
                eliminarGrupoSAAL(index);
            });
        });

        // Inputs de grupos SAAL
        contenedor.querySelectorAll('[data-index][data-campo]').forEach(el => {
            el.addEventListener('input', manejarCambioGrupoSAAL);
            el.addEventListener('change', manejarCambioGrupoSAAL);
        });

        // Componentes
        contenedor.querySelectorAll('.input-componente').forEach(el => {
            el.addEventListener('input', (e) => {
                const id = e.target.dataset.componente;
                const valor = e.target.value === '' ? '' : parseFloat(e.target.value);
                const saal = ESTADO.obtenerSeccion('saal');
                const nuevos = { ...saal.componentesDebiles, [id]: valor };
                ESTADO.actualizarCampo('saal', 'componentesDebiles', nuevos);
                // Re-renderizar solo la celda de estado
                const td = e.target.closest('tr').querySelector('td:last-child');
                if (td) td.innerHTML = calcularEstadoComponente(valor);
            });
        });

        // Observaciones SAAL
        const obs = document.getElementById('observaciones-saal');
        if (obs) {
            obs.addEventListener('input', (e) => {
                ESTADO.actualizarCampo('saal', 'observaciones', e.target.value);
            });
        }
    }

    /* ========================================================
       AGREGAR / ELIMINAR GRUPO SAAL
       ======================================================== */
    function agregarGrupoSAAL() {
        const id = ESTADO.obtenerSeccion('identificacion');
        const saal = ESTADO.obtenerSeccion('saal');
        const grados = id.grados || [];

        if (grados.length === 0) {
            alert('Primero selecciona grados en la Sección 1.');
            return;
        }

        const nuevo = {
            grado: grados[0],
            grupo: '',
            evaluados: '',
            deseable: '',
            enProgreso: '',
            atencionPrioritaria: ''
        };

        const nuevos = [...(saal.resumenGrados || []), nuevo];
        ESTADO.actualizarCampo('saal', 'resumenGrados', nuevos);
        renderizar();
    }

    function eliminarGrupoSAAL(index) {
        const saal = ESTADO.obtenerSeccion('saal');
        const nuevos = saal.resumenGrados.filter((_, i) => i !== index);
        ESTADO.actualizarCampo('saal', 'resumenGrados', nuevos);
        renderizar();
    }

    /* ========================================================
       MANEJAR CAMBIO EN GRUPO SAAL
       ======================================================== */
    function manejarCambioGrupoSAAL(e) {
        const index = parseInt(e.target.dataset.index, 10);
        const campo = e.target.dataset.campo;
        let valor = e.target.value;

        if (campo === 'grupo') valor = valor.toUpperCase();
        if (['evaluados', 'deseable', 'enProgreso', 'atencionPrioritaria'].includes(campo)) {
            valor = valor === '' ? '' : parseInt(valor, 10);
        }

        const saal = ESTADO.obtenerSeccion('saal');
        const nuevos = [...saal.resumenGrados];
        nuevos[index] = { ...nuevos[index], [campo]: valor };
        ESTADO.actualizarCampo('saal', 'resumenGrados', nuevos);

        validarSumaSAAL(index, nuevos[index]);
    }

    /* ========================================================
       VALIDAR SUMA SAAL
       ======================================================== */
    function validarSumaSAAL(index, datos) {
        const el = document.getElementById(`validacion-saal-${index}`);
        if (!el) return;

        const evaluados = parseInt(datos.evaluados) || 0;
        const suma = (parseInt(datos.deseable) || 0) +
                     (parseInt(datos.enProgreso) || 0) +
                     (parseInt(datos.atencionPrioritaria) || 0);

        if (evaluados === 0 && suma === 0) {
            el.innerHTML = '';
            return;
        }

        if (suma === evaluados) {
            el.innerHTML = `<span class="chip verde"><i class="fas fa-check"></i> Suma: ${suma} / ${evaluados}</span>`;
        } else {
            el.innerHTML = `<span class="chip rojo"><i class="fas fa-exclamation-triangle"></i> Suma: ${suma} / ${evaluados} (debe coincidir)</span>`;
        }
    }

    /* ========================================================
       VALIDAR SECCIÓN
       ======================================================== */
    function validar() {
        const saal = ESTADO.obtenerSeccion('saal');
        const resumen = document.getElementById('resumen-seccion3');
        if (!resumen) return false;

        if (saal.tieneSAAL === 'si') {
            const tieneGrupos = saal.resumenGrados && saal.resumenGrados.length > 0;
            const tieneComponentes = Object.keys(saal.componentesDebiles || {}).length > 0;

            if (tieneGrupos && tieneComponentes) {
                resumen.className = 'caja-exito';
                resumen.innerHTML = '<i class="fas fa-check-circle"></i> Sección SAAL completa.';
                ESTADO.notificar('seccion3Validada', { completa: true });
                return true;
            } else {
                resumen.className = 'caja-info';
                resumen.innerHTML = '<i class="fas fa-info-circle"></i> Completa el resumen por grado y los componentes.';
                ESTADO.notificar('seccion3Validada', { completa: false });
                return false;
            }
        } else {
            resumen.className = 'caja-info';
            resumen.innerHTML = '<i class="fas fa-info-circle"></i> Sección opcional. Puedes continuar sin llenarla.';
            ESTADO.notificar('seccion3Validada', { completa: true }); // opcional = válida
            return true;
        }
    }

    /* ========================================================
       SUSCRIBIR CAMBIOS EXTERNOS
       ======================================================== */
    function suscribirCambios() {
        ESTADO.suscribir((evento) => {
            if (evento === 'reiniciado' || evento === 'borradorCargado' || evento === 'importado') {
                renderizar();
            }
        });
    }

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    document.addEventListener('DOMContentLoaded', init);

    return { init, renderizar, validar };

})();
if (typeof window !== 'undefined') {
    window.SECCION1 = SECCION1;
}
