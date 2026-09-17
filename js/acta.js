/* ============================================================
   TERMÓMETRO LECTOR · JALISCO LEO
   acta.js — Acta de Diagnóstico
   ============================================================ */

const ACTA = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let contenedor = null;

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        contenedor = document.getElementById('contenido-acta');
        if (!contenedor) return;

        renderizar();
        suscribirCambios();
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar() {
        const a = ESTADO.obtenerSeccion('acta');
        const id = ESTADO.obtenerSeccion('identificacion');
        const lb = ESTADO.obtenerSeccion('lineaBase');
        const saal = ESTADO.obtenerSeccion('saal');
        const v = ESTADO.obtenerSeccion('voces');
        const t = ESTADO.obtenerSeccion('termometro');
        const r = ESTADO.obtenerSeccion('rutas');

        const tieneSAAL = saal.tieneSAAL === 'si';

        contenedor.innerHTML = `
            <div class="acta-wrapper">

                <!-- ===== ENCABEZADO DEL ACTA ===== -->
                <div class="acta-header">
                    <div class="acta-logo">Jalisco LEO · Estrategia Estatal de Lectura, Escritura y Oralidad</div>
                    <h1>Acta de Diagnóstico</h1>
                    <p class="acta-subtitulo">Termómetro Lector · Momento 2</p>
                </div>

                <!-- ===== RESUMEN EJECUTIVO ===== -->
                <div class="acta-resumen-ejecutivo">
                    <h2><i class="fas fa-file-lines"></i> Resumen ejecutivo</h2>
                    ${renderizarResumenEjecutivo(id, lb, saal, v, t, r, tieneSAAL)}
                </div>

                <!-- ===== 1. IDENTIFICACIÓN ===== -->
                <div class="acta-seccion">
                    <h2>1. Identificación</h2>
                    ${renderizarIdentificacion(id)}
                </div>

                <!-- ===== 2. LÍNEA BASE ===== -->
                <div class="acta-seccion">
                    <h2>2. Línea Base · Jalisco Avanza 2025</h2>
                    ${renderizarLineaBase(lb, id)}
                </div>

                <!-- ===== 3. SAAL ===== -->
                ${tieneSAAL ? `
                    <div class="acta-seccion">
                        <h2>3. Diagnóstico SAAL</h2>
                        ${renderizarSAAL(saal)}
                    </div>
                ` : ''}

                <!-- ===== 4. VOCES ===== -->
                <div class="acta-seccion">
                    <h2>4. Voces del Ecosistema</h2>
                    ${renderizarVoces(v)}
                </div>

                <!-- ===== 5. TERMÓMETRO ===== -->
                <div class="acta-seccion">
                    <h2>5. Termómetro Visual</h2>
                    ${renderizarTermometro(t, tieneSAAL)}
                </div>

                <!-- ===== 6. RUTAS ===== -->
                <div class="acta-seccion">
                    <h2>6. Rutas Sugeridas</h2>
                    ${renderizarRutas(r)}
                </div>

                <!-- ===== 7. ACUERDOS ===== -->
                <div class="acta-seccion">
                    <h2>7. Acuerdos</h2>
                    <div class="form-grupo">
                        <label>Compromisos y próximos pasos</label>
                        <textarea id="acta-acuerdos" placeholder="Escribe los acuerdos del colectivo...">${a.acuerdos || ''}</textarea>
                    </div>
                    <div class="form-grupo">
                        <label>Fecha compromiso</label>
                        <input type="date" id="acta-fecha-compromiso" value="${a.fechaCompromiso || ''}">
                    </div>
                </div>

                <!-- ===== 8. FIRMAS ===== -->
                <div class="acta-seccion acta-firmas">
                    <h2>8. Firmas</h2>
                    <div class="firmas-grid">
                        <div>
                            <input type="text" id="firma-director" placeholder="Nombre del director(a)"
                                   value="${a.firmas?.director || ''}" style="width:100%; margin-bottom:0.5rem;">
                            <div class="firma-linea">Director(a)</div>
                        </div>
                        <div>
                            <input type="text" id="firma-atp" placeholder="Nombre del ATP/supervisor"
                                   value="${a.firmas?.atp || ''}" style="width:100%; margin-bottom:0.5rem;">
                            <div class="firma-linea">ATP / Supervisor</div>
                        </div>
                    </div>
                </div>

                <!-- ===== ACCIONES DE EXPORTACIÓN ===== -->
                <div class="acta-acciones no-print">
                    <button type="button" class="btn btn-primario" id="btn-exportar-pdf">
                        <i class="fas fa-file-pdf"></i> Exportar PDF
                    </button>
                    <button type="button" class="btn btn-naranja" id="btn-exportar-html">
                        <i class="fas fa-file-code"></i> Descargar HTML
                    </button>
                    <button type="button" class="btn btn-secundario" id="btn-imprimir">
                        <i class="fas fa-print"></i> Imprimir
                    </button>
                </div>

                <!-- ===== PIE ===== -->
                <div class="acta-footer">
                    Jalisco LEO · Estrategia Estatal de Lectura, Escritura y Oralidad 2025-2030
                    <br>Documento generado el ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       RESUMEN EJECUTIVO
       ======================================================== */
    function renderizarResumenEjecutivo(id, lb, saal, v, t, r, tieneSAAL) {
        const nombreEscuela = id.nombreEscuela || '(escuela sin nombre)';
        const cct = id.cct || '(sin CCT)';
        const nivel = id.nivel || '(sin nivel)';
        const grados = (id.grados || []).join(', ') || '(sin grados)';

        // Contar semáforos
        const dimensiones = t.dimensiones || {};
        const rojos = Object.values(dimensiones).filter(c => c === 'rojo').length;
        const amarillos = Object.values(dimensiones).filter(c => c === 'amarillo').length;
        const verdes = Object.values(dimensiones).filter(c => c === 'verde').length;

        // Rutas seleccionadas
        const rutasSel = (r.seleccionadas || []).map(s => {
            const ruta = DATOS.rutasLEO[s.rutaId];
            return ruta ? ruta.nombre : s.rutaId;
        });

        return `
            <p><strong>Escuela:</strong> ${nombreEscuela} · <strong>CCT:</strong> ${cct}</p>
            <p><strong>Nivel:</strong> ${nivel} · <strong>Grados:</strong> ${grados}</p>
            <p><strong>Modo de llenado:</strong> ${id.modoLlenado || '—'}</p>

            <h4 style="margin-top:1rem;">Hallazgos principales</h4>
            <ul>
                <li><strong>Dimensiones en 🔴 Atención prioritaria:</strong> ${rojos}</li>
                <li><strong>Dimensiones en 🟡 En progreso:</strong> ${amarillos}</li>
                <li><strong>Dimensiones en 🟢 Fortaleza:</strong> ${verdes}</li>
                ${tieneSAAL ? `<li><strong>SAAL:</strong> Sí, con ${(saal.resumenGrados || []).length} grupo(s) evaluado(s).</li>` : '<li><strong>SAAL:</strong> No disponible.</li>'}
                <li><strong>Rutas seleccionadas:</strong> ${rutasSel.length > 0 ? rutasSel.join(', ') : 'Ninguna aún.'}</li>
            </ul>

            ${rojos > 5 ? `
                <div class="caja-alerta" style="margin-top:1rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Alerta:</strong> Más de 5 dimensiones en atención prioritaria.
                    Se recomienda focalizar esfuerzos en las más críticas.
                </div>
            ` : ''}
        `;
    }

    /* ========================================================
       SECCIÓN 1: IDENTIFICACIÓN
       ======================================================== */
    function renderizarIdentificacion(id) {
        return `
            <table>
                <tbody>
                    <tr><td><strong>Región</strong></td><td>${id.region || '—'}</td></tr>
                    <tr><td><strong>Municipio</strong></td><td>${id.municipio || '—'}</td></tr>
                    <tr><td><strong>CCT</strong></td><td>${id.cct || '—'}</td></tr>
                    <tr><td><strong>Nombre de la escuela</strong></td><td>${id.nombreEscuela || '—'}</td></tr>
                    <tr><td><strong>Turno</strong></td><td>${id.turno || '—'}</td></tr>
                    <tr><td><strong>Nivel educativo</strong></td><td>${id.nivel || '—'}</td></tr>
                    <tr><td><strong>Grados que atiende</strong></td><td>${(id.grados || []).join(', ') || '—'}</td></tr>
                    <tr><td><strong>Número de estudiantes</strong></td><td>${id.numeroEstudiantes || '—'}</td></tr>
                    <tr><td><strong>Director(a)</strong></td><td>${id.director || '—'}</td></tr>
                    <tr><td><strong>ATP / Supervisor</strong></td><td>${id.atp || '—'}</td></tr>
                    <tr><td><strong>Fecha del CTE</strong></td><td>${id.fechaCTE || '—'}</td></tr>
                    <tr><td><strong>Modo de llenado</strong></td><td>${id.modoLlenado || '—'}</td></tr>
                </tbody>
            </table>
        `;
    }

    /* ========================================================
       SECCIÓN 2: LÍNEA BASE
       ======================================================== */
    function renderizarLineaBase(lb, id) {
        if (!lb.datosEscuela || lb.datosEscuela.length === 0) {
            return '<p class="ayuda">Sin datos de Línea Base.</p>';
        }

        const fuente = id.nivel === 'Primaria' ? DATOS.lineaBase.primaria : DATOS.lineaBase.secundaria;

        return `
            <h3>Referencia estatal</h3>
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr><th>Grado</th><th>Media</th><th>🟢 Deseable</th><th>🟡 En progreso</th><th>🔴 Atención</th></tr>
                    </thead>
                    <tbody>
                        ${(id.grados || []).map(g => {
                            const key = g.charAt(0);
                            const d = fuente[key];
                            if (!d) return '';
                            return `<tr><td><strong>${d.grado}</strong></td><td>${d.media}%</td><td>${d.deseable}%</td><td>${d.enProgreso}%</td><td>${d.atencionPrioritaria}%</td></tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <h3>Datos de la escuela</h3>
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr><th>Grupo</th><th>Media</th><th>Deseable</th><th>En progreso</th><th>Atención</th><th>Brecha</th></tr>
                    </thead>
                    <tbody>
                        ${lb.datosEscuela.map(d => {
                            const key = (d.grado || '').charAt(0);
                            const estatal = fuente[key];
                            const brecha = estatal && d.media ? (parseFloat(d.media) - estatal.media).toFixed(1) : '—';
                            return `<tr>
                                <td><strong>${d.grado}${d.grupo ? ' · ' + d.grupo : ''}</strong></td>
                                <td>${d.media || '—'}%</td>
                                <td>${d.deseable || '—'}%</td>
                                <td>${d.enProgreso || '—'}%</td>
                                <td>${d.atencionPrioritaria || '—'}%</td>
                                <td>${brecha !== '—' ? (brecha > 0 ? '+' : '') + brecha : '—'}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            ${lb.observaciones ? `<h3>Observaciones</h3><p>${lb.observaciones}</p>` : ''}
        `;
    }

    /* ========================================================
       SECCIÓN 3: SAAL
       ======================================================== */
    function renderizarSAAL(saal) {
        if (!saal.resumenGrados || saal.resumenGrados.length === 0) {
            return '<p class="ayuda">Sin datos SAAL.</p>';
        }

        return `
            <h3>Resumen por grado</h3>
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr><th>Grupo</th><th>Evaluados</th><th>🟢 Deseable</th><th>🟡 En progreso</th><th>🔴 Atención</th></tr>
                    </thead>
                    <tbody>
                        ${saal.resumenGrados.map(d => `
                            <tr>
                                <td><strong>${d.grado}${d.grupo ? ' · ' + d.grupo : ''}</strong></td>
                                <td>${d.evaluados || '—'}</td>
                                <td>${d.deseable || '—'}</td>
                                <td>${d.enProgreso || '—'}</td>
                                <td>${d.atencionPrioritaria || '—'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <h3>Componentes débiles</h3>
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr><th>Componente</th><th>% Atención prioritaria</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                        ${DATOS.componentesSAAL.todos.map(c => {
                            const valor = saal.componentesDebiles?.[c.id];
                            if (valor === undefined || valor === '') return '';
                            const estado = valor >= 50 ? '🔴 ALERTA' : valor >= 30 ? '🔴 CRÍTICO' : valor >= 15 ? '🟡 En progreso' : '🟢 OK';
                            return `<tr><td><strong>${c.nombre}</strong></td><td>${valor}%</td><td>${estado}</td></tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            ${saal.observaciones ? `<h3>Observaciones</h3><p>${saal.observaciones}</p>` : ''}
        `;
    }

    /* ========================================================
       SECCIÓN 4: VOCES
       ======================================================== */
    function renderizarVoces(v) {
        const grupos = [
            { key: 'estudiantes', nombre: 'Estudiantes' },
            { key: 'familias', nombre: 'Familias' },
            { key: 'docentes', nombre: 'Docentes' }
        ];

        let html = '';

        grupos.forEach(g => {
            const respuestas = v[g.key] || {};
            const preguntas = DATOS.voces[g.key] || [];

            if (Object.keys(respuestas).length === 0) return;

            html += `<h3>${g.nombre}</h3><ul>`;
            preguntas.forEach(p => {
                const resp = respuestas[p.id];
                if (resp === undefined || (Array.isArray(resp) && resp.length === 0)) return;
                const valor = Array.isArray(resp) ? resp.join(', ') : resp;
                html += `<li><strong>${p.pregunta}</strong> ${valor}</li>`;
            });
            html += `</ul>`;
        });

        // Síntesis
        const sintesis = v.sintesis || {};
        if (Object.keys(sintesis).length > 0) {
            html += `<h3>Síntesis del ecosistema</h3>`;
            html += `<div class="tabla-wrapper"><table><thead><tr><th>Dimensión</th><th>Semáforo</th></tr></thead><tbody>`;
            DATOS.dimensiones.filter(d => d.grupo === 'Voces').forEach(d => {
                const color = sintesis[d.id] || 'gris';
                html += `<tr><td>${d.nombre}</td><td><span class="semaforo"><span class="semaforo-punto ${color}"></span>${color}</span></td></tr>`;
            });
            html += `</tbody></table></div>`;
        }

        return html || '<p class="ayuda">Sin datos de Voces.</p>';
    }

    /* ========================================================
       SECCIÓN 5: TERMÓMETRO
       ======================================================== */
    function renderizarTermometro(t, tieneSAAL) {
        const dimensiones = t.dimensiones || {};

        if (Object.keys(dimensiones).length === 0) {
            return '<p class="ayuda">Sin datos del Termómetro.</p>';
        }

        return `
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr><th>#</th><th>Dimensión</th><th>Fuente</th><th>Semáforo</th></tr>
                    </thead>
                    <tbody>
                        ${DATOS.dimensiones
                            .filter(d => tieneSAAL || d.grupo !== 'SAAL')
                            .map(d => {
                                const color = dimensiones[d.id] || 'gris';
                                return `<tr>
                                    <td>${d.numero}</td>
                                    <td><strong>${d.nombre}</strong></td>
                                    <td>${d.fuente}</td>
                                    <td><span class="semaforo"><span class="semaforo-punto ${color}"></span>${color}</span></td>
                                </tr>`;
                            }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /* ========================================================
       SECCIÓN 6: RUTAS
       ======================================================== */
    function renderizarRutas(r) {
        const seleccionadas = r.seleccionadas || [];

        if (seleccionadas.length === 0) {
            return '<p class="ayuda">Sin rutas seleccionadas.</p>';
        }

        return `
            <div class="tabla-wrapper">
                <table>
                    <thead>
                        <tr><th>Orden</th><th>Ruta</th><th>Lema</th></tr>
                    </thead>
                    <tbody>
                        ${seleccionadas.map((s, i) => {
                            const ruta = DATOS.rutasLEO[s.rutaId];
                            if (!ruta) return '';
                            return `<tr>
                                <td><strong>${i + 1}</strong></td>
                                <td><strong>${ruta.nombre}</strong></td>
                                <td><em>${ruta.lema}</em></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        // Acuerdos
        const acuerdos = document.getElementById('acta-acuerdos');
        if (acuerdos) {
            acuerdos.addEventListener('input', (e) => {
                ESTADO.actualizarCampo('acta', 'acuerdos', e.target.value);
            });
        }

        // Fecha compromiso
        const fecha = document.getElementById('acta-fecha-compromiso');
        if (fecha) {
            fecha.addEventListener('change', (e) => {
                ESTADO.actualizarCampo('acta', 'fechaCompromiso', e.target.value);
            });
        }

        // Firmas
        const firmaDirector = document.getElementById('firma-director');
        if (firmaDirector) {
            firmaDirector.addEventListener('input', (e) => {
                const a = ESTADO.obtenerSeccion('acta');
                const nuevasFirmas = { ...(a.firmas || {}), director: e.target.value };
                ESTADO.actualizarCampo('acta', 'firmas', nuevasFirmas);
            });
        }

        const firmaATP = document.getElementById('firma-atp');
        if (firmaATP) {
            firmaATP.addEventListener('input', (e) => {
                const a = ESTADO.obtenerSeccion('acta');
                const nuevasFirmas = { ...(a.firmas || {}), atp: e.target.value };
                ESTADO.actualizarCampo('acta', 'firmas', nuevasFirmas);
            });
        }

        // Exportar PDF
        const btnPDF = document.getElementById('btn-exportar-pdf');
        if (btnPDF) {
            btnPDF.addEventListener('click', exportarPDF);
        }

        // Exportar HTML
        const btnHTML = document.getElementById('btn-exportar-html');
        if (btnHTML) {
            btnHTML.addEventListener('click', exportarHTML);
        }

        // Imprimir
        const btnImprimir = document.getElementById('btn-imprimir');
        if (btnImprimir) {
            btnImprimir.addEventListener('click', () => window.print());
        }
    }

    /* ========================================================
       EXPORTAR PDF (usa el diálogo de impresión del navegador)
       ======================================================== */
    function exportarPDF() {
        // Guardar acuerdos antes de exportar
        ESTADO.guardar(true);
        // Abrir diálogo de impresión (el usuario elige "Guardar como PDF")
        window.print();
        ESTADO.notificar('pdfExportado', {});
    }

    /* ========================================================
       EXPORTAR HTML
       ======================================================== */
    function exportarHTML() {
        const html = generarHTMLCompleto();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `acta-diagnostico-${ESTADO.fechaArchivo()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        ESTADO.notificar('htmlExportado', {});
    }

    /* ========================================================
       GENERAR HTML COMPLETO PARA EXPORTAR
       ======================================================== */
    function generarHTMLCompleto() {
        const contenidoActa = contenedor.innerHTML;

        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Acta de Diagnóstico · Termómetro Lector</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --carmesi: #E50746;
            --naranja: #D96F0A;
            --gris-medio: #A19C95;
            --gris-oscuro: #4A4A4A;
            --crema: #F5F0E6;
            --blanco: #FFFFFF;
            --verde: #2E9E5B;
            --amarillo: #E8B93B;
            --rojo: #D93B3B;
            --verde-claro: #D4EDDA;
            --amarillo-claro: #FFF3CD;
            --rojo-claro: #F8D7DA;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: var(--crema);
            color: var(--gris-oscuro);
            line-height: 1.7;
            padding: 2rem 1rem;
        }
        .acta-wrapper {
            max-width: 900px;
            margin: 0 auto;
            background: var(--blanco);
            border-radius: 1.5rem;
            padding: 2.5rem;
            box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.06);
        }
        .acta-header { text-align: center; padding: 1.5rem 0 1rem; border-bottom: 3px solid var(--carmesi); margin-bottom: 2rem; }
        .acta-header .acta-logo { font-size: 0.85rem; font-weight: 600; color: var(--naranja); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem; }
        .acta-header h1 { color: var(--carmesi); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.3rem; }
        .acta-header .acta-subtitulo { color: var(--gris-oscuro); font-size: 1rem; font-weight: 500; }
        .acta-seccion { margin-bottom: 2rem; }
        .acta-seccion h2 { color: var(--carmesi); font-size: 1.3rem; font-weight: 800; padding-bottom: 0.4rem; border-bottom: 2px solid var(--naranja); margin-bottom: 1rem; }
        .acta-seccion h3 { color: var(--carmesi); font-size: 1.05rem; font-weight: 700; margin: 1.25rem 0 0.6rem; }
        .acta-resumen-ejecutivo { background: var(--crema); padding: 1.5rem; border-radius: 1.5rem; border: 2px solid var(--carmesi); margin-bottom: 2rem; }
        .acta-resumen-ejecutivo h2 { color: var(--carmesi); font-size: 1.3rem; margin-bottom: 0.75rem; border-bottom: 2px solid var(--naranja); padding-bottom: 0.4rem; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
        thead { background: var(--carmesi); color: var(--blanco); }
        thead th { padding: 0.7rem 1rem; text-align: left; font-weight: 700; }
        tbody tr:nth-child(even) { background: #FDF8F5; }
        tbody td { padding: 0.6rem 1rem; border-bottom: 1px solid rgba(161, 156, 149, 0.15); }
        .semaforo { display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600; }
        .semaforo-punto { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
        .semaforo-punto.verde { background: var(--verde); }
        .semaforo-punto.amarillo { background: var(--amarillo); }
        .semaforo-punto.rojo { background: var(--rojo); }
        .semaforo-punto.gris { background: #D9D5D0; }
        .chip { display: inline-block; background: var(--crema); font-weight: 500; font-size: 0.8rem; padding: 0.2rem 0.7rem; border-radius: 100px; margin: 0.1rem; }
        .chip.verde { background: var(--verde-claro); color: #155724; }
        .chip.amarillo { background: var(--amarillo-claro); color: #856404; }
        .chip.rojo { background: var(--rojo-claro); color: #721c24; }
        .caja-alerta { background: var(--rojo-claro); border-left: 4px solid var(--rojo); padding: 1rem; margin: 1rem 0; border-radius: 0.5rem; color: #721c24; }
        .ayuda { font-size: 0.85rem; color: var(--gris-medio); }
        .acta-firmas { margin-top: 2rem; }
        .firmas-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-top: 1.5rem; }
        .firma-linea { border-top: 1px solid var(--gris-oscuro); margin-top: 3rem; padding-top: 0.3rem; text-align: center; font-size: 0.85rem; font-weight: 600; }
        .acta-footer { text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #D9D5D0; font-size: 0.8rem; color: var(--gris-medio); }
        .no-print { display: none; }
        @media print {
            body { background: white; padding: 0; }
            .acta-wrapper { box-shadow: none; border-radius: 0; max-width: 100%; padding: 0; }
            .no-print { display: none; }
            .acta-resumen-ejecutivo { page-break-after: always; }
            .acta-seccion { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="acta-wrapper">
        ${contenidoActa}
    </div>
</body>
</html>`;
    }

    /* ========================================================
       SUSCRIBIR CAMBIOS EXTERNOS
       ======================================================== */
    function suscribirCambios() {
        ESTADO.suscribir((evento) => {
            if (evento === 'reiniciado' || evento === 'borradorCargado' || evento === 'importado') {
                renderizar();
            }
            if (evento === 'seccionActualizada' || evento === 'campoActualizado') {
                // Re-renderizar cuando cambien secciones anteriores
                // (pero con debounce para no perder foco en los inputs del acta)
            }
        });
    }

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    document.addEventListener('DOMContentLoaded', init);

    return { init, renderizar };

})();
