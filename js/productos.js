/* ============================================================
   PLAN LECTOR JALISCO LEO
   productos.js — Generación de productos exportables (PDF/HTML)
   v1.0 — Hoja de Ruta · Ficha · Carta Familias · Bitácora
   ============================================================
   Depende de:
     - ESTADO.obtenerSeccion('identificacion')
     - ESTADO.obtenerSeccion('momento3')
     - DATOS.niveles, DATOS.rutasLEO, DATOS.momento3
   Expone: window.PRODUCTOS = { generarHojaRuta, generarFichaRuta,
                                generarCartaFamilias, generarBitacora }
   Patrón de la casa: defensivo + window.X = X;
   ============================================================ */

const PRODUCTOS = (function() {

    /* ========================================================
       CSS IMPRIMIBLE (autocontenido)
       ======================================================== */
    const CSS_IMPRIMIBLE = `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        :root {
            --carmesi: #A0192D;
            --carmesi-oscuro: #7A1122;
            --naranja: #E08A3C;
            --verde: #2E7D32;
            --crema: #FAF6EF;
            --crema-2: #F4EBDC;
            --tinta: #2A2A2A;
            --tinta-suave: #555;
            --gris-borde: #E2DCD0;
        }

        * { box-sizing: border-box; }

        html, body {
            margin: 0;
            padding: 0;
            background: #fff;
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: var(--tinta);
            padding: 2.5rem 2rem;
            line-height: 1.55;
            font-size: 11pt;
        }

        h1, h2, h3, h4 {
            font-family: 'Fraunces', Georgia, serif;
            color: var(--carmesi);
            margin: 0 0 0.5rem;
            line-height: 1.2;
        }

        h1 { font-size: 22pt; font-weight: 800; }
        h2 { font-size: 15pt; font-weight: 700; margin-top: 1.75rem; padding-bottom: 0.35rem; border-bottom: 2px solid var(--carmesi); }
        h3 { font-size: 12.5pt; font-weight: 700; margin-top: 1.25rem; }
        h4 { font-size: 11pt; font-weight: 700; }

        p { margin: 0 0 0.7rem; }

        .hoja {
            max-width: 820px;
            margin: 0 auto;
        }

        /* ===== MARCA ===== */
        .marca {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            border-bottom: 3px solid var(--carmesi);
            padding-bottom: 0.85rem;
            margin-bottom: 1.5rem;
        }

        .marca-icono {
            width: 48px; height: 48px;
            display: inline-flex; align-items: center; justify-content: center;
            background: var(--carmesi); color: #fff;
            border-radius: 10px;
            font-size: 24px;
            flex-shrink: 0;
        }

        .marca-texto h1 { margin: 0; font-size: 18pt; }
        .marca-texto p { margin: 0; font-size: 10pt; color: var(--tinta-suave); }

        /* ===== META (identificación) ===== */
        .meta {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem 1.5rem;
            background: var(--crema);
            padding: 1rem 1.25rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 10pt;
        }

        .meta strong { color: var(--carmesi); }
        .meta .full { grid-column: 1 / -1; }

        /* ===== BLOQUES ===== */
        .bloque { margin-bottom: 1.5rem; }

        .caja {
            border-left: 4px solid var(--naranja);
            background: var(--crema);
            padding: 0.85rem 1.1rem;
            border-radius: 4px;
            margin: 0.75rem 0;
            font-size: 10.5pt;
        }

        .caja.carmesi { border-left-color: var(--carmesi); }
        .caja.verde   { border-left-color: var(--verde); }

        .caja strong { color: var(--carmesi); }

        .lema {
            font-family: 'Fraunces', Georgia, serif;
            font-size: 13pt;
            font-style: italic;
            color: var(--carmesi);
            margin: 0.35rem 0 0.85rem;
            line-height: 1.35;
        }

        /* ===== CHIPS ===== */
        .chip {
            display: inline-block;
            padding: 0.15rem 0.6rem;
            border-radius: 999px;
            font-size: 9pt;
            font-weight: 600;
            margin: 0 0.15rem 0.15rem 0;
            background: #eee;
            color: var(--tinta);
        }

        .chip.carmesi { background: rgba(160,25,45,0.12); color: var(--carmesi); }
        .chip.naranja { background: rgba(224,138,60,0.20); color: #8a4a10; }
        .chip.verde   { background: rgba(46,125,50,0.14); color: var(--verde); }
        .chip.gris    { background: #eee; color: #555; }

        /* ===== TABLAS ===== */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
            margin: 0.5rem 0 1rem;
        }

        th, td {
            border: 1px solid var(--gris-borde);
            padding: 0.45rem 0.65rem;
            text-align: left;
            vertical-align: top;
        }

        th {
            background: var(--crema-2);
            font-family: 'Fraunces', Georgia, serif;
            color: var(--carmesi);
            font-weight: 700;
            font-size: 10pt;
        }

        tbody tr:nth-child(even) { background: rgba(250, 246, 239, 0.5); }

        /* ===== FIRMAS ===== */
        .firma {
            margin-top: 3rem;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            page-break-inside: avoid;
        }

        .firma-linea {
            border-top: 1px solid var(--tinta);
            padding-top: 0.5rem;
            text-align: center;
            font-size: 9.5pt;
            color: var(--tinta-suave);
        }

        .firma-linea strong {
            display: block;
            color: var(--tinta);
            font-size: 10.5pt;
        }

        /* ===== PIE ===== */
        .pie {
            margin-top: 2.5rem;
            padding-top: 1rem;
            border-top: 1px solid var(--gris-borde);
            font-size: 8.5pt;
            color: var(--tinta-suave);
            text-align: center;
        }

        /* ===== CARTA (estilo especial) ===== */
        .carta-cuerpo {
            font-family: 'Fraunces', Georgia, serif;
            font-size: 12pt;
            line-height: 1.7;
        }

        .carta-cuerpo p { margin: 0 0 1rem; }

        .carta-fecha {
            text-align: right;
            color: var(--tinta-suave);
            font-style: italic;
            font-family: 'Inter', sans-serif;
            font-size: 10pt;
            margin-bottom: 1.5rem;
        }

        .carta-firma {
            margin-top: 3rem;
            font-family: 'Inter', sans-serif;
            font-size: 10.5pt;
        }

        /* ===== TOOLBAR (solo pantalla) ===== */
        .toolbar {
            position: fixed;
            top: 1rem;
            right: 1rem;
            display: flex;
            gap: 0.5rem;
            background: #fff;
            padding: 0.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.14);
            z-index: 9999;
        }

        .toolbar button {
            font-family: 'Inter', sans-serif;
            border: 1px solid var(--gris-borde);
            background: #fff;
            color: var(--carmesi);
            padding: 0.5rem 0.85rem;
            border-radius: 6px;
            font-weight: 600;
            font-size: 10pt;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
        }

        .toolbar button:hover { background: var(--crema); }
        .toolbar button.primario {
            background: var(--carmesi);
            color: #fff;
            border-color: var(--carmesi);
        }
        .toolbar button.primario:hover { background: var(--carmesi-oscuro); }

        /* ===== PRINT ===== */
        @media print {
            .toolbar { display: none !important; }
            body { padding: 0; font-size: 10.5pt; }
            .hoja { max-width: 100%; }
            h2 { page-break-after: avoid; }
            h3 { page-break-after: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; }
            thead { display: table-header-group; }
            .firma { page-break-inside: avoid; }
            @page { margin: 1.4cm; size: A4; }
        }
    `;

    /* ========================================================
       HELPERS
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
        if (typeof APP !== 'undefined' && typeof APP.mostrarToast === 'function') {
            try { APP.mostrarToast(mensaje, tipo); return; } catch (e) { /* silencio */ }
        }
        console.log(`[Toast ${tipo}] ${mensaje}`);
    }

    function getIdentificacion() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try { return ESTADO.obtenerSeccion('identificacion') || {}; }
            catch (e) { /* silencio */ }
        }
        return {};
    }

    function getM3() {
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try {
                const m3 = ESTADO.obtenerSeccion('momento3') || {};
                return {
                    seleccionRutas:  m3.seleccionRutas  || {},
                    calendarizacion: m3.calendarizacion || { actividades: [], notas: '' },
                    responsables:    m3.responsables    || { asignaciones: [], notas: '' },
                    bitacora:        m3.bitacora        || { registros: [], notas: '' }
                };
            } catch (e) { /* silencio */ }
        }
        return {
            seleccionRutas:  {},
            calendarizacion: { actividades: [], notas: '' },
            responsables:    { asignaciones: [], notas: '' },
            bitacora:        { registros: [], notas: '' }
        };
    }

    function getNivelNombre(id) {
        if (!id || typeof DATOS === 'undefined' || !Array.isArray(DATOS.niveles)) return id || '—';
        const n = DATOS.niveles.find(x => x.id === id);
        return n ? n.nombre : id;
    }

    function mesLabel(mes) {
        if (!mes) return '—';
        if (mes === 'todo') return 'Todo el trimestre';
        return mes.charAt(0).toUpperCase() + mes.slice(1);
    }

    function tipoLabel(tipoId) {
        if (typeof DATOS !== 'undefined' && DATOS.momento3 && Array.isArray(DATOS.momento3.tiposActividad)) {
            const t = DATOS.momento3.tiposActividad.find(x => x.id === tipoId);
            if (t) return t.nombre;
        }
        return tipoId || '—';
    }

    function estadoLabel(estadoId) {
        if (typeof DATOS !== 'undefined' && DATOS.momento3 && Array.isArray(DATOS.momento3.estadosImplementacion)) {
            const e = DATOS.momento3.estadosImplementacion.find(x => x.id === estadoId);
            if (e) return e.nombre;
        }
        return estadoId || '—';
    }

    function formatearFecha(iso) {
        if (!iso) return '—';
        try {
            const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
            return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) { return iso; }
    }

    function fechaHoyLarga() {
        return new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    /* ========================================================
       VENTANA IMPRIMIBLE
       ======================================================== */
    function htmlCompleto(titulo, cuerpoHTML, nombreArchivo) {
        return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${escaparHTML(titulo)}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<style>${CSS_IMPRIMIBLE}</style>
</head>
<body>
<div class="toolbar">
    <button class="primario" onclick="window.print()"><i class="fas fa-print"></i> Imprimir / PDF</button>
    <button onclick="descargarHTML('${escaparHTML(nombreArchivo)}')"><i class="fas fa-download"></i> Descargar HTML</button>
    <button onclick="window.close()"><i class="fas fa-times"></i> Cerrar</button>
</div>
<div class="hoja">
${cuerpoHTML}
</div>
<script>
function descargarHTML(nombre) {
    var tb = document.querySelector('.toolbar');
    if (tb && tb.parentNode) tb.parentNode.removeChild(tb);
    var html = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (nombre || 'producto') + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
<\/script>
</body>
</html>`;
    }

    function abrirVentana(titulo, cuerpoHTML, nombreArchivo) {
        const win = window.open('', '_blank');
        if (!win) {
            mostrarToast('Permite las ventanas emergentes para ver el producto.', 'error');
            return;
        }
        win.document.open();
        win.document.write(htmlCompleto(titulo, cuerpoHTML, nombreArchivo));
        win.document.close();
    }

    /* ========================================================
       FRAGMENTOS REUTILIZABLES
       ======================================================== */
    function marca() {
        return `
            <div class="marca">
                <span class="marca-icono"><i class="fas fa-book-open"></i></span>
                <div class="marca-texto">
                    <h1>Plan Lector Jalisco LEO</h1>
                    <p>Estrategia Estatal de Lectura, Escritura y Oralidad</p>
                </div>
            </div>
        `;
    }

    function metaIdentificacion(id) {
        const nivel = getNivelNombre(id.nivel);
        const grados = Array.isArray(id.grados) && id.grados.length
            ? id.grados.join(', ')
            : '—';
        return `
            <div class="meta">
                <div><strong>Escuela:</strong> ${escaparHTML(id.nombreEscuela || '—')}</div>
                <div><strong>CCT:</strong> ${escaparHTML(id.cct || '—')}</div>
                <div><strong>Región:</strong> ${escaparHTML(id.region || '—')}</div>
                <div><strong>Municipio:</strong> ${escaparHTML(id.municipio || '—')}</div>
                <div><strong>Turno:</strong> ${escaparHTML(id.turno || '—')}</div>
                <div><strong>Nivel:</strong> ${escaparHTML(nivel)}</div>
                <div><strong>Grados:</strong> ${escaparHTML(grados)}</div>
                <div><strong>Estudiantes:</strong> ${escaparHTML(id.numeroEstudiantes || '—')}</div>
                <div><strong>Director(a):</strong> ${escaparHTML(id.director || '—')}</div>
                <div><strong>ATP / Supervisor:</strong> ${escaparHTML(id.atp || '—')}</div>
                <div class="full"><strong>Fecha del CTE:</strong> ${escaparHTML(id.fechaCTE || '—')}</div>
            </div>
        `;
    }

    function bloqueRuta(ruta, sel) {
        if (!ruta) return '';
        const virtudes = Array.isArray(ruta.virtudes)
            ? ruta.virtudes.map(v => `<span class="chip carmesi">${escaparHTML(v)}</span>`).join('')
            : '';
        const bancoSel = Array.isArray(sel.bancoSeleccionado) ? sel.bancoSeleccionado : [];
        const bancoChips = bancoSel.map(b => `<span class="chip naranja">${escaparHTML(b)}</span>`).join('');

        return `
            <div class="bloque">
                <h2><i class="fas fa-route"></i> Ruta LEO del trimestre</h2>
                <h3>${escaparHTML(ruta.nombre)}</h3>
                <p class="lema">"${escaparHTML(ruta.lema)}"</p>

                <div class="caja carmesi">
                    <strong>Pregunta orientadora:</strong><br>
                    ${escaparHTML(ruta.preguntaOrientadora)}
                    <br><em>${escaparHTML(ruta.subtituloPregunta || '')}</em>
                </div>

                <p><strong>Propósito:</strong> ${escaparHTML(ruta.proposito)}</p>

                <p><strong>Virtudes que cultiva:</strong></p>
                <p>${virtudes || '<em>—</em>'}</p>

                <p><strong>Banco seleccionado (${bancoSel.length}):</strong></p>
                <p>${bancoChips || '<em>Sin actividades del banco seleccionadas.</em>'}</p>

                <p><strong>Mes del cierre:</strong> ${escaparHTML(mesLabel(sel.cierreMes))}</p>
            </div>
        `;
    }

    function bloqueJaliscoAvanza(ruta) {
        const just = ruta && ruta.datosJustificacion;
        if (!just) return '';
        const prim = just.primaria;
        const sec  = just.secundaria;

        return `
            <div class="bloque">
                <h2><i class="fas fa-chart-bar"></i> Datos que justifican esta ruta</h2>
                <p style="font-size:10pt;color:var(--tinta-suave);">Fuente: Jalisco Avanza 2025 · Lectura</p>

                ${prim ? `
                    <div class="caja">
                        <strong>Primaria · ${escaparHTML(prim.grado)} · ${escaparHTML(String(prim.porcentaje))}%</strong>
                        <br>${escaparHTML(prim.ua)}
                        <br><span style="color:var(--tinta-suave);">${escaparHTML(prim.texto)}</span>
                    </div>
                ` : ''}

                ${sec ? `
                    <div class="caja">
                        <strong>Secundaria · ${escaparHTML(sec.grado)} · ${escaparHTML(String(sec.porcentaje))}%</strong>
                        <br>${escaparHTML(sec.ua)}
                        <br><span style="color:var(--tinta-suave);">${escaparHTML(sec.texto)}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    function tablaActividades(actividades) {
        if (!Array.isArray(actividades) || actividades.length === 0) {
            return '<p><em>Sin actividades registradas.</em></p>';
        }
        return `
            <table>
                <thead>
                    <tr>
                        <th style="width:34%;">Actividad</th>
                        <th style="width:14%;">Tipo</th>
                        <th style="width:16%;">Mes</th>
                        <th style="width:14%;">Semana</th>
                        <th style="width:22%;">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${actividades.map(a => `
                        <tr>
                            <td>${escaparHTML(a.nombre)}</td>
                            <td>${escaparHTML(tipoLabel(a.tipo))}</td>
                            <td>${escaparHTML(mesLabel(a.mes))}</td>
                            <td>${escaparHTML(a.semana || '—')}</td>
                            <td>${escaparHTML(estadoLabel(a.estado || 'no-iniciada'))}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function tablaResponsables(actividades, asignaciones) {
        if (!Array.isArray(actividades) || actividades.length === 0) return '';

        const filas = actividades.map(a => {
            const regs = (asignaciones || []).filter(x => x.actividadId === a.id);
            const detalle = regs.length > 0
                ? regs.map(r => `${escaparHTML(r.nombre)} <em style="color:var(--tinta-suave);">(${escaparHTML(r.rol)})</em>`).join('<br>')
                : '<em style="color:var(--tinta-suave);">Sin asignar</em>';
            return `
                <tr>
                    <td>${escaparHTML(a.nombre)}</td>
                    <td>${escaparHTML(tipoLabel(a.tipo))}</td>
                    <td>${detalle}</td>
                </tr>
            `;
        }).join('');

        return `
            <div class="bloque">
                <h2><i class="fas fa-users"></i> Responsables por actividad</h2>
                <table>
                    <thead>
                        <tr>
                            <th style="width:40%;">Actividad</th>
                            <th style="width:15%;">Tipo</th>
                            <th>Responsable(s)</th>
                        </tr>
                    </thead>
                    <tbody>${filas}</tbody>
                </table>
            </div>
        `;
    }

    function firmas(identificacion) {
        const director = identificacion.director || '__________________________';
        const atp = identificacion.atp || '__________________________';
        return `
            <div class="firma">
                <div class="firma-linea">
                    <strong>${escaparHTML(director)}</strong>
                    Director(a) de la escuela
                </div>
                <div class="firma-linea">
                    <strong>${escaparHTML(atp)}</strong>
                    ATP / Supervisor(a)
                </div>
            </div>
        `;
    }

    function pie() {
        return `
            <div class="pie">
                Plan Lector Jalisco LEO · Documento generado el ${escaparHTML(fechaHoyLarga())}
            </div>
        `;
    }

    /* ========================================================
       PRODUCTO 1 · HOJA DE RUTA TRIMESTRAL
       ======================================================== */
    function generarHojaRuta() {
        const id = getIdentificacion();
        const m3 = getM3();
        const sel = m3.seleccionRutas || {};
        const ruta = (sel.rutaId && typeof DATOS !== 'undefined')
            ? DATOS.rutasLEO[sel.rutaId]
            : null;

        if (!ruta) {
            mostrarToast('Selecciona una ruta en 3.1 antes de generar la Hoja de Ruta.', 'error');
            return;
        }

        const actividades = m3.calendarizacion.actividades || [];
        const anclas = actividades.filter(a => a.tipo === 'ancla');
        const banco  = actividades.filter(a => a.tipo === 'banco');
        const cierre = actividades.filter(a => a.tipo === 'cierre');
        const pers   = actividades.filter(a => a.tipo === 'personalizada');

        const cuerpo = `
            ${marca()}
            <h1 style="margin-bottom:1rem;">Hoja de Ruta Trimestral</h1>

            ${metaIdentificacion(id)}
            ${bloqueRuta(ruta, sel)}
            ${bloqueJaliscoAvanza(ruta)}

            <div class="bloque">
                <h2><i class="fas fa-anchor"></i> Anclas (todo el trimestre)</h2>
                ${tablaActividades(anclas)}
            </div>

            <div class="bloque">
                <h2><i class="fas fa-layer-group"></i> Actividades del banco</h2>
                ${tablaActividades(banco)}
            </div>

            <div class="bloque">
                <h2><i class="fas fa-flag-checkered"></i> Cierre del trimestre</h2>
                ${tablaActividades(cierre)}
            </div>

            ${pers.length > 0 ? `
                <div class="bloque">
                    <h2><i class="fas fa-star"></i> Actividades personalizadas</h2>
                    ${tablaActividades(pers)}
                </div>
            ` : ''}

            ${tablaResponsables(actividades, m3.responsables.asignaciones)}

            ${m3.calendarizacion.notas ? `
                <div class="bloque">
                    <h2><i class="fas fa-comment-dots"></i> Notas del colectivo</h2>
                    <div class="caja">${escaparHTML(m3.calendarizacion.notas)}</div>
                </div>
            ` : ''}

            ${firmas(id)}
            ${pie()}
        `;

        const nombre = `hoja-de-ruta-trimestral-${fechaArchivo()}`;
        abrirVentana('Hoja de Ruta Trimestral · Plan Lector Jalisco LEO', cuerpo, nombre);
    }

    /* ========================================================
       PRODUCTO 2 · FICHA DE LA RUTA
       ======================================================== */
    function generarFichaRuta() {
        const id = getIdentificacion();
        const m3 = getM3();
        const sel = m3.seleccionRutas || {};
        const ruta = (sel.rutaId && typeof DATOS !== 'undefined')
            ? DATOS.rutasLEO[sel.rutaId]
            : null;

        if (!ruta) {
            mostrarToast('Selecciona una ruta en 3.1 antes de generar la Ficha.', 'error');
            return;
        }

        const nivelId = sel.nivel || id.nivel;
        const nivelData = ruta.niveles && ruta.niveles[nivelId];
        const nivelNombre = getNivelNombre(nivelId);

        const virtudes = Array.isArray(ruta.virtudes)
            ? ruta.virtudes.map(v => `<span class="chip carmesi">${escaparHTML(v)}</span>`).join('')
            : '';

        const criterios = Array.isArray(ruta.criterios)
            ? ruta.criterios.map(c => `<li>${escaparHTML(c)}</li>`).join('')
            : '';

        let catalogo = '<p><em>Esta ruta no está disponible para el nivel seleccionado.</em></p>';
        if (nivelData && nivelData.disponible !== false) {
            const anclas = Array.isArray(nivelData.anclas) ? nivelData.anclas : [];
            const banco  = Array.isArray(nivelData.banco)  ? nivelData.banco  : [];
            const cierre = nivelData.cierre;

            catalogo = `
                <h3>Anclas (permanentes)</h3>
                <table>
                    <thead><tr><th>Actividad</th><th>Frecuencia</th><th>Virtud</th></tr></thead>
                    <tbody>
                        ${anclas.map(a => `
                            <tr>
                                <td><strong>${escaparHTML(a.nombre)}</strong><br>
                                    <span style="color:var(--tinta-suave);font-size:9.5pt;">${escaparHTML(a.descripcion || '')}</span>
                                </td>
                                <td>${escaparHTML(a.frecuencia || '—')}</td>
                                <td>${escaparHTML(a.virtud || '—')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h3>Banco de actividades (elige entre 2 y 3)</h3>
                <table>
                    <thead><tr><th>Actividad</th><th>Frecuencia</th><th>Virtud</th></tr></thead>
                    <tbody>
                        ${banco.map(a => `
                            <tr>
                                <td><strong>${escaparHTML(a.nombre)}</strong><br>
                                    <span style="color:var(--tinta-suave);font-size:9.5pt;">${escaparHTML(a.descripcion || '')}</span>
                                </td>
                                <td>${escaparHTML(a.frecuencia || '—')}</td>
                                <td>${escaparHTML(a.virtud || '—')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                ${cierre ? `
                    <h3>Actividad de cierre</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>${escaparHTML(cierre.nombre)}</strong><br>
                                    <span style="color:var(--tinta-suave);font-size:9.5pt;">${escaparHTML(cierre.descripcion || '')}</span>
                                </td>
                                <td style="width:22%;">${escaparHTML(cierre.frecuencia || '—')}</td>
                                <td style="width:20%;">${escaparHTML(cierre.virtud || '—')}</td>
                            </tr>
                        </tbody>
                    </table>
                ` : ''}
            `;
        }

        const cuerpo = `
            ${marca()}
            <h1 style="margin-bottom:1rem;">Ficha de la Ruta LEO</h1>

            <div class="meta">
                <div><strong>Escuela:</strong> ${escaparHTML(id.nombreEscuela || '—')}</div>
                <div><strong>CCT:</strong> ${escaparHTML(id.cct || '—')}</div>
                <div><strong>Nivel:</strong> ${escaparHTML(nivelNombre)}</div>
                <div><strong>Región:</strong> ${escaparHTML(id.region || '—')}</div>
            </div>

            <div class="bloque">
                <h2><i class="fas fa-route"></i> ${escaparHTML(ruta.nombre)}</h2>
                <p class="lema">"${escaparHTML(ruta.lema)}"</p>

                <div class="caja carmesi">
                    <strong>Pregunta orientadora:</strong><br>
                    ${escaparHTML(ruta.preguntaOrientadora)}
                    <br><em>${escaparHTML(ruta.subtituloPregunta || '')}</em>
                </div>

                <p><strong>Propósito:</strong> ${escaparHTML(ruta.proposito)}</p>

                <p><strong>Criterios de selección:</strong></p>
                <ul style="margin:0.25rem 0 0.75rem 1.25rem;">${criterios}</ul>

                <p><strong>Virtudes que cultiva:</strong></p>
                <p>${virtudes || '<em>—</em>'}</p>

                <p><strong>Duración sugerida:</strong> ${escaparHTML(ruta.duracion || '—')}</p>
            </div>

            ${bloqueJaliscoAvanza(ruta)}

            <div class="bloque">
                <h2><i class="fas fa-book"></i> Catálogo de actividades · ${escaparHTML(nivelNombre)}</h2>
                ${catalogo}
            </div>

            ${pie()}
        `;

        const nombre = `ficha-ruta-${ruta.id}-${fechaArchivo()}`;
        abrirVentana('Ficha de la Ruta · Plan Lector Jalisco LEO', cuerpo, nombre);
    }

    /* ========================================================
       PRODUCTO 3 · CARTA PARA FAMILIAS
       ======================================================== */
    function generarCartaFamilias() {
        const id = getIdentificacion();
        const m3 = getM3();
        const sel = m3.seleccionRutas || {};
        const ruta = (sel.rutaId && typeof DATOS !== 'undefined')
            ? DATOS.rutasLEO[sel.rutaId]
            : null;

        if (!ruta) {
            mostrarToast('Selecciona una ruta en 3.1 antes de generar la Carta.', 'error');
            return;
        }

        const nombreEscuela = id.nombreEscuela || 'nuestra escuela';
        const director = id.director || '';
        const nivelNombre = getNivelNombre(sel.nivel || id.nivel);

        // Sugerencias específicas según la ruta (curadas, no inventadas)
        const sugerenciasBase = {
            ruta1: [
                'Pregúntele a su hija o hijo qué entendió del texto, no solo qué leyó.',
                'Antes de leer, miren juntos el título y las imágenes y anticipen de qué tratará.',
                'Cuando no entienda una palabra, ayúdele a descubrir su significado por el contexto.'
            ],
            ruta2: [
                'Deje que su hija o hijo elija los libros que quiere leer. El gusto se cultiva con libertad.',
                'Lean juntos en voz alta, aunque sea 10 minutos al día. El placer se contagia.',
                'Inventen finales alternativos para los cuentos que ya conocen.'
            ],
            ruta3: [
                'Cuando su hija o hijo opine, pregúntele: "¿por qué piensas eso?". Ayúdele a dar razones.',
                'Comenten noticias o situaciones cotidianas y exploren distintos puntos de vista.',
                'Enséñele a decir lo que piensa con respeto, incluso cuando no estén de acuerdo.'
            ],
            ruta4: [
                'Anime a su hija o hijo a escribir lo que quiera: cartas, cuentos, listas, canciones.',
                'Comparta con la familia lo que escriba. La escritura necesita lectores.',
                'Escriban juntos: usted una línea, su hija o hijo otra. Verán qué historia sale.'
            ],
            ruta5: [
                'Lean en familia, aunque sea 10 minutos al día. Es uno de los mejores regalos.',
                'Cuente historias de la familia: abuelos, tradiciones, anécdotas. Todo eso también es lectura del mundo.',
                'Acompañe a su hija o hijo a la biblioteca más cercana. Conozcan juntos nuevos mundos.'
            ]
        };

        const sugerencias = sugerenciasBase[ruta.id] || [
            'Lean juntos todos los días, aunque sea un ratito.',
            'Conversen sobre lo que leen.',
            'Dejen que elijan sus propios libros.'
        ];

        const cuerpo = `
            ${marca()}

            <h1 style="margin-bottom:0.5rem;">Carta para las familias</h1>
            <p class="carta-fecha">${escaparHTML(id.municipio || '')}, ${escaparHTML(fechaHoyLarga())}</p>

            <div class="carta-cuerpo">

                <p>Estimadas familias de <strong>${escaparHTML(nombreEscuela)}</strong>:</p>

                <p>
                    En este ciclo escolar estamos llevando a cabo el <strong>Plan Lector Jalisco LEO</strong>,
                    una estrategia estatal que busca que nuestras niñas, niños y adolescentes lean más,
                    lean mejor y, sobre todo, <em>disfruten</em> leer.
                </p>

                <p>
                    Como parte de este plan, el colectivo docente de <strong>${escaparHTML(nivelNombre)}</strong>
                    eligió trabajar este trimestre la <strong>${escaparHTML(ruta.nombre)}</strong>.
                </p>

                <div class="caja carmesi" style="font-family:'Fraunces',Georgia,serif;">
                    <em>"${escaparHTML(ruta.lema)}"</em>
                </div>

                <p>
                    <strong>¿Qué significa esto en la práctica?</strong><br>
                    ${escaparHTML(ruta.proposito)}
                </p>

                <p>
                    Su acompañamiento desde casa es fundamental. No se trata de "dar clases" ni de
                    convertirse en maestras o maestros: se trata de <strong>compartir la lectura</strong>,
                    de conversar sobre lo que se lee, de mostrar que los libros y las palabras también
                    son parte de la vida cotidiana.
                </p>

                <h3 style="font-family:'Fraunces',Georgia,serif;color:var(--carmesi);margin-top:1.5rem;">
                    Algunas sugerencias para casa
                </h3>

                <ul style="margin:0.5rem 0 1rem 1.25rem;line-height:1.8;">
                    ${sugerencias.map(s => `<li>${escaparHTML(s)}</li>`).join('')}
                </ul>

                <p>
                    Estaremos compartiendo con ustedes, a lo largo del trimestre, algunas actividades
                    en las que podrán participar. Cualquier duda, pueden acercarse a la escuela:
                    con mucho gusto la conversamos.
                </p>

                <p>
                    Gracias por ser parte de esta aventura lectora. Leer es un derecho,
                    y leer juntos es una forma de cuidarnos.
                </p>

                <p style="margin-top:1.5rem;">Con cariño,</p>
            </div>

            <div class="carta-firma">
                <div class="firma" style="margin-top:1.5rem;">
                    <div class="firma-linea">
                        <strong>${escaparHTML(director || '__________________________')}</strong>
                        Director(a) · ${escaparHTML(nombreEscuela)}
                    </div>
                    <div class="firma-linea">
                        <strong>Colectivo docente</strong>
                        ${escaparHTML(nivelNombre)}
                    </div>
                </div>
            </div>

            ${pie()}
        `;

        const nombre = `carta-familias-${ruta.id}-${fechaArchivo()}`;
        abrirVentana('Carta para Familias · Plan Lector Jalisco LEO', cuerpo, nombre);
    }

    /* ========================================================
       PRODUCTO 4 · BITÁCORA DE ACTIVIDADES
       ======================================================== */
    function generarBitacora() {
        const id = getIdentificacion();
        const m3 = getM3();
        const sel = m3.seleccionRutas || {};
        const ruta = (sel.rutaId && typeof DATOS !== 'undefined')
            ? DATOS.rutasLEO[sel.rutaId]
            : null;

        if (!ruta) {
            mostrarToast('Selecciona una ruta en 3.1 antes de generar la Bitácora.', 'error');
            return;
        }

        const actividades = m3.calendarizacion.actividades || [];
        const registros = m3.bitacora.registros || [];

        // Estadísticas
        const totalAct = actividades.length;
        const conReg = actividades.filter(a =>
            registros.some(r => r.actividadId === a.id)
        ).length;
        const pct = totalAct > 0 ? Math.round((conReg / totalAct) * 100) : 0;

        const porEstado = { 'no-iniciada': 0, 'en-proceso': 0, 'completada': 0, 'reprogramada': 0 };
        actividades.forEach(a => {
            const e = a.estado || 'no-iniciada';
            if (porEstado[e] !== undefined) porEstado[e]++;
        });

        // Registros por actividad (más recientes primero)
        function regsDe(actividadId) {
            return registros
                .filter(r => r.actividadId === actividadId)
                .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
        }

        // Agrupar por tipo
        const orden = ['ancla', 'banco', 'cierre', 'personalizada'];
        const grupos = {};
        orden.forEach(t => { grupos[t] = []; });
        actividades.forEach(a => {
            const t = a.tipo || 'personalizada';
            if (!grupos[t]) grupos[t] = [];
            grupos[t].push(a);
        });

        function bloqueGrupo(tipoId, items) {
            if (items.length === 0) return '';
            return `
                <div class="bloque">
                    <h2><i class="fas fa-bookmark"></i> ${escaparHTML(tipoLabel(tipoId))} (${items.length})</h2>
                    ${items.map(a => {
                        const regs = regsDe(a.id);
                        const estado = estadoLabel(a.estado || 'no-iniciada');
                        return `
                            <div class="caja" style="border-left-color: ${a.tipo === 'ancla' ? 'var(--carmesi)' : a.tipo === 'cierre' ? 'var(--verde)' : 'var(--naranja)'};">
                                <strong>${escaparHTML(a.nombre)}</strong>
                                <span class="chip ${a.tipo === 'ancla' ? 'carmesi' : a.tipo === 'cierre' ? 'verde' : 'naranja'}">${escaparHTML(tipoLabel(a.tipo))}</span>
                                <span class="chip">${escaparHTML(mesLabel(a.mes))}</span>
                                <span class="chip gris">${escaparHTML(estado)}</span>
                                ${regs.length > 0
                                    ? regs.map(r => `
                                        <div style="margin-top:0.6rem;padding-top:0.6rem;border-top:1px dashed var(--gris-borde);font-size:10pt;">
                                            <strong style="color:var(--carmesi);">${escaparHTML(formatearFecha(r.fecha))}</strong>
                                            · <em>${escaparHTML(estadoLabel(r.estado || 'completada'))}</em>
                                            ${r.participantes ? `<br><strong>Participantes:</strong> ${escaparHTML(r.participantes)}` : ''}
                                            ${r.observaciones ? `<br>${escaparHTML(r.observaciones)}` : ''}
                                            ${Array.isArray(r.evidencias) && r.evidencias.length > 0
                                                ? `<br><strong>Evidencias:</strong> ${r.evidencias.map(e => `<span class="chip gris">${escaparHTML(e)}</span>`).join('')}`
                                                : ''
                                            }
                                        </div>
                                    `).join('')
                                    : '<p style="margin:0.5rem 0 0;color:var(--tinta-suave);"><em>Sin registros de bitácora todavía.</em></p>'
                                }
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        const cuerpo = `
            ${marca()}
            <h1 style="margin-bottom:1rem;">Bitácora de Actividades</h1>

            ${metaIdentificacion(id)}

            <div class="bloque">
                <h2><i class="fas fa-route"></i> Ruta trabajada</h2>
                <h3>${escaparHTML(ruta.nombre)}</h3>
                <p class="lema">"${escaparHTML(ruta.lema)}"</p>
            </div>

            <div class="bloque">
                <h2><i class="fas fa-chart-pie"></i> Resumen de implementación</h2>
                <div class="caja">
                    <strong>Actividades registradas:</strong> ${conReg} de ${totalAct} (${pct}%)
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Completadas</th>
                            <th>En proceso</th>
                            <th>No iniciadas</th>
                            <th>Reprogramadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${porEstado['completada']}</td>
                            <td>${porEstado['en-proceso']}</td>
                            <td>${porEstado['no-iniciada']}</td>
                            <td>${porEstado['reprogramada']}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            ${bloqueGrupo('ancla', grupos['ancla'] || [])}
            ${bloqueGrupo('banco', grupos['banco'] || [])}
            ${bloqueGrupo('cierre', grupos['cierre'] || [])}
            ${bloqueGrupo('personalizada', grupos['personalizada'] || [])}

            ${m3.bitacora.notas ? `
                <div class="bloque">
                    <h2><i class="fas fa-comment-dots"></i> Notas generales</h2>
                    <div class="caja">${escaparHTML(m3.bitacora.notas)}</div>
                </div>
            ` : ''}

            ${firmas(id)}
            ${pie()}
        `;

        const nombre = `bitacora-actividades-${fechaArchivo()}`;
        abrirVentana('Bitácora de Actividades · Plan Lector Jalisco LEO', cuerpo, nombre);
    }
    /* ========================================================
       PRODUCTO 5 · ACTA DE ACUERDOS (Momento 4)
       ======================================================== */
    function generarActaAcuerdos() {
        const id = getIdentificacion();
        const m3 = getM3();
        const sel = m3.seleccionRutas || {};
        const ruta = (sel.rutaId && typeof DATOS !== 'undefined')
            ? DATOS.rutasLEO[sel.rutaId]
            : null;

        // Momento 4
        let m4 = { acuerdos: [], proximosPasos: '', fechaProximoSeguimiento: '', convocaProximo: '', firmas: { director: '', atp: '', docentes: [] } };
        if (typeof ESTADO !== 'undefined' && typeof ESTADO.obtenerSeccion === 'function') {
            try {
                const m = ESTADO.obtenerSeccion('momento4') || {};
                if (Array.isArray(m.acuerdos)) m4.acuerdos = m.acuerdos;
                if (typeof m.proximosPasos === 'string') m4.proximosPasos = m.proximosPasos;
                if (typeof m.fechaProximoSeguimiento === 'string') m4.fechaProximoSeguimiento = m.fechaProximoSeguimiento;
                if (typeof m.convocaProximo === 'string') m4.convocaProximo = m.convocaProximo;
                if (m.firmas && typeof m.firmas === 'object') {
                    m4.firmas = {
                        director: m.firmas.director || '',
                        atp: m.firmas.atp || '',
                        docentes: Array.isArray(m.firmas.docentes) ? m.firmas.docentes : []
                    };
                }
            } catch (e) { /* silencio */ }
        }

        if (!m4.acuerdos || m4.acuerdos.length === 0) {
            mostrarToast('Agrega al menos un acuerdo antes de generar el Acta.', 'error');
            return;
        }

        const estadoLabel = {
            'pendiente':   'Pendiente',
            'en-proceso':  'En proceso',
            'cumplido':    'Cumplido',
            'reprogramado':'Reprogramado'
        };

        const filasAcuerdos = m4.acuerdos.map((a, i) => `
            <tr>
                <td style="text-align:center;width:5%;">${i + 1}</td>
                <td style="width:45%;">${escaparHTML(a.texto || '')}</td>
                <td style="width:22%;">${escaparHTML(a.responsables || '—')}</td>
                <td style="width:15%;">${escaparHTML(formatearFecha(a.fechaCompromiso))}</td>
                <td style="width:13%;">${escaparHTML(estadoLabel[a.estado] || a.estado || '—')}</td>
            </tr>
        `).join('');

        const docentesFirmantes = Array.isArray(m4.firmas.docentes) ? m4.firmas.docentes : [];

        const cuerpo = `
            ${marca()}
            <h1 style="margin-bottom:1rem;">Acta de Acuerdos</h1>

            ${metaIdentificacion(id)}

            <div class="bloque">
                <h2><i class="fas fa-clipboard-list"></i> Contexto de la sesión</h2>
                <p>
                    En la sesión del Consejo Técnico Escolar de la escuela
                    <strong>${escaparHTML(id.nombreEscuela || '—')}</strong>
                    (CCT ${escaparHTML(id.cct || '—')}), con fecha del CTE
                    <strong>${escaparHTML(id.fechaCTE || '—')}</strong>, el colectivo docente
                    acordó lo siguiente en el marco del <strong>Plan Lector Jalisco LEO</strong>.
                </p>

                ${ruta ? `
                    <div class="caja carmesi">
                        <strong>Ruta LEO del trimestre:</strong>
                        ${escaparHTML(ruta.nombre)}
                        <br><em>"${escaparHTML(ruta.lema)}"</em>
                    </div>
                ` : ''}
            </div>

            <div class="bloque">
                <h2><i class="fas fa-handshake"></i> Acuerdos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Acuerdo</th>
                            <th>Responsable(s)</th>
                            <th>Fecha compromiso</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>${filasAcuerdos}</tbody>
                </table>
            </div>

            ${m4.proximosPasos ? `
                <div class="bloque">
                    <h2><i class="fas fa-forward"></i> Próximos pasos</h2>
                    <div class="caja">${escaparHTML(m4.proximosPasos)}</div>
                </div>
            ` : ''}

            ${(m4.fechaProximoSeguimiento || m4.convocaProximo) ? `
                <div class="bloque">
                    <h2><i class="fas fa-calendar-check"></i> Próximo seguimiento</h2>
                    <p>
                        ${m4.fechaProximoSeguimiento
                            ? `<strong>Fecha:</strong> ${escaparHTML(formatearFecha(m4.fechaProximoSeguimiento))}<br>`
                            : ''
                        }
                        ${m4.convocaProximo
                            ? `<strong>Convoca:</strong> ${escaparHTML(m4.convocaProximo)}`
                            : ''
                        }
                    </p>
                </div>
            ` : ''}

            <div class="bloque">
                <h2><i class="fas fa-signature"></i> Firmas</h2>
                <table>
                    <thead>
                        <tr>
                            <th style="width:50%;">Nombre</th>
                            <th style="width:50%;">Rol / Función</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${escaparHTML(m4.firmas.director || id.director || '__________________________')}</td>
                            <td>Director(a) de la escuela</td>
                        </tr>
                        <tr>
                            <td>${escaparHTML(m4.firmas.atp || id.atp || '__________________________')}</td>
                            <td>ATP / Supervisor(a)</td>
                        </tr>
                        ${docentesFirmantes.map(d => `
                            <tr>
                                <td>${escaparHTML(d.nombre || '—')}</td>
                                <td>${escaparHTML(d.rol || 'Docente')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            ${pie()}
        `;

        const nombre = `acta-acuerdos-${fechaArchivo()}`;
        abrirVentana('Acta de Acuerdos · Plan Lector Jalisco LEO', cuerpo, nombre);
    }
    /* ========================================================
       HELPERS LOCALES
       ======================================================== */
    function fechaArchivo() {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}${mm}${dd}`;
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        generarHojaRuta,
        generarFichaRuta,
        generarCartaFamilias,
        generarBitacora
    };

})();

/* ============================================================
   EXPOSICIÓN A WINDOW — FIX CRÍTICO
   ============================================================ */
if (typeof window !== 'undefined') {
    window.PRODUCTOS = PRODUCTOS;
    console.log('✅ PRODUCTOS expuesto en window (v1.0)');
}
