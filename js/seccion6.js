/* ============================================================
   PLAN LECTOR JALISCO LEO
   seccion6.js — Sección 6: Rutas Sugeridas
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
       RENDERIZAR
       ======================================================== */
    function renderizar() {
        const r = ESTADO.obtenerSeccion('rutas');
        const t = ESTADO.obtenerSeccion('termometro');
        const id = ESTADO.obtenerSeccion('identificacion');

        // Obtener reglas de filtrado según el nivel
        const reglas = DATOS.reglasFiltradoNivel[id.nivel] || {
            rutasSugeridas: ['ruta1', 'ruta2', 'ruta3', 'ruta4', 'ruta5'],
            rutasOpcionales: [],
            minimoRutas: 2,
            maximoRutas: 5,
            nota: 'Selecciona las rutas que mejor se adapten a tu escuela.'
        };

        // Calcular rutas sugeridas desde el motor (solo las que aplican al nivel)
        const sugeridas = calcularRutasSugeridas(t.dimensiones || {}, reglas, id.nivel);

        // Guardar en estado
        if (!r.sugeridas || r.sugeridas.length === 0) {
            ESTADO.actualizarCampo('rutas', 'sugeridas', sugeridas);
        }

        const rutasActuales = r.sugeridas && r.sugeridas.length > 0 ? r.sugeridas : sugeridas;
        const seleccionadas = r.seleccionadas || [];

        // Validar mínimo y máximo
        const validacion = validarCantidadRutas(seleccionadas, reglas);

        contenedor.innerHTML = `
            <div class="form-seccion">

                <!-- ===== INFORMACIÓN DEL NIVEL ===== -->
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Nivel educativo:</strong> ${obtenerNombreNivel(id.nivel)} ·
                    <strong>Rutas sugeridas:</strong> ${reglas.rutasSugeridas.length} ·
                    <strong>Mínimo a seleccionar:</strong> ${reglas.minimoRutas} ·
                    <strong>Máximo:</strong> ${reglas.maximoRutas}
                    <br><span class="ayuda">${reglas.nota}</span>
                </div>

                <!-- ===== ALERTA SI > MÁXIMO ===== -->
                ${seleccionadas.length > reglas.maximoRutas ? `
                    <div class="caja-alerta">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Atención:</strong> Han seleccionado más de ${reglas.maximoRutas} rutas para un trimestre.
                        Consideren priorizar para no dispersar los esfuerzos.
                    </div>
                ` : ''}

                <!-- ===== ALERTA SI < MÍNIMO ===== -->
                ${seleccionadas.length > 0 && seleccionadas.length < reglas.minimoRutas ? `
                    <div class="caja-alerta">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Atención:</strong> Deben seleccionar al menos ${reglas.minimoRutas} rutas para el trimestre.
                    </div>
                ` : ''}

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
                        <h3><i class="fas fa-list-check"></i> Selección del colectivo</h3>
                        <p class="ayuda">
                            Marca las rutas que trabajarán este trimestre.
                            Puedes reordenarlas con las flechas.
                            <br><strong>Seleccionadas:</strong> ${seleccionadas.length} de ${rutasActuales.length}
                        </p>

                        <div id="lista-seleccionadas">
                            ${renderizarSeleccionadas(rutasActuales, seleccionadas)}
                        </div>
                    </div>
                ` : ''}

                <!-- ===== NOTAS DEL COLECTIVO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Notas del colectivo</h3>
                    <p class="ayuda">Solo en la Hoja de Ruta (no en el Acta).</p>
                    <div class="form-grupo">
                        <textarea id="notas-rutas" placeholder="Escribe 3 o 4 enunciados máximo..." maxlength="600">${r.notas || ''}</textarea>
                    </div>
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-info" id="resumen-seccion6">
                    <i class="fas fa-info-circle"></i>
                    Selecciona al menos ${reglas.minimoRutas} ruta(s) para continuar.
                </div>

            </div>
        `;

        suscribirEventos();
        validar();
    }

    /* ========================================================
       CALCULAR RUTAS SUGERIDAS (MOTOR + FILTRO POR NIVEL)
       ======================================================== */
    function calcularRutasSugeridas(dimensiones, reglas, nivelId) {
        const resultado = [];
        const reglasMotor = DATOS.motorRecomendacion.reglas;

        // Filtrar solo las rutas que aplican al nivel
        const rutasPermitidas = [
            ...reglas.rutasSugeridas,
            ...reglas.rutasOpcionales
        ];

        reglasMotor.forEach(regla => {
            // Solo considerar rutas permitidas para este nivel
            if (!rutasPermitidas.includes(regla.rutaId)) return;

            const gatillosActivos = regla.dimensionesGatillo.filter(dim => {
                const color = dimensiones[dim];
                return color === 'rojo' || color === 'amarillo';
            });

            if (gatillosActivos.length === 0) return;

            const rojos = gatillosActivos.filter(dim => dimensiones[dim] === 'rojo').length;

            // Prioridad
            let prioridad = 'BAJA';
            if (rojos >= 3) prioridad = 'ALTA';
            else if (rojos === 2) prioridad = 'MEDIA';

            const rutaDef = DATOS.rutasLEO[regla.rutaId];
            if (!rutaDef) return;

            // Ajustar prioridad si la ruta es sugerida (no opcional)
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
       VALIDAR CANTIDAD DE RUTAS
       ======================================================== */
    function validarCantidadRutas(seleccionadas, reglas) {
        const cantidad = seleccionadas.length;
        return {
            cumpleMinimo: cantidad >= reglas.minimoRutas,
            cumpleMaximo: cantidad <= reglas.maximoRutas,
            cantidad,
            minimo: reglas.minimoRutas,
            maximo: reglas.maximoRutas
        };
    }

    /* ========================================================
       OBTENER NOMBRE DEL NIVEL
       ======================================================== */
    function obtenerNombreNivel(nivelId) {
        const nivel = DATOS.niveles.find(n => n.id === nivelId);
        return nivel ? `${nivel.nombre} (${nivel.rango})` : 'No especificado';
    }

    /* ========================================================
       RENDERIZAR TARJETA DE RUTA
       ======================================================== */
    function renderizarTarjetaRuta(s, seleccionadas) {
        const seleccionada = seleccionadas.some(sel => sel.rutaId === s.rutaId);
        const coloresPrioridad = { ALTA: 'rojo', MEDIA: 'amarillo', BAJA: 'verde' };

        return `
            <div class="tarjeta tarjeta-ruta ${seleccionada ? 'seleccionada' : ''}"
                 data-ruta="${s.rutaId}"
                 style="border-left-color: var(--${coloresPrioridad[s.prioridad]});">

                <div class="flex-between mb-2">
                    <span class="chip ${coloresPrioridad[s.prioridad]}">
                        <i class="fas fa-flag"></i> ${s.prioridad}
                    </span>
                    ${s.esSugerida ? `<span class="chip carmesi"><i class="fas fa-star"></i> Sugerida</span>` : ''}
                    <label class="opcion-check">
                        <input type="checkbox" class="check-ruta" data-ruta="${s.rutaId}"
                               ${seleccionada ? 'checked' : ''}>
                    </label>
                </div>

                <h4 style="margin:0 0 0.5rem;">🚂 ${s.ruta.nombre}</h4>
                <p class="ayuda" style="font-style: italic; margin-bottom: 0.75rem;">
                    "${s.ruta.lema}"
                </p>

                <div class="mb-2">
                    <strong>Dimensiones gatillo (${s.dimensionesGatillo.length}):</strong>
                    <div>
                        ${s.dimensionesGatillo.map(dimId => {
                            const dimDef = DATOS.dimensiones.find(d => d.id === dimId);
                            const color = ESTADO.obtenerSeccion('termometro').dimensiones?.[dimId];
                            return `<span class="chip ${color || 'gris'}">${dimDef?.nombre || dimId}</span>`;
                        }).join('')}
                    </div>
                </div>

                <div class="mb-2">
                    <strong>Enfoque:</strong>
                    <p class="ayuda">${s.ruta.necesidad.substring(0, 120)}...</p>
                </div>

                <div class="mb-2">
                    <strong>Virtudes:</strong>
                    <div>
                        ${s.ruta.virtudes.map(v => `<span class="chip">${v}</span>`).join('')}
                    </div>
                </div>

                <button type="button" class="btn btn-secundario btn-sm btn-ver-actividades" data-ruta="${s.rutaId}">
                    <i class="fas fa-eye"></i> Ver actividades
                </button>
            </div>
        `;
    }

    /* ========================================================
       RENDERIZAR SELECCIONADAS
       ======================================================== */
    function renderizarSeleccionadas(rutasActuales, seleccionadas) {
        if (seleccionadas.length === 0) {
            return `<p class="ayuda">Aún no has seleccionado rutas.</p>`;
        }

        return seleccionadas.map((sel, i) => {
            const s = rutasActuales.find(r => r.rutaId === sel.rutaId);
            if (!s) return '';

            return `
                <div class="tarjeta tarjeta-seleccionada" data-ruta="${sel.rutaId}">
                    <div class="flex-between">
                        <div>
                            <strong>${i + 1}. ${s.ruta.nombre}</strong>
                            <span class="chip ${s.prioridad === 'ALTA' ? 'rojo' : s.prioridad === 'MEDIA' ? 'amarillo' : 'verde'}">${s.prioridad}</span>
                        </div>
                        <div class="flex gap-1">
                            <button type="button" class="btn btn-icono btn-secundario btn-subir" data-ruta="${sel.rutaId}" ${i === 0 ? 'disabled' : ''}>
                                <i class="fas fa-arrow-up"></i>
                            </button>
                            <button type="button" class="btn btn-icono btn-secundario btn-bajar" data-ruta="${sel.rutaId}" ${i === seleccionadas.length - 1 ? 'disabled' : ''}>
                                <i class="fas fa-arrow-down"></i>
                            </button>
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
        // Checkboxes de rutas
        contenedor.querySelectorAll('.check-ruta').forEach(check => {
            check.addEventListener('change', manejarSeleccionRuta);
        });

        // Ver actividades
        contenedor.querySelectorAll('.btn-ver-actividades').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rutaId = e.currentTarget.dataset.ruta;
                abrirModalActividades(rutaId);
            });
        });

        // Subir / Bajar / Quitar
        contenedor.querySelectorAll('.btn-subir').forEach(btn => {
            btn.addEventListener('click', (e) => moverRuta(e.currentTarget.dataset.ruta, -1));
        });
        contenedor.querySelectorAll('.btn-bajar').forEach(btn => {
            btn.addEventListener('click', (e) => moverRuta(e.currentTarget.dataset.ruta, 1));
        });
        contenedor.querySelectorAll('.btn-quitar').forEach(btn => {
            btn.addEventListener('click', (e) => quitarRuta(e.currentTarget.dataset.ruta));
        });

        // Notas
        const notas = document.getElementById('notas-rutas');
        if (notas) {
            notas.addEventListener('input', (e) => {
                ESTADO.actualizarCampo('rutas', 'notas', e.target.value);
            });
        }
    }

    /* ========================================================
       MANEJAR SELECCIÓN
       ======================================================== */
    function manejarSeleccionRuta(e) {
        const rutaId = e.target.dataset.ruta;
        const r = ESTADO.obtenerSeccion('rutas');
        let seleccionadas = [...(r.seleccionadas || [])];

        if (e.target.checked) {
            if (!seleccionadas.some(s => s.rutaId === rutaId)) {
                seleccionadas.push({ rutaId, orden: seleccionadas.length });
            }
        } else {
            seleccionadas = seleccionadas.filter(s => s.rutaId !== rutaId);
            seleccionadas.forEach((s, i) => s.orden = i);
        }

        ESTADO.actualizarCampo('rutas', 'seleccionadas', seleccionadas);
        renderizar();
    }

    /* ========================================================
       MOVER RUTA
       ======================================================== */
    function moverRuta(rutaId, direccion) {
        const r = ESTADO.obtenerSeccion('rutas');
        const seleccionadas = [...(r.seleccionadas || [])];
        const index = seleccionadas.findIndex(s => s.rutaId === rutaId);
        if (index === -1) return;

        const nuevoIndex = index + direccion;
        if (nuevoIndex < 0 || nuevoIndex >= seleccionadas.length) return;

        [seleccionadas[index], seleccionadas[nuevoIndex]] = [seleccionadas[nuevoIndex], seleccionadas[index]];
        seleccionadas.forEach((s, i) => s.orden = i);

        ESTADO.actualizarCampo('rutas', 'seleccionadas', seleccionadas);
        renderizar();
    }

    /* ========================================================
       QUITAR RUTA
       ======================================================== */
    function quitarRuta(rutaId) {
        const r = ESTADO.obtenerSeccion('rutas');
        const seleccionadas = (r.seleccionadas || []).filter(s => s.rutaId !== rutaId);
        seleccionadas.forEach((s, i) => s.orden = i);
        ESTADO.actualizarCampo('rutas', 'seleccionadas', seleccionadas);
        renderizar();
    }

    /* ========================================================
       MODAL DE ACTIVIDADES
       ======================================================== */
    function abrirModalActividades(rutaId) {
        const ruta = DATOS.rutasLEO[rutaId];
        if (!ruta) return;

        const modal = document.getElementById('modal-confirmacion');
        const titulo = document.getElementById('modal-titulo');
        const mensaje = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        titulo.textContent = `🚂 ${ruta.nombre}`;
        mensaje.innerHTML = `
            <p style="font-style: italic; margin-bottom: 1rem;">"${ruta.lema}"</p>

            <h4 style="color: var(--carmesi); margin-bottom: 0.5rem;">Actividades esenciales</h4>
            <ul style="margin-bottom: 1rem;">
                ${ruta.actividadesEsenciales.map(a => `
                    <li><strong>${a.nombre}</strong> · <span class="chip">${a.nivel}</span> <span class="chip naranja">${a.frecuencia}</span></li>
                `).join('')}
            </ul>

            ${ruta.actividadesOpcionales && ruta.actividadesOpcionales.length > 0 ? `
                <h4 style="color: var(--carmesi); margin-bottom: 0.5rem;">Actividades opcionales</h4>
                <ul style="margin-bottom: 1rem;">
                    ${ruta.actividadesOpcionales.map(a => `
                        <li><strong>${a.nombre}</strong> · <span class="chip">${a.nivel}</span> <span class="chip naranja">${a.frecuencia}</span></li>
                    `).join('')}
                </ul>
            ` : ''}

            <h4 style="color: var(--carmesi); margin-bottom: 0.5rem;">Indicadores</h4>
            <p><strong>Cuantitativo:</strong> ${ruta.indicadores.cuanti}</p>
            <p><strong>Cualitativo:</strong> ${ruta.indicadores.cuali}</p>
        `;

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
       VALIDAR SECCIÓN
       ======================================================== */
    function validar() {
        const r = ESTADO.obtenerSeccion('rutas');
        const id = ESTADO.obtenerSeccion('identificacion');
        const resumen = document.getElementById('resumen-seccion6');
        if (!resumen) return false;

        const reglas = DATOS.reglasFiltradoNivel[id.nivel] || {
            minimoRutas: 2,
            maximoRutas: 5
        };

        const seleccionadas = r.seleccionadas || [];
        const cumpleMinimo = seleccionadas.length >= reglas.minimoRutas;
        const cumpleMaximo = seleccionadas.length <= reglas.maximoRutas;

        if (cumpleMinimo && cumpleMaximo) {
            resumen.className = 'caja-exito';
            resumen.innerHTML = `<i class="fas fa-check-circle"></i> ${seleccionadas.length} ruta(s) seleccionada(s). Puedes continuar.`;
            ESTADO.notificar('seccion6Validada', { completa: true });
            return true;
        } else if (!cumpleMinimo) {
            resumen.className = 'caja-info';
            resumen.innerHTML = `<i class="fas fa-info-circle"></i> Selecciona al menos ${reglas.minimoRutas} ruta(s) para continuar.`;
            ESTADO.notificar('seccion6Validada', { completa: false });
            return false;
        } else {
            resumen.className = 'caja-alerta';
            resumen.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Has seleccionado más de ${reglas.maximoRutas} rutas. Considera priorizar.`;
            ESTADO.notificar('seccion6Validada', { completa: false });
            return false;
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
