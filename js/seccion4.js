/* ============================================================
   TERMÓMETRO LECTOR · JALISCO LEO
   seccion4.js — Sección 4: Voces del Ecosistema
   v2.0 — Auto-cálculo de síntesis faltantes
   ============================================================ */

const SECCION4 = (function() {

    let contenedor = null;

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-seccion-4');
        if (!contenedor) return;

        renderizar();
        suscribirCambios();
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar() {
        const v = ESTADO.obtenerSeccion('voces');

        contenedor.innerHTML = `
            <div class="form-seccion">

                <!-- ===== MENSAJE RECORDATORIO ===== -->
                <div class="caja-info">
                    <i class="fas fa-lightbulb"></i>
                    <strong>Sección omitible.</strong> Puedes llenarla ahora o en la siguiente ocasión.
                    Si la omites, el Termómetro tendrá 12 dimensiones (en lugar de 18).
                </div>

                <!-- ===== VOCES DE ESTUDIANTES ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-children"></i> Voces de estudiantes</h3>
                    ${renderizarPreguntas('estudiantes', DATOS.voces.estudiantes, v.estudiantes)}
                </div>

                <!-- ===== VOCES DE FAMILIAS ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-people-roof"></i> Voces de familias</h3>
                    ${renderizarPreguntas('familias', DATOS.voces.familias, v.familias)}
                </div>

                <!-- ===== VOCES DE DOCENTES ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-chalkboard-user"></i> Voces de docentes</h3>
                    ${renderizarPreguntas('docentes', DATOS.voces.docentes, v.docentes)}
                </div>

                <!-- ===== SÍNTESIS DEL ECOSISTEMA ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-layer-group"></i> Síntesis del ecosistema</h3>
                    <p class="ayuda">
                        Semáforo por dimensión. Puedes ajustarlo manualmente.
                    </p>
                    ${renderizarSintesis(v)}
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-info" id="resumen-seccion4">
                    <i class="fas fa-info-circle"></i>
                    Sección opcional. Puedes continuar sin llenarla.
                </div>

            </div>
        `;

        suscribirEventos();
        validar();
        // 👇 NUEVO: recalcular síntesis que falten a partir de las respuestas
        recalcularSintesisFaltantes();
    }

    /* ========================================================
       RENDERIZAR PREGUNTAS
       ======================================================== */
    function renderizarPreguntas(grupo, preguntas, respuestas) {
        return preguntas.map(p => {
            const valor = respuestas[p.id] || '';
            return `
                <div class="pregunta-voz" data-pregunta="${p.id}" data-grupo="${grupo}">
                    <label class="pregunta-label">${p.pregunta}</label>
                    <div class="opciones-grupo">
                        ${p.opciones.map(op => {
                            const seleccionada = p.multiple
                                ? (Array.isArray(valor) && valor.includes(op))
                                : (valor === op);
                            return `
                                <label class="opcion ${seleccionada ? 'seleccionada' : ''}">
                                    <input type="${p.multiple ? 'checkbox' : 'radio'}"
                                           name="${grupo}-${p.id}"
                                           value="${op}"
                                           ${seleccionada ? 'checked' : ''}>
                                    ${op}
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ========================================================
       RENDERIZAR SÍNTESIS
       ======================================================== */
    function renderizarSintesis(v) {
        const sintesis = v.sintesis || {};
        const dimensionesVoces = DATOS.dimensiones.filter(d => d.grupo === 'Voces');

        const coloresInline = {
            verde: '#2E9E5B',
            amarillo: '#E8B93B',
            rojo: '#D93B3B',
        };

        return `
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Dimensión</th>
                            <th>Fuente</th>
                            <th>Semáforo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dimensionesVoces.map(d => {
                            const color = sintesis[d.id] || '';
                            return `
                                <tr>
                                    <td><strong>${d.nombre}</strong></td>
                                    <td><span class="chip">${d.fuente}</span></td>
                                    <td>
                                        <div class="selector-semaforo" data-dimension="${d.id}"
                                             style="display:inline-flex; gap:0.5rem; align-items:center;">
                                            ${['verde', 'amarillo', 'rojo'].map(c => `
                                                <label class="semaforo-opcion ${color === c ? 'seleccionada' : ''}"
                                                       style="
                                                           display:inline-flex;
                                                           align-items:center;
                                                           justify-content:center;
                                                           cursor:pointer;
                                                           padding:0.3rem;
                                                           border-radius:50%;
                                                           border:2px solid ${color === c ? '#4A4A4A' : 'transparent'};
                                                           background:${color === c ? 'rgba(0,0,0,0.05)' : 'transparent'};
                                                       ">
                                                    <input type="radio" name="sintesis-${d.id}" value="${c}"
                                                           ${color === c ? 'checked' : ''}
                                                           style="display:none;">
                                                    <span style="
                                                        display:inline-block;
                                                        width:22px;
                                                        height:22px;
                                                        border-radius:50%;
                                                        background:${coloresInline[c]};
                                                        border:2px solid rgba(0,0,0,0.08);
                                                        ${color === c ? 'transform:scale(1.15); box-shadow:0 0 0 3px rgba(0,0,0,0.1);' : ''}
                                                    "></span>
                                                </label>
                                            `).join('')}
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /* ========================================================
       AUTO-CÁLCULO DE SÍNTESIS FALTANTES
       Si hay respuestas pero no hay síntesis para esa dimensión,
       se calcula automáticamente sin disparar re-render.
       ======================================================== */
    function recalcularSintesisFaltantes() {
        const v = ESTADO.obtenerSeccion('voces');
        const sintesis = { ...(v.sintesis || {}) };
        let cambios = false;

        ['estudiantes', 'familias', 'docentes'].forEach(grupo => {
            const preguntas = DATOS.voces[grupo] || [];
            const respuestas = v[grupo] || {};

            preguntas.forEach(p => {
                if (!p.dimension) return;
                if (sintesis[p.dimension]) return;  // ya tiene valor, respetar

                const valor = respuestas[p.id];
                if (!valor || (Array.isArray(valor) && valor.length === 0)) return;

                const color = calcularColorDesdeRespuesta(p, valor);
                if (color) {
                    sintesis[p.dimension] = color;
                    cambios = true;
                }
            });
        });

        if (!cambios) return;

        ESTADO.actualizarSeccion('voces', { sintesis });

        // Actualizar el DOM directamente (sin re-renderizar todo)
        Object.keys(sintesis).forEach(dimId => {
            const selector = contenedor.querySelector(`.selector-semaforo[data-dimension="${dimId}"]`);
            if (!selector) return;
            const color = sintesis[dimId];
            selector.querySelectorAll('.semaforo-opcion').forEach(op => {
                const inp = op.querySelector('input');
                const activo = inp.value === color;
                inp.checked = activo;
                op.classList.toggle('seleccionada', activo);
                op.style.border = `2px solid ${activo ? '#4A4A4A' : 'transparent'}`;
                op.style.background = activo ? 'rgba(0,0,0,0.05)' : 'transparent';
                const dot = op.querySelector('span');
                if (dot) {
                    dot.style.transform = activo ? 'scale(1.15)' : 'scale(1)';
                    dot.style.boxShadow = activo ? '0 0 0 3px rgba(0,0,0,0.1)' : 'none';
                }
            });
        });

        console.log('✅ SECCION4: síntesis recalculadas automáticamente');
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        contenedor.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', manejarRespuesta);
        });

        contenedor.querySelectorAll('.selector-semaforo input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', manejarSintesis);
        });
    }

    /* ========================================================
       MANEJAR RESPUESTA
       ======================================================== */
    function manejarRespuesta(e) {
        const input = e.target;
        const name = input.name;

        if (name.startsWith('sintesis-')) return;

        const [grupo, preguntaId] = name.split('-');

        const v = ESTADO.obtenerSeccion('voces');
        const respuestasGrupo = { ...(v[grupo] || {}) };

        const preguntaDef = DATOS.voces[grupo]?.find(p => p.id === preguntaId);
        if (!preguntaDef) return;

        if (preguntaDef.multiple) {
            const seleccionados = Array.from(
                contenedor.querySelectorAll(`input[name="${name}"]:checked`)
            ).map(cb => cb.value);
            respuestasGrupo[preguntaId] = seleccionados;
        } else {
            respuestasGrupo[preguntaId] = input.value;
        }

        ESTADO.actualizarSeccion('voces', { [grupo]: respuestasGrupo });

        const preguntaEl = contenedor.querySelector(`[data-pregunta="${preguntaId}"][data-grupo="${grupo}"]`);
        if (preguntaEl) {
            preguntaEl.querySelectorAll('.opcion').forEach(op => {
                const inp = op.querySelector('input');
                op.classList.toggle('seleccionada', inp.checked);
            });
        }

        sugerirSintesis(grupo, preguntaId, respuestasGrupo[preguntaId]);
        validar();
    }

    /* ========================================================
       MANEJAR SÍNTESIS (edición manual)
       ======================================================== */
    function manejarSintesis(e) {
        const dimension = e.target.name.replace('sintesis-', '');
        const color = e.target.value;

        const v = ESTADO.obtenerSeccion('voces');
        const nuevaSintesis = { ...(v.sintesis || {}), [dimension]: color };
        ESTADO.actualizarSeccion('voces', { sintesis: nuevaSintesis });

        const selector = contenedor.querySelector(`.selector-semaforo[data-dimension="${dimension}"]`);
        if (selector) {
            selector.querySelectorAll('.semaforo-opcion').forEach(op => {
                const inp = op.querySelector('input');
                op.classList.toggle('seleccionada', inp.checked);
                op.style.border = `2px solid ${inp.checked ? '#4A4A4A' : 'transparent'}`;
                op.style.background = inp.checked ? 'rgba(0,0,0,0.05)' : 'transparent';
                const dot = op.querySelector('span');
                if (dot) {
                    dot.style.transform = inp.checked ? 'scale(1.15)' : 'scale(1)';
                    dot.style.boxShadow = inp.checked ? '0 0 0 3px rgba(0,0,0,0.1)' : 'none';
                }
            });
        }

        validar();
    }

    /* ========================================================
       SUGERIR SÍNTESIS AUTOMÁTICA
       ======================================================== */
    function sugerirSintesis(grupo, preguntaId, valor) {
        const preguntaDef = DATOS.voces[grupo]?.find(p => p.id === preguntaId);
        if (!preguntaDef || !preguntaDef.dimension) return;

        const v = ESTADO.obtenerSeccion('voces');
        if (v.sintesis && v.sintesis[preguntaDef.dimension]) return;

        const color = calcularColorDesdeRespuesta(preguntaDef, valor);
        if (color) {
            const nuevaSintesis = { ...(v.sintesis || {}), [preguntaDef.dimension]: color };
            ESTADO.actualizarSeccion('voces', { sintesis: nuevaSintesis });

            const selector = contenedor.querySelector(`.selector-semaforo[data-dimension="${preguntaDef.dimension}"]`);
            if (selector) {
                selector.querySelectorAll('.semaforo-opcion').forEach(op => {
                    const inp = op.querySelector('input');
                    inp.checked = inp.value === color;
                    op.classList.toggle('seleccionada', inp.checked);
                });
            }
        }
    }

    /* ========================================================
       CALCULAR COLOR DESDE RESPUESTA
       ======================================================== */
    function calcularColorDesdeRespuesta(preguntaDef, valor) {
        if (!valor || (Array.isArray(valor) && valor.length === 0)) return null;

        const opciones = preguntaDef.opciones;
        const numOpciones = opciones.length;

        if (!preguntaDef.multiple) {
            const index = opciones.indexOf(valor);
            if (index === -1) return null;
            const ratio = index / (numOpciones - 1);
            if (ratio <= 0.33) return 'verde';
            if (ratio <= 0.66) return 'amarillo';
            return 'rojo';
        }

        const seleccionadas = valor.length;
        if (seleccionadas === 0) return null;
        const ratio = seleccionadas / numOpciones;
        if (ratio >= 0.5) return 'verde';
        if (ratio >= 0.25) return 'amarillo';
        return 'rojo';
    }

    /* ========================================================
       VALIDAR SECCIÓN
       ======================================================== */
    function validar() {
        const v = ESTADO.obtenerSeccion('voces');
        const resumen = document.getElementById('resumen-seccion4');
        if (!resumen) return false;

        const tieneEstudiantes = Object.keys(v.estudiantes || {}).length > 0;
        const tieneFamilias = Object.keys(v.familias || {}).length > 0;
        const tieneDocentes = Object.keys(v.docentes || {}).length > 0;
        const tieneSintesis = Object.keys(v.sintesis || {}).length > 0;

        const completa = tieneEstudiantes || tieneFamilias || tieneDocentes || tieneSintesis;

        if (completa) {
            resumen.className = 'caja-exito';
            resumen.innerHTML = '<i class="fas fa-check-circle"></i> Sección completa.';
        } else {
            resumen.className = 'caja-info';
            resumen.innerHTML = '<i class="fas fa-info-circle"></i> Sección opcional. Puedes continuar sin llenarla.';
        }

        ESTADO.notificar('seccion4Validada', { completa: true });
        return true;
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
    window.SECCION4 = SECCION4;
    console.log('✅ SECCION4 expuesto en window (v2.0)');
}
