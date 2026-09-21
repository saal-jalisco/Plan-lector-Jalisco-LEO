/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento0.js — Preparación (Insumos para el diagnóstico)
   v2.0 — PEI → PMC + guardado/carga funcional en localStorage
   ============================================================ */

window.Momento0 = {

    /* ===== CLAVE DE ALMACENAMIENTO ===== */
    CLAVE_LS: 'plan_lector_jalisco_leo_momento0',

    /* ===== ESTADO LOCAL ===== */
    insumos: {
        documentales: [
            { id: 'ja2025', texto: 'Resultados de Jalisco Avanza 2025 (por grado y UA)', listo: false },
            { id: 'pmc', texto: 'Programa de Mejora Continua (PMC)', listo: false },
            { id: 'convivencia', texto: 'Plan de Convivencia', listo: false },
            { id: 'curriculum', texto: 'Currículum vigente (Bases Curriculares)', listo: false },
            { id: 'estrategia', texto: 'Estrategia Jalisco LEO (documento estatal)', listo: false }
        ],
        infraestructura: [
            { id: 'biblioteca', texto: 'Estado de la biblioteca escolar', listo: false },
            { id: 'acervos', texto: 'Acervos disponibles (cantidad y diversidad)', listo: false },
            { id: 'espacios', texto: 'Espacios de lectura (aula, patio, biblioteca, digital)', listo: false },
            { id: 'conectividad', texto: 'Conectividad y equipos digitales', listo: false }
        ],
        humanos: [
            { id: 'equipo_lider', texto: 'Equipo líder del Plan Lector (directivos, docentes, bibliotecario)', listo: false },
            { id: 'docentes', texto: 'Docentes de todas las asignaturas dispuestos a participar', listo: false },
            { id: 'familias', texto: 'Familias y apoderados interesados', listo: false },
            { id: 'aliados', texto: 'Aliados externos (bibliotecas públicas, instituciones culturales)', listo: false }
        ],
        pedagogicos: [
            { id: 'diagnostico', texto: 'Diagnóstico inicial de prácticas lectoras del centro', listo: false },
            { id: 'encuesta', texto: 'Encuesta de intereses lectores del alumnado', listo: false },
            { id: 'deteccion', texto: 'Detección temprana de dificultades lectoras', listo: false },
            { id: 'catalogo', texto: 'Catálogo de Actividades Permanentes LEO', listo: false }
        ]
    },

    /* ===== RENDER PRINCIPAL ===== */
    render() {
        const contenedor = document.getElementById('contenido-momento0');
        if (!contenedor) return;

        contenedor.innerHTML = `
            <div class="momento0-contenedor">
                ${this.renderHeader()}
                ${this.renderIntroduccion()}
                ${this.renderListas()}
                ${this.renderAcciones()}
                ${this.renderNotaOrientadora()}
                ${this.renderNavegacion()}
            </div>
        `;

        this.attachEventos();
    },

    /* ===== HEADER ===== */
    renderHeader() {
        return `
            <div class="momento0-header">
                <div class="momento0-badge">MOMENTO 0</div>
                <h1>Preparación</h1>
                <p class="momento0-subtitulo">Reunamos los insumos antes de iniciar el diagnóstico</p>
            </div>
        `;
    },

    /* ===== INTRODUCCIÓN ===== */
    renderIntroduccion() {
        return `
            <div class="caja-destacada momento0-intro">
                <p>
                    Antes de comenzar el diagnóstico y el diseño del Plan Lector, es fundamental
                    que la comunidad educativa reúna los insumos necesarios. Esta preparación
                    permite partir de una base sólida y evita que el proceso se convierta en una
                    suma de actividades aisladas.
                </p>
                <p>
                    <strong>¿Cómo usar esta lista?</strong> Revisen cada insumo en la Fase Intensiva
                    del Consejo Técnico Escolar. Marquen los que ya tienen y prioricen los que
                    faltan por conseguir.
                </p>
            </div>
        `;
    },

    /* ===== LISTAS DE INSUMOS ===== */
    renderListas() {
        const categorias = [
            { key: 'documentales', titulo: 'Insumos documentales', icono: 'fa-file-alt' },
            { key: 'infraestructura', titulo: 'Insumos de infraestructura', icono: 'fa-school' },
            { key: 'humanos', titulo: 'Insumos humanos', icono: 'fa-users' },
            { key: 'pedagogicos', titulo: 'Insumos pedagógicos', icono: 'fa-book' }
        ];

        return categorias.map(cat => `
            <div class="momento0-categoria">
                <h2><i class="fas ${cat.icono}"></i> ${cat.titulo}</h2>
                <ul class="momento0-lista">
                    ${this.insumos[cat.key].map(item => `
                        <li class="momento0-item ${item.listo ? 'listo' : ''}" data-id="${item.id}" data-categoria="${cat.key}">
                            <label>
                                <input type="checkbox" ${item.listo ? 'checked' : ''} data-id="${item.id}" data-categoria="${cat.key}">
                                <span>${item.texto}</span>
                            </label>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    },

    /* ===== ACCIONES ===== */
    renderAcciones() {
        return `
            <div class="momento0-acciones">
                <button class="btn btn-primario" id="btn-guardar-momento0">
                    <i class="fas fa-save"></i> Guardar estado de preparación
                </button>
                <button class="btn btn-secundario" id="btn-marcar-todo-momento0">
                    <i class="fas fa-check-double"></i> Marcar todo como listo
                </button>
            </div>
        `;
    },

    /* ===== NOTA ORIENTADORA ===== */
    renderNotaOrientadora() {
        return `
            <div class="caja-info momento0-nota">
                <h3><i class="fas fa-thumbtack"></i> Nota orientadora</h3>
                <p>
                    No es necesario
                    tener todos los insumos para comenzar, pero sí es importante identificarlos
                    para saber qué priorizar.
                </p>
                <p>
                    Recuerda que el <strong>Catálogo de Actividades Permanentes LEO</strong> y el
                    <strong>Micrositio Jalisco LEO</strong> estarán disponibles durante el primer
                    trimestre del ciclo escolar.
                </p>
            </div>
        `;
    },

    /* ===== NAVEGACIÓN ENTRE MOMENTOS ===== */
    renderNavegacion() {
        return `
            <div class="navegacion-momentos">
                <button class="btn btn-secundario" disabled>
                    <i class="fas fa-arrow-left"></i> Anterior
                </button>
                <button class="btn btn-primario" id="btn-siguiente-momento">
                    Siguiente <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
    },

    /* ===== EVENTOS ===== */
    attachEventos() {
        // Checkboxes
        document.querySelectorAll('.momento0-item input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const categoria = e.target.dataset.categoria;
                const item = this.insumos[categoria].find(i => i.id === id);
                if (item) {
                    item.listo = e.target.checked;
                    e.target.closest('.momento0-item').classList.toggle('listo', item.listo);
                }
            });
        });

        // Guardar
        const btnGuardar = document.getElementById('btn-guardar-momento0');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                this.guardarEstado();
                if (window.App) App.mostrarToast('Estado de preparación guardado.', 'exito');
            });
        }

        // Marcar todo
        const btnMarcarTodo = document.getElementById('btn-marcar-todo-momento0');
        if (btnMarcarTodo) {
            btnMarcarTodo.addEventListener('click', () => {
                Object.keys(this.insumos).forEach(cat => {
                    this.insumos[cat].forEach(item => item.listo = true);
                });
                this.guardarEstado();
                this.render();
                if (window.App) App.mostrarToast('Todos los insumos marcados como listos.', 'exito');
            });
        }

        // Siguiente (con verificación robusta)
        const btnSiguiente = document.getElementById('btn-siguiente-momento');
        if (btnSiguiente) {
            btnSiguiente.addEventListener('click', () => {
                console.log('👉 Clic en Siguiente desde Momento 0');
                if (window.App && typeof window.App.cambiarMomento === 'function') {
                    window.App.cambiarMomento(1);
                } else {
                    console.error('❌ App.cambiarMomento no está disponible');
                }
            });
        }
    },

    /* ========================================================
       GUARDAR ESTADO (en localStorage, clave propia)
       ======================================================== */
    guardarEstado() {
        try {
            localStorage.setItem(this.CLAVE_LS, JSON.stringify({
                insumos: this.insumos,
                fechaGuardado: new Date().toISOString()
            }));
            console.log('💾 MOMENTO0: estado guardado');
            return true;
        } catch (e) {
            console.error('⚠️ MOMENTO0: no se pudo guardar:', e);
            return false;
        }
    },

    /* ========================================================
       CARGAR ESTADO (desde localStorage)
       Fusiona lo guardado sobre la estructura base,
       para que si agregamos insumos nuevos no se pierdan.
       ======================================================== */
    cargarEstado() {
        try {
            const crudo = localStorage.getItem(this.CLAVE_LS);
            if (!crudo) {
                console.log('ℹ️ MOMENTO0: sin datos previos, estado en blanco');
                return false;
            }

            const guardado = JSON.parse(crudo);
            const insumosGuardados = guardado && guardado.insumos;
            if (!insumosGuardados || typeof insumosGuardados !== 'object') {
                return false;
            }

            // Merge: mantener la estructura base, sobreescribir solo "listo"
            Object.keys(this.insumos).forEach(cat => {
                const base = this.insumos[cat];
                const previo = Array.isArray(insumosGuardados[cat]) ? insumosGuardados[cat] : [];
                base.forEach(item => {
                    const match = previo.find(p => p && p.id === item.id);
                    if (match) {
                        item.listo = !!match.listo;
                    }
                });
            });

            console.log('✅ MOMENTO0: estado cargado desde localStorage');
            return true;

        } catch (e) {
            console.error('⚠️ MOMENTO0: no se pudo cargar:', e);
            return false;
        }
    }
};

/* ============================================================
   EXPOSICIÓN A WINDOW (ya se hace al inicio con window.Momento0,
   este bloque es solo por consistencia y log)
   ============================================================ */
if (typeof window !== 'undefined') {
    console.log('✅ MOMENTO0 expuesto en window (v2.0)');
}
