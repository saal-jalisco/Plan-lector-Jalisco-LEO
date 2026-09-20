/* ============================================================
   PLAN LECTOR JALISCO LEO
   seccion6.js — Sección 6: Rutas Sugeridas
   v2.0 — Alineado a 1 ruta por trimestre + estructura nueva
          (anclas + banco + cierre). Sin crashes.
   ============================================================ */

const SECCION6 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-seccion-6');
        if (!contenedor) return;

        renderizar();
        suscribirCambios();
    }

    /* ========================================================
       HELPERS DEFENSIVOS
       ======================================================== */
    function escaparHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function mostrarToast(mensaje, tipo) {
        if (typeof App !== 'undefined' && typeof App.mostrarToast === 'function') {
            try { App.mostrarToast(mensaje, tipo); return; } catch (e) { /* silencio */ }
        }
        if (typeof APP !== 'undefined' && typeof APP.mostrarToast === 'function') {
            try { APP.mostrarToast(mensaje, tipo); return; } catch (e) { /* silencio */ }
        }
        console.log(`[Toast ${tipo || 'info'}] ${mensaje}`);
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar() {
        const r = ESTADO.obtenerSeccion('rutas');
        const t = ESTADO.obtenerSeccion('termometro');
        const id = ESTADO.obtenerSeccion('identificacion');

        // Obtener reglas de filtrado según el nivel (nueva estructura)
        const reglas = (DATOS.reglasFiltradoNivel && DATOS.reglasFiltradoNivel[id.nivel]) || {
            rutasSugeridas: ['ruta1', 'ruta2', 'ruta3', 'ruta4', 'ruta5'],
            rutasOpcionales: [],
            rutaUnica: true,
            nota: 'Selecciona la ruta que mejor se adapte a tu escuela.'
        };

        // Calcular rutas sugeridas desde el motor (solo las que aplican al nivel)
        const sugeridas = calcularRutasSugeridas(t.dimensiones || {}, reglas, id.nivel);

        // Guardar en estado (si aún no hay)
        if (!r.sugeridas || r.sugeridas.length === 0) {
            ESTADO.actualizarCampo('rutas', 'sugeridas', sugeridas);
        }

        const rutasActuales = r.sugeridas && r.sugeridas.length > 0 ? r.sugeridas : sugeridas;
        const seleccionadas = r.seleccionadas || [];

        contenedor.innerHTML = `
            <div class="form-seccion">

                <!-- ===== INFORMACIÓN DEL NIVEL ===== -->
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Nivel educativo:</strong> ${obtenerNombreNivel(id.nivel)} ·
                    <strong>Rutas disponibles para el nivel:</strong>
                    ${reglas.rutasSugeridas.length + reglas.rutasOpcionales.length}
                    <br>
                    <span class="ayuda">
                        Esta sección es <strong>informativa</strong>: muestra las rutas que el motor
                        de recomendación sugiere según el Termómetro. La elección definitiva
                        (1 ruta por trimestre) se hace en el <strong>Momento 3 · Sub-paso 3.1</strong>.
                    </span>
                </div>

                <!-- ===== AVISO SOBRE 1 RUTA ===== -->
                <div class="caja-alerta">
                    <i class="fas fa-lightbulb"></i>
                    <strong>Recuerda:</strong> el Plan Lector trabaja <strong>una ruta por trimestre</strong>.
                    Aquí puedes marcar tu ruta favorita para tenerla presente, pero la selección
                    oficial se hace en el Momento 3.
                </div>

                <!-- ===== MOTOR DE RECOMENDACIÓN ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-gears"></i> Motor de recomendación</h3>
                    <p class="ayuda">
                        Basado en las dimensiones en 🔴 y 🟡 del Termómetro, filtradas por el nivel educativo.
                        Las rutas se ordenan por prioridad.
                    </p>

                    ${rutasActuales.length > 0 ? `
                        <div class="tarjeta-grid" id="lista-rutas">
                            ${rutasActuales.map(s => renderizarTarjetaRuta(s, seleccionadas)).join('')}
                        </div>
                    ` : `
                        <div class="caja-info">
                            <i class="fas fa-info-circle"></i>
                            No hay rutas sugeridas. Completa primero el Termómetro Visual.
                        </div>
                    `}
                </div>

                <!-- ===== SELECCIÓN DEL COLECTIVO ===== -->
                ${rutasActuales.length > 0 ? `
                    <div class="form-bloque">
                        <h3><i class="fas fa-list-check"></i> Ruta favorita del colectivo (referencia)</h3>
                        <p class="ayuda">
                            Marca <strong>1 ruta</strong> como favorita. Se queda guardada como referencia
                            y como valor por defecto al entrar al Momento 3.
                            <br><strong>Marcada:</strong> ${seleccionadas.length} de 1
                        </p>

                        <div id="lista-seleccionadas">
                            ${renderizarSeleccionadas(rutasActuales, seleccionadas)}
                        </div>
                    </div>
                ` : ''}

                <!-- ===== NOTAS DEL COLECTIVO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Notas del colectivo</h3>
                    <p class="ayuda">Opcional. Observaciones sobre las rutas sugeridas.</p>
                    <div class="form-grupo">
                        <textarea id="notas-rutas" placeholder="Ej. Consideramos que la Ruta 1 responde directamente a los resultados del Termómetro..." maxlength="600">${escaparHTML(r.notas || '')}</textarea>
                    </div>
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-info" id="resumen-seccion6">
                    <i class="fas fa-info-circle"></i>
                    Puedes continuar sin marcar ruta (la selección oficial es en el Momento 3).
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       CALCULAR RUTAS SUGERIDAS (MOTOR + FILTRO POR NIVEL)
       ======================================================== */
    function calcularRutasSugeridas(dimensiones, reglas, nivelId) {
        const resultado = [];
        const reglasMotor = DATOS.motorRecomendacion.reglas;

        const rutasPermitidas = [
            ...reglas.rutasSugeridas,
            ...reglas.rutasOpcionales
        ];

        reglasMotor.forEach(regla => {
            if (!rutasPermitidas.includes(regla.rutaId)) return;

            const gatillosActivos = regla.dimensionesGatillo.filter(dim => {
                const color = dimensiones[dim];
                return color === 'rojo' || color === 'amarillo';
            });

            if (gatillosActivos.length === 0) return;

            const rojos = gatillosActivos.filter(dim => dimensiones[dim] === 'rojo').length;

            let prioridad = 'BAJA';
            if (rojos >= 3) prioridad = 'ALTA';
            else if (rojos === 2) prioridad = 'MEDIA';

            const rutaDef = DATOS.rutasLEO[regla.rutaId];
            if (!rutaDef) return;

            // Si la ruta está marcada como sugerida para el nivel, sube un escalón
            let prioridadAjustada = prioridad;
            if (reglas.rutasSugeridas.includes(regla.rutaId) && prioridad === 'BAJA') {
                prioridadAjustada = 'MEDIA';
            }

            resultado.push({
                rutaId: regla.rutaId,
                prioridad: prioridadAjustada,
                rojos,
                peso: regla.peso,
                dimensionesGatillo: gatillosActivos,
                ruta: rutaDef,
                esSugerida: reglas.rutasSugeridas.includes(regla.rutaId)
            });
        });

        // Ordenar: ALTA → MEDIA → BAJA, y dentro de cada prioridad, sugeridas primero
        const ordenPrioridad = { ALTA: 0, MEDIA: 1, BAJA: 2 };
        resultado.sort((a, b) => {
            const diff = ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad];
            if (diff !== 0) return diff;
            return (b.esSugerida ? 1 : 0) - (a.esSugerida ? 1 : 0);
        });

        return resultado;
    }

    /* ========================================================
       OBTENER NOMBRE DEL NIVEL
       ======================================================== */
    function obtenerNombreNivel(nivelId) {
        if (!nivelId || !DATOS.niveles) return 'No especificado';
        const nivel = DATOS.niveles.find(n => n.id === nivelId);
        return nivel ? `${nivel.nombre} (${nivel.rango})` : 'No especificado';
    }

    /* ========================================================
       RENDERIZAR TARJETA DE RUTA
       ======================================================== */
    function renderizarTarjetaRuta(s, seleccionadas) {
        const seleccionada = seleccionadas.some(sel => sel.rutaId === s.rutaId);
        const coloresPrioridad = { ALTA: 'rojo', MEDIA: 'amarillo', BAJA: 'verde' };

        // Mapear color de prioridad al nombre del chip
        const chipPrioridad = { ALTA: 'carmesi', MEDIA: 'naranja', BAJA: 'verde' };
        const colorChip = chipPrioridad[s.prioridad] || 'gris';

        // Tomar los primeros 140 caracteres del propósito (era "necesidad")
        const propositoCorto = s.ruta.proposito
            ? (s.ruta.proposito.length > 140
                ? s.ruta.proposito.substring(0, 140) + '…'
                : s.ruta.proposito)
            : '';

        return `
            <div class="tarjeta tarjeta-ruta ${seleccionada ? 'seleccionada' : ''}"
                 data-ruta="${s.rutaId}">

                <div class="flex-between mb-2">
                    <div class="flex gap-1" style="flex-wrap: wrap;">
                        <span class="chip ${colorChip}">
                            <i class="fas fa-flag"></i> ${s.prioridad}
                        </span>
                        ${s.esSugerida ? `<span class="chip carmesi"><i class="fas fa-star"></i> Sugerida</span>` : ''}
                    </div>
                    <label class="opcion-check">
                        <input type="checkbox" class="check-ruta" data-ruta="${s.rutaId}"
                               ${seleccionada ? 'checked' : ''}>
                    </label>
                </div>

                <h4 style="margin:0 0 0.5rem;">${escaparHTML(s.ruta.nombre)}</h4>
                <p class="ayuda" style="font-style: italic; margin-bottom: 0.75rem;">
                    "${escaparHTML(s.ruta.lema)}"
                </p>

                <div class="mb-2">
                    <strong>Dimensiones gatillo (${s.dimensionesGatillo.length}):</strong>
                    <div>
                        ${s.dimensionesGatillo.map(dimId => {
                            const dimDef = DATOS.dimensiones.find(d => d.id === dimId);
                            const color = (ESTADO.obtenerSeccion('termometro')?.dimensiones || {})[dimId];
                            return `<span class="chip ${color || 'gris'}">${escaparHTML(dimDef?.nombre || dimId)}</span>`;
                        }).join('')}
                    </div>
                </div>

                <div class="mb-2">
                    <strong>Propósito:</strong>
                    <p class="ayuda">${escaparHTML(propositoCorto)}</p>
                </div>

                <div class="mb-2">
                    <strong>Virtudes:</strong>
                    <div>
                        ${(s.ruta.virtudes || []).map(v => `<span class="chip">${escaparHTML(v)}</span>`).join('')}
                    </div>
                </div>

                <button type="button" class="btn btn-secundario btn-sm btn-ver-actividades" data-ruta="${s.rutaId}">
                    <i class="fas fa-eye"></i> Ver actividades
                </button>
            </div>
        `;
    }

    /* ========================================================
       RENDERIZAR SELECCIONADAS (solo 1)
       ======================================================== */
    function renderizarSeleccionadas(rutasActuales, seleccionadas) {
        if (seleccionadas.length === 0) {
            return `<p class="ayuda">Aún no has marcado una ruta favorita.</p>`;
        }

        return seleccionadas.map((sel, i) => {
            const s = rutasActuales.find(r => r.rutaId === sel.rutaId);
            if (!s) return '';

            const chipPrioridad = { ALTA: 'carmesi', MEDIA: 'naranja', BAJA: 'verde' };
            const colorChip = chipPrioridad[s.prioridad] || 'gris';

            return `
                <div class="tarjeta tarjeta-seleccionada" data-ruta="${sel.rutaId}">
                    <div class="flex-between">
                        <div>
                            <strong>${i + 1}. ${escaparHTML(s.ruta.nombre)}</strong>
                            <span class="chip ${colorChip}">${s.prioridad}</span>
                        </div>
                        <div class="flex gap-1">
                            <button type="button" class="btn btn-icono btn-peligro btn-quitar" data-ruta="${sel.rutaId}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        contenedor.querySelectorAll('.check-ruta').forEach(check => {
            check.addEventListener('change', manejarSeleccionRuta);
        });

        contenedor.querySelectorAll('.btn-ver-actividades').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rutaId = e.currentTarget.dataset.ruta;
                abrirModalActividades(rutaId);
            });
        });

        contenedor.querySelectorAll('.btn-quitar').forEach(btn => {
            btn.addEventListener('click', (e) => quitarRuta(e.currentTarget.dataset.ruta));
        });

        const notas = document.getElementById('notas-rutas');
        if (notas) {
            notas.addEventListener('input', (e) => {
                ESTADO.actualizarCampo('rutas', 'notas', e.target.value);
            });
        }
    }

    /* ========================================================
       MANEJAR SELECCIÓN (solo 1 ruta)
       ======================================================== */
    function manejarSeleccionRuta(e) {
        const rutaId = e.target.dataset.ruta;
        let seleccionadas = [];

        // Solo permitimos 1: si marca una nueva, reemplaza la anterior
        if (e.target.checked) {
            seleccionadas = [{ rutaId, orden: 0 }];
        } else {
            seleccionadas = [];
        }

        ESTADO.actualizarCampo('rutas', 'seleccionadas', seleccionadas);
        renderizar();
    }

    /* ========================================================
       QUITAR RUTA
       ======================================================== */
    function quitarRuta(rutaId) {
        ESTADO.actualizarCampo('rutas', 'seleccionadas', []);
        renderizar();
    }

    /* ========================================================
       MODAL DE ACTIVIDADES (nueva estructura)
       ======================================================== */
    function abrirModalActividades(rutaId) {
        const ruta = DATOS.rutasLEO[rutaId];
        if (!ruta) return;

        const id = ESTADO.obtenerSeccion('identificacion');
        const nivelId = id.nivel;
        const nivelData = ruta.niveles && ruta.niveles[nivelId];
        const nivelNombre = obtenerNombreNivel(nivelId);

        const modal = document.getElementById('modal-confirmacion');
        const titulo = document.getElementById('modal-titulo');
        const mensaje = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        if (!modal || !titulo || !mensaje || !btnAceptar || !btnCancelar) {
            mostrarToast('No se pudo abrir el detalle.', 'error');
            return;
        }

        titulo.textContent = ruta.nombre;

        // Si el nivel no está disponible para esta ruta
        if (!nivelData || nivelData.disponible === false) {
            const razon = nivelData?.razonNoDisponible || 'Esta ruta no tiene actividades propias para el nivel seleccionado.';
            mensaje.innerHTML = `
                <p style="font-style: italic; margin-bottom: 1rem;">"${escaparHTML(ruta.lema)}"</p>
                <div class="caja-alerta">
                    <i class="fas fa-info-circle"></i>
                    ${escaparHTML(razon)}
                </div>
            `;
        } else {
            const anclas = Array.isArray(nivelData.anclas) ? nivelData.anclas : [];
            const banco  = Array.isArray(nivelData.banco)  ? nivelData.banco  : [];
            const cierre = nivelData.cierre;

            mensaje.innerHTML = `
                <p style="font-style: italic; margin-bottom: 1rem;">"${escaparHTML(ruta.lema)}"</p>

                <div class="caja-info" style="margin-bottom: 1rem;">
                    <strong>Nivel:</strong> ${escaparHTML(nivelNombre)}
                </div>

                <h4 style="color: var(--carmesi); margin-bottom: 0.5rem;">
                    <i class="fas fa-anchor"></i> Anclas (${anclas.length})
                </h4>
                <ul style="margin-bottom: 1rem;">
                    ${anclas.map(a => `
                        <li style="margin-bottom: 0.5rem;">
                            <strong>${escaparHTML(a.nombre)}</strong>
                            <span class="chip carmesi">${escaparHTML(a.frecuencia || '')}</span>
                            <br>
                            <span class="ayuda">${escaparHTML(a.descripcion || '')}</span>
                        </li>
                    `).join('')}
                </ul>

                <h4 style="color: var(--carmesi); margin-bottom: 0.5rem;">
                    <i class="fas fa-layer-group"></i> Banco de actividades (${banco.length})
                </h4>
                <ul style="margin-bottom: 1rem;">
                    ${banco.map(a => `
                        <li style="margin-bottom: 0.5rem;">
                            <strong>${escaparHTML(a.nombre)}</strong>
                            <span class="chip naranja">${escaparHTML(a.frecuencia || '')}</span>
                            <br>
                            <span class="ayuda">${escaparHTML(a.descripcion || '')}</span>
                        </li>
                    `).join('')}
                </ul>

                ${cierre ? `
                    <h4 style="color: var(--carmesi); margin-bottom: 0.5rem;">
                        <i class="fas fa-flag-checkered"></i> Cierre del trimestre
                    </h4>
                    <ul style="margin-bottom: 1rem;">
                        <li style="margin-bottom: 0.5rem;">
                            <strong>${escaparHTML(cierre.nombre)}</strong>
                            <span class="chip verde">${escaparHTML(cierre.frecuencia || '')}</span>
                            <br>
                            <span class="ayuda">${escaparHTML(cierre.descripcion || '')}</span>
                        </li>
                    </ul>
                ` : ''}
            `;
        }

        btnAceptar.textContent = 'Cerrar';
        btnCancelar.textContent = 'Cerrar';

        const nuevoAceptar = btnAceptar.cloneNode(true);
        const nuevoCancelar = btnCancelar.cloneNode(true);
        btnAceptar.replaceWith(nuevoAceptar);
        btnCancelar.replaceWith(nuevoCancelar);

        modal.style.display = 'flex';

        const cerrar = () => { modal.style.display = 'none'; };
        nuevoAceptar.addEventListener('click', cerrar);
        nuevoCancelar.addEventListener('click', cerrar);
    }

    /* ========================================================
       VALIDAR (ya no bloquea: es informativa)
       ======================================================== */
    function validar() {
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
    window.SECCION6 = SECCION6;
    console.log('✅ SECCION6 expuesto en window (v2.0)');
}
