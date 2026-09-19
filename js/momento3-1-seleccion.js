/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento3-1-seleccion.js — Sub-sección 3.1: Selección de Ruta
   Flujo en 3 pasos: Nivel → Ruta → Actividades
   v2.0 — Adaptado a 1 ruta por trimestre + niveles no disponibles
   ============================================================ */

const MOMENTO3_1 = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;
    let pasoActual = 1; // 1, 2, 3
    let nivelElegido = null;
    let rutaExpandida = null; // Para el "ver más" en el paso 2

    const MIN_BANCO = 2;
    const MAX_BANCO = 3;

    /* ========================================================
       RENDERIZAR (llamado por MOMENTO3)
       ======================================================== */
    function renderizar(cont) {
        contenedor = cont || document.getElementById('contenido-sub-seccion');
        if (!contenedor) return;

        // Sincronizar nivel y ruta desde el estado
        const id = obtenerIdentificacion();
        const m3 = obtenerM3();

        // Paso 1: nivel. Si ya hay ruta elegida, saltar al paso 3.
        if (m3.seleccionRutas && m3.seleccionRutas.rutaId) {
            pasoActual = 3;
            nivelElegido = m3.seleccionRutas.nivel || id.nivel;
        } else if (m3.seleccionRutas && m3.seleccionRutas.nivel) {
            pasoActual = 2;
            nivelElegido = m3.seleccionRutas.nivel;
        } else {
            pasoActual = 1;
            nivelElegido = id.nivel || null;
        }

        // Si no hay nivel en identificación, avisar
        if (!id.nivel && pasoActual === 1) {
            renderizarPaso1SinNivel();
            return;
        }

        switch (pasoActual) {
            case 1: renderizarPaso1(); break;
            case 2: renderizarPaso2(); break;
            case 3: renderizarPaso3(); break;
            default: renderizarPaso1();
        }
    }

    /* ========================================================
       HELPERS DEFENSIVOS
       ======================================================== */
    function obtenerIdentificacion() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try { return ESTADO.obtenerSeccion('identificacion') || {}; }
            catch (e) { /* silencio */ }
        }
        return {};
    }

    function obtenerM3() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try {
                const m3 = ESTADO.obtenerSeccion('momento3') || {};
                if (!m3.seleccionRutas) {
                    m3.seleccionRutas = {
                        nivel: null,
                        rutaId: null,
                        bancoSeleccionado: [],
                        cierreMes: null,
                        notas: '',
                        confirmada: false
                    };
                }
                return m3;
            } catch (e) { /* silencio */ }
        }
        return {
            seleccionRutas: {
                nivel: null,
                rutaId: null,
                bancoSeleccionado: [],
                cierreMes: null,
                notas: '',
                confirmada: false
            }
        };
    }

    function guardarSeleccionRutas(cambios) {
        if (typeof ESTADO === 'undefined' || typeof ESTADO.actualizarCampo !== 'function') return;
        const m3 = obtenerM3();
        const nuevo = { ...m3.seleccionRutas, ...cambios };
        try {
            ESTADO.actualizarCampo('momento3', 'seleccionRutas', nuevo);
        } catch (e) {
            console.warn('⚠️ No se pudo guardar seleccionRutas:', e);
        }
    }

    function obtenerNombreNivel(nivelId) {
        if (!nivelId || typeof DATOS === 'undefined') return '—';
        const nivel = DATOS.niveles.find(n => n.id === nivelId);
        return nivel ? `${nivel.nombre} (${nivel.rango})` : nivelId;
    }

    function obtenerReglas(nivelId) {
        if (!nivelId || typeof DATOS === 'undefined') return null;
        return DATOS.reglasFiltradoNivel[nivelId] || null;
    }

    /* ========================================================
       PASO 1 — ELEGIR NIVEL
       ======================================================== */
    function renderizarPaso1() {
        const id = obtenerIdentificacion();
        const nivelActual = nivelElegido || id.nivel;

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <div class="seccion-header">
                    <h3><i class="fas fa-list-check"></i> 3.1 Selección de Ruta</h3>
                    <p class="seccion-descripcion">
                        Elige <strong>una ruta LEO por trimestre</strong>. Primero confirma el nivel educativo.
                    </p>
                </div>

                <!-- ===== INDICADOR DE PASOS ===== -->
                ${renderizarIndicadorPasos(1)}

                <!-- ===== INFO DEL NIVEL DETECTADO ===== -->
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Nivel detectado del diagnóstico:</strong>
                    ${obtenerNombreNivel(id.nivel) || 'No especificado'}
                    ${id.nivel ? '' : '<br><span class="ayuda">No hay nivel registrado en la sección de Identificación. Selecciona uno aquí abajo.</span>'}
                </div>

                <!-- ===== SELECTOR DE NIVEL ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-graduation-cap"></i> Confirma el nivel educativo</h3>
                    <p class="ayuda">
                        La ruta debe ser pertinente para el nivel de las y los estudiantes.
                        Si el diagnóstico fue para varios niveles, elige el que trabajará la ruta este trimestre.
                    </p>

                    <div class="tarjeta-grid" id="selector-nivel">
                        ${DATOS.niveles.map(n => {
                            const reglas = DATOS.reglasFiltradoNivel[n.id];
                            const esActual = nivelActual === n.id;
                            const numDisponibles = reglas
                                ? (reglas.rutasSugeridas.length + reglas.rutasOpcionales.length)
                                : 0;
                            return `
                                <button type="button"
                                        class="tarjeta tarjeta-nivel ${esActual ? 'seleccionada' : ''}"
                                        data-nivel="${n.id}">
                                    <div class="flex-between mb-2">
                                        <strong>${n.nombre}</strong>
                                        <span class="chip">${n.rango}</span>
                                    </div>
                                    <p class="ayuda" style="margin: 0.25rem 0;">
                                        ${n.grados.join(' · ')}
                                    </p>
                                    <p class="ayuda" style="margin-top: 0.5rem;">
                                        <strong>${numDisponibles}</strong> ruta(s) disponible(s)
                                    </p>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- ===== BOTÓN CONTINUAR ===== -->
                <div class="form-bloque" style="text-align: center;">
                    <button type="button" class="btn btn-primario" id="btn-ir-paso2"
                            ${nivelActual ? '' : 'disabled'}>
                        Continuar a explorar rutas <i class="fas fa-arrow-right"></i>
                    </button>
                </div>

            </div>
        `;

        suscribirPaso1();
    }

    function renderizarPaso1SinNivel() {
        // Aunque no haya nivel, mostramos el selector. Es lo mismo que renderizarPaso1.
        renderizarPaso1();
    }

    function suscribirPaso1() {
        contenedor.querySelectorAll('.tarjeta-nivel').forEach(btn => {
            btn.addEventListener('click', () => {
                const nivel = btn.dataset.nivel;
                nivelElegido = nivel;
                // Visual
                contenedor.querySelectorAll('.tarjeta-nivel').forEach(b => {
                    b.classList.toggle('seleccionada', b.dataset.nivel === nivel);
                });
                // Habilitar botón
                const btnIr = document.getElementById('btn-ir-paso2');
                if (btnIr) btnIr.disabled = false;
                // Guardar
                guardarSeleccionRutas({
                    nivel,
                    // Si cambia el nivel, reseteamos ruta y banco porque pueden dejar de ser válidos
                    rutaId: null,
                    bancoSeleccionado: [],
                    cierreMes: null,
                    confirmada: false
                });
            });
        });

        const btnIr = document.getElementById('btn-ir-paso2');
        if (btnIr) {
            btnIr.addEventListener('click', () => {
                if (!nivelElegido) return;
                pasoActual = 2;
                renderizar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    /* ========================================================
       PASO 2 — EXPLORAR RUTAS
       ======================================================== */
    function renderizarPaso2() {
        const reglas = obtenerReglas(nivelElegido);
        if (!reglas) {
            contenedor.innerHTML = `
                <div class="caja-alerta">
                    <i class="fas fa-exclamation-triangle"></i>
                    No hay reglas definidas para el nivel <strong>${nivelElegido}</strong>.
                </div>
            `;
            return;
        }

        // Construir lista de rutas con su disponibilidad
        const rutasInfo = [];

        // Sugeridas primero
        reglas.rutasSugeridas.forEach(id => {
            rutasInfo.push({ rutaId: id, tipo: 'sugerida' });
        });
        reglas.rutasOpcionales.forEach(id => {
            rutasInfo.push({ rutaId: id, tipo: 'opcional' });
        });

        // Completar con las que faltan (todas las rutas que existan y no estén listadas)
        Object.keys(DATOS.rutasLEO).forEach(id => {
            if (!rutasInfo.some(r => r.rutaId === id)) {
                rutasInfo.push({ rutaId: id, tipo: 'no-listada' });
            }
        });

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <div class="seccion-header">
                    <h3><i class="fas fa-list-check"></i> 3.1 Selección de Ruta</h3>
                    <p class="seccion-descripcion">
                        Explora las rutas disponibles para <strong>${obtenerNombreNivel(nivelElegido)}</strong>
                        y elige <strong>una</strong>.
                    </p>
                </div>

                ${renderizarIndicadorPasos(2)}

                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Nivel:</strong> ${obtenerNombreNivel(nivelElegido)} ·
                    ${reglas.rutaUnica ? '<strong>1 ruta por trimestre</strong>' : ''}
                    <br><span class="ayuda">${reglas.nota}</span>
                </div>

                <!-- ===== FILTRO RÁPIDO ===== -->
                <div class="form-bloque">
                    <div class="flex-between" style="flex-wrap: wrap; gap: 0.5rem;">
                        <h3 style="margin: 0;"><i class="fas fa-compass"></i> Las 5 Rutas LEO</h3>
                        <div class="flex gap-1" style="flex-wrap: wrap;">
                            <span class="chip verde"><i class="fas fa-star"></i> Sugerida</span>
                            <span class="chip naranja"><i class="fas fa-circle"></i> Opcional</span>
                            <span class="chip gris"><i class="fas fa-ban"></i> No disponible</span>
                        </div>
                    </div>

                    <div class="tarjeta-grid" style="margin-top: 1rem;">
                        ${rutasInfo.map(info => renderizarTarjetaRuta(info)).join('')}
                    </div>
                </div>

                <!-- ===== BOTONES NAVEGACIÓN ===== -->
                <div class="form-bloque" style="text-align: center;">
                    <button type="button" class="btn btn-secundario" id="btn-volver-paso1">
                        <i class="fas fa-arrow-left"></i> Cambiar nivel
                    </button>
                </div>

            </div>
        `;

        suscribirPaso2();
    }

    function renderizarTarjetaRuta(info) {
        const ruta = DATOS.rutasLEO[info.rutaId];
        if (!ruta) return '';

        const nivelData = ruta.niveles[nivelElegido];
        const disponible = nivelData && nivelData.disponible !== false;

        const badgeTipo = info.tipo === 'sugerida'
            ? '<span class="chip verde"><i class="fas fa-star"></i> Sugerida</span>'
            : info.tipo === 'opcional'
                ? '<span class="chip naranja"><i class="fas fa-circle"></i> Opcional</span>'
                : '';

        if (!disponible) {
            const razon = nivelData?.razonNoDisponible || 'No hay actividades propias para este nivel.';
            return `
                <div class="tarjeta tarjeta-ruta deshabilitada">
                    <div class="flex-between mb-2">
                        <span class="chip">Ruta ${ruta.numero}</span>
                        <span class="chip gris"><i class="fas fa-ban"></i> No disponible</span>
                    </div>
                    <h4 style="margin: 0 0 0.5rem;">${ruta.nombre}</h4>
                    <p class="ayuda" style="font-style: italic; margin-bottom: 0.75rem;">
                        "${ruta.lema}"
                    </p>
                    <div class="caja-alerta" style="margin: 0;">
                        <i class="fas fa-info-circle"></i>
                        <span class="ayuda">${razon}</span>
                    </div>
                </div>
            `;
        }

        // Calcular cuántas anclas/banco/cierre hay
        const nAnclas = nivelData.anclas?.length || 0;
        const nBanco = nivelData.banco?.length || 0;
        const tieneCierre = !!nivelData.cierre;

        const expandida = rutaExpandida === info.rutaId;

        return `
            <div class="tarjeta tarjeta-ruta ${expandida ? 'expandida' : ''}" data-ruta="${info.rutaId}">
                <div class="flex-between mb-2">
                    <div class="flex gap-1" style="flex-wrap: wrap;">
                        <span class="chip">Ruta ${ruta.numero}</span>
                        ${badgeTipo}
                    </div>
                </div>

                <h4 style="margin: 0 0 0.5rem;">${ruta.nombre}</h4>
                <p class="ayuda" style="font-style: italic; margin-bottom: 0.75rem;">
                    "${ruta.lema}"
                </p>

                <!-- PREGUNTA ORIENTADORA -->
                <div class="caja-info" style="margin: 0.75rem 0; padding: 0.75rem;">
                    <strong>${ruta.preguntaOrientadora}</strong>
                    <br><span class="ayuda">${ruta.subtituloPregunta}</span>
                </div>

                <!-- PROPOSITO CORTO -->
                <div class="mb-2">
                    <strong>Propósito:</strong>
                    <p class="ayuda">${ruta.proposito.substring(0, 140)}${ruta.proposito.length > 140 ? '…' : ''}</p>
                </div>

                <!-- VIRTUDES -->
                <div class="mb-2">
                    <strong>Virtudes:</strong>
                    <div style="margin-top: 0.25rem;">
                        ${ruta.virtudes.map(v => `<span class="chip">${v}</span>`).join('')}
                    </div>
                </div>

                <!-- ESTRUCTURA DEL NIVEL -->
                <div class="mb-2">
                    <span class="chip carmesi">${nAnclas} anclas</span>
                    <span class="chip naranja">${nBanco} en banco</span>
                    ${tieneCierre ? '<span class="chip verde">1 cierre</span>' : ''}
                </div>

                <!-- DETALLE EXPANDIDO -->
                ${expandida ? renderizarDetalleRuta(ruta, nivelData) : ''}

                <!-- ACCIONES -->
                <div class="flex gap-1" style="flex-wrap: wrap; margin-top: 0.75rem;">
                    <button type="button" class="btn btn-sm btn-secundario btn-expandir"
                            data-ruta="${info.rutaId}">
                        <i class="fas ${expandida ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
                        ${expandida ? 'Ocultar detalle' : 'Ver detalle'}
                    </button>
                    <button type="button" class="btn btn-sm btn-primario btn-elegir-ruta"
                            data-ruta="${info.rutaId}">
                        <i class="fas fa-check"></i> Elegir esta ruta
                    </button>
                </div>
            </div>
        `;
    }

    function renderizarDetalleRuta(ruta, nivelData) {
        return `
            <div class="detalle-ruta" style="margin-top: 0.75rem; border-top: 1px solid var(--gris-300); padding-top: 0.75rem;">
                <strong>Criterios de selección:</strong>
                <ul style="margin: 0.5rem 0 0.75rem 1.25rem;">
                    ${ruta.criterios.map(c => `<li class="ayuda">${c}</li>`).join('')}
                </ul>

                <strong>Propósito completo:</strong>
                <p class="ayuda">${ruta.proposito}</p>

                <strong style="display:block; margin-top: 0.5rem;">Duración sugerida:</strong>
                <p class="ayuda">${ruta.duracion}</p>
            </div>
        `;
    }

    function suscribirPaso2() {
        // Botón expandir
        contenedor.querySelectorAll('.btn-expandir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rutaId = e.currentTarget.dataset.ruta;
                rutaExpandida = (rutaExpandida === rutaId) ? null : rutaId;
                renderizar();
            });
        });

        // Elegir ruta
        contenedor.querySelectorAll('.btn-elegir-ruta').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rutaId = e.currentTarget.dataset.ruta;
                elegirRuta(rutaId);
            });
        });

        // Volver al paso 1
        const btnVolver = document.getElementById('btn-volver-paso1');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                pasoActual = 1;
                renderizar();
            });
        }
    }

    function elegirRuta(rutaId) {
        const ruta = DATOS.rutasLEO[rutaId];
        const nivelData = ruta?.niveles[nivelElegido];
        if (!ruta || !nivelData || nivelData.disponible === false) {
            mostrarToast('Esta ruta no está disponible para el nivel seleccionado.', 'error');
            return;
        }

        guardarSeleccionRutas({
            nivel: nivelElegido,
            rutaId,
            bancoSeleccionado: [],
            cierreMes: null,
            confirmada: false
        });

        pasoActual = 3;
        rutaExpandida = null;
        renderizar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ========================================================
       PASO 3 — DISEÑAR LA RUTA (anclas + banco + cierre)
       ======================================================== */
    function renderizarPaso3() {
        const m3 = obtenerM3();
        const sel = m3.seleccionRutas;
        const ruta = DATOS.rutasLEO[sel.rutaId];

        if (!ruta) {
            // Si no hay ruta, regresar al paso 2
            pasoActual = 2;
            renderizar();
            return;
        }

        const nivelData = ruta.niveles[nivelElegido || sel.nivel];
        if (!nivelData || nivelData.disponible === false) {
            contenedor.innerHTML = `
                <div class="caja-alerta">
                    <i class="fas fa-exclamation-triangle"></i>
                    La ruta elegida ya no está disponible para el nivel actual.
                    <button class="btn btn-sm btn-secundario" id="btn-volver-paso2-inline" style="margin-left: 0.5rem;">
                        Elegir otra ruta
                    </button>
                </div>
            `;
            const btn = document.getElementById('btn-volver-paso2-inline');
            if (btn) btn.addEventListener('click', () => { pasoActual = 2; renderizar(); });
            return;
        }

        const bancoSel = sel.bancoSeleccionado || [];
        const cierreMes = sel.cierreMes || '';
        const notas = sel.notas || '';

        const bancook = bancoSel.length >= MIN_BANCO && bancoSel.length <= MAX_BANCO;

        contenedor.innerHTML = `
            <div class="sub-seccion">

                <div class="seccion-header">
                    <h3><i class="fas fa-list-check"></i> 3.1 Selección de Ruta</h3>
                    <p class="seccion-descripcion">
                        Diseña la ruta: <strong>anclas fijas</strong>, <strong>banco seleccionable (${MIN_BANCO}–${MAX_BANCO})</strong> y <strong>cierre</strong>.
                    </p>
                </div>

                ${renderizarIndicadorPasos(3)}

                <!-- ===== CARD DE LA RUTA ===== -->
                <div class="caja-info" style="margin-bottom: 1rem;">
                    <div class="flex-between" style="flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <strong>Ruta elegida:</strong> ${ruta.nombre}
                            <br><span class="ayuda" style="font-style: italic;">"${ruta.lema}"</span>
                        </div>
                        <button type="button" class="btn btn-sm btn-secundario" id="btn-cambiar-ruta">
                            <i class="fas fa-exchange-alt"></i> Cambiar ruta
                        </button>
                    </div>
                    <p class="ayuda" style="margin-top: 0.5rem;">
                        Nivel: <strong>${obtenerNombreNivel(nivelElegido || sel.nivel)}</strong>
                    </p>
                </div>

                <!-- ===== BLOQUE JALISCO AVANZA ===== -->
                ${renderizarBloqueJalisco(ruta)}

                <!-- ===== ANCLAS (FIJAS) ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-anchor"></i> Anclas (obligatorias, todo el trimestre)</h3>
                    <p class="ayuda">
                        Estas ${nivelData.anclas.length} actividades son permanentes.
                        No se pueden quitar, pero sí ajustar su frecuencia si el colectivo lo decide.
                    </p>

                    <div class="tarjeta-grid">
                        ${nivelData.anclas.map(a => renderizarActividadFija(a, 'ancla')).join('')}
                    </div>
                </div>

                <!-- ===== BANCO (SELECCIONABLE) ===== -->
                <div class="form-bloque">
                    <div class="flex-between" style="flex-wrap: wrap; gap: 0.5rem;">
                        <h3 style="margin: 0;"><i class="fas fa-layer-group"></i> Banco de actividades</h3>
                        <span class="chip ${bancook ? 'verde' : 'naranja'}">
                            ${bancoSel.length} / ${MIN_BANCO}-${MAX_BANCO} seleccionada(s)
                        </span>
                    </div>
                    <p class="ayuda">
                        Elige entre ${MIN_BANCO} y ${MAX_BANCO} actividades del banco.
                        El colectivo las trabajará durante el trimestre.
                    </p>

                    <div class="tarjeta-grid" style="margin-top: 0.75rem;">
                        ${nivelData.banco.map((a, idx) => {
                            const marcada = bancoSel.includes(a.nombre);
                            return renderizarActividadBanco(a, idx, marcada);
                        }).join('')}
                    </div>
                </div>

                <!-- ===== CIERRE (FIJO) ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-flag-checkered"></i> Cierre del trimestre</h3>
                    <p class="ayuda">
                        Actividad especial que integra lo trabajado. Elige el mes en que se realizará.
                    </p>

                    <div class="tarjeta-grid" style="margin-top: 0.75rem;">
                        ${renderizarActividadCierre(nivelData.cierre)}
                    </div>

                    <div class="form-grupo" style="margin-top: 0.75rem; max-width: 280px;">
                        <label for="select-mes-cierre">Mes del cierre <span class="obligatorio">*</span></label>
                        <select id="select-mes-cierre">
                            <option value="">— Selecciona —</option>
                            ${DATOS.momento3.meses.map(m => `
                                <option value="${m.id}" ${cierreMes === m.id ? 'selected' : ''}>${m.nombre}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- ===== NOTAS ===== -->
                <div class="form-bloque">
                    <h3><i class="fas fa-comment-dots"></i> Notas del colectivo</h3>
                    <p class="ayuda">Opcional. Acuerdos, justificación o ajustes.</p>
                    <div class="form-grupo">
                        <textarea id="notas-seleccion" maxlength="600" rows="3"
                                  placeholder="Ej. Se eligió esta ruta porque…">${notas}</textarea>
                        <span class="ayuda">Máximo 600 caracteres.</span>
                    </div>
                </div>

                <!-- ===== CONFIRMAR ===== -->
                <div class="form-bloque" style="text-align: center;">
                    <button type="button" class="btn btn-primario" id="btn-confirmar-seleccion"
                            ${(bancook && cierreMes) ? '' : 'disabled'}>
                        <i class="fas fa-check"></i> Confirmar selección
                    </button>
                    ${sel.confirmada ? `
                        <p class="ayuda" style="margin-top: 0.5rem;">
                            <i class="fas fa-check-circle" style="color: var(--verde);"></i>
                            Confirmada
                        </p>
                    ` : ''}
                </div>

                <!-- ===== RESUMEN ===== -->
                <div class="caja-${bancook && cierreMes ? 'exito' : 'info'}">
                    <i class="fas fa-${bancook && cierreMes ? 'check-circle' : 'info-circle'}"></i>
                    ${!bancook
                        ? `Selecciona entre ${MIN_BANCO} y ${MAX_BANCO} actividades del banco.`
                        : !cierreMes
                            ? 'Elige el mes del cierre.'
                            : '¡Selección completa! Puedes confirmar.'}
                </div>

            </div>
        `;

        suscribirPaso3();
    }

    function renderizarBloqueJalisco(ruta) {
        const just = ruta.datosJustificacion;
        if (!just) return '';

        return `
            <div class="form-bloque">
                <h3><i class="fas fa-chart-bar"></i> Datos que justifican esta ruta</h3>
                <p class="ayuda">Fuente: Jalisco Avanza 2025 · Lectura</p>

                <div class="tarjeta-grid" style="margin-top: 0.75rem;">
                    ${just.primaria ? `
                        <div class="tarjeta">
                            <div class="flex-between mb-2">
                                <strong>Primaria · ${just.primaria.grado}</strong>
                                <span class="chip carmesi">${just.primaria.porcentaje}%</span>
                            </div>
                            <p class="ayuda"><strong>${just.primaria.ua}</strong></p>
                            <p class="ayuda">${just.primaria.texto}</p>
                        </div>
                    ` : ''}
                    ${just.secundaria ? `
                        <div class="tarjeta">
                            <div class="flex-between mb-2">
                                <strong>Secundaria · ${just.secundaria.grado}</strong>
                                <span class="chip carmesi">${just.secundaria.porcentaje}%</span>
                            </div>
                            <p class="ayuda"><strong>${just.secundaria.ua}</strong></p>
                            <p class="ayuda">${just.secundaria.texto}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    function renderizarActividadFija(act, tipo) {
        return `
            <div class="tarjeta tarjeta-actividad-fija">
                <div class="flex-between mb-2">
                    <span class="chip carmesi"><i class="fas fa-lock"></i> Ancla</span>
                    <span class="chip">${act.frecuencia}</span>
                </div>
                <strong>${act.nombre}</strong>
                <p class="ayuda" style="margin-top: 0.5rem;">${act.descripcion}</p>
                <div style="margin-top: 0.5rem;">
                    <span class="chip">Virtud: ${act.virtud}</span>
                </div>
            </div>
        `;
    }

    function renderizarActividadBanco(act, idx, marcada) {
        return `
            <label class="tarjeta tarjeta-actividad-banco ${marcada ? 'seleccionada' : ''}"
                   data-idx="${idx}">
                <div class="flex-between mb-2">
                    <span class="chip naranja"><i class="fas fa-circle"></i> Banco</span>
                    <input type="checkbox" class="check-banco"
                           data-nombre="${act.nombre}"
                           ${marcada ? 'checked' : ''}>
                </div>
                <strong>${act.nombre}</strong>
                <p class="ayuda" style="margin-top: 0.5rem;">${act.descripcion}</p>
                <div style="margin-top: 0.5rem;">
                    <span class="chip">${act.frecuencia}</span>
                    <span class="chip">Virtud: ${act.virtud}</span>
                </div>
            </label>
        `;
    }

    function renderizarActividadCierre(cierre) {
        if (!cierre) return '<p class="ayuda">Sin actividad de cierre definida.</p>';
        return `
            <div class="tarjeta tarjeta-actividad-cierre">
                <div class="flex-between mb-2">
                    <span class="chip verde"><i class="fas fa-flag-checkered"></i> Cierre</span>
                    <span class="chip">${cierre.frecuencia}</span>
                </div>
                <strong>${cierre.nombre}</strong>
                <p class="ayuda" style="margin-top: 0.5rem;">${cierre.descripcion}</p>
                <div style="margin-top: 0.5rem;">
                    <span class="chip">Virtud: ${cierre.virtud}</span>
                </div>
            </div>
        `;
    }

    function suscribirPaso3() {
        // Cambiar ruta
        const btnCambiar = document.getElementById('btn-cambiar-ruta');
        if (btnCambiar) {
            btnCambiar.addEventListener('click', () => {
                pasoActual = 2;
                renderizar();
            });
        }

        // Checkboxes del banco
        contenedor.querySelectorAll('.check-banco').forEach(check => {
            check.addEventListener('change', manejarCambioBanco);
        });

        // Select mes del cierre
        const selectMes = document.getElementById('select-mes-cierre');
        if (selectMes) {
            selectMes.addEventListener('change', (e) => {
                guardarSeleccionRutas({ cierreMes: e.target.value, confirmada: false });
                renderizar();
            });
        }

        // Notas
        const notas = document.getElementById('notas-seleccion');
        if (notas) {
            notas.addEventListener('input', (e) => {
                const m3 = obtenerM3();
                // Guardar sin re-renderizar para no perder foco
                guardarSeleccionRutas({ notas: e.target.value });
            });
        }

        // Confirmar
        const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', confirmarSeleccion);
        }
    }

    function manejarCambioBanco(e) {
        const m3 = obtenerM3();
        let bancoSel = [...(m3.seleccionRutas.bancoSeleccionado || [])];
        const nombre = e.target.dataset.nombre;

        if (e.target.checked) {
            if (bancoSel.length >= MAX_BANCO) {
                e.target.checked = false;
                mostrarToast(`Máximo ${MAX_BANCO} actividades del banco.`, 'error');
                return;
            }
            if (!bancoSel.includes(nombre)) bancoSel.push(nombre);
        } else {
            bancoSel = bancoSel.filter(n => n !== nombre);
        }

        guardarSeleccionRutas({ bancoSeleccionado: bancoSel, confirmada: false });
        renderizar();
    }

    function confirmarSeleccion() {
        const m3 = obtenerM3();
        const sel = m3.seleccionRutas;
        const banco = sel.bancoSeleccionado || [];

        if (banco.length < MIN_BANCO || banco.length > MAX_BANCO) {
            mostrarToast(`Selecciona entre ${MIN_BANCO} y ${MAX_BANCO} actividades del banco.`, 'error');
            return;
        }
        if (!sel.cierreMes) {
            mostrarToast('Elige el mes del cierre.', 'error');
            return;
        }

        guardarSeleccionRutas({ confirmada: true });
        mostrarToast('¡Selección de ruta confirmada!', 'exito');
        renderizar();
    }

    /* ========================================================
       INDICADOR DE PASOS
       ======================================================== */
    function renderizarIndicadorPasos(paso) {
        const pasos = [
            { n: 1, label: 'Elegir nivel',      icono: 'fa-graduation-cap' },
            { n: 2, label: 'Explorar rutas',    icono: 'fa-compass' },
            { n: 3, label: 'Diseñar la ruta',   icono: 'fa-list-check' }
        ];
        return `
            <div class="flujo-pasos" style="margin-bottom: 1rem;">
                ${pasos.map(p => {
                    const activo = paso === p.n;
                    const completado = paso > p.n;
                    return `
                        <div class="flujo-paso ${activo ? 'activo' : ''} ${completado ? 'completado' : ''}">
                            <span class="flujo-numero">
                                ${completado ? '<i class="fas fa-check"></i>' : p.n}
                            </span>
                            <span class="flujo-label"><i class="fas ${p.icono}"></i> ${p.label}</span>
                        </div>
                    `;
                }).join('<i class="fas fa-chevron-right flujo-flecha"></i>')}
            </div>
        `;
    }

    /* ========================================================
       TOAST (defensivo)
       ======================================================== */
    function mostrarToast(mensaje, tipo) {
        if (typeof APP !== 'undefined' && typeof APP.mostrarToast === 'function') {
            APP.mostrarToast(mensaje, tipo);
        } else {
            console.log(`[Toast ${tipo}] ${mensaje}`);
        }
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        renderizar,
        // Exponer para debug
        getPasoActual: () => pasoActual,
        getNivelElegido: () => nivelElegido
    };

})();

/* ============================================================
   EXPOSICIÓN A WINDOW — FIX CRÍTICO
   ============================================================ */
if (typeof window !== 'undefined') {
    window.MOMENTO3_1 = MOMENTO3_1;
    console.log('✅ MOMENTO3_1 expuesto en window');
}
