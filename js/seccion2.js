/* ============================================================
   TERMÓMETRO LECTOR · JALISCO LEO
   seccion2.js — Sección 2: Línea Base
   ============================================================ */

const SECCION2 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-seccion-2');
        if (!contenedor) return;

        renderizar();
        suscribirCambios();
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar() {
        const id = ESTADO.obtenerSeccion('identificacion');
        const lb = ESTADO.obtenerSeccion('lineaBase');

        const nivel = id.nivel || '';
        const grados = id.grados || [];

        contenedor.innerHTML = `
            <div class="form-seccion">

                <!-- ===== REFERENCIA ESTATAL ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-chart-bar"></i> Referencia estatal Jalisco Avanza 2025</h3>
                    <p class="ayuda">Datos precargados. Solo lectura.</p>

                    ${renderizarReferenciaEstatal(nivel, grados)}
                </div>

                <!-- ===== DATOS DE LA ESCUELA ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-school"></i> Tu escuela</h3>
                    <p class="ayuda">
                        Consulta los resultados en
                        <a href="https://apprende.jalisco.gob.mx/direccion-evaluacion-educativa/resultados-evaluaciones/"
                           target="_blank" rel="noopener">
                            Apprende Jalisco <i class="fas fa-external-link-alt"></i>
                        </a>
                        e ingresa la <strong>cantidad de alumnos</strong> en cada nivel.
                    </p>

                    <div id="lista-grados-escuela">
                        ${renderizarGradosEscuela(nivel, grados, lb.datosEscuela)}
                    </div>

                    <button type="button" class="btn btn-naranja" id="btn-agregar-grado">
                        <i class="fas fa-plus"></i> Agregar grupo
                    </button>
                </div>

                <!-- ===== COMPARACIÓN AUTOMÁTICA ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-code-compare"></i> Comparación automática</h3>
                    <div id="comparacion-automatica">
                        ${renderizarComparacion(lb.datosEscuela, nivel)}
                    </div>
                </div>

                <!-- ===== OBSERVACIONES ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Observaciones del colectivo</h3>
                    <div class="form-grupo">
                        <textarea id="observaciones-linea-base"
                                  data-campo="observaciones"
                                  placeholder="Escribe 3 o 4 enunciados máximo..."
                                  maxlength="600">${lb.observaciones || ''}</textarea>
                        <span class="ayuda">
                            Guía: contexto socioeconómico, acceso a materiales, condiciones de la escuela,
                            características del grupo, prácticas docentes previas, participación de las familias,
                            situaciones extraordinarias.
                        </span>
                    </div>
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-info" id="resumen-seccion2">
                    <i class="fas fa-info-circle"></i>
                    Agrega al menos un grupo para continuar.
                </div>

            </div>
        `;

        suscribirEventos();
        validar();
    }

    /* ========================================================
       REFERENCIA ESTATAL
       ======================================================== */
    function renderizarReferenciaEstatal(nivel, grados) {
        if (!nivel || grados.length === 0) {
            return `<div class="caja-info"><i class="fas fa-info-circle"></i> Selecciona nivel y grados en la Sección 1.</div>`;
        }

        const fuente = nivel === 'Primaria' ? DATOS.lineaBase.primaria : DATOS.lineaBase.secundaria;
        const gradosFiltrados = grados.filter(g => fuente[g.charAt(0)]);

        if (gradosFiltrados.length === 0) {
            return `<div class="caja-info"><i class="fas fa-info-circle"></i> No hay datos estatales para los grados seleccionados.</div>`;
        }

        return `
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Grado</th>
                            <th>Media</th>
                            <th>🟢 Deseable</th>
                            <th>🟡 En progreso</th>
                            <th>🔴 Atención</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${gradosFiltrados.map(g => {
                            const key = g.charAt(0);
                            const d = fuente[key];
                            if (!d) return '';
                            return `
                                <tr>
                                    <td><strong>${d.grado}</strong></td>
                                    <td>${d.media}%</td>
                                    <td>${d.deseable}%</td>
                                    <td>${d.enProgreso}%</td>
                                    <td>${d.atencionPrioritaria}%</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /* ========================================================
       GRADOS DE LA ESCUELA (con cantidades)
       ======================================================== */
    function renderizarGradosEscuela(nivel, grados, datosEscuela) {
        if (!nivel || grados.length === 0) {
            return `<p class="ayuda">Selecciona nivel y grados en la Sección 1.</p>`;
        }

        if (!datosEscuela || datosEscuela.length === 0) {
            return `<p class="ayuda">Aún no has agregado grupos. Usa el botón de abajo.</p>`;
        }

        return datosEscuela.map((d, i) => `
            <div class="tarjeta" data-index="${i}">
                <div class="flex-between mb-2">
                    <h4 style="margin:0;">
                        <i class="fas fa-users"></i> ${d.grado}${d.grupo ? ' · ' + d.grupo : ''}
                    </h4>
                    <button type="button" class="btn btn-peligro btn-sm btn-eliminar-grado" data-index="${i}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>

                <div class="form-fila">
                    <div class="form-grupo">
                        <label>Grado</label>
                        <select class="select-grado" data-index="${i}" data-campo="grado">
                            ${grados.map(g => `<option value="${g}" ${d.grado === g ? 'selected' : ''}>${g}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-grupo">
                        <label>Grupo</label>
                        <input type="text" class="input-grupo" data-index="${i}" data-campo="grupo"
                               value="${d.grupo || ''}" placeholder="Ej. A" maxlength="2"
                               style="text-transform: uppercase;">
                    </div>
                    <div class="form-grupo">
                        <label>Total de evaluados</label>
                        <input type="number" class="input-total" data-index="${i}" data-campo="total"
                               value="${d.total || ''}" min="0" placeholder="Ej. 30">
                    </div>
                </div>

                <div class="form-fila">
                    <div class="form-grupo">
                        <label>🟢 Deseable (núm.)</label>
                        <input type="number" class="input-deseable" data-index="${i}" data-campo="deseable"
                               value="${d.deseable || ''}" min="0" placeholder="Ej. 12">
                    </div>
                    <div class="form-grupo">
                        <label>🟡 En progreso (núm.)</label>
                        <input type="number" class="input-progreso" data-index="${i}" data-campo="enProgreso"
                               value="${d.enProgreso || ''}" min="0" placeholder="Ej. 15">
                    </div>
                    <div class="form-grupo">
                        <label>🔴 Atención prioritaria (núm.)</label>
                        <input type="number" class="input-atencion" data-index="${i}" data-campo="atencionPrioritaria"
                               value="${d.atencionPrioritaria || ''}" min="0" placeholder="Ej. 3">
                    </div>
                </div>

                <div class="validacion-suma" id="validacion-${i}"></div>
                <div class="resumen-porcentajes" id="resumen-${i}"></div>
            </div>
        `).join('');
    }

    /* ========================================================
       COMPARACIÓN AUTOMÁTICA
       ======================================================== */
    function renderizarComparacion(datosEscuela, nivel) {
        if (!datosEscuela || datosEscuela.length === 0) {
            return `<p class="ayuda">Agrega grupos para ver la comparación.</p>`;
        }

        const fuente = nivel === 'Primaria' ? DATOS.lineaBase.primaria : DATOS.lineaBase.secundaria;

        return `
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Grupo</th>
                            <th>Media escuela</th>
                            <th>Media estatal</th>
                            <th>Brecha</th>
                            <th>Semáforo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datosEscuela.map(d => {
                            const key = (d.grado || '').charAt(0);
                            const estatal = fuente[key];
                            const mediaEscuela = calcularMediaEscuela(d);

                            if (!estatal || mediaEscuela === null) {
                                return `
                                    <tr>
                                        <td><strong>${d.grado}${d.grupo ? ' · ' + d.grupo : ''}</strong></td>
                                        <td>${mediaEscuela !== null ? mediaEscuela.toFixed(1) + '%' : '—'}</td>
                                        <td>${estatal ? estatal.media + '%' : '—'}</td>
                                        <td>—</td>
                                        <td>—</td>
                                    </tr>
                                `;
                            }

                            const brecha = (mediaEscuela - estatal.media).toFixed(1);
                            const semaforo = calcularSemaforoBrecha(brecha);
                            return `
                                <tr>
                                    <td><strong>${d.grado}${d.grupo ? ' · ' + d.grupo : ''}</strong></td>
                                    <td>${mediaEscuela.toFixed(1)}%</td>
                                    <td>${estatal.media}%</td>
                                    <td><strong>${brecha > 0 ? '+' : ''}${brecha}</strong></td>
                                    <td>${renderizarSemaforo(semaforo)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="caja-info mt-2">
                <strong>Semáforo por brecha:</strong><br>
                🟢 Brecha &gt; +3 pts (por encima del estatal) ·
                🟡 Brecha entre -3 y +3 (en línea) ·
                🔴 Brecha &lt; -3 pts (por debajo del estatal)
            </div>
        `;
    }

    /* ========================================================
       CALCULAR MEDIA DE LA ESCUELA
       ======================================================== */
    function calcularMediaEscuela(d) {
        const total = parseFloat(d.total) || 0;
        if (total === 0) return null;
        const deseable = parseFloat(d.deseable) || 0;
        // La media se calcula como el % deseable + 50% del en progreso (aprox.)
        // O simplemente como el % de deseable + en progreso (que son "aprobados")
        // Usamos: (deseable + enProgreso*0.5) / total * 100
        // Pero para ser consistentes con Jalisco Avanza, usamos:
        // media = (deseable + enProgreso) / total * 100
        const aprobados = deseable + (parseFloat(d.enProgreso) || 0);
        return (aprobados / total) * 100;
    }

    function calcularSemaforoBrecha(brecha) {
        const b = parseFloat(brecha);
        if (b > 3) return 'verde';
        if (b >= -3) return 'amarillo';
        return 'rojo';
    }

    function renderizarSemaforo(color) {
        const etiquetas = { verde: 'Por encima', amarillo: 'En línea', rojo: 'Por debajo' };
        return `
            <span class="semaforo">
                <span class="semaforo-punto ${color}"></span>
                ${etiquetas[color]}
            </span>
        `;
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Agregar grupo
        const btnAgregar = document.getElementById('btn-agregar-grado');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', agregarGrupo);
        }

        // Eliminar grupo
        contenedor.querySelectorAll('.btn-eliminar-grado').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index, 10);
                eliminarGrupo(index);
            });
        });

        // Inputs de datos
        contenedor.querySelectorAll('[data-index][data-campo]').forEach(el => {
            el.addEventListener('input', manejarCambioGrupo);
            el.addEventListener('change', manejarCambioGrupo);
        });

        // Observaciones
        const obs = document.getElementById('observaciones-linea-base');
        if (obs) {
            obs.addEventListener('input', (e) => {
                ESTADO.actualizarCampo('lineaBase', 'observaciones', e.target.value);
            });
        }

        // Revalidar y recalcular al final
        revalidarTodos();
    }

    /* ========================================================
       AGREGAR / ELIMINAR GRUPO
       ======================================================== */
    function agregarGrupo() {
        const id = ESTADO.obtenerSeccion('identificacion');
        const lb = ESTADO.obtenerSeccion('lineaBase');

        const grados = id.grados || [];
        if (grados.length === 0) {
            alert('Primero selecciona los grados en la Sección 1.');
            return;
        }

        const nuevo = {
            grado: grados[0],
            grupo: '',
            total: '',
            deseable: '',
            enProgreso: '',
            atencionPrioritaria: ''
        };

        const nuevosDatos = [...(lb.datosEscuela || []), nuevo];
        ESTADO.actualizarCampo('lineaBase', 'datosEscuela', nuevosDatos);
        renderizar();
    }

    function eliminarGrupo(index) {
        const lb = ESTADO.obtenerSeccion('lineaBase');
        const nuevosDatos = lb.datosEscuela.filter((_, i) => i !== index);
        ESTADO.actualizarCampo('lineaBase', 'datosEscuela', nuevosDatos);
        renderizar();
    }

    /* ========================================================
       MANEJAR CAMBIO EN GRUPO
       ======================================================== */
    function manejarCambioGrupo(e) {
        const index = parseInt(e.target.dataset.index, 10);
        const campo = e.target.dataset.campo;
        let valor = e.target.value;

        if (campo === 'grupo') valor = valor.toUpperCase();
        if (['total', 'deseable', 'enProgreso', 'atencionPrioritaria'].includes(campo)) {
            valor = valor === '' ? '' : parseInt(valor, 10);
        }

        const lb = ESTADO.obtenerSeccion('lineaBase');
        const nuevosDatos = [...lb.datosEscuela];
        nuevosDatos[index] = { ...nuevosDatos[index], [campo]: valor };
        ESTADO.actualizarCampo('lineaBase', 'datosEscuela', nuevosDatos);

        validarSuma(index, nuevosDatos[index]);
        actualizarComparacion();
        validar();
    }

    /* ========================================================
       VALIDAR SUMA (cantidades, no porcentajes)
       ======================================================== */
    function validarSuma(index, datos) {
        const el = document.getElementById(`validacion-${index}`);
        const resumenEl = document.getElementById(`resumen-${index}`);
        if (!el) return;

        const total = parseInt(datos.total) || 0;
        const deseable = parseInt(datos.deseable) || 0;
        const enProgreso = parseInt(datos.enProgreso) || 0;
        const atencion = parseInt(datos.atencionPrioritaria) || 0;

        const suma = deseable + enProgreso + atencion;

        // Validación
        if (total === 0 && suma === 0) {
            el.innerHTML = '';
            if (resumenEl) resumenEl.innerHTML = '';
            return;
        }

        if (suma === total) {
            el.innerHTML = `<span class="chip verde"><i class="fas fa-check"></i> Suma: ${suma} / ${total}</span>`;
        } else if (suma < total) {
            el.innerHTML = `<span class="chip amarillo"><i class="fas fa-exclamation-triangle"></i> Faltan ${total - suma} alumnos por clasificar (${suma} / ${total})</span>`;
        } else {
            el.innerHTML = `<span class="chip rojo"><i class="fas fa-exclamation-triangle"></i> Suma: ${suma} / ${total} (excede el total)</span>`;
        }

        // Mostrar porcentajes calculados
        if (resumenEl && total > 0) {
            const pDeseable = ((deseable / total) * 100).toFixed(1);
            const pProgreso = ((enProgreso / total) * 100).toFixed(1);
            const pAtencion = ((atencion / total) * 100).toFixed(1);
            resumenEl.innerHTML = `
                <span class="chip verde">🟢 ${pDeseable}%</span>
                <span class="chip amarillo">🟡 ${pProgreso}%</span>
                <span class="chip rojo">🔴 ${pAtencion}%</span>
            `;
        } else if (resumenEl) {
            resumenEl.innerHTML = '';
        }
    }

    /* ========================================================
       ACTUALIZAR COMPARACIÓN
       ======================================================== */
    function actualizarComparacion() {
        const id = ESTADO.obtenerSeccion('identificacion');
        const lb = ESTADO.obtenerSeccion('lineaBase');
        const cont = document.getElementById('comparacion-automatica');
        if (cont) {
            cont.innerHTML = renderizarComparacion(lb.datosEscuela, id.nivel);
        }
    }

    /* ========================================================
       REVALIDAR TODOS LOS GRUPOS
       ======================================================== */
    function revalidarTodos() {
        const lb = ESTADO.obtenerSeccion('lineaBase');
        (lb.datosEscuela || []).forEach((d, i) => validarSuma(i, d));
    }

    /* ========================================================
       VALIDAR SECCIÓN COMPLETA
       ======================================================== */
    function validar() {
        const lb = ESTADO.obtenerSeccion('lineaBase');
        const resumen = document.getElementById('resumen-seccion2');

        if (!resumen) return false;

        const tieneGrupos = lb.datosEscuela && lb.datosEscuela.length > 0;
        // Al menos UN grupo con total y suma correcta
        const alMenosUnGrupoValido = tieneGrupos && lb.datosEscuela.some(d => {
            const total = parseInt(d.total) || 0;
            const suma = (parseInt(d.deseable) || 0) + (parseInt(d.enProgreso) || 0) + (parseInt(d.atencionPrioritaria) || 0);
            return total > 0 && suma === total;
        });

        if (alMenosUnGrupoValido) {
            resumen.className = 'caja-exito';
            resumen.innerHTML = '<i class="fas fa-check-circle"></i> Sección completa. Puedes continuar.';
        } else if (tieneGrupos) {
            resumen.className = 'caja-info';
            resumen.innerHTML = '<i class="fas fa-info-circle"></i> Completa al menos un grupo con todos sus campos.';
        } else {
            resumen.className = 'caja-info';
            resumen.innerHTML = '<i class="fas fa-info-circle"></i> Agrega al menos un grupo para continuar.';
        }

        ESTADO.notificar('seccion2Validada', { completa: alMenosUnGrupoValido });
        return alMenosUnGrupoValido;
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
