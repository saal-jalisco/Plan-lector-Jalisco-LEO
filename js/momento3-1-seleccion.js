/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3-1-seleccion.js — Sub-sección 3.1: Selección de Rutas
   ============================================================ */

const MOMENTO3_1 = (function() {

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

        const id = ESTADO.obtenerSeccion('identificacion');
        const m3 = ESTADO.obtenerSeccion('momento3');
        const r = ESTADO.obtenerSeccion('rutas');

        // Obtener reglas de filtrado según el nivel
        const reglas = DATOS.reglasFiltradoNivel[id.nivel] || {
            rutasSugeridas: ['ruta1', 'ruta2', 'ruta3', 'ruta4', 'ruta5'],
            rutasOpcionales: [],
            minimoRutas: 2,
            maximoRutas: 5,
            nota: 'Selecciona las rutas que mejor se adapten a tu escuela.'
        };

        // Rutas disponibles para el nivel (sugeridas + opcionales)
        const rutasDisponibles = [
            ...reglas.rutasSugeridas.map(id => ({ id, esSugerida: true })),
            ...reglas.rutasOpcionales.map(id => ({ id, esSugerida: false }))
        ];

        // Seleccionadas actualmente (sincronizadas con rutas.seleccionadas)
        const seleccionadas = m3.seleccionRutas.rutas || [];

        // Si no hay seleccionadas, inicializar desde rutas.seleccionadas
        if (seleccionadas.length === 0 && r.seleccionadas && r.seleccionadas.length > 0) {
            ESTADO.sincronizarRutasSeleccionadas();
        }

        // Recalcular después de sincronizar
        const m3Actualizado = ESTADO.obtenerSeccion('momento3');
        const seleccionadasActuales = m3Actualizado.seleccionRutas.rutas || [];

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <!-- ===== ENCABEZADO ===== -->
                <div class="seccion-header">
                    <h3><i class="fas fa-list-check"></i> 3.1 Selección de Rutas</h3>
                    <p class="seccion-descripcion">
                        Elige las rutas LEO que trabajará el colectivo durante el trimestre.
                        <strong>Mínimo ${reglas.minimoRutas}</strong> · <strong>Máximo ${reglas.maximoRutas}</strong>
                    </p>
                </div>

                <!-- ===== INFO DEL NIVEL ===== -->
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Nivel:</strong> ${obtenerNombreNivel(id.nivel)} ·
                    <strong>Rutas sugeridas:</strong> ${reglas.rutasSugeridas.length} ·
                    <strong>Seleccionadas:</strong> ${seleccionadasActuales.length} de ${reglas.maximoRutas}
                    <br><span class="ayuda">${reglas.nota}</span>
                </div>

                <!-- ===== CONTADOR ===== -->
                <div class="contador-rutas ${seleccionadasActuales.length < reglas.minimoRutas ? 'insuficiente' :
                                              seleccionadasActuales.length > reglas.maximoRutas ? 'excedido' : 'correcto'}">
                    <span class="contador-numero">${seleccionadasActuales.length}</span>
                    <span class="contador-texto">
                        ${seleccionadasActuales.length < reglas.minimoRutas
                            ? `Selecciona al menos ${reglas.minimoRutas - seleccionadasActuales.length} más`
                            : seleccionadasActuales.length > reglas.maximoRutas
                                ? `Excede el máximo por ${seleccionadasActuales.length - reglas.maximoRutas}`
                                : 'Cantidad correcta'}
                    </span>
                </div>

                <!-- ===== LISTA DE RUTAS DISPONIBLES ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-route"></i> Rutas disponibles para tu nivel</h3>
                    <div class="tarjeta-grid" id="lista-rutas-disponibles">
                        ${rutasDisponibles.map(rutaInfo => {
                            const ruta = DATOS.rutasLEO[rutaInfo.id];
                            if (!ruta) return '';
                            const seleccionada = seleccionadasActuales.some(s => s.rutaId === rutaInfo.id);
                            return renderizarTarjetaRuta(ruta, rutaInfo.esSugerida, seleccionada);
                        }).join('')}
                    </div>
                </div>

                <!-- ===== RUTAS SELECCIONADAS (REORDENABLES) ===== -->
                ${seleccionadasActuales.length > 0 ? `
                    <div class="form-bloque">
                        <h3><i class="fas fa-sort"></i> Orden de prioridad</h3>
                        <p class="ayuda">
                            Arrastra o usa las flechas para reordenar las rutas según la prioridad del colectivo.
                        </p>
                        <div id="lista-rutas-seleccionadas">
                            ${renderizarRutasSeleccionadas(seleccionadasActuales)}
                        </div>
                    </div>
                ` : ''}

                <!-- ===== NOTAS DEL COLECTIVO ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Notas del colectivo</h3>
                    <p class="ayuda">
                        Opcional. Escribe observaciones, acuerdos o justificaciones de la selección.
                    </p>
                    <div class="form-grupo">
                        <textarea id="notas-seleccion"
                                  placeholder="Ej. Se prioriza Ruta 1 por los resultados de Jalisco Avanza..."
                                  maxlength="600"
                                  rows="4">${m3Actualizado.seleccionRutas.notas || ''}</textarea>
                        <span class="ayuda">Máximo 600 caracteres.</span>
                    </div>
                </div>

                <!-- ===== BOTÓN CONFIRMAR ===== -->
                <div class="form-bloque" style="text-align: center;">
                    <button type="button" class="btn btn-primario" id="btn-confirmar-seleccion"
                            ${seleccionadasActuales.length < reglas.minimoRutas || seleccionadasActuales.length > reglas.maximoRutas ? 'disabled' : ''}>
                        <i class="fas fa-check"></i> Confirmar selección
                    </button>
                    ${m3Actualizado.seleccionRutas.confirmada ? `
                        <p class="ayuda" style="margin-top: 0.5rem;">
                            <i class="fas fa-check-circle" style="color: var(--verde);"></i>
                            Confirmada el ${ESTADO.fechaLegible(m3Actualizado.seleccionRutas.fechaConfirmacion)}
                        </p>
                    ` : ''}
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-${seleccionadasActuales.length >= reglas.minimoRutas && seleccionadasActuales.length <= reglas.maximoRutas ? 'exito' : 'info'}"
                     id="resumen-sub-seccion">
                    <i class="fas fa-${seleccionadasActuales.length >= reglas.minimoRutas && seleccionadasActuales.length <= reglas.maximoRutas ? 'check-circle' : 'info-circle'}"></i>
                    ${seleccionadasActuales.length < reglas.minimoRutas
                        ? `Selecciona al menos ${reglas.minimoRutas} rutas para continuar.`
                        : seleccionadasActuales.length > reglas.maximoRutas
                            ? `Has seleccionado más de ${reglas.maximoRutas} rutas. Considera priorizar.`
                            : 'Selección correcta. Puedes continuar al siguiente sub-paso.'}
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       RENDERIZAR TARJETA DE RUTA
       ======================================================== */
    function renderizarTarjetaRuta(ruta, esSugerida, seleccionada) {
        return `
            <div class="tarjeta tarjeta-ruta ${seleccionada ? 'seleccionada' : ''}"
                 data-ruta="${ruta.id}">

                <div class="flex-between mb-2">
                    <div class="flex gap-1">
                        ${esSugerida ? `<span class="chip carmesi"><i class="fas fa-star"></i> Sugerida</span>` : ''}
                        <span class="chip">Ruta ${ruta.numero}</span>
                    </div>
                    <label class="opcion-check">
                        <input type="checkbox" class="check-ruta" data-ruta="${ruta.id}"
                               ${seleccionada ? 'checked' : ''}>
                    </label>
                </div>

                <h4 style="margin: 0 0 0.5rem;">
                    🚂 ${ruta.nombre}
                </h4>
                <p class="ayuda" style="font-style: italic; margin-bottom: 0.75rem;">
                    "${ruta.lema}"
                </p>

                <div class="mb-2">
                    <strong>Necesidad que atiende:</strong>
                    <p class="ayuda">${ruta.necesidad.substring(0, 150)}...</p>
                </div>

                <div class="mb-2">
                    <strong>Virtudes:</strong>
                    <div>
                        ${ruta.virtudes.map(v => `<span class="chip">${v}</span>`).join('')}
                    </div>
                </div>

                <div class="mb-2">
                    <strong>Duración:</strong>
                    <p class="ayuda">${ruta.duracion}</p>
                </div>

                <button type="button" class="btn btn-secundario btn-sm btn-ver-actividades"
                        data-ruta="${ruta.id}">
                    <i class="fas fa-eye"></i> Ver actividades
                </button>

            </div>
        `;
    }

    /* ========================================================
       RENDERIZAR RUTAS SELECCIONADAS (REORDENABLES)
       ======================================================== */
    function renderizarRutasSeleccionadas(seleccionadas) {
        return seleccionadas.map((sel, i) => {
            const ruta = DATOS.rutasLEO[sel.rutaId];
            if (!ruta) return '';
            return `
                <div class="tarjeta tarjeta-seleccionada" data-ruta="${sel.rutaId}">
                    <div class="flex-between">
                        <div>
                            <strong>${i + 1}. ${ruta.nombre}</strong>
                            <p class="ayuda" style="margin: 0.25rem 0 0;">
                                <em>${ruta.lema}</em>
                            </p>
                        </div>
                        <div class="flex gap-1">
                            <button type="button" class="btn btn-icono btn-secundario btn-subir"
                                    data-ruta="${sel.rutaId}" ${i === 0 ? 'disabled' : ''}
                                    title="Subir">
                                <i class="fas fa-arrow-up"></i>
                            </button>
                            <button type="button" class="btn btn-icono btn-secundario btn-bajar"
                                    data-ruta="${sel.rutaId}" ${i === seleccionadas.length - 1 ? 'disabled' : ''}
                                    title="Bajar">
                                <i class="fas fa-arrow-down"></i>
                            </button>
                            <button type="button" class="btn btn-icono btn-peligro btn-quitar"
                                    data-ruta="${sel.rutaId}" title="Quitar">
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
            check.addEventListener('change', manejarSeleccion);
        });

        // Botones de reordenamiento
        contenedor.querySelectorAll('.btn-subir').forEach(btn => {
            btn.addEventListener('click', (e) => moverRuta(e.currentTarget.dataset.ruta, -1));
        });
        contenedor.querySelectorAll('.btn-bajar').forEach(btn => {
            btn.addEventListener('click', (e) => moverRuta(e.currentTarget.dataset.ruta, 1));
        });
        contenedor.querySelectorAll('.btn-quitar').forEach(btn => {
            btn.addEventListener('click', (e) => quitarRuta(e.currentTarget.dataset.ruta));
        });

        // Ver actividades
        contenedor.querySelectorAll('.btn-ver-actividades').forEach(btn => {
            btn.addEventListener('click', (e) => abrirModalActividades(e.currentTarget.dataset.ruta));
        });

        // Notas
        const notas = document.getElementById('notas-seleccion');
        if (notas) {
            notas.addEventListener('input', (e) => {
                ESTADO.actualizarCampo('momento3', 'seleccionRutas', {
                    ...ESTADO.obtenerSeccion('momento3').seleccionRutas,
                    notas: e.target.value
                });
            });
        }

        // Confirmar selección
        const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', confirmarSeleccion);
        }
    }

    /* ========================================================
       MANEJAR SELECCIÓN
       ======================================================== */
    function manejarSeleccion(e) {
        const rutaId = e.target.dataset.ruta;
        const m3 = ESTADO.obtenerSeccion('momento3');
        let rutas = [...(m3.seleccionRutas.rutas || [])];

        if (e.target.checked) {
            if (!rutas.some(r => r.rutaId === rutaId)) {
                rutas.push({ rutaId, orden: rutas.length });
            }
        } else {
            rutas = rutas.filter(r => r.rutaId !== rutaId);
            rutas.forEach((r, i) => r.orden = i);
        }

        // Actualizar en el estado
        ESTADO.actualizarCampo('momento3', 'seleccionRutas', {
            ...m3.seleccionRutas,
            rutas,
            confirmada: false
        });

        // Sincronizar con rutas.seleccionadas (para el Termómetro)
        ESTADO.actualizarCampo('rutas', 'seleccionadas', rutas.map(r => ({
            rutaId: r.rutaId,
            orden: r.orden
        })));

        // Re-renderizar
        renderizar();
    }

    /* ========================================================
       MOVER RUTA
       ======================================================== */
    function moverRuta(rutaId, direccion) {
        const m3 = ESTADO.obtenerSeccion('momento3');
        const rutas = [...(m3.seleccionRutas.rutas || [])];
        const index = rutas.findIndex(r => r.rutaId === rutaId);
        if (index === -1) return;

        const nuevoIndex = index + direccion;
        if (nuevoIndex < 0 || nuevoIndex >= rutas.length) return;

        [rutas[index], rutas[nuevoIndex]] = [rutas[nuevoIndex], rutas[index]];
        rutas.forEach((r, i) => r.orden = i);

        ESTADO.actualizarCampo('momento3', 'seleccionRutas', {
            ...m3.seleccionRutas,
            rutas
        });

        // Sincronizar con rutas.seleccionadas
        ESTADO.actualizarCampo('rutas', 'seleccionadas', rutas.map(r => ({
            rutaId: r.rutaId,
            orden: r.orden
        })));

        renderizar();
    }

    /* ========================================================
       QUITAR RUTA
       ======================================================== */
    function quitarRuta(rutaId) {
        const m3 = ESTADO.obtenerSeccion('momento3');
        const rutas = (m3.seleccionRutas.rutas || []).filter(r => r.rutaId !== rutaId);
        rutas.forEach((r, i) => r.orden = i);

        ESTADO.actualizarCampo('momento3', 'seleccionRutas', {
            ...m3.seleccionRutas,
            rutas,
            confirmada: false
        });

        // Sincronizar con rutas.seleccionadas
        ESTADO.actualizarCampo('rutas', 'seleccionadas', rutas.map(r => ({
            rutaId: r.rutaId,
            orden: r.orden
        })));

        renderizar();
    }

    /* ========================================================
       CONFIRMAR SELECCIÓN
       ======================================================== */
    function confirmarSeleccion() {
        const id = ESTADO.obtenerSeccion('identificacion');
        const m3 = ESTADO.obtenerSeccion('momento3');
        const reglas = DATOS.reglasFiltradoNivel[id.nivel] || { minimoRutas: 2, maximoRutas: 5 };
        const rutas = m3.seleccionRutas.rutas || [];

        if (rutas.length < reglas.minimoRutas) {
            APP.mostrarToast(`Selecciona al menos ${reglas.minimoRutas} rutas.`, 'error');
            return;
        }
        if (rutas.length > reglas.maximoRutas) {
            APP.mostrarToast(`Selecciona máximo ${reglas.maximoRutas} rutas.`, 'error');
            return;
        }

        ESTADO.confirmarSeleccionRutas();
        APP.mostrarToast('¡Selección de rutas confirmada!', 'exito');
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

            <h4 style="color: var(--carmesi); margin-bottom: 0.5rem;">
                <i class="fas fa-star"></i> Actividades esenciales
            </h4>
            <ul style="margin-bottom: 1rem;">
                ${ruta.actividadesEsenciales.map(a => `
                    <li>
                        <strong>${a.nombre}</strong><br>
                        <span class="chip">${a.nivel}</span>
                        <span class="chip naranja">${a.frecuencia}</span>
                    </li>
                `).join('')}
            </ul>

            ${ruta.actividadesOpcionales && ruta.actividadesOpcionales.length > 0 ? `
                <h4 style="color: var(--carmesi); margin-bottom: 0.5rem;">
                    <i class="fas fa-plus-circle"></i> Actividades opcionales
                </h4>
                <ul style="margin-bottom: 1rem;">
                    ${ruta.actividadesOpcionales.map(a => `
                        <li>
                            <strong>${a.nombre}</strong><br>
                            <span class="chip">${a.nivel}</span>
                            <span class="chip naranja">${a.frecuencia}</span>
                        </li>
                    `).join('')}
                </ul>
            ` : ''}

            <h4 style="color: var(--carmesi); margin-bottom: 0.5rem;">
                <i class="fas fa-chart-line"></i> Indicadores
            </h4>
            <p><strong>Cuantitativo:</strong> ${ruta.indicadores.cuanti}</p>
            <p><strong>Cualitativo:</strong> ${ruta.indicadores.cuali}</p>

            <h4 style="color: var(--carmesi); margin-bottom: 0.5rem; margin-top: 1rem;">
                <i class="fas fa-link"></i> Conexión
            </h4>
            <p><strong>Vagones de Lectura:</strong> ${ruta.conexionVagones}</p>
            <p><strong>LEO en familia:</strong> ${ruta.conexionFamilia}</p>
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
       HELPER: OBTENER NOMBRE DEL NIVEL
       ======================================================== */
    function obtenerNombreNivel(nivelId) {
        const nivel = DATOS.niveles.find(n => n.id === nivelId);
        return nivel ? `${nivel.nombre} (${nivel.rango})` : 'No especificado';
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        renderizar
    };

})();
