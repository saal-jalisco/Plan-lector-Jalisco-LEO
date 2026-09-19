/* ============================================================
   TERMÓMETRO LECTOR · JALISCO LEO
   seccion5.js — Sección 5: Termómetro Visual
   ============================================================ */

const SECCION5 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-seccion-5');
        if (!contenedor) return;

        renderizar();
        suscribirCambios();
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar() {
        const t = ESTADO.obtenerSeccion('termometro');
        const saal = ESTADO.obtenerSeccion('saal');
        const tieneSAAL = saal.tieneSAAL === 'si';

        // Calcular semáforo automático
        const dimensionesCalculadas = calcularDimensiones(tieneSAAL);

        // Guardar en estado si no existe
        if (!t.dimensiones || Object.keys(t.dimensiones).length === 0) {
            ESTADO.actualizarCampo('termometro', 'dimensiones', dimensionesCalculadas);
        }

        const dimensiones = { ...dimensionesCalculadas, ...(t.dimensiones || {}) };

        // Calcular lectura automática
        const lectura = calcularLecturaAutomatica(dimensiones, tieneSAAL);

        contenedor.innerHTML = `
            <div class="form-seccion">

                <!-- ===== ALERTA SI MÁS DE 5 ROJOS ===== -->
                ${lectura.rojos > 5 ? `
                    <div class="caja-alerta">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Atención:</strong> Hay ${lectura.rojos} dimensiones en 🔴 Atención prioritaria.
                        Te recomendamos enfocar los esfuerzos en las más críticas.
                    </div>
                ` : ''}

                <!-- ===== SEMÁFORO INTEGRADO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-temperature-half"></i> Semáforo integrado (${tieneSAAL ? '18' : '12'} dimensiones)</h3>
                    <p class="ayuda">
                        ${tieneSAAL ? 'Incluye dimensiones SAAL, Línea Base y Voces.' : 'Sin SAAL: solo dimensiones de Voces y Línea Base.'}
                    </p>

                    <div class="tabla-wrapper">
                        <table class="tabla-termometro">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Dimensión</th>
                                    <th>Fuente</th>
                                    <th>Estado</th>
                                    <th>Semáforo</th>
                                    <th>Ajuste</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${DATOS.dimensiones
                                    .filter(d => tieneSAAL || d.grupo !== 'SAAL')
                                    .map(d => renderizarFilaDimension(d, dimensiones[d.id], t.ajustes?.[d.id]))
                                    .join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ===== LEYENDA ===== -->
                <div class="caja-info">
                    <strong>Semáforo:</strong>
                    <span class="semaforo"><span class="semaforo-punto verde"></span> <span>Fortaleza</span></span> ·
                    <span class="semaforo"><span class="semaforo-punto amarillo"></span> <span>En progreso</span></span> ·
                    <span class="semaforo"><span class="semaforo-punto rojo"></span> <span>Atención prioritaria</span></span> ·
                </div>

                <!-- ===== LECTURA AUTOMÁTICA ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-book-reader"></i> Lectura automática</h3>
                    <p class="ayuda">Totalmente editable por el colectivo.</p>

                    <div class="tarjeta-grid">
                        <div class="tarjeta" style="border-left-color: var(--verde);">
                            <h4><i class="fas fa-circle-check" style="color: var(--verde);"></i> Fortalezas (${lectura.fortalezas.length})</h4>
                            ${lectura.fortalezas.length > 0
                                ? `<ul>${lectura.fortalezas.map(d => `<li>${d}</li>`).join('')}</ul>`
                                : '<p class="ayuda">Sin dimensiones en verde.</p>'}
                        </div>

                        <div class="tarjeta" style="border-left-color: var(--amarillo);">
                            <h4><i class="fas fa-circle-half-stroke" style="color: var(--amarillo);"></i> En progreso (${lectura.enProgreso.length})</h4>
                            ${lectura.enProgreso.length > 0
                                ? `<ul>${lectura.enProgreso.map(d => `<li>${d}</li>`).join('')}</ul>`
                                : '<p class="ayuda">Sin dimensiones en amarillo.</p>'}
                        </div>

                        <div class="tarjeta" style="border-left-color: var(--rojo);">
                            <h4><i class="fas fa-circle-exclamation" style="color: var(--rojo);"></i> Atención prioritaria (${lectura.atencionPrioritaria.length})</h4>
                            ${lectura.atencionPrioritaria.length > 0
                                ? `<ul>${lectura.atencionPrioritaria.map(d => `<li>${d}</li>`).join('')}</ul>`
                                : '<p class="ayuda">Sin dimensiones en rojo.</p>'}
                        </div>
                    </div>

                    <div class="caja-destacada mt-2">
                        <h4><i class="fas fa-list-ol"></i> Prioridades sugeridas</h4>
                        ${lectura.prioridades.length > 0
                            ? `<ol>${lectura.prioridades.map(d => `<li>${d}</li>`).join('')}</ol>`
                            : '<p class="ayuda">Sin prioridades por ahora.</p>'}
                    </div>
                </div>

                <!-- ===== ACCIONES ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-download"></i> Exportar semáforo</h3>
                    <button type="button" class="btn btn-naranja" id="btn-exportar-semaforo">
                        <i class="fas fa-image"></i> Descargar como imagen
                    </button>
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-info" id="resumen-seccion5">
                    <i class="fas fa-info-circle"></i>
                    Revisa el semáforo y ajusta si es necesario.
                </div>

            </div>
        `;

        suscribirEventos();
        validar();
    }

       /* ========================================================
       RENDERIZAR FILA DE DIMENSIÓN
       ======================================================== */
    function renderizarFilaDimension(d, color, ajuste) {
        const colorActual = ajuste ? ajuste.valor : (color || 'gris');
        const tieneAjuste = !!ajuste;

        const etiquetasColor = {
            verde: 'Fortaleza',
            amarillo: 'En progreso',
            rojo: 'Atención',
        };

        // Colores inline (para asegurar que se vean)
        const coloresInline = {
            verde: '#2E9E5B',
            amarillo: '#E8B93B',
            rojo: '#D93B3B',
        };

        return `
            <tr data-dimension="${d.id}">
                <td>${d.numero}</td>
                <td><strong>${d.nombre}</strong></td>
                <td><span class="chip">${d.fuente}</span></td>
                <td>
                    <span class="semaforo" style="display:inline-flex; align-items:center; gap:0.5rem;">
                        <span style="
                            display:inline-block;
                            width:16px;
                            height:16px;
                            border-radius:50%;
                            background:${coloresInline[colorActual]};
                            border:2px solid rgba(0,0,0,0.08);
                            flex-shrink:0;
                        "></span>
                        <span>${etiquetasColor[colorActual]}</span>
                    </span>
                    ${tieneAjuste ? '<br><span class="chip naranja"><i class="fas fa-pen"></i> Ajustado</span>' : ''}
                </td>
                <td>
                    <div class="selector-semaforo" style="display:inline-flex; gap:0.5rem; align-items:center;">
                        ${['verde', 'amarillo', 'rojo'].map(c => `
                            <label class="semaforo-opcion ${colorActual === c ? 'seleccionada' : ''}"
                                   style="
                                       display:inline-flex;
                                       align-items:center;
                                       justify-content:center;
                                       cursor:pointer;
                                       padding:0.3rem;
                                       border-radius:50%;
                                       border:2px solid ${colorActual === c ? '#4A4A4A' : 'transparent'};
                                       background:${colorActual === c ? 'rgba(0,0,0,0.05)' : 'transparent'};
                                   ">
                                <input type="radio" name="dim-${d.id}" value="${c}"
                                       ${colorActual === c ? 'checked' : ''}
                                       style="display:none;">
                                <span style="
                                    display:inline-block;
                                    width:22px;
                                    height:22px;
                                    border-radius:50%;
                                    background:${coloresInline[c]};
                                    border:2px solid rgba(0,0,0,0.08);
                                    ${colorActual === c ? 'transform:scale(1.15); box-shadow:0 0 0 3px rgba(0,0,0,0.1);' : ''}
                                "></span>
                            </label>
                        `).join('')}
                    </div>
                </td>
                <td>
                    <button type="button" class="btn btn-secundario btn-sm btn-ajustar" data-dimension="${d.id}">
                        <i class="fas fa-pen"></i> Justificar
                    </button>
                </td>
            </tr>
        `;
    }
    /* ========================================================
       CALCULAR DIMENSIONES AUTOMÁTICAS
       ======================================================== */
    function calcularDimensiones(tieneSAAL) {
        const resultado = {};
        const lb = ESTADO.obtenerSeccion('lineaBase');
        const saal = ESTADO.obtenerSeccion('saal');
        const v = ESTADO.obtenerSeccion('voces');

        // === Dimensiones SAAL (1-6) ===
        if (tieneSAAL) {
            // Comprensión y Fluidez: desde Línea Base (media vs estatal)
            if (lb.datosEscuela && lb.datosEscuela.length > 0) {
                const brechaPromedio = calcularBrechaPromedio(lb.datosEscuela);
                resultado.comprension = calcularColorDesdeBrecha(brechaPromedio);
                resultado.fluidez = calcularColorDesdeBrecha(brechaPromedio);
            }

            // Precisión, Uso de voz, Seguridad, Palabras complejas: desde SAAL
            if (saal.componentesDebiles) {
                const c = saal.componentesDebiles;
                resultado.precision = calcularColorDesdeComponente(c.precision);
                resultado.usoVoz = calcularColorDesdeComponente(c.usoVoz);
                resultado.seguridad = calcularColorDesdeComponente(c.seguridad);
                resultado.palabrasComplejas = calcularColorDesdeComponente(c.palabrasComplejas);
            }
        }

        // === Dimensiones de Voces (7-18) ===
        if (v.sintesis) {
            Object.keys(v.sintesis).forEach(dim => {
                resultado[dim] = v.sintesis[dim];
            });
        }

        return resultado;
    }

    /* ========================================================
       HELPERS DE CÁLCULO
       ======================================================== */
    function calcularBrechaPromedio(datosEscuela) {
        const id = ESTADO.obtenerSeccion('identificacion');
        const fuente = id.nivel === 'Primaria' ? DATOS.lineaBase.primaria : DATOS.lineaBase.secundaria;
        const brechas = datosEscuela
            .filter(d => d.total)
            .map(d => {
                const key = (d.grado || '').charAt(0);
                const estatal = fuente[key];
                if (!estatal) return null;
                const mediaEscuela = calcularMediaEscuela(d);
                if (mediaEscuela === null) return null;
                return mediaEscuela - estatal.media;
            })
            .filter(b => b !== null);

        if (brechas.length === 0) return 0;
        return brechas.reduce((a, b) => a + b, 0) / brechas.length;
    }

    function calcularMediaEscuela(d) {
        const total = parseFloat(d.total) || 0;
        if (total === 0) return null;
        const deseable = parseFloat(d.deseable) || 0;
        const enProgreso = parseFloat(d.enProgreso) || 0;
        return ((deseable + enProgreso) / total) * 100;
    }

    function calcularColorDesdeBrecha(brecha) {
        if (brecha > 3) return 'verde';
        if (brecha >= -3) return 'amarillo';
        return 'rojo';
    }

    function calcularColorDesdeComponente(valor) {
        const v = parseFloat(valor);
        if (v >= 30) return 'rojo';
        if (v >= 15) return 'amarillo';
        return 'verde';
    }

    /* ========================================================
       CALCULAR LECTURA AUTOMÁTICA
       ======================================================== */
    function calcularLecturaAutomatica(dimensiones, tieneSAAL) {
        const fortalezas = [];
        const enProgreso = [];
        const atencionPrioritaria = [];
        const prioridades = [];

        DATOS.dimensiones
            .filter(d => tieneSAAL || d.grupo !== 'SAAL')
            .forEach(d => {
                const color = dimensiones[d.id];
                if (color === 'verde') fortalezas.push(d.nombre);
                else if (color === 'amarillo') enProgreso.push(d.nombre);
                else if (color === 'rojo') atencionPrioritaria.push(d.nombre);
            });

        // Prioridades: rojos primero, luego amarillos
        prioridades.push(...atencionPrioritaria);
        prioridades.push(...enProgreso);

        return {
            fortalezas,
            enProgreso,
            atencionPrioritaria,
            prioridades,
            rojos: atencionPrioritaria.length
        };
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Cambio de semáforo
        contenedor.querySelectorAll('.selector-semaforo input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', manejarCambioSemaforo);
        });

        // Ajustar con justificación
        contenedor.querySelectorAll('.btn-ajustar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dim = e.currentTarget.dataset.dimension;
                abrirModalJustificacion(dim);
            });
        });

        // Exportar semáforo
        const btnExportar = document.getElementById('btn-exportar-semaforo');
        if (btnExportar) {
            btnExportar.addEventListener('click', exportarSemaforo);
        }
    }

    /* ========================================================
       MANEJAR CAMBIO DE SEMÁFORO
       ======================================================== */
    function manejarCambioSemaforo(e) {
        const dimension = e.target.name.replace('dim-', '');
        const color = e.target.value;

        const t = ESTADO.obtenerSeccion('termometro');
        const nuevasDimensiones = { ...(t.dimensiones || {}), [dimension]: color };
        ESTADO.actualizarCampo('termometro', 'dimensiones', nuevasDimensiones);

        renderizar();
    }

    /* ========================================================
       MODAL DE JUSTIFICACIÓN
       ======================================================== */
    function abrirModalJustificacion(dimension) {
        const t = ESTADO.obtenerSeccion('termometro');
        const ajuste = t.ajustes?.[dimension];
        const dimDef = DATOS.dimensiones.find(d => d.id === dimension);

        const modal = document.getElementById('modal-confirmacion');
        const titulo = document.getElementById('modal-titulo');
        const mensaje = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        titulo.textContent = `Ajustar: ${dimDef?.nombre || dimension}`;
        mensaje.innerHTML = `
            <div class="form-grupo">
                <label>Justificación del ajuste <span class="obligatorio">*</span></label>
                <textarea id="justificacion-ajuste" placeholder="Explica por qué ajustas esta dimensión...">${ajuste?.justificacion || ''}</textarea>
                <span class="ayuda">Obligatorio para guardar el ajuste.</span>
            </div>
        `;

        btnAceptar.textContent = 'Guardar ajuste';
        btnCancelar.textContent = 'Cancelar';

        // Clonar botones para eliminar listeners previos
        const nuevoAceptar = btnAceptar.cloneNode(true);
        const nuevoCancelar = btnCancelar.cloneNode(true);
        btnAceptar.replaceWith(nuevoAceptar);
        btnCancelar.replaceWith(nuevoCancelar);

        modal.style.display = 'flex';

        nuevoCancelar.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        nuevoAceptar.addEventListener('click', () => {
            const justificacion = document.getElementById('justificacion-ajuste').value.trim();
            if (!justificacion) {
                alert('La justificación es obligatoria.');
                return;
            }

            const t = ESTADO.obtenerSeccion('termometro');
            const colorActual = t.dimensiones?.[dimension] || 'gris';
            const nuevosAjustes = {
                ...(t.ajustes || {}),
                [dimension]: {
                    valor: colorActual,
                    justificacion,
                    fecha: new Date().toISOString()
                }
            };

            ESTADO.actualizarCampo('termometro', 'ajustes', nuevosAjustes);
            modal.style.display = 'none';
            renderizar();
        });
    }

    /* ========================================================
       EXPORTAR SEMÁFORO COMO IMAGEN
       ======================================================== */
    function exportarSemaforo() {
        if (typeof html2canvas === 'undefined') {
            alert('Para exportar como imagen, necesitas cargar html2canvas. Contacta a Dips.');
            return;
        }

        const tabla = contenedor.querySelector('.tabla-termometro');
        if (!tabla) return;

        html2canvas(tabla, {
            backgroundColor: '#FFFFFF',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `semaforo-termometro-${ESTADO.fechaArchivo()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }

    /* ========================================================
       VALIDAR SECCIÓN
       ======================================================== */
    function validar() {
        const t = ESTADO.obtenerSeccion('termometro');
        const resumen = document.getElementById('resumen-seccion5');
        if (!resumen) return false;

        const tieneDimensiones = t.dimensiones && Object.keys(t.dimensiones).length > 0;

        if (tieneDimensiones) {
            resumen.className = 'caja-exito';
            resumen.innerHTML = '<i class="fas fa-check-circle"></i> Termómetro listo. Puedes continuar.';
        } else {
            resumen.className = 'caja-info';
            resumen.innerHTML = '<i class="fas fa-info-circle"></i> Completa las secciones anteriores para generar el termómetro.';
        }

        ESTADO.notificar('seccion5Validada', { completa: tieneDimensiones });
        return tieneDimensiones;
    }

    /* ========================================================
       SUSCRIBIR CAMBIOS EXTERNOS
       ======================================================== */
    function suscribirCambios() {
        ESTADO.suscribir((evento) => {
            if (evento === 'reiniciado' || evento === 'borradorCargado' || evento === 'importado') {
                renderizar();
            }
            if (evento === 'seccionActualizada') {
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
    window.SECCION5 = SECCION5;
}
